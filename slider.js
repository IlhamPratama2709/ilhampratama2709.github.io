// Slider proyek di pembuka. Tambah proyek baru cukup di daftar PROYEK.
const DRIVE = "https://drive.google.com/drive/folders/";
const PROYEK = [
  { meta: "Now · KOMITMEN, UIII", judul: "KOMITMEN dashboards", ket: "Eight dashboards and reports for 38 provinces and 514 districts.", foto: "images/proyek/komitmen/klip-3-sampul.jpg", posisi: "62% 50%", tautan: "proyek/komitmen-dashboard.html", sprite: "peta" },
  { meta: "EJAVEC 2025 · 1st place", judul: "The Trans-Java Toll Road and East Java's economy", ket: "Toll-road proximity and regional GDP in 30 regencies and cities, 2011–2023.", foto: "images/web/lapangan-2.jpg", posisi: "50% 22%", tautan: DRIVE + "1uC9JmEj6kYn9F45ns69kg-oHdkfTuZY1", sprite: "kura" },
  { meta: "Sumatranomics 2025 · 2nd place", judul: "When spillovers don't spill: SEZs in Sumatra", ket: "Why SEZ spillovers are uneven across 154 districts and cities, 2010–2024.", foto: "images/web/lapangan-3.jpg", posisi: "50% 30%", tautan: DRIVE + "10jnVVOmJh2rUiqU8_geWk38uhrGXIBLg", sprite: "kunang" },
];
const LAMA = 9000;
const IKON = { mundur: '<path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" stroke-width="2"/>', maju: '<path d="m6 3 5 5-5 5" fill="none" stroke="currentColor" stroke-width="2"/>', jeda: '<path d="M5 3v10M11 3v10" stroke="currentColor" stroke-width="2.4"/>', putar: '<path d="M5 3v10l8-5z" fill="currentColor"/>' };
const svg = (n) => `<svg viewBox="0 0 16 16" aria-hidden="true">${IKON[n]}</svg>`;

const akar = document.getElementById("slider");
akar.innerHTML = `<div class="slide-bingkai">${PROYEK.map((p) => `<figure class="slide"><img src="${p.foto}" alt="" style="object-position:${p.posisi}"></figure>`).join("")}</div>
<div class="kotak-teks" aria-live="polite"><img class="sprite" alt=""><div class="meta-slide"></div><h3><a></a></h3><p></p></div>
<div class="kendali-slide"><div class="titik-slide" role="group" aria-label="Choose a project">${PROYEK.map((p) => `<button type="button" aria-label="${p.judul.replace(/"/g, "&quot;")}"></button>`).join("")}</div>
<div class="tombol-slide"><button type="button" data-g="mundur" aria-label="Previous project">${svg("mundur")}</button><button type="button" data-g="jeda" aria-label="Pause slides">${svg("jeda")}</button><button type="button" data-g="maju" aria-label="Next project">${svg("maju")}</button></div></div>`;

const slide = [...akar.querySelectorAll(".slide")], titik = [...akar.querySelectorAll(".titik-slide button")];
const kotak = akar.querySelector(".kotak-teks"), tautan = kotak.querySelector("h3 a"), tombolJeda = akar.querySelector('[data-g="jeda"]');
const hemat = matchMedia("(prefers-reduced-motion: reduce)").matches;
let i = 0, waktu = null, dijeda = hemat, diatas = false;

function ulang() {
  clearTimeout(waktu);
  if (!dijeda && !diatas && !document.hidden) waktu = setTimeout(() => tampil(i + 1), LAMA);
}
function tampil(k) {
  i = (k + PROYEK.length) % PROYEK.length;
  const p = PROYEK[i];
  slide.forEach((s, j) => s.classList.toggle("aktif", j === i));
  titik.forEach((t, j) => t.setAttribute("aria-current", j === i));
  kotak.querySelector(".sprite").src = `images/sprite/${p.sprite}.png`;
  kotak.querySelector(".meta-slide").textContent = p.meta;
  tautan.textContent = p.judul;
  tautan.href = p.tautan;
  kotak.querySelector("p").textContent = p.ket;
  ulang();
}
function tandaiJeda() {
  tombolJeda.innerHTML = svg(dijeda ? "putar" : "jeda");
  tombolJeda.setAttribute("aria-label", dijeda ? "Play slides" : "Pause slides");
}
akar.querySelector('[data-g="mundur"]').onclick = () => tampil(i - 1);
akar.querySelector('[data-g="maju"]').onclick = () => tampil(i + 1);
titik.forEach((t, j) => { t.onclick = () => tampil(j); });
tombolJeda.onclick = () => { dijeda = !dijeda; tandaiJeda(); ulang(); };
akar.addEventListener("mouseenter", () => { diatas = true; ulang(); });
akar.addEventListener("mouseleave", () => { diatas = false; ulang(); });
document.addEventListener("visibilitychange", ulang);
tandaiJeda();
tampil(0);
