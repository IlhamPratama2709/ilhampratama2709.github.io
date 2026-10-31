// Saring kartu Portfolio menurut topik.
const saring = document.getElementById("saring");
saring.addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  saring.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", x === b));
  document.querySelectorAll(".kartu-karya").forEach((k) => {
    k.hidden = b.dataset.t !== "semua" && !k.dataset.topik.split(" ").includes(b.dataset.t);
  });
});
