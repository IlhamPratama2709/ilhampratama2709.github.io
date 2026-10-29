// Isi tabel riset, bidang, dan grafik metode. Tambah paper baru cukup di daftar RISET.
const D = "https://drive.google.com/drive/folders/";
const BIDANG = [
  { t: "reg", nama: "Regional & urban", ikon: "reg", ket: "Toll roads, SEZs, regional growth" },
  { t: "env", nama: "Environment & energy", ikon: "env", ket: "Power plants, renewables, emissions" },
  { t: "dev", nama: "Development & policy", ikon: "dev", ket: "Social assistance, public spending" },
  { t: "lab", nama: "Labour & firms", ikon: "lab", ket: "Jobs, MSMEs, farmer succession" },
];
// [tahun, judul, ajang, cakupan, metode, hasil, topik, tautan]
const RISET = [
  [2025, "Paving the Way, Sustaining Hope: the Trans-Java Toll Road and East Java's economy", "EJAVEC, BI East Java", "30 districts, East Java", "Staggered DiD, QGIS", "1st", ["reg", "dev"], D + "1uC9JmEj6kYn9F45ns69kg-oHdkfTuZY1"],
  [2025, "When Spillovers Don't Spill: heterogeneous effects of SEZs in Sumatra", "7th Sumatranomics, BI North Sumatra", "154 districts, Sumatra", "Staggered DiD, panel FE", "2nd", ["reg"], D + "10jnVVOmJh2rUiqU8_geWk38uhrGXIBLg"],
  [2025, "Illuminating Downstreaming: SEZs and industrial estates in Sulampua", "Aksinomi Sulampua, BI South Sulawesi", "104 districts, Sulampua", "Staggered DiD, NTL", "2nd", ["reg"], D + "1JDZW6Fr6wlXxAnTlXOBfcEwfrEWPnhjz"],
  [2025, "Investment acceleration in Papua's new autonomous regions", "BAKU PANDAI, BI Papua", "New provinces, Papua", "LQ, shift-share", "1st", ["reg", "dev"], D + "12IpqYRGb5PKY8FzJsbHgR0ecel3A2DFn"],
  [2025, "Beyond Megadams: ASHARE, community-scale hydropower in ASEAN", "ASEAN Energy Youth Awards", "ASEAN", "Cost-benefit, policy design", "1st", ["env", "dev"], D + "1lR7BCJoVCx0V04G-SrbuCG3lCloWAY-F"],
  [2025, "Climate adaptation, PPP investment, and the renewable energy transition", "Purnomo Yusgiantoro Center", "214 countries", "Panel RE", "1st", ["env"], D + "1ZREd8SFRDNU_pdkqsHj2mFGwd-d-xm1G"],
  [2025, "Indonesia's energy dilemma: power plants, growth, and emissions", "CORE Indonesia", "Districts, Indonesia", "Staggered DiD, QGIS", "3rd", ["env"], D + "1UV52JhkpQH1kLXI5dAD8dG3SND9OJJdg"],
  [2025, "Tracing the economic footprints of tourism in Yogyakarta", "Jogja Economic Symposium, BI Yogyakarta", "Yogyakarta", "Input-output, LQ, OLS", "Submitted", ["reg", "dev"], ""],
  [2025, "Addressing student hunger: PIP, PKH, and food security", "EQUITAS, UGM", "Households, Indonesia", "Regression", "4th", ["dev"], D + "173uQh_IHYAbkirnOtEf4DiZdym2mwSh0"],
  [2025, "R&D investment and employment across ICT layers", "22nd Economix", "2,500 firms, 55 countries", "Panel FE", "4th, best presenter", ["lab"], D + "1fZXRW2p5Mx-6Gpb7s9LY48_CFpIm7XUT"],
  [2024, "The Trans-Sumatra Toll Road and Sumatra's economy", "5th and 6th Sumatranomics, BI North Sumatra", "132 districts, Sumatra", "DiD, long difference, QGIS", "2nd", ["reg"], D + "1LxL8SWhTDcNhXDWfCkc8Rvshu3zn9V0r"],
  [2024, "Urban areas and Papua's economy", "Papedanomics, BI West Papua", "8 districts, Papua", "LQ, shift-share", "1st", ["reg", "dev"], D + "1SGwxmb5rLxnqPlTDCGPhzBA_Qpw8ItNw"],
  [2024, "Infrastructure investment, local content (TKDN), and growth", "Indonesia Economics Olympiad, FEB UI", "Indonesia", "Policy essay, cost-benefit", "Grand champion", ["dev", "lab"], D + "1QbsSs1YuHylx0cl5XJw-v5bFolys61bE"],
  [2024, "Seeds of Change: farmer succession in Bali", "PENSAR, Kanopi FEB UI", "69 farm households, Tabanan", "Probit, interviews", "Fieldwork", ["lab", "dev"], "https://drive.google.com/file/d/1mOmF5fr7q78fdtAJbCfZE90Oyb-QLWxf/view"],
  [2023, "Digital payment use among MSMEs in Yogyakarta", "PENSAR, Kanopi FEB UI", "150 respondents, Malioboro", "Logit, survey", "Fieldwork", ["lab"], "https://drive.google.com/file/d/1izLhpKzmDImSsq8G0cXNSOKzO8d1NKii/view"],
];
// jumlah paper di RISET yang memakai tiap metode
const METODE = [["Staggered DiD / DiD", 5], ["Spatial data (QGIS, NTL)", 5], ["Panel FE / RE", 4], ["LQ and shift-share", 3], ["Logit / probit", 2], ["Primary survey", 2], ["Cost-benefit analysis", 2], ["Input-output", 1]];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const jumlah = (t) => RISET.filter((r) => r[6].includes(t)).length;

document.getElementById("bidang").innerHTML = BIDANG.map((b) =>
  `<a href="#riset" data-t="${b.t}"><img src="images/ikon/${b.ikon}.svg" alt=""><div><b>${b.nama}</b><span>${jumlah(b.t)} papers · ${b.ket}</span></div></a>`).join("");

const saring = document.getElementById("saring");
saring.innerHTML = `<button aria-pressed="true" data-t="semua">All (${RISET.length})</button>` + BIDANG.map((b) =>
  `<button aria-pressed="false" data-t="${b.t}"><img src="images/ikon/${b.ikon}.svg" alt="">${b.nama}</button>`).join("");

const tb = document.getElementById("isi-riset");
function gambar(t) {
  saring.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", x.dataset.t === t));
  tb.innerHTML = RISET.filter((r) => t === "semua" || r[6].includes(t)).map((r) => {
    const judul = r[7] ? `<a href="${r[7]}">${esc(r[1])}</a>` : `<b>${esc(r[1])}</b>`;
    const juara = /^(1st|2nd|3rd|4th|Grand)/.test(r[5]);
    return `<tr><td class="th">${r[0]}</td><td class="judul">${judul}<span>${esc(r[2])}</span></td><td>${esc(r[3])}</td><td>${esc(r[4])}</td><td class="hasil${juara ? " juara" : ""}">${esc(r[5])}</td></tr>`;
  }).join("");
}
gambar("semua");
saring.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) gambar(b.dataset.t); });
document.getElementById("bidang").addEventListener("click", (e) => { const a = e.target.closest("a"); if (a) gambar(a.dataset.t); });

const maks = Math.max(...METODE.map((m) => m[1]));
document.getElementById("bar-metode").innerHTML = METODE.map(([n, v]) =>
  `<div class="bar-baris"><span>${n}</span><div><div class="bar" style="width:${(v / maks) * 100}%"></div></div><span class="n">${v}</span></div>`).join("");
