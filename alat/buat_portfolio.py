# Membuat portfolio.html dari daftar RISET di situs.js dan kepala tiap halaman ringkasan. Jalankan dari akar repo setelah menambah paper.
import html
import json
import re
from pathlib import Path

teks = Path("situs.js").read_text()
blok = teks[teks.index("const RISET = [") + len("const RISET = "):teks.index("];", teks.index("const RISET = [")) + 1]
blok = re.sub(r"\bD \+ ", "", blok).replace('",\n];', '"\n]').replace("],\n]", "]\n]")
RISET = json.loads(blok)
BIDANG = re.findall(r'\{ t: "(\w+)", nama: "([^"]+)"', teks)


def isi_kepala(jalur):
    h = Path(jalur).read_text()
    lead = re.search(r'<p class="lead">(.*?)</p>', h, re.S).group(1)
    m = re.search(r"background-image: url\('\.\./([^']+)'\)", h)
    return html.unescape(re.sub(r"<[^>]+>", "", lead)).strip(), m.group(1) if m else None


FOTO_LAIN = {
    "riset/pensar-yogyakarta.html": "images/riset/pensar/yogyakarta-kota.jpg",
    "riset/pensar-bali.html": "images/riset/pensar/bali-kota.jpg",
    "riset/pensar-bangka.html": "images/riset/pensar/bangka-kota.jpg",
    "riset/spillover-or-still-over.html": "images/riset/spillover/lights-of-java.jpg",
}

kartu = [
    dict(judul="KOMITMEN dashboard site", meta="2026 · Project · KOMITMEN, UIII", ket=isi_kepala("proyek/komitmen-dashboard.html")[0], foto="images/proyek/komitmen/klip-3-sampul.jpg", tautan="proyek/komitmen-dashboard.html", topik=["reg", "env"], jenis="proyek"),
    dict(judul="Spillover or Still Over? SEZs in Indonesia", meta="2026 · Bachelor's thesis · Universitas Indonesia", ket=isi_kepala("riset/spillover-or-still-over.html")[0], foto=FOTO_LAIN["riset/spillover-or-still-over.html"], tautan="riset/spillover-or-still-over.html", topik=["reg", "env"], jenis="paper"),
]
for tahun, judul, ajang, _, _, hasil, topik, tautan in RISET:
    if not tautan.startswith("riset/"):
        continue
    ket, foto = isi_kepala(tautan)
    meta = f"{tahun} · {ajang.split(',')[0]}" + ("" if hasil in ("Fieldwork", "Submitted") else f" · {hasil}")
    kartu.append(dict(judul=judul, meta=meta, ket=ket, foto=foto or FOTO_LAIN[tautan], tautan=tautan, topik=topik, jenis="paper"))

saring = '<button type="button" aria-pressed="true" data-t="semua">All (%d)</button>' % len(kartu)
saring += "".join(f'<button type="button" aria-pressed="false" data-t="{t}">{html.escape(n)}</button>' for t, n in BIDANG)
isi = "\n".join(
    f'      <a class="kartu-karya" href="{k["tautan"]}" data-topik="{" ".join(k["topik"])}" style="background-image:url(\'{k["foto"]}\')">'
    f'<span class="meta">{html.escape(k["meta"])}</span><h2>{html.escape(k["judul"])}</h2><p>{html.escape(k["ket"])}</p></a>'
    for k in kartu
)
dasar = Path("index.html").read_text()
pita = re.search(r'<header class="pita">.*?</header>', dasar, re.S).group(0)
pita = pita.replace('href="#"', 'href="index.html"').replace('href="#', 'href="index.html#').replace('class="tombol" href="portfolio.html"', 'class="tombol" href="portfolio.html" aria-current="page"')
kaki = re.search(r"<footer>.*?</footer>", dasar, re.S).group(0)
Path("portfolio.html").write_text(f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Portfolio · Muhammad Ilham Pratama</title>
<meta name="description" content="Research papers, field surveys, and projects by Muhammad Ilham Pratama on Indonesian regional, environmental, and development economics.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Lato:ital,wght@0,400;0,700;0,900;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="gaya.css">
<link rel="stylesheet" href="portfolio.css">
<script>try {{ if (localStorage.getItem("tema") === "dark") document.documentElement.dataset.theme = "dark"; }} catch (e) {{}}</script>
</head>
<body>

{pita}

<main class="portofolio">
  <div class="wadah">
    <p class="supertitle">Portfolio</p>
    <h1>Research papers and projects</h1>
    <p class="pengantar">Each card opens a short summary of the work, with a link to the full paper or report.</p>
    <div class="saring" id="saring" role="group" aria-label="Filter by topic">{saring}</div>
    <div class="kisi-karya" id="kisi">
{isi}
    </div>
  </div>
</main>

{kaki}

<script src="portfolio.js"></script>
<script src="tema.js"></script>
</body>
</html>
""")
print(len(kartu), "kartu")
