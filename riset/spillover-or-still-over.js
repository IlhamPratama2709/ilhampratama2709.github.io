// Grafik garis cahaya malam. Angka: rata-rata NTL panel skripsi, indeks 2013 = 100.
const TAHUN = [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];
const SERI = [
  { nama: "Other districts", warna: "--seri-2", n: [1.042, 1.125, 1.184, 1.247, 1.353, 1.46, 1.518, 1.512, 1.577, 1.588, 1.82] },
  { nama: "Within 60 km of a zone", warna: "--seri-1", n: [3.508, 3.612, 4.051, 4.046, 4.341, 4.744, 5.001, 4.836, 5.057, 5.157, 5.842] },
].map((s) => ({ ...s, v: s.n.map((x) => (x / s.n[0]) * 100) }));
document.getElementById("tabel-garis").innerHTML = `<thead><tr><th>Year</th>${SERI.map((s) => `<th>${s.nama}</th>`).join("")}</tr></thead><tbody>` +
  TAHUN.map((t, i) => `<tr><td>${t}</td>${SERI.map((s) => `<td>${s.v[i].toFixed(1)}</td>`).join("")}</tr>`).join("") + "</tbody>";

const wadah = document.getElementById("garis");
function gambar() {
  const L = wadah.clientWidth; if (!L) return;
  const sempit = L < 480, T = sempit ? 200 : 240, kiri = 30, kanan = sempit ? 112 : 182, atas = 12, bawah = 24;
  const x = (i) => kiri + (i / (TAHUN.length - 1)) * (L - kiri - kanan);
  const y = (v) => atas + (1 - (v - 100) / 80) * (T - atas - bawah);
  const warna = (s) => getComputedStyle(document.documentElement).getPropertyValue(s.warna).trim();
  const kisi = [100, 120, 140, 160, 180].map((v) => `<line x1="${kiri}" x2="${L - kanan}" y1="${y(v)}" y2="${y(v)}" stroke="var(--border)" stroke-dasharray="${v === 100 ? "" : "3 4"}"/><text x="${kiri - 6}" y="${y(v) + 4}" text-anchor="end">${v}</text>`).join("");
  const sumbu = [0, 5, 10].map((i) => `<text x="${x(i)}" y="${T - 6}" text-anchor="middle">${TAHUN[i]}</text>`).join("");
  const garis = SERI.map((s) => `<path d="${s.v.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ")}" fill="none" stroke="${warna(s)}" stroke-width="2" stroke-linejoin="round"/><circle cx="${x(10)}" cy="${y(s.v[10])}" r="4" fill="${warna(s)}" stroke="var(--bg-page)" stroke-width="2"/>`).join("");
  const ujung = SERI.map((s) => { return `<text class="ujung" x="${x(10) + 8}" y="${y(s.v[10]) + (s.v[10] > 170 ? -3 : 12)}">${sempit ? s.nama.replace("Within 60 km of a zone", "Near a zone").replace("Other districts", "Others") : s.nama}, ${s.v[10].toFixed(0)}</text>`; }).join("");
  wadah.innerHTML = `<svg viewBox="0 0 ${L} ${T}" role="img" aria-label="Line chart. Mean night-time light rose to 167 near zones and 175 elsewhere by 2023, with 2013 set to 100.">${kisi}${sumbu}${garis}${ujung}<line id="garis-silang" y1="${atas}" y2="${T - bawah}" stroke="var(--ink-3)" visibility="hidden"/></svg><div class="ujar" hidden></div>`;
  const svg = wadah.querySelector("svg"), ujar = wadah.querySelector(".ujar"), silang = wadah.querySelector("#garis-silang");
  svg.addEventListener("pointermove", (e) => {
    const r = svg.getBoundingClientRect(), i = Math.max(0, Math.min(10, Math.round(((e.clientX - r.left - kiri) / (L - kiri - kanan)) * 10)));
    silang.setAttribute("x1", x(i)); silang.setAttribute("x2", x(i)); silang.setAttribute("visibility", "visible");
    ujar.hidden = false;
    ujar.innerHTML = `<b>${TAHUN[i]}</b><br>${SERI.map((s) => `${s.nama}: ${s.v[i].toFixed(0)}`).join("<br>")}`;
    ujar.style.left = `${Math.min(x(i) + 10, L - ujar.offsetWidth - 2)}px`;
  });
  svg.addEventListener("pointerleave", () => { ujar.hidden = true; silang.setAttribute("visibility", "hidden"); });
}
gambar();
addEventListener("resize", gambar);
document.addEventListener("gr-tab", gambar);
new MutationObserver(gambar).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
