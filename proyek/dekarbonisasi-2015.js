/* 2015 charts for the industrial decarbonisation page: plants by subsector and province, energy cost as a share of
   output per plant, and the energy spending mix by province. Data: window.DATA_DEKARB15 (dekarbonisasi-2015-data.js).
   Helpers: stream-alat.js. */
(function(){
  var D = window.DATA_DEKARB15, A = window.ALAT;
  if (!D || !A) return;
  var el = A.el, angka = A.angka;

  /* ------------------------------------------------ 1. plants by subsector and province, shaded by the row share */
  (function(){
    var akar = document.getElementById('tabel-pabrik'); if (!akar) return;
    var TINGKAT = [[40, .9], [20, .7], [10, .5], [5, .32], [2, .18], [0, .08]];
    function sel(n, tot, kecil){
      if (!n) return '<td class="tp-kosong">–</td>';
      var pct = n / tot * 100, a = TINGKAT.filter(function(t){ return pct >= t[0]; })[0][1];
      return '<td style="background:rgba(42,111,104,' + a + ')' + (a >= .5 ? ';color:#fff' : '') + '" title="' + angka(pct, 1) + '% of the subsector\'s plants">' + angka(n) + (kecil ? '<sup>*</sup>' : '') + '</td>';
    }
    var h = '<table class="tabel-pabrik"><thead><tr><th>Subsector</th>' + D.kolom.map(function(k){ return '<th>' + k + '</th>'; }).join('') + '<th>Indonesia</th></tr></thead><tbody>';
    D.pabrik.forEach(function(r){
      h += '<tr><td>' + r.s + '</td>' + r.n.map(function(n, i){ return sel(n, r.tot, r.kecil[i]); }).join('') + '<td class="tp-jumlah">' + angka(r.tot) + '</td></tr>';
    });
    akar.innerHTML = h + '</tbody></table>';
    akar.insertAdjacentHTML('beforeend', '<div class="gn-kunci">' + [['< 2%', .08], ['2–5%', .18], ['5–10%', .32], ['10–20%', .5], ['20–40%', .7], ['≥ 40%', .9]].map(function(t){ return '<span><i style="background:rgba(42,111,104,' + t[1] + ')"></i>' + t[0] + '</span>'; }).join('') + '</div>');
  })();

  /* ------------------------------------------------ 2. energy cost as a share of output, per plant: p10, p25, median, p75, p90 */
  (function(){
    var W = A.lebar('grafik-biaya'), sempit = W < 500, rb = 30, m = {l: sempit ? 132 : 130, r: sempit ? 44 : 96, t: 6, b: 28};
    var H = m.t + m.b + D.biaya.length * rb, c = A.siapkan('grafik-biaya', W, H, 'Energy cost as a percent of output value per plant, by subsector, 2015');
    if (!c) return;
    var xhi = 35; function sx(v){ return m.l + Math.min(v, xhi) / xhi * (W - m.l - m.r); }
    for (var v = 0; v <= 30; v += sempit ? 10 : 5){
      el('line', {x1: sx(v), x2: sx(v), y1: m.t, y2: H - m.b + 4, 'class': 'gn-kisi'}, c.svg);
      el('text', {x: sx(v), y: H - 8, 'class': 'gn-angka', 'text-anchor': 'middle'}, c.svg, v + '%');
    }
    D.biaya.forEach(function(d, i){
      var y = m.t + i * rb + rb / 2, kaca = d.s === 'Glass and ceramics', warna = kaca ? 'var(--bb-G)' : 'var(--sk-hijau)';
      el('text', {x: m.l - 8, y: y + 4, 'class': 'gn-label', 'text-anchor': 'end'}, c.svg, d.s);
      el('line', {x1: sx(d.p10), x2: sx(d.p90), y1: y, y2: y, stroke: warna, 'stroke-width': 1.5}, c.svg);
      var kotak = el('rect', {x: sx(d.p25), y: y - 9, width: Math.max(sx(d.p75) - sx(d.p25), 2), height: 18, fill: warna, 'fill-opacity': .75, rx: 2}, c.svg);
      el('line', {x1: sx(d.med), x2: sx(d.med), y1: y - 9, y2: y + 9, stroke: 'var(--bg-page)', 'stroke-width': 2.5, 'pointer-events': 'none'}, c.svg);
      el('text', {x: sx(d.p90) + 6, y: y + 4, 'class': 'gn-angka'}, c.svg, angka(d.med, 1) + '%' + (sempit ? '' : ' (n=' + angka(d.n) + ')'));
      kotak.__tip = '<b>' + d.s + '</b><span>' + angka(d.n) + ' plants, 2015</span><dl><dt>Median</dt><dd>' + angka(d.med, 1) + '%</dd><dt>Middle half</dt><dd>' + angka(d.p25, 1) + '–' + angka(d.p75, 1) + '%</dd><dt>10th–90th percentile</dt><dd>' + angka(d.p10, 1) + '–' + angka(d.p90, 1) + '%</dd></dl>';
    });
  })();

  /* ------------------------------------------------ 3. energy spending mix: Indonesia, Java and outside Java, six provinces */
  (function(){
    var W = A.lebar('grafik-bauran'), sempit = W < 500, rb = 30, celah = 12, m = {l: sempit ? 104 : 150, r: 8, t: 4, b: 6};
    var H = m.t + m.b + D.bauran.length * rb + celah * 2, c = A.siapkan('grafik-bauran', W, H, 'Share of energy spending by fuel, six subsectors, 2015');
    if (!c) return;
    var WARNA = {'PLN grid electricity': 'var(--bb-A)', 'Other electricity': 'var(--bb-W)', 'Coal': 'var(--bb-B)', 'Gas': 'var(--bb-G)', 'Diesel': 'var(--bb-S)', 'Other oil fuels': 'var(--bb-D)', 'LPG': 'var(--bb-M)', 'Other': 'var(--bb-U)'};
    var lb = W - m.l - m.r, y = m.t;
    D.bauran.forEach(function(b, i){
      if (i === 1 || i === 3) y += celah;
      el('text', {x: m.l - 8, y: y + rb / 2 + 4, 'class': 'gn-label', 'text-anchor': 'end'}, c.svg, b.w + (sempit ? '' : ' (Rp' + angka(b.rp, 1) + 'T)'));
      var x = m.l;
      D.jenis.forEach(function(j){
        var v = b.j[j] || 0, w = v / 100 * lb; if (w <= 0) return;
        var r = el('rect', {x: x, y: y + 4, width: Math.max(w - 1, .5), height: rb - 8, fill: WARNA[j]}, c.svg);
        r.__tip = '<b>' + b.w + ', 2015</b><span>Rp' + angka(b.rp, 1) + ' trillion' + (b.n ? ' from ' + angka(b.n) + ' plants' : '') + '</span><dl><dt>' + j + '</dt><dd>' + angka(v, 1) + '%</dd></dl>';
        if (w > 26) el('text', {x: x + w / 2, y: y + rb / 2 + 4, 'class': 'gn-angka tp-isi', 'text-anchor': 'middle', 'pointer-events': 'none', style: 'fill:' + (j === 'Diesel' || j === 'Other' ? '#1d2b36' : '#fff')}, c.svg, Math.round(v));
        x += w;
      });
      y += rb;
    });
    A.kunci(c.akar, D.jenis.map(function(j){ return [WARNA[j], j]; }));
  })();
})();
