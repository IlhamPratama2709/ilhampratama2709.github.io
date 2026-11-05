// Peta piksel di halaman PENSAR. Sprite berjalan dari Depok ke lokasi survei halaman ini.
const pejalan = document.getElementById("pejalan");
const kini = document.querySelector('.henti[aria-current="page"]');
setTimeout(() => {
  pejalan.style.left = kini.style.left;
  pejalan.style.top = kini.style.top;
}, 150);
