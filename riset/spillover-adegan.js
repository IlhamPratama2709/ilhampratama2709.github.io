// Cerita skripsi "Spillover or Still Over?" untuk mesin adegan.
// Angka disalin dari tabel temuan di riset/spillover-or-still-over.html.
(function () {
  const A = Adegan.alat;
  const { U, iso, f1 } = A;

  const R = [4.6, 7.6, 10.6, 13.6];          // batas cincin 30, 60, 90, 120 km (dalam petak)
  const DALAM = [0, 4.6, 7.6, 10.6];
  const TANAH = 15.2;
  const PAGAR = 2.2;
  const WARGA = { dari: [-6, 9.5], ke: [-1.5, 5.5] };
  const PENELITI = { dari: [0.6, 12.5], ke: [1.9, 3.4] };

  const DATA = {
    semua: { nama: "All zones", baris: [[0.024, 0.024, false], [0.008, 0.005, false], [0.129, 0.814, false]] },
    manufaktur: { nama: "Manufacturing", baris: [[0.035, 0.031, false], [0.007, 0.005, false], [-0.611, 1.163, false]] },
    pariwisata: { nama: "Tourism", baris: [[0.006, 0.036, false], [0.044, 0.022, true], [1.725, 0.704, true]] }
  };
  const UKURAN = ["Night-time light (log)", "CO₂ (log)", "NO₂ (µmol/m²)"];
  const CINCIN = [
    { label: "0–30 km", cahaya: [0.052, 0.094], co2: [0.007, 0.023] },
    { label: "30–60 km", cahaya: [0.020, 0.068], co2: [0.011, 0.009] },
    { label: "60–90 km", cahaya: [-0.030, 0.048], co2: [0.029, 0.028] },
    { label: "90–120 km", cahaya: [0.016, 0.027], co2: [0.009, 0.006] }
  ];
  const angka = v => (v < 0 ? "−" : "") + Math.abs(v).toFixed(3);

  // Tata letak rumah dan pohon tetap sama setiap kali dibuka.
  const acak = A.acak(2709);
  const rumah = [], pohon = [];
  const jauhDari = (x, y, daftar, min) => daftar.every(p => Math.hypot(p[0] - x, p[1] - y) > min);
  const bebasJalan = (x, y) => Math.abs(x) > .75 && Math.abs(y) > .75;
  const titikTokoh = [WARGA.ke, PENELITI.ke];
  [4, 7, 10, 13].forEach((jumlah, pita) => {
    let coba = 0;
    while (rumah.filter(r => r.pita === pita).length < jumlah && coba++ < 600) {
      const a = acak() * Math.PI * 2, r = (pita ? DALAM[pita] : 3.4) + .35 + acak() * (R[pita] - (pita ? DALAM[pita] : 3.4) - .9);
      const x = Math.cos(a) * r, y = Math.sin(a) * r;
      if (bebasJalan(x, y) && jauhDari(x, y, rumah.map(h => [h.x, h.y]), 1.3) && jauhDari(x, y, titikTokoh, 1.4))
        rumah.push({ x, y, pita, atap: ["#c0573e", "#b5653f", "#8a5a44", "#3f6f8f"][Math.floor(acak() * 4)] });
    }
  });
  for (let coba = 0; pohon.length < 46 && coba < 900; coba++) {
    const a = acak() * Math.PI * 2, r = 3.2 + acak() * (TANAH - 4);
    const x = Math.cos(a) * r, y = Math.sin(a) * r;
    if (bebasJalan(x, y) && jauhDari(x, y, rumah.map(h => [h.x + .35, h.y + .3]), .9) && jauhDari(x, y, titikTokoh, 1.1) && jauhDari(x, y, pohon, .7))
      pohon.push([x, y]);
  }

  // Bangunan di dalam pagar menurut jenis KEK.
  function zona(jenis) {
    const b = [], cahaya = [], asap = [];
    const lampu = (x, y, z, w, d, h, br, ko) => cahaya.push(A.jendela(x, y, z, w, d, h, br, ko, "#ffd36b"));
    const gedung = (x, y, w, d, h, warna, br, ko, atapW) => {
      b.push({ d: x + w + y + d, svg: A.kotak(x, y, .08, w, d, h, warna) + A.jendela(x, y, .08, w, d, h, br, ko, "#9fb4c4") + (atapW ? A.atap(x, y, .08 + h, w, d, .3, atapW) : "") });
      lampu(x, y, .08, w, d, h, br, ko);
    };
    const cerobong = (x, y, h) => {
      b.push({ d: x + y + .6, svg: A.kotak(x, y, .08, .3, .3, h, "#a4afbb") + A.kotak(x, y, .08 + h - .35, .3, .3, .18, "#c0573e") });
      asap.push([x + .15, y + .15, h + .2]);
    };
    if (jenis === "manufaktur") {
      gedung(-1.95, -1.95, 1.8, 1.3, .8, "#dee7ef", 1, 3);
      gedung(.3, -1.95, 1.6, 1.6, .9, "#d5e0ea", 1, 3);
      cerobong(-1.6, .5, 2.4); cerobong(-.9, .5, 2.0);
      b.push({ d: 2.4, svg: A.silinder(1.1, 1.1, .08, .5, .8, "#c9d3dc") });
    } else if (jenis === "pariwisata") {
      gedung(-1.9, -1.9, 1.3, 1.0, 2.0, "#f4f1ea", 4, 2);
      b.push({ d: -10, svg: A.poly([[.3, -1.7, .1], [1.9, -1.7, .1], [1.9, -.4, .1], [.3, -.4, .1]], "#7cc3e0") });
      [[.4, .6], [1.3, .6], [.4, 1.45]].forEach(([x, y]) => gedung(x, y, .6, .55, .4, "#f7efe2", 1, 1, "#b5653f"));
      [[-1.6, .8], [-.6, 1.7], [1.85, 1.75], [-1.9, -.3]].forEach(([x, y]) => b.push({ d: x + y, svg: A.palem(x, y) }));
      [[.6, -.1], [1.5, -.1]].forEach(([x, y]) => {
        const [sx, sy] = iso(x, y);
        b.push({ d: x + y, svg: `<line x1="${f1(sx)}" y1="${f1(sy)}" x2="${f1(sx)}" y2="${f1(sy - 12)}" stroke="#7a5233" stroke-width="1"/><polygon points="${f1(sx - 7)},${f1(sy - 10)} ${f1(sx)},${f1(sy - 15)} ${f1(sx + 7)},${f1(sy - 10)}" fill="#e8590c"/>` });
      });
      asap.push([-1.25, -1.4, 2.4]);
    } else {
      gedung(-1.9, -1.9, 1.5, 1.1, .6, "#dee7ef", 1, 3);
      gedung(.5, -1.9, 1, 1, 2.2, "#c9d8e6", 5, 2);
      gedung(.4, .5, 1.4, 1.3, .7, "#d5e0ea", 1, 3);
      cerobong(-1.6, .6, 2.0);
    }
    return { b, cahaya: cahaya.join(""), asap };
  }

  function pagar() {
    const out = [], P = PAGAR, t = .06, h = .22, w = "#9aa8b5";
    const potong = (a0, a1) => [[a0, -.4], [.4, a1]];
    potong(-P, P).forEach(([a, c]) => {
      out.push({ d: -9, svg: A.kotak(a, -P, 0, c - a, t, h, w) });           // belakang kanan
      out.push({ d: -9, svg: A.kotak(-P, a, 0, t, c - a, h, w) });           // belakang kiri
      out.push({ d: c + P + .1, svg: A.kotak(a, P - t, 0, c - a, t, h, w) }); // depan kiri
      out.push({ d: c + P + .1, svg: A.kotak(P - t, a, 0, t, c - a, h, w) }); // depan kanan
    });
    return out;
  }
  const TIANG = [[-PAGAR, -PAGAR], [PAGAR, -PAGAR], [-PAGAR, PAGAR], [PAGAR, PAGAR], [.5, PAGAR], [PAGAR, .5], [-.5, -PAGAR], [-PAGAR, -.5]];

  function gambar(k) {
    const jenis = k.langkah.pilihan ? k.pilihan : "semua";
    const jauh = k.nomor >= 4;
    const skala = k.vb[3];
    const [lx, ly] = A.elipsR(TANAH);

    // Tanah, laut, jalan, dan pelat kawasan.
    let tanah = `<rect x="-3000" y="-3000" width="6000" height="6000" class="adg-laut"/>`
      + `<ellipse cx="0" cy="9" rx="${f1(lx)}" ry="${f1(ly)}" fill="#a9b89c"/>`
      + `<ellipse cx="0" cy="0" rx="${f1(lx)}" ry="${f1(ly)}" fill="#d5dfce"/>`;
    const jalan = (horizontal) => {
      const L = TANAH - .8, w = .28;
      const pts = horizontal ? [[-L, -w], [L, -w], [L, w], [-L, w]] : [[-w, -L], [w, -L], [w, L], [-w, L]];
      const [a, b] = horizontal ? [iso(-L, 0), iso(L, 0)] : [iso(0, -L), iso(0, L)];
      return A.poly(pts, "#c3c9cf") + `<line x1="${f1(a[0])}" y1="${f1(a[1])}" x2="${f1(b[0])}" y2="${f1(b[1])}" stroke="#eef1f3" stroke-width="1" stroke-dasharray="5 6"/>`;
    };
    tanah += jalan(true) + jalan(false);
    tanah += A.kotak(-PAGAR, -PAGAR, 0, PAGAR * 2, PAGAR * 2, .08, jenis === "pariwisata" ? "#f0e1bb" : "#e6ebe0");
    if (jauh) R.forEach(r => { tanah += `<path d="${A.jalurElips(r)}" fill="none" stroke="#5f7385" stroke-width="1.6" stroke-dasharray="7 6" opacity=".7"/>`; });

    // Benda yang diurutkan menurut kedalaman.
    const z = zona(jenis);
    const benda = [...z.b, ...pagar()];
    TIANG.forEach(([x, y]) => benda.push({ d: x + y + .1, svg: A.kotak(x - .03, y - .03, 0, .06, .06, .9, "#6c7783") }));
    rumah.forEach(h => benda.push({ d: h.x + h.y + 1.3, svg: A.kotak(h.x, h.y, 0, .7, .6, .45, "#e9eef3") + A.atap(h.x, h.y, .45, .7, .6, .38, h.atap) + A.jendela(h.x, h.y, 0, .7, .6, .45, 1, 1, "#9fb4c4") }));
    pohon.forEach(([x, y]) => benda.push({ d: x + y, svg: A.pohon(x, y, .9) }));

    // Lampu malam: terang di dalam pagar, redup di rumah tetangga.
    const [gx, gy] = A.elipsR(PAGAR * 1.9);
    let lampu = `<ellipse cx="0" cy="0" rx="${f1(gx)}" ry="${f1(gy)}" fill="${k.ref("pendar")}"/>`
      + `<g filter="${k.ref("sinar")}">${z.cahaya}`
      + TIANG.map(([x, y]) => { const [sx, sy] = iso(x, y, .95); return `<circle cx="${f1(sx)}" cy="${f1(sy)}" r="2.6" fill="#fff1c4"/>`; }).join("")
      + `</g>`
      + `<g opacity=".32">${rumah.map(h => A.jendela(h.x, h.y, 0, .7, .6, .45, 1, 1, "#f2c36b")).join("")}</g>`;

    // Lapisan atas: kabut, cincin yang bisa diketuk, label, kepulan, koin, satelit.
    let atas = "";
    if (k.langkah.pilihan && jenis === "manufaktur") {
      const [hx, hy] = A.elipsR(9);
      atas += `<ellipse class="adg-kabut" cx="0" cy="0" rx="${f1(hx)}" ry="${f1(hy)}" fill="#7d878f" opacity=".3" filter="${k.ref("kabur")}"/>`;
    }
    if (jauh) {
      R.forEach((r, i) => {
        const dalam = DALAM[i] ? A.jalurElips(DALAM[i]) : "";
        atas += `<path data-panas="${i}" class="adg-panas" fill-rule="evenodd" d="${A.jalurElips(r)}${dalam}" aria-label="Ring ${CINCIN[i].label}"/>`;
      });
      // Label di puncak tiap cincin, di antara dua jalan, supaya tetap terlihat di layar sempit.
      R.forEach((r, i) => {
        const [, ry] = A.elipsR(r);
        atas += `<text class="adg-label" x="0" y="${f1(-ry + skala * .012)}" text-anchor="middle" font-size="${f1(skala * (k.hp ? .042 : .026))}">${(i + 1) * 30} km</text>`;
      });
    }
    const sKepul = skala * (jauh ? (k.hp ? .0058 : .0042) : .0062);
    // Sebagian besar emisi digambar sebagai asap biasa; Puff berwajah hanya bintang tamu.
    const px = sKepul * .7;
    const kepul = ([x, y, zz], kelas, tunda, nama = "asap", besar = 1) => {
      const [sx, sy] = iso(x, y, zz), s = px * besar;
      const w = A.lebarSprite(nama) * s, h = A.tinggiSprite(nama) * s;
      return `<g transform="translate(${f1(sx - w / 2)},${f1(sy - h)})"><g class="${kelas}" style="animation-delay:${tunda}s">${A.piksel(nama, 0, 0, s)}</g></g>`;
    };
    z.asap.forEach((p, i) => { atas += kepul(p, "adg-naik", -i * 1.3) + kepul(p, "adg-naik", -i * 1.3 - 1.6, "asap", .75); });
    if (k.nomor === 0 && z.asap.length) atas += kepul(z.asap[0], "adg-apung", 0, "puffKecil");
    if (k.langkah.pilihan && jenis === "pariwisata") {
      [2, 3, 4].forEach((jml, pita) => {
        rumah.filter(h => h.pita === pita).slice(0, jml).forEach((h, j) => {
          const tamu = pita === 2 && j === 0 ? "puffBesar" : pita === 0 && j === 0 ? "puff" : null;
          atas += tamu ? kepul([h.x + .35, h.y + .3, 1.4], "adg-apung", -j * .7, tamu)
            : kepul([h.x + .35, h.y + .3, 1.4], "adg-apung", -j * .7, "asap", j % 2 ? .8 : 1.05);
        });
      });
    }
    if (k.nomor >= 1) {
      const sKoin = skala * .0065;
      [[-1.1, -1.4, 1.6], [.9, -1.4, 3.1], [1.1, 1.1, 1.6]].forEach(([x, y, zz], j) => {
        const [sx, sy] = iso(x, y, zz);
        atas += `<g transform="translate(${f1(sx - 3.5 * sKoin)},${f1(sy - 3.5 * sKoin)})"><g class="adg-apung" style="animation-delay:${-j * .5}s">${A.piksel("koin", 0, 0, sKoin)}</g></g>`;
      });
    }
    if (k.nomor === 2) {
      const [ka] = iso(PAGAR, -PAGAR), [kb] = iso(-PAGAR, PAGAR);
      atas += `<polygon points="112,-110 ${f1(ka)},0 ${f1(kb)},0" fill="#ffd36b" opacity=".16"/>`
        + `<g transform="translate(112,-118)"><g class="adg-apung">`
        + `<rect x="-24" y="-4" width="16" height="8" fill="#3f6f8f"/><rect x="8" y="-4" width="16" height="8" fill="#3f6f8f"/>`
        + `<line x1="-24" y1="0" x2="24" y2="0" stroke="#9fd3ec" stroke-width=".6"/>`
        + `<rect x="-7" y="-6" width="14" height="12" rx="1.5" fill="#cfd6dc"/><rect x="-7" y="2" width="14" height="4" fill="#a4afbb"/>`
        + `<circle cx="0" cy="9" r="2.5" fill="#cc9e42"/></g></g>`;
    }
    return { tanah, benda, lampu, atas };
  }

  function tabelJenis(jenis) {
    const d = DATA[jenis];
    return `<table class="adg-tabel"><caption>${d.nama}: change in nearby districts after a zone opens</caption>
      <tr><th scope="col">Outcome</th><th scope="col">Estimate (SE)</th><th scope="col"></th></tr>
      ${d.baris.map((b, i) => `<tr><td>${UKURAN[i]}</td><td>${angka(b[0])} (${b[1].toFixed(3)})</td><td>${b[2] ? `<span class="adg-sig ya">Significant at 5%</span>` : `<span class="adg-sig">Not significant</span>`}</td></tr>`).join("")}
    </table>`;
  }

  const JUDUL_JENIS = { semua: "All zones together", manufaktur: "Manufacturing zones", pariwisata: "Tourism zones" };

  // Ketiga jenis dalam satu tabel, untuk langkah penutup.
  function tabelBanding() {
    const jenis = ["semua", "manufaktur", "pariwisata"];
    return `<table class="adg-tabel adg-banding"><caption>All three types side by side (change in nearby districts after a zone opens)</caption>
      <tr><th scope="col">Outcome</th>${jenis.map(j => `<th scope="col">${DATA[j].nama}</th>`).join("")}</tr>
      ${UKURAN.map((u, i) => `<tr><td>${u}</td>${jenis.map(j => { const b = DATA[j].baris[i];
        return `<td${b[2] ? ' class="sig"' : ""}>${angka(b[0])}${b[2] ? "**" : ""}</td>`; }).join("")}</tr>`).join("")}
    </table><p class="adg-catatan">** Significant at 5 percent. Callaway and Sant'Anna estimates with never-treated controls.</p>`;
  }

  const TEKS_JENIS = {
    semua: "Taken together, zones have not raised night-time light in nearby districts. The estimate of 0.024 log points is not statistically different from zero, and no pollutant changes significantly. A standard two-way fixed effects model reports a significant rise of 0.074, but that result disappears once the estimator accounts for zones opening in different years.",
    manufaktur: "Manufacturing zones show no significant change in light or in any pollutant. They sit in industrial corridors that were already polluted, shown here as grey haze, so the emissions of one new zone are hard to separate from the background. That does not make them clean.",
    pariwisata: "Tourism zones are the only type whose puffs reach the neighbours. CO₂ in nearby districts is about 4.5 percent higher and NO₂ is higher by 1.725 µmol/m², about 13 percent of the sample mean. Light does not change. Low emissions before the zone opened, construction on previously undeveloped land, and the lasting footprint of visitor travel help explain the gap."
  };

  window.KEK_CERITA = {
    nama: { warga: "Resident", peneliti: "Researcher" },
    tinggiTokoh: .13,
    pandang: { dekat: [-200, -150, 400, 222], jauh: [-500, -300, 1000, 556] },
    pandangHP: { dekat: [-175, -150, 340, 252], jauh: [-370, -290, 740, 548] },
    pilihan: { label: "Type of zone", awal: "semua", opsi: [{ id: "semua", label: "All zones" }, { id: "manufaktur", label: "Manufacturing" }, { id: "pariwisata", label: "Tourism" }] },
    infoPanas(id) {
      const c = CINCIN[+id];
      return `<p class="adg-info-judul">Districts ${c.label} from a zone <span>(all zones)</span></p>
        <dl class="adg-angka"><div><dt>Night-time light</dt><dd>${angka(c.cahaya[0])} <small>(${c.cahaya[1].toFixed(3)})</small></dd></div>
        <div><dt>CO₂</dt><dd>${angka(c.co2[0])} <small>(${c.co2[1].toFixed(3)})</small></dd></div></dl>
        <p class="adg-catatan">Log points, standard errors in brackets. Neither estimate is significant.${+id === 2 ? " CO₂ is largest in this ring, but still not significant." : ""}</p>`;
    },
    gambar,
    langkah: [
      {
        judul: "A zone opens", pandang: "dekat",
        alt: "An isometric special economic zone with warehouses, an office tower, and a chimney releasing small grey puffs.",
        teks: "<p>Construction and new energy demand can raise emissions around a special economic zone from its first year, long before links with the local economy form. Indonesia had 25 operating zones by mid-2025. The grey puffs in this scene stand for those emissions.</p>"
      },
      {
        judul: "Lights come on inside the fence", pandang: "dekat", malam: true,
        alt: "The zone at night. Its buildings glow and coins float above them, while nearby houses stay dim.",
        teks: "<p>A working zone shows up from space as a patch of light at night. Night-time light stands in for economic activity, which many districts measure poorly, and in this sample it tracks district GDP with a correlation of 0.57. The coins mark the IDR 294.4 trillion invested in zones by mid-2025. Watch whether they leave the fence.</p>"
      },
      {
        judul: "Satellites keep watch", pandang: "dekat", malam: true,
        alt: "A satellite above the zone scans it with a beam of light.",
        teks: `<p>The thesis tracks 514 districts from 2013 to 2023 with satellite data that cover every one of them. The 72 whose centre lies within 60 km of a zone are compared with 442 that never had a zone nearby. Because zones opened in different years, the comparison uses the estimator of Callaway and Sant'Anna (2021), which never uses districts treated earlier as controls for those treated later.</p>
          <ul class="adg-cip"><li>Night-time light · VIIRS</li><li>CO₂ · ODIAC</li><li>NO₂, SO₂, CO · Sentinel-5P</li></ul>`
      },
      {
        judul: "A resident has a question", pandang: "dekat", ketukTokoh: true,
        alt: "A resident in a peci walks up to the zone and asks a question.",
        tokoh: [{ siapa: "warga", dari: WARGA.dari, ke: WARGA.ke, bicara: "Nice lights. But do we get the gains, or just the puffs?" }],
        teks: "<p>The resident's question is the thesis question. Do the gains in light match the emissions that reach the districts next door? Answering it means looking past the fence, at the places where people like this resident live. Tap the resident, or press Next.</p>"
      },
      {
        judul: "Zooming out", pandang: "jauh", panas: true, panasAwal: "0",
        alt: "The zone seen from far away, surrounded by four dashed rings at 30, 60, 90, and 120 km with houses in each ring.",
        tokoh: [{ siapa: "warga", ke: WARGA.ke }],
        petunjuk: "Tap a ring to see its estimate.",
        teks: "<p>Light does not rise significantly in any distance ring around the zones. If spillovers were real but local, districts in the inner ring would brighten first, and they do not. So the 60 km cut-off used in the main estimates is not hiding a stronger effect close by.</p>"
      },
      // Satu langkah per jenis KEK, supaya tombol Next saja sudah melewati ketiganya.
      ...["semua", "manufaktur", "pariwisata"].map((jenis, j) => ({
        judul: JUDUL_JENIS[jenis], pandang: "jauh", malam: true, pilihan: true, pilihanTetap: jenis, pilihanAwal: jenis, panas: true,
        alt: `The landscape at night around ${DATA[jenis].nama.toLowerCase()}, zone type ${j + 1} of 3.`,
        tokoh: [{ siapa: "warga", ke: WARGA.ke }],
        petunjuk: "Tap a ring to see its estimate.",
        teks: `<p class="adg-urut">Zone type ${j + 1} of 3</p><p>${TEKS_JENIS[jenis]}</p>${tabelJenis(jenis)}`
      })),
      {
        judul: "The researcher answers", pandang: "jauh", malam: true, pilihan: true, pilihanAwal: "pariwisata", panas: true,
        alt: "A researcher with a tablet joins the resident and answers the question.",
        tokoh: [{ siapa: "warga", ke: WARGA.ke }, { siapa: "peneliti", dari: PENELITI.dari, ke: PENELITI.ke, bicara: "Not yet. Near tourism zones, the puffs arrived before the lights did." }],
        petunjuk: "Switch the type of zone above to see it on the map, or tap a ring.",
        teks: `<p>The imbalance may not last. Most zones in the sample had operated for two to five years, while spillovers elsewhere have taken four to ten. Three explanations fit the flat result for light, and the data cannot yet separate them: growth diluted across a whole district, too little time, and zones that work as enclaves with few links to local suppliers and workers.</p>
          ${tabelBanding()}
          <p><a href="#temuan">Read the full findings</a></p>`
      }
    ]
  };
})();
