/* Charts for the growth diagnostics page: capacity by fuel or use, outage hours by province, West Java plant map.
   Data: window.DATA_GROWTH (growth-grafik-data.js), window.PETA_JABAR (jabar-peta-data.js). Helpers: stream-alat.js. */
(function(){
  var D = window.DATA_GROWTH, A = window.ALAT;
  if (!D || !A) return;
  var el = A.el, angka = A.angka;
  var NAMA = {B: 'Coal', G: 'Gas', D: 'Diesel and oil', A: 'Hydro', P: 'Geothermal', M: 'Bioenergy', S: 'Solar', W: 'Wind', U: 'Unknown'};

  /* ------------------------------------------------ 1. operating capacity by fuel, or by who uses it */
  (function(){
    var W = A.lebar('grafik-bahan'), tinggi = 30, H = 6 + D.bahan.length * tinggi;
    var c = A.siapkan('grafik-bahan', W, H, 'Operating power plant capacity in Indonesia by fuel and by use');
    if (!c) return;
    var mode = 'bahan', x0 = W < 500 ? 112 : 132, x1 = W - 70;
    function gambar(){
      c.svg.textContent = '';
      var baris = mode === 'bahan' ? D.bahan : D.guna, maks = baris[0].gw;
      c.svg.setAttribute('viewBox', '0 0 ' + W + ' ' + (6 + baris.length * tinggi));
      baris.forEach(function(d, i){
        var y = 4 + i * tinggi, w = Math.max(d.gw / maks * (x1 - x0), 1.5);
        var warna = mode === 'bahan' ? 'var(--bb-' + d.kode + ')' : (i === 0 ? 'var(--bb-A)' : 'var(--bb-B)');
        el('text', {x: x0 - 8, y: y + 18, 'class': 'gr-label', 'text-anchor': 'end'}, c.svg, d.g);
        var r = el('rect', {x: x0, y: y + 5, width: w, height: tinggi - 10, fill: warna, rx: 2}, c.svg);
        r.__tip = '<b>' + d.g + '</b><dl><dt>Capacity</dt><dd>' + angka(d.gw, 1) + ' GW</dd><dt>Plants</dt><dd>' + angka(d.n) + '</dd><dt>Share</dt><dd>' + angka(d.gw / D.total.gw * 100, 1) + '%</dd></dl>';
        el('text', {x: x0 + w + 6, y: y + 18, 'class': 'gr-kecil'}, c.svg, angka(d.gw, d.gw < 10 ? 1 : 0) + ' GW');
      });
      kunci.innerHTML = mode === 'bahan' ? '<span>Renewables (hydro, geothermal, bioenergy, solar, wind): ' + angka(D.total.tb_pct, 0) + '% of ' + angka(D.total.gw, 1) + ' GW</span>' :
        '<span>Captive plants are built by mines, smelters, and factories for their own use</span>';
    }
    A.tombol(c.akar, [['bahan', 'By fuel'], ['guna', 'By use']], mode, function(k){ mode = k; gambar(); });
    var kunci = A.kunci(c.akar, []);
    gambar();
  })();

  /* ------------------------------------------------ 2. outage hours per customer, by province */
  (function(){
    var W = A.lebar('grafik-saidi'), tinggi = 16, H = 6 + D.saidi.length * tinggi;
    var c = A.siapkan('grafik-saidi', W, H, 'Average outage hours per customer in 2024, by province');
    if (!c) return;
    var x0 = W < 500 ? 120 : 140, x1 = W - 48, maks = D.saidi[0].jam;
    D.saidi.forEach(function(d, i){
      var y = 3 + i * tinggi, w = Math.max(d.jam / maks * (x1 - x0), 1.5);
      el('text', {x: x0 - 8, y: y + 11.5, 'class': 'gr-kecil', 'text-anchor': 'end'}, c.svg, d.p);
      var r = el('rect', {x: x0, y: y + 2, width: w, height: tinggi - 4, fill: d.gab ? 'var(--pj-2)' : 'var(--pj-4)', rx: 1.5}, c.svg);
      r.__tip = '<b>' + d.p + '</b><dl><dt>Outage hours</dt><dd>' + angka(d.jam, 1) + ' a customer</dd><dt>Outages</dt><dd>' + angka(d.kali, 1) + ' a customer</dd></dl>' +
        (d.gab ? '<span>Figure for a PLN unit that covers more than one province</span>' : '');
      el('text', {x: x0 + w + 5, y: y + 11.5, 'class': 'gr-kecil'}, c.svg, angka(d.jam, 1));
    });
    A.kunci(c.akar, [['var(--pj-4)', 'Province figure'], ['var(--pj-2)', 'Shared figure for a PLN unit covering several provinces']]);
  })();

  /* ------------------------------------------------ 3. West Java: capacity by district and the plants behind it */
  (function(){
    var m = A.petaJabar('peta-pembangkit', 'Operating power plants in West Java by district');
    if (!m) return;
    var BATAS = [1, 250, 1000, 2000, 4000];
    function kelas(mw){ for (var i = BATAS.length - 1; i >= 0; i--) if (mw >= BATAS[i]) return 'var(--pj-' + (i + 1) + ')'; return 'var(--pj-isi)'; }
    m.warnai(function(k){ var d = D.jabarKab[k]; return d ? kelas(d.mw) : 'var(--pj-isi)'; }, function(k, n){
      var d = D.jabarKab[k];
      return '<b>' + n + '</b><dl><dt>Capacity</dt><dd>' + (d ? angka(d.mw) + ' MW' : 'none') + '</dd><dt>Plants</dt><dd>' + (d ? d.n : 0) + '</dd>' + (d && d.mw ? '<dt>Renewable</dt><dd>' + angka(d.tb / d.mw * 100) + '%</dd>' : '') + '</dl>';
    });
    D.jabarTitik.forEach(function(t){
      var p = el('circle', {cx: t.x, cy: t.y, r: Math.max(2.2, Math.sqrt(t.mw) / 4), 'class': 'pj-titik', fill: 'var(--bb-' + t.g + ')'}, m.atas);
      p.__tip = '<b>' + t.nm + '</b><span>' + NAMA[t.g] + '</span><dl><dt>Capacity</dt><dd>' + angka(t.mw, t.mw < 10 ? 1 : 0) + ' MW</dd></dl>';
    });
    var dipakai = {}; D.jabarTitik.forEach(function(t){ dipakai[t.g] = 1; });
    A.kunci(m.akar, Object.keys(NAMA).filter(function(g){ return dipakai[g]; }).map(function(g){ return ['var(--bb-' + g + ')', NAMA[g], 'bulat']; }));
    A.kunci(m.akar, [['var(--pj-1)', '1–250 MW'], ['var(--pj-2)', '250–1,000'], ['var(--pj-3)', '1,000–2,000'], ['var(--pj-4)', '2,000–4,000'], ['var(--pj-5)', '4,000 or more'], ['var(--pj-isi)', 'No plant']]);
  })();
})();
