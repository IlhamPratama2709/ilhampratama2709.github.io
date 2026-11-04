/* Small charts for the stranded assets page: coal and palm oil assets by province, people on fast-sinking ground by district.
   Data: window.DATA_STRANDED (stranded-grafik-data.js). Helpers follow semarang-grafik.js. */
(function(){
  var D = window.DATA_STRANDED;
  if (!D) return;
  var NS = 'http://www.w3.org/2000/svg';
  function el(nama, atribut, induk, teks){
    var e = document.createElementNS(NS, nama);
    for (var k in atribut) e.setAttribute(k, atribut[k]);
    if (teks != null) e.textContent = teks;
    if (induk) induk.appendChild(e);
    return e;
  }
  function angka(v, n){ return v.toLocaleString('en-GB', {minimumFractionDigits: n || 0, maximumFractionDigits: n || 0}); }
  /* one tooltip per chart; marks carry their text in __tip */
  function pasang(akar, svg){
    var tip = document.createElement('div'); tip.className = 'peta-tip'; tip.hidden = true; akar.appendChild(tip);
    function tampil(e){
      var t = e.target.__tip;
      if (!t){ tip.hidden = true; return; }
      tip.innerHTML = t; tip.hidden = false;
      var b = akar.getBoundingClientRect(), kiri = e.clientX - b.left + 12, atas = e.clientY - b.top + 12;
      if (kiri + tip.offsetWidth > b.width) kiri = Math.max(4, e.clientX - b.left - tip.offsetWidth - 12);
      if (atas + tip.offsetHeight > b.height) atas = Math.max(4, e.clientY - b.top - tip.offsetHeight - 12);
      tip.style.left = kiri + 'px'; tip.style.top = atas + 'px';
    }
    svg.addEventListener('pointermove', function(e){ if (e.pointerType !== 'touch') tampil(e); });
    svg.addEventListener('click', tampil);
    svg.addEventListener('pointerleave', function(){ tip.hidden = true; });
  }
  function siapkan(id, W, H, label){
    var akar = document.getElementById(id);
    if (!akar) return null;
    akar.classList.add('grafik');
    var svg = el('svg', {viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': label, 'class': 'grafik-svg'});
    akar.appendChild(svg);
    pasang(akar, svg);
    return {akar: akar, svg: svg};
  }
  function tombol(akar, pilihan, awal, ubah){
    var g = document.createElement('div'); g.className = 'sy-pilih grafik-pilih'; g.setAttribute('role', 'group');
    g.innerHTML = pilihan.map(function(p){ return '<button type="button" data-k="' + p[0] + '" aria-pressed="' + (p[0] === awal) + '">' + p[1] + '</button>'; }).join('');
    g.addEventListener('click', function(e){
      var b = e.target.closest('button'); if (!b) return;
      g.querySelectorAll('button').forEach(function(x){ x.setAttribute('aria-pressed', x === b); });
      ubah(b.dataset.k);
    });
    akar.insertBefore(g, akar.firstChild);
  }
  /* narrower drawing on phones, so the text keeps a readable size when the SVG scales down */
  function lebar(id){ var e = document.getElementById(id); return e && e.clientWidth && e.clientWidth < 480 ? 380 : 560; }
  function tipProvinsi(d){
    return '<b>' + d.p + '</b><span>' + d.g + '</span><dl><dt>Coal mining sites</dt><dd>' + angka(d.tambang) + '</dd><dt>Coal power</dt><dd>' + angka(d.gw, 1) + ' GW in ' + d.pltu + ' plants</dd>' +
      (d.captive ? '<dt>of which captive</dt><dd>' + angka(d.captive, 1) + ' GW</dd>' : '') + '<dt>Palm oil mills</dt><dd>' + angka(d.pks) + '</dd></dl>';
  }

  /* ------------------------------------------------ 1. coal mines, coal power, and palm oil mills by province, grouped by island */
  (function(){
    var GRUP = [['Kalimantan', 'var(--sa-kal)'], ['Sumatra', 'var(--sa-sum)'], ['Java', 'var(--sa-jawa)'], ['Sulawesi and Maluku', 'var(--sa-sul)'], ['Other', 'var(--sa-lain)']];
    var baris = D.provinsi, tinggi = 19, kepala = 24, H = 8 + GRUP.length * kepala + baris.length * tinggi + 4, W = lebar('grafik-provinsi');
    var c = siapkan('grafik-provinsi', W, H, 'Coal mining sites, coal power capacity, and palm oil mills by province, grouped by island');
    if (!c) return;
    var UKUR = {
      tambang: {total: D.total.tambang, satuan: function(v){ return angka(v); }, nama: 'coal mining sites'},
      gw: {total: D.total.gw, satuan: function(v){ return angka(v, 1) + ' GW'; }, nama: 'of coal power capacity'},
      pks: {total: D.total.pks, satuan: function(v){ return angka(v); }, nama: 'palm oil mills'}
    };
    var ukur = 'tambang', kunci = document.createElement('div'); kunci.className = 'gn-kunci';
    function gambar(){
      c.svg.textContent = '';
      var u = UKUR[ukur], x0 = W < 500 ? 128 : 150, x1 = W - 60, y = 8, maks = 0;
      baris.forEach(function(d){ maks = Math.max(maks, d[ukur]); });
      GRUP.forEach(function(g){
        var isi = baris.filter(function(d){ return d.g === g[0]; });
        if (!isi.length) return;
        /* group shares count every province on the island, including those folded into "Other provinces" */
        el('text', {x: 0, y: y + 16, 'class': 'sa-grup'}, c.svg, g[0] === 'Other' ? 'Other' : g[0] + ' · ' + angka(D.grup[ukur][g[0]], D.grup[ukur][g[0]] < 1 ? 1 : 0) + '% of total');
        y += kepala;
        isi.forEach(function(d){
          var w = d[ukur] / maks * (x1 - x0), cap = ukur === 'gw' ? d.captive / maks * (x1 - x0) : 0;
          el('text', {x: x0 - 8, y: y + 13, 'class': 'gr-kecil', 'text-anchor': 'end'}, c.svg, d.p);
          var bg = el('rect', {x: 0, y: y, width: W, height: tinggi, fill: 'transparent'}, c.svg); bg.__tip = tipProvinsi(d);
          var r = el('rect', {x: x0, y: y + 3, width: Math.max(w - cap, 0), height: tinggi - 6, fill: g[1], rx: 1.5}, c.svg); r.__tip = bg.__tip;
          if (cap > 0){ var rc = el('rect', {x: x0 + w - cap, y: y + 3, width: cap, height: tinggi - 6, fill: 'var(--sa-captive)', rx: 1.5}, c.svg); rc.__tip = bg.__tip; }
          if (d[ukur] > 0) el('text', {x: x0 + w + 5, y: y + 13, 'class': 'gr-kecil'}, c.svg, u.satuan(d[ukur]));
          y += tinggi;
        });
      });
      kunci.innerHTML = '<span>Total: ' + u.satuan(u.total) + ' ' + u.nama + (ukur === 'gw' ? ' in ' + D.total.pltu + ' plants' : '') + '</span>' +
        (ukur === 'gw' ? '<span><i style="background:var(--sa-captive)"></i>Captive plants for smelters and industry, ' + angka(D.total.captive_gw, 1) + ' GW</span>' : '');
    }
    tombol(c.akar, [['tambang', 'Coal mines'], ['gw', 'Coal power'], ['pks', 'Palm oil mills']], ukur, function(k){ ukur = k; gambar(); });
    c.akar.appendChild(kunci);
    gambar();
  })();

  /* ------------------------------------------------ 2. people on ground sinking faster than 5 cm a year, 11 districts */
  (function(){
    var KEL = {bandung: ['Bandung basin', 'var(--sa-sul)'], pantura: ['North coast of Central Java', 'var(--sa-jawa)'], lain: ['Elsewhere', 'var(--sa-lain)']};
    var tinggi = 28, W = lebar('grafik-turun'), H = 6 + D.turun.length * tinggi;
    var c = siapkan('grafik-turun', W, H, 'Residents living on ground sinking faster than 5 cm a year, 11 districts of Java');
    if (!c) return;
    var x0 = W < 500 ? 118 : 132, x1 = W - 52, maks = D.turun[0].jiwa, total = 0, perKel = {};
    D.turun.forEach(function(d){ total += d.jiwa; perKel[d.k] = (perKel[d.k] || 0) + d.jiwa; });
    D.turun.forEach(function(d, i){
      var y = 4 + i * tinggi, w = d.jiwa / maks * (x1 - x0);
      el('text', {x: x0 - 8, y: y + 17, 'class': 'gr-label', 'text-anchor': 'end'}, c.svg, d.n);
      var r = el('rect', {x: x0, y: y + 4, width: Math.max(w, 1.5), height: tinggi - 8, fill: KEL[d.k][1], rx: 2}, c.svg);
      r.__tip = '<b>' + d.n + '</b><span>' + d.prov + ' · ' + KEL[d.k][0] + '</span><dl><dt>Residents on fast-sinking ground</dt><dd>' + angka(d.jiwa) + '</dd><dt>Share of district</dt><dd>' + angka(d.jiwa / d.total * 100) + '%</dd><dt>Villages</dt><dd>' + d.desa5 + ' of ' + d.desa + '</dd><dt>Area</dt><dd>' + angka(d.ha) + ' ha</dd></dl>';
      el('text', {x: x0 + w + 6, y: y + 17, 'class': 'gr-kecil'}, c.svg, d.jiwa >= 1e4 ? angka(d.jiwa / 1000) + 'k' : angka(d.jiwa / 1000, 1) + 'k');
    });
    var k = document.createElement('div'); k.className = 'gn-kunci';
    k.innerHTML = Object.keys(KEL).map(function(n){ return '<span><i style="background:' + KEL[n][1] + '"></i>' + KEL[n][0] + ', ' + angka(perKel[n] / total * 100) + '%</span>'; }).join('');
    c.akar.appendChild(k);
  })();
})();
