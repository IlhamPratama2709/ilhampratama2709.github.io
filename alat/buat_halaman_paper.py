"""Bangun sub-page paper dari isi JSON (31 Okt 2026).

Isi tiap paper ada di alat/isi-paper/<slug>.json, foto di images/riset/<slug>/kepala.jpg.
Kerangka kepala dan kaki halaman disalin dari riset/spillover-or-still-over.html.
Keluaran: riset/<slug>.html dan data/lokasi-paper.json untuk peta.

python3 -I alat/buat_halaman_paper.py
"""
import glob, json, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
R = os.path.join(HERE, '..')
IK = '../images/riset/ikon/'
contoh = open(os.path.join(R, 'riset', 'spillover-or-still-over.html'), encoding='utf-8').read()
HEAD = contoh[contoh.index('<link rel="preconnect"'):contoh.index('</head>')].rstrip()
HDR = re.search(r'<header class="pita">.*?</header>', contoh, re.S).group(0)
FTR = re.search(r'<footer>\n  <div class="wadah">.*?</footer>', contoh, re.S).group(0)


def par(l):
    return '\n      '.join(f'<p>{x}</p>' for x in l)


def tabel(t):
    if not t or not t.get('baris'):
        return ''
    k = ''.join(f'<th>{x}</th>' for x in t['kolom'])
    b = ''.join('<tr>' + ''.join(f'<td>{x}</td>' for x in r) + '</tr>' for r in t['baris'])
    c = f'<p class="catatan">{t["catatan"]}</p>' if t.get('catatan') else ''
    sel = [str(x) for r in t['baris'] for x in r[1:]]
    kelas = 'teks' if sum(len(x) for x in sel) / max(len(sel), 1) > 22 else 'kanan'   # tabel berisi kalimat rata kiri
    return f'<div class="tabel-gulir"><table class="{kelas}"><thead><tr>{k}</tr></thead><tbody>{b}</tbody></table></div>{c}'


def rantai(l):
    return '<ol class="rantai">' + ''.join(f'<li><img src="{IK}{i}.svg" alt=""><b>{a}</b><span>{b}</span></li>' for i, a, b in l) + '</ol>'


def jenis(p):
    l = p.get('jenis') or []
    if not l:
        return ''
    k = 'dua-jenis tiga' if len(l) == 3 else 'dua-jenis'
    isi = ''.join(f'<div><img src="{IK}{i}.svg" alt=""><h4>{a}</h4><p>{b}</p></div>' for i, a, b in l)
    return f'<h3>{p.get("jenis_judul", "")}</h3>\n      <div class="{k}">{isi}</div>'


def bingkai(g, t):
    d = json.dumps(g['data'], ensure_ascii=False).replace("'", '&#39;')
    return f'''<figure class="gr" data-gr>
        <header><h3>{g["judul"]}</h3><p>{g["sub"]}</p></header>
        <div class="gr-tab" role="tablist"><button role="tab" aria-selected="true" data-p="grafik">Chart</button><button role="tab" aria-selected="false" data-p="tabel">Table</button><button role="tab" aria-selected="false" data-p="sumber">Sources</button></div>
        <div data-panel="grafik">
          <div class="att" role="img" aria-label="{g["aria"]}" data-rentang="{json.dumps(g["rentang"])}" data-garis="{json.dumps(g["garis"])}" data-att='{d}'></div>
          <div class="att-legenda"><span><i class="isi"></i>Significant at 5 percent</span><span><i></i>Not significant at 5 percent</span><span>Lines show 95 percent confidence intervals</span></div>
        </div>
        <div data-panel="tabel" hidden>{tabel(t)}</div>
        <div data-panel="sumber" hidden><p>{g["sumber"]}</p></div>
        <footer>{g["kaki"]}</footer>
      </figure>'''


def temuan(p):
    a = bingkai(p['grafik'], p.get('tabel')) if p.get('grafik') else ('<h3>Key figures</h3>\n      ' + tabel(p.get('tabel')) if p.get('tabel') else '')
    b = jenis(p)
    c = '\n      '.join(f'<h3>{s["judul"]}</h3>\n      <p>{s["teks"]}</p>' for s in p.get('sub') or [])
    return '\n      '.join(x for x in (a, b, c) if x)


def halaman(p):
    f = p['foto_pilih']
    tautan = f'<p><a href="{p["tautan"]}">Open the paper folder</a>. Other work is in the <a href="../index.html#riset">research list</a>.</p>' if p.get('tautan') else '<p>Other work is in the <a href="../index.html#riset">research list</a>.</p>'
    bagian = [('ringkasan', 'Executive summary', par(p['ringkasan'])), ('sekilas', 'How the study works', rantai(p['rantai'])),
              ('pertanyaan', 'The question', par(p['pertanyaan'])), ('metode-paper', 'Data and method', par(p['metode'])),
              ('temuan', 'Findings', temuan(p)), ('penjelasan', 'Interpretation', par(p['interpretasi']))]
    if p.get('kebijakan'):
        bagian.append(('kebijakan', 'Policy implications', '<ol>' + ''.join(f'<li><b>{a}.</b> {b}</li>' for a, b in p['kebijakan']) + '</ol>'))
    if p.get('batas'):
        bagian.append(('batas', 'Limitations', par(p['batas'])))
    bagian.append(('sitasi', 'How to cite', f'<p class="sitasi">{p["sitasi"]}</p>\n      {tautan}'))
    toc = ''.join(f'<a href="#{i}">{j}</a>' for i, j, _ in bagian)
    isi = '\n\n    '.join(f'<section id="{i}">\n      <h2>{j}</h2>\n      {h}\n    </section>' for i, j, h in bagian)
    tanda = f'<li class="emas">{p["hasil"]}</li><li class="lokasi">{p["lokasi"]["wilayah"]}</li>' + ''.join(f'<li>{t}</li>' for t in p['tanda'])
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{p["pendek"]} · Muhammad Ilham Pratama</title>
<meta name="description" content="{p["desk"]}">
{HEAD}
</head>
<body>

{HDR}

<div class="kepala-foto siang" data-lokasi="{p["lokasi"]["wilayah"]}" style="background-image: url('../images/riset/{p["slug"]}/kepala.jpg')">
  <div class="wadah">
    <p class="supertitle">{p["super"]}</p>
    <h1>{p["judul"]}</h1>
    <p class="lead">{p["lead"]}</p>
    <ul class="tanda">{tanda}</ul>
    <p class="meta-kepala">{p["penulis"]}</p>
  </div>
  <a class="kredit-foto" href="{f["url"]}">{f["teks"]}</a>
</div>

<div class="wadah tata-paper">
  <aside class="daftar-isi" aria-label="On this page">
    <b>On this page</b>
    <div>{toc}</div>
  </aside>

  <main class="naskah">
    {isi}
  </main>
</div>

{FTR}

<script src="../paper.js"></script>
<script src="../tema.js"></script>
</body>
</html>
'''


# paper yang halamannya ditulis tangan atau dibuat sesi lain, hanya masuk data lokasi
LAIN = [
    dict(slug='spillover-or-still-over', judul="Spillover or Still Over?", jenis='Thesis', tahun=2026, hasil='Bappenas book chapter', wilayah='Indonesia', lat=-2.5, lon=118.0, skala='nasional', ajang_kota=None, ajang_lat=None, ajang_lon=None),
    dict(slug='when-spillovers-dont-spill', judul="When Spillovers Don't Spill", jenis='Competition', tahun=2025, hasil='2nd place', wilayah='Sumatra', lat=-0.5, lon=101.5, skala='pulau', ajang_kota=None, ajang_lat=None, ajang_lon=None),
    dict(slug='illuminating-downstreaming', judul='Illuminating Downstreaming', jenis='Competition', tahun=2025, hasil='2nd place', wilayah='Sulawesi, Maluku, and Papua', lat=-2.5, lon=127.0, skala='regional', ajang_kota=None, ajang_lat=None, ajang_lon=None),
    dict(slug='trans-java-toll-road', judul='Paving the Way, Sustaining Hope', jenis='Competition', tahun=2025, hasil='1st place', wilayah='East Java', lat=-7.6, lon=112.5, skala='provinsi', ajang_kota=None, ajang_lat=None, ajang_lon=None),
]

if __name__ == '__main__':
    lokasi = list(LAIN)
    for f in sorted(glob.glob(os.path.join(HERE, 'isi-paper', '*.json'))):
        p = json.load(open(f, encoding='utf-8'))
        open(os.path.join(R, 'riset', p['slug'] + '.html'), 'w', encoding='utf-8').write(halaman(p))
        l = p['lokasi']
        lokasi.append(dict(slug=p['slug'], judul=p['pendek'], jenis='Competition', tahun=int(re.findall(r'20\d\d', p['super'])[-1]), hasil=p['hasil'],
                           wilayah=l['wilayah'], lat=l['wilayah_lat'], lon=l['wilayah_lon'], skala=l['skala'], ajang_kota=l.get('ajang_kota'), ajang_lat=l.get('ajang_lat'), ajang_lon=l.get('ajang_lon')))
    os.makedirs(os.path.join(R, 'data'), exist_ok=True)
    for x in lokasi:
        x['halaman'] = f'riset/{x["slug"]}.html'
    json.dump(lokasi, open(os.path.join(R, 'data', 'lokasi-paper.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(len(lokasi), 'paper')
