// Kalkulator campuran biodiesel: kebutuhan FAME, CPO, lahan sawit, emisi yang dihemat, dan gambut yang menghapusnya.
// Parameter dari sumber publik (lihat tabel asumsi di halaman). Semua hitungan linear terhadap tingkat campuran.
(() => {
  const akar = document.getElementById("kalkulator");
  if (!akar) return;

  const P = {
    solar: 35.7,      // permintaan solar transportasi, juta kL/th
    densitas: 0.88,   // densitas FAME, t/kL
    emisiB40: 40,     // Mt CO2e/th yang dihemat pada B40 (ESDM), linear
    produktivitas: 4, // t CPO/ha/th
    gambutSekali: 640,  // t CO2/ha, sekali lepas saat hutan rawa gambut dibuka
    gambutTahunan: 100  // t CO2e/ha/th, rata-rata 25 tahun drainase
  };

  const geser = akar.querySelector("#campuran");
  const tombolRendemen = [...akar.querySelectorAll("[data-rendemen]")];
  let rendemen = 0.85;

  const fmt = (x, d) => x.toLocaleString("en-GB", { minimumFractionDigits: d, maximumFractionDigits: d });
  const isi = (id, teks) => { akar.querySelector("#" + id).textContent = teks; };

  const svg = akar.querySelector("#kalk-batang");
  const NS = "http://www.w3.org/2000/svg";
  const baris = [
    { kunci: "lahan", label: "Oil palm land equivalent", kelas: "kb-lahan" },
    { kunci: "tahunan", label: "Drained peat, emitting every year", kelas: "kb-tahunan" },
    { kunci: "sekali", label: "Peat forest cleared once", kelas: "kb-sekali" }
  ];
  const L = 400, X0 = 0, TINGGI = 46;
  const maksLahan = P.solar * 0.7 * P.densitas / 0.85 / P.produktivitas * 1e6; // skala tetap: B70, rendemen terendah
  baris.forEach((b, i) => {
    const g = document.createElementNS(NS, "g");
    g.setAttribute("transform", `translate(0 ${i * TINGGI})`);
    g.innerHTML = `<text class="gr-label" x="0" y="13">${b.label}</text>` +
      `<rect class="kb-latar" x="0" y="19" width="${L}" height="14"></rect>` +
      `<rect class="${b.kelas}" x="0" y="19" height="14" width="0"></rect>` +
      `<text class="gr-kecil kb-angka" x="${L}" y="13" text-anchor="end"></text>`;
    svg.appendChild(g);
    b.g = g;
  });

  function hitung() {
    const c = Number(geser.value) / 100;
    const biodiesel = P.solar * c;                 // juta kL
    const fame = biodiesel * P.densitas;           // juta t
    const cpo = fame / rendemen;                   // juta t
    const lahan = cpo / P.produktivitas;           // juta ha
    const emisi = P.emisiB40 * (c / 0.4);          // Mt CO2e/th
    const sekali = emisi * 1e6 / P.gambutSekali;   // ha
    const tahunan = emisi * 1e6 / P.gambutTahunan; // ha

    isi("kalk-b", "B" + geser.value);
    geser.setAttribute("aria-valuetext", `B${geser.value}, ${geser.value} percent biodiesel`);
    isi("o-biodiesel", fmt(biodiesel, 1));
    isi("o-cpo", fmt(cpo, 1));
    isi("o-lahan", fmt(lahan, 2));
    isi("o-emisi", fmt(emisi, 0));
    isi("o-sekali", fmt(Math.round(sekali / 100) * 100, 0));
    isi("o-tahunan", fmt(Math.round(tahunan / 1000) * 1000, 0));

    const nilai = { lahan: lahan * 1e6, tahunan, sekali };
    baris.forEach((b) => {
      const v = nilai[b.kunci];
      b.g.querySelector("rect:not(.kb-latar)").setAttribute("width", Math.max(v / maksLahan * L, v > 0 ? 1.5 : 0));
      b.g.querySelector(".kb-angka").textContent = fmt(Math.round(v / 1000), 0) + " thousand ha";
    });
    const rasio = sekali > 0 ? Math.round(lahan * 1e6 / sekali) : 0;
    isi("kalk-rasio", sekali > 0
      ? `At B${geser.value}, clearing peat forest equal to 1/${rasio} of the oil palm area would cancel a full year of savings.`
      : "At B0 there is no biodiesel, so there are no savings to cancel.");
  }

  geser.addEventListener("input", hitung);
  tombolRendemen.forEach((t) => t.addEventListener("click", () => {
    rendemen = Number(t.dataset.rendemen);
    tombolRendemen.forEach((u) => u.setAttribute("aria-pressed", String(u === t)));
    hitung();
  }));
  hitung();
})();
