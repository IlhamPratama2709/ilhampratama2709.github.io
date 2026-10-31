// Video proyek main saat masuk layar dan berhenti saat keluar. Tanpa putar otomatis bila pembaca meminta gerak dikurangi.
(() => {
  if (!("IntersectionObserver" in window)) return;
  const gerakDikurangi = window.matchMedia("(prefers-reduced-motion: reduce)");
  const terlihat = new WeakSet(); // video yang sedang di layar
  const dijedakan = new WeakSet(); // video yang dijeda pembaca sendiri: jangan dimainkan lagi

  const pengamat = new IntersectionObserver((daftar) => {
    daftar.forEach(({ target: video, isIntersecting }) => {
      if (isIntersecting) {
        terlihat.add(video);
        if (gerakDikurangi.matches || dijedakan.has(video)) return;
        const hasil = video.play();
        if (hasil) hasil.catch(() => {});
      } else {
        terlihat.delete(video);
        video.pause();
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll("video[data-putar-sendiri]").forEach((video) => {
    video.addEventListener("pause", () => { if (terlihat.has(video) && !video.ended) dijedakan.add(video); });
    video.addEventListener("play", () => dijedakan.delete(video));
    pengamat.observe(video);
  });
})();

// Rute di atas alur menandai langkah yang sedang dibaca.
(() => {
  const tautan = [...document.querySelectorAll(".rute a")];
  if (!tautan.length || !("IntersectionObserver" in window)) return;
  const tandai = (id) => tautan.forEach((a) => a.classList.toggle("aktif", a.getAttribute("href") === "#" + id));
  const pengamat = new IntersectionObserver((daftar) => {
    daftar.forEach((d) => { if (d.isIntersecting) tandai(d.target.id); });
  }, { rootMargin: "-35% 0px -60% 0px" });
  document.querySelectorAll(".langkah").forEach((l) => pengamat.observe(l));
  tandai("langkah-1");
})();

// Tombol terang/gelap.
document.getElementById("tema").addEventListener("click", () => {
  const akar = document.documentElement;
  if (akar.dataset.theme === "dark") delete akar.dataset.theme; else akar.dataset.theme = "dark";
  try { localStorage.setItem("tema", akar.dataset.theme || "light"); } catch (e) {}
});
