/* Mini dashboard: land subsidence and related village data, Kendal–Semarang–Demak.
   Data: window.DATA_PENURUNAN (semarang-peta-data.js), one feature per village. */
(function(){
  var D = window.DATA_PENURUNAN, akar = document.getElementById('peta-mini');
  if (!D || !akar) return;
  var nRob = D.tahunRob.length, nBjr = D.tahunBanjir.length;

  var WILAYAH = {
    semarang: {judul: 'Kendal–Semarang–Demak', kab: ['Kab. Kendal', 'Kota Semarang', 'Kab. Demak']}
  };
  function padat(p){ return p.jiwa != null && p.luas ? p.jiwa / p.luas : null; }
  /* Subsidence uses the same classes and colours as the KOMITMEN dashboard: red = sinking, blue = rising */
  var LAPISAN = {
    laju: {nama: 'Land subsidence', judul: 'Land subsidence, cm a year (median, 2017–2023)', nilai: function(p){ return p.laju; },
      batas: [-8, -5, -2, -1, 0.5], warna: ['#6e1a1a', '#b8302f', '#e34948', '#f3b1ae', 'var(--peta-netral)', '#6aa5ec'],
      label: ['Sinking more than 8', '5 to 8', '2 to 5', '1 to 2', 'Nearly stable', 'Rising more than 0.5'], kosong: 'Fewer than 20 radar points'},
    rob: {nama: 'Tidal floods', judul: 'Years with a tidal flood reported, of ' + nRob + ' (PODES, ' + D.tahunRob[0] + '–' + D.tahunRob[nRob - 1] + ')', nilai: function(p){ return p.rob; },
      batas: [1, 2, 4, 6], warna: ['var(--peta-netral)', '#cfe0f8', '#9ec5f4', '#3987e5', '#104281'], label: ['None', '1', '2–3', '4–5', '6–7']},
    banjir: {nama: 'River and rain floods', judul: 'Years with a flood reported, of ' + nBjr + ' (PODES, ' + D.tahunBanjir[0] + '–' + D.tahunBanjir[nBjr - 1] + ')', nilai: function(p){ return p.bjr; },
      batas: [1, 2, 4, 6], warna: ['var(--peta-netral)', '#d6e6df', '#9cc8b4', '#4f9a7d', '#1f5e48'], label: ['None', '1', '2–3', '4–5', '6–7']},
    cahaya: {nama: 'Night-time light', judul: 'Change in night-time light, 2014–2022 (%)', nilai: function(p){ return p.ntl; },
      batas: [0, 50, 150, 300], warna: ['#8a96a3', '#f6e3b4', '#ecc66a', '#cc9e42', '#7d5a12'], label: ['Fell', 'Up to +50', '+50 to +150', '+150 to +300', 'More than +300'], kosong: 'Too dim in 2014'},
    padat: {nama: 'Population density', judul: 'Residents per hectare (WorldPop, 2024)', nilai: padat,
      batas: [5, 20, 50, 100], warna: ['#ece6f4', '#c9b8e0', '#9d82c6', '#6b4ea0', '#3d2768'], label: ['Under 5', '5–20', '20–50', '50–100', '100 or more']}
  };
  var keadaan = {wilayah: 'semarang', lapisan: 'laju'};

  function kelas(k, v){ for (var i = 0; i < k.batas.length; i++) if (v < k.batas[i]) return i; return k.batas.length; }
  function warna(f){
    var k = LAPISAN[keadaan.lapisan], v = k.nilai(f.properties);
    return v == null ? 'var(--peta-kosong)' : k.warna[kelas(k, v)];
  }
  function angka(v, n){ return v.toLocaleString('en-GB', {minimumFractionDigits: n || 0, maximumFractionDigits: n || 0}); }
  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }

  /* --- projection: equirectangular, scaled by cos(latitude) */
  function cincin(g){ return g.type === 'Polygon' ? [g.coordinates] : g.coordinates; }
  function proyektor(fitur){
    var x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    fitur.forEach(function(f){ cincin(f.geometry).forEach(function(p){ p.forEach(function(r){ r.forEach(function(c){
      if (c[0] < x0) x0 = c[0]; if (c[0] > x1) x1 = c[0]; if (c[1] < y0) y0 = c[1]; if (c[1] > y1) y1 = c[1];
    }); }); }); });
    var kos = Math.cos((y0 + y1) / 2 * Math.PI / 180), L = 900, tepi = 10;
    var s = (L - 2 * tepi) / ((x1 - x0) * kos), T = Math.round((y1 - y0) * s + 2 * tepi);
    return {L: L, T: T, f: function(c){ return [tepi + (c[0] - x0) * kos * s, tepi + (y1 - c[1]) * s]; }};
  }
  function jalur(g, pr){
    return cincin(g).map(function(p){ return p.map(function(r){
      return 'M' + r.map(function(c){ var q = pr.f(c); return q[0].toFixed(1) + ' ' + q[1].toFixed(1); }).join('L') + 'Z';
    }).join(''); }).join('');
  }

  /* --- layout: map on the left, controls, legend and table on the right */
  akar.innerHTML =
    '<div class="peta-isi">' +
      '<div class="peta-bingkai"><svg class="peta-svg" role="img"></svg><span class="peta-laut">Java Sea</span><div class="peta-tip" hidden></div></div>' +
      '<div class="peta-panel">' +
        '<label class="peta-label-pilih" for="peta-lapisan">Layer</label>' +
        '<select id="peta-lapisan">' + Object.keys(LAPISAN).map(function(k){ return '<option value="' + k + '">' + LAPISAN[k].nama + '</option>'; }).join('') + '</select>' +
        '<div class="peta-kunci"></div>' +
        '<table class="peta-ringkas"><thead><tr><th>District</th><th>Villages</th><th>Over 5 cm</th><th>Residents</th></tr></thead><tbody></tbody></table>' +
        '<p class="peta-catatan">"Over 5 cm" counts villages sinking faster than 5 cm a year; residents are 2024 WorldPop estimates for those villages.</p>' +
      '</div>' +
    '</div>';

  var svg = akar.querySelector('.peta-svg'), tip = akar.querySelector('.peta-tip'), bingkai = akar.querySelector('.peta-bingkai');
  var NS = 'http://www.w3.org/2000/svg', jalurDesa = [];

  function tambah(nama, atribut){
    var el = document.createElementNS(NS, nama);
    for (var k in atribut) el.setAttribute(k, atribut[k]);
    svg.appendChild(el);
    return el;
  }
  function gambar(){
    var w = WILAYAH[keadaan.wilayah];
    var fitur = D.features.filter(function(f){ return w.kab.indexOf(f.properties.kb) >= 0; });
    var kabw = D.kab.filter(function(f){ return w.kab.indexOf(f.properties.kb) >= 0; });
    var pr = proyektor(fitur);
    svg.setAttribute('viewBox', '0 0 ' + pr.L + ' ' + pr.T);
    svg.textContent = '';
    jalurDesa = fitur.map(function(f){ var el = tambah('path', {d: jalur(f.geometry, pr), 'class': 'peta-desa'}); el.__f = f; return el; });
    kabw.forEach(function(f){ tambah('path', {d: jalur(f.geometry, pr), 'class': 'peta-kab'}); });
    kabw.forEach(function(f){ var q = pr.f(f.properties.lbl); tambah('text', {x: q[0], y: q[1], 'class': 'peta-nama'}).textContent = f.properties.kb; });
    warnai(); ringkas(fitur, w);
    sembunyi();
  }
  function warnai(){
    var k = LAPISAN[keadaan.lapisan];
    jalurDesa.forEach(function(el){ el.style.fill = warna(el.__f); });
    svg.setAttribute('aria-label', 'Map of ' + WILAYAH[keadaan.wilayah].judul + ' by village: ' + k.judul);
    akar.querySelector('.peta-kunci').innerHTML = '<b>' + esc(k.judul) + '</b>' +
      k.label.map(function(l, i){ return '<span><i style="background:' + k.warna[i] + '"></i>' + esc(l) + '</span>'; }).join('') +
      (k.kosong ? '<span><i style="background:var(--peta-kosong)"></i>' + esc(k.kosong) + '</span>' : '');
  }
  function ringkas(fitur, w){
    akar.querySelector('.peta-ringkas tbody').innerHTML = w.kab.map(function(nama){
      var s = fitur.filter(function(f){ return f.properties.kb === nama; });
      var cepat = s.filter(function(f){ return f.properties.laju != null && f.properties.laju < -5; });
      var jiwa = cepat.reduce(function(a, f){ return a + (f.properties.jiwa || 0); }, 0);
      return '<tr><td>' + esc(nama) + '</td><td>' + s.length + '</td><td>' + cepat.length + '</td><td>' + (jiwa ? angka(Math.round(jiwa / 1000)) + 'k' : '–') + '</td></tr>';
    }).join('');
  }

  /* --- tooltip: hover on desktop, tap on touch */
  function baris(judul, isi){ return '<dt>' + judul + '</dt><dd>' + isi + '</dd>'; }
  function tampil(el, x, y){
    var p = el.__f.properties, dp = padat(p);
    jalurDesa.forEach(function(j){ j.classList.toggle('aktif', j === el); });
    tip.innerHTML = '<b>' + esc(p.n) + '</b><span>' + esc(p.kc) + ', ' + esc(p.kb) + '</span><dl>' +
      baris('Ground', p.laju == null ? 'not covered' : (p.laju < 0 ? 'sinking ' + angka(-p.laju, 1) : 'rising ' + angka(p.laju, 1)) + ' cm a year') +
      (p.t5 != null ? baris('Area sinking &gt; 5 cm', p.t5 + '%') : '') +
      baris('Tidal floods', p.rob + ' of ' + nRob + ' years') +
      baris('Other floods', p.bjr + ' of ' + nBjr + ' years') +
      (p.ntl != null ? baris('Night light', (p.ntl >= 0 ? '+' : '') + angka(p.ntl) + '% (2014–2022)') : '') +
      (p.jiwa != null ? baris('Residents', angka(p.jiwa) + (dp != null ? ' (' + angka(dp) + ' per ha)' : '')) : '') +
      '</dl>';
    tip.hidden = false;
    var b = bingkai.getBoundingClientRect(), lt = tip.offsetWidth, tt = tip.offsetHeight;
    var kiri = x - b.left + 14, atas = y - b.top + 14;
    if (kiri + lt > b.width) kiri = Math.max(4, x - b.left - lt - 14);
    if (atas + tt > b.height) atas = Math.max(4, y - b.top - tt - 14);
    tip.style.left = kiri + 'px'; tip.style.top = atas + 'px';
  }
  function sembunyi(){ tip.hidden = true; jalurDesa.forEach(function(j){ j.classList.remove('aktif'); }); }

  svg.addEventListener('pointermove', function(e){
    if (e.pointerType === 'touch') return;
    if (e.target.__f) tampil(e.target, e.clientX, e.clientY); else sembunyi();
  });
  svg.addEventListener('pointerleave', function(e){ if (e.pointerType !== 'touch') sembunyi(); });
  svg.addEventListener('click', function(e){ if (e.target.__f) tampil(e.target, e.clientX, e.clientY); else sembunyi(); });
  akar.querySelector('#peta-lapisan').addEventListener('change', function(e){ keadaan.lapisan = e.target.value; warnai(); });

  gambar();
})();
