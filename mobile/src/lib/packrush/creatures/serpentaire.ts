import { aura, eye, ground, ink, line, shadow, shine, sparkle, speckles, type DrawCtx, type Species } from './style.ts';

/** Serpentaire → Nébulisse → Astrocoatl : serpent de poussière d'étoiles, enroulé autour d'une petite étoile. */

const f = (v: number) => v.toFixed(1);
type Pt = [number, number];

/** Échantillonne une courbe Catmull-Rom passant par `q` (avec largeurs interpolées). */
function sample(q: Pt[], w: number[], per = 10): { p: Pt[]; w: number[] } {
  const p: Pt[] = [], ww: number[] = [];
  for (let i = 0; i < q.length - 1; i++) {
    const a = q[Math.max(0, i - 1)], b = q[i], e = q[i + 1], g = q[Math.min(q.length - 1, i + 2)];
    for (let k = 0; k < per; k++) {
      const t = k / per, t2 = t * t, t3 = t2 * t;
      const cr = (i0: number) => 0.5 * ((2 * b[i0]) + (-a[i0] + e[i0]) * t + (2 * a[i0] - 5 * b[i0] + 4 * e[i0] - g[i0]) * t2 + (-a[i0] + 3 * b[i0] - 3 * e[i0] + g[i0]) * t3);
      p.push([cr(0), cr(1)]);
      ww.push(w[i] + (w[i + 1] - w[i]) * t);
    }
  }
  p.push(q[q.length - 1]);
  ww.push(w[w.length - 1]);
  return { p, w: ww };
}

/** Corps tubulaire : bords gauche/droit précalculés pour pouvoir redessiner un tronçon par-dessus sans couture. */
function edges(p: Pt[], w: number[]): { L: Pt[]; R: Pt[]; N: Pt[] } {
  const L: Pt[] = [], R: Pt[] = [], N: Pt[] = [];
  for (let i = 0; i < p.length; i++) {
    const a = p[Math.max(0, i - 1)], b = p[Math.min(p.length - 1, i + 1)];
    let nx = -(b[1] - a[1]), ny = b[0] - a[0];
    const l = Math.hypot(nx, ny) || 1;
    nx /= l; ny /= l;
    N.push([nx, ny]);
    L.push([p[i][0] + nx * w[i], p[i][1] + ny * w[i]]);
    R.push([p[i][0] - nx * w[i], p[i][1] - ny * w[i]]);
  }
  return { L, R, N };
}

const poly = (q: Pt[]) => q.map((v, i) => `${i ? 'L' : 'M'}${f(v[0])} ${f(v[1])}`).join(' ');

/** Dessine le tronçon [i0, i1] du corps : aplat, ventre, ombre, écailles, contours (bouts fermés seulement aux vraies extrémités). */
function segment(c: DrawCtx, p: Pt[], w: number[], i0: number, i1: number, tipCap: boolean): string {
  const { pal } = c;
  const { L, R, N } = edges(p, w);
  const sl = (q: Pt[]) => q.slice(i0, i1 + 1);
  const Ls = sl(L), Rs = sl(R);
  let s = `<path d="${poly(Ls)} ${poly(Rs.slice().reverse()).replace('M', 'L')} Z" fill="${pal.body}"/>`;
  // Ombre hachurée côté R, ventre clair côté L.
  const sh: Pt[] = [], bl: Pt[] = [], bl2: Pt[] = [];
  for (let i = i0; i <= i1; i++) {
    sh.push([p[i][0] - N[i][0] * w[i] * 0.35, p[i][1] - N[i][1] * w[i] * 0.35]);
    bl.push([p[i][0] + N[i][0] * w[i] * 0.4, p[i][1] + N[i][1] * w[i] * 0.4]);
    bl2.push([p[i][0] + N[i][0] * w[i] * 0.92, p[i][1] + N[i][1] * w[i] * 0.92]);
  }
  s += shadow(`${poly(sh)} ${poly(Rs.slice().reverse()).replace('M', 'L')} Z`, pal.shade, 0.7);
  s += `<path d="${poly(bl)} ${poly(bl2.slice().reverse()).replace('M', 'L')} Z" fill="${pal.belly}"/>`;
  // Écailles du ventre (petits traits) + taches d'étoiles sur le dos.
  for (let i = i0 + 2; i <= i1 - 1; i += 4) {
    const x = p[i][0], y = p[i][1], nx = N[i][0], ny = N[i][1];
    s += line(`M${f(x + nx * w[i] * 0.42)} ${f(y + ny * w[i] * 0.42)} L${f(x + nx * w[i] * 0.88)} ${f(y + ny * w[i] * 0.88)}`, 1, pal.shade);
  }
  for (let i = i0 + 6; i <= i1 - 3; i += 13) {
    if (w[i] < 6) continue;
    s += sparkle(p[i][0] - N[i][0] * w[i] * 0.3, p[i][1] - N[i][1] * w[i] * 0.3, Math.min(5, w[i] * 0.32), '#FFF6D8', false);
  }
  s += line(poly(Ls), 2.5) + line(poly(Rs), 2.5);
  if (tipCap) s += line(`M${f(L[i1][0])} ${f(L[i1][1])} L${f(R[i1][0])} ${f(R[i1][1])}`, 2.5);
  return s;
}

/** Bout de queue : poussière d'étoiles qui s'effiloche. */
function dust(c: DrawCtx, x: number, y: number, dx: number, dy: number, n: number): string {
  let s = '';
  for (let i = 1; i <= n; i++) {
    const t = i / n;
    s += `<circle cx="${f(x + dx * t + (c.r() - 0.5) * 8)}" cy="${f(y + dy * t + (c.r() - 0.5) * 8)}" r="${f(2.6 * (1 - t) + 0.8)}" fill="${c.pal.glow}"/>`;
  }
  return s + sparkle(x + dx * 1.15, y + dy * 1.15, 4, c.pal.glow);
}

/** Tête de serpent de face, ronde et mignonne (bébé) ou en losange avec capuche (adulte). */
function head(c: DrawCtx, x: number, y: number, r: number): string {
  const { pal, stage } = c;
  const P = (a: number, b: number) => `${f(x + a * r)} ${f(y + b * r)}`;
  let s = '';
  if (stage >= 2) {
    // Capuche de nébuleuse : collerette en éventail, bouts étoilés.
    const n = 9;
    let d = `M${P(-0.5, 0.6)}`;
    for (let i = 0; i < n; i++) {
      const a0 = Math.PI * (0.88 + (i / n) * 1.24), a1 = Math.PI * (0.88 + ((i + 0.5) / n) * 1.24), a2 = Math.PI * (0.88 + ((i + 1) / n) * 1.24);
      d += ` Q${f(x + Math.cos(a0) * r * 2.1)} ${f(y + Math.sin(a0) * r * 1.4)} ${f(x + Math.cos(a1) * r * 2.4)} ${f(y + Math.sin(a1) * r * 1.6)} Q${f(x + Math.cos(a2) * r * 1.8)} ${f(y + Math.sin(a2) * r * 1.2)} ${f(x + Math.cos(a2) * r * 1.95)} ${f(y + Math.sin(a2) * r * 1.3)}`;
    }
    d += ` L${P(0.5, 0.6)} Z`;
    s += ink(d, pal.accent, 2.2);
    for (let i = 0; i < n; i++) {
      const a1 = Math.PI * (0.88 + ((i + 0.5) / n) * 1.24);
      s += line(`M${f(x + Math.cos(a1) * r * 1.0)} ${f(y + Math.sin(a1) * r * 0.7)} L${f(x + Math.cos(a1) * r * 2.1)} ${f(y + Math.sin(a1) * r * 1.4)}`, 1.4, pal.shade);
      if (i % 2 === 0) s += sparkle(x + Math.cos(a1) * r * 2.5, y + Math.sin(a1) * r * 1.7, 4, '#FFF6D8');
    }
    s += ink(`M${P(-1.3, -0.1)} C${P(-1.2, -0.9)} ${P(1.2, -0.9)} ${P(1.3, -0.1)} C${P(1.2, 0.8)} ${P(-1.2, 0.8)} ${P(-1.3, -0.1)} Z`, pal.accent2, 1.6, ' opacity="0.9"');
    s += speckles(c, x, y - r * 0.6, r * 1.3, r * 0.6, 10);
  }
  // Crâne.
  const sq = stage >= 2 ? 0.9 : 1;
  const hd = `M${P(-1, 0)} C${P(-1.05, -0.95 * sq)} ${P(1.05, -0.95 * sq)} ${P(1, 0)} C${P(0.98, 0.45)} ${P(0.55, 0.85)} ${P(0, 0.9)} C${P(-0.55, 0.85)} ${P(-0.98, 0.45)} ${P(-1, 0)} Z`;
  s += ink(hd, pal.body, 2.6);
  s += shadow(`M${P(0.55, -0.7)} C${P(1.0, -0.4)} ${P(1.05, 0.2)} ${P(0.8, 0.55)} C${P(0.85, 0.1)} ${P(0.8, -0.3)} ${P(0.55, -0.7)} Z`, pal.shade, 0.6);
  // Museau clair.
  s += ink(`M${P(-0.55, 0.35)} C${P(-0.45, 0.85)} ${P(0.45, 0.85)} ${P(0.55, 0.35)} C${P(0.3, 0.22)} ${P(-0.3, 0.22)} ${P(-0.55, 0.35)} Z`, pal.belly, 1.4);
  // Marque frontale : losange étoilé (croissant au stade 2).
  if (stage >= 1) s += ink(`M${P(0, -0.82)} L${P(0.14, -0.6)} L${P(0, -0.38)} L${P(-0.14, -0.6)} Z`, pal.glow, 1.3);
  else s += sparkle(x, y - r * 0.55, r * 0.18, pal.glow);
  if (stage >= 2) {
    // Petites cornes-comètes.
    for (const d of [-1, 1]) s += ink(`M${P(d * 0.45, -0.72)} C${P(d * 0.55, -1.15)} ${P(d * 0.75, -1.35)} ${P(d * 0.95, -1.45)} C${P(d * 0.85, -1.15)} ${P(d * 0.8, -0.9)} ${P(d * 0.72, -0.6)} Z`, pal.glow, 1.6);
  }
  s += shine(`M${P(-0.72, -0.35)} q5 -9 14 -11`, 2.2);
  const er = r * ([0.3, 0.26, 0.22][stage] ?? 0.22);
  s += eye(x - r * 0.45, y - r * 0.05, er, pal.eye, 0.15) + eye(x + r * 0.45, y - r * 0.05, er, pal.eye, 0.15);
  if (stage >= 1) for (const d of [-1, 1]) s += line(`M${P(d * 0.2, -0.32)} Q${P(d * 0.45, -0.5)} ${P(d * 0.78, -0.3)}`, 2.4);
  // Narines + langue fourchue.
  s += `<circle cx="${f(x - r * 0.12)}" cy="${f(y + r * 0.45)}" r="1.4" fill="#1A1230"/><circle cx="${f(x + r * 0.12)}" cy="${f(y + r * 0.45)}" r="1.4" fill="#1A1230"/>`;
  s += line(`M${P(-0.22, 0.66)} Q${P(0, 0.76)} ${P(0.22, 0.66)}`, 1.5);
  if (stage === 0) {
    s += ink(`M${P(-0.04, 0.72)} L${P(-0.06, 1.05)} L${P(-0.16, 1.18)} L${P(0, 1.1)} L${P(0.16, 1.18)} L${P(0.06, 1.05)} L${P(0.04, 0.72)} Z`, '#FF8FB1', 1.2);
    s += `<ellipse cx="${f(x - r * 0.72)}" cy="${f(y + r * 0.35)}" rx="5" ry="3" fill="#FF8FB1" opacity="0.6"/><ellipse cx="${f(x + r * 0.72)}" cy="${f(y + r * 0.35)}" rx="5" ry="3" fill="#FF8FB1" opacity="0.6"/>`;
  }
  return s;
}

/** Étoile au centre de l'enroulement (stade 2). */
function star(c: DrawCtx, x: number, y: number, r: number): string {
  const { pal } = c;
  let d = '';
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i / 10) * Math.PI * 2, rr = i % 2 ? r * 0.5 : r;
    d += `${i ? 'L' : 'M'}${f(x + Math.cos(a) * rr)} ${f(y + Math.sin(a) * rr)} `;
  }
  return `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r * 1.6)}" fill="${pal.glow}" opacity="0.45" filter="url(#soft)"/>`
    + `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r * 1.05)}" fill="${pal.glow}" opacity="0.35"/>`
    + ink(d + 'Z', pal.glow, 2.2)
    + `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r * 0.28)}" fill="#FFF6D8"/>`
    + shine(`M${f(x - r * 0.25)} ${f(y - r * 0.55)} l${f(r * 0.1)} ${f(-r * 0.25)}`, 2);
}

export const serpentaire: Species = (c) => {
  const { pal, stage } = c;
  let s = '';
  if (stage === 0) {
    // ---- Petit serpenteau lové en tortillon, grosse tête ----
    s += ground(111, 204, 72);
    const q: Pt[] = [[178, 176], [168, 196], [130, 204], [82, 200], [52, 186], [58, 166], [92, 160], [132, 160], [146, 146], [130, 130], [112, 124]];
    const { p, w } = sample(q, [3, 7, 12, 15, 16, 16, 16, 16, 15, 14, 13]);
    const k = p.length - 1;
    s += segment(c, p, w, 0, k, false);
    s += sparkle(184, 166, 5, pal.glow);
    s += head(c, 108, 108, 38);
    s += sparkle(40, 140, 3.5, pal.glow) + sparkle(186, 96, 4, pal.accent2);
    return s;
  }
  if (stage === 1) {
    // ---- Serpent ondulant, dressé en S ----
    s += ground(116, 204, 84);
    const q: Pt[] = [[196, 178], [178, 198], [136, 204], [92, 200], [58, 184], [52, 156], [74, 134], [118, 126], [142, 108], [134, 82], [112, 72]];
    const { p, w } = sample(q, [2, 6, 10, 13, 14, 15, 15, 15, 14, 13, 12]);
    s += dust(c, 196, 178, 14, -26, 6);
    s += segment(c, p, w, 0, p.length - 1, false);
    s += speckles(c, 100, 150, 50, 40, 10);
    // Petites ouïes-nageoires de part et d'autre de la tête.
    for (const d of [-1, 1]) s += ink(`M${f(108 + d * 20)} ${f(48)} C${f(108 + d * 30)} ${f(36)} ${f(108 + d * 40)} ${f(30)} ${f(108 + d * 48)} ${f(28)} C${f(108 + d * 44)} ${f(40)} ${f(108 + d * 38)} ${f(54)} ${f(108 + d * 28)} ${f(64)} Z`, pal.accent2, 1.8) + line(`M${f(108 + d * 26)} ${f(50)} L${f(108 + d * 42)} ${f(34)}`, 1.2, pal.shade);
    s += head(c, 108, 60, 30);
    s += sparkle(30, 110, 4, pal.glow) + sparkle(190, 130, 3.5, pal.accent2);
    return s;
  }

  // ---- Stade 2+ : grand serpent enroulé autour d'une petite étoile ----
  const SX = 120, SY = 124;
  if (stage >= 3) s += aura(SX, 110, 100, pal.glow);
  s += ground(111, 206, 92);
  // Spirale : queue au sol à droite → boucle derrière l'étoile → passe devant → cou dressé à gauche.
  const q: Pt[] = [
    [204, 166], [194, 194], [156, 204], [104, 204], [58, 196], [32, 172], [34, 140],
    [56, 112], [96, 100], [140, 104], [168, 124], [170, 154], [146, 176], [108, 178], [78, 164], [66, 138], [70, 110], [74, 84], [72, 62],
  ];
  const ws = [2, 6, 11, 15, 18, 19, 19, 19, 19, 19, 19, 19, 19, 18, 17, 16, 15, 14, 14];
  const { p, w } = sample(q, ws, 10);
  s += dust(c, 204, 166, 10, -34, 7);
  // Tronçon arrière (jusqu'au haut de la boucle, derrière l'étoile).
  const iBack = 11 * 10;
  s += segment(c, p, w, 0, iBack, false);
  s += star(c, SX, SY, 42);
  // Tronçon avant (passe devant l'étoile puis cou).
  s += segment(c, p, w, iBack - 1, p.length - 1, false);
  // Crête dorsale de comète sur le cou.
  for (const [x, y] of [[54, 128], [56, 100], [58, 76]] as Pt[]) s += ink(`M${f(x + 6)} ${f(y + 8)} L${f(x - 8)} ${f(y)} L${f(x + 6)} ${f(y - 6)} Z`, pal.accent, 1.6);
  s += head(c, 76, 52, 28);
  s += sparkle(196, 40, 4.5, pal.glow) + sparkle(160, 70, 3, '#FFF6D8') + sparkle(26, 70, 3.5, pal.accent2);
  return s;
};
