// Tombol terang/gelap, dipakai halaman utama dan halaman paper.
document.getElementById("tema").addEventListener("click", () => {
  const akar = document.documentElement;
  if (akar.dataset.theme === "dark") delete akar.dataset.theme; else akar.dataset.theme = "dark";
  try { localStorage.setItem("tema", akar.dataset.theme || "light"); } catch (e) {}
});
