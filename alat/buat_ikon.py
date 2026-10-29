"""Ikon isometrik untuk situs pribadi (29 Okt 2026).

Primitif dari iso_dasar.py (salinan dari skill ppt-komitmen-owid), palet situs: navy #003a5d, emas #cc9e42.
Keluaran SVG di images/ikon/.

  reg  jalan tol melintasi kota kecil, pin emas
  env  pembangkit: cerobong, menara pendingin, panel surya
  dev  rumah tangga dan warga
  lab  gedung kantor/pabrik dan pekerja
  kek  kawasan industri dengan pohon di sekitarnya (skripsi)

python3 -I alat/buat_ikon.py
"""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import iso_dasar as iso  # noqa: E402

iso.NAVY, iso.TEAL, iso.GOLD, iso.SKY = '#003a5d', '#42a29a', '#cc9e42', '#5ca2ce'
NAVY, TEAL, GOLD, SKY, WHITE = iso.NAVY, iso.TEAL, iso.GOLD, iso.SKY, iso.WHITE
ASPAL, ABU = '#4a5560', '#8a98a8'


def reg(sc):
    sc.plate(0, 0, 4.4, 4.4, 0.5)
    sc.box(0, 1.75, 0, 4.4, 0.9, 0.06, ASPAL, key=-1e5)                     # jalan tol
    for k in range(5):                                                       # marka emas
        sc.box(0.2 + k * 0.9, 2.15, 0.06, 0.45, 0.1, 0.01, GOLD, key=-9e4)
    for (x, y, h, c) in [(0.3, 0.3, 1.6, NAVY), (1.6, 0.3, 1.0, SKY), (2.9, 0.4, 1.3, TEAL)]:
        sc.box(x, y, 0, 1.0, 1.0, h, c, stroke=True)
    iso.house(sc, 2.6, 2.9, TEAL)
    sc.box(1.0, 1.85, 0.06, 0.7, 0.4, 0.3, GOLD, key=4)                     # mobil
    sc.tree(0.6, 3.4, 0, 0.8)
    sc.pin(1.0, 3.4, 0.4, GOLD, 0.8)


def env(sc):
    sc.plate(0, 0, 4.4, 4.4, 0.5)
    sc.box(0.4, 0.5, 0, 1.6, 1.3, 1.1, WHITE)
    sc.roof(0.4, 0.5, 1.1, 1.6, 1.3, 0.4, NAVY)
    sc.cylinder(0.7, 0.3, 0, 0.18, 2.7, ABU, key=1.0)                        # cerobong
    sc.cylinder(3.1, 1.0, 0, 0.6, 1.5, '#c9d4dd', key=4.1)                   # menara pendingin
    for i in range(2):
        sc.solar(0.4 + i * 1.9, 2.6, 0, 1.5, 1.0)
    sc.tree(3.7, 3.6, 0, 0.7)


def dev(sc):
    sc.plate(0, 0, 4.4, 4.4, 0.5)
    iso.house(sc, 0.3, 0.3, NAVY)
    iso.house(sc, 2.4, 0.5, TEAL)
    sc.person(1.4, 3.2, 0, GOLD, 1.0)
    sc.person(2.3, 3.5, 0, NAVY, 0.85)
    sc.person(3.3, 3.0, 0, TEAL, 1.0)
    sc.tree(0.5, 3.6, 0, 0.7)


def lab(sc):
    sc.plate(0, 0, 4.4, 4.4, 0.5)
    sc.box(0.3, 0.3, 0, 1.5, 1.5, 2.6, NAVY, stroke=True)                   # gedung kantor
    sc.box(0.3, 0.3, 2.6, 1.5, 1.5, 0.12, GOLD)
    sc.box(2.3, 0.4, 0, 1.8, 1.4, 1.0, WHITE)                                # pabrik kecil
    sc.roof(2.3, 0.4, 1.0, 1.8, 1.4, 0.45, TEAL)
    sc.person(1.0, 3.0, 0, GOLD, 1.0)
    sc.person(2.0, 3.3, 0, SKY, 0.9)
    sc.person(3.2, 3.0, 0, NAVY, 1.0)


def kek(sc):
    sc.plate(0, 0, 5.2, 5.2, 0.5, base='#c9d6c0')
    sc.box(1.1, 1.1, 0, 3.0, 3.0, 0.08, '#d5e0ea', key=-1e5)                 # batas kawasan
    sc.box(1.4, 1.3, 0, 2.4, 1.4, 1.0, WHITE)
    for k in range(2):
        sc.roof(1.4, 1.3 + k * 0.7, 1.0, 2.4, 0.7, 0.35, NAVY, key=3.4 + k * 0.01)
    sc.cylinder(1.7, 1.0, 0, 0.16, 2.3, ABU, key=1.5)
    sc.box(1.5, 3.0, 0, 0.9, 0.9, 0.7, SKY, stroke=True)
    sc.box(2.7, 3.0, 0, 0.9, 0.9, 1.1, TEAL, stroke=True)
    for (x, y, s) in [(0.4, 0.5, 0.8), (0.4, 2.4, 0.9), (0.5, 4.4, 0.7), (4.6, 0.6, 0.8), (4.5, 2.6, 0.7), (2.6, 4.7, 0.8), (4.5, 4.5, 0.9)]:
        sc.tree(x, y, 0, s)
    sc.pin(3.4, 1.9, 1.6, GOLD, 1.0)


IKON = {'reg': reg, 'env': env, 'dev': dev, 'lab': lab, 'kek': kek}

if __name__ == '__main__':
    out = os.path.join(HERE, '..', 'images', 'ikon'); os.makedirs(out, exist_ok=True)
    for nama, fn in IKON.items():
        sc = iso.Scene(); fn(sc)
        open(os.path.join(out, nama + '.svg'), 'w').write(sc.svg(title=''))
    print('ok', list(IKON))
