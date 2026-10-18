import { aura, eye, ground, ink, line, shadow, shine, sparkle, speckles, type Species } from './style.ts';

/** Lumikit → Lunaréon → Selenvulpe : renard des comètes, queue de nébuleuse, marque d'étoile au front. */
export const lumikit: Species = (c) => {
  const { pal, stage } = c;
  const k = [0.78, 0.95, 1.12, 1.12, 1.2][stage] ?? 1;
  const cx = 100, gy = 214;
  const hr = [31, 30, 27, 27, 27][stage] * (k > 1 ? 1 : 1);
  const bodyH = [52, 66, 84, 84, 90][stage];
  const hy = gy - bodyH - hr * 0.55;
  const p = (x: number, y: number) => `${(cx + x).toFixed(1)} ${(gy + y).toFixed(1)}`;
  const h = (x: number, y: number) => `${(cx + x).toFixed(1)} ${(hy + y).toFixed(1)}`;
  let s = '';
  if (stage >= 3) s += aura(cx, hy + 20, 85, pal.glow);
  s += ground(cx + 10, gy + 2, 70 * k);

  // Queue de nébuleuse, derrière le corps ; plus longue et enroulée en grandissant.
  const tl = [0.8, 1, 1.25, 1.3, 1.4][stage];
  const tail = `M${p(22 * k, -8)} C${p(70 * tl, -2)} ${p(100 * tl, -48 * tl)} ${p(86 * tl, -98 * tl)} C${p(78 * tl, -128 * tl)} ${p(48 * tl, -126 * tl)} ${p(50 * tl, -100 * tl)} C${p(54 * tl, -78 * tl)} ${p(64 * tl, -46 * tl)} ${p(20 * k, -34 * k)} Z`;
  s += ink(tail, pal.accent, 2.6);
  s += shadow(`M${p(22 * k, -8)} C${p(70 * tl, -2)} ${p(100 * tl, -48 * tl)} ${p(86 * tl, -98 * tl)} C${p(80 * tl, -60 * tl)} ${p(56 * tl, -20)} ${p(22 * k, -8)} Z`, pal.accent2, 0.55);
  s += speckles(c, cx + 70 * tl, gy - 70 * tl, 20 * tl, 34 * tl, 10 + stage * 4);
  s += sparkle(cx + 70 * tl, gy - 110 * tl, 5 + stage, pal.glow);

  // Corps assis.
  const bw = [30, 32, 34, 34, 36][stage];
  const body = `M${p(-bw, 0)} C${p(-bw - 6, -bodyH * 0.55)} ${p(-bw * 0.6, -bodyH)} ${p(0, -bodyH - 2)} C${p(bw * 0.6, -bodyH)} ${p(bw + 6, -bodyH * 0.55)} ${p(bw, 0)} Z`;
  s += ink(body, pal.body);
  s += shadow(`M${p(bw * 0.35, -bodyH * 0.9)} C${p(bw + 4, -bodyH * 0.55)} ${p(bw + 4, -bodyH * 0.2)} ${p(bw, 0)} L${p(bw * 0.45, 0)} C${p(bw * 0.7, -bodyH * 0.3)} ${p(bw * 0.7, -bodyH * 0.6)} ${p(bw * 0.35, -bodyH * 0.9)} Z`, pal.shade, 0.7);
  s += ink(`M${p(-13, 0)} C${p(-17, -bodyH * 0.45)} ${p(-9, -bodyH * 0.85)} ${p(0, -bodyH * 0.88)} C${p(9, -bodyH * 0.85)} ${p(17, -bodyH * 0.45)} ${p(13, 0)} Z`, pal.belly, 1.6);
  if (stage >= 2) {
    // Collerette de fourrure.
    s += ink(`M${p(-22, -bodyH * 0.82)} L${p(-14, -bodyH * 0.62)} L${p(-6, -bodyH * 0.78)} L${p(0, -bodyH * 0.58)} L${p(6, -bodyH * 0.78)} L${p(14, -bodyH * 0.62)} L${p(22, -bodyH * 0.82)} C${p(12, -bodyH * 0.98)} ${p(-12, -bodyH * 0.98)} ${p(-22, -bodyH * 0.82)} Z`, pal.belly, 1.8);
  }
  // Pattes avant.
  for (const x of [-12, 12]) s += ink(`M${p(x - 9, 0)} C${p(x - 9, -12)} ${p(x + 9, -12)} ${p(x + 9, 0)} Z`, pal.light, 2);
  s += line(`M${p(-14, -3)} l0 3 M${p(-10, -3)} l0 3 M${p(10, -3)} l0 3 M${p(14, -3)} l0 3`, 1.3);

  // Oreilles.
  const ear = (dir: number) => {
    const eh = [1.75, 1.7, 1.75, 1.75, 1.8][stage];
    const o = `M${h(dir * hr * 0.25, -hr * 0.7)} C${h(dir * hr * 0.45, -hr * eh)} ${h(dir * hr * 0.95, -hr * (eh + 0.1))} ${h(dir * hr * 1.05, -hr * (eh - 0.05))} C${h(dir * hr * 1.08, -hr * 1.1)} ${h(dir * hr * 1.0, -hr * 0.55)} ${h(dir * hr * 0.85, -hr * 0.3)} Z`;
    const i = `M${h(dir * hr * 0.4, -hr * 0.72)} C${h(dir * hr * 0.55, -hr * (eh - 0.3))} ${h(dir * hr * 0.85, -hr * (eh - 0.2))} ${h(dir * hr * 0.93, -hr * (eh - 0.25))} C${h(dir * hr * 0.95, -hr * 1.05)} ${h(dir * hr * 0.88, -hr * 0.65)} ${h(dir * hr * 0.75, -hr * 0.5)} Z`;
    return ink(o, pal.body) + ink(i, pal.accent, 1.4) + (stage >= 2 ? line(`M${h(dir * hr * 1.0, -hr * (eh - 0.05))} l${dir * 5} -7 M${h(dir * hr * 0.98, -hr * (eh - 0.1))} l${dir * 7} -2`, 1.6) : '');
  };
  s += ear(-1) + ear(1);

  // Tête avec joues touffues.
  const head = `M${h(-hr, 0)} C${h(-hr, -hr * 0.95)} ${h(hr, -hr * 0.95)} ${h(hr, 0)} L${h(hr * 1.18, hr * 0.28)} L${h(hr * 0.92, hr * 0.38)} L${h(hr * 1.02, hr * 0.62)} C${h(hr * 0.6, hr * 0.85)} ${h(-hr * 0.6, hr * 0.85)} ${h(-hr * 1.02, hr * 0.62)} L${h(-hr * 0.92, hr * 0.38)} L${h(-hr * 1.18, hr * 0.28)} Z`;
  s += ink(head, pal.body, 2.6);
  s += ink(`M${h(-hr * 0.55, hr * 0.3)} C${h(-hr * 0.5, hr * 0.78)} ${h(hr * 0.5, hr * 0.78)} ${h(hr * 0.55, hr * 0.3)} C${h(hr * 0.3, hr * 0.12)} ${h(-hr * 0.3, hr * 0.12)} ${h(-hr * 0.55, hr * 0.3)} Z`, pal.belly, 1.4);
  s += shine(`M${h(-hr * 0.7, -hr * 0.45)} q8 -10 18 -12`, 2.2);

  // Marque du front : étoile, puis croissant de lune adulte.
  if (stage >= 2) s += ink(`M${h(-7, -hr * 0.62)} a9 9 0 1 0 14 0 a7 7 0 1 1 -14 0 Z`, pal.glow, 1.4);
  else s += sparkle(cx, hy - hr * 0.55, 6.5, pal.glow);

  const er = hr * [0.27, 0.25, 0.22, 0.22, 0.22][stage];
  s += eye(cx - hr * 0.42, hy + hr * 0.08, er, pal.eye, 0.3) + eye(cx + hr * 0.42, hy + hr * 0.08, er, pal.eye, 0.3);
  s += ink(`M${h(-4, hr * 0.38)} L${h(4, hr * 0.38)} L${h(0, hr * 0.46)} Z`, pal.ink, 1.2);
  s += line(`M${h(-6, hr * 0.55)} q3 3 6 0 q3 3 6 0`, 1.5);
  s += `<ellipse cx="${(cx - hr * 0.68).toFixed(1)}" cy="${(hy + hr * 0.42).toFixed(1)}" rx="5" ry="3" fill="#FF8FB1" opacity="0.6"/><ellipse cx="${(cx + hr * 0.68).toFixed(1)}" cy="${(hy + hr * 0.42).toFixed(1)}" rx="5" ry="3" fill="#FF8FB1" opacity="0.6"/>`;
  const z = [1.24, 1.16, 1.04, 1.06, 1.06][stage] ?? 1;
  return `<g transform="translate(${cx} ${gy}) scale(${z}) translate(${-cx} ${-gy})">${s}</g>`;
};
