/* Charts for the industrial decarbonisation page: the IBS data-quality check, and industrial estates in West Java.
   Data: window.DATA_DEKARB (dekarbonisasi-grafik-data.js), window.PETA_JABAR (jabar-peta-data.js). Helpers: stream-alat.js. */
(function(){
  var D = window.DATA_DEKARB, A = window.ALAT;
  if (!D || !A) return;
  var el = A.el, angka = A.angka;
  var STATUS = {HIJAU: ['var(--sk-hijau)', 'Usable as a trend'], KUNING: ['var(--sk-kuning)', 'Use with care'], MERAH: ['var(--sk-merah)', 'Break: within-year comparison only']};

  /* ------------------------------------------------ 1. electricity at the same plants, year on year, against their employment */
  (function(){
    var W = A.lebar('grafik-rapor'), H = 300, c = A.siapkan('grafik-rapor', W, H, 'Year-on-year change in electricity bought by the same manufacturing plants, and in their median employment, 2001–2015');
    if (!c) return;
    var seri = D.seri.filter(function(d){ return d.listrik != null; });
    var m = {l: 44, r: 8, t: 12, b: 30}, ylo = -50, yhi = 100, n = seri.length, lb = (W - m.l - m.r) / n;
    function sy(v){ return m.t + (yhi - v) / (yhi - ylo) * (H - m.t - m.b); }
    for (var v = ylo; v <= yhi; v += 25){
      el('line', {x1: m.l, x2: W - m.r, y1: sy(v), y2: sy(v), 'class': v === 0 ? 'gr-nol' : 'gn-kisi'}, c.svg);
      el('text', {x: m.l - 6, y: sy(v) + 4, 'class': 'gn-angka', 'text-anchor': 'end'}, c.svg, (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v) + '%');
    }
    seri.forEach(function(d, i){
      var x = m.l + i * lb, y = sy(Math.max(d.listrik, 0)), h = Math.abs(sy(d.listrik) - sy(0)), s = STATUS[d.st];
      var r = el('rect', {x: x + lb * .18, y: y, width: lb * .64, height: Math.max(h, 1), fill: s[0], rx: 1.5}, c.svg);
      r.__tip = '<b>' + d.th + '</b><span>' + s[1] + '</span><dl><dt>Electricity, same plants</dt><dd>' + (d.listrik > 0 ? '+' : '') + angka(d.listrik, 1) + '%</dd><dt>Median employment</dt><dd>' + (d.pekerja === 1 ? 'no change' : angka((d.pekerja - 1) * 100, 1) + '%') + '</dd><dt>Plants matched</dt><dd>' + angka(d.cocok) + '</dd></dl>';
      el('circle', {cx: x + lb / 2, cy: sy((d.pekerja - 1) * 100), r: 3.5, fill: 'var(--ink-1)', 'pointer-events': 'none'}, c.svg);
      if (i % (W < 500 ? 2 : 1) === 0 || d.st === 'MERAH') el('text', {x: x + lb / 2, y: H - 10, 'class': 'gn-angka', 'text-anchor': 'middle'}, c.svg, W < 500 ? "'" + String(d.th).slice(2) : d.th);
    });
    A.kunci(c.akar, [[STATUS.HIJAU[0], STATUS.HIJAU[1]], [STATUS.KUNING[0], STATUS.KUNING[1]], [STATUS.MERAH[0], STATUS.MERAH[1]], ['var(--ink-1)', 'Median employment at the same plants', 'bulat']]);
  })();

  /* ------------------------------------------------ 2. West Java: industrial estates and the special economic zone */
  (function(){
    var m = A.petaJabar('peta-kawasan', 'Industrial estates and special economic zones in West Java');
    if (!m) return;
    m.warnai(function(){ return 'var(--pj-isi)'; }, function(k, n){ return '<b>' + n + '</b>'; });
    var MASA = [[0, 1999, 'var(--pj-5)', 'Before 2000'], [2000, 2015, 'var(--pj-3)', '2000–2015'], [2016, 9999, 'var(--bb-G)', 'After 2015']];
    function masa(th){ for (var i = 0; i < MASA.length; i++) if (th >= MASA[i][0] && th <= MASA[i][1]) return MASA[i]; return MASA[0]; }
    D.kawasan.forEach(function(k){
      var p = el('circle', {cx: k.x, cy: k.y, r: Math.max(3, Math.sqrt(k.ha) / 3), 'class': 'pj-titik', fill: masa(k.th || 0)[2]}, m.atas);
      p.__tip = '<b>' + k.nm + '</b><span>' + k.lok + '</span><dl><dt>Area</dt><dd>' + angka(k.ha) + ' ha</dd><dt>Started</dt><dd>' + (k.th || 'not recorded') + '</dd></dl>';
    });
    D.kek.forEach(function(k){
      var p = el('circle', {cx: k.x, cy: k.y, r: 8, 'class': 'pj-kek'}, m.atas);
      p.__tip = '<b>' + k.nm + '</b><span>' + k.kab + '</span><dl><dt>Special economic zone</dt><dd>set up ' + k.th + '</dd></dl>';
    });
    A.kunci(m.akar, MASA.map(function(x){ return [x[2], 'Estate started ' + x[3].replace('Before', 'before').replace('After', 'after'), 'bulat']; }).concat([['none', 'Special economic zone', 'cincin']]));
  })();
})();
