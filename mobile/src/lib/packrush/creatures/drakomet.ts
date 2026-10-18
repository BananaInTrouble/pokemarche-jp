import { aura, eye, ground, ink, line, shadow, shine, sparkle, speckles, type DrawCtx, type Species } from './style.ts';

const f = (v: number) => v.toFixed(1);
const P = (x: number, y: number) => `${f(x)} ${f(y)}`;

/** Tête de dragon de face : cornes, collerettes en nageoires, museau large ; l'adulte a le regard plus perçant. */
function head(c: DrawCtx, hx: number, hy: number, hr: number, st: number): string {
  const { pal } = c;
  let s = '';
  // Cornes balayées vers l'arrière, plus longues à chaque stade.
  const hl = [0.55, 1.0, 1.45][st];
  for (const d of [-1, 1]) {
    const bx = hx + d * hr * 0.42, by = hy - hr * 0.62;
    const tx = hx + d * hr * (0.75 + hl * 0.75), ty = hy - hr * (0.62 + hl * 0.72);
    s += ink(`M${P(bx - d * hr * 0.12, by + 2)} C${P(bx - d * hr * 0.1, by - hr * 0.5 * hl)} ${P(tx - d * hr * 0.4, ty + hr * 0.08)} ${P(tx, ty)} C${P(tx - d * hr * 0.22, ty + hr * 0.3)} ${P(bx + d * hr * 0.22, by - hr * 0.3 * hl)} ${P(bx + d * hr * 0.2, by + 4)} Z`, pal.light, 2.2);
    if (st >= 1) s += line(`M${P(bx, by - hr * 0.2 * hl)} l${f(d * hr * 0.16)} -1 M${P(bx + d * hr * 0.1, by - hr * 0.45 * hl)} l${f(d * hr * 0.14)} -1`, 1.4);
  }
  // Collerettes latérales (nageoires à rayons).
  const fl = [0.9, 1.05, 1.2][st];
  for (const d of [-1, 1]) {
    const ax = hx + d * hr * 0.85, ay = hy - hr * 0.2;
    const fin = `M${P(ax, ay - hr * 0.25)} L${P(ax + d * hr * 0.75 * fl, ay - hr * 0.55 * fl)} Q${P(ax + d * hr * 0.55 * fl, ay - hr * 0.18)} ${P(ax + d * hr * 0.8 * fl, ay + hr * 0.05)} Q${P(ax + d * hr * 0.5 * fl, ay + hr * 0.2)} ${P(ax + d * hr * 0.62 * fl, ay + hr * 0.5 * fl)} L${P(ax, ay + hr * 0.35)} Z`;
    s += ink(fin, pal.accent, 2.2);
    s += line(`M${P(ax + d * 2, ay - hr * 0.1)} L${P(ax + d * hr * 0.65 * fl, ay - hr * 0.45 * fl)} M${P(ax + d * 2, ay + hr * 0.02)} L${P(ax + d * hr * 0.7 * fl, ay + hr * 0.03)} M${P(ax + d * 2, ay + hr * 0.18)} L${P(ax + d * hr * 0.55 * fl, ay + hr * 0.42 * fl)}`, 1.3);
  }
  // Crête de piquants entre les cornes.
  if (st >= 1) for (const [u, hgt] of [[-0.18, 0.32], [0, 0.42], [0.18, 0.32]]) {
    const x = hx + u * hr, y = hy - hr * 0.78, k = hgt * (st === 2 ? 1.3 : 1);
    s += ink(`M${P(x - hr * 0.09, y + 4)} L${P(x, y - hr * k)} L${P(x + hr * 0.09, y + 4)} Z`, pal.accent, 1.6);
  }
  // Crâne + joues.
  const sw = [1.0, 0.95, 0.86][st];
  const sl = [1, 1.05, 1.22][st];
  const Y = (k: number) => hy + hr * (k > 0.35 ? 0.35 + (k - 0.35) * sl : k);
  const hd = `M${P(hx - hr, hy)} C${P(hx - hr * 1.02, hy - hr * 0.98)} ${P(hx + hr * 1.02, hy - hr * 0.98)} ${P(hx + hr, hy)}`
    + ` C${P(hx + hr * 1.0, Y(0.4))} ${P(hx + hr * 0.8 * sw, Y(0.6))} ${P(hx + hr * 0.72 * sw, Y(0.82))}`
    + ` C${P(hx + hr * 0.6 * sw, Y(1.12))} ${P(hx - hr * 0.6 * sw, Y(1.12))} ${P(hx - hr * 0.72 * sw, Y(0.82))}`
    + ` C${P(hx - hr * 0.8 * sw, Y(0.6))} ${P(hx - hr * 1.0, Y(0.4))} ${P(hx - hr, hy)} Z`;
  s += ink(hd, pal.body, 2.7);
  s += shadow(`M${P(hx + hr * 0.6, hy - hr * 0.68)} C${P(hx + hr * 1.02, hy - hr * 0.4)} ${P(hx + hr * 1.0, Y(0.4))} ${P(hx + hr * 0.7 * sw, Y(0.85))} C${P(hx + hr * 0.75, hy + hr * 0.3)} ${P(hx + hr * 0.82, hy - hr * 0.2)} ${P(hx + hr * 0.6, hy - hr * 0.68)} Z`, pal.shade, 0.6);
  // Museau clair.
  s += ink(`M${P(hx - hr * 0.58 * sw, Y(0.62))} C${P(hx - hr * 0.62 * sw, Y(1.08))} ${P(hx + hr * 0.62 * sw, Y(1.08))} ${P(hx + hr * 0.58 * sw, Y(0.62))} C${P(hx + hr * 0.35, Y(0.42))} ${P(hx - hr * 0.35, Y(0.42))} ${P(hx - hr * 0.58 * sw, Y(0.62))} Z`, pal.belly, 1.6);
  for (const d of [-1, 1]) s += `<ellipse cx="${f(hx + d * hr * 0.17)}" cy="${f(Y(0.62))}" rx="${f(hr * 0.06)}" ry="${f(hr * 0.04)}" fill="${pal.ink}"/>`;
  // Bouche (+ crocs à l'âge adulte).
  if (st === 0) s += line(`M${P(hx - hr * 0.22, Y(0.82))} q${f(hr * 0.22)} ${f(hr * 0.2)} ${f(hr * 0.44)} 0`, 1.8);
  else s += line(`M${P(hx - hr * 0.38, Y(0.8))} q${f(hr * 0.38)} ${f(hr * 0.14)} ${f(hr * 0.76)} 0`, 1.8);
  if (st >= 1) for (const d of [-1, 1]) s += ink(`M${P(hx + d * hr * 0.3, Y(0.84))} l${f(d * hr * 0.04)} ${f(hr * 0.14 * (st === 2 ? 1.3 : 1))} l${f(d * hr * 0.06)} ${f(-hr * 0.13 * (st === 2 ? 1.3 : 1))} Z`, '#FFF6D8', 1.1);
  s += shine(`M${P(hx - hr * 0.7, hy - hr * 0.4)} q${f(hr * 0.15)} ${f(-hr * 0.3)} ${f(hr * 0.45)} ${f(-hr * 0.38)}`, 2.4);
  // Marque de comète au front.
  const my = hy - hr * 0.55;
  s += line(`M${P(hx + 2, my + 1)} l${f(hr * 0.28)} ${f(-hr * 0.14)} M${P(hx + 2, my + 4)} l${f(hr * 0.24)} ${f(-hr * 0.02)}`, 1.6, pal.glow);
  s += sparkle(hx, my + 2, hr * 0.14, pal.glow);
  // Yeux.
  const er = hr * [0.3, 0.24, 0.2][st], ey = hy + hr * 0.08, ex = hr * 0.45;
  s += eye(hx - ex, ey, er, pal.eye, 0.1) + eye(hx + ex, ey, er, pal.eye, 0.1);
  if (st >= 1) {
    // Arcade sourcilière : douce chez le jeune, tranchante et noble chez l'adulte.
    for (const d of [-1, 1]) {
      const k = st === 2 ? 0.55 : 0.2;
      s += ink(`M${P(hx + d * (ex - er * 1.25), ey - er * (1.0 + k))} Q${P(hx + d * ex, ey - er * 1.55)} ${P(hx + d * (ex + er * 1.3), ey - er * 1.1)} L${P(hx + d * (ex + er * 1.2), ey - er * 0.85)} Q${P(hx + d * ex, ey - er * 1.25)} ${P(hx + d * (ex - er * 1.1), ey - er * (0.75 + k * 0.7))} Z`, pal.shade, 1.6);
    }
  } else {
    s += `<ellipse cx="${f(hx - hr * 0.72)}" cy="${f(hy + hr * 0.45)}" rx="${f(hr * 0.14)}" ry="${f(hr * 0.08)}" fill="#FF8FB1" opacity="0.6"/><ellipse cx="${f(hx + hr * 0.72)}" cy="${f(hy + hr * 0.45)}" rx="${f(hr * 0.14)}" ry="${f(hr * 0.08)}" fill="#FF8FB1" opacity="0.6"/>`;
  }
  return s;
}

/** Aile membraneuse étoilée : bras jusqu'au poignet, trois doigts, bord festonné. */
function wing(c: DrawCtx, dir: number, sx: number, sy: number, span: number, h: number, grand: boolean): string {
  const { pal } = c;
  const W = [sx + dir * span * 0.45, sy - h];
  const T = [[sx + dir * span, sy - h * 0.72], [sx + dir * span * 0.98, sy - h * 0.12], [sx + dir * span * 0.72, sy + h * 0.3]];
  const B = [sx + dir * span * 0.12, sy + h * 0.38];
  const mid = (a: number[], b: number[], k: number) => {
    // Point de feston : milieu tiré vers le poignet.
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
    return P(mx + (W[0] - mx) * k, my + (W[1] - my) * k);
  };
  const mem = `M${P(sx, sy)} C${P(sx + dir * span * 0.1, sy - h * 0.6)} ${P(W[0] - dir * span * 0.15, W[1] + h * 0.1)} ${P(W[0], W[1])}`
    + ` L${P(T[0][0], T[0][1])} Q${mid(T[0], T[1], 0.22)} ${P(T[1][0], T[1][1])} Q${mid(T[1], T[2], 0.25)} ${P(T[2][0], T[2][1])}`
    + ` Q${mid(T[2], B, 0.28)} ${P(B[0], B[1])} Z`;
  let s = ink(mem, pal.shade, 2.6);
  s += `<path d="${mem}" fill="${pal.accent2}" opacity="0.18"/>`;
  // Étoiles dans la membrane (triangles poignet/doigts, jamais hors de l'aile).
  const tri = [[W, T[0], T[1]], [W, T[1], T[2]], [W, T[2], B], [[sx, sy], W, B]];
  const pts: number[][] = [];
  if (grand) s += line(`M${P(T[0][0], T[0][1])} Q${mid(T[0], T[1], 0.22)} ${P(T[1][0], T[1][1])} Q${mid(T[1], T[2], 0.25)} ${P(T[2][0], T[2][1])} Q${mid(T[2], B, 0.28)} ${P(B[0], B[1])}`, 5, pal.glow, ' opacity="0.35"');
  {
    for (let i = 0; i < 26; i++) {
      const [a, b, d] = tri[i % 4];
      let u = c.r(), v = c.r();
      if (u + v > 1) { u = 1 - u; v = 1 - v; }
      u *= 0.82; v *= 0.82;
      const x = a[0] + u * (b[0] - a[0]) + v * (d[0] - a[0]), y = a[1] + u * (b[1] - a[1]) + v * (d[1] - a[1]);
      pts.push([x, y]);
      s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(0.7 + c.r() * 1.3)}" fill="#FFF6D8" opacity="${f(0.6 + c.r() * 0.4)}"/>`;
    }
    const cs = [pts[0], pts[4], pts[1], pts[5]];
    s += line(cs.map((p, i) => `${i ? 'L' : 'M'}${P(p[0], p[1])}`).join(' '), 1.1, pal.glow, ' opacity="0.8"');
    for (const p of cs) s += sparkle(p[0], p[1], 3, '#FFF6D8', false);
  }
  // Os : bras et doigts.
  const arm = `M${P(sx, sy)} C${P(sx + dir * span * 0.1, sy - h * 0.6)} ${P(W[0] - dir * span * 0.15, W[1] + h * 0.1)} ${P(W[0], W[1])}`;
  s += line(arm, 7) + line(arm, 4, pal.body);
  for (const t of T) { const d = `M${P(W[0], W[1])} L${P(t[0], t[1])}`; s += line(d, 4.4) + line(d, 2, pal.body); }
  if (grand) for (const k of [0.3, 0.55, 0.8]) {
    const x = sx + (W[0] - sx) * k, y = sy + (W[1] - sy) * k - h * 0.12 * Math.sin(k * Math.PI);
    s += ink(`M${P(x - 3, y)} L${P(x + dir * 2, y - 8)} L${P(x + 4, y + 1)} Z`, pal.light, 1.2);
  }
  // Griffe du poignet.
  s += ink(`M${P(W[0] - dir * 4, W[1] + 1)} L${P(W[0] + dir * 2, W[1] - 11)} L${P(W[0] + dir * 5, W[1] + 2)} Z`, pal.light, 1.4);
  return s;
}

/** Queue terminée par une comète (boule lumineuse + traînée). */
function cometTail(c: DrawCtx, pts: number[][], w: number, tip: number[], tr: number): string {
  const { pal } = c;
  const [a, b, d, e] = pts;
  const spine = `M${P(a[0], a[1])} C${P(b[0], b[1])} ${P(d[0], d[1])} ${P(e[0], e[1])}`;
  let s = line(spine, w + 5) + line(spine, w, pal.body);
  s += line(spine, w * 0.35, pal.belly, ' opacity="0.7" stroke-dasharray="3 5"');
  // Traînée de la comète.
  const ang = Math.atan2(e[1] - d[1], e[0] - d[0]);
  const back = (k: number, off: number) => P(tip[0] - Math.cos(ang) * tr * k - Math.sin(ang) * off, tip[1] - Math.sin(ang) * tr * k + Math.cos(ang) * off);
  s += `<circle cx="${f(tip[0])}" cy="${f(tip[1])}" r="${f(tr * 2.2)}" fill="${pal.glow}" opacity="0.35" filter="url(#glow)"/>`;
  s += ink(`M${back(0, -tr)} C${back(1.5, -tr * 1.3)} ${back(2.8, -tr * 0.4)} ${back(3.8, 0)} C${back(2.8, tr * 0.4)} ${back(1.5, tr * 1.3)} ${back(0, tr)} Z`, pal.accent2, 1.8);
  s += line(`M${back(0.5, -tr * 0.4)} L${back(2.6, -tr * 0.25)} M${back(0.5, tr * 0.4)} L${back(2.4, tr * 0.25)}`, 1.4, '#FFF6D8');
  s += ink(`M${P(tip[0] - tr, tip[1])} a${f(tr)} ${f(tr)} 0 1 0 ${f(tr * 2)} 0 a${f(tr)} ${f(tr)} 0 1 0 ${f(-tr * 2)} 0 Z`, pal.glow, 2);
  s += sparkle(tip[0], tip[1], tr * 0.7, '#FFF6D8', false);
  return s;
}

/** Drakomet → Wyvernova → Cométhéon : dragon des comètes, né d'un œuf-météorite. */
export const drakomet: Species = (c) => {
  const { pal, stage } = c;
  const st = Math.min(stage, 2);
  const gy = 206, cx = 111;
  let s = '';

  if (st === 0) {
    // --- Bébé qui éclot d'un œuf-météorite ---
    const ex = cx, ey = 158, erx = 70, ery = 50;
    // Traînées de chute.
    for (const [o, l] of [[-14, 40], [8, 56], [30, 34]]) {
      const x0 = ex - erx * 0.7 + o, y0 = ey - ery * 0.55 - o * 0.6;
      s += `<path d="M${P(x0, y0 - 3)} L${P(x0 - l, y0 - l * 0.8)} L${P(x0 + 3, y0 + 3)} Z" fill="${pal.glow}" opacity="0.45"/>`;
      s += sparkle(x0 - l, y0 - l * 0.8, 2.5, '#FFF6D8', false);
    }
    s += ground(ex, gy + 2, 86);
    // Cratère au sol.
    s += ink(`M${P(ex - erx - 14, gy - 2)} q14 -10 30 -4 L${P(ex + erx - 16, gy - 6)} q16 -6 30 4 q-60 10 -${2 * erx + 14} 0 Z`, pal.shade, 1.8);
    // Intérieur de la coquille.
    s += ink(`M${P(ex - erx * 0.92, ey - 12)} C${P(ex - erx * 0.8, ey - ery * 0.6)} ${P(ex + erx * 0.8, ey - ery * 0.6)} ${P(ex + erx * 0.92, ey - 12)} Z`, pal.ink, 2);
    // Petites ailes qui dépassent.
    for (const d of [-1, 1]) {
      const wx = ex + d * 38, wy = 118;
      s += ink(`M${P(wx, wy + 14)} L${P(wx + d * 20, wy - 22)} L${P(wx + d * 30, wy - 8)} Q${P(wx + d * 22, wy - 2)} ${P(wx + d * 28, wy + 6)} Q${P(wx + d * 16, wy + 8)} ${P(wx + d * 16, wy + 18)} Z`, pal.accent2, 2.2);
      s += line(`M${P(wx + d * 2, wy + 10)} L${P(wx + d * 26, wy - 8)} M${P(wx + d * 4, wy + 13)} L${P(wx + d * 26, wy + 5)}`, 1.6, pal.body);
    }
    // Poitrail.
    s += ink(`M${P(ex - 32, ey - 4)} C${P(ex - 34, ey - 30)} ${P(ex + 34, ey - 30)} ${P(ex + 32, ey - 4)} Z`, pal.body, 2.4);
    s += ink(`M${P(ex - 16, ey - 6)} C${P(ex - 16, ey - 24)} ${P(ex + 16, ey - 24)} ${P(ex + 16, ey - 6)} Z`, pal.belly, 1.5);
    s += head(c, ex, 104, 42, 0);
    // Coquille avant : roche à cratères, fissures lumineuses, bord en zigzag.
    const zz = [[-1, -14], [-0.8, -4], [-0.62, -20], [-0.42, -6], [-0.2, -18], [0, -4], [0.22, -16], [0.42, -2], [0.62, -18], [0.8, -6], [1, -12]];
    let shell = `M${P(ex - erx, ey - 12)}`;
    for (const [u, v] of zz) shell += ` L${P(ex + u * erx, ey + v)}`;
    shell += ` C${P(ex + erx * 1.08, ey + ery * 0.6)} ${P(ex + erx * 0.55, gy - 2)} ${P(ex, gy - 2)} C${P(ex - erx * 0.55, gy - 2)} ${P(ex - erx * 1.08, ey + ery * 0.6)} ${P(ex - erx, ey - 12)} Z`;
    s += ink(shell, pal.shade, 2.8);
    s += shadow(`M${P(ex + erx * 0.3, gy - 4)} C${P(ex + erx * 0.8, gy - 10)} ${P(ex + erx * 1.02, ey + ery * 0.3)} ${P(ex + erx * 0.98, ey - 6)} C${P(ex + erx * 0.8, ey + ery * 0.5)} ${P(ex + erx * 0.6, gy - 14)} ${P(ex + erx * 0.3, gy - 4)} Z`, pal.ink, 0.4);
    for (const [u, v, r0] of [[-0.55, 0.15, 9], [0.1, 0.45, 12], [0.55, 0.05, 7], [-0.2, 0.75, 6], [0.62, 0.6, 5]]) {
      const x = ex + u * erx, y = ey + v * ery;
      s += ink(`M${P(x - r0, y)} a${r0} ${r0 * 0.7} 0 1 0 ${f(r0 * 2)} 0 a${r0} ${r0 * 0.7} 0 1 0 ${f(-r0 * 2)} 0 Z`, pal.body, 1.5);
      s += `<path d="M${P(x - r0 * 0.8, y - r0 * 0.1)} a${f(r0 * 0.8)} ${f(r0 * 0.5)} 0 0 1 ${f(r0 * 1.6)} 0 Z" fill="${pal.ink}" opacity="0.35"/>`;
    }
    const cracks = `M${P(ex - erx * 0.42, ey - 6)} l6 14 l-8 10 l6 12 M${P(ex + erx * 0.22, ey - 16)} l-4 16 l10 8 l-2 14 M${P(ex + erx * 0.8, ey - 6)} l-8 12 l4 10`;
    s += line(cracks, 4.2, pal.ink) + line(cracks, 2, pal.glow);
    s += shine(`M${P(ex - erx * 0.8, ey + 4)} q4 18 16 30`, 2.4);
    // Petites griffes sur le rebord.
    for (const d of [-1, 1]) {
      const x = ex + d * 30, y = ey - 12;
      s += ink(`M${P(x - 9, y + 6)} C${P(x - 10, y - 6)} ${P(x + 10, y - 6)} ${P(x + 9, y + 6)} Z`, pal.body, 2);
      s += line(`M${P(x - 4, y - 1)} l0 4 M${P(x + 1, y - 2)} l0 4 M${P(x + 5, y - 1)} l0 4`, 1.3);
    }
    // Fragment de coquille sur la tête.
    s += ink(`M${P(cx - 30, 70)} L${P(cx - 22, 58)} L${P(cx - 14, 66)} L${P(cx - 6, 54)} L${P(cx + 2, 64)} C${P(cx - 6, 74)} ${P(cx - 22, 76)} ${P(cx - 30, 70)} Z`, pal.shade, 2.2);
    s += line(`M${P(cx - 20, 70)} l4 -6 l4 4`, 1.6, pal.glow);
    s += sparkle(cx + 64, 70, 5, pal.glow) + sparkle(cx - 70, 96, 3.5, '#FFF6D8') + sparkle(cx + 78, 120, 3, '#FFF6D8');
    return s;
  }

  // --- Jeune wyverne (1) / dragon adulte (2) ---
  const A = st === 1
    ? { hy: 84, hr: 31, sy: 138, span: 70, wh: 64, tw: 24, by: 156, bw: 34, bt: 118, leg: 26 }
    : { hy: 54, hr: 29, sy: 116, span: 84, wh: 94, tw: 30, by: 152, bw: 40, bt: 100, leg: 32 };
  if (st === 2) {
    s += aura(cx, 110, 100, pal.accent2);
  }
  s += ground(cx + 14, gy + 2, st === 2 ? 96 : 78);

  // Ailes (derrière tout).
  for (const d of [-1, 1]) s += wing(c, d, cx + d * A.tw * 0.55, A.sy, A.span, A.wh, st === 2);

  // Queue-comète : part de derrière la hanche droite, s'enroule devant à droite.
  if (st === 1) s += cometTail(c, [[cx + 18, gy - 26], [cx + 70, gy - 4], [cx + 96, gy - 30], [cx + 84, gy - 62]], 13, [cx + 84, gy - 70], 9);
  else s += cometTail(c, [[cx + 22, gy - 30], [cx + 96, gy + 4], [cx + 104, gy - 50], [cx + 86, gy - 76]], 16, [cx + 82, gy - 86], 12);

  // Cuisses et pieds.
  for (const d of [-1, 1]) {
    const lx = cx + d * A.bw * 0.62, ly = gy - A.leg;
    s += ink(`M${P(lx - 15, ly - 18)} C${P(lx - 22, ly + 4)} ${P(lx - 12, gy - 6)} ${P(lx - 8, gy - 6)} L${P(lx + 10, gy - 6)} C${P(lx + 16, ly + 2)} ${P(lx + 18, ly - 16)} ${P(lx + 6, ly - 24)} Z`, d < 0 ? pal.body : pal.body, 2.4);
    s += ink(`M${P(lx - 14, gy)} C${P(lx - 16, gy - 10)} ${P(lx + 16, gy - 10)} ${P(lx + 14, gy)} Z`, pal.body, 2.2);
    for (const k of [-9, 0, 9]) s += ink(`M${P(lx + k - 3, gy - 1)} L${P(lx + k + 3, gy - 1)} L${P(lx + k, gy + 4)} Z`, '#FFF6D8', 1.1);
  }

  // Torse.
  const bt = A.bt, bw = A.bw, by = A.by;
  const torso = `M${P(cx - bw * 0.55, bt)} C${P(cx - bw * 1.05, bt + 20)} ${P(cx - bw * 1.15, by + 10)} ${P(cx - bw * 0.7, gy - A.leg + 8)} C${P(cx - bw * 0.3, gy - A.leg + 18)} ${P(cx + bw * 0.3, gy - A.leg + 18)} ${P(cx + bw * 0.7, gy - A.leg + 8)} C${P(cx + bw * 1.15, by + 10)} ${P(cx + bw * 1.05, bt + 20)} ${P(cx + bw * 0.55, bt)} Z`;
  s += ink(torso, pal.body, 2.7);
  s += shadow(`M${P(cx + bw * 0.6, bt + 6)} C${P(cx + bw * 1.1, bt + 24)} ${P(cx + bw * 1.1, by + 10)} ${P(cx + bw * 0.7, gy - A.leg + 8)} C${P(cx + bw * 0.6, by)} ${P(cx + bw * 0.75, bt + 30)} ${P(cx + bw * 0.6, bt + 6)} Z`, pal.shade, 0.65);
  // Plastron à écailles.
  const pt = bt + 6, pb = gy - A.leg + 12;
  s += ink(`M${P(cx - bw * 0.42, pt)} C${P(cx - bw * 0.62, pt + 30)} ${P(cx - bw * 0.4, pb)} ${P(cx, pb)} C${P(cx + bw * 0.4, pb)} ${P(cx + bw * 0.62, pt + 30)} ${P(cx + bw * 0.42, pt)} Z`, pal.belly, 1.8);
  for (let y = pt + 12; y < pb - 4; y += 11) {
    const k = 1 - Math.abs((y - (pt + pb) / 2) / (pb - pt)) * 0.9;
    s += line(`M${P(cx - bw * 0.42 * k, y)} q${f(bw * 0.42 * k)} 5 ${f(bw * 0.84 * k)} 0`, 1.3);
  }
  s += speckles(c, cx - bw * 0.75, by - 10, 6, 18, 4);
  if (st === 2) {
    // Cœur de comète lumineux sur le poitrail.
    const ey = bt + 22;
    s += `<circle cx="${cx}" cy="${ey}" r="13" fill="${pal.glow}" opacity="0.5" filter="url(#glow)"/>`;
    s += line(`M${P(cx + 3, ey + 2)} l16 10 M${P(cx + 4, ey - 2)} l18 4`, 2, pal.glow);
    s += sparkle(cx, ey, 8, pal.glow);
  }

  // Petits bras griffus devant le ventre.
  for (const d of [-1, 1]) {
    const ax = cx + d * bw * 0.62, ay = bt + (by - bt) * 0.55;
    s += ink(`M${P(ax, ay - 8)} C${P(ax + d * 6, ay + 4)} ${P(ax - d * 2, ay + 14)} ${P(ax - d * 10, ay + 16)} L${P(ax - d * 12, ay + 10)} C${P(ax - d * 6, ay + 8)} ${P(ax - d * 4, ay)} ${P(ax - d * 6, ay - 6)} Z`, pal.body, 2);
    s += line(`M${P(ax - d * 12, ay + 12)} l${f(-d * 4)} 2 M${P(ax - d * 11, ay + 15)} l${f(-d * 3)} 4`, 1.4);
  }

  // Cou (adulte) avec piquants dorsaux.
  if (st === 2) {
    const nt = A.hy + A.hr * 0.6;
    s += ink(`M${P(cx - 17, bt + 8)} C${P(cx - 20, bt - 14)} ${P(cx - 15, nt + 10)} ${P(cx - 12, nt)} L${P(cx + 12, nt)} C${P(cx + 15, nt + 10)} ${P(cx + 20, bt - 14)} ${P(cx + 17, bt + 8)} Z`, pal.body, 2.5);
    s += ink(`M${P(cx - 8, bt + 6)} L${P(cx - 7, nt + 4)} L${P(cx + 7, nt + 4)} L${P(cx + 8, bt + 6)} Z`, pal.belly, 1.5);
    for (let y = nt + 12; y < bt + 2; y += 8) s += line(`M${P(cx - 7, y)} l14 0`, 1.1);
  }

  s += head(c, cx, A.hy, A.hr, st);

  if (st === 2) {
    for (let i = 0; i < 6; i++) s += sparkle(14 + c.r() * 194, 14 + c.r() * 60, 2 + c.r() * 3, i % 2 ? pal.glow : '#FFF6D8');
  }
  return s;
};
