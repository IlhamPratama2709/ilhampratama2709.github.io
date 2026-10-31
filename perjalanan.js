// Ilham's Journey. Kunjungan baru cukup satu baris di KUNJUNGAN: id = kode wilayah dari peta-data.js, atau titik [x, y] untuk luar negeri.
(() => {
const DRIVE_FOLDER = "https://drive.google.com/drive/folders/";
const KUNJUNGAN = [
  { id: "31.71", tempat: "Jakarta and Depok", kapan: "Home base", ikon: "monas", judul: "Home base: Jakarta and Depok", isi: "Most of my desk research happens here. Pick a project to read about it.", rumah: true },
  { id: "34.71", tempat: "Yogyakarta", kapan: "January 2023", ikon: "tugu", label: "PENSAR 2023", judul: "Malioboro merchants follow their neighbours", isi: "I was an enumerator on a survey of 75 merchants and 75 customers about digital payment.", foto: "images/riset/pensar/yogyakarta-malioboro.jpg", tautan: "riset/pensar-yogyakarta.html", teks: "Read the summary" },
  { id: "51.02", tempat: "Tabanan, Bali", kapan: "January 2024", ikon: "meru", label: "PENSAR 2024", judul: "Few Tabanan farms have a successor", isi: "I joined the research team for a survey of 69 farm households on who will take over the rice fields.", foto: "images/riset/pensar/bali-wawancara.jpg", tautan: "riset/pensar-bali.html", teks: "Read the summary" },
  { id: "92.02", tempat: "Manokwari, West Papua", kapan: "September 2024", ikon: "kakiseribu", label: "1st place · Papedanomics", judul: "Urban areas and Papua's economy", isi: "My team presented a paper on the leading sectors of eight regencies and cities on the island of Papua.", tautan: DRIVE_FOLDER + "1SGwxmb5rLxnqPlTDCGPhzBA_Qpw8ItNw", teks: "Open the paper" },
  { id: "13.71", tempat: "Padang, West Sumatra", kapan: "2024", ikon: "gadang", label: "2nd place · 5th Sumatranomics", judul: "The Trans-Sumatra Toll Road", isi: "I presented a paper on what the toll road has done for 132 districts in Sumatra.", tautan: DRIVE_FOLDER + "1LxL8SWhTDcNhXDWfCkc8Rvshu3zn9V0r", teks: "Open the paper" },
  { id: "19.04", tempat: "Bangka Tengah, Bangka Belitung", kapan: "January 2025", ikon: "ikan", label: "PENSAR 2025", judul: "Residents back tourism but take little part", isi: "I led the research team for a survey of 193 residents in two villages as the island looks beyond tin.", foto: "images/riset/pensar/bangka-kepala.jpg", tautan: "riset/pensar-bangka.html", teks: "Read the summary" },
  { id: "91.71", tempat: "Jayapura, Papua", kapan: "June 2025", ikon: "cenderawasih", label: "1st place · BAKU PANDAI", judul: "Investment in Papua's new provinces", isi: "Our paper on sectors in the new provinces won the student category, and the award was given at Festival Cenderawasih.", tautan: DRIVE_FOLDER + "12IpqYRGb5PKY8FzJsbHgR0ecel3A2DFn", teks: "Open the paper" },
  { id: "12.71", tempat: "Medan, North Sumatra", kapan: "2025", ikon: "maimun", label: "2nd place · 6th Sumatranomics", judul: "When spillovers don't spill", isi: "I presented a paper on why gains from special economic zones are uneven across 154 districts and cities in Sumatra.", foto: "images/web/lapangan-3.jpg", posisi: "50% 30%", tautan: "riset/when-spillovers-dont-spill.html", teks: "Read the summary" },
  { id: "35.78", tempat: "Surabaya, East Java", kapan: "August 2025", ikon: "sura", label: "1st place · EJAVEC", judul: "The Trans-Java Toll Road", isi: "I presented a paper at the EJAVEC final on the toll road and the economy of 30 regencies and cities in East Java.", foto: "images/web/lapangan-2.jpg", posisi: "50% 32%", tautan: "riset/trans-java-toll-road.html", teks: "Read the summary" },
  { id: "KCH", tempat: "Kuching, Sarawak", kapan: "September 2025", ikon: "kucing", label: "1st place · ASEAN Energy Youth Awards", judul: "Beyond Megadams", isi: "My team won the policy pitch track with ASHARE, a framework for community-scale hydropower in ASEAN.", foto: "images/perjalanan/kuching.jpg", posisi: "50% 78%", titik: [163.5, 64.5], pulau: "kalimantan", tautan: DRIVE_FOLDER + "1lR7BCJoVCx0V04G-SrbuCG3lCloWAY-F", teks: "Open the policy pitch" },
  { id: "KUL", tempat: "Kuala Lumpur", kapan: "October 2025", ikon: "menara", label: "Speaker · AEBF-25", judul: "ASHARE at the ASEAN Energy Business Forum", isi: "I presented our pitch at the 25th ASEAN Energy Business Forum, in a session on youth contributions to the energy transition.", titik: [76.9, 48.6], pulau: "semenanjung", tautan: DRIVE_FOLDER + "1lR7BCJoVCx0V04G-SrbuCG3lCloWAY-F", teks: "Open the policy pitch" },
  { id: "18.71", tempat: "Bandar Lampung, Lampung", kapan: "2026", ikon: "siger", label: "IRSA 2026", judul: "Spillover or Still Over?", isi: "I presented my thesis at the IRSA conference, on special economic zones and their traces in light and air quality.", tautan: "riset/spillover-or-still-over.html", teks: "Read the summary" },
];
// Proyek di meja kerja, muncul saat Home diklik. Tambah proyek baru di sini; yang punya baris di RISET cukup ditulis potongan judulnya.
const PROYEK_RUMAH = [
  { judul: "Spillover or Still Over? (bachelor's thesis)", tautan: "riset/spillover-or-still-over.html" },
  { judul: "KOMITMEN dashboard site", tautan: "proyek/komitmen-dashboard.html" },
  { cari: "Climate adaptation" }, { cari: "energy dilemma" }, { cari: "R&D investment" }, { cari: "Infrastructure investment" }, { cari: "student hunger" },
].map((p) => {
  if (!p.cari) return p;
  const r = RISET.find((x) => x[1].includes(p.cari));
  return r ? { judul: r[1], tautan: r[7] } : null;
}).filter(Boolean);

const KEPALA = 34, UKURAN_PIN = 26; // piksel layar, tetap sama saat peta diperbesar
const JAUH = 70, DEKAT = 6; // unit peta: 10 unit = 1 derajat
const NS = "http://www.w3.org/2000/svg", GAMBAR = "images/perjalanan/";
const svg = document.getElementById("peta");
const hemat = matchMedia("(prefers-reduced-motion: reduce)").matches;
const el = (t, a = {}, p = svg) => { const e = document.createElementNS(NS, t); Object.entries(a).forEach(([k, v]) => e.setAttribute(k, v)); p.appendChild(e); return e; };
const ambil = (id) => document.getElementById(id);

const kab = Object.fromEntries(PETA.kab.map((k) => [k.id, k]));
const titikDari = (v) => v.titik || kab[v.id].c;
const lembar = {};

// Pulau menentukan moda: dua angka pertama kode wilayah adalah kode provinsi BPS.
function pulauDari(id) {
  const n = Number(id.slice(0, 2));
  if (n === 19) return "bangka";
  if (n === 21) return "riau";
  if (n < 20) return "sumatera";
  if (n < 40) return "jawa";
  if (n === 51) return "bali";
  if (n < 60) return "nusa";
  if (n < 70) return "kalimantan";
  if (n < 80) return "sulawesi";
  if (n < 90) return "maluku";
  return "papua";
}
const pulauKunjungan = (v) => v.pulau || pulauDari(v.id);
function moda(dari, ke, jarak) {
  if (jarak < DEKAT) return "jalan";
  if (dari === "jawa" && ke === "jawa") return "kereta";
  return dari === ke && jarak < JAUH ? "mobil" : "pesawat";
}

// Gambar peta
const lapisan = el("g");
Object.entries(PETA.negara).forEach(([n, d]) => {
  const p = el("path", { d, class: "negara" + (n === "Malaysia" ? " singgah" : "") }, lapisan);
  if (n === "Malaysia") p.dataset.id = "MY";
});
PETA.kab.forEach((k) => {
  const p = el("path", { d: k.d, class: "kab", "data-id": k.id }, lapisan);
  lembar[k.id] = p;
  el("title", {}, p).textContent = k.n;
});
el("path", { d: PETA.prov, class: "batas-prov" }, lapisan);
const lapisanPin = el("g");
const pin = {};
KUNJUNGAN.forEach((v) => {
  if (lembar[v.id]) lembar[v.id].classList.add("singgah");
  const g = el("g", { class: "pin", "data-id": v.id }, lapisanPin);
  const r = el("rect", { "vector-effect": "non-scaling-stroke", "stroke-width": 1 }, g);
  const i = el("image", { href: `${GAMBAR}${v.ikon}.png` }, g);
  el("title", {}, g).textContent = v.tempat;
  pin[v.id] = { g, r, i };
});
const orang = el("image", { id: "pejalan", href: `${GAMBAR}orang-1.png` });

// Kamera dan posisi orang
let cam = { x: 0, y: 0, w: 480, h: 200 }, pos = titikDari(KUNJUNGAN[0]).slice(), arah = 1, pulauKini = pulauKunjungan(KUNJUNGAN[0]);
const rasio = () => { const b = svg.getBoundingClientRect(); return b.height / b.width || 200 / 480; };
function gambarKamera() {
  const lebarLayar = svg.getBoundingClientRect().width || 800;
  svg.setAttribute("viewBox", `${cam.x} ${cam.y} ${cam.w} ${cam.h}`);
  const u = cam.w / lebarLayar, s = KEPALA * u, q = UKURAN_PIN * u;
  KUNJUNGAN.forEach((v) => {
    const [x, y] = titikDari(v), { r, i } = pin[v.id];
    r.setAttribute("x", x - q / 2); r.setAttribute("y", y - q / 2); r.setAttribute("width", q); r.setAttribute("height", q);
    i.setAttribute("x", x - q * .44); i.setAttribute("y", y - q * .44); i.setAttribute("width", q * .88); i.setAttribute("height", q * .88);
  });
  orang.setAttribute("width", s); orang.setAttribute("height", s);
  orang.setAttribute("x", arah > 0 ? pos[0] - s / 2 : -pos[0] - s / 2);
  orang.setAttribute("y", pos[1] - s - q * .5);
  orang.setAttribute("transform", arah > 0 ? "" : "scale(-1 1)");
}
function pandang(x, y, w) {
  w = Math.max(24, Math.min(480, w));
  const h = w * rasio();
  return { x: Math.max(0, Math.min(480 - w, x - w / 2)), y: h >= 200 ? (200 - h) / 2 : Math.max(0, Math.min(200 - h, y - h / 2)), w, h };
}

// Perjalanan: jalan kaki untuk jarak dekat, kereta di Jawa, mobil di satu pulau, pesawat antarpulau atau jarak jauh.
let tugas = 0;
const lembut = (t) => t * t * (3 - 2 * t);
function pergi(ke, pulauKe, lebarAkhir) {
  return new Promise((selesai) => {
    const nomor = ++tugas, dari = pos.slice(), dx = ke[0] - dari[0], dy = ke[1] - dari[1], jarak = Math.hypot(dx, dy);
    const camDari = { ...cam }, camKe = pandang(ke[0], ke[1], lebarAkhir || cam.w);
    const cara = moda(pulauKini, pulauKe, jarak);
    if (Math.abs(dx) > .5) arah = dx > 0 ? 1 : -1;
    pulauKini = pulauKe;
    svg.dataset.moda = cara;
    const lama = hemat ? 0 : Math.min(2600, 700 + jarak * 13), mulai = performance.now();
    const langkah = () => {
      if (nomor !== tugas) return selesai(false);
      const t = lama ? Math.min(1, (performance.now() - mulai) / lama) : 1, e = lembut(t);
      pos = [dari[0] + dx * e, dari[1] + dy * e];
      ["x", "y", "w", "h"].forEach((k) => { cam[k] = camDari[k] + (camKe[k] - camDari[k]) * e; });
      const bingkai = Math.floor(performance.now() / 160) % 2 + 1;
      orang.setAttribute("href", GAMBAR + (t < 1 ? (cara === "jalan" ? `orang-${bingkai}` : cara) : "orang-1") + ".png");
      gambarKamera();
      if (t < 1) setTimeout(langkah, 16); else selesai(true);
    };
    langkah();
  });
}

// Kartu dan daftar tempat
const daftar = ambil("daftar"), kartu = ambil("kartu");
KUNJUNGAN.forEach((v) => {
  const b = document.createElement("button");
  b.type = "button"; b.dataset.id = v.id;
  b.innerHTML = `<img src="${GAMBAR}${v.ikon}.png" alt=""><b>${v.rumah ? "Home" : v.tempat.split(",")[0]}</b><span>${v.rumah ? "" : v.kapan.replace(/^[A-Za-z]+ /, "")}</span>`;
  b.onclick = () => { berhentiTur(); kunjungi(v); };
  daftar.appendChild(b);
});
function tampilKartu(v) {
  const proyek = v.rumah ? `<ul class="daftar-rumah">${PROYEK_RUMAH.map((p) => `<li><a href="${p.tautan}">${p.judul}</a></li>`).join("")}</ul>` : "";
  kartu.innerHTML = `${v.foto ? `<img class="foto" src="${v.foto}" alt="" style="object-position:${v.posisi || "50% 50%"}">` : ""}
    <div class="isi">
      <div class="meta"><img src="${GAMBAR}${v.ikon}.png" alt=""><span>${v.rumah ? v.kapan : `${v.kapan} · ${v.tempat}`}</span></div>
      <h3>${v.judul}</h3>
      ${v.label ? `<span class="label">${v.label}</span>` : ""}
      <p>${v.isi}</p>
      ${proyek}
      ${v.tautan ? `<a class="lanjut" href="${v.tautan}">${v.teks}</a>` : ""}
    </div>`;
}
function tandai(v) {
  document.querySelectorAll(".kini,.titik-kini").forEach((e) => e.classList.remove("kini", "titik-kini"));
  document.querySelectorAll(".daftar-henti button").forEach((b) => b.setAttribute("aria-current", !!v && b.dataset.id === v.id));
  if (v) { if (lembar[v.id]) lembar[v.id].classList.add("kini"); pin[v.id].g.classList.add("kini"); }
}
function kunjungi(v) {
  tandai(v); tampilKartu(v);
  return pergi(titikDari(v), pulauKunjungan(v), v.titik ? 120 : 90);
}
function jelajah(k) {
  tandai(null);
  lembar[k.id].classList.add("titik-kini");
  kartu.innerHTML = `<div class="isi"><div class="meta"><img src="${GAMBAR}orang-1.png" alt=""><span>${k.p}</span></div><h3>${k.n}</h3><p class="kosong">I have not been here yet.</p><p class="sisa">${514 - dikunjungi.size} districts and cities still to visit.</p></div>`;
  return pergi(k.c, pulauDari(k.id));
}
svg.addEventListener("click", (e) => {
  const sasaran = e.target.closest("[data-id]");
  if (!sasaran) return;
  berhentiTur();
  const id = sasaran.dataset.id;
  if (id === "MY") { // Malaysia punya dua perhentian: pilih yang paling dekat dengan klik
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(svg.getScreenCTM().inverse());
    const [a, b] = KUNJUNGAN.filter((v) => v.pulau && v.titik);
    return kunjungi(Math.hypot(a.titik[0] - p.x, a.titik[1] - p.y) < Math.hypot(b.titik[0] - p.x, b.titik[1] - p.y) ? a : b);
  }
  const v = KUNJUNGAN.find((x) => x.id === id);
  if (v) kunjungi(v); else if (kab[id]) jelajah(kab[id]);
});

// Perbesar dan tur
const zum = (f) => { tugas++; cam = pandang(cam.x + cam.w / 2, cam.y + cam.h / 2, cam.w * f); gambarKamera(); };
ambil("z-tambah").onclick = () => zum(.65);
ambil("z-kurang").onclick = () => zum(1.5);
ambil("z-awal").onclick = () => { tugas++; cam = pandang(240, 100, 480); gambarKamera(); };
let turJalan = false;
const tunda = (ms) => new Promise((r) => setTimeout(r, ms));
function berhentiTur() { turJalan = false; ambil("tur").textContent = "Walk the whole journey"; }
ambil("tur").onclick = async () => {
  if (turJalan) return berhentiTur();
  turJalan = true; ambil("tur").textContent = "Stop";
  for (const v of KUNJUNGAN) {
    if (!turJalan) return;
    const ok = await kunjungi(v);
    if (!ok || !turJalan) return;
    await tunda(hemat ? 800 : 1900);
  }
  berhentiTur();
};

// Hitungan
const dikunjungi = new Set(KUNJUNGAN.filter((v) => !v.titik).map((v) => v.id));
ambil("hit-kab").textContent = dikunjungi.size;
ambil("hit-bar").style.width = `${(dikunjungi.size / 514) * 100}%`;
ambil("hit-luar").textContent = `plus ${KUNJUNGAN.length - dikunjungi.size} cities in Malaysia`;

cam = pandang(240, 100, 480);
addEventListener("resize", () => { cam = pandang(cam.x + cam.w / 2, cam.y + cam.h / 2, cam.w); gambarKamera(); });
gambarKamera();
tandai(KUNJUNGAN[0]);
tampilKartu(KUNJUNGAN[0]);
})();
