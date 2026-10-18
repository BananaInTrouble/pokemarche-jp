import { aura, eye, ground, ink, line, shadow, shine, sparkle, speckles, type Species } from './style.ts';

const f = (v: number) => v.toFixed(1);

/** Cétoile → Baleinelle → Nébulène → Abyssiale éveillée : baleine du vide au ventre de nébuleuse. */
export const cetoile: Species = (c) => {
  const { pal, stage } = c;
  const st = Math.min(stage, 3);
  let s = '';

  if (st === 0) {
    // ---- Petit poisson-lumière ----
    const cx = 104, cy = 122, rx = 58, ry = 50;
    s += ground(cx + 8, 205, 56);
    s += `<circle cx="${cx}" cy="${cy}" r="70" fill="${pal.glow}" opacity="0.22" filter="url(#soft)"/>`;
    // Queue en éventail.
    s += ink(`M${cx + rx - 10} ${cy} C${cx + rx + 14} ${cy - 30} ${cx + rx + 36} ${cy - 50} ${cx + rx + 46} ${cy - 38} C${cx + rx + 34} ${cy - 14} ${cx + rx + 34} ${cy + 14} ${cx + rx + 46} ${cy + 38} C${cx + rx + 36} ${cy + 50} ${cx + rx + 14} ${cy + 30} ${cx + rx - 10} ${cy} Z`, pal.accent, 2.4);
    s += line(`M${cx + rx} ${cy - 4} Q${cx + rx + 22} ${cy - 22} ${cx + rx + 38} ${cy - 34} M${cx + rx} ${cy + 4} Q${cx + rx + 22} ${cy + 22} ${cx + rx + 38} ${cy + 34}`, 1.3, pal.ink, ' opacity="0.7"');
    // Nageoire dorsale.
    s += ink(`M${cx - 14} ${cy - ry + 4} C${cx - 4} ${cy - ry - 24} ${cx + 26} ${cy - ry - 22} ${cx + 34} ${cy - ry + 12} Z`, pal.accent, 2.2);
    // Corps rond.
    const body = `M${cx - rx} ${cy} C${cx - rx} ${cy - ry * 1.32} ${cx + rx} ${cy - ry * 1.32} ${cx + rx} ${cy} C${cx + rx} ${cy + ry * 1.32} ${cx - rx} ${cy + ry * 1.32} ${cx - rx} ${cy} Z`;
    s += ink(body, pal.body, 2.6);
    s += ink(`M${cx - rx + 6} ${cy + 16} C${cx - 30} ${cy + ry + 6} ${cx + 30} ${cy + ry + 6} ${cx + rx - 8} ${cy + 18} C${cx + 20} ${cy + 34} ${cx - 20} ${cy + 34} ${cx - rx + 6} ${cy + 16} Z`, pal.belly, 1.6);
    s += shadow(`M${cx + rx * 0.4} ${cy - ry * 0.85} C${cx + rx * 1.05} ${cy - ry * 0.5} ${cx + rx * 1.05} ${cy + ry * 0.4} ${cx + rx * 0.5} ${cy + ry * 0.8} C${cx + rx * 0.8} ${cy + ry * 0.2} ${cx + rx * 0.75} ${cy - ry * 0.4} ${cx + rx * 0.4} ${cy - ry * 0.85} Z`, pal.shade, 0.55);
    // Points lumineux sur le flanc.
    for (const [dx, dy, r] of [[30, -18, 4], [42, -2, 3], [36, 14, 3.4], [18, -32, 2.6]]) {
      s += `<circle cx="${cx + dx}" cy="${cy + dy}" r="${r + 2}" fill="${pal.glow}" opacity="0.5" filter="url(#glow)"/><circle cx="${cx + dx}" cy="${cy + dy}" r="${r}" fill="${pal.glow}" stroke="#1A1230" stroke-width="1"/>`;
    }
    // Antenne-étoile.
    s += line(`M${cx - 12} ${cy - ry - 2} C${cx - 18} ${cy - ry - 26} ${cx - 34} ${cy - ry - 34} ${cx - 44} ${cy - ry - 30}`, 2.2);
    s += `<circle cx="${cx - 48}" cy="${cy - ry - 30}" r="10" fill="${pal.glow}" opacity="0.7" filter="url(#glow)"/>`;
    s += sparkle(cx - 48, cy - ry - 30, 8, pal.glow);
    // Petite nageoire latérale.
    s += ink(`M${cx + 2} ${cy + 18} C${cx + 14} ${cy + 22} ${cx + 22} ${cy + 34} ${cx + 18} ${cy + 42} C${cx + 8} ${cy + 36} ${cx} ${cy + 28} ${cx + 2} ${cy + 18} Z`, pal.accent, 1.8);
    s += shine(`M${cx - rx * 0.72} ${cy - ry * 0.45} q8 -16 24 -22`, 2.4);
    // Visage.
    s += eye(cx - 28, cy - 4, 15, pal.eye, -0.3) + eye(cx + 6, cy - 4, 12.5, pal.eye, -0.3);
    s += line(`M${cx - 26} ${cy + 22} q6 6 12 0`, 1.8);
    s += `<ellipse cx="${cx - 44}" cy="${cy + 16}" rx="6" ry="3.5" fill="#FF8FB1" opacity="0.6"/><ellipse cx="${cx + 18}" cy="${cy + 16}" rx="5" ry="3" fill="#FF8FB1" opacity="0.6"/>`;
    // Bulles.
    s += `<circle cx="${cx - 74}" cy="${cy + 6}" r="5" fill="none" stroke="#FFF6D8" stroke-width="1.6" opacity="0.8"/><circle cx="${cx - 82}" cy="${cy - 12}" r="3" fill="none" stroke="#FFF6D8" stroke-width="1.4" opacity="0.7"/>`;
    return s;
  }

  // ---- Stades 1–3 : baleine de profil (tête à gauche) ----
  const P = [
    { cx: 96, cy: 124, a: 78, b: 54, tilt: -6 },
    { cx: 94, cy: 118, a: 86, b: 58, tilt: -9 },
    { cx: 94, cy: 128, a: 104, b: 74, tilt: -16 },
  ][st - 1];
  const { cx, cy, a, b, tilt } = P;
  const q = (x: number, y: number) => `${f(x * a)} ${f(y * b)}`;
  // Nageoire caudale compacte : les x > 1 sont resserrés.
  const qt = (x: number, y: number) => q(x > 1 ? 1 + (x - 1) * 0.62 : x, y);

  if (st >= 3) {
    s += aura(cx, cy, 120, pal.glow);
    s += aura(cx + 60, cy - 30, 70, pal.accent2);
    // Sillage d'étoiles.
    s += line(`M${cx + 70} ${cy - 70} Q${cx + 110} ${cy - 90} ${cx + 140} ${cy - 130} M${cx + 80} ${cy - 50} Q${cx + 120} ${cy - 66} ${cx + 150} ${cy - 96}`, 2, pal.glow, ' opacity="0.6"');
  } else {
    s += ground(cx + 10, 206, a * 0.85);
  }

  let w = '';
  // Queue : pédoncule qui remonte + nageoire caudale.
  const fl = `M${qt(0.78, -0.38)} C${qt(0.98, -0.5)} ${qt(1.08, -0.62)} ${qt(1.14, -0.78)} C${qt(1.12, -1.08)} ${qt(1.24, -1.36)} ${qt(1.42, -1.42)} C${qt(1.36, -1.18)} ${qt(1.3, -0.96)} ${qt(1.26, -0.8)} C${qt(1.44, -0.86)} ${qt(1.62, -0.72)} ${qt(1.72, -0.5)} C${qt(1.5, -0.46)} ${qt(1.28, -0.44)} ${qt(1.14, -0.42)} C${qt(1.0, -0.1)} ${qt(0.9, 0.1)} ${qt(0.7, 0.2)} Z`;
  w += ink(fl, pal.accent, 2.4);
  w += line(`M${qt(1.16, -0.78)} L${qt(1.36, -1.3)} M${qt(1.2, -0.62)} L${qt(1.62, -0.54)}`, 1.3, pal.ink, ' opacity="0.6"');
  // Nageoire pectorale lointaine.
  w += ink(`M${q(-0.18, 0.5)} C${q(-0.1, 0.9)} ${q(0.1, 1.16)} ${q(0.26, 1.2)} C${q(0.2, 0.9)} ${q(0.12, 0.6)} ${q(0.04, 0.46)} Z`, pal.shade, 2);

  // Corps.
  const body = `M${q(-1, 0.05)} C${q(-1.02, -0.8)} ${q(-0.45, -1.02)} ${q(0, -0.98)} C${q(0.45, -0.94)} ${q(0.8, -0.66)} ${q(0.98, -0.42)} C${q(0.92, 0.1)} ${q(0.6, 0.6)} ${q(0.1, 0.86)} C${q(-0.4, 1.06)} ${q(-0.9, 0.9)} ${q(-1, 0.05)} Z`;
  w += ink(body, pal.body, 2.8);
  // Ventre : sillons clairs (1) ou fenêtre de nébuleuse (2+).
  const belly = `M${q(-0.98, 0.26)} C${q(-0.7, 0.4)} ${q(-0.2, 0.42)} ${q(0.3, 0.3)} C${q(0.56, 0.24)} ${q(0.7, 0.16)} ${q(0.8, 0.1)} C${q(0.6, 0.6)} ${q(0.1, 0.86)} ${q(-0.2, 0.92)} C${q(-0.6, 0.98)} ${q(-0.92, 0.78)} ${q(-0.98, 0.26)} Z`;
  if (st === 1) {
    w += ink(belly, pal.belly, 2);
    for (let i = 0; i < 4; i++) {
      const y = 0.44 + i * 0.12;
      w += line(`M${q(-0.86 + i * 0.04, y)} Q${q(-0.4, y + 0.08)} ${q(0.2 - i * 0.12, y - 0.04)}`, 1.2, pal.shade);
    }
  } else {
    const cid = `cetoile-win${st}`;
    w += `<defs><clipPath id="${cid}"><path d="${belly}"/></clipPath></defs>`;
    w += `<path d="${belly}" fill="${pal.shade}"/>`;
    w += `<g clip-path="url(#${cid})">`
      + `<ellipse cx="${f(-0.4 * a)}" cy="${f(0.6 * b)}" rx="${f(0.42 * a)}" ry="${f(0.28 * b)}" fill="${pal.accent}" opacity="0.75" filter="url(#soft)"/>`
      + `<ellipse cx="${f(0.2 * a)}" cy="${f(0.5 * b)}" rx="${f(0.36 * a)}" ry="${f(0.24 * b)}" fill="${pal.accent2}" opacity="0.8" filter="url(#soft)"/>`
      + `<ellipse cx="${f(-0.1 * a)}" cy="${f(0.62 * b)}" rx="${f(0.24 * a)}" ry="${f(0.14 * b)}" fill="${pal.glow}" opacity="0.7" filter="url(#soft)"/>`
      + `<path d="M${q(-0.8, 0.5)} C${q(-0.5, 0.34)} ${q(-0.3, 0.8)} ${q(0, 0.6)} C${q(0.2, 0.46)} ${q(0.4, 0.6)} ${q(0.6, 0.34)}" fill="none" stroke="#FFF6D8" stroke-width="3" opacity="0.5" stroke-linecap="round"/>`
      + speckles(c, -0.15 * a, 0.6 * b, 0.6 * a, 0.25 * b, 14 + st * 4)
      + sparkle(-0.5 * a, 0.56 * b, 5, '#FFF6D8', false) + sparkle(0.25 * a, 0.44 * b, 4, '#FFF6D8', false) + sparkle(-0.12 * a, 0.74 * b, 3.5, pal.glow, false)
      + `</g>`;
    w += `<path d="${belly}" fill="none" stroke="#1A1230" stroke-width="2"/>`;
    w += `<path d="${belly}" fill="none" stroke="${pal.glow}" stroke-width="1.2" stroke-dasharray="2 4" opacity="0.8" transform="translate(0 -3)"/>`;
    w += shine(`M${q(-0.8, 0.42)} q12 6 26 6`, 2);
  }
  // Ombre du dos.
  w += shadow(`M${q(-0.3, -0.98)} C${q(0.3, -0.98)} ${q(0.8, -0.7)} ${q(0.98, -0.42)} C${q(0.86, -0.14)} ${q(0.7, 0.06)} ${q(0.6, 0.14)} C${q(0.6, -0.3)} ${q(0.3, -0.7)} ${q(-0.3, -0.98)} Z`, pal.shade, 0.55);
  // Taches d'étoiles sur le dos.
  w += speckles(c, 0.1 * a, -0.55 * b, 0.55 * a, 0.25 * b, 8 + st * 3);
  if (st >= 2) {
    // Constellation sur le dos.
    const pts = [[-0.5, -0.66], [-0.2, -0.8], [0.12, -0.7], [0.4, -0.62], [0.6, -0.42]];
    w += line(`M${pts.map(([x, y]) => q(x, y)).join(' L')}`, 1.2, st >= 3 ? pal.glow : '#FFF6D8', ' opacity="0.85"');
    for (const [x, y] of pts) w += sparkle(x * a, y * b, st >= 3 ? 4.2 : 3.4, st >= 3 ? pal.glow : '#FFF6D8', false);
  }
  w += shine(`M${q(-0.86, -0.4)} Q${q(-0.7, -0.78)} ${q(-0.36, -0.86)}`, 2.6);
  // Bouche + œil.
  w += line(`M${q(-0.99, 0.18)} Q${q(-0.8, 0.3)} ${q(-0.54, 0.22)}`, 2);
  const er = st === 1 ? 11 : st === 2 ? 10 : 10;
  w += eye(-0.66 * a, -0.08 * b, er, pal.eye, -0.5);
  w += `<ellipse cx="${f(-0.54 * a)}" cy="${f(0.12 * b)}" rx="6" ry="3.5" fill="#FF8FB1" opacity="0.5"/>`;
  // Nageoire pectorale proche.
  const fo = st >= 2 ? -0.24 : 0, fs = st >= 2 ? 0.85 : 1;
  const qf = (x: number, y: number) => q(x + fo, 0.4 + (y - 0.4) * fs);
  w += ink(`M${qf(-0.42, 0.42)} C${qf(-0.34, 0.86)} ${qf(-0.14, 1.16)} ${qf(0.04, 1.22)} C${qf(0, 0.9)} ${qf(-0.1, 0.58)} ${qf(-0.2, 0.4)} Z`, pal.accent, 2.2);
  if (st >= 3) {
    w += line(`M${qf(-0.36, 0.6)} Q${qf(-0.22, 0.94)} ${qf(-0.02, 1.12)}`, 1.4, pal.glow);
    // Ligne latérale de lumières.
    for (let i = 0; i < 6; i++) {
      const x = -0.42 + i * 0.2, y = 0.06 - i * 0.04;
      w += `<circle cx="${f(x * a)}" cy="${f(y * b)}" r="4.5" fill="${pal.glow}" opacity="0.6" filter="url(#glow)"/><circle cx="${f(x * a)}" cy="${f(y * b)}" r="2.6" fill="#FFF6D8" stroke="#1A1230" stroke-width="0.9"/>`;
    }
    // Liseré lumineux sur la nageoire caudale.
    w += line(`M${qt(1.14, -0.78)} C${qt(1.12, -1.08)} ${qt(1.24, -1.36)} ${qt(1.42, -1.42)} M${qt(1.26, -0.8)} C${qt(1.44, -0.86)} ${qt(1.62, -0.72)} ${qt(1.72, -0.5)}`, 1.6, pal.glow);
    // Marques lumineuses au-dessus de l'œil.
    w += line(`M${q(-0.84, -0.32)} q8 -6 16 -4 M${q(-0.52, -0.46)} q6 -6 14 -4`, 2, pal.glow);
  }
  // Évent : jet de poussière d'étoiles.
  const sx = -0.38 * a, sy = -0.98 * b;
  w += line(`M${f(sx)} ${f(sy)} Q${f(sx - 10)} ${f(sy - 20)} ${f(sx - 18)} ${f(sy - 28)} M${f(sx)} ${f(sy)} Q${f(sx + 4)} ${f(sy - 22)} ${f(sx + 14)} ${f(sy - 30)}`, 2, pal.glow);
  w += sparkle(sx - 20, sy - 32, 5, pal.glow) + sparkle(sx + 16, sy - 34, 4, '#FFF6D8') + sparkle(sx - 2, sy - 40, 3, pal.glow);

  s += `<g transform="translate(${cx} ${cy}) rotate(${tilt})">${w}</g>`;

  if (st >= 3) {
    // Petites lunes et étoiles qui l'accompagnent.
    s += sparkle(18, 30, 7, pal.glow) + sparkle(200, 200, 6, pal.glow) + sparkle(40, 210, 5, '#FFF6D8') + sparkle(196, 20, 5, '#FFF6D8');
    s += ink('M26 214 a10 10 0 1 0 14 14 a8 8 0 1 1 -14 -14 Z', pal.glow, 1.4);
    // Couronne d'étoiles en orbite autour de la tête.
    s += `<ellipse cx="44" cy="96" rx="40" ry="12" transform="rotate(-16 44 96)" fill="none" stroke="${pal.glow}" stroke-width="1.6" stroke-dasharray="2 6" opacity="0.85"/>`;
    s += sparkle(8, 104, 4.5, pal.glow) + sparkle(80, 80, 4, '#FFF6D8') + sparkle(150, 236, 4, pal.glow) + sparkle(210, 120, 4.5, '#FFF6D8');
  } else {
    s += sparkle(cx + a * 0.9, cy + b * 0.9, 4, pal.glow) + sparkle(cx - a * 0.9, cy - b * 1.2, 3.5, '#FFF6D8');
  }
  return s;
};
