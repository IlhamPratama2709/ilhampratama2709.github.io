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
  [2025, "Paving the Way, Sustaining Hope: the Trans-Java Toll Road and East Java's economy", "EJAVEC, BI East Java", "30 districts, East Java", "Staggered DiD, QGIS", "1st", ["reg", "dev"], "riset/trans-java-toll-road.html"],
  [2025, "When Spillovers Don't Spill: heterogeneous effects of SEZs in Sumatra", "6th Sumatranomics, BI North Sumatra", "154 districts, Sumatra", "Staggered DiD, panel FE", "2nd", ["reg"], "riset/when-spillovers-dont-spill.html"],
  [2025, "Illuminating Downstreaming: SEZs and industrial estates in Sulampua", "Aksinomi Sulampua, BI South Sulawesi", "104 districts, Sulampua", "Staggered DiD, NTL", "2nd", ["reg"], "riset/illuminating-downstreaming.html"],
  [2025, "Investment acceleration in Papua's new autonomous regions", "BAKU PANDAI, BI Papua", "New provinces, Papua", "LQ, shift-share", "1st", ["reg", "dev"], "riset/investment-acceleration-papua.html"],
  [2025, "Beyond Megadams: ASHARE, community-scale hydropower in ASEAN", "ASEAN Energy Youth Awards", "ASEAN", "Cost-benefit, policy design", "1st", ["env", "dev"], "riset/beyond-megadams-ashare.html"],
  [2025, "Climate adaptation, PPP investment, and the renewable energy transition", "Purnomo Yusgiantoro Center", "214 countries", "Panel RE", "1st", ["env"], "riset/climate-adaptation-ppp-renewables.html"],
  [2025, "Indonesia's energy dilemma: power plants, growth, and emissions", "CORE Indonesia", "Districts, Indonesia", "Staggered DiD, QGIS", "3rd", ["env"], "riset/indonesias-energy-dilemma.html"],
  [2025, "Unveiling local support: community views on tourism in Bangka", "PENSAR, Kanopi FEB UI", "193 respondents, Bangka Tengah", "Ordered logit, LQ, shift-share", "Fieldwork", ["reg", "dev"], "riset/pensar-bangka.html"],
  [2025, "Tracing the economic footprints of tourism in Yogyakarta", "Jogja Economic Symposium, BI Yogyakarta", "Yogyakarta", "Input-output, LQ, OLS", "Submitted", ["reg", "dev"], "riset/tourism-footprints-yogyakarta.html"],
  [2025, "Addressing student hunger: PIP, PKH, and food security", "EQUITAS, UGM", "Households, Indonesia", "Regression", "4th", ["dev"], "riset/addressing-student-hunger.html"],
  [2025, "R&D investment and employment across ICT layers", "22nd Economix", "2,500 firms, 55 countries", "Panel FE", "4th, best presenter", ["lab"], "riset/rd-investment-employment-ict.html"],
  [2024, "The Trans-Sumatra Toll Road and Sumatra's economy", "5th Sumatranomics, BI North Sumatra", "132 districts, Sumatra", "DiD, long difference, QGIS", "2nd", ["reg"], "riset/trans-sumatra-toll-road.html"],
  [2024, "Urban areas and Papua's economy", "Papedanomics, BI West Papua", "8 districts, Papua", "LQ, shift-share", "1st", ["reg", "dev"], "riset/urban-areas-papua-economy.html"],
  [2024, "Infrastructure investment, local content (TKDN), and growth", "Indonesia Economic Outlook, FEB UI", "Indonesia", "Policy essay, cost-benefit", "Grand champion", ["dev", "lab"], "riset/infrastructure-local-content-growth.html"],
  [2024, "Seeds of Change: farmer succession in Bali", "PENSAR, Kanopi FEB UI", "69 farm households, Tabanan", "Probit, interviews", "Fieldwork", ["lab", "dev"], "riset/pensar-bali.html"],
  [2023, "Digital payment use among MSMEs in Yogyakarta", "PENSAR, Kanopi FEB UI", "150 respondents, Malioboro", "Logit, survey", "Fieldwork", ["lab"], "riset/pensar-yogyakarta.html"],
];
// jumlah paper di RISET yang memakai tiap metode
const METODE = [["Staggered DiD / DiD", 5], ["Spatial data (QGIS, NTL)", 5], ["Panel FE / RE", 4], ["LQ and shift-share", 4], ["Logit / probit", 3], ["Primary survey", 3], ["Cost-benefit analysis", 2], ["Input-output", 1]];

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
