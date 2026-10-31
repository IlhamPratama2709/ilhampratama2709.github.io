// Peta piksel dan tebak angka di halaman PENSAR. Sprite berjalan dari Depok ke lokasi survei halaman ini.
const pejalan = document.getElementById("pejalan");
const kini = document.querySelector('.henti[aria-current="page"]');
setTimeout(() => {
  pejalan.style.left = kini.style.left;
  pejalan.style.top = kini.style.top;
}, 150);

document.querySelectorAll(".tebak").forEach((kotak) => {
  const jawaban = kotak.querySelector(".jawaban");
  kotak.querySelectorAll("[data-pilih]").forEach((b) => {
    b.onclick = () => {
      kotak.querySelectorAll("[data-pilih]").forEach((x) => {
        x.disabled = true;
        x.classList.toggle("benar", x.dataset.pilih === kotak.dataset.benar);
      });
      b.setAttribute("aria-pressed", "true");
      jawaban.hidden = false;
    };
  });
  const geser = kotak.querySelector("input[type=range]");
  if (!geser) return;
  const keluaran = kotak.querySelector("output"), cek = kotak.querySelector("[data-cek]"), angka = Number(kotak.dataset.angka);
  geser.oninput = () => { keluaran.textContent = `${geser.value}%`; };
  cek.onclick = () => {
    const selisih = Math.abs(geser.value - angka);
    geser.disabled = cek.disabled = true;
    jawaban.textContent = `The answer is ${angka} percent, or 22 of 69 households. Your guess was ${selisih === 0 ? "exact" : `${selisih} points away`}.`;
    jawaban.hidden = false;
  };
});
