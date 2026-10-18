import { aura, eye, ground, ink, line, shadow, shine, sparkle, speckles, type DrawCtx, type Species } from './style.ts';

/** Lynxaure → Boréalynx → Aurorion : lynx à crinière d'aurore boréale, oreilles à pinceaux étoilés. */

const f = (v: number) => v.toFixed(1);

/** Courbe lisse (Catmull-Rom → Bézier) passant par les points, sans le M initial. */
function cr(q: [number, number][]): string {
  let d = '';
  for (let i = 0; i < q.length - 1; i++) {
    const a = q[Math.max(0, i - 1)], b = q[i], e = q[i + 1], g = q[Math.min(q.length - 1, i + 2)];
    d += ` C${f(b[0] + (e[0] - a[0]) / 6)} ${f(b[1] + (e[1] - a[1]) / 6)} ${f(e[0] - (g[0] - b[0]) / 6)} ${f(e[1] - (g[1] - b[1]) / 6)} ${f(e[0])} ${f(e[1])}`;
  }
  return d;
}

/** Ruban d'aurore ondulant : une bande épaisse qui suit une courbe, avec des « rideaux » de lumière. */
function ribbon(pts: [number, number][], width: number[], fill: string, rays: boolean): string {
  // Construit le bord supérieur puis le bord inférieur (décalés perpendiculairement).
  const top: [number, number][] = [], bot: [number, number][] = [];
  for (let i = 0; i < pts.length; i++) {
    const [x, y] = pts[i];
    const [ax, ay] = pts[Math.max(0, i - 1)], [bx, by] = pts[Math.min(pts.length - 1, i + 1)];
    let nx = -(by - ay), ny = bx - ax;
    const l = Math.hypot(nx, ny) || 1;
    nx /= l; ny /= l;
    const w = width[i] ?? width[width.length - 1];
    top.push([x + nx * w, y + ny * w]);
    bot.push([x - nx * w, y - ny * w]);
  }
  const d = `M${f(top[0][0])} ${f(top[0][1])}${cr(top)} L${f(bot[bot.length - 1][0])} ${f(bot[bot.length - 1][1])}${cr(bot.slice().reverse())} Z`;
  let s = ink(d, fill, 2);
  if (rays) {
    for (let i = 1; i < pts.length - 1; i++) {
      const [x, y] = pts[i];
      s += line(`M${f(x)} ${f(y - width[i] * 0.6)} L${f(x)} ${f(y + width[i] * 0.6)}`, 1.4, '#FFF6D8', ' opacity="0.55"');
    }
  }
  return s;
}

/** Tête de lynx de face : oreilles à pinceaux étoilés, collerette de joues en pointes. */
function head(c: DrawCtx, x: number, y: number, r: number): string {
  const { pal, stage } = c;
  const P = (a: number, b: number) => `${f(x + a * r)} ${f(y + b * r)}`;
  let s = '';
  // Oreilles.
  const eh = [1.45, 1.6, 1.7][stage] ?? 1.7;
  for (const d of [-1, 1]) {
    const tip: [number, number] = [x + d * r * 0.78, y - r * eh];
    s += ink(`M${P(d * 0.3, -0.72)} C${P(d * 0.45, -eh * 0.85)} ${f(tip[0] - d * 4)} ${f(tip[1] + 2)} ${f(tip[0])} ${f(tip[1])} C${P(d * 0.98, -eh * 0.7)} ${P(d * 1.02, -0.6)} ${P(d * 0.95, -0.3)} Z`, pal.body, 2.4);
    s += ink(`M${P(d * 0.45, -0.72)} C${P(d * 0.55, -eh * 0.75)} ${f(tip[0] - d * 5)} ${f(tip[1] + 9)} ${f(tip[0] - d * 1)} ${f(tip[1] + 7)} C${P(d * 0.85, -eh * 0.6)} ${P(d * 0.85, -0.6)} ${P(d * 0.78, -0.45)} Z`, pal.accent, 1.4);
    // Pinceau étoilé au bout de l'oreille.
    const tl = [8, 12, 16][stage] ?? 16;
    s += line(`M${f(tip[0])} ${f(tip[1])} q${f(d * 2)} ${f(-tl * 0.6)} ${f(d * -1)} ${f(-tl)}`, 2.2);
    s += line(`M${f(tip[0])} ${f(tip[1])} q${f(d * 5)} ${f(-tl * 0.4)} ${f(d * 5)} ${f(-tl * 0.8)}`, 1.6);
    s += sparkle(tip[0] - d * 1, tip[1] - tl - 3, [4, 5, 6.5][stage] ?? 6.5, pal.glow);
  }
  // Visage avec collerette de joues (pointes de lynx).
  const ruff = stage === 0 ? 1.12 : stage === 1 ? 1.25 : 1.32;
  const face = `M${P(-0.98, 0)} C${P(-1, -1.02)} ${P(1, -1.02)} ${P(0.98, 0)} L${P(ruff, 0.42)} L${P(0.9, 0.48)} L${P(ruff - 0.08, 0.78)} L${P(0.7, 0.75)} L${P(0.62, 0.98)} C${P(0.3, 0.9)} ${P(-0.3, 0.9)} ${P(-0.62, 0.98)} L${P(-0.7, 0.75)} L${P(-ruff + 0.08, 0.78)} L${P(-0.9, 0.48)} L${P(-ruff, 0.42)} Z`;
  s += ink(face, pal.body, 2.6);
  s += shadow(`M${P(0.55, -0.7)} C${P(1, -0.5)} ${P(1, 0)} ${P(0.98, 0)} L${P(ruff, 0.42)} L${P(0.9, 0.48)} L${P(ruff - 0.08, 0.78)} L${P(0.7, 0.75)} C${P(0.85, 0.3)} ${P(0.85, -0.3)} ${P(0.55, -0.7)} Z`, pal.shade, 0.6);
  // Joues claires.
  for (const d of [-1, 1]) s += ink(`M${P(d * 0.2, 0.25)} C${P(d * 0.6, 0.1)} ${P(d * 0.95, 0.35)} ${P(d * 1.0, 0.5)} L${P(d * 0.72, 0.56)} L${P(d * 0.6, 0.82)} C${P(d * 0.35, 0.8)} ${P(d * 0.15, 0.6)} ${P(d * 0.2, 0.25)} Z`, pal.belly, 1.4);
  // Rayures du front.
  s += line(`M${P(-0.12, -0.85)} l0 ${f(r * 0.28)} M${P(0.12, -0.85)} l0 ${f(r * 0.28)} M${P(-0.38, -0.78)} q2 ${f(r * 0.12)} 1 ${f(r * 0.22)} M${P(0.38, -0.78)} q-2 ${f(r * 0.12)} -1 ${f(r * 0.22)}`, 1.6);
  s += shine(`M${P(-0.75, -0.42)} q6 -10 16 -13`, 2.2);
  // Yeux en amande (plus grands bébé).
  const er = r * ([0.27, 0.23, 0.2][stage] ?? 0.2);
  const ex = r * 0.42, ey = y - r * 0.05;
  s += eye(x - ex, ey, er, pal.eye, 0.2) + eye(x + ex, ey, er, pal.eye, 0.2);
  if (stage >= 1) {
    // Paupière supérieure + trait de khôl de lynx.
    for (const d of [-1, 1]) s += line(`M${f(x + d * ex - d * er * 1.1)} ${f(ey - er * 0.5)} Q${f(x + d * ex)} ${f(ey - er * 1.5)} ${f(x + d * ex + d * er * 1.2)} ${f(ey - er * 0.7)} l${f(d * er * 0.6)} ${f(-er * 0.1)}`, 2.4);
  }
  // Nez, bouche, moustaches.
  s += ink(`M${P(-0.12, 0.32)} L${P(0.12, 0.32)} L${P(0, 0.44)} Z`, '#FF8FB1', 1.3);
  s += line(`M${P(0, 0.44)} l0 3 M${P(-0.18, 0.55)} q${f(r * 0.09)} ${f(r * 0.08)} ${f(r * 0.18)} -1 q${f(r * 0.09)} ${f(r * 0.09)} ${f(r * 0.18)} 1`, 1.5);
  for (const d of [-1, 1]) s += line(`M${P(d * 0.42, 0.48)} l${f(d * r * 0.55)} -3 M${P(d * 0.42, 0.56)} l${f(d * r * 0.5)} 4`, 1.1, '#FFF6D8', ' opacity="0.8"');
  if (stage === 0) s += `<ellipse cx="${f(x - r * 0.66)}" cy="${f(y + r * 0.36)}" rx="5" ry="3" fill="#FF8FB1" opacity="0.6"/><ellipse cx="${f(x + r * 0.66)}" cy="${f(y + r * 0.36)}" rx="5" ry="3" fill="#FF8FB1" opacity="0.6"/>`;
  return s;
}

/** Crinière d'aurore : rubans superposés couleur accent / accent2 / glow. */
function mane(c: DrawCtx, x0: number, y0: number, scale: number, n: number, dir = 1): string {
  const { pal } = c;
  const cols = [pal.accent2, pal.accent, pal.glow];
  let s = '';
  for (let i = 0; i < n; i++) {
    const off = i * 16 * scale;
    const pts: [number, number][] = [];
    for (let j = 0; j <= 6; j++) {
      const t = j / 6;
      pts.push([x0 + dir * t * 120 * scale, y0 - off - t * 70 * scale + Math.sin(t * Math.PI * 2.2 + i) * 9 * scale]);
    }
    const w = [5, 9, 11, 10, 8, 5, 2].map((v) => v * scale);
    s += ribbon(pts, w, cols[i % 3], true);
  }
  return s;
}

export const lynxaure: Species = (c) => {
  const { pal, stage } = c;
  let s = '';
  if (stage <= 1) {
    // ---- Chaton / jeune lynx assis ----
    const cx = 108, gy = 206;
    const k = stage === 0 ? 1 : 1.16;
    const bw = 30 * k, bh = stage === 0 ? 50 : 72;
    const hr = stage === 0 ? 40 : 38;
    const hy = gy - bh - hr * 0.45;
    const p = (a: number, b: number) => `${f(cx + a)} ${f(gy + b)}`;
    s += ground(cx + 8, gy + 2, 66 * k);
    // Petite queue courte à bout d'aurore.
    const tx = cx + bw * 0.8;
    s += ink(`M${p(bw * 0.6, -6)} C${p(bw + 20, -6)} ${p(bw + 34, -22)} ${p(bw + 30, -40 * k)} C${p(bw + 22, -46 * k)} ${p(bw + 14, -34)} ${p(bw * 0.7, -24)} Z`, pal.body, 2.4);
    s += ink(`M${p(bw + 18, -24 * k)} C${p(bw + 28, -26 * k)} ${p(bw + 34, -32 * k)} ${p(bw + 30, -40 * k)} C${p(bw + 24, -46 * k)} ${p(bw + 18, -40 * k)} ${p(bw + 16, -32 * k)} Z`, pal.accent, 1.8);
    s += sparkle(tx + 32, gy - 52 * k, 4, pal.glow);
    if (stage === 1) {
      // Jeune crinière : deux rubans d'aurore qui flottent derrière les épaules.
      s += mane(c, cx + 6, hy + hr * 1.0, 0.72, 3);
    }
    // Corps.
    const body = `M${p(-bw, 0)} C${p(-bw - 8, -bh * 0.6)} ${p(-bw * 0.6, -bh)} ${p(0, -bh - 2)} C${p(bw * 0.6, -bh)} ${p(bw + 8, -bh * 0.6)} ${p(bw, 0)} Z`;
    s += ink(body, pal.body);
    s += shadow(`M${p(bw * 0.3, -bh * 0.92)} C${p(bw + 6, -bh * 0.6)} ${p(bw + 6, -bh * 0.2)} ${p(bw, 0)} L${p(bw * 0.4, 0)} C${p(bw * 0.7, -bh * 0.3)} ${p(bw * 0.7, -bh * 0.6)} ${p(bw * 0.3, -bh * 0.92)} Z`, pal.shade, 0.7);
    s += ink(`M${p(-14 * k, 0)} C${p(-18 * k, -bh * 0.5)} ${p(-10, -bh * 0.88)} ${p(0, -bh * 0.9)} C${p(10, -bh * 0.88)} ${p(18 * k, -bh * 0.5)} ${p(14 * k, 0)} Z`, pal.belly, 1.6);
    // Taches de lynx en constellation.
    for (const [a, b] of [[-0.7, -0.35], [-0.78, -0.6], [0.7, -0.45], [0.62, -0.7], [-0.6, -0.15]] as [number, number][]) {
      s += `<ellipse cx="${f(cx + a * bw)}" cy="${f(gy + b * bh)}" rx="2.6" ry="2" fill="${pal.shade}" stroke="#1A1230" stroke-width="0.8"/>`;
    }
    // Pattes avant (grosses pattes de chaton).
    const pw = stage === 0 ? 11 : 10;
    for (const x of [-13 * k, 13 * k]) s += ink(`M${p(x - pw, 0)} C${p(x - pw, -14)} ${p(x + pw, -14)} ${p(x + pw, 0)} Z`, pal.light, 2);
    s += line(`M${p(-13 * k - 3, -3)} l0 3 M${p(-13 * k + 3, -3)} l0 3 M${p(13 * k - 3, -3)} l0 3 M${p(13 * k + 3, -3)} l0 3`, 1.3);
    if (stage === 1) {
      // Collier de fourrure.
      s += ink(`M${p(-26, -bh * 0.86)} L${p(-17, -bh * 0.66)} L${p(-8, -bh * 0.8)} L${p(0, -bh * 0.6)} L${p(8, -bh * 0.8)} L${p(17, -bh * 0.66)} L${p(26, -bh * 0.86)} C${p(14, -bh * 1.02)} ${p(-14, -bh * 1.02)} ${p(-26, -bh * 0.86)} Z`, pal.belly, 1.8);
    }
    s += head(c, cx, hy, hr);
    s += speckles(c, cx, gy - bh * 0.5, bw * 0.6, bh * 0.3, 4 + stage * 3);
    return s;
  }

  // ---- Stade 2+ : grand félin debout, crinière-aurore ondulante ----
  const gy = 206;
  if (stage >= 3) s += aura(100, 100, 95, pal.glow);
  s += ground(118, gy + 2, 92);
  // Crinière d'aurore : grands rubans derrière tout, du cou vers le ciel.
  const cols = [pal.accent2, pal.glow, pal.accent, pal.accent2];
  for (let i = 0; i < 4; i++) {
    const pts: [number, number][] = [];
    for (let j = 0; j <= 7; j++) {
      const t = j / 7;
      pts.push([84 + t * (128 - i * 10), 112 - i * 12 - t * (64 - i * 6) + Math.sin(t * Math.PI * 2.4 + i * 0.9) * 9]);
    }
    s += ribbon(pts, [8, 12, 14, 14, 12, 9, 5, 1.5], cols[i], true);
  }
  // Crinière en flammes d'aurore autour de la tête (pétales ondulés).
  const mx = 68, my = 104;
  for (let ring = 0; ring < 2; ring++) {
    const R = ring === 0 ? 56 : 46;
    let d = '';
    const nP = 11;
    for (let i = 0; i <= nP; i++) {
      const a = Math.PI * (0.62 + (i / nP) * 1.76);
      const x = mx + Math.cos(a) * R, y = my + Math.sin(a) * R * 0.95;
      const am = a - Math.PI * 0.08;
      const cx1 = mx + Math.cos(am) * R * 1.18, cy1 = my + Math.sin(am) * R * 1.12;
      d += i === 0 ? `M${f(mx + Math.cos(a) * R * 0.5)} ${f(my + Math.sin(a) * R * 0.5)} L${f(x)} ${f(y)}` : ` Q${f(cx1)} ${f(cy1)} ${f(x)} ${f(y)}`;
    }
    d += ` L${f(mx)} ${f(my + 20)} Z`;
    s += ink(d, ring === 0 ? pal.accent : pal.glow, 2.2);
    if (ring === 0) {
      for (let i = 0; i < 9; i++) {
        const a = Math.PI * (0.75 + (i / 8) * 1.5);
        s += line(`M${f(mx + Math.cos(a) * 40)} ${f(my + Math.sin(a) * 38)} L${f(mx + Math.cos(a) * 54)} ${f(my + Math.sin(a) * 52)}`, 1.4, '#FFF6D8', ' opacity="0.6"');
      }
    }
  }
  // Queue courte, touffe d'aurore.
  s += ink(`M182 122 C200 118 210 104 206 90 C200 82 192 92 190 104 C186 112 180 114 176 116 Z`, pal.body, 2.4);
  s += ink(`M196 96 C202 92 208 92 206 90 C204 80 194 82 192 92 Z`, pal.accent, 1.6);
  const paw = (x: number, w: number, fill: string) =>
    ink(`M${x - w} 204 C${x - w} 194 ${x + w} 194 ${x + w} 204 Z`, fill, 2) + line(`M${x - w / 3} 200 l0 4 M${x + w / 3} 200 l0 4`, 1.3);
  // Pattes du côté lointain (ombrées).
  s += ink(`M110 150 C116 168 116 186 114 200 L128 201 C130 186 128 166 124 150 Z`, pal.shade, 2.2) + paw(121, 9, pal.shade);
  s += ink(`M144 150 C150 168 150 186 146 200 L160 201 C164 186 164 166 160 150 Z`, pal.shade, 2.2) + paw(153, 9, pal.shade);
  // Torse.
  const body = `M58 112 C72 98 112 100 150 104 C178 106 198 118 194 140 C192 154 182 160 170 160 C150 168 110 170 88 162 C74 158 60 150 56 136 C54 126 54 118 58 112 Z`;
  s += ink(body, pal.body, 2.6);
  s += shadow(`M88 162 C110 170 150 168 170 160 C160 158 140 160 120 160 C104 160 94 158 88 162 Z`, pal.shade, 0.8);
  s += ink(`M84 150 C100 162 128 164 150 158 C130 156 108 156 92 146 Z`, pal.belly, 1.4);
  // Taches-constellations (reliées par un fin trait).
  const spots: [number, number][] = [[104, 118], [120, 128], [136, 116], [150, 128]];
  s += line(`M${spots.map((q) => q.join(' ')).join(' L')}`, 1, '#FFF6D8', ' opacity="0.6"');
  for (const [a, b] of spots) s += sparkle(a, b, 3.2, '#FFF6D8', false);
  s += speckles(c, 124, 136, 30, 14, 7);
  // Cuisse et patte arrière proche (jarret).
  s += ink(`M150 114 C178 108 198 124 192 150 C188 164 178 170 178 182 C178 190 180 196 182 200 L162 201 C164 192 164 182 162 174 C150 162 140 136 150 114 Z`, pal.body, 2.4);
  s += shadow(`M192 150 C188 164 178 170 178 182 C178 190 180 196 182 200 L174 200 C170 188 172 172 182 160 C188 152 190 140 188 132 C194 136 194 144 192 150 Z`, pal.shade, 0.7);
  s += paw(172, 11, pal.light);
  // Patte avant proche (épaule, coude).
  s += ink(`M74 128 C92 132 102 146 100 164 C98 178 98 190 100 199 L80 200 C80 188 80 176 76 166 C70 154 68 140 74 128 Z`, pal.body, 2.4);
  s += shadow(`M100 164 C98 178 98 190 100 199 L92 199 C90 186 92 172 96 160 C98 152 98 146 96 142 C100 148 101 156 100 164 Z`, pal.shade, 0.7);
  s += paw(90, 12, pal.light);
  // Collerette de poitrail en pointes (sous le menton).
  s += ink(`M44 112 L48 138 L56 130 L60 154 L68 138 L74 158 L80 136 L90 146 L92 116 C82 104 54 102 44 112 Z`, pal.belly, 2);
  s += shine(`M120 104 q20 -4 40 2`, 2.2);
  s += head(c, 68, 100, 35);
  s += sparkle(196, 150, 4, pal.glow) + sparkle(204, 26, 4, pal.glow);
  return s;
};
