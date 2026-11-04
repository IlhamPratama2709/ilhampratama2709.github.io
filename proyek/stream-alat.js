/* Shared helpers for the KOMITMEN stream pages (growth diagnostics, industrial decarbonisation):
   SVG elements, a tooltip per chart, toggle buttons, and a small West Java map from window.PETA_JABAR.
   Same pattern as semarang-grafik.js and stranded-grafik.js. */
window.ALAT = (function(){
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
  /* narrower drawing on phones, so the text keeps a readable size when the SVG scales down */
  function lebar(id){ var e = document.getElementById(id); return e && e.clientWidth && e.clientWidth < 480 ? 380 : 560; }
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
  function kunci(akar, isi){
    var k = document.createElement('div'); k.className = 'gn-kunci';
    k.innerHTML = isi.map(function(b){ return '<span><i' + (b[2] ? ' class="' + b[2] + '"' : '') + ' style="background:' + b[0] + '"></i>' + b[1] + '</span>'; }).join('');
    akar.appendChild(k);
    return k;
  }
  /* West Java districts as a base map; isi(kode) returns the fill, tip(kode, nama) the tooltip */
  function petaJabar(id, label){
    var P = window.PETA_JABAR; if (!P) return null;
    var c = siapkan(id, P.w, P.h, label); if (!c) return null;
    c.akar.classList.add('peta-jabar');
    var dasar = el('g', {}, c.svg), atas = el('g', {}, c.svg);
    var wil = P.wil.map(function(w){ return {k: w.k, n: w.n, el: el('path', {d: w.d, 'class': 'pj-wil'}, dasar)}; });
    return {akar: c.akar, svg: c.svg, atas: atas, wil: wil,
      warnai: function(isi, tip){ wil.forEach(function(w){ w.el.style.fill = isi(w.k); w.el.__tip = tip(w.k, w.n); }); }};
  }
  return {el: el, angka: angka, lebar: lebar, siapkan: siapkan, tombol: tombol, kunci: kunci, petaJabar: petaJabar};
})();
