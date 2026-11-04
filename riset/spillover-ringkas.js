// Ringkasan "at a glance" dan penjelajah temuan. Angka disalin dari tabel di halaman ini.
(() => {
const TAHUN = [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];
const SERI = [
  { nama: "Other districts", pendek: "Others", warna: "--seri-2", n: [1.042, 1.125, 1.184, 1.247, 1.353, 1.46, 1.518, 1.512, 1.577, 1.588, 1.82] },
  { nama: "Within 60 km", pendek: "Near zones", warna: "--seri-1", n: [3.508, 3.612, 4.051, 4.046, 4.341, 4.744, 5.001, 4.836, 5.057, 5.157, 5.842] },
].map((s) => ({ ...s, v: s.n.map((x) => (x / s.n[0]) * 100) }));

const JENIS = [["semua", "All zones"], ["manufaktur", "Manufacturing"], ["pariwisata", "Tourism"]];
const HASIL = {
  cahaya: { nama: "Night-time light", unit: "log points", log: true, semua: [0.024, 0.024, false], manufaktur: [0.035, 0.031, false], pariwisata: [0.006, 0.036, false] },
  co2: { nama: "CO₂", unit: "log points", log: true, semua: [0.008, 0.005, false], manufaktur: [0.007, 0.005, false], pariwisata: [0.044, 0.022, true] },
  no2: { nama: "NO₂", unit: "µmol/m²", semua: [0.129, 0.814, false], manufaktur: [-0.611, 1.163, false], pariwisata: [1.725, 0.704, true] },
  so2: { nama: "SO₂", unit: "µmol/m²", semua: [-6.397, 5.867, false], manufaktur: [-7.448, 7.731, false], pariwisata: [-4.110, 9.667, false] },
  co: { nama: "CO", unit: "mmol/m²", semua: [-0.219, 0.152, false], manufaktur: [-0.363, 0.223, false], pariwisata: [-0.142, 0.254, false] },
};
const CINCIN = ["0–30 km", "30–60 km", "60–90 km", "90–120 km"];
const JARAK = { cahaya: [[0.052, 0.094], [0.020, 0.068], [-0.030, 0.048], [0.016, 0.027]], co2: [[0.007, 0.023], [0.011, 0.009], [0.029, 0.028], [0.009, 0.006]] };

const angka = (v) => (v < 0 ? "−" : "") + Math.abs(v).toFixed(3);
const warna = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const ambil = (id) => document.getElementById(id);

function langkahRapi(lo, hi) {
  const kasar = (hi - lo) / 4, p = Math.pow(10, Math.floor(Math.log10(kasar)));
  const s = [1, 2, 2.5, 5, 10].map((k) => k * p).find((k) => k >= kasar);
  const t = [];
  for (let v = Math.ceil(lo / s) * s; v <= hi + 1e-9; v += s) t.push(+v.toFixed(6));
  return t;
}

// Titik estimasi dengan selang 95 persen. Tiap grup memakai sumbunya sendiri karena satuannya bisa berbeda.
function plotTitik(el, grup, ringkas = false) {
  const L = el.clientWidth; if (!L) return;
  const sempit = L < 480, kiri = ringkas ? 100 : sempit ? 104 : 150, kanan = ringkas ? 50 : 66, baris = ringkas ? 24 : 30;
  let y = 0, s = "";
  grup.forEach((g) => {
    const ujung = g.baris.flatMap((b) => (b[2] == null ? [b[1]] : [b[1] - 1.96 * b[2], b[1] + 1.96 * b[2]]));
    let lo = Math.min(0, ...ujung), hi = Math.max(0, ...ujung);
    const pad = (hi - lo) * 0.08; lo -= pad; hi += pad;
    const x = (v) => kiri + ((v - lo) / (hi - lo)) * (L - kiri - kanan);
    if (!ringkas) { s += `<text x="0" y="${y + 14}" style="font-weight:700;fill:${warna("--ink-1")};font-size:13px">${g.judul}</text><text x="${L}" y="${y + 14}" text-anchor="end">${g.unit}</text>`; y += 24; }
    const atas = y, bawah = y + g.baris.length * baris;
    langkahRapi(lo, hi).forEach((t) => {
      s += `<line x1="${x(t)}" x2="${x(t)}" y1="${atas}" y2="${bawah}" style="stroke:${warna(t === 0 ? "--ink-3" : "--border")}" ${t === 0 ? "" : 'stroke-dasharray="3 4"'}/>`;
      if (!ringkas || t === 0) s += `<text x="${x(t)}" y="${bawah + 13}" text-anchor="middle">${t === 0 ? "0" : angka(t).replace(/\.?0+$/, "")}</text>`;
    });
    g.baris.forEach(([label, est, se, sig], i) => {
      const cy = atas + i * baris + baris / 2;
      s += `<text x="${kiri - 8}" y="${cy + 4}" text-anchor="end" style="fill:${warna("--teks")};font-size:${ringkas ? 12 : 13}px">${label}</text>`;
      if (se != null) s += `<line x1="${x(est - 1.96 * se)}" x2="${x(est + 1.96 * se)}" y1="${cy}" y2="${cy}" style="stroke:${warna(sig ? "--ink-1" : "--ink-2")};stroke-width:2"/>`;
      s += se == null
        ? `<rect x="${x(est) - 5}" y="${cy - 5}" width="10" height="10" transform="rotate(45 ${x(est)} ${cy})" style="fill:${warna("--bg-page")};stroke:${warna("--ink-1")};stroke-width:2"/>`
        : `<circle cx="${x(est)}" cy="${cy}" r="${ringkas ? 5 : 6}" style="fill:${sig ? warna("--emas") : warna("--bg-page")};stroke:${warna(sig ? "--ink-1" : "--ink-2")};stroke-width:2"/>`;
      s += `<text x="${L - kanan + 8}" y="${cy + 4}" style="fill:${warna("--ink-1")};font-weight:700">${angka(est)}${sig ? "**" : ""}</text>`;
    });
    y = bawah + (ringkas ? 18 : 32);
  });
  el.innerHTML = `<svg viewBox="0 0 ${L} ${y}" width="100%" aria-hidden="true">${s}</svg>`;
}

function garisIndeks(el) {
  const L = el.clientWidth; if (!L) return;
  const T = 110, kiri = 26, kanan = 104, atas = 8, bawah = 18;
  const x = (i) => kiri + (i / (TAHUN.length - 1)) * (L - kiri - kanan);
  const y = (v) => atas + (1 - (v - 100) / 80) * (T - atas - bawah);
  let s = [100, 140, 180].map((v) => `<line x1="${kiri}" x2="${L - kanan}" y1="${y(v)}" y2="${y(v)}" style="stroke:${warna("--border")}" ${v === 100 ? "" : 'stroke-dasharray="3 4"'}/><text x="${kiri - 5}" y="${y(v) + 4}" text-anchor="end">${v}</text>`).join("");
  s += [0, 10].map((i) => `<text x="${x(i)}" y="${T - 3}" text-anchor="middle">${TAHUN[i]}</text>`).join("");
  SERI.forEach((sr) => {
    const w = warna(sr.warna);
    s += `<path d="${sr.v.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ")}" style="fill:none;stroke:${w};stroke-width:2"/>`
      + `<text x="${x(10) + 6}" y="${y(sr.v[10]) + (sr.v[10] > 170 ? -2 : 11)}" style="fill:${w};font-weight:700">${sr.pendek}, ${sr.v[10].toFixed(0)}</text>`;
  });
  el.innerHTML = `<svg viewBox="0 0 ${L} ${T}" width="100%" aria-hidden="true">${s}</svg>`;
}

const grupJenis = (k) => ({ judul: HASIL[k].nama, unit: HASIL[k].unit, baris: JENIS.map(([j, n]) => [n, ...HASIL[k][j]]) });
const grupJarak = (k) => ({ judul: `${HASIL[k].nama}, all zones`, unit: HASIL[k].unit, baris: CINCIN.map((c, i) => [c, JARAK[k][i][0], JARAK[k][i][1], false]) });

// Diagram batang mendatar gaya slide ringkasan KOMITMEN. Baris yang disorot berwarna navy, pembanding pucat.
// Nilai negatif digambar ke kiri dari garis nol.
function ringkasan() {
  document.querySelectorAll(".rk2-batang").forEach((el) => {
    const data = JSON.parse(el.dataset.batang);
    const v = data.map((d) => d[1]), lo = Math.min(0, ...v), hi = Math.max(0, ...v);
    const ruangKiri = lo < 0 ? 0.04 : 0, lebar = 0.66 - ruangKiri;
    const pos = (x) => (ruangKiri + ((x - lo) / (hi - lo || 1)) * lebar) * 100;
    const nol = pos(0);
    el.innerHTML = data.map(([label, nilai, sorot, teks]) => {
      const p = pos(nilai), kiri = Math.min(p, nol), w = Math.max(Math.abs(p - nol), 0.8);
      // Nilai negatif ditulis di kanan garis nol supaya tidak menabrak label baris.
      const tulisan = `left:${((nilai < 0 ? nol : kiri + w) + 2.5).toFixed(1)}%`;
      return `<div class="rk2-baris${sorot ? " sorot" : ""}"><span>${label}</span><span class="rk2-jalur">${lo < 0 ? `<b style="left:${nol.toFixed(1)}%"></b>` : ""}<i style="left:${kiri.toFixed(1)}%;width:${w.toFixed(1)}%"></i><em style="${tulisan}">${teks}</em></span></div>`;
    }).join("");
  });
}

// Penjelajah: hasil × cara lihat × estimator.
const ks = { hasil: "co2", pandang: "jenis", estimator: "cs" };
const bisaJarak = (h) => h === "cahaya" || h === "co2";
function tombol(id, daftar, kunci, mati = () => false) {
  ambil(id).innerHTML = daftar.map(([v, label]) => `<button type="button" data-k="${kunci}" data-v="${v}" aria-pressed="${ks[kunci] === v}"${mati(v) ? " disabled" : ""}>${label}</button>`).join("");
}
function penjelajah() {
  if (ks.pandang === "jarak" && !bisaJarak(ks.hasil)) ks.pandang = "jenis";
  if (!(ks.hasil === "cahaya" && ks.pandang === "jenis")) ks.estimator = "cs";
  tombol("rk-hasil", Object.entries(HASIL).map(([k, v]) => [k, v.nama]), "hasil");
  tombol("rk-pandang", [["jenis", "By type of zone"], ["jarak", "By distance"]], "pandang", (v) => v === "jarak" && !bisaJarak(ks.hasil));
  tombol("rk-estimator", [["cs", "Callaway–Sant'Anna"], ["twfe", "Compare with two-way FE"]], "estimator", (v) => v === "twfe" && !(ks.hasil === "cahaya" && ks.pandang === "jenis"));

  const H = HASIL[ks.hasil], g = ambil("rk-grafik");
  let kalimat, catatan = "";
  if (ks.pandang === "jarak") {
    const d = JARAK[ks.hasil], i = d.reduce((m, r, j) => (r[0] > d[m][0] ? j : m), 0);
    kalimat = `No distance ring shows a significant change in ${H.nama}. The largest estimate, ${angka(d[i][0])} ${H.unit}, is at ${CINCIN[i]}.`;
    plotTitik(g, [grupJarak(ks.hasil)]);
  } else if (ks.estimator === "twfe") {
    kalimat = "A standard two-way fixed effects model reports a significant 0.074. Once zones that opened in different years are handled properly, the estimate falls to 0.024 and is no longer significant.";
    plotTitik(g, [{ judul: "Night-time light, all zones", unit: "log points", baris: [["Two-way FE", 0.074, null, true], ["Callaway–Sant'Anna", 0.024, 0.024, false]] }]);
    catatan = "The diamond marks the two-way fixed effects point estimate; its confidence interval is not shown.";
  } else {
    const sig = JENIS.filter(([j]) => H[j][2]);
    if (sig.length) {
      const [j, nama] = sig[0], est = H[j][0];
      const besar = H.log ? `about ${((Math.exp(est) - 1) * 100).toFixed(1)} percent higher` : `higher by ${angka(est)} ${H.unit}${ks.hasil === "no2" ? ", about 13 percent of the sample mean" : ""}`;
      kalimat = `Near ${nama.toLowerCase()} zones, ${H.nama} is ${besar} after a zone opens. The other estimates are not significant.`;
    } else {
      kalimat = `No type of zone changes ${H.nama} significantly. The estimate for all zones is ${angka(H.semua[0])} ${H.unit}.`;
    }
    plotTitik(g, [grupJenis(ks.hasil)]);
  }
  ambil("rk-kalimat").textContent = kalimat;
  ambil("rk-catatan").textContent = catatan;
}
document.addEventListener("click", (e) => {
  const b = e.target.closest(".rk-grup button[data-k]");
  if (!b || b.disabled) return;
  ks[b.dataset.k] = b.dataset.v;
  penjelajah();
});

function semua() { ringkasan(); penjelajah(); }
semua();
let jeda;
addEventListener("resize", () => { clearTimeout(jeda); jeda = setTimeout(semua, 120); });
new MutationObserver(semua).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
})();
