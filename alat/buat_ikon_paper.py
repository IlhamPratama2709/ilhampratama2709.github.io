"""Ikon isometrik halaman paper (31 Okt 2026).

Primitif dari iso_dasar.py, palet situs: navy #003a5d, emas #cc9e42.

  kawasan     kawasan ekonomi khusus berpagar dengan gerbang
  cincin      kabupaten di sekitar kawasan, radius 60 km
  satelit     satelit merekam cahaya dan emisi
  banding     kabupaten dekat kawasan dan kabupaten pembanding
  malam       kota dengan lampu menyala pada malam hari
  manufaktur  kawasan pabrik dan peti kemas
  wisata      kawasan wisata pantai dengan asap dari pesawat dan kendaraan
  ekstraktif  tangki dan pipa pengolahan sumber daya alam
  jasa        kantor dan hanggar kawasan jasa
  tambang     tambang terbuka dengan alat berat
  pelabuhan   pelabuhan dengan kapal dan derek
  tol         jalan tol dengan gerbang
  gudang      gudang dan truk logistik
  warung      warung dan penginapan di tepi jalan

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


def truk(sc, x, y, warna=TEAL, key=None):
    sc.box(x, y, .05, 1.0, .42, .42, WHITE, key=key)
    sc.box(x + 1.0, y, .05, .35, .42, .3, warna, key=key)


def ekstraktif(sc):
    sc.plate(0, 0, 5.4, 5.4, .5, base=RUMPUT)
    for (x, y, r, h) in [(1.2, 1.3, .8, 1.5), (3.2, 1.2, .8, 1.5), (1.3, 3.5, .65, 1.0)]:
        sc.cylinder(x, y, 0, r, h, WHITE, key=x + y + .5)
    sc.box(.8, 2.45, 0, 3.8, .12, .2, GOLD, key=-4e4)
    sc.box(3.0, 2.5, 0, .12, 2.2, .2, GOLD, key=-4e4)
    sc.cylinder(4.5, 3.9, 0, .1, 2.6, ABU, key=9)
    asap(sc, 4.5, 3.9, 2.7, .6, '#e0a15c', key=2e3)
    palem(sc, 2.4, 4.6, .8); palem(sc, .5, 4.8, .8)


def jasa(sc):
    sc.plate(0, 0, 5.4, 5.4, .5)
    sc.box(.5, .5, 0, 1.3, 1.3, 2.8, SKY, stroke=True)
    jendela(sc, .5, 1.8, 0, 1.3, 2.8, WHITE, 3, 5, key=2.2)
    sc.box(2.3, .5, 0, 1.1, 1.1, 1.8, NAVY, stroke=True)
    sc.box(1.0, 3.0, 0, 3.4, 1.8, 1.0, WHITE)
    sc.roof(1.0, 3.0, 1.0, 3.4, 1.8, .55, TEAL)
    sc.person(4.0, 1.2, 0, GOLD, .9); sc.person(4.5, 2.0, 0, NAVY, .9)


def tambang(sc):
    sc.plate(0, 0, 5.6, 5.6, .5, base='#d9b98a')
    for i, (o, w) in enumerate([(.3, 5.0), (1.0, 3.6), (1.7, 2.2)]):
        sc.box(o, o, 0, w, w, .02, ['#c9a26c', '#b78b55', '#a0763f'][i], key=-9e4 + i)
    sc.box(2.2, 2.2, 0, 1.1, .7, .55, GOLD, stroke=True)
    sc.box(2.5, 2.3, .55, .5, .5, .4, NAVY)
    sc.box(3.3, 2.45, .5, 1.1, .14, .14, GOLD, key=8)
    truk(sc, .8, 4.3, GOLD)
    sc.person(4.6, 4.4, 0, NAVY, .85)


def pelabuhan(sc):
    sc.plate(0, 0, 6, 5.2, .5)
    sc.box(0, 3.1, 0, 6, 2.1, .05, LAUT, key=-7e4)
    sc.box(1.0, 3.6, .05, 3.6, 1.0, .55, NAVY, key=7e3)
    sc.box(3.4, 3.7, .6, .9, .8, .8, WHITE, key=7e3 + 1)
    sc.box(1.5, 3.8, .6, .9, .6, .4, GOLD, key=7e3 + 2)
    sc.box(2.6, .9, 0, .18, .18, 3.2, GOLD, key=6)
    sc.box(2.6, .9, 3.2, .18, 2.6, .16, GOLD, key=7.5e3)
    for (x, y, c) in [(.5, .7, TEAL), (.5, 1.5, SKY), (1.5, 1.1, NAVY), (3.5, .7, SKY), (4.4, 1.5, TEAL)]:
        sc.box(x, y, 0, .9, .6, .5, c, stroke=True)


def tol(sc):
    sc.plate(0, 0, 6, 5, .5, base=RUMPUT)
    sc.box(0, 1.5, 0, 6, 2.0, .05, '#4a5560', key=-7e4)
    for k in range(6):
        sc.box(.2 + k, 2.45, .05, .55, .08, .01, GOLD, key=-6e4)
    sc.box(2.5, 1.0, 0, .45, .45, 1.1, WHITE, stroke=True)
    sc.box(2.5, 3.5, 0, .45, .45, 1.1, WHITE, stroke=True)
    sc.box(2.5, 1.0, 1.1, .45, 2.95, .2, NAVY, key=9e3)
    sc.box(.7, 1.75, .05, .9, .45, .35, SKY, key=2.7)
    truk(sc, 3.8, 2.7, GOLD, key=7.2)
    sc.tree(.5, .6, 0, .8); sc.tree(4.9, .5, 0, .8); sc.tree(.9, 4.4, 0, .8); sc.tree(5.1, 4.4, 0, .8)


def gudang(sc):
    sc.plate(0, 0, 5.4, 5.4, .5)
    sc.box(.6, .6, 0, 3.8, 2.0, 1.1, WHITE)
    sc.roof(.6, .6, 1.1, 3.8, 2.0, .5, NAVY)
    for x in (1.0, 2.2, 3.4):
        sc.box(x, 2.58, 0, .7, .03, .75, TEAL, key=x + 3)
    truk(sc, .8, 3.6, TEAL); truk(sc, 2.9, 3.9, GOLD)


def warung(sc):
    sc.plate(0, 0, 5.4, 5.4, .5, base=RUMPUT)
    sc.box(0, 3.4, 0, 5.4, 1.2, .05, '#4a5560', key=-7e4)
    sc.box(.6, .7, 0, 1.6, 1.2, .9, WHITE)
    sc.roof(.6, .7, .9, 1.6, 1.2, .4, '#d9694c')
    sc.box(2.8, .6, 0, 1.6, 1.3, 1.4, TEAL, stroke=True)
    jendela(sc, 2.8, 1.9, 0, 1.6, 1.4, WHITE, 3, 2, key=3.8)
    sc.person(1.4, 2.5, 0, GOLD, .9); sc.person(2.3, 2.7, 0, NAVY, .9); sc.person(3.4, 2.6, 0, TEAL, .9)
    payung(sc, .5, 2.6, GOLD)


IKON = {'kawasan': kawasan, 'cincin': cincin, 'satelit': satelit, 'banding': banding, 'malam': malam, 'manufaktur': manufaktur, 'wisata': wisata, 'ekstraktif': ekstraktif, 'jasa': jasa, 'tambang': tambang, 'pelabuhan': pelabuhan, 'tol': tol, 'gudang': gudang, 'warung': warung}

if __name__ == '__main__':
    out = os.path.join(HERE, '..', 'images', 'riset', 'ikon'); os.makedirs(out, exist_ok=True)
    for nama, fn in IKON.items():
        sc = iso.Scene(); fn(sc)
        open(os.path.join(out, nama + '.svg'), 'w').write(sc.svg(title=''))
    print('ok', list(IKON))
