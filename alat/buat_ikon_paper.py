"""Ikon isometrik halaman skripsi KEK dan cahaya malam (31 Okt 2026).

Primitif dari iso_dasar.py, palet situs: navy #003a5d, emas #cc9e42.

  kawasan     kawasan ekonomi khusus berpagar dengan gerbang
  cincin      kabupaten di sekitar kawasan, radius 60 km
  satelit     satelit merekam cahaya dan emisi
  banding     kabupaten dekat kawasan dan kabupaten pembanding
  malam       kota dengan lampu menyala pada malam hari
  manufaktur  kawasan pabrik dan peti kemas
  wisata      kawasan wisata pantai dengan asap dari pesawat dan kendaraan

python3 -I alat/buat_ikon_paper.py
"""
import math, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import iso_dasar as iso  # noqa: E402

iso.NAVY, iso.TEAL, iso.GOLD, iso.SKY = '#003a5d', '#42a29a', '#cc9e42', '#5ca2ce'
NAVY, TEAL, GOLD, SKY, WHITE = iso.NAVY, iso.TEAL, iso.GOLD, iso.SKY, iso.WHITE
ABU, LAMPU, MALAM, PASIR, LAUT, RUMPUT = '#8a98a8', '#ffd76a', '#12314a', '#ecd9a8', '#5ca2ce', '#c9d6c0'
C, S, U = iso.C, iso.S, iso.U


def jendela(sc, x, y, z, w, h, warna=LAMPU, kolom=3, baris=3, key=None):
    """Jendela menyala pada sisi kiri kotak (bidang y tetap)."""
    P, isi = sc.p, ''
    for i in range(kolom):
        for j in range(baris):
            a = x + w * (i + .22) / kolom; b = x + w * (i + .78) / kolom
            c = z + h * (j + .25) / baris; d = z + h * (j + .72) / baris
            isi += sc.poly([P(a, y, d), P(b, y, d), P(b, y, c), P(a, y, c)], warna)
    sc.add(key if key is not None else x + w / 2 + y + .02, isi)


def jendela_kanan(sc, x, y, z, d, h, warna=LAMPU, kolom=2, baris=3, key=None):
    """Jendela menyala pada sisi kanan kotak (bidang x tetap)."""
    P, isi = sc.p, ''
    for i in range(kolom):
        for j in range(baris):
            a = y + d * (i + .22) / kolom; b = y + d * (i + .78) / kolom
            c = z + h * (j + .25) / baris; e = z + h * (j + .72) / baris
            isi += sc.poly([P(x, a, e), P(x, b, e), P(x, b, c), P(x, a, c)], warna)
    sc.add(key if key is not None else x + y + d / 2 + .02, isi)


def gedung_malam(sc, x, y, w, d, h):
    sc.box(x, y, 0, w, d, h, '#2a4a66')
    k = x + w / 2 + y + d / 2 + .02
    jendela(sc, x, y + d, 0, w, h, kolom=3, baris=max(2, int(h * 1.6)), key=k)
    jendela_kanan(sc, x + w, y, 0, d, h, kolom=2, baris=max(2, int(h * 1.6)), key=k + .001)


def lingkaran(sc, x, y, r, warna, lebar=2, isi='none', opasitas=1, garis=None, key=-9e4):
    cx, cy = sc.p(x, y, 0)
    rx, ry = r * math.sqrt(2) * C * U, r * math.sqrt(2) * S * U
    sc.track(cx, cy - ry); sc.track(cx, cy + ry); sc.track(cx - rx, cy); sc.track(cx + rx, cy)
    g = f' stroke-dasharray="{garis}"' if garis else ''
    sc.add(key, f'<ellipse cx="{cx:.1f}" cy="{cy:.1f}" rx="{rx:.1f}" ry="{ry:.1f}" fill="{isi}" fill-opacity="{opasitas}" stroke="{warna}" stroke-width="{lebar}"{g}/>')


def cahaya(sc, x, y, r, warna=LAMPU, opasitas=.35):
    cx, cy = sc.p(x, y, 0)
    sc.add(-8e4, f'<ellipse cx="{cx:.1f}" cy="{cy:.1f}" rx="{r * math.sqrt(2) * C * U:.1f}" ry="{r * math.sqrt(2) * S * U:.1f}" fill="{warna}" opacity="{opasitas}"/>')


def asap(sc, x, y, z, s=1.0, warna='#b7c3cf', key=5e4):
    bx, by = sc.p(x, y, z)
    isi = ''
    for dx, dy, r in [(0, 0, 8), (8, -11, 10), (-2, -24, 12), (11, -36, 14)]:
        isi += f'<circle cx="{bx + dx * s:.1f}" cy="{by + dy * s:.1f}" r="{r * s:.1f}" fill="{warna}" opacity=".8"/>'
    sc.track(bx + 26 * s, by - 52 * s)
    sc.add(key, isi)


def palem(sc, x, y, s=1.0):
    bx, by = sc.p(x, y, 0)
    t = 42 * s
    isi = sc.poly([(bx - 2 * s, by), (bx + 2 * s, by), (bx + 5 * s, by - t), (bx + 2 * s, by - t)], '#8a6239')
    for dx, dy in [(-19, 5), (-13, -8), (2, -12), (17, -6), (22, 7)]:
        isi += sc.poly([(bx + 3.5 * s, by - t), (bx + dx * s, by - t + dy * s), (bx + dx * .45 * s, by - t + (dy + 7) * .6 * s)], '#3f9a63')
    sc.track(bx - 22 * s, by - t - 14 * s); sc.track(bx + 24 * s, by - t)
    sc.add(x + y + .5, isi)


def payung(sc, x, y, warna):
    bx, by = sc.p(x, y, 0)
    isi = f'<rect x="{bx - 1:.1f}" y="{by - 19:.1f}" width="2" height="19" fill="#7a5233"/><path d="M{bx - 12:.1f} {by - 15:.1f} Q{bx:.1f} {by - 31:.1f} {bx + 12:.1f} {by - 15:.1f}Z" fill="{warna}"/>'
    sc.add(x + y + .5, isi)


def pagar(sc, x, y, w, d):
    P = sc.p
    for a, b, k in [((x, y), (x + w, y), -5e4), ((x, y), (x, y + d), -5e4), ((x, y + d), (x + w, y + d), 9e3), ((x + w, y), (x + w, y + d), 9e3)]:
        p, q = P(*a, .28), P(*b, .28)
        p0, q0 = P(*a, 0), P(*b, 0)
        sc.add(k, sc.poly([p, q, q0, p0], GOLD, ' fill-opacity=".3" stroke="#a97f2a" stroke-width="1.4"'))


def rumah(sc, x, y, atap):
    sc.box(x, y, 0, .75, .7, .42, WHITE)
    sc.roof(x, y, .42, .75, .7, .28, atap)


def pabrik(sc, x, y, w, d, warna=NAVY):
    sc.box(x, y, 0, w, d, .9, WHITE)
    n = 2
    for k in range(n):
        sc.roof(x, y + k * d / n, .9, w, d / n, .32, warna, key=x + w / 2 + y + d / 2 + .5 + k * .01)


def kawasan(sc):
    sc.plate(0, 0, 5.4, 5.4, .5, base=RUMPUT)
    sc.box(.8, .8, 0, 3.8, 3.8, .06, '#dfe7ee', key=-1e5)
    pagar(sc, .8, .8, 3.8, 3.8)
    pabrik(sc, 1.1, 1.0, 2.0, 1.3)
    sc.cylinder(1.3, .95, 0, .15, 2.2, ABU, key=1.4)
    sc.box(3.3, 1.1, 0, .95, .95, 1.5, SKY, stroke=True)
    sc.box(1.2, 3.0, 0, 1.0, .9, .8, TEAL, stroke=True)
    sc.box(2.6, 3.0, 0, 1.0, .9, 1.2, GOLD, stroke=True)
    sc.box(4.6, 2.3, 0, .15, .15, 1.0, NAVY, key=9.5e3)
    sc.box(4.6, 3.2, 0, .15, .15, 1.0, NAVY, key=9.5e3)
    sc.box(4.6, 2.3, 1.0, .15, 1.05, .22, NAVY, key=9.6e3)
    for (x, y, s) in [(.3, .4, .8), (.3, 3.0, .9), (.4, 4.9, .7), (4.9, .4, .8), (5.0, 4.8, .7)]:
        sc.tree(x, y, 0, s)
    sc.pin(2.7, 2.2, 1.0, GOLD, .95)


def cincin(sc):
    sc.plate(0, 0, 7, 7, .5, base=RUMPUT)
    cahaya(sc, 3.5, 3.5, 2.6, GOLD, .25)
    lingkaran(sc, 3.5, 3.5, 2.6, NAVY, 2.2, garis='7 5')
    lingkaran(sc, 3.5, 3.5, 1.35, NAVY, 1.4, garis='3 4')
    sc.box(3.1, 3.1, 0, .8, .8, .7, NAVY, stroke=True)
    sc.box(3.1, 3.1, .7, .8, .8, .08, GOLD)
    for (x, y) in [(1.5, 3.2), (4.8, 2.6), (2.9, 5.0), (3.2, 1.5)]:
        rumah(sc, x, y, TEAL)
    for (x, y) in [(5.9, 5.8), (.3, .3), (6.0, .5), (.3, 6.0)]:
        rumah(sc, x, y, ABU)


def satelit(sc):
    sc.plate(0, 0, 5.2, 5.2, .5, base=MALAM)
    gedung_malam(sc, .7, .9, 1.1, 1.1, 1.4)
    gedung_malam(sc, 2.5, .7, 1.0, 1.0, 2.0)
    gedung_malam(sc, 1.4, 2.8, 1.1, 1.0, 1.1)
    gedung_malam(sc, 3.2, 2.7, 1.0, 1.1, 1.6)
    a, b, c = sc.p(.3, 3.4, 0), sc.p(4.2, 4.8, 0), sc.p(5.6, 5.6, 8.4)
    sc.add(3e4, sc.poly([a, b, c], LAMPU, ' opacity=".2"'))
    z = 8.1
    sc.box(5.2, 5.2, z, .9, .9, .9, ABU, key=4e4)
    sc.box(3.3, 5.5, z + .35, 1.8, .4, .06, '#1f3f66', key=4e4 + 1)
    sc.box(6.2, 5.5, z + .35, 1.8, .4, .06, '#1f3f66', key=4e4 + 2)
    sc.box(5.4, 5.4, z - .3, .5, .5, .3, GOLD, key=4e4 + 3)


def banding(sc):
    sc.plate(0, 0, 3.5, 3.5, .5, base=RUMPUT)
    sc.box(.5, .5, 0, 1.1, 1.1, 1.0, NAVY, stroke=True)
    sc.box(.5, .5, 1.0, 1.1, 1.1, .08, GOLD)
    sc.pin(1.05, 1.05, 1.1, GOLD, .75)
    rumah(sc, 2.3, .7, TEAL); rumah(sc, 1.0, 2.3, TEAL); rumah(sc, 2.4, 2.2, TEAL)
    sc.box(6.2, 0, -.5, 3.5, 3.5, .5, RUMPUT, key=-1e6)
    for (x, y) in [(6.7, .7), (8.2, .9), (6.8, 2.2), (8.2, 2.3)]:
        rumah(sc, x, y, ABU)
    sc.tree(9.2, 3.1, 0, .7); sc.tree(6.5, 3.2, 0, .7)
    sc.arrow_up([(3.9, 1.3, .4), (5.8, 1.3, .4)], GOLD, 4)
    sc.arrow_up([(5.8, 2.2, .4), (3.9, 2.2, .4)], GOLD, 4)


def malam(sc):
    sc.plate(0, 0, 5.6, 5.6, .5, base=MALAM)
    sc.box(0, 2.45, 0, 5.6, .7, .04, '#223f58', key=-7e4)
    cahaya(sc, 2.8, 2.8, 2.2, LAMPU, .3)
    for (x, y, w, d, h) in [(.5, .5, 1.1, 1.1, 2.3), (2.2, .4, 1.2, 1.2, 3.2), (4.0, .7, 1.0, 1.0, 1.5), (.7, 3.5, 1.1, 1.1, 1.3), (2.5, 3.5, 1.1, 1.2, 1.9), (4.2, 3.7, .9, .9, 1.0)]:
        gedung_malam(sc, x, y, w, d, h)
    for k in range(6):
        cx, cy = sc.p(.3 + k, 2.8, .05)
        sc.add(-6e4, f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="2.8" fill="{LAMPU}"/>')


def manufaktur(sc):
    sc.plate(0, 0, 5.4, 5.4, .5)
    pabrik(sc, .5, .5, 2.6, 1.6)
    sc.box(3.5, .6, 0, 1.3, 1.5, 1.2, NAVY, stroke=True)
    sc.cylinder(.9, .4, 0, .16, 2.6, ABU, key=1.2)
    sc.cylinder(1.6, .4, 0, .16, 2.2, ABU, key=1.3)
    asap(sc, .9, .4, 2.7, .7, key=2e3)
    for i, (x, y, c) in enumerate([(.6, 3.2, GOLD), (1.8, 3.2, TEAL), (3.0, 3.2, SKY), (.6, 4.2, SKY), (1.8, 4.2, NAVY), (1.8, 3.2, SKY)]):
        z = .55 if i == 5 else 0
        sc.box(x, y, z, 1.05, .6, .55, c, stroke=True)
    sc.person(3.9, 3.4, 0, GOLD, .85)
    sc.person(4.5, 4.1, 0, NAVY, .85)


def wisata(sc):
    sc.plate(0, 0, 6, 5.2, .5, base=PASIR)
    sc.box(0, 3.5, 0, 6, 1.7, .05, LAUT, key=-7e4)
    sc.box(.5, .5, 0, 1.5, 1.3, 1.9, WHITE, stroke=True)
    jendela(sc, .5, 1.8, 0, 1.5, 1.9, SKY, 3, 3, key=2.3)
    sc.box(.5, .5, 1.9, 1.5, 1.3, .12, TEAL)
    sc.box(2.6, .6, 0, 1.3, 1.2, 1.2, WHITE, stroke=True)
    jendela(sc, 2.6, 1.8, 0, 1.3, 1.2, SKY, 3, 2, key=3.4)
    sc.roof(2.6, .6, 1.2, 1.3, 1.2, .4, NAVY)
    iso.house(sc, 4.5, .6, TEAL)
    for (x, y, s) in [(.3, 2.5, 1.0), (2.2, 2.7, .85), (4.9, 2.6, 1.0)]:
        palem(sc, x, y, s)
    payung(sc, 1.4, 3.0, GOLD); payung(sc, 3.4, 3.0, '#d9694c')
    sc.box(3.4, 4.2, .05, 1.2, .4, .22, WHITE, stroke=True, key=8e3)
    asap(sc, 4.9, .9, 1.2, .62, key=3e3)


IKON = {'kawasan': kawasan, 'cincin': cincin, 'satelit': satelit, 'banding': banding, 'malam': malam, 'manufaktur': manufaktur, 'wisata': wisata}

if __name__ == '__main__':
    out = os.path.join(HERE, '..', 'images', 'riset', 'spillover', 'ikon'); os.makedirs(out, exist_ok=True)
    for nama, fn in IKON.items():
        sc = iso.Scene(); fn(sc)
        open(os.path.join(out, nama + '.svg'), 'w').write(sc.svg(title=''))
    print('ok', list(IKON))
