/* Two figures for the Semarang page: land cover in Sayung (2000/2024) and GNSS stations vs radar estimates.
   Data: window.DATA_SAYUNG_GNSS (sayung-gnss-data.js). */
(function(){
  var D = window.DATA_SAYUNG_GNSS;
  if (!D) return;
  var NS = 'http://www.w3.org/2000/svg';
  function el(nama, atribut, induk){
    var e = document.createElementNS(NS, nama);
    for (var k in atribut) e.setAttribute(k, atribut[k]);
    if (induk) induk.appendChild(e);
    return e;
  }
  function angka(v, n){ return v.toLocaleString('en-GB', {minimumFractionDigits: n || 0, maximumFractionDigits: n || 0}); }
  function tempelTip(bingkai, tip, x, y){
    tip.hidden = false;
    var b = bingkai.getBoundingClientRect(), lt = tip.offsetWidth, tt = tip.offsetHeight;
    var kiri = x - b.left + 14, atas = y - b.top + 14;
    if (kiri + lt > b.width) kiri = Math.max(4, x - b.left - lt - 14);
    if (atas + tt > b.height) atas = Math.max(4, y - b.top - tt - 14);
    tip.style.left = kiri + 'px'; tip.style.top = atas + 'px';
  }

  /* ---------------------------------------------------------------- Sayung */
  (function(){
    var akar = document.getElementById('peta-sayung');
    if (!akar) return;
    var S = D.sayung;
    var KELAS = {1: ['var(--lc-mukim)', 'Settlement'], 2: ['var(--lc-tambak)', 'Aquaculture ponds'], 3: ['var(--lc-air)', 'Water'],
                 4: ['var(--lc-mangrove)', 'Mangrove'], 5: ['var(--lc-lain)', 'Farmland and other vegetation']};
    var tahun = '2024';

    function cincin(g){ return g.type === 'Polygon' ? [g.coordinates] : g.coordinates; }
    /* Same frame as the satellite images above, Genuk to Sayung */
    var x0 = S.bbox[0], y0 = S.bbox[1], x1 = S.bbox[2], y1 = S.bbox[3];
    var kos = Math.cos((y0 + y1) / 2 * Math.PI / 180), L = 900, tepi = 8;
    var sk = (L - 2 * tepi) / ((x1 - x0) * kos), T = Math.round((y1 - y0) * sk + 2 * tepi);
    function f(c){ return (tepi + (c[0] - x0) * kos * sk).toFixed(1) + ' ' + (tepi + (y1 - c[1]) * sk).toFixed(1); }
    function jalur(g){ return cincin(g).map(function(p){ return p.map(function(r){ return 'M' + r.map(f).join('L') + 'Z'; }).join(''); }).join(''); }

    akar.innerHTML =
      '<div class="sy-kendali"><span>Land cover in</span><div class="sy-pilih" role="group" aria-label="Year">' +
        '<button type="button" data-th="2000">2000</button><button type="button" data-th="2024">2024</button></div></div>' +
      '<div class="sy-isi"><div class="sy-bingkai"><svg class="sy-svg" role="img" viewBox="0 0 ' + L + ' ' + T + '"></svg><div class="peta-tip" hidden></div></div>' +
      '<div class="sy-panel"><div class="peta-kunci sy-kunci"></div><div><b class="sy-judul-batang">Share of village area no longer mapped as land, Sayung</b><div class="sy-batang"></div></div></div></div>';
    var svg = akar.querySelector('svg'), tip = akar.querySelector('.peta-tip'), bingkai = akar.querySelector('.sy-bingkai');
    el('defs', {}, svg).innerHTML = '<pattern id="sy-arsir" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" fill="var(--lc-hilang)"/><line x1="0" y1="0" x2="0" y2="7" stroke="var(--lc-air)" stroke-width="2.4"/></pattern>';
    var gDasar = el('g', {}, svg), gLahan = el('g', {}, svg), gDesa = el('g', {}, svg), gNama = el('g', {}, svg);
    /* village area first: whatever land cover does not cover is the area no longer mapped as land */
    S.desa.forEach(function(d){ el('path', {d: jalur(d.g), fill: 'url(#sy-arsir)'}, gDasar); });
    S.desa.forEach(function(d){
      var p = el('path', {d: jalur(d.g), 'class': 'sy-desa'}, gDesa); p.__d = d;
      if (d.pct > 4 && d.kec.indexOf('Sayung') === 0){ var q = f(d.lbl).split(' '); el('text', {x: q[0], y: q[1], 'class': 'sy-nama'}, gNama).textContent = d.n; }
    });
    [['GENUK', 110.462, -6.951], ['SAYUNG', 110.537, -6.950]].forEach(function(k){
      var q = f([k[1], k[2]]).split(' ');
      el('text', {x: q[0], y: q[1], 'class': 'sy-kec'}, gNama).textContent = k[0];
    });
    function gambar(){
      gLahan.textContent = '';
      S.lapisan[tahun].forEach(function(l){ el('path', {d: jalur(l.g), fill: KELAS[l.k][0]}, gLahan); });
      svg.setAttribute('aria-label', 'Land cover in Sayung, Demak, ' + tahun + ', with village boundaries');
      akar.querySelectorAll('[data-th]').forEach(function(b){ b.setAttribute('aria-pressed', b.dataset.th === tahun); });
    }
    akar.querySelector('.sy-kunci').innerHTML = '<b>Land cover (MapBiomas)</b>' +
      Object.keys(KELAS).map(function(k){ return '<span><i style="background:' + KELAS[k][0] + '"></i>' + KELAS[k][1] + '</span>'; }).join('') +
      '<span><i class="arsir"></i>No longer mapped as land</span>';
    var pesisir = S.desa.filter(function(d){ return d.pct > 4 && d.kec.indexOf('Sayung') === 0; }).sort(function(a, b){ return b.pct - a.pct; });
    akar.querySelector('.sy-batang').innerHTML = pesisir.map(function(d){
      return '<div><span>' + d.n + '</span><i><b style="width:' + d.pct + '%"></b></i><em>' + d.pct + '%</em></div>';
    }).join('');

    function tampil(p, x, y){
      var d = p.__d;
      gDesa.querySelectorAll('path').forEach(function(j){ j.classList.toggle('aktif', j === p); });
      tip.innerHTML = '<b>' + d.n + '</b><span>' + d.kec + '</span><dl>' +
        (d.adm != null ? '<dt>Village area</dt><dd>' + angka(d.adm) + ' ha</dd><dt>No longer land</dt><dd>' + angka(d.hilang) + ' ha (' + d.pct + '%)</dd>' : '') + '</dl>';
      tempelTip(bingkai, tip, x, y);
    }
    function sembunyi(){ tip.hidden = true; gDesa.querySelectorAll('path').forEach(function(j){ j.classList.remove('aktif'); }); }
    svg.addEventListener('pointermove', function(e){ if (e.pointerType === 'touch') return; if (e.target.__d) tampil(e.target, e.clientX, e.clientY); else sembunyi(); });
    svg.addEventListener('pointerleave', function(e){ if (e.pointerType !== 'touch') sembunyi(); });
    svg.addEventListener('click', function(e){ if (e.target.__d) tampil(e.target, e.clientX, e.clientY); else sembunyi(); });
    akar.addEventListener('click', function(e){ var b = e.target.closest('[data-th]'); if (b){ tahun = b.dataset.th; gambar(); } });
    gambar();
  })();

  /* ---------------------------------------------------------------- satellite before/after */
  (function(){
    var akar = document.getElementById('banding-citra');
    if (!akar) return;
    var geser = akar.querySelector('input'), atas = akar.querySelector('.banding-atas'), garis = akar.querySelector('.banding-garis');
    function atur(){ var v = geser.value; atas.style.clipPath = 'inset(0 ' + (100 - v) + '% 0 0)'; garis.style.left = v + '%'; }
    geser.addEventListener('input', atur);
    atur();
  })();

  /* ---------------------------------------------------------------- GNSS vs radar */
  (function(){
    var akar = document.getElementById('grafik-gnss');
    if (!akar) return;
    var W = 640, H = 440, m = {l: 58, r: 16, t: 14, b: 50}, lo = -13, hi = 3;
    function sx(v){ return m.l + (v - lo) / (hi - lo) * (W - m.l - m.r); }
    function sy(v){ return m.t + (hi - v) / (hi - lo) * (H - m.t - m.b); }
    akar.innerHTML = '<div class="gn-bingkai"><svg class="gn-svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Scatter plot of subsidence rates at ' + D.gnss.length + ' GNSS stations against radar estimates within 500 metres"></svg><div class="peta-tip" hidden></div></div>' +
      '<div class="peta-kunci gn-kunci"><span><i class="gn-penuh"></i>Official BIG velocity</span><span><i class="gn-kosong"></i>Trend from a shorter record</span><span><i class="gn-garis"></i>Perfect agreement</span></div>';
    var svg = akar.querySelector('svg'), tip = akar.querySelector('.peta-tip'), bingkai = akar.querySelector('.gn-bingkai');
    for (var v = -12; v <= 2; v += 2){
      el('line', {x1: sx(lo), x2: sx(hi), y1: sy(v), y2: sy(v), 'class': 'gn-kisi'}, svg);
      el('text', {x: m.l - 8, y: sy(v) + 4, 'class': 'gn-angka', 'text-anchor': 'end'}, svg).textContent = v === 0 ? '0' : (v > 0 ? '+' : '−') + Math.abs(v);
      el('text', {x: sx(v), y: H - m.b + 18, 'class': 'gn-angka', 'text-anchor': 'middle'}, svg).textContent = v === 0 ? '0' : (v > 0 ? '+' : '−') + Math.abs(v);
    }
    el('line', {x1: sx(lo), y1: sy(lo), x2: sx(hi), y2: sy(hi), 'class': 'gn-diagonal'}, svg);
    el('text', {x: (m.l + W - m.r) / 2, y: H - 8, 'class': 'gn-sumbu', 'text-anchor': 'middle'}, svg).textContent = 'GNSS station, cm a year';
    el('text', {x: 16, y: (m.t + H - m.b) / 2, 'class': 'gn-sumbu', 'text-anchor': 'middle', transform: 'rotate(-90 16 ' + (m.t + H - m.b) / 2 + ')'}, svg).textContent = 'Radar estimate within 500 m, cm a year';
    var LABEL = {CPKL: 'Pekalongan', CSMG: 'Semarang (Genuk)'};
    D.gnss.forEach(function(t){
      var c = el('circle', {cx: sx(t.gnss), cy: sy(t.radar), r: 5.5, 'class': t.resmi ? 'gn-titik' : 'gn-titik kosong'}, svg); c.__t = t;
      if (LABEL[t.s]) el('text', {x: sx(t.gnss) + 10, y: sy(t.radar) + 4, 'class': 'gn-label'}, svg).textContent = LABEL[t.s];
    });
    function tampil(c, x, y){
      var t = c.__t;
      tip.innerHTML = '<b>' + t.s + '</b><span>' + t.kab + '</span><dl><dt>GNSS</dt><dd>' + angka(t.gnss, 1) + ' cm/yr</dd><dt>Radar</dt><dd>' + angka(t.radar, 1) + ' cm/yr</dd><dt>Source</dt><dd>' + (t.resmi ? 'official BIG velocity' : 'trend, short record') + '</dd></dl>';
      tempelTip(bingkai, tip, x, y);
    }
    svg.addEventListener('pointermove', function(e){ if (e.pointerType === 'touch') return; if (e.target.__t) tampil(e.target, e.clientX, e.clientY); else tip.hidden = true; });
    svg.addEventListener('pointerleave', function(){ tip.hidden = true; });
    svg.addEventListener('click', function(e){ if (e.target.__t) tampil(e.target, e.clientX, e.clientY); else tip.hidden = true; });
  })();
})();
