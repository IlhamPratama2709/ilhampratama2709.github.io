// Mesin adegan: dunia isometrik vektor, tokoh pixel art, cerita per langkah.
// Umum untuk semua cerita (KEK, PENSAR, ...). Cerita hanya memberi langkah, data, dan fungsi gambar.
(function () {
  const U = 22;                       // satu petak = 22 satuan layar
  const AKAR2 = Math.SQRT2;
  const f1 = n => n.toFixed(1);
  const iso = (x, y, z = 0) => [(x - y) * U, (x + y) * U / 2 - z * U];
  const titik = pts => pts.map(p => iso(p[0], p[1], p[2] || 0).map(f1).join(",")).join(" ");

  function gelap(hex, k) {
    const n = parseInt(hex.slice(1), 16);
    return "#" + [n >> 16, (n >> 8) & 255, n & 255]
      .map(v => Math.round(v * k).toString(16).padStart(2, "0")).join("");
  }
  const poly = (pts, isi) => `<polygon points="${titik(pts)}" fill="${isi}"/>`;

  // Balok: dua sisi depan lebih gelap, atap paling terang.
  function kotak(x, y, z, w, d, h, warna) {
    const t = z + h;
    return poly([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, t], [x, y + d, t]], gelap(warna, .86))
      + poly([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, t], [x + w, y, t]], gelap(warna, .7))
      + poly([[x, y, t], [x + w, y, t], [x + w, y + d, t], [x, y + d, t]], warna);
  }
  function atap(x, y, z, w, d, h, warna) {
    const a = [x + w / 2, y + d / 2, z + h];
    return poly([[x, y, z], [x + w, y, z], a], warna) + poly([[x, y, z], [x, y + d, z], a], warna)
      + poly([[x, y + d, z], [x + w, y + d, z], a], gelap(warna, .86))
      + poly([[x + w, y, z], [x + w, y + d, z], a], gelap(warna, .7));
  }
  // Jendela pada dua sisi depan balok.
  function jendela(x, y, z, w, d, h, baris, kolom, warna) {
    let s = "";
    for (let j = 0; j < baris; j++) {
      const z0 = z + h * (j + .3) / baris, z1 = z + h * (j + .7) / baris;
      for (let i = 0; i < kolom; i++) {
        const a = x + w * (i + .25) / kolom, b = x + w * (i + .75) / kolom;
        const c = y + d * (i + .25) / kolom, e = y + d * (i + .75) / kolom;
        s += poly([[a, y + d, z0], [b, y + d, z0], [b, y + d, z1], [a, y + d, z1]], warna)
          + poly([[x + w, c, z0], [x + w, e, z0], [x + w, e, z1], [x + w, c, z1]], warna);
      }
    }
    return s;
  }
  function pohon(x, y, k = 1) {
    const [sx, sy] = iso(x, y), t = 14 * k, l = 6 * k;
    return `<rect x="${f1(sx - 1.2 * k)}" y="${f1(sy - 4 * k)}" width="${f1(2.4 * k)}" height="${f1(4 * k)}" fill="#7a5233"/>`
      + `<polygon points="${f1(sx)},${f1(sy - 4 * k - t)} ${f1(sx - l)},${f1(sy - 3 * k)} ${f1(sx)},${f1(sy - 2 * k)}" fill="#77be74"/>`
      + `<polygon points="${f1(sx)},${f1(sy - 4 * k - t)} ${f1(sx + l)},${f1(sy - 3 * k)} ${f1(sx)},${f1(sy - 2 * k)}" fill="#51984e"/>`;
  }
  function palem(x, y, k = 1) {
    const [sx, sy] = iso(x, y), t = 16 * k;
    let s = `<path d="M${f1(sx)} ${f1(sy)} q${f1(2 * k)} ${f1(-t / 2)} ${f1(1 * k)} ${f1(-t)}" stroke="#8a6a44" stroke-width="${f1(2 * k)}" fill="none"/>`;
    [[-8, 3], [8, 3], [-6, -3], [6, -3]].forEach(([dx, dy]) => {
      s += `<path d="M${f1(sx + k)} ${f1(sy - t)} q${f1(dx * k / 2)} ${f1(-4 * k)} ${f1(dx * k)} ${f1(dy * k)}" stroke="#4f9a4c" stroke-width="${f1(2.4 * k)}" fill="none" stroke-linecap="round"/>`;
    });
    return s;
  }
  function silinder(x, y, z, r, h, warna) {
    const [sx, sy] = iso(x, y, z), rx = r * U * 1.2, ry = rx / 2, t = h * U;
    return `<ellipse cx="${f1(sx)}" cy="${f1(sy)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="${gelap(warna, .7)}"/>`
      + `<rect x="${f1(sx - rx)}" y="${f1(sy - t)}" width="${f1(rx)}" height="${f1(t)}" fill="${gelap(warna, .86)}"/>`
      + `<rect x="${f1(sx)}" y="${f1(sy - t)}" width="${f1(rx)}" height="${f1(t)}" fill="${gelap(warna, .7)}"/>`
      + `<ellipse cx="${f1(sx)}" cy="${f1(sy - t)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="${warna}"/>`;
  }
  // Lingkaran di tanah (jari-jari dalam petak) menjadi elips di layar.
  const elipsR = r => [r * U * AKAR2, r * U * AKAR2 / 2];
  function jalurElips(r) {
    const [a, b] = elipsR(r);
    return `M${f1(a)} 0A${f1(a)} ${f1(b)} 0 1 0 ${f1(-a)} 0A${f1(a)} ${f1(b)} 0 1 0 ${f1(a)} 0Z`;
  }

  // Sprite pixel art buatan sendiri. Tiap huruf satu warna, titik berarti kosong.
  const SPRITE = {
    // Tokoh gaya B (20 × 26, mata berbinar). Warga berambut jabrik. Sumber: gaya-tokoh.js.
    warga: {"peta":[".....O..O..O..O.....","....OHOOHOOHOOHO....","...OHHHHHHHHHHHHO...","..OHHHHHHHHHHHHHHO..","..OHHHHhHHHHhHHHHO..","..OHHSHHSSSSHHSHHO..","..OHSSSSSSSSSSSSHO..","..OSSSSSSSSSSSSSSO..","..OSSEWSSSSSSEWSSO..","..OSSEESSSSSSEESSO..","..OSSEESSSSSSEESSO..","..OSBBSSSMMSSSBBSO..","...OSSSSSSSSSSSSO...","....OssSSSSSSssO....",".....OOOOOOOOOO.....","....OTTTTCCTTTTO....","...OTTTTTCCTTTTTO...","...OTtTTTTTTTTtTO...","...OSOTTTTTTTTOSO...","....OOttttttttOO....",".....OGGgGGgGGO.....",".....OgGGgGGgGO.....",".....OGGgGGgGGO.....","......OSO..OSO......","......OSO..OSO......",".....OKKO..OKKO....."],"langkah":{"23":".....OSO....OSO.....","24":".....OSO....OSO.....","25":"....OKKO....OKKO...."},"warna":{"O":"#3b2a24","P":"#24242c","Q":"#5a5a68","H":"#2b2020","S":"#f0b98c","s":"#d99a6c","W":"#ffffff","E":"#2b2020","B":"#f39a8f","M":"#9a3f30","T":"#2f9a8c","t":"#237a6f","C":"#ffffff","G":"#9a6440","g":"#6e4228","K":"#6b4a2e","h":"#4a3a34"}},
    peneliti: {"peta":["......OOOOOOOO......",".....OHHHHHHHHO.....","....OHHhhHHHHHHO....","...OHHHHHHHHHHHHO...","..OHHHHHHHHHHHHHHO..","..OHHHHSSSSSSSSSHO..","..OHSSSSSSSSSSSSHO..","..OSGGGGGSSGGGGGSO..","..OSGLLEGGGGLLEGSO..","..OSGLLEGSSGLLEGSO..","..OSGGGGGSSGGGGGSO..","..OSBSSSSMMSSSSBSO..","...OSSSSSSSSSSSSO...","....OssSSSSSSssO....",".....OOOOOOOOOO.....","....ONNWWYYWWNNO....","...ONNNWWYYWWNNNO...","...ONnNWWWWWWNnNO...","...OSONNNNNNNNOTTO..","....OONNNNNNNNOTTO..",".....ODDDDDDDDO.....",".....ODDDDDDDDO.....",".....ODDDOODDDO.....","......ODO..ODO......","......ODO..ODO......",".....OKKO..OKKO....."],"langkah":{"23":".....ODO....ODO.....","24":".....ODO....ODO.....","25":"....OKKO....OKKO...."},"warna":{"O":"#3b2a24","H":"#2b2020","h":"#5a4740","S":"#f0b98c","s":"#d99a6c","G":"#2b2020","L":"#dff1fb","E":"#2b2020","B":"#f39a8f","M":"#9a3f30","N":"#0b4a72","n":"#003a5d","W":"#ffffff","Y":"#cc9e42","T":"#9fd3ec","D":"#5a6f82","K":"#2b2020"}},
    // Asap dan Puff bergaya garis tepi tebal, dibuat oleh generator di gaya-tokoh.js.
    asap: {"peta":["..................",".........KKK......",".......KKLLDKK....","....KKKLWWLLDDK...","...KLLLLWBBBLDK...","..KLLLLBBBBBBBDK..",".KLLBBBBBBBBBBDDK.",".KLBBBBBBBBBBBBDK.",".KDBBBBBBBBBBBBDDK",".KDDBBBBBBBBBBDDDK","..KDDDDBBBBDDDDDK.","...KDDDDDDDDDDDDK.","....KKKDDDDKKKKK..",".......KKKK......."],"warna":{"K":"#16181b","L":"#f6f8fa","B":"#d6dce1","D":"#a3aeb8","W":"#ffffff","P":"#f2a39a","M":"#b8423a"}},
    puff: {"peta":["..........................","............KKKKK.........","..........KKLLLLDKK.......",".........KLLLLLLLLDK......","........KLLWWBBBBLDDK.....",".......KKLBWBBBBBBBDK.....",".....KKLLLBBBBBBBBBDDK....","....KLLLLBBBBBBBBBBBDKK...","...KLLLBBBBBBBBBBBBBBLDK..","...KLBBBBBBBBBBBBBBBBLDDK.","..KLLBBBBBBBBWKBBBWKBBDDK.","..KLBBBBBBBBBKKBBBKKBBBDK.","..KLBBBBBBBBBKKBBBKKBBDDDK",".KDLBBBBBBBPBBBBBBBBPBDDK.","KDDBBBBBBBBBBBBMMBBBBBDDK.",".KKLBBDBBBBBBBBBBBDBDDDDK.",".KDLDDDDDBBBBBBBDDDDDDDK..",".KDDDDKDDDBBBBBDDDKDKKK...","..KDDK.KKDDDDDDDDK.K......","...KK....KDDDDDDK.........","..........KKKKKK..........",".........................."],"warna":{"K":"#16181b","L":"#f6f8fa","B":"#d6dce1","D":"#a3aeb8","W":"#ffffff","P":"#f2a39a","M":"#b8423a"}},
    puffBesar: {"peta":["..............................",".................KKKK.........","..........KKKKKKKLLLDKK.......","........KKLLLLLLLLLLLLDK......",".......KLLLLLLLLLBBBBLDDK.....",".......KLLWWBBBBBBBBBBBDK.....","......KLLBWBBBBBBBBBBBBDDK....","......KLBBBBBBBBBBBBBBBBDK....","....KKLLBBBBBBBBBBBBBBBBBDK...","...KLLLBBBBBBKKBBBBBBKKBBLDK..","..KLLLBBBBBBBBBKBBBBKBBBBBLDK.","..KLBBBBBBBBBBWKBBBBWKBBBBBDDK",".KLLBBBBBBBBBBKKBBBBKKBBBBBDDK",".KLBBBBBBBBBBBKKBBBBKKBBBBBDDK",".KLBBBBBBBBBPBBBBBBBBBBPBBBDDK","KDDBBBBBBBBBBBBBBBBBBBBBBBDDDK","KDDBBBBBBBBBBBBBMMMBBBBBBDDDK.",".KKLBBBBBBBBBBBBBBBBDDDDDDDK..",".KDLBDDDDDBBBBBBBBDDDDDDDDK...",".KDDDDDDDDDDBBBBBBDDKKKKKK....","..KDDKKKKKDDDDDDDDDDK.........","...KK.....KKDDDDDDKK..........","............KKKKKK............",".............................."],"warna":{"K":"#16181b","L":"#f6f8fa","B":"#d6dce1","D":"#a3aeb8","W":"#ffffff","P":"#f2a39a","M":"#b8423a"}},
    puffKecil: {"peta":["................","................",".....KKKKKK.....","....KLLLLLDK....","...KLWWLLLLDK...","..KLLWBBBBBDDK..","..KLBBWKBBWKDK..",".KLLBBKKBBKKBDK.",".KLBBBKKBBKKBDDK","KLLBBPBBBBBBPDDK","KDDBBBBDMDBBDDDK","KDDDDDDDDDDDDDK.",".KKDDDDKKKDDDK..","...KKKK...KKK..."],"warna":{"K":"#16181b","L":"#f6f8fa","B":"#d6dce1","D":"#a3aeb8","W":"#ffffff","P":"#f2a39a","M":"#b8423a"}},
    koin: {
      peta: ["..KKK..", ".KYYYK.", "KYHYYYK", "KYYOYYK", "KYYYYYK", ".KYYYK.", "..KKK.."],
      warna: { K: "#8a6414", Y: "#e8b84a", H: "#fff1c4", O: "#b9862a" }
    }
  };
  function petaSprite(nama, langkah) {
    const sp = SPRITE[nama];
    return langkah && sp.langkah ? sp.peta.map((r, j) => sp.langkah[j] || r) : sp.peta;
  }
  // Satu kotak per deret warna yang sama, supaya SVG tetap kecil.
  function piksel(nama, x, y, s, langkah) {
    const warna = SPRITE[nama].warna;
    let out = "";
    petaSprite(nama, langkah).forEach((baris, j) => {
      for (let i = 0; i < baris.length;) {
        const c = baris[i];
        if (c === ".") { i++; continue; }
        let k = i;
        while (k < baris.length && baris[k] === c) k++;
        out += `<rect x="${(x + i * s).toFixed(2)}" y="${(y + j * s).toFixed(2)}" width="${((k - i) * s + .05).toFixed(2)}" height="${(s + .05).toFixed(2)}" fill="${warna[c]}"/>`;
        i = k;
      }
    });
    return `<g shape-rendering="crispEdges">${out}</g>`;
  }
  const lebarSprite = nama => SPRITE[nama].peta[0].length;
  const tinggiSprite = nama => SPRITE[nama].peta.length;

  function acak(benih) {
    return function () {
      benih |= 0; benih = benih + 0x6D2B79F5 | 0;
      let t = Math.imul(benih ^ benih >>> 15, 1 | benih);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function bungkusTeks(teks, maks) {
    const baris = [];
    let kini = "";
    teks.split(" ").forEach(k => {
      if ((kini + " " + k).trim().length > maks && kini) { baris.push(kini); kini = k; }
      else kini = (kini + " " + k).trim();
    });
    if (kini) baris.push(kini);
    return baris;
  }
  const lolos = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

  let hitung = 0;

  function pasang(akar, cerita) {
    const pref = "adg" + (++hitung);
    const kurangGerak = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ks = { i: 0, pilihan: cerita.pilihan ? cerita.pilihan.awal : null, malam: false, panas: null };
    const n = cerita.langkah.length;

    akar.classList.add("adg");
    akar.innerHTML = `
      <div class="adg-layar">
        <svg role="img" preserveAspectRatio="xMidYMid meet">
          <defs>
            <radialGradient id="${pref}-pendar"><stop offset="0" stop-color="#ffd36b" stop-opacity=".55"/><stop offset="1" stop-color="#ffd36b" stop-opacity="0"/></radialGradient>
            <filter id="${pref}-kabur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="14"/></filter>
            <filter id="${pref}-sinar" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>
          <g class="adg-dunia"></g><g class="adg-lampu"></g><g class="adg-atas"></g><g class="adg-tokoh"></g>
        </svg>
        <button type="button" class="adg-waktu" aria-pressed="false"></button>
      </div>
      <div class="adg-panel">
        <div class="adg-pilihan" role="group"></div>
        <p class="adg-nomor"></p>
        <h3 class="adg-judul"></h3>
        <div class="adg-teks" aria-live="polite"></div>
        <div class="adg-info"></div>
        <div class="adg-kendali">
          <button type="button" class="adg-mundur">Back</button>
          <ol class="adg-titik"></ol>
          <button type="button" class="adg-maju">Next</button>
        </div>
      </div>`;
    const $ = s => akar.querySelector(s);
    const svg = $("svg");
    const lapis = { dunia: $(".adg-dunia"), lampu: $(".adg-lampu"), atas: $(".adg-atas"), tokoh: $(".adg-tokoh") };
    const titikNav = $(".adg-titik");
    titikNav.innerHTML = cerita.langkah.map((L, i) =>
      `<li><button type="button" data-ke="${i}" aria-label="Step ${i + 1}: ${lolos(L.judul)}"></button></li>`).join("");

    // Layar yang lebih tegak (ponsel, atau kotak menyamping) memakai pandangan rasio 1,35
    // bila cerita menyediakannya. Diukur dari bentuk SVG, bukan lebar layar.
    const sempit = () => { const r = svg.getBoundingClientRect(); return r.height > 0 && r.width / r.height < 1.6; };
    let modeSempit = sempit();
    const pandang = nama => (modeSempit && cerita.pandangHP ? cerita.pandangHP : cerita.pandang)[nama];
    let vb = pandang(cerita.langkah[0].pandang).slice();
    svg.setAttribute("viewBox", vb.join(" "));
    new ResizeObserver(() => {
      const m = sempit();
      if (m === modeSempit) return;
      modeSempit = m;
      vb = pandang(cerita.langkah[ks.i].pandang).slice();
      svg.setAttribute("viewBox", vb.join(" "));
      gambar(false);
    }).observe(svg);

    function zoom(target) {
      const awal = vb.slice(), t0 = performance.now(), lama = kurangGerak ? 0 : 900;
      function bingkai(t) {
        const k = lama ? Math.min(1, (t - t0) / lama) : 1;
        const e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        vb = awal.map((v, i) => v + (target[i] - v) * e);
        svg.setAttribute("viewBox", vb.map(f1).join(" "));
        if (k < 1) requestAnimationFrame(bingkai);
      }
      requestAnimationFrame(bingkai);
    }

    function gelembung(teks, sx, sy, sasaran) {
      const f = sasaran[3] * .042;
      const baris = bungkusTeks(teks, 26);
      const w = Math.max(...baris.map(b => b.length)) * f * .52 + f * 1.4;
      const h = baris.length * f * 1.25 + f * .9;
      const bx = Math.min(Math.max(sx - w / 2, sasaran[0] + f * .5), sasaran[0] + sasaran[2] - w - f * .5);
      const by = sy - h - f * .9;
      return `<g class="adg-gelembung">
        <rect x="${f1(bx)}" y="${f1(by)}" width="${f1(w)}" height="${f1(h)}" rx="${f1(f * .4)}"/>
        <polygon points="${f1(sx - f * .4)},${f1(by + h - .5)} ${f1(sx + f * .4)},${f1(by + h - .5)} ${f1(sx)},${f1(by + h + f * .8)}"/>
        <text font-size="${f1(f)}">${baris.map((b, k) => `<tspan x="${f1(bx + f * .7)}" y="${f1(by + f * 1.15 + k * f * 1.25)}">${lolos(b)}</tspan>`).join("")}</text>
      </g>`;
    }

    function gambarTokoh(L, jalan) {
      const sasaran = pandang(L.pandang);
      lapis.tokoh.innerHTML = "";
      (L.tokoh || []).forEach(t => {
        const s = sasaran[3] * (cerita.tinggiTokoh || .1) / tinggiSprite(t.siapa);
        const lebar = lebarSprite(t.siapa) * s, tinggi = tinggiSprite(t.siapa) * s;
        const posisi = p => { const [x, y] = iso(p[0], p[1]); return [x - lebar / 2, y - tinggi]; };
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.setAttribute("class", "adg-orang" + (L.ketukTokoh ? " bisa-ketuk" : ""));
        g.innerHTML = `<g class="f1">${piksel(t.siapa, 0, 0, s)}</g><g class="f2">${piksel(t.siapa, 0, 0, s, true)}</g>`;
        if (L.ketukTokoh) {
          g.setAttribute("tabindex", "0"); g.setAttribute("role", "button");
          g.setAttribute("aria-label", `${cerita.nama[t.siapa]}: continue`);
        }
        lapis.tokoh.appendChild(g);
        const [ax, ay] = posisi(t.ke);
        const tampilBicara = () => {
          if (!t.bicara) return;
          const b = document.createElementNS("http://www.w3.org/2000/svg", "g");
          b.innerHTML = gelembung(t.bicara, ax + lebar / 2, ay - s, sasaran);
          lapis.tokoh.appendChild(b.firstElementChild);
        };
        const taruh = ([x, y]) => { g.style.transform = `translate(${f1(x)}px,${f1(y)}px)`; };
        if (jalan && t.dari && !kurangGerak) {
          taruh(posisi(t.dari));
          g.getBoundingClientRect();
          requestAnimationFrame(() => {
            g.classList.add("jalan");
            g.style.transition = "transform 1.8s linear";
            taruh([ax, ay]);
          });
          // Batas waktu sebagai cadangan bila transitionend tidak terpicu (tab latar, animasi tersendat).
          let selesai = false;
          const tiba = () => { if (selesai) return; selesai = true; g.classList.remove("jalan"); tampilBicara(); };
          g.addEventListener("transitionend", tiba, { once: true });
          setTimeout(tiba, 2100);
        } else {
          taruh([ax, ay]);
          tampilBicara();
        }
      });
    }

    function gambar(jalan) {
      const L = cerita.langkah[ks.i];
      const keadaan = { nomor: ks.i, langkah: L, pilihan: ks.pilihan, malam: ks.malam, panas: ks.panas,
        vb: pandang(L.pandang), hp: modeSempit && !!cerita.pandangHP, ref: nama => `url(#${pref}-${nama})` };
      const g = cerita.gambar(keadaan);
      lapis.dunia.innerHTML = g.tanah + g.benda.sort((a, b) => a.d - b.d).map(b => b.svg).join("");
      lapis.lampu.innerHTML = g.lampu || "";
      lapis.atas.innerHTML = g.atas || "";
      lapis.atas.querySelectorAll("[data-panas]").forEach(el => {
        el.classList.toggle("pilih", el.dataset.panas === ks.panas);
        if (L.panas) { el.setAttribute("tabindex", "0"); el.setAttribute("role", "button"); }
      });
      akar.classList.toggle("malam", ks.malam);
      akar.classList.toggle("bisa-panas", !!L.panas);
      svg.setAttribute("aria-label", L.alt || L.judul);
      if (jalan !== null) gambarTokoh(L, jalan);

      const waktu = $(".adg-waktu");
      waktu.textContent = ks.malam ? "☀ Day" : "☾ Night";
      waktu.setAttribute("aria-pressed", ks.malam);
      waktu.setAttribute("aria-label", ks.malam ? "Switch to day" : "Switch to night");

      $(".adg-nomor").textContent = `Step ${ks.i + 1} of ${n}`;
      $(".adg-judul").textContent = L.judul;
      const ucap = (L.tokoh || []).filter(t => t.bicara).map(t =>
        `<p class="adg-ucap"><svg class="adg-ava" viewBox="0 0 ${lebarSprite(t.siapa)} ${Math.round(tinggiSprite(t.siapa) * .58)}" aria-hidden="true">${piksel(t.siapa, 0, 0, 1)}</svg><span><b>${cerita.nama[t.siapa]}:</b> “${lolos(t.bicara)}”</span></p>`).join("");
      $(".adg-teks").innerHTML = ucap + (typeof L.teks === "function" ? L.teks(keadaan) : L.teks);

      const info = $(".adg-info");
      const isiInfo = L.panas ? (ks.panas ? cerita.infoPanas(ks.panas, keadaan) : `<p class="adg-petunjuk">${L.petunjuk || ""}</p>`) : "";
      info.innerHTML = isiInfo;
      info.hidden = !isiInfo;

      const pil = $(".adg-pilihan");
      pil.hidden = !L.pilihan;
      if (L.pilihan) {
        pil.setAttribute("aria-label", cerita.pilihan.label);
        pil.innerHTML = cerita.pilihan.opsi.map(o =>
          `<button type="button" data-pilih="${o.id}" aria-pressed="${o.id === ks.pilihan}">${o.label}</button>`).join("");
      }
      $(".adg-mundur").disabled = ks.i === 0;
      $(".adg-maju").disabled = ks.i === n - 1;
      titikNav.querySelectorAll("button").forEach((b, i) => {
        if (i === ks.i) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current");
      });
    }

    function keLangkah(i) {
      if (i < 0 || i >= n || i === ks.i && akar.dataset.siap) return;
      akar.dataset.siap = "1";
      ks.i = i;
      const L = cerita.langkah[i];
      ks.malam = !!L.malam;
      if (L.pilihanAwal) ks.pilihan = L.pilihanAwal;
      ks.panas = L.panas ? (ks.panas || L.panasAwal || null) : null;
      zoom(pandang(L.pandang));
      gambar(true);
    }

    function pilihPanas(el) {
      ks.panas = el.dataset.panas;
      gambar(null);
      const baru = lapis.atas.querySelector(`[data-panas="${ks.panas}"]`);
      if (baru && document.activeElement !== baru && el.matches(":focus")) baru.focus();
    }

    akar.addEventListener("click", e => {
      const t = e.target;
      if (t.closest(".adg-maju")) keLangkah(ks.i + 1);
      else if (t.closest(".adg-mundur")) keLangkah(ks.i - 1);
      else if (t.closest("[data-ke]")) keLangkah(+t.closest("[data-ke]").dataset.ke);
      else if (t.closest("[data-pilih]")) {
        // Bila tiap pilihan punya langkah sendiri, tombol pilihan berpindah ke langkah itu.
        const id = t.closest("[data-pilih]").dataset.pilih;
        const j = cerita.langkah.findIndex(L => L.pilihanTetap === id);
        if (j >= 0 && cerita.langkah[ks.i].pilihanTetap) keLangkah(j);
        else { ks.pilihan = id; gambar(null); }
      }
      else if (t.closest(".adg-waktu")) { ks.malam = !ks.malam; gambar(null); }
      else if (t.closest(".adg-orang.bisa-ketuk")) keLangkah(ks.i + 1);
      else if (t.closest("[data-panas]") && cerita.langkah[ks.i].panas) pilihPanas(t.closest("[data-panas]"));
    });
    akar.addEventListener("keydown", e => {
      const t = e.target;
      if ((e.key === "Enter" || e.key === " ") && t.closest && t.closest("[data-panas]")) { e.preventDefault(); pilihPanas(t.closest("[data-panas]")); }
      else if ((e.key === "Enter" || e.key === " ") && t.closest && t.closest(".adg-orang.bisa-ketuk")) { e.preventDefault(); keLangkah(ks.i + 1); }
      else if (e.key === "ArrowRight" && !t.closest("[data-pilih]")) keLangkah(ks.i + 1);
      else if (e.key === "ArrowLeft" && !t.closest("[data-pilih]")) keLangkah(ks.i - 1);
    });

    keLangkah(0);
  }

  window.Adegan = {
    pasang,
    alat: { U, iso, titik, poly, gelap, kotak, atap, jendela, pohon, palem, silinder, elipsR, jalurElips, piksel, lebarSprite, tinggiSprite, acak, f1 }
  };
})();
