/* Small charts for the Semarang page: exposed buildings, Sayung vs Genuk, population vs distance, property tax.
   Data: window.DATA_GRAFIK (semarang-grafik-data.js). Each chart sits in a .duo block with its text beside it. */
(function(){
  var D = window.DATA_GRAFIK;
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

  /* ------------------------------------------------ 1. buildings on sinking ground, 100% bars */
  (function(){
    var W = 560, H = 150, c = siapkan('grafik-bangunan', W, H, 'Share of buildings by subsidence rate, Kota Semarang and Kab. Demak');
    if (!c) return;
    var BAG = [['turun5', 'Sinking > 5 cm a year', '#b8302f'], ['turun1_5', '1 to 5 cm', '#f3b1ae'], ['diam', 'Under 1 cm', 'var(--peta-netral)'], ['tak', 'No radar point nearby', 'var(--peta-kosong)']];
    var x0 = 112, x1 = W - 8;
    D.bangunan.slice().sort(function(a, b){ return a.kab < b.kab ? 1 : -1; }).forEach(function(d, i){
      var y = 14 + i * 56, x = x0;
      el('text', {x: x0 - 10, y: y + 18, 'class': 'gr-label', 'text-anchor': 'end'}, c.svg, d.kab);
      el('text', {x: x0 - 10, y: y + 34, 'class': 'gr-kecil', 'text-anchor': 'end'}, c.svg, angka(d.total / 1000) + 'k buildings');
      BAG.forEach(function(b){
        var w = d[b[0]] / d.total * (x1 - x0);
        var r = el('rect', {x: x + 1, y: y, width: Math.max(0, w - 2), height: 40, fill: b[2], rx: 2}, c.svg);
        r.__tip = '<b>' + d.kab + '</b><span>' + b[1] + '</span><dl><dt>Buildings</dt><dd>' + angka(d[b[0]]) + '</dd><dt>Share</dt><dd>' + angka(d[b[0]] / d.total * 100) + '%</dd></dl>';
        if (w > 44) el('text', {x: x + w / 2, y: y + 25, 'class': b[0] === 'turun5' ? 'gr-isi terang' : 'gr-isi', 'text-anchor': 'middle'}, c.svg, angka(d[b[0]] / d.total * 100) + '%');
        x += w;
      });
    });
    var k = document.createElement('div'); k.className = 'gn-kunci';
    k.innerHTML = BAG.map(function(b){ return '<span><i style="background:' + b[2] + '"></i>' + b[1] + '</span>'; }).join('');
    c.akar.appendChild(k);
  })();

  /* ------------------------------------------------ 2. Sayung vs Genuk: settlement lost and built */
  (function(){
    var W = 560, H = 200, c = siapkan('grafik-sayung-genuk', W, H, 'Settlement area lost and newly built, Sayung and Genuk');
    if (!c) return;
    var periode = '0024';
    function gambar(){
      c.svg.textContent = '';
      var maks = 0;
      ['Sayung', 'Genuk'].forEach(function(n){ maks = Math.max(maks, D.sayungGenuk[n]['hilang' + periode], D.sayungGenuk[n]['baru' + periode]); });
      maks = Math.ceil(maks / 100) * 100;
      var m = {l: 46, r: 10, t: 12, b: 34}, y = function(v){ return m.t + (1 - v / maks) * (H - m.t - m.b); };
      for (var v = 0; v <= maks; v += maks / 4){
        el('line', {x1: m.l, x2: W - m.r, y1: y(v), y2: y(v), 'class': 'gn-kisi'}, c.svg);
        el('text', {x: m.l - 6, y: y(v) + 4, 'class': 'gn-angka', 'text-anchor': 'end'}, c.svg, angka(v));
      }
      el('text', {x: 4, y: 10, 'class': 'gr-kecil'}, c.svg, 'hectares');
      ['Sayung', 'Genuk'].forEach(function(n, i){
        var x = m.l + 30 + i * 250, d = D.sayungGenuk[n];
        [['hilang', 'Settlement lost', 'var(--lc-mukim)'], ['baru', 'Settlement built', '#3a9c92']].forEach(function(b, j){
          var v = d[b[0] + periode], r = el('rect', {x: x + j * 92, y: y(v), width: 80, height: y(0) - y(v), fill: b[2], rx: 2}, c.svg);
          r.__tip = '<b>' + n + '</b><span>' + (periode === '0024' ? '2000–2024' : '2014–2022') + '</span><dl><dt>' + b[1] + '</dt><dd>' + angka(v) + ' ha</dd></dl>';
          el('text', {x: x + j * 92 + 40, y: y(v) - 6, 'class': 'gr-label', 'text-anchor': 'middle'}, c.svg, angka(v));
        });
        el('text', {x: x + 86, y: H - 12, 'class': 'gr-label', 'text-anchor': 'middle'}, c.svg, n === 'Sayung' ? 'Sayung, Demak' : 'Genuk, Kota Semarang');
      });
    }
    tombol(c.akar, [['0024', '2000–2024'], ['1422', '2014–2022']], periode, function(k){ periode = k; gambar(); });
    var k = document.createElement('div'); k.className = 'gn-kunci';
    k.innerHTML = '<span><i style="background:var(--lc-mukim)"></i>Settlement lost</span><span><i style="background:#3a9c92"></i>Settlement newly built</span>';
    c.akar.appendChild(k);
    gambar();
  })();

  /* ------------------------------------------------ 3. population change vs distance from Simpang Lima */
  (function(){
    var W = 560, H = 330, c = siapkan('grafik-penduduk', W, H, 'Change in registered population 2021–2025 against distance from Simpang Lima, 177 villages of Kota Semarang');
    if (!c) return;
    var m = {l: 46, r: 12, t: 12, b: 40}, xm = 18, ylo = -10, yhi = 40;
    function sx(v){ return m.l + v / xm * (W - m.l - m.r); }
    function sy(v){ return m.t + (yhi - Math.max(ylo, Math.min(yhi, v))) / (yhi - ylo) * (H - m.t - m.b); }
    for (var v = ylo; v <= yhi; v += 10){
      el('line', {x1: m.l, x2: W - m.r, y1: sy(v), y2: sy(v), 'class': v === 0 ? 'gr-nol' : 'gn-kisi'}, c.svg);
      el('text', {x: m.l - 6, y: sy(v) + 4, 'class': 'gn-angka', 'text-anchor': 'end'}, c.svg, (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v) + '%');
    }
    for (var x = 0; x <= xm; x += 3) el('text', {x: sx(x), y: H - m.b + 18, 'class': 'gn-angka', 'text-anchor': 'middle'}, c.svg, x);
    el('text', {x: (m.l + W - m.r) / 2, y: H - 4, 'class': 'gn-sumbu', 'text-anchor': 'middle'}, c.svg, 'Distance from Simpang Lima, km');
    D.penduduk.forEach(function(d){
      var turun = d.laju != null && d.laju < -1;
      var t = el('circle', {cx: sx(d.jarak), cy: sy(d.ubah), r: 5, 'class': 'gr-titik' + (turun ? ' turun' : '')}, c.svg);
      t.__tip = '<b>' + d.n + '</b><span>' + d.kc + '</span><dl><dt>Distance</dt><dd>' + angka(d.jarak, 1) + ' km</dd><dt>Residents</dt><dd>' + angka(d.p21) + ' → ' + angka(d.p25) + '</dd><dt>Change</dt><dd>' + (d.ubah > 0 ? '+' : '') + angka(d.ubah, 1) + '%' + (d.ubah > yhi || d.ubah < ylo ? ' (off scale)' : '') + '</dd><dt>Ground</dt><dd>' + (d.laju < 0 ? 'sinking ' + angka(-d.laju, 1) : 'rising ' + angka(d.laju, 1)) + ' cm/yr</dd></dl>';
    });
    var k = document.createElement('div'); k.className = 'gn-kunci';
    k.innerHTML = '<span><i class="gn-penuh" style="background:#b8302f"></i>Sinking faster than 1 cm a year</span><span><i class="gn-penuh" style="background:var(--ink-3)"></i>Slower or stable</span>';
    c.akar.appendChild(k);
  })();

  /* ------------------------------------------------ 4. property tax in real terms, 2018 = 100 */
  (function(){
    var W = 560, H = 300, c = siapkan('grafik-pajak', W, H, 'Property tax revenue in real terms, index 2018 = 100');
    if (!c) return;
    var WARNA = {'Kab. Kendal': '#2a8a6a', 'Kota Semarang': '#286bbb', 'Kab. Demak': '#c05917'};
    var jenis = 'pbb';
    function gambar(){
      c.svg.textContent = '';
      var m = {l: 42, r: 112, t: 12, b: 30}, th = [2018, 2024], kunci = jenis + 'I', maks = 0;
      D.pajak.forEach(function(d){ maks = Math.max(maks, d[kunci]); });
      maks = Math.ceil(maks / 50) * 50;
      var sx = function(t){ return m.l + (t - th[0]) / (th[1] - th[0]) * (W - m.l - m.r); };
      var sy = function(v){ return m.t + (1 - v / maks) * (H - m.t - m.b); };
      for (var v = 0; v <= maks; v += 50){
        el('line', {x1: m.l, x2: W - m.r, y1: sy(v), y2: sy(v), 'class': v === 100 ? 'gr-nol' : 'gn-kisi'}, c.svg);
        el('text', {x: m.l - 6, y: sy(v) + 4, 'class': 'gn-angka', 'text-anchor': 'end'}, c.svg, v);
      }
      for (var t = th[0]; t <= th[1]; t += 2) el('text', {x: sx(t), y: H - 8, 'class': 'gn-angka', 'text-anchor': 'middle'}, c.svg, t);
      var akhir = [];
      Object.keys(WARNA).forEach(function(kab){
        var s = D.pajak.filter(function(d){ return d.kab === kab; }).sort(function(a, b){ return a.th - b.th; });
        el('path', {d: s.map(function(d, i){ return (i ? 'L' : 'M') + sx(d.th) + ' ' + sy(d[kunci]); }).join(''), fill: 'none', stroke: WARNA[kab], 'stroke-width': 2.5, 'stroke-linejoin': 'round'}, c.svg);
        s.forEach(function(d){
          var p = el('circle', {cx: sx(d.th), cy: sy(d[kunci]), r: 6, fill: WARNA[kab], stroke: 'var(--bg-page)', 'stroke-width': 2}, c.svg);
          p.__tip = '<b>' + kab + ', ' + d.th + '</b><span>' + (jenis === 'pbb' ? 'PBB-P2' : 'BPHTB') + '</span><dl><dt>Nominal</dt><dd>Rp' + angka(d[jenis], 1) + ' billion</dd><dt>Real index</dt><dd>' + angka(d[kunci]) + '</dd></dl>';
        });
        akhir.push({kab: kab, y: sy(s[s.length - 1][kunci])});
      });
      akhir.sort(function(a, b){ return a.y - b.y; });
      for (var i = 1; i < akhir.length; i++) if (akhir[i].y - akhir[i - 1].y < 16) akhir[i].y = akhir[i - 1].y + 16;
      akhir.forEach(function(a){ el('text', {x: W - m.r + 10, y: a.y + 4, 'class': 'gr-label', fill: WARNA[a.kab]}, c.svg, a.kab); });
    }
    tombol(c.akar, [['pbb', 'PBB-P2 (land and building tax)'], ['bphtb', 'BPHTB (transfer tax)']], jenis, function(k){ jenis = k; gambar(); });
    gambar();
  })();
})();
