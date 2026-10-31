// Ilham's Journey. Kunjungan baru cukup satu baris di KUNJUNGAN: id = kode wilayah dari peta-data.js, atau titik [x, y] untuk luar negeri.
(() => {
const KUNJUNGAN = [
  { id: "31.71", tempat: "Jakarta and Depok", kapan: "Home base", ikon: "monas", foto: "images/perjalanan/kota/jakarta.jpg", posisi: "50% 36%", kredit: "Indies1, CC BY 4.0", sumber: "https://commons.wikimedia.org/wiki/File:Jakarta_-_National_Monument.jpg", judul: "Home base: Jakarta and Depok", isi: "Most of my desk research happens here. Pick a project to read about it.", rumah: true },
  { id: "34.71", tempat: "Yogyakarta", kapan: "January 2023", ikon: "tugu", label: "PENSAR 2023", foto: "images/perjalanan/kota/yogyakarta.jpg", posisi: "50% 72%", kredit: "Chainwit., CC BY 4.0", sumber: "https://commons.wikimedia.org/wiki/File:Jogja_-_Tugu_Monument_(2025)_-_img_06.jpg", judul: "Malioboro merchants follow their neighbours", isi: "I was an enumerator on a survey of 75 merchants and 75 customers about digital payment.", tautan: "riset/pensar-yogyakarta.html", teks: "Read the summary", baca: ["tourism-footprints-yogyakarta"] },
  { id: "51.02", tempat: "Tabanan, Bali", kapan: "January 2024", ikon: "meru", label: "PENSAR 2024", foto: "images/perjalanan/kota/tabanan.jpg", posisi: "50% 60%", kredit: "CEphoto, Uwe Aranas, CC BY-SA 3.0", sumber: "https://commons.wikimedia.org/wiki/File:Tabanan-Regency_Indonesia_Rice-paddies-05.jpg", judul: "Few Tabanan farms have a successor", isi: "I joined the research team for a survey of 69 farm households on who will take over the rice fields.", tautan: "riset/pensar-bali.html", teks: "Read the summary" },
  { id: "92.02", tempat: "Manokwari, West Papua", kapan: "September 2024", ikon: "kakiseribu", label: "1st place · Papedanomics", foto: "images/perjalanan/kota/manokwari.jpg", posisi: "50% 40%", kredit: "Elton Airori, CC BY-SA 4.0", sumber: "https://commons.wikimedia.org/wiki/File:Pegunungan_Arfak_di_Manokwari.jpg", judul: "Urban areas and Papua's economy", isi: "My team presented a paper on the leading sectors of eight regencies and cities on the island of Papua.", tautan: "riset/urban-areas-papua-economy.html", teks: "Read the summary", baca: ["investment-acceleration-papua"] },
  { id: "13.71", tempat: "Padang, West Sumatra", kapan: "2024", ikon: "gadang", label: "2nd place · 5th Sumatranomics", foto: "images/perjalanan/kota/padang.jpg", posisi: "50% 62%", kredit: "SpartacksCompatriot, CC BY 3.0", sumber: "https://commons.wikimedia.org/wiki/File:Batang_Arau_river.JPG", judul: "The Trans-Sumatra Toll Road", isi: "I presented a paper on what the toll road has done for 132 districts in Sumatra.", tautan: "riset/trans-sumatra-toll-road.html", teks: "Read the summary", baca: ["when-spillovers-dont-spill"] },
  { id: "19.04", tempat: "Bangka Tengah, Bangka Belitung", kapan: "January 2025", ikon: "ikan", label: "PENSAR 2025", foto: "images/perjalanan/kota/bangka.jpg", posisi: "50% 55%", kredit: "Cun Cun, CC BY-SA 4.0", sumber: "https://commons.wikimedia.org/wiki/File:Kurau_fishing_village.jpg", judul: "Residents back tourism but take little part", isi: "I led the research team for a survey of 193 residents in two villages as the island looks beyond tin.", tautan: "riset/pensar-bangka.html", teks: "Read the summary" },
  { id: "91.71", tempat: "Jayapura, Papua", kapan: "June 2025", ikon: "cenderawasih", label: "1st place · BAKU PANDAI", foto: "images/perjalanan/kota/jayapura.jpg", posisi: "50% 50%", kredit: "Nekomong, CC BY-SA 4.0", sumber: "https://commons.wikimedia.org/wiki/File:Kota_Jayapura,_Papua.jpg", judul: "Investment in Papua's new provinces", isi: "Our paper on sectors in the new provinces won the student category, and the award was given at Festival Cenderawasih.", tautan: "riset/investment-acceleration-papua.html", teks: "Read the summary", baca: ["urban-areas-papua-economy"] },
  { id: "12.71", fotoAcara: "images/web/lapangan-3.jpg", ketAcara: "Award photo, 6th Sumatranomics", tempat: "Medan, North Sumatra", kapan: "2025", ikon: "maimun", label: "2nd place · 6th Sumatranomics", foto: "images/perjalanan/kota/medan.jpg", posisi: "50% 45%", kredit: "Rafliyan18, CC BY 4.0", sumber: "https://commons.wikimedia.org/wiki/File:Istana_Maimun_Kota_Medan_17.jpg", judul: "When spillovers don't spill", isi: "I presented a paper on why gains from special economic zones are uneven across 154 districts and cities in Sumatra.", tautan: "riset/when-spillovers-dont-spill.html", teks: "Read the summary", baca: ["trans-sumatra-toll-road"] },
  { id: "35.78", fotoAcara: "images/web/lapangan-2.jpg", ketAcara: "At the EJAVEC final, Surabaya", tempat: "Surabaya, East Java", kapan: "August 2025", ikon: "sura", label: "1st place · EJAVEC", foto: "images/perjalanan/kota/surabaya.jpg", posisi: "50% 72%", kredit: "Ya, saya inBaliTimur, CC BY-SA 2.0", sumber: "https://commons.wikimedia.org/wiki/File:Menjulang_di_balik_puing_abadi_(34508575375).jpg", judul: "The Trans-Java Toll Road", isi: "I presented a paper at the EJAVEC final on the toll road and the economy of 30 regencies and cities in East Java.", tautan: "riset/trans-java-toll-road.html", teks: "Read the summary" },
  { id: "KCH", tempat: "Kuching, Sarawak", kapan: "September 2025", ikon: "kucing", label: "1st place · ASEAN Energy Youth Awards", foto: "images/perjalanan/kota/kuching.jpg", posisi: "50% 55%", kredit: "JKT-c, CC BY 3.0", sumber: "https://commons.wikimedia.org/wiki/File:Kuching_Cat_Statue_-_01.JPG", judul: "Beyond Megadams", isi: "My team won the policy pitch track with ASHARE, a framework for community-scale hydropower in ASEAN.", titik: [163.5, 64.5], pulau: "kalimantan", tautan: "riset/beyond-megadams-ashare.html", teks: "Read the summary" },
  { id: "KUL", tempat: "Kuala Lumpur", kapan: "October 2025", ikon: "menara", label: "Speaker · AEBF-25", foto: "images/perjalanan/kota/kuala-lumpur.jpg", posisi: "50% 34%", kredit: "CEphoto, Uwe Aranas, CC BY-SA 3.0", sumber: "https://commons.wikimedia.org/wiki/File:Kuala_Lumpur_Malaysia_Petronas-Twin-Towers-01.jpg", judul: "ASHARE at the ASEAN Energy Business Forum", isi: "I presented our pitch at the 25th ASEAN Energy Business Forum, in a session on youth contributions to the energy transition.", titik: [76.9, 48.6], pulau: "semenanjung", tautan: "riset/beyond-megadams-ashare.html", teks: "Read the summary" },
  { id: "18.71", tempat: "Bandar Lampung, Lampung", kapan: "2026", ikon: "siger", label: "IRSA 2026", foto: "images/perjalanan/kota/bandar-lampung.jpg", posisi: "50% 50%", kredit: "22Kartika, CC BY-SA 3.0", sumber: "https://commons.wikimedia.org/wiki/File:Bandar_Lampung.JPG", judul: "Spillover or Still Over?", isi: "I presented my thesis at the IRSA conference, on special economic zones and their traces in light and air quality.", tautan: "riset/spillover-or-still-over.html", teks: "Read the summary" },
];
// Proyek di meja kerja, muncul saat Home diklik. Tambah proyek baru di sini; yang punya baris di RISET cukup ditulis potongan judulnya.
const PROYEK_RUMAH = [
  { judul: "Spillover or Still Over? (bachelor's thesis)", tautan: "riset/spillover-or-still-over.html" },
  { judul: "KOMITMEN dashboard site", tautan: "proyek/komitmen-dashboard.html" },
  { cari: "Climate adaptation" }, { cari: "energy dilemma" }, { cari: "R&D investment" }, { cari: "Infrastructure investment" }, { cari: "student hunger" },
  { judul: "Digital finance and food welfare", tautan: "riset/digital-finance-food-welfare.html" },
].map((p) => {
  if (!p.cari) return p;
  const r = RISET.find((x) => x[1].includes(p.cari));
  return r ? { judul: r[1], tautan: r[7] } : null;
}).filter(Boolean);

// Paper tentang suatu wilayah. Dipakai di kartu kota dan di kabupaten yang belum dikunjungi.
const PAPER = {
  "when-spillovers-dont-spill": "When spillovers don't spill: SEZs in Sumatra",
  "trans-sumatra-toll-road": "The Trans-Sumatra Toll Road and Sumatra's economy",
  "trans-java-toll-road": "The Trans-Java Toll Road and East Java's economy",
  "tourism-footprints-yogyakarta": "Tracing the footprints of tourism in Yogyakarta",
  "illuminating-downstreaming": "Illuminating downstreaming: SEZs and industrial estates in Sulampua",
  "investment-acceleration-papua": "Investment acceleration in Papua's new provinces",
  "urban-areas-papua-economy": "Urban areas and Papua's economy",
};
const daftarPaper = (l) => `<ul class="daftar-rumah">${l.map((s) => `<li><a href="riset/${s}.html">${PAPER[s]}</a></li>`).join("")}</ul>`;
function paperWilayah(id) { // dua angka pertama kode wilayah adalah kode provinsi BPS
  const n = Number(id.slice(0, 2));
  if (n < 20 || n === 21) return ["when-spillovers-dont-spill", "trans-sumatra-toll-road"];
  if (n === 34) return ["tourism-footprints-yogyakarta"];
  if (n === 35) return ["trans-java-toll-road"];
  if (n >= 71 && n < 90) return ["illuminating-downstreaming"];
  if (n === 92 || n === 96) return ["illuminating-downstreaming", "urban-areas-papua-economy"];
  if (n >= 90) return ["investment-acceleration-papua", "urban-areas-papua-economy"];
  return [];
}

const KEPALA = 34, UKURAN_PIN = 26; // piksel layar, tetap sama saat peta diperbesar
const JAUH = 70, DEKAT = 6, LEBAR_MIN = 14; // unit peta: 10 unit = 1 derajat
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
  const dekat = cam.w < 479;
  svg.style.touchAction = dekat ? "none" : "pan-y"; // peta utuh: satu jari tetap menggulir halaman
  svg.classList.toggle("bisa-geser", dekat);
}
function pandang(x, y, w) {
  w = Math.max(LEBAR_MIN, Math.min(480, w));
  const h = w * rasio();
  return { x: Math.max(0, Math.min(480 - w, x - w / 2)), y: h >= 200 ? (200 - h) / 2 : Math.max(0, Math.min(200 - h, y - h / 2)), w, h };
}

// Perjalanan: jalan kaki untuk jarak dekat, kereta di Jawa, mobil di satu pulau, pesawat antarpulau atau jarak jauh.
let tugas = 0, kameraBebas = false;
const lembut = (t) => t * t * (3 - 2 * t);
function pergi(ke, pulauKe, lebarAkhir) {
  return new Promise((selesai) => {
    const nomor = ++tugas, dari = pos.slice(), dx = ke[0] - dari[0], dy = ke[1] - dari[1], jarak = Math.hypot(dx, dy);
    const camDari = { ...cam }, camKe = pandang(ke[0], ke[1], lebarAkhir || cam.w);
    kameraBebas = false;
    const cara = moda(pulauKini, pulauKe, jarak);
    if (Math.abs(dx) > .5) arah = dx > 0 ? 1 : -1;
    pulauKini = pulauKe;
    svg.dataset.moda = cara;
    const lama = hemat ? 0 : Math.min(2600, 700 + jarak * 13), mulai = performance.now();
    const langkah = () => {
      if (nomor !== tugas) return selesai(false);
      const t = lama ? Math.min(1, (performance.now() - mulai) / lama) : 1, e = lembut(t);
      pos = [dari[0] + dx * e, dari[1] + dy * e];
      if (!kameraBebas) ["x", "y", "w", "h"].forEach((k) => { cam[k] = camDari[k] + (camKe[k] - camDari[k]) * e; });
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
  kartu.innerHTML = `<div class="bingkai-foto"><img class="foto" src="${v.foto}" alt="${v.tempat}" style="object-position:${v.posisi}"><a class="kredit" href="${v.sumber}">${v.kredit}</a></div>
    <div class="isi">
      <div class="meta"><img src="${GAMBAR}${v.ikon}.png" alt=""><span>${v.rumah ? v.kapan : `${v.kapan} · ${v.tempat}`}</span></div>
      <h3>${v.judul}</h3>
      ${v.label ? `<span class="label">${v.label}</span>` : ""}
      <p>${v.isi}</p>
      ${proyek}
      ${v.tautan ? `<a class="lanjut" href="${v.tautan}">${v.teks}</a>` : ""}
      ${v.baca ? `<p class="sisa">Also on this region:</p>${daftarPaper(v.baca)}` : ""}
      ${v.fotoAcara ? `<details class="foto-acara"><summary>${v.ketAcara}</summary><img src="${v.fotoAcara}" alt="${v.ketAcara}" loading="lazy"></details>` : ""}
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
  kartu.innerHTML = `<div class="isi"><div class="meta"><img src="${GAMBAR}orang-1.png" alt=""><span>${k.p}</span></div><h3>${k.n}</h3><p class="kosong">I have not been here yet.</p>${paperWilayah(k.id).length ? `<p class="sisa">But my research covers this region:</p>${daftarPaper(paperWilayah(k.id))}` : ""}<p class="sisa">${514 - dikunjungi.size} districts and cities still to visit.</p></div>`;
  return pergi(k.c, pulauDari(k.id));
}
svg.addEventListener("click", (e) => {
  if (digeser) { digeser = false; return; } // akhir geseran bukan klik
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

// Perbesar dan geser: pinch trackpad, Ctrl + gulir, cubit di layar sentuh, seret, dan keyboard.
const batas = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
function aturKamera(x, y, w) {
  w = batas(w, LEBAR_MIN, 480);
  const h = w * rasio();
  cam = { x: batas(x, 0, 480 - w), y: h >= 200 ? (200 - h) / 2 : batas(y, 0, 200 - h), w, h };
  kameraBebas = true;
  gambarKamera();
}
function zumDi(px, py, f) { // titik di bawah kursor tetap di tempatnya
  const r = svg.getBoundingClientRect(), u = (px - r.left) / r.width, v = (py - r.top) / r.height;
  const x = cam.x + u * cam.w, y = cam.y + v * cam.h, w = batas(cam.w * f, LEBAR_MIN, 480);
  aturKamera(x - u * w, y - v * w * rasio(), w);
}
function zumTengah(f) { const r = svg.getBoundingClientRect(); zumDi(r.left + r.width / 2, r.top + r.height / 2, f); }
function geser(dxPx, dyPx) {
  const r = svg.getBoundingClientRect();
  aturKamera(cam.x - dxPx / r.width * cam.w, cam.y - dyPx / r.height * cam.h, cam.w);
}
ambil("z-tambah").onclick = () => zumTengah(.65);
ambil("z-kurang").onclick = () => zumTengah(1.5);
ambil("z-awal").onclick = () => aturKamera(0, 0, 480);
svg.addEventListener("wheel", (e) => { // pinch trackpad terbaca sebagai gulir dengan ctrlKey; gulir biasa tetap untuk halaman
  if (!e.ctrlKey && !e.metaKey) return;
  e.preventDefault();
  zumDi(e.clientX, e.clientY, Math.exp(e.deltaY * .012));
}, { passive: false });
let skalaGestur = 1; // Safari di Mac memakai gesture event
svg.addEventListener("gesturestart", (e) => { e.preventDefault(); skalaGestur = 1; });
svg.addEventListener("gesturechange", (e) => {
  e.preventDefault();
  zumDi(e.clientX, e.clientY, skalaGestur / e.scale);
  skalaGestur = e.scale;
});
const jari = new Map();
let digeser = false, jarakCubit = 0;
svg.addEventListener("pointerdown", (e) => {
  jari.set(e.pointerId, [e.clientX, e.clientY]);
  digeser = false; jarakCubit = 0;
});
svg.addEventListener("pointermove", (e) => {
  const lama = jari.get(e.pointerId);
  if (!lama) return;
  const baru = [e.clientX, e.clientY];
  if (jari.size === 2) {
    jari.set(e.pointerId, baru);
    const [a, b] = [...jari.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]);
    if (jarakCubit) zumDi((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, jarakCubit / d);
    jarakCubit = d; digeser = true;
    return;
  }
  const dx = baru[0] - lama[0], dy = baru[1] - lama[1];
  if (!digeser && Math.hypot(dx, dy) < 5) return;
  jari.set(e.pointerId, baru);
  if (cam.w >= 479) return;
  digeser = true;
  geser(dx, dy);
  try { svg.setPointerCapture(e.pointerId); } catch (_) {} // seret tetap jalan walau kursor keluar peta
});
["pointerup", "pointercancel", "pointerleave"].forEach((n) => svg.addEventListener(n, (e) => { jari.delete(e.pointerId); jarakCubit = 0; }));
svg.addEventListener("keydown", (e) => {
  const k = { "+": () => zumTengah(.75), "=": () => zumTengah(.75), "-": () => zumTengah(1.33), "0": () => aturKamera(0, 0, 480), ArrowLeft: () => geser(60, 0), ArrowRight: () => geser(-60, 0), ArrowUp: () => geser(0, 60), ArrowDown: () => geser(0, -60) }[e.key];
  if (k) { e.preventDefault(); k(); }
});

// Tur
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
