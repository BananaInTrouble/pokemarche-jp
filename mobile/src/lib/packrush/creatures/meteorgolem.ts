import { aura, eye, ground, ink, line, shadow, shine, sparkle, speckles, type DrawCtx, type Species } from './style.ts';

/** Météorin → Cristallos → Astrolithe : golem de météorite et de cristal, cœur d'étoile. */

const f = (v: number) => v.toFixed(1);
type Pt = [number, number];

/** Polygone aux coins arrondis (silhouette de roche). */
function rockPath(q: Pt[], round = 0.5): string {
  const m = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const n = q.length;
  const k = round / 2;
  let d = '';
  for (let i = 0; i < n; i++) {
    const a = q[(i - 1 + n) % n], b = q[i], e = q[(i + 1) % n];
    const p0 = m(b, a, k), p1 = m(b, e, k);
    d += `${i ? 'L' : 'M'}${f(p0[0])} ${f(p0[1])} Q${f(b[0])} ${f(b[1])} ${f(p1[0])} ${f(p1[1])} `;
  }
  return d + 'Z';
}

/** Rocher : aplat + ombre hachurée à droite/en bas + reflet + cratères. */
function rock(c: DrawCtx, q: Pt[], fill: string, craters = 0, w = 2.6): string {
  const xs = q.map((v) => v[0]), ys = q.map((v) => v[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, rx = (x1 - x0) / 2, ry = (y1 - y0) / 2;
  let s = ink(rockPath(q), fill, w);
  // Ombre : la même roche rétrécie et décalée vers bas-droite, intersectée visuellement par un croissant.
  const sh = q.map(([x, y]): Pt => [x, y]).filter(([x, y]) => (x - cx) / rx + (y - cy) / ry > 0.2);
  if (sh.length >= 2) {
    const first = sh[0];
    s += shadow(`M${f(first[0])} ${f(first[1])} ${sh.slice(1).map((v) => `L${f(v[0])} ${f(v[1])}`).join(' ')} Q${f(cx + rx * 0.3)} ${f(cy + ry * 0.3)} ${f(first[0])} ${f(first[1])} Z`, c.pal.shade, 0.55);
  }
  for (let i = 0; i < craters; i++) {
    const x = cx + (c.r() - 0.5) * rx * 1.1, y = cy + (c.r() - 0.5) * ry * 1.1, r = 2.5 + c.r() * 3.5;
    s += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(r)}" ry="${f(r * 0.75)}" fill="${c.pal.shade}" stroke="#1A1230" stroke-width="1.2"/>`;
    s += line(`M${f(x - r * 0.6)} ${f(y - r * 0.3)} q${f(r * 0.6)} ${f(-r * 0.5)} ${f(r * 1.2)} 0`, 1, c.pal.light);
  }
  s += shine(`M${f(cx - rx * 0.62)} ${f(cy - ry * 0.35)} q${f(rx * 0.12)} ${f(-ry * 0.3)} ${f(rx * 0.35)} ${f(-ry * 0.42)}`, 2.2);
  return s;
}

/** Cristal hexagonal pointu, base en (x, y), orienté selon `a` (radians, -π/2 = vers le haut). */
function crystal(x: number, y: number, h: number, w: number, a: number, fill: string, light: string): string {
  const ux = Math.cos(a), uy = Math.sin(a), nx = -uy, ny = ux;
  const P = (t: number, o: number) => `${f(x + ux * h * t + nx * w * o)} ${f(y + uy * h * t + ny * w * o)}`;
  const outer = `M${P(0, -1)} L${P(0.72, -1)} L${P(1, 0)} L${P(0.72, 1)} L${P(0, 1)} Z`;
  const facet = `M${P(0, -0.15)} L${P(0.72, -0.15)} L${P(1, 0)} L${P(0.72, 0.4)} L${P(0, 0.4)} Z`;
  return ink(outer, fill, 2) + `<path d="${facet}" fill="${light}" opacity="0.75"/>`
    + line(`M${P(0.72, -1)} L${P(0.72, 0.4)} M${P(0, -0.15)} L${P(0.72, -0.15)}`, 1.1, '#1A1230', ' opacity="0.6"')
    + shine(`M${P(0.12, -0.6)} L${P(0.55, -0.6)}`, 1.6);
}

/** Grappe de cristaux. */
function cluster(c: DrawCtx, x: number, y: number, s: number, a: number): string {
  const { pal } = c;
  return crystal(x - 6 * s, y + 2 * s, 22 * s, 6 * s, a - 0.45, pal.accent2, '#FFF6D8')
    + crystal(x + 7 * s, y + 2 * s, 24 * s, 6.5 * s, a + 0.4, pal.accent2, '#FFF6D8')
    + crystal(x, y, 38 * s, 8 * s, a, pal.accent, '#FFF6D8');
}

/** Cœur d'étoile : halo, étoile à 8 branches, fissures lumineuses. */
function core(c: DrawCtx, x: number, y: number, r: number, cracks: number): string {
  const { pal } = c;
  let s = `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r * 2.2)}" fill="${pal.glow}" opacity="0.5" filter="url(#soft)"/>`;
  for (let i = 0; i < cracks; i++) {
    // Fissures irrégulières (zigzag alterné, longueurs variées) : pas de motif tournant régulier.
    const a = (i / cracks) * Math.PI * 2 + 0.4 + [0, 0.25, -0.15, 0.1, -0.2, 0.18, -0.05][i % 7];
    const l = r * [2.4, 1.9, 2.8, 2.1, 2.6, 1.8, 2.3][i % 7];
    const b = i % 2 ? 0.16 : -0.14;
    const pts: Pt[] = [[x + Math.cos(a) * r, y + Math.sin(a) * r], [x + Math.cos(a + b) * r * 1.55, y + Math.sin(a + b) * r * 1.55], [x + Math.cos(a - b * 0.5) * l, y + Math.sin(a - b * 0.5) * l]];
    const d = `M${pts.map((v) => `${f(v[0])} ${f(v[1])}`).join(' L')}`;
    s += line(d, 5, '#1A1230') + line(d, 2.6, pal.glow);
  }
  let d = '';
  for (let i = 0; i < 16; i++) {
    const a = -Math.PI / 2 + (i / 16) * Math.PI * 2, rr = i % 2 ? r * 0.45 : r * (i % 4 ? 0.8 : 1.1);
    d += `${i ? 'L' : 'M'}${f(x + Math.cos(a) * rr)} ${f(y + Math.sin(a) * rr)} `;
  }
  s += ink(`M${f(x - r * 1.15)} ${f(y)} a${f(r * 1.15)} ${f(r * 1.15)} 0 1 0 ${f(r * 2.3)} 0 a${f(r * 1.15)} ${f(r * 1.15)} 0 1 0 ${f(-r * 2.3)} 0 Z`, pal.shade, 2.2);
  s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r * 0.95)}" fill="${pal.glow}" opacity="0.55"/>`;
  s += ink(d + 'Z', pal.glow, 1.4);
  s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r * 0.3)}" fill="#FFF6D8"/>`;
  return s;
}

function glowEye(x: number, y: number, r: number, c: DrawCtx): string {
  return `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r * 1.6)}" fill="${c.pal.glow}" opacity="0.4"/>`
    + ink(`M${f(x - r * 1.2)} ${f(y)} Q${f(x)} ${f(y - r * 1.2)} ${f(x + r * 1.2)} ${f(y)} Q${f(x)} ${f(y + r * 0.9)} ${f(x - r * 1.2)} ${f(y)} Z`, c.pal.glow, 1.8)
    + `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r * 0.4)}" fill="#FFF6D8"/>`;
}

export const meteorgolem: Species = (c) => {
  const { pal, stage } = c;
  let s = '';
  if (stage === 0) {
    // ---- Petit caillou animé ----
    const cx = 111, cy = 146;
    s += ground(cx, 204, 62);
    // Pieds.
    for (const d of [-1, 1]) s += rock(c, [[cx + d * 14, 190], [cx + d * 34, 188], [cx + d * 38, 202], [cx + d * 12, 204]], pal.shade, 0, 2.2);
    // Petites pousses de cristal sur le dessus.
    s += crystal(cx + 4, cy - 44, 42, 10, -Math.PI / 2 + 0.15, pal.accent, '#FFF6D8');
    s += crystal(cx - 14, cy - 40, 26, 7, -Math.PI / 2 - 0.5, pal.accent2, '#FFF6D8');
    // Bras-cailloux.
    s += rock(c, [[cx - 54, 148], [cx - 70, 156], [cx - 68, 172], [cx - 52, 170]], pal.body, 0, 2.2);
    s += rock(c, [[cx + 54, 146], [cx + 70, 150], [cx + 72, 166], [cx + 54, 168]], pal.body, 0, 2.2);
    // Corps-caillou.
    s += rock(c, [[cx - 40, cy - 46], [cx + 6, cy - 54], [cx + 46, cy - 40], [cx + 60, cy + 4], [cx + 48, cy + 46], [cx - 4, cy + 52], [cx - 50, cy + 42], [cx - 60, cy - 6]], pal.body, 0, 2.8);
    s += `<ellipse cx="${cx + 38}" cy="${cy - 24}" rx="6" ry="4.5" fill="${pal.shade}" stroke="#1A1230" stroke-width="1.2"/><ellipse cx="${cx - 34}" cy="${cy + 26}" rx="5" ry="3.8" fill="${pal.shade}" stroke="#1A1230" stroke-width="1.2"/><ellipse cx="${cx + 30}" cy="${cy + 32}" rx="3.5" ry="2.6" fill="${pal.shade}" stroke="#1A1230" stroke-width="1"/>`;
    // Petite fissure lumineuse.
    s += line(`M${cx - 6} ${cy + 50} L${cx - 2} ${cy + 38} L${cx + 6} ${cy + 34}`, 3.6) + line(`M${cx - 6} ${cy + 50} L${cx - 2} ${cy + 38} L${cx + 6} ${cy + 34}`, 1.6, pal.glow);
    s += eye(cx - 20, cy - 4, 13, pal.eye, 0.2) + eye(cx + 20, cy - 4, 13, pal.eye, 0.2);
    s += line(`M${cx - 7} ${cy + 18} q7 6 14 0`, 1.8);
    s += `<ellipse cx="${cx - 38}" cy="${cy + 12}" rx="6" ry="3.5" fill="#FF8FB1" opacity="0.6"/><ellipse cx="${cx + 38}" cy="${cy + 12}" rx="6" ry="3.5" fill="#FF8FB1" opacity="0.6"/>`;
    s += sparkle(cx + 20, cy - 66, 4, pal.glow) + sparkle(40, 100, 3.5, pal.glow) + sparkle(186, 120, 3, pal.accent2);
    return s;
  }

  if (stage === 1) {
    // ---- Golem trapu ----
    const cx = 111;
    s += ground(cx, 204, 80);
    // Jambes.
    for (const d of [-1, 1]) s += rock(c, [[cx + d * 12, 170], [cx + d * 44, 168], [cx + d * 48, 204], [cx + d * 8, 205]], pal.shade, 0);
    // Cristaux d'épaule (derrière).
    s += cluster(c, cx + 44, 100, 0.9, -Math.PI / 2 + 0.45);
    s += crystal(cx - 46, 102, 26, 6.5, -Math.PI / 2 - 0.5, pal.accent, '#FFF6D8');
    // Torse.
    s += rock(c, [[cx - 52, 104], [cx - 10, 92], [cx + 44, 98], [cx + 62, 132], [cx + 52, 178], [cx, 186], [cx - 50, 178], [cx - 62, 136]], pal.body, 2);
    s += core(c, cx, 146, 10, 5);
    // Bras.
    for (const d of [-1, 1]) {
      s += rock(c, [[cx + d * 54, 104], [cx + d * 80, 112], [cx + d * 82, 146], [cx + d * 60, 146]], pal.body, 0, 2.4);
      s += rock(c, [[cx + d * 58, 144], [cx + d * 88, 142], [cx + d * 94, 176], [cx + d * 76, 186], [cx + d * 58, 176]], pal.light, 0, 2.4);
      s += line(`M${f(cx + d * 66)} ${172} l${d * 6} 8 M${f(cx + d * 76)} ${170} l${d * 6} 8`, 1.4);
    }
    // Tête enfoncée dans les épaules.
    s += crystal(cx + 6, 66, 24, 6, -Math.PI / 2 + 0.2, pal.accent2, '#FFF6D8');
    s += rock(c, [[cx - 30, 70], [cx + 4, 60], [cx + 32, 70], [cx + 36, 98], [cx + 4, 110], [cx - 34, 100]], pal.body, 0);
    s += line(`M${cx - 26} ${78} L${cx + 28} ${78}`, 2.4, pal.shade);
    s += eye(cx - 13, 90, 9, pal.eye, 0.15) + eye(cx + 13, 90, 9, pal.eye, 0.15);
    s += line(`M${cx - 22} ${80} L${cx - 5} ${84} M${cx + 22} ${80} L${cx + 5} ${84}`, 2.6);
    s += line(`M${cx - 6} ${103} q6 3 12 0`, 1.6);
    s += speckles(c, cx, 130, 40, 30, 6);
    s += sparkle(30, 70, 4, pal.glow) + sparkle(194, 64, 3.5, pal.glow);
    return s;
  }

  // ---- Stade 2+ : grand golem aux cristaux lumineux et cœur d'étoile ----
  const cx = 111;
  if (stage >= 3) s += aura(cx, 120, 100, pal.glow);
  s += ground(cx, 206, 96);
  // Grands cristaux dorsaux (derrière tout).
  s += crystal(cx - 30, 80, 64, 11, -Math.PI / 2 - 0.35, pal.accent, '#FFF6D8');
  s += crystal(cx + 32, 80, 70, 12, -Math.PI / 2 + 0.32, pal.accent, '#FFF6D8');
  s += crystal(cx - 50, 92, 40, 8, -Math.PI / 2 - 0.75, pal.accent2, '#FFF6D8');
  s += crystal(cx + 54, 92, 44, 8, -Math.PI / 2 + 0.75, pal.accent2, '#FFF6D8');
  // Jambes massives.
  for (const d of [-1, 1]) s += rock(c, [[cx + d * 10, 164], [cx + d * 48, 160], [cx + d * 54, 204], [cx + d * 6, 206]], pal.shade, 1);
  // Torse colossal.
  s += rock(c, [[cx - 66, 86], [cx - 20, 72], [cx + 24, 72], [cx + 68, 88], [cx + 74, 130], [cx + 56, 174], [cx, 182], [cx - 56, 174], [cx - 74, 130]], pal.body, 3, 3);
  s += core(c, cx, 126, 15, 7);
  s += speckles(c, cx, 130, 50, 36, 10);
  // Bras : épaules en rochers, avant-bras, poings au sol.
  for (const d of [-1, 1]) {
    s += rock(c, [[cx + d * 66, 112], [cx + d * 92, 116], [cx + d * 96, 160], [cx + d * 72, 158]], pal.shade, 0, 2.4);
    s += rock(c, [[cx + d * 70, 154], [cx + d * 100, 152], [cx + d * 106, 194], [cx + d * 88, 204], [cx + d * 66, 196]], pal.light, 0, 2.6);
    s += line(`M${f(cx + d * 76)} 192 l${d * 4} 10 M${f(cx + d * 88)} 190 l${d * 4} 11`, 1.5);
    // Fissure lumineuse sur l'avant-bras.
    const cr = `M${f(cx + d * 78)} 162 L${f(cx + d * 86)} 172 L${f(cx + d * 82)} 182`;
    s += line(cr, 3.6) + line(cr, 1.6, pal.glow);
    s += rock(c, [[cx + d * 50, 86], [cx + d * 84, 82], [cx + d * 100, 104], [cx + d * 94, 124], [cx + d * 60, 122]], pal.body, 1, 2.6);
    s += cluster(c, cx + d * 84, 92, 0.85, -Math.PI / 2 + d * 0.55);
  }
  // Tête : bloc de roche avec couronne de cristaux.
  s += crystal(cx - 14, 50, 22, 5.5, -Math.PI / 2 - 0.35, pal.accent2, '#FFF6D8');
  s += crystal(cx + 14, 50, 22, 5.5, -Math.PI / 2 + 0.35, pal.accent2, '#FFF6D8');
  s += crystal(cx, 46, 32, 7, -Math.PI / 2, pal.accent, '#FFF6D8');
  s += rock(c, [[cx - 28, 54], [cx, 44], [cx + 28, 54], [cx + 32, 82], [cx, 94], [cx - 32, 82]], pal.body, 0);
  s += shadow(`M${cx - 30} 70 L${cx + 30} 70 L${cx + 31} 76 L${cx - 31} 76 Z`, pal.shade, 0.8);
  s += line(`M${cx - 30} 70 L${cx + 30} 70`, 2.4);
  s += glowEye(cx - 13, 78, 6, c) + glowEye(cx + 13, 78, 6, c);
  s += line(`M${cx - 8} 89 L${cx + 8} 89`, 2);
  s += sparkle(cx, 10, 5, '#FFF6D8') + sparkle(22, 40, 4, pal.glow) + sparkle(200, 50, 4, pal.glow);
  return s;
};
