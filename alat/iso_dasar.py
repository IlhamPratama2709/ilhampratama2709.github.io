"""Flat-isometric illustrations for the SETARA dashboard.

Run:  python3 iso.py            -> writes svg/*.svg and index.html
Every scene is built from the same primitives (box, roof, cylinder, ...) so
colours and proportions stay consistent across the four streams + hero.
"""
import math, os

U = 22                     # pixels per grid unit
C, S = math.cos(math.radians(30)), 0.5

# ---------- palette (SETARA: navy / teal / gold / light blue) ----------
def _mix(hex_, f):
    h = hex_.lstrip("#"); r, g, b = (int(h[i:i + 2], 16) for i in (0, 2, 4))
    t = 255 if f > 0 else 0; f = abs(f)
    return "#%02x%02x%02x" % tuple(round(c + (t - c) * f) for c in (r, g, b))

def shades(base):          # (top, left, right)
    return (_mix(base, 0.22), base, _mix(base, -0.22))

NAVY, TEAL, GOLD, SKY = "#1d4268", "#23807a", "#d6aa47", "#a9c8e8"
WHITE, PLATE, GREEN, INK = "#e9eef3", "#d5e0ea", "#5fb35c", "#13283f"

class Scene:
    def __init__(self):
        self.items, self.minx, self.miny, self.maxx, self.maxy = [], 1e9, 1e9, -1e9, -1e9

    def p(self, x, y, z):
        sx, sy = (x - y) * C * U, (x + y) * S * U - z * U
        self.minx, self.maxx = min(self.minx, sx), max(self.maxx, sx)
        self.miny, self.maxy = min(self.miny, sy), max(self.maxy, sy)
        return sx, sy

    def track(self, sx, sy, pad=0):
        self.minx, self.maxx = min(self.minx, sx - pad), max(self.maxx, sx + pad)
        self.miny, self.maxy = min(self.miny, sy - pad), max(self.maxy, sy + pad)

    def add(self, key, svg):
        self.items.append((key, len(self.items), svg))

    @staticmethod
    def poly(pts, fill, extra=""):
        return f'<polygon points="{" ".join(f"{x:.1f},{y:.1f}" for x, y in pts)}" fill="{fill}"{extra}/>'

    # ---- primitives -------------------------------------------------
    def box(self, x, y, z, w, d, h, base, key=None, stroke=False):
        t, l, r = shades(base)
        P = self.p
        st = ' stroke="#ffffff" stroke-width="1.6" stroke-linejoin="round"' if stroke else ""
        top = [P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)]
        left = [P(x, y + d, z + h), P(x + w, y + d, z + h), P(x + w, y + d, z), P(x, y + d, z)]
        right = [P(x + w, y, z + h), P(x + w, y + d, z + h), P(x + w, y + d, z), P(x + w, y, z)]
        k = key if key is not None else (x + w / 2 + y + d / 2 + z * 0.01)
        self.add(k, self.poly(left, l, st) + self.poly(right, r, st) + self.poly(top, t, st))

    def plate(self, x, y, w, d, h=0.6, base=PLATE):
        self.box(x, y, -h, w, d, h, base, key=-1e6)

    def roof(self, x, y, z, w, d, rh, base, key=None):
        """gable roof, ridge along x"""
        t, l, r = shades(base)
        P = self.p; ym = y + d / 2
        back = [P(x, y, z), P(x + w, y, z), P(x + w, ym, z + rh), P(x, ym, z + rh)]
        front = [P(x, ym, z + rh), P(x + w, ym, z + rh), P(x + w, y + d, z), P(x, y + d, z)]
        gable = [P(x + w, y, z), P(x + w, ym, z + rh), P(x + w, y + d, z)]
        k = key if key is not None else (x + w / 2 + y + d / 2 + z * 0.01 + 0.001)
        self.add(k, self.poly(back, t) + self.poly(front, l) + self.poly(gable, _mix(WHITE, -0.12)))

    def cylinder(self, x, y, z, r, h, base, key=None):
        t, l, rr = shades(base)
        cx, cb = self.p(x, y, z); _, ct = self.p(x, y, z + h)
        rx, ry = r * U * C * math.sqrt(2), r * U * S * math.sqrt(2)
        self.track(cx - rx, cb + ry); self.track(cx + rx, ct - ry)
        svg = (f'<ellipse cx="{cx:.1f}" cy="{cb:.1f}" rx="{rx:.1f}" ry="{ry:.1f}" fill="{rr}"/>'
               f'<rect x="{cx - rx:.1f}" y="{ct:.1f}" width="{rx:.1f}" height="{cb - ct:.1f}" fill="{l}"/>'
               f'<rect x="{cx:.1f}" y="{ct:.1f}" width="{rx:.1f}" height="{cb - ct:.1f}" fill="{rr}"/>'
               f'<ellipse cx="{cx:.1f}" cy="{ct:.1f}" rx="{rx:.1f}" ry="{ry:.1f}" fill="{t}"/>')
        self.add(key if key is not None else x + y + z * 0.01, svg)

    def tree(self, x, y, z=0, s=1.0):
        bx, by = self.p(x, y, z)
        hgt, wid = 46 * s, 15 * s
        self.track(bx - wid, by - hgt - 8 * s)
        svg = (f'<rect x="{bx - 2 * s:.1f}" y="{by - 9 * s:.1f}" width="{4 * s:.1f}" height="{9 * s:.1f}" fill="#7a5233"/>'
               + self.poly([(bx, by - hgt), (bx - wid, by - 7 * s), (bx, by - 3 * s)], _mix(GREEN, 0.15))
               + self.poly([(bx, by - hgt), (bx + wid, by - 7 * s), (bx, by - 3 * s)], _mix(GREEN, -0.15)))
        self.add(x + y + 0.5, svg)

    def person(self, x, y, z, shirt, s=1.0):
        bx, by = self.p(x, y, z)
        self.track(bx, by - 34 * s, 8)
        svg = (f'<rect x="{bx - 6 * s:.1f}" y="{by - 22 * s:.1f}" width="{12 * s:.1f}" height="{22 * s:.1f}" rx="{6 * s:.1f}" fill="{shirt}"/>'
               f'<rect x="{bx:.1f}" y="{by - 22 * s:.1f}" width="{6 * s:.1f}" height="{22 * s:.1f}" rx="{3 * s:.1f}" fill="{_mix(shirt, -0.2)}"/>'
               f'<circle cx="{bx:.1f}" cy="{by - 28 * s:.1f}" r="{5.5 * s:.1f}" fill="#e9b98d"/>')
        self.add(x + y + 0.6, svg)

    def pin(self, x, y, z, color=GOLD, s=1.0):
        bx, by = self.p(x, y, z)
        self.track(bx, by - 48 * s, 18 * s)
        svg = (f'<ellipse cx="{bx:.1f}" cy="{by:.1f}" rx="{9 * s:.1f}" ry="{4 * s:.1f}" fill="#000" opacity=".15"/>'
               f'<path d="M{bx:.1f} {by - 4 * s:.1f} C{bx - 6 * s:.1f} {by - 18 * s:.1f} {bx - 16 * s:.1f} {by - 24 * s:.1f} {bx - 16 * s:.1f} {by - 36 * s:.1f} '
               f'A{16 * s:.1f} {16 * s:.1f} 0 0 1 {bx + 16 * s:.1f} {by - 36 * s:.1f} C{bx + 16 * s:.1f} {by - 24 * s:.1f} {bx + 6 * s:.1f} {by - 18 * s:.1f} {bx:.1f} {by - 4 * s:.1f}Z" fill="{color}"/>'
               f'<path d="M{bx:.1f} {by - 4 * s:.1f} C{bx + 6 * s:.1f} {by - 18 * s:.1f} {bx + 16 * s:.1f} {by - 24 * s:.1f} {bx + 16 * s:.1f} {by - 36 * s:.1f} A{16 * s:.1f} {16 * s:.1f} 0 0 0 {bx:.1f} {by - 52 * s:.1f}Z" fill="{_mix(color, -0.15)}"/>'
               f'<circle cx="{bx:.1f}" cy="{by - 36 * s:.1f}" r="{6 * s:.1f}" fill="#fff"/>')
        self.add(1e5, svg)

    def solar(self, x, y, z, w=1.6, d=1.0):
        P = self.p
        pts = [P(x, y, z + 0.9), P(x + w, y, z + 0.9), P(x + w, y + d, z + 0.3), P(x, y + d, z + 0.3)]
        lines = ""
        for i in range(1, 4):
            a = P(x + w * i / 4, y, z + 0.9); b = P(x + w * i / 4, y + d, z + 0.3)
            lines += f'<line x1="{a[0]:.1f}" y1="{a[1]:.1f}" x2="{b[0]:.1f}" y2="{b[1]:.1f}" stroke="{SKY}" stroke-width="1"/>'
        a, b = P(x, y + d / 2, z + 0.6), P(x + w, y + d / 2, z + 0.6)
        lines += f'<line x1="{a[0]:.1f}" y1="{a[1]:.1f}" x2="{b[0]:.1f}" y2="{b[1]:.1f}" stroke="{SKY}" stroke-width="1"/>'
        lx, ly = P(x + w / 2, y + d / 2, z)
        stand = f'<rect x="{lx - 1.5:.1f}" y="{ly - 0.6 * U:.1f}" width="3" height="{0.6 * U:.1f}" fill="#8796a6"/>'
        self.add(x + w / 2 + y + d / 2 + z * 0.01, stand + self.poly(pts, "#1f3f66", ' stroke="#ffffff" stroke-width="1"') + lines)

    def turbine(self, x, y, z, h=6.0, angle=20):
        bx, by = self.p(x, y, z); hx, hy = self.p(x, y, z + h)
        L = 2.4 * U
        blades = ""
        for k in range(3):
            a = math.radians(angle + k * 120)
            ex, ey = hx + L * math.cos(a), hy + L * math.sin(a)
            nx, ny = -math.sin(a) * 4, math.cos(a) * 4
            blades += self.poly([(hx, hy), (hx + (ex - hx) * .25 + nx, hy + (ey - hy) * .25 + ny), (ex, ey)], "#ffffff", ' stroke="#c4cfdb" stroke-width="1"')
            self.track(ex, ey, 4)
        svg = (self.poly([(bx - 4, by), (bx + 4, by), (hx + 1.5, hy), (hx - 1.5, hy)], "#f4f7fa", ' stroke="#c4cfdb" stroke-width="1"')
               + blades + f'<circle cx="{hx:.1f}" cy="{hy:.1f}" r="4" fill="{GOLD}"/>')
        self.add(x + y + 0.7, svg)

    def arrow_up(self, pts3d, color=GOLD, width=5):
        pts = [self.p(*q) for q in pts3d]
        (x1, y1), (x2, y2) = pts[-2], pts[-1]
        a = math.atan2(y2 - y1, x2 - x1)
        hd = [(x2 + 14 * math.cos(a), y2 + 14 * math.sin(a)),
              (x2 + 9 * math.cos(a + 2.2), y2 + 9 * math.sin(a + 2.2)),
              (x2 + 9 * math.cos(a - 2.2), y2 + 9 * math.sin(a - 2.2))]
        self.track(*hd[0], 6)
        d = "M" + " L".join(f"{x:.1f} {y:.1f}" for x, y in pts)
        self.add(2e5, f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round"/>' + self.poly(hd, color))

    def svg(self, pad=14, title=""):
        body = "".join(s for _, _, s in sorted(self.items, key=lambda t: (t[0], t[1])))
        x0, y0 = self.minx - pad, self.miny - pad
        w, h = self.maxx - self.minx + 2 * pad, self.maxy - self.miny + 2 * pad
        return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x0:.0f} {y0:.0f} {w:.0f} {h:.0f}" role="img" aria-label="{title.replace("&", "&amp;")}">'
                f'<title>{title.replace("&", "&amp;")}</title>{body}</svg>')

# ---------- scenes (each takes an offset so the hero can reuse them) ----------
def house(sc, x, y, roof):
    sc.box(x, y, 0, 1.8, 1.6, 1.3, WHITE)
    sc.roof(x - 0.1, y - 0.1, 1.3, 2.0, 1.8, 0.9, roof)
    dx, dy = sc.p(x + 1.0, y + 1.6, 0)
    sc.add(x + 0.9 + y + 0.8 + 0.002,
           sc.poly([(dx, dy), (dx + 0.35 * C * U, dy + 0.35 * S * U), (dx + 0.35 * C * U, dy + 0.35 * S * U - 0.8 * U), (dx, dy - 0.8 * U)], NAVY))

def scene_region(sc, ox=0, oy=0, plate=True):
    """1 · Kebijakan Transisi Berbasis Daerah — readiness map of regions"""
    if plate: sc.plate(ox, oy, 7.6, 7.6)
    hs = [[1.0, 2.2, 0.6], [1.6, 3.2, 1.2], [0.5, 1.4, 2.0]]
    cols = [[SKY, TEAL, SKY], [TEAL, NAVY, SKY], [SKY, TEAL, TEAL]]
    for i in range(3):
        for j in range(3):
            sc.box(ox + 0.5 + i * 2.25, oy + 0.5 + j * 2.25, 0, 2.0, 2.0, hs[i][j], cols[i][j], stroke=True)
    sc.pin(ox + 3.75, oy + 3.75, 3.2, GOLD, 1.15)

def scene_growth(sc, ox=0, oy=0, plate=True):
    """2 · Pertumbuhan Ekonomi Inklusif dan Setara — rising bars + coins"""
    if plate: sc.plate(ox, oy, 7.6, 7.6)
    for k, (h, col) in enumerate([(1.4, SKY), (2.4, TEAL), (3.6, NAVY), (5.0, GOLD)]):
        sc.box(ox + 0.6 + k * 1.7, oy + 1.0, 0, 1.3, 1.3, h, col, stroke=True)
    for k, n in enumerate([3, 5, 2]):
        for j in range(n):
            sc.cylinder(ox + 1.6 + k * 1.6, oy + 5.4 + (k % 2) * 0.6, j * 0.28, 0.55, 0.22, GOLD, key=ox + oy + 9 + k + j * 0.01)
    sc.arrow_up([(ox + 0.8, oy + 3.4, 2.6), (ox + 2.6, oy + 3.4, 3.4), (ox + 4.2, oy + 3.4, 3.2), (ox + 6.8, oy + 3.4, 6.4)], GOLD)

def scene_household(sc, ox=0, oy=0, plate=True):
    """3 · Pekerja Produktif, Rumah Tangga Tangguh — homes, workers, safety net"""
    if plate: sc.plate(ox, oy, 7.6, 7.6)
    house(sc, ox + 0.6, oy + 0.6, NAVY)
    house(sc, ox + 3.2, oy + 0.6, TEAL)
    house(sc, ox + 0.6, oy + 3.3, TEAL)
    sc.box(ox + 3.6, oy + 3.6, 0, 3.2, 3.2, 0.12, _mix(TEAL, 0.55), key=-1e5)   # shared yard (ground decal)
    sc.person(ox + 4.6, oy + 5.0, 0.12, NAVY)
    sc.person(ox + 5.6, oy + 4.6, 0.12, GOLD)
    sc.person(ox + 5.4, oy + 6.0, 0.12, TEAL, 0.8)
    sc.tree(ox + 6.6, oy + 1.2); sc.tree(ox + 6.9, oy + 2.4, s=0.8); sc.tree(ox + 1.0, oy + 6.6, s=0.9)
    # shield (resilience) floating
    bx, by = sc.p(ox + 5.3, oy + 5.2, 3.6)
    sc.track(bx, by - 20, 20)
    sc.add(3e5, f'<path d="M{bx:.1f} {by - 20:.1f} L{bx + 15:.1f} {by - 14:.1f} V{by - 2:.1f} C{bx + 15:.1f} {by + 9:.1f} {bx + 6:.1f} {by + 15:.1f} {bx:.1f} {by + 18:.1f} '
                f'C{bx - 6:.1f} {by + 15:.1f} {bx - 15:.1f} {by + 9:.1f} {bx - 15:.1f} {by - 2:.1f} V{by - 14:.1f}Z" fill="{GOLD}"/>'
                f'<path d="M{bx - 6:.1f} {by:.1f} l5 5 l9 -10" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>')

def scene_industry(sc, ox=0, oy=0, plate=True):
    """4 · Industri yang Kompetitif — factory, chimney, solar, wind"""
    if plate: sc.plate(ox, oy, 7.6, 7.6)
    sc.box(ox + 0.6, oy + 0.8, 0, 4.6, 2.8, 1.8, WHITE)
    for k in range(3):   # multi-gable roof, front gable last
        sc.roof(ox + 0.6, oy + 0.8 + k * 0.933, 1.8, 4.6, 0.933, 0.55, NAVY, key=ox + oy + 5.2 + k * 0.01)
    sc.cylinder(ox + 1.2, oy + 0.2, 0, 0.35, 4.4, "#8a98a8", key=ox + oy + 0.5)
    sc.box(ox + 2.4, oy + 3.6, 0, 0.9, 0.05, 1.1, TEAL, key=ox + oy + 5.3)   # loading door
    for i in range(2):
        for j in range(2):
            sc.solar(ox + 0.8 + i * 2.0, oy + 4.6 + j * 1.4, 0)
    sc.turbine(ox + 6.4, oy + 1.4, 0, 6.2, 25)
    sc.turbine(ox + 6.6, oy + 4.2, 0, 4.8, 70)
    # gear badge
    bx, by = sc.p(ox + 4.4, oy + 0.6, 4.6)
    teeth = "".join(f'<rect x="{bx - 3:.1f}" y="{by - 15:.1f}" width="6" height="7" rx="1" fill="{GOLD}" transform="rotate({a} {bx:.1f} {by:.1f})"/>' for a in range(0, 360, 45))
    sc.track(bx, by, 18)
    sc.add(3e5, teeth + f'<circle cx="{bx:.1f}" cy="{by:.1f}" r="10" fill="{GOLD}"/><circle cx="{bx:.1f}" cy="{by:.1f}" r="4" fill="#fff"/>')

def pyramid(sc, x, y, z, w, d, h, base, key=None):
    t, l, r = shades(base)
    P = sc.p; apex = P(x + w / 2, y + d / 2, z + h)
    k = key if key is not None else x + w / 2 + y + d / 2 + z * 0.01
    sc.add(k, sc.poly([P(x, y + d, z), P(x + w, y + d, z), apex], l) + sc.poly([P(x + w, y, z), P(x + w, y + d, z), apex], r))

def screen_line(sc, x0, y0, z0, w, h, vals, color, width=3, key=4e5):
    """polyline drawn on the vertical plane y = y0 (faces the viewer's left)"""
    pts = [sc.p(x0 + w * i / (len(vals) - 1), y0, z0 + h * v) for i, v in enumerate(vals)]
    d = "M" + " L".join(f"{a:.1f} {b:.1f}" for a, b in pts)
    sc.add(key, f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round"/>')

def scene_macro(sc, ox=0, oy=0, plate=True):
    """1 · Climate & Macroeconomic Modeling — model screen, data blocks, thermometer"""
    if plate: sc.plate(ox, oy, 7.6, 7.6)
    sc.box(ox + 3.2, oy + 1.6, 0, 0.7, 0.3, 0.9, NAVY)                          # stand
    sc.box(ox + 0.8, oy + 1.4, 0.9, 5.6, 0.35, 3.6, NAVY, key=ox + oy + 3.7)    # monitor
    P = sc.p; yf = oy + 1.75
    sc.add(ox + oy + 3.71, sc.poly([P(ox + 1.05, yf, 1.15), P(ox + 6.15, yf, 1.15), P(ox + 6.15, yf, 4.25), P(ox + 1.05, yf, 4.25)], "#eef4fb"))
    for i, hgt in enumerate([0.5, 0.8, 0.65, 1.1, 1.3]):                      # bars on screen
        bx = ox + 1.4 + i * 0.5
        sc.add(4e5, sc.poly([P(bx, yf, 1.35), P(bx + 0.32, yf, 1.35), P(bx + 0.32, yf, 1.35 + hgt), P(bx, yf, 1.35 + hgt)], SKY))
    screen_line(sc, ox + 1.35, yf, 1.6, 4.5, 2.3, [0.1, 0.25, 0.2, 0.45, 0.55, 0.5, 0.75, 0.95], GOLD)
    screen_line(sc, ox + 1.35, yf, 1.6, 4.5, 2.3, [0.05, 0.12, 0.2, 0.22, 0.3, 0.38, 0.42, 0.5], TEAL, 2.5)
    for i, (hh, col) in enumerate([(0.9, TEAL), (1.5, SKY), (0.6, NAVY)]):  # data blocks
        sc.box(ox + 1.0 + i * 1.3, oy + 4.6, 0, 1.0, 1.0, hh, col, stroke=True)
    sc.cylinder(ox + 6.0, oy + 5.4, 0, 0.32, 2.8, "#f2f4f7", key=ox + oy + 11.4)   # thermometer
    sc.cylinder(ox + 6.0, oy + 5.4, 0, 0.32, 1.4, "#c8553d", key=ox + oy + 11.41)
    sc.cylinder(ox + 6.0, oy + 5.4, 0, 0.55, 0.5, "#c8553d", key=ox + oy + 11.42)
    gx, gy = P(ox + 6.4, oy + 1.0, 6.4)                                          # globe
    sc.track(gx, gy, 26)
    sc.add(5e5, f'<circle cx="{gx:.1f}" cy="{gy:.1f}" r="22" fill="{TEAL}"/>'
                f'<path d="M{gx - 14:.1f} {gy - 9:.1f} q8 -6 14 0 t10 6 q-4 8 -12 6 t-12 -12z" fill="{GREEN}"/>'
                f'<ellipse cx="{gx:.1f}" cy="{gy:.1f}" rx="22" ry="8" fill="none" stroke="#fff" stroke-opacity=".6"/>'
                f'<ellipse cx="{gx:.1f}" cy="{gy:.1f}" rx="9" ry="22" fill="none" stroke="#fff" stroke-opacity=".6"/>')

def scene_stranded(sc, ox=0, oy=0, plate=True):
    """2 · Climate and Asset Management — coal terraces, barge on water, subsiding house"""
    if plate:
        sc.box(ox, oy, -0.6, 7.6, 4.0, 0.6, PLATE, key=-1e6)                    # land
        sc.box(ox, oy + 4.0, -0.6, 7.6, 3.6, 0.35, "#7fb2d9", key=-1e6 + 1)     # water
    for i, (s, z) in enumerate([(3.4, 0), (2.6, 0.45), (1.8, 0.9), (1.0, 1.35)]):  # coal stockpile terraces
        o = (3.4 - s) / 2
        sc.box(ox + 0.4 + o, oy + 0.4 + o, z, s, s, 0.45, "#3d434b", key=ox + oy + 4 + i * 0.1)
    pyramid(sc, ox + 1.55, oy + 1.55, 1.8, 1.1, 1.1, 0.7, "#2c3137", key=ox + oy + 4.5)
    sc.box(ox + 1.2, oy + 4.6, -0.25, 4.2, 1.5, 0.5, "#5b4a3a", key=ox + oy + 10)    # barge
    for i in range(3):
        pyramid(sc, ox + 1.4 + i * 1.35, oy + 4.75, 0.25, 1.2, 1.2, 0.8, "#2c3137", key=ox + oy + 10.5 + i * 0.01)
    house(sc, ox + 4.6, oy + 1.4, "#b13e4b")
    bx, by = sc.p(ox + 6.9, oy + 1.2, 2.2)                                       # subsidence arrow
    sc.track(bx, by + 30, 16)
    sc.add(5e5, f'<path d="M{bx:.1f} {by - 14:.1f} V{by + 14:.1f}" stroke="{GOLD}" stroke-width="5" stroke-linecap="round"/>'
                + sc.poly([(bx - 9, by + 10), (bx + 9, by + 10), (bx, by + 24)], GOLD))
    sc.tree(ox + 6.8, oy + 3.4, s=0.8); sc.tree(ox + 0.6, oy + 3.6, s=0.7)

def scene_capacity(sc, ox=0, oy=0, plate=True):
    """7 · Capacity Building — campus hall, board, participants, graduation cap"""
    if plate: sc.plate(ox, oy, 7.6, 7.6)
    sc.box(ox + 0.6, oy + 0.6, 0, 6.4, 1.8, 2.2, WHITE)                          # hall
    sc.box(ox + 0.5, oy + 0.5, 2.2, 6.6, 2.0, 0.3, NAVY, key=ox + oy + 4.2)
    for i in range(6):                                                            # columns
        sc.box(ox + 0.9 + i * 1.15, oy + 2.45, 0, 0.3, 0.3, 2.2, "#f4f6f9", key=ox + oy + 5.35 + i * 0.01)
    sc.box(ox + 0.8, oy + 3.4, 0, 0.15, 2.4, 1.9, NAVY, key=ox + oy + 5.6)         # board (faces +x)
    P = sc.p; xf = ox + 0.95
    sc.add(ox + oy + 5.61, sc.poly([P(xf, oy + 3.55, 0.45), P(xf, oy + 5.65, 0.45), P(xf, oy + 5.65, 1.75), P(xf, oy + 3.55, 1.75)], "#eef4fb"))
    for (a, b) in [(0.7, 0.75), (0.95, 1.0), (1.2, 1.4)]:
        p1, p2 = P(xf, oy + 3.8, a + 0.2), P(xf, oy + 3.8 + 1.5 * b, a + 0.2)
        sc.add(4e5, f'<line x1="{p1[0]:.1f}" y1="{p1[1]:.1f}" x2="{p2[0]:.1f}" y2="{p2[1]:.1f}" stroke="{TEAL}" stroke-width="3" stroke-linecap="round"/>')
    for r, c in [(0, 0), (0, 1), (0, 2), (1, 0), (1, 1), (1, 2)]:
        sc.person(ox + 3.2 + c * 1.1, oy + 3.9 + r * 1.3, 0, [NAVY, TEAL, GOLD][(r + c) % 3], 0.95)
    cx, cy = P(ox + 1.2, oy + 6.6, 3.0)                                          # graduation cap
    sc.track(cx, cy, 30)
    sc.add(5e5, sc.poly([(cx - 26, cy), (cx, cy - 13), (cx + 26, cy), (cx, cy + 13)], NAVY)
                + sc.poly([(cx - 13, cy + 6), (cx + 13, cy + 6), (cx + 13, cy + 18), (cx - 13, cy + 18)], _mix(NAVY, -0.2))
                + f'<path d="M{cx:.1f} {cy:.1f} L{cx + 20:.1f} {cy + 6:.1f} V{cy + 22:.1f}" stroke="{GOLD}" stroke-width="2.5" fill="none"/><circle cx="{cx + 20:.1f}" cy="{cy + 24:.1f}" r="3.5" fill="{GOLD}"/>')

# ---------- compact icons: one object per stream on a 4x4 tile ----------
def _tile(sc): sc.plate(0, 0, 4, 4, 0.5)

def icon_macro(sc):
    _tile(sc)
    sc.box(1.7, 1.5, 0, 0.5, 0.3, 0.6, NAVY)
    sc.box(0.3, 1.2, 0.6, 3.4, 0.3, 2.3, NAVY, key=3.0)
    P = sc.p; yf = 1.5
    sc.add(3.01, sc.poly([P(0.5, yf, 0.8), P(3.5, yf, 0.8), P(3.5, yf, 2.7), P(0.5, yf, 2.7)], "#eef4fb"))
    for i, h in enumerate([0.35, 0.6, 0.5, 0.85]):
        bx = 0.75 + i * 0.35
        sc.add(4e5, sc.poly([P(bx, yf, 0.95), P(bx + 0.22, yf, 0.95), P(bx + 0.22, yf, 0.95 + h), P(bx, yf, 0.95 + h)], SKY))
    screen_line(sc, 0.7, yf, 1.1, 2.6, 1.4, [0.1, 0.3, 0.25, 0.55, 0.7, 1.0], GOLD, 3.5)
    sc.cylinder(3.75, 2.5, 0, 0.22, 1.6, "#f2f4f7", key=6.6)
    sc.cylinder(3.75, 2.5, 0, 0.22, 0.8, "#c8553d", key=6.61)
    sc.cylinder(3.75, 2.5, 0, 0.38, 0.32, "#c8553d", key=6.62)

def icon_stranded(sc):
    _tile(sc)
    for i, (s, z) in enumerate([(3.0, 0), (2.2, 0.4), (1.4, 0.8)]):
        o = (3.0 - s) / 2
        sc.box(0.5 + o, 0.5 + o, z, s, s, 0.4, "#3d434b", key=3 + i * 0.1)
    pyramid(sc, 1.45, 1.45, 1.2, 1.1, 1.1, 0.8, "#2c3137", key=3.5)
    bx, by = sc.p(3.6, 0.6, 2.4)
    sc.track(bx, by + 34, 14)
    sc.add(5e5, f'<path d="M{bx:.1f} {by - 12:.1f} V{by + 16:.1f}" stroke="{GOLD}" stroke-width="6" stroke-linecap="round"/>'
                + sc.poly([(bx - 11, by + 12), (bx + 11, by + 12), (bx, by + 28)], GOLD))

def icon_growth(sc):
    _tile(sc)
    for k, (h, col) in enumerate([(1.0, SKY), (1.8, TEAL), (2.8, GOLD)]):
        sc.box(0.4 + k * 1.15, 1.4, 0, 0.9, 0.9, h, col, stroke=True)
    sc.arrow_up([(0.4, 2.8, 1.6), (1.6, 2.8, 2.2), (2.4, 2.8, 2.0), (3.8, 2.8, 3.6)], NAVY, 5)

def icon_region(sc):
    _tile(sc)
    for i, j, h, c in [(0, 0, 0.8, SKY), (1, 0, 1.6, TEAL), (0, 1, 1.2, TEAL), (1, 1, 2.2, NAVY)]:
        sc.box(0.35 + i * 1.7, 0.35 + j * 1.7, 0, 1.55, 1.55, h, c, stroke=True)
    sc.pin(2.75, 2.75, 2.2, GOLD, 1.0)

def icon_household(sc):
    _tile(sc)
    house(sc, 0.4, 0.4, TEAL)
    sc.person(3.5, 2.0, 0, NAVY, 1.1)
    sc.person(3.4, 2.9, 0, GOLD, 0.9)
    sc.tree(3.4, 0.7, s=0.8)

def icon_industry(sc):
    _tile(sc)
    sc.box(0.4, 0.8, 0, 2.6, 2.0, 1.2, WHITE)
    for k in range(2):
        sc.roof(0.4, 0.8 + k * 1.0, 1.2, 2.6, 1.0, 0.5, NAVY, key=3.6 + k * 0.01)
    sc.cylinder(0.8, 0.4, 0, 0.25, 2.6, "#8a98a8", key=1.2)
    sc.turbine(3.6, 0.6, 0, 3.4, 30)

def icon_capacity(sc):
    _tile(sc)
    for i, col in enumerate([NAVY, TEAL, GOLD]):
        sc.box(0.8 + i * 0.06, 0.9 - i * 0.04, i * 0.35, 2.4, 1.8, 0.35, col, key=3 + i * 0.1, stroke=True)
    cx, cy = sc.p(2.05, 1.8, 1.9)
    sc.track(cx, cy - 20, 40)
    sc.add(5e5, sc.poly([(cx - 40, cy - 4), (cx, cy - 24), (cx + 40, cy - 4), (cx, cy + 16)], "#16324a")
                + sc.poly([(cx - 20, cy + 6), (cx + 20, cy + 6), (cx + 20, cy + 24), (cx - 20, cy + 24)], "#0d2233")
                + f'<path d="M{cx:.1f} {cy - 4:.1f} L{cx + 30:.1f} {cy + 4:.1f} V{cy + 28:.1f}" stroke="{GOLD}" stroke-width="3" fill="none"/><circle cx="{cx + 30:.1f}" cy="{cy + 31:.1f}" r="4.5" fill="{GOLD}"/>')

def scene_hero(sc):
    """All four streams on one shared regional platform."""
    sc.box(-0.6, -0.6, -1.1, 18.8, 18.8, 0.6, _mix(NAVY, 0.1), key=-2e6)
    sc.plate(0, 0, 17.6, 17.6, 0.5)
    # roads
    for (x, y, w, d) in [(8.2, 0, 1.2, 17.6), (0, 8.2, 17.6, 1.2)]:
        sc.box(x, y, 0, w, d, 0.02, "#b9c6d3", key=-5e5)
    scene_region(sc, 0, 0, plate=False)
    scene_growth(sc, 10, 0, plate=False)
    scene_household(sc, 0, 10, plate=False)
    scene_industry(sc, 10, 10, plate=False)
    for (x, y) in [(8.9, 9.6), (9.7, 8.9)]:
        sc.tree(x - 1.2, y - 1.2, s=0.8)

SCENES = {
    "stream1_kebijakan_daerah": ("Kebijakan Transisi Berbasis Daerah", scene_region),
    "stream2_pertumbuhan_inklusif": ("Pertumbuhan Ekonomi yang Inklusif dan Setara", scene_growth),
    "stream3_pekerja_rumah_tangga": ("Pekerja yang Produktif, Rumah Tangga yang Tangguh", scene_household),
    "stream4_industri_kompetitif": ("Industri yang Kompetitif", scene_industry),
    "stream_macro": ("Climate & Macroeconomic Modeling", scene_macro),
    "stream_stranded": ("Climate and Asset Management (Stranded Assets)", scene_stranded),
    "stream_capacity": ("Capacity Building", scene_capacity),
    "ikon1": ("Ikon Stream 1", icon_macro),
    "ikon2": ("Ikon Stream 2", icon_stranded),
    "ikon3": ("Ikon Stream 3", icon_growth),
    "ikon4": ("Ikon Stream 4", icon_region),
    "ikon5": ("Ikon Stream 5", icon_household),
    "ikon6": ("Ikon Stream 6", icon_industry),
    "ikon7": ("Ikon Stream 7", icon_capacity),
    "hero_setara": ("SETARA: empat stream dalam satu wilayah", scene_hero),
}

if __name__ == "__main__":
    here = os.path.dirname(os.path.abspath(__file__))
    os.makedirs(os.path.join(here, "svg"), exist_ok=True)
    out = {}
    for name, (title, fn) in SCENES.items():
        sc = Scene(); fn(sc); out[name] = sc.svg(title=title)
        open(os.path.join(here, "svg", name + ".svg"), "w").write(out[name])
    tpl = open(os.path.join(here, "template.html")).read()
    for name, s in out.items():
        tpl = tpl.replace("{{" + name + "}}", s)
    open(os.path.join(here, "index.html"), "w").write(tpl)
    print("ok")
