// Grafik titik dan selang kepercayaan 95% untuk halaman paper. Isi data-att: [{grup, baris: [[label, att, se, nyata]]}].
document.querySelectorAll(".att").forEach((el) => {
  const data = JSON.parse(el.dataset.att), [lo, hi] = JSON.parse(el.dataset.rentang), garis = JSON.parse(el.dataset.garis);
  const x = (v) => ((v - lo) / (hi - lo)) * 100;
  const f = (v) => v.toFixed(3).replace("-", "−");
  const baris = data.map((g) => `<div class="att-grup">${g.grup}</div>` + g.baris.map(([nama, att, se, nyata]) => {
    const a = att - 1.96 * se, b = att + 1.96 * se;
    return `<div class="att-baris${nyata ? " nyata" : ""}" title="${nama}: ${el.dataset.ukuran || "ATT"} ${f(att)}, 95% CI ${f(a)} to ${f(b)}"><span>${nama}</span><div class="att-bidang"><i class="att-nol" style="left:${x(0)}%"></i><i class="att-selang" style="left:${x(a)}%;width:${x(b) - x(a)}%"></i><i class="att-titik" style="left:${x(att)}%"></i></div><span class="att-nilai">${f(att)}</span></div>`;
  }).join("")).join("");
  const sumbu = `<div class="att-sumbu"><span></span><div>${garis.map((v) => `<span style="left:${x(v)}%">${v.toFixed(2).replace("-", "−")}</span>`).join("")}</div><span></span></div>`;
  el.innerHTML = baris + sumbu;
});

// Tab bingkai grafik gaya OWID: Chart, Table, Sources.
document.querySelectorAll("[data-gr]").forEach((gr) => {
  const tab = gr.querySelectorAll(".gr-tab button");
  tab.forEach((b) => b.addEventListener("click", () => {
    tab.forEach((x) => x.setAttribute("aria-selected", x === b));
    gr.querySelectorAll("[data-panel]").forEach((p) => { p.hidden = p.dataset.panel !== b.dataset.p; });
    document.dispatchEvent(new Event("gr-tab"));
  }));
});
