import { aura, eye, ground, ink, line, shadow, shine, sparkle, speckles, type Species } from './style.ts';

/**
 * Médusel → Filastra → Coronéa : méduse stellaire flottante. Petite bulle aux tentacules bouclés, puis cloche à
 * filaments d'étoiles, enfin grande cloche ornée de croissants, bras-rubans et tentacules de lumière.
 */

const f = (v: number) => v.toFixed(1);

/** Cloche : dôme + bord festonné (lobes vers le bas). */
function bell(cx: number, top: number, rim: number, w: number, lobes: number, depth: number, sq = 0.12, pinch = 1): string {
  const h = rim - top, wr = w * pinch, bulge = pinch < 1 ? 1.12 : 1;
  let d = `M${f(cx - wr)} ${f(rim)} C${f(cx - w * bulge)} ${f(top + h * sq)} ${f(cx - w * 0.56)} ${f(top)} ${f(cx)} ${f(top)} C${f(cx + w * 0.56)} ${f(top)} ${f(cx + w * bulge)} ${f(top + h * sq)} ${f(cx + wr)} ${f(rim)}`;
  for (let i = 1; i <= lobes; i++) {
    const x0 = cx + wr - ((i - 1) / lobes) * 2 * wr, x1 = cx + wr - (i / lobes) * 2 * wr;
    d += ` Q${f((x0 + x1) / 2)} ${f(rim + depth * 2)} ${f(x1)} ${f(rim)}`;
  }
  return d + ' Z';
}

/** Tube encré (tentacule épais) : contour d'encre puis couleur. */
const tube = (d: string, color: string, w: number) => line(d, w + 3, '#1A1230') + line(d, w, color);

/** Ligne ondulée verticale qui s'écarte (dx) en descendant. */
function wave(x0: number, y0: number, len: number, amp: number, n: number, dx: number, ph = 1): string {
  const step = len / (2 * n);
  let d = `M${f(x0)} ${f(y0)}`;
  for (let i = 0; i < 2 * n; i++) {
    const t0 = (i + 0.5) / (2 * n), t1 = (i + 1) / (2 * n);
    const sg = (i % 2 ? -1 : 1) * ph;
    d += ` Q${f(x0 + dx * t0 + sg * amp * (0.5 + t0 * 0.6))} ${f(y0 + step * (i + 0.5))} ${f(x0 + dx * t1)} ${f(y0 + step * (i + 1))}`;
  }
  return d;
}

/** Bras-ruban plissé (forme pleine), le long d'une sinusoïde. */
function ribbon(x0: number, y0: number, len: number, amp: number, w: number, dx: number, ph: number): string {
  const N = 26, L: string[] = [], R: string[] = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const x = x0 + dx * t + Math.sin(t * Math.PI * 2.4 + ph) * amp * t;
    const y = y0 + len * t;
    const ww = w * (1 - t * 0.75) * (1 + 0.32 * Math.sin(t * 34 + ph));
    L.push(`${f(x - ww)} ${f(y)}`); R.push(`${f(x + ww)} ${f(y)}`);
  }
  return `M${L.join(' L')} L${R.reverse().join(' L')} Z`;
}

const crescent = (x: number, y: number, r: number, fill: string, w = 1.2) =>
  ink(`M${f(x - r * 0.8)} ${f(y - r * 0.1)} a${f(r)} ${f(r)} 0 1 0 ${f(r * 1.6)} 0 a${f(r * 0.82)} ${f(r * 0.82)} 0 1 1 ${f(-r * 1.6)} 0 Z`, fill, w);

export const medusel: Species = (c) => {
  const { pal } = c;
  const stage = Math.min(2, c.stage);
  const cx = 111;
  let s = '';
  // Géométrie par stade : sommet, bord, demi-largeur.
  const top = [50, 34, 32][stage], rim = [146, 118, 130][stage], W = [72, 78, 88][stage];
  const sq = [0.5, 0.2, 0.14][stage], pinch = [0.8, 0.94, 1][stage];
  const lobes = [6, 8, 10][stage];
  if (stage >= 2) s += aura(cx, 90, 96, pal.glow);
  s += ground(cx, 214, [52, 60, 70][stage]);

  // Tentacules et bras derrière la cloche.
  if (stage === 0) {
    for (let i = 0; i < 5; i++) {
      const x = cx - 44 + i * 22, sg = i % 2 ? -1 : 1;
      const len = 44 + (i === 2 ? 10 : 0) - Math.abs(i - 2) * 4;
      const ex = x + (i - 2) * 6, ey = rim + len;
      s += tube(`M${f(x)} ${rim - 4} Q${f(x + sg * 12)} ${f(rim + len * 0.45)} ${f(ex)} ${f(ey - 6)} q${f(sg * -6)} 10 ${f(sg * -12)} 2 q${f(sg * 2)} -8 ${f(sg * 6)} -4`, i % 2 ? pal.accent : pal.light, 6);
    }
  } else {
    // Filaments d'étoiles / tentacules de lumière.
    const nT = stage === 1 ? 6 : 8;
    for (let i = 0; i < nT; i++) {
      const t = i / (nT - 1);
      const x = cx - W * 0.82 + t * W * 1.64;
      const len = stage === 1 ? 70 + Math.sin(t * Math.PI) * 18 : 84 + Math.sin(t * Math.PI) * 18;
      const d = wave(x, rim + 2, len, stage === 1 ? 7 : 9, stage === 1 ? 3 : 4, (t - 0.5) * 30, i % 2 ? 1 : -1);
      if (stage === 1) s += line(d, 3.6) + line(d, 1.8, pal.light);
      else s += `<g filter="url(#glow)">${line(d, 4.2, pal.accent2, ' opacity="0.9"') + line(d, 1.6, '#FFF6D8')}</g>`;
      // Étoiles le long du filament.
      const ex = x + (t - 0.5) * 30;
      const ns = stage === 1 ? 2 : 3;
      for (let k = 1; k <= ns; k++) {
        const u = k / (ns + 0.4);
        s += sparkle(x + (ex - x) * u + (c.r() - 0.5) * 4, rim + 2 + len * u, k === ns ? 4.5 : 3, k === ns ? pal.glow : '#FFF6D8');
      }
    }
    // Bras-rubans plissés au centre.
    const nA = stage === 1 ? 2 : 4;
    for (let i = 0; i < nA; i++) {
      const t = i / (nA - 1);
      const x = cx - (stage === 1 ? 12 : 30) + t * (stage === 1 ? 24 : 60);
      const len = stage === 1 ? 74 : 104 - Math.abs(t - 0.5) * 30;
      const d = ribbon(x, rim - 4, len, stage === 1 ? 8 : 12, stage === 1 ? 8 : 9, (t - 0.5) * 24, i * 1.7);
      s += ink(d, i % 2 ? pal.accent : pal.belly, 2);
      s += line(wave(x, rim, len * 0.8, 3, 3, (t - 0.5) * 18), 1, '#1A1230', ' opacity="0.5"');
    }
  }

  // Voile festonné sous la cloche (adulte).
  if (stage >= 2) {
    let v = `M${f(cx - W * 1.02)} ${f(rim - 8)}`;
    const nv = 9;
    for (let i = 0; i < nv; i++) {
      const x0 = cx - W * 1.02 + (i / nv) * W * 2.04, x1 = cx - W * 1.02 + ((i + 1) / nv) * W * 2.04;
      v += ` Q${f((x0 + x1) / 2)} ${f(rim + 30)} ${f(x1)} ${f(rim - 8)}`;
    }
    s += ink(v + ' Z', pal.accent2, 2);
    for (let i = 0; i < nv; i++) {
      const x = cx - W * 1.02 + ((i + 0.5) / nv) * W * 2.04;
      s += `<circle cx="${f(x)}" cy="${f(rim + 14)}" r="2.4" fill="#FFF6D8" stroke="#1A1230" stroke-width="1"/>`;
    }
  }
  // Cloche.
  const b = bell(cx, top, rim, W, lobes, [5, 6, 7][stage], sq, pinch);
  s += ink(b, pal.body, 2.8);
  // Voile intérieur translucide.
  const inner = bell(cx, top + (rim - top) * 0.22, rim - 2, W * 0.74 * pinch, lobes - 2, 3, 0.2);
  s += `<path d="${inner}" fill="${pal.light}" opacity="0.55"/>`;
  s += shadow(`M${f(cx + W * 0.45)} ${f(top + 10)} C${f(cx + W * 1.02)} ${f(top + 20)} ${f(cx + W)} ${f(rim - 20)} ${f(cx + W - 2)} ${f(rim)} L${f(cx + W * 0.7)} ${f(rim + 2)} C${f(cx + W * 0.8)} ${f(rim - 30)} ${f(cx + W * 0.78)} ${f(top + 30)} ${f(cx + W * 0.45)} ${f(top + 10)} Z`, pal.shade, 0.6);
  // Bordure festonnée claire.
  const Wr = W * pinch;
  s += ink(bell(cx, rim - 14, rim, Wr * 0.99, lobes, [5, 6, 7][stage], 0.6).replace(/^M[^C]*C[^C]*C[^Q]*/, `M${f(cx - Wr)} ${f(rim)} C${f(cx - Wr * 0.6)} ${f(rim - 12)} ${f(cx + Wr * 0.6)} ${f(rim - 12)} ${f(cx + Wr)} ${f(rim)}`), pal.light, 2);
  s += speckles(c, cx, top + (rim - top) * 0.4, W * 0.65, (rim - top) * 0.3, 8 + stage * 6);

  // Reflets de bulle.
  s += shine(`M${f(cx - W * 0.72)} ${f(top + (rim - top) * 0.45)} C${f(cx - W * 0.72)} ${f(top + 24)} ${f(cx - W * 0.4)} ${f(top + 8)} ${f(cx - W * 0.12)} ${f(top + 6)}`, 3);
  s += `<circle cx="${f(cx - W * 0.5)}" cy="${f(top + (rim - top) * 0.32)}" r="3.2" fill="#fff" opacity="0.9"/>`;

  if (stage === 0) {
    const ey = 110;
    s += eye(cx - 24, ey, 14, pal.eye, 0.15) + eye(cx + 24, ey, 14, pal.eye, 0.15);
    s += line(`M${cx - 6} ${ey + 20} q6 7 12 0`, 2);
    s += `<ellipse cx="${cx - 44}" cy="${ey + 18}" rx="7" ry="4" fill="${pal.accent}" opacity="0.65"/><ellipse cx="${cx + 44}" cy="${ey + 18}" rx="7" ry="4" fill="${pal.accent}" opacity="0.65"/>`;
    s += sparkle(cx, top + 16, 7, pal.glow);
    // Petites bulles autour.
    for (const [x, y, r] of [[30, 70, 6], [190, 96, 5], [184, 60, 3.5], [40, 168, 4]] as const) {
      s += `<circle cx="${x}" cy="${y}" r="${r}" fill="${pal.light}" fill-opacity="0.35" stroke="#1A1230" stroke-width="1.4"/><circle cx="${x - r * 0.35}" cy="${y - r * 0.35}" r="${f(r * 0.28)}" fill="#fff"/>`;
    }
    return s;
  }

  if (stage === 1) {
    const ey = 86;
    s += eye(cx - 22, ey, 11, pal.eye, 0.1) + eye(cx + 22, ey, 11, pal.eye, 0.1);
    s += line(`M${cx - 5} ${ey + 18} q5 5 10 0`, 1.8);
    s += `<ellipse cx="${cx - 40}" cy="${ey + 15}" rx="6" ry="3.5" fill="${pal.accent}" opacity="0.6"/><ellipse cx="${cx + 40}" cy="${ey + 15}" rx="6" ry="3.5" fill="${pal.accent}" opacity="0.6"/>`;
    // Crête d'étoile au sommet.
    s += sparkle(cx, top + 16, 7, pal.glow) + sparkle(cx - 16, top + 24, 4, '#FFF6D8') + sparkle(cx + 15, top + 26, 3.5, '#FFF6D8');
    s += line(`M${cx - W * 0.55} ${top + 40} q${f(W * 0.55)} -14 ${f(W * 1.1)} 0`, 1.4, '#1A1230', ' opacity="0.45"');
    return s;
  }

  // Stade 2 : cloche ornée.
  const by = top + (rim - top) * 0.42;
  s += ink(`M${f(cx - W * 0.93)} ${f(by - 6)} C${f(cx - W * 0.5)} ${f(by - 22)} ${f(cx + W * 0.5)} ${f(by - 22)} ${f(cx + W * 0.93)} ${f(by - 6)} L${f(cx + W * 0.96)} ${f(by + 6)} C${f(cx + W * 0.5)} ${f(by - 10)} ${f(cx - W * 0.5)} ${f(by - 10)} ${f(cx - W * 0.96)} ${f(by + 6)} Z`, pal.accent, 1.8);
  for (let i = 0; i < 7; i++) {
    const t = (i + 0.5) / 7, x = cx - W * 0.86 + t * W * 1.72;
    const y = by - 2 - Math.sin(t * Math.PI) * 14;
    s += i === 3 ? crescent(x, y - 1, 6, pal.glow) : `<circle cx="${f(x)}" cy="${f(y)}" r="2.6" fill="#FFF6D8" stroke="#1A1230" stroke-width="1"/>`;
  }
  // Croissants sur le dôme.
  for (const dir of [-1, 1]) s += sparkle(cx + dir * W * 0.5, top + (rim - top) * 0.2, 5, pal.glow);
  // Couronne de trois flèches au sommet.
  for (const [dx, hgt] of [[-16, 16], [0, 26], [16, 16]] as const) {
    s += ink(`M${cx + dx - 6} ${top + 5} Q${cx + dx - 2} ${top - hgt * 0.4} ${cx + dx} ${top - hgt} Q${cx + dx + 2} ${top - hgt * 0.4} ${cx + dx + 6} ${top + 5} Z`, pal.accent, 1.6);
    s += `<circle cx="${cx + dx}" cy="${top - hgt - 2}" r="${dx ? 2.6 : 3.6}" fill="${pal.glow}" stroke="#1A1230" stroke-width="1.1"/>`;
  }
  // Visage serein (paupières mi-closes).
  const ey = 92;
  s += eye(cx - 22, ey, 10, pal.eye, 0) + eye(cx + 22, ey, 10, pal.eye, 0);
  for (const dir of [-1, 1]) {
    const x = cx + dir * 22;
    s += ink(`M${x - 11} ${ey - 1} C${x - 10} ${ey - 14} ${x + 10} ${ey - 14} ${x + 11} ${ey - 1} Q${x} ${ey - 5} ${x - 11} ${ey - 1} Z`, pal.body, 1.8);
    s += line(`M${x + dir * 10} ${ey - 3} l${dir * 5} -4 M${x + dir * 7} ${ey - 7} l${dir * 3} -5`, 1.4);
  }
  s += line(`M${cx - 5} ${ey + 16} q5 4 10 0`, 1.7);
  
  for (let i = 0; i < 5; i++) s += sparkle(16 + c.r() * 190, 130 + c.r() * 90, 2 + c.r() * 2, pal.glow, false);
  return s;
};
