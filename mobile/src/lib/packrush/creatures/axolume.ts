import { aura, eye, ground, ink, line, shadow, shine, sparkle, speckles, type Species } from './style.ts';

const f = (v: number) => v.toFixed(1);

/** Branchie plumeuse : feuille festonnée pointant vers +x (à placer avec un <g transform>). */
function frond(L: number, w: number, fill: string, vein: string): string {
  const bumps = 4;
  let top = `M0 ${f(-w * 0.5)}`;
  for (let i = 1; i <= bumps; i++) {
    const x0 = (L * (i - 1)) / bumps, x1 = (L * i) / bumps;
    const ww = w * (1 - (i / bumps) * 0.55);
    top += ` Q${f((x0 + x1) / 2)} ${f(-ww * 1.9)} ${f(x1)} ${f(-ww * 0.7)}`;
  }
  top += ` Q${f(L + w * 0.9)} 0 ${f(L)} ${f(w * 0.3)}`;
  for (let i = bumps - 1; i >= 0; i--) {
    const x0 = (L * (i + 1)) / bumps, x1 = (L * i) / bumps;
    const ww = w * (1 - (i / bumps) * 0.55);
    top += ` Q${f((x0 + x1) / 2)} ${f(ww * 1.7)} ${f(x1)} ${f(ww * 0.55)}`;
  }
  top += ' Z';
  return ink(top, fill, 2) + line(`M${f(w * 0.2)} 0 Q${f(L * 0.5)} ${f(-w * 0.15)} ${f(L * 0.92)} 0`, 1.3, vein);
}

/** Branchie-cristal : prisme facetté pointant vers +x. */
function crystal(L: number, w: number, fill: string, facet: string, glow: string): string {
  const d = `M0 ${f(-w * 0.6)} L${f(L * 0.72)} ${f(-w)} L${f(L)} 0 L${f(L * 0.72)} ${f(w)} L0 ${f(w * 0.6)} Z`;
  return `<path d="${d}" fill="${glow}" opacity="0.55" filter="url(#glow)"/>`
    + ink(d, fill, 2)
    + `<path d="M0 ${f(-w * 0.6)} L${f(L * 0.72)} ${f(-w)} L${f(L)} 0 L${f(L * 0.1)} ${f(-w * 0.05)} Z" fill="${facet}" opacity="0.9"/>`
    + line(`M${f(L * 0.72)} ${f(-w)} L${f(L * 0.62)} ${f(w * 0.05)} L${f(L * 0.72)} ${f(w)} M${f(L * 0.05)} 0 L${f(L)} 0`, 1.2)
    + shine(`M${f(L * 0.2)} ${f(-w * 0.45)} L${f(L * 0.55)} ${f(-w * 0.7)}`, 1.6);
}

const at = (x: number, y: number, a: number, inner: string) =>
  `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(a)})">${inner}</g>`;

/** Axolume → Branchiluz → Cristaxolo : axolotl cosmique aux branchies de cristal. */
export const axolume: Species = (c) => {
  const { pal, stage } = c;
  const st = Math.min(stage, 3);
  let s = '';
  const P = (x: number, y: number) => `${f(x)} ${f(y)}`;

  if (st === 0) {
    // ---- Têtard rond qui flotte ----
    const cx = 100, cy = 138, R = 58;
    s += ground(cx + 14, 205, 62);
    // Queue-nageoire ondulée derrière.
    const tail = `M${P(cx + 34, cy + 20)} C${P(cx + 70, cy + 34)} ${P(cx + 86, cy - 6)} ${P(cx + 104, cy - 20)} C${P(cx + 116, cy - 30)} ${P(cx + 118, cy + 2)} ${P(cx + 108, cy + 18)} C${P(cx + 96, cy + 40)} ${P(cx + 72, cy + 58)} ${P(cx + 32, cy + 44)} Z`;
    s += ink(tail, pal.accent, 2.4);
    s += shadow(`M${P(cx + 32, cy + 44)} C${P(cx + 72, cy + 58)} ${P(cx + 96, cy + 40)} ${P(cx + 108, cy + 18)} C${P(cx + 90, cy + 32)} ${P(cx + 66, cy + 40)} ${P(cx + 34, cy + 30)} Z`, pal.accent2, 0.55);
    s += line(`M${P(cx + 46, cy + 30)} Q${P(cx + 74, cy + 26)} ${P(cx + 100, cy - 6)}`, 1.3);
    s += speckles(c, cx + 80, cy + 18, 16, 12, 6);
    // Bourgeons de branchies (3 par côté).
    for (const dir of [-1, 1]) {
      [[-32, 0.72], [-8, 0.86], [16, 0.78]].forEach(([a, sc], i) => {
        const bx = cx + dir * R * 0.8, by = cy - 30 + i * 13;
        const ang = dir < 0 ? 180 - a : a;
        s += at(bx, by, ang, ink(`M0 -6 C10 -9 ${f(22 * sc)} -8 ${f(24 * sc)} 0 C${f(22 * sc)} 8 10 9 0 6 Z`, pal.accent, 2));
        s += at(bx, by, ang, `<circle cx="${f(20 * sc)}" cy="0" r="2.6" fill="${pal.glow}"/>`);
      });
    }
    // Corps-tête.
    const body = `M${P(cx - R, cy + 4)} C${P(cx - R, cy - R * 0.95)} ${P(cx + R, cy - R * 0.95)} ${P(cx + R, cy + 4)} C${P(cx + R * 0.98, cy + R * 0.82)} ${P(cx - R * 0.98, cy + R * 0.82)} ${P(cx - R, cy + 4)} Z`;
    s += ink(body, pal.body, 2.6);
    s += shadow(`M${P(cx + R * 0.55, cy - R * 0.55)} C${P(cx + R * 1.05, cy - R * 0.1)} ${P(cx + R * 0.95, cy + R * 0.55)} ${P(cx + R * 0.25, cy + R * 0.66)} C${P(cx + R * 0.7, cy + R * 0.35)} ${P(cx + R * 0.8, cy - R * 0.1)} ${P(cx + R * 0.55, cy - R * 0.55)} Z`, pal.shade, 0.6);
    s += ink(`M${P(cx - 30, cy + 26)} C${P(cx - 24, cy + 50)} ${P(cx + 24, cy + 50)} ${P(cx + 30, cy + 26)} C${P(cx + 14, cy + 18)} ${P(cx - 14, cy + 18)} ${P(cx - 30, cy + 26)} Z`, pal.belly, 1.5);
    s += shine(`M${P(cx - R * 0.72, cy - R * 0.3)} q6 -16 22 -22`, 2.4);
    s += shine(`M${P(cx - R * 0.42, cy - R * 0.62)} l4 -2`, 2.4);
    // Visage.
    s += eye(cx - 24, cy - 6, 13, pal.eye, 0.2) + eye(cx + 24, cy - 6, 13, pal.eye, 0.2);
    s += line(`M${P(cx - 14, cy + 14)} Q${P(cx - 7, cy + 21)} ${P(cx, cy + 15)} Q${P(cx + 7, cy + 21)} ${P(cx + 14, cy + 14)}`, 1.8);
    s += `<ellipse cx="${f(cx - 40)}" cy="${f(cy + 12)}" rx="7" ry="4" fill="#FF8FB1" opacity="0.6"/><ellipse cx="${f(cx + 40)}" cy="${f(cy + 12)}" rx="7" ry="4" fill="#FF8FB1" opacity="0.6"/>`;
    s += sparkle(cx, cy - 40, 6, pal.glow);
    // Petites bulles.
    s += `<circle cx="${f(cx - 70)}" cy="${f(cy - 50)}" r="5" fill="none" stroke="#FFF6D8" stroke-width="1.6" opacity="0.8"/><circle cx="${f(cx - 80)}" cy="${f(cy - 66)}" r="3" fill="none" stroke="#FFF6D8" stroke-width="1.4" opacity="0.7"/>`;
    return s;
  }

  // ---- Stades 1 / 2 / 3 : axolotl couché, tête de face ----
  const big = st >= 2;
  const gy = 204;
  const hx = big ? 94 : 94, hy = big ? 104 : 124;
  const hw = big ? 54 : 50, hh = big ? 46 : 44;

  if (st >= 3) s += aura(hx + 30, hy + 20, 100, pal.glow);
  s += ground(hx + 34, gy + 2, big ? 92 : 78);

  // Queue : nageoire simple (1) ou voile étoilée (2+).
  if (!big) {
    const tail = `M${P(150, 178)} C${P(178, 176)} ${P(196, 156)} ${P(204, 128)} C${P(210, 106)} ${P(196, 88)} ${P(184, 92)} C${P(180, 118)} ${P(168, 138)} ${P(144, 152)} Z`;
    s += ink(tail, pal.accent, 2.4);
    s += line(`M${P(156, 168)} Q${P(184, 156)} ${P(194, 112)}`, 1.4);
    s += shadow(`M${P(150, 178)} C${P(178, 176)} ${P(196, 156)} ${P(204, 128)} C${P(194, 150)} ${P(176, 166)} ${P(150, 170)} Z`, pal.accent2, 0.55);
    s += sparkle(195, 104, 5, pal.glow);
  } else {
    // Voile : grand éventail translucide qui monte derrière le dos.
    const veil = `M${P(150, 186)} Q${P(194, 198)} ${P(204, 162)} Q${P(224, 146)} ${P(214, 118)} Q${P(226, 88)} ${P(206, 66)} Q${P(208, 34)} ${P(180, 24)} Q${P(176, 10)} ${P(164, 12)} C${P(178, 40)} ${P(170, 58)} ${P(156, 66)} C${P(168, 86)} ${P(170, 112)} ${P(150, 124)} C${P(164, 140)} ${P(162, 154)} ${P(146, 160)} Z`;
    s += `<path d="${veil}" fill="${pal.accent2}" opacity="0.35" filter="url(#glow)"/>`;
    s += ink(veil, pal.accent, 2.4, ' fill-opacity="0.85"');
    s += shadow(`M${P(150, 186)} C${P(196, 190)} ${P(222, 150)} ${P(218, 104)} C${P(208, 140)} ${P(184, 166)} ${P(152, 172)} Z`, pal.accent2, 0.5);
    // Rayons de la voile.
    s += line(`M${P(152, 176)} Q${P(196, 160)} ${P(208, 110)} M${P(152, 160)} Q${P(186, 130)} ${P(196, 64)} M${P(152, 140)} Q${P(172, 100)} ${P(176, 40)}`, 1.3, pal.ink, ' opacity="0.7"');
    s += speckles(c, 188, 104, 22, 58, 16 + st * 4);
    s += sparkle(194, 38, 6, pal.glow) + sparkle(208, 128, 4.5, pal.glow) + sparkle(178, 84, 3.5, '#FFF6D8');
  }

  // Corps allongé vers la droite (derrière la tête).
  const body = big
    ? `M${P(56, 196)} C${P(48, 160)} ${P(80, 132)} ${P(118, 132)} C${P(150, 132)} ${P(170, 152)} ${P(164, 184)} C${P(160, 200)} ${P(140, 204)} ${P(110, 204)} C${P(84, 204)} ${P(60, 204)} ${P(56, 196)} Z`
    : `M${P(60, 196)} C${P(54, 168)} ${P(84, 148)} ${P(116, 148)} C${P(146, 148)} ${P(162, 162)} ${P(158, 186)} C${P(154, 200)} ${P(138, 204)} ${P(112, 204)} C${P(86, 204)} ${P(64, 204)} ${P(60, 196)} Z`;
  // Patte arrière.
  s += ink(big ? `M${P(140, 190)} C${P(152, 192)} ${P(162, 200)} ${P(164, 206)} L${P(144, 206)} Z` : `M${P(134, 190)} C${P(146, 192)} ${P(154, 200)} ${P(156, 206)} L${P(138, 206)} Z`, pal.shade, 2);
  s += ink(body, pal.body, 2.6);
  s += shadow(big
    ? `M${P(120, 136)} C${P(150, 136)} ${P(168, 154)} ${P(164, 184)} C${P(160, 200)} ${P(140, 204)} ${P(118, 204)} C${P(146, 190)} ${P(150, 160)} ${P(120, 136)} Z`
    : `M${P(118, 150)} C${P(146, 150)} ${P(160, 164)} ${P(158, 186)} C${P(154, 200)} ${P(138, 204)} ${P(118, 204)} C${P(142, 190)} ${P(146, 166)} ${P(118, 150)} Z`, pal.shade, 0.6);
  // Crête dorsale.
  s += ink(big
    ? `M${P(96, 134)} C${P(116, 118)} ${P(144, 120)} ${P(160, 140)} C${P(146, 134)} ${P(124, 134)} ${P(108, 138)} Z`
    : `M${P(100, 150)} C${P(118, 138)} ${P(138, 140)} ${P(150, 154)} C${P(138, 150)} ${P(120, 150)} ${P(108, 152)} Z`, pal.accent, 1.8);
  s += speckles(c, 128, big ? 168 : 178, 22, 14, 6 + st * 3);
  if (big) {
    // Constellation sur le flanc.
    s += line(`M${P(112, 160)} L${P(126, 170)} L${P(142, 162)} L${P(150, 176)}`, 1.1, '#FFF6D8', ' opacity="0.8"');
    for (const [x, y] of [[112, 160], [126, 170], [142, 162], [150, 176]]) s += sparkle(x, y, 3.2, '#FFF6D8', false);
  }

  // Branchies (derrière la tête) : plumes (1), cristaux (2+).
  for (const dir of [-1, 1]) {
    const angles = [-38, -8, 20];
    angles.forEach((a, i) => {
      const bx = hx + dir * hw * 0.82, by = hy - hh * 0.55 + i * 15;
      const ang = dir < 0 ? 180 - a : a;
      if (!big) s += at(bx, by, ang, frond(30 - i * 3, 7, pal.accent, pal.shade));
      else s += at(bx, by, ang, crystal(34 - i * 4 + (st >= 3 ? 4 : 0), 8, pal.accent2, pal.glow, pal.glow));
    });
  }

  // Tête large et plate.
  const head = `M${P(hx - hw, hy + 2)} C${P(hx - hw * 1.02, hy - hh * 1.15)} ${P(hx + hw * 1.02, hy - hh * 1.15)} ${P(hx + hw, hy + 2)} C${P(hx + hw * 0.96, hy + hh * 0.86)} ${P(hx - hw * 0.96, hy + hh * 0.86)} ${P(hx - hw, hy + 2)} Z`;
  s += ink(head, pal.body, 2.7);
  s += shadow(`M${P(hx + hw * 0.5, hy - hh * 0.72)} C${P(hx + hw * 1.04, hy - hh * 0.3)} ${P(hx + hw * 1.0, hy + hh * 0.5)} ${P(hx + hw * 0.3, hy + hh * 0.66)} C${P(hx + hw * 0.76, hy + hh * 0.3)} ${P(hx + hw * 0.8, hy - hh * 0.2)} ${P(hx + hw * 0.5, hy - hh * 0.72)} Z`, pal.shade, 0.55);
  s += shine(`M${P(hx - hw * 0.72, hy - hh * 0.4)} q8 -16 24 -20`, 2.4);
  // Front : gemme / étoile.
  if (big) {
    s += `<path d="M${P(hx, hy - hh * 0.86)} l7 9 l-7 9 l-7 -9 Z" fill="${pal.glow}" filter="url(#glow)"/>`;
    s += ink(`M${P(hx, hy - hh * 0.86)} l7 9 l-7 9 l-7 -9 Z`, pal.glow, 1.4);
  } else s += sparkle(hx, hy - hh * 0.62, 5.5, pal.glow);

  const er = big ? 10 : 11.5;
  s += eye(hx - hw * 0.5, hy - 4, er, pal.eye, 0.25) + eye(hx + hw * 0.5, hy - 4, er, pal.eye, 0.25);
  // Large sourire d'axolotl.
  s += line(`M${P(hx - hw * 0.55, hy + hh * 0.3)} Q${P(hx, hy + hh * 0.66)} ${P(hx + hw * 0.55, hy + hh * 0.3)}`, 2);
  s += line(`M${P(hx - 3, hy + hh * 0.16)} l0 0.1 M${P(hx + 3, hy + hh * 0.16)} l0 0.1`, 2.4);
  s += `<ellipse cx="${f(hx - hw * 0.72)}" cy="${f(hy + hh * 0.28)}" rx="6" ry="3.5" fill="#FF8FB1" opacity="0.6"/><ellipse cx="${f(hx + hw * 0.72)}" cy="${f(hy + hh * 0.28)}" rx="6" ry="3.5" fill="#FF8FB1" opacity="0.6"/>`;

  // Pattes avant à 4 doigts.
  for (const x of big ? [62, 112] : [68, 114]) {
    s += ink(`M${P(x - 10, gy + 2)} C${P(x - 10, gy - 16)} ${P(x + 10, gy - 16)} ${P(x + 10, gy + 2)} Z`, pal.light, 2);
    s += line(`M${P(x - 5, gy - 3)} l0 4 M${P(x, gy - 3)} l0 4 M${P(x + 5, gy - 3)} l0 4`, 1.3);
  }

  if (st >= 3) {
    // Marques lumineuses et petites lunes de cristal autour.
    s += line(`M${P(hx - hw * 0.35, hy + hh * 0.75)} q${f(hw * 0.35)} 8 ${f(hw * 0.7)} 0`, 1.6, pal.glow);
    s += sparkle(30, 60, 6, pal.glow) + sparkle(24, 150, 4, pal.glow) + sparkle(150, 30, 5, '#FFF6D8');
  }
  return s;
};
