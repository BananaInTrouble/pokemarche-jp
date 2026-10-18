import { aura, eye, ground, ink, line, shadow, shine, sparkle, speckles, type Species } from './style.ts';

/** Sphinxlipse : sphinx félin couché, couronné d'une éclipse, ornements dorés (légendaire). */
export const sphinxlipse: Species = (c) => {
  const { pal } = c;
  const f = (v: number) => v.toFixed(1);
  const P = (x: number, y: number) => `${f(x)} ${f(y)}`;
  const gold = pal.glow;
  const hx = 80, hy = 96; // centre de la tête
  let s = '';
  s += aura(hx, 50, 60, gold);
  s += aura(130, 140, 90, pal.accent2);
  s += ground(118, 207, 98);

  // Queue : enroulée au sol devant la croupe, houppe d'étoile.
  s += ink(`M${P(196, 186)} C${P(214, 190)} ${P(214, 206)} ${P(196, 208)} C${P(176, 210)} ${P(158, 206)} ${P(150, 200)} C${P(160, 202)} ${P(176, 204)} ${P(192, 200)} C${P(204, 198)} ${P(204, 192)} ${P(192, 190)} Z`, pal.body, 2.2);
  s += ink(`M${P(150, 200)} L${P(138, 196)} L${P(146, 204)} L${P(136, 210)} L${P(152, 208)} Z`, gold, 1.6);

  // Corps couché, long, croupe à droite.
  const body = `M${P(64, 150)} C${P(70, 128)} ${P(110, 122)} ${P(146, 124)} C${P(178, 124)} ${P(204, 136)} ${P(206, 164)} C${P(208, 184)} ${P(200, 200)} ${P(184, 204)} L${P(70, 204)} C${P(60, 190)} ${P(60, 166)} ${P(64, 150)} Z`;
  s += ink(body, pal.body, 2.8);
  s += shadow(`M${P(70, 204)} L${P(184, 204)} C${P(196, 200)} ${P(202, 192)} ${P(204, 180)} C${P(190, 192)} ${P(120, 196)} ${P(70, 190)} Z`, pal.shade, 0.75);
  s += shine(`M${P(110, 128)} C${P(130, 124)} ${P(160, 124)} ${P(180, 134)}`, 2);
  // Cuisse arrière.
  s += ink(`M${P(150, 202)} C${P(140, 176)} ${P(156, 148)} ${P(182, 150)} C${P(204, 154)} ${P(208, 186)} ${P(194, 204)} Z`, pal.body, 2.4);
  s += shadow(`M${P(194, 204)} C${P(208, 186)} ${P(204, 160)} ${P(188, 152)} C${P(198, 168)} ${P(196, 190)} ${P(180, 202)} Z`, pal.shade, 0.7);
  s += ink(`M${P(150, 206)} C${P(146, 196)} ${P(172, 194)} ${P(176, 206)} Z`, pal.light, 2);
  // Constellation sur le flanc (rayures stellaires).
  for (const [x, y] of [[112, 134], [126, 132], [140, 134]] as [number, number][]) s += ink(`M${P(x, y - 4)} q-6 14 2 30 q-2 -16 4 -30 Z`, pal.shade, 1.2);
  const st: [number, number][] = [[160, 162], [174, 168], [186, 160], [180, 182]];
  s += line(`M${st.map(([x, y]) => P(x, y)).join(' L')}`, 1, '#FFF6D8', ' opacity="0.85" stroke-dasharray="2.5 2"');
  for (const [x, y] of st) s += `<circle cx="${x}" cy="${y}" r="1.8" fill="#FFF6D8"/>`;
  s += speckles(c, 120, 170, 30, 14, 9);

  // Pattes avant allongées, bracelets d'or.
  for (const [y0, x1] of [[176, 16], [190, 28]] as [number, number][]) {
    s += ink(`M${P(86, y0 - 12)} C${P(60, y0 - 14)} ${P(36, y0 - 8)} ${P(x1 + 12, y0 - 6)} C${P(x1 - 2, y0 - 6)} ${P(x1 - 6, y0 + 16)} ${P(x1 + 8, y0 + 16)} L${P(92, y0 + 14)} Z`, y0 === 190 ? pal.light : pal.body, 2.4);
    s += line(`M${P(x1 + 3, y0 + 16)} q-2 -4 0 -7 M${P(x1 + 10, y0 + 16)} q-2 -4 0 -7`, 1.3);
    s += ink(`M${P(x1 + 26, y0 - 6)} L${P(x1 + 32, y0 - 7)} L${P(x1 + 32, y0 + 16)} L${P(x1 + 26, y0 + 16)} Z`, gold, 1.6);
    s += `<circle cx="${x1 + 29}" cy="${y0 + 4}" r="1.8" fill="${pal.accent}" stroke="#1A1230" stroke-width="0.8"/>`;
  }

  s += '<g transform="translate(80 158) scale(1.08) translate(-80 -150)">';
  // Coiffe à rayures (retombe sur les épaules).
  const nemes = `M${P(hx - 26, hy - 26)} C${P(hx - 36, hy - 8)} ${P(hx - 44, hy + 30)} ${P(hx - 40, hy + 58)} L${P(hx - 22, hy + 58)} L${P(hx - 18, hy + 20)} L${P(hx + 18, hy + 20)} L${P(hx + 22, hy + 58)} L${P(hx + 40, hy + 58)} C${P(hx + 44, hy + 30)} ${P(hx + 36, hy - 8)} ${P(hx + 26, hy - 26)} Z`;
  s += ink(nemes, gold, 2.6);
  for (const sg of [-1, 1]) {
    for (let k = 0; k < 5; k++) {
      const y = hy + 4 + k * 11;
      s += ink(`M${P(hx + sg * (22 + k * 1.2), y)} L${P(hx + sg * (37 + k * 0.8), y)} L${P(hx + sg * (38 + k * 0.6), y + 5)} L${P(hx + sg * (22.5 + k * 1.2), y + 5)} Z`, pal.accent, 1);
    }
  }
  s += shadow(`M${P(hx + 26, hy - 26)} C${P(hx + 36, hy - 8)} ${P(hx + 44, hy + 30)} ${P(hx + 40, hy + 58)} L${P(hx + 32, hy + 58)} C${P(hx + 34, hy + 30)} ${P(hx + 30, hy - 6)} ${P(hx + 26, hy - 26)} Z`, pal.shade, 0.45);

  // Collier large (perles d'or) sur le poitrail.
  s += ink(`M${P(hx - 26, hy + 24)} C${P(hx - 24, hy + 52)} ${P(hx + 24, hy + 52)} ${P(hx + 26, hy + 24)} C${P(hx + 12, hy + 32)} ${P(hx - 12, hy + 32)} ${P(hx - 26, hy + 24)} Z`, gold, 2.2);
  s += line(`M${P(hx - 22, hy + 32)} C${P(hx - 12, hy + 42)} ${P(hx + 12, hy + 42)} ${P(hx + 22, hy + 32)}`, 2.4, pal.accent);
  for (let k = -3; k <= 3; k++) s += `<circle cx="${f(hx + k * 6)}" cy="${f(hy + 44 - Math.abs(k) * 1.6)}" r="2" fill="${pal.accent2}" stroke="#1A1230" stroke-width="0.8"/>`;
  s += ink(`M${P(hx - 4, hy + 44)} L${P(hx, hy + 54)} L${P(hx + 4, hy + 44)} Z`, pal.accent, 1.2);

  // Oreilles de félin qui percent la coiffe.
  for (const sg of [-1, 1]) {
    s += ink(`M${P(hx + sg * 10, hy - 26)} L${P(hx + sg * 28, hy - 48)} L${P(hx + sg * 30, hy - 18)} Z`, pal.body, 2.2);
    s += ink(`M${P(hx + sg * 14, hy - 26)} L${P(hx + sg * 26, hy - 41)} L${P(hx + sg * 27, hy - 22)} Z`, pal.accent, 1.2);
  }

  // Visage.
  s += ink(`M${P(hx - 24, hy - 4)} C${P(hx - 26, hy - 30)} ${P(hx + 26, hy - 30)} ${P(hx + 24, hy - 4)} C${P(hx + 24, hy + 14)} ${P(hx + 12, hy + 26)} ${P(hx, hy + 26)} C${P(hx - 12, hy + 26)} ${P(hx - 24, hy + 14)} ${P(hx - 24, hy - 4)} Z`, pal.body, 2.6);
  s += ink(`M${P(hx - 10, hy + 8)} C${P(hx - 12, hy + 22)} ${P(hx + 12, hy + 22)} ${P(hx + 10, hy + 8)} C${P(hx + 6, hy + 4)} ${P(hx - 6, hy + 4)} ${P(hx - 10, hy + 8)} Z`, pal.belly, 1.4);
  // Bandeau d'or au front.
  s += ink(`M${P(hx - 24, hy - 12)} C${P(hx - 12, hy - 18)} ${P(hx + 12, hy - 18)} ${P(hx + 24, hy - 12)} L${P(hx + 24, hy - 7)} C${P(hx + 12, hy - 13)} ${P(hx - 12, hy - 13)} ${P(hx - 24, hy - 7)} Z`, gold, 1.6);
  s += ink(`M${P(hx, hy - 22)} L${P(hx + 5, hy - 14)} L${P(hx, hy - 7)} L${P(hx - 5, hy - 14)} Z`, pal.accent, 1.3);
  // Yeux sages + trait doré prolongé.
  for (const sg of [-1, 1]) {
    s += eye(hx + sg * 10, hy, 5.6, pal.eye, 0);
    s += line(`M${P(hx + sg * 15, hy - 1)} q${sg * 5} -1 ${sg * 9} -5`, 1.8);
    s += line(`M${P(hx + sg * 4, hy - 6)} q${sg * 6} -4 ${sg * 12} -2`, 1.6);
  }
  s += ink(`M${P(hx - 3.5, hy + 10)} L${P(hx + 3.5, hy + 10)} L${P(hx, hy + 14)} Z`, pal.ink, 1.2);
  s += line(`M${P(hx - 5, hy + 17)} q2.5 2.5 5 0 q2.5 2.5 5 0`, 1.4);
  s += line(`M${P(hx - 12, hy + 12)} l-12 -2 M${P(hx - 12, hy + 15)} l-12 2 M${P(hx + 12, hy + 12)} l12 -2 M${P(hx + 12, hy + 15)} l12 2`, 1, '#1A1230', ' opacity="0.6"');
  s += shine(`M${P(hx - 18, hy - 20)} q6 -6 14 -6`, 1.8);

  // Couronne d'éclipse : couronne solaire en rayons, disque noir, liseré de lumière.
  const ex = hx, ey = hy - 58;
  let rays = '';
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2, a1 = a - 0.12, a2 = a + 0.12, L = i % 2 ? 27 : 33;
    rays += `M${P(ex + Math.cos(a1) * 20, ey + Math.sin(a1) * 20)} L${P(ex + Math.cos(a) * L, ey + Math.sin(a) * L)} L${P(ex + Math.cos(a2) * 20, ey + Math.sin(a2) * 20)} `;
  }
  s += `<circle cx="${ex}" cy="${ey}" r="30" fill="${gold}" opacity="0.55" filter="url(#soft)"/>`;
  s += ink(rays + 'Z', gold, 1.6);
  s += `<circle cx="${ex}" cy="${ey}" r="23" fill="${pal.accent2}" stroke="#1A1230" stroke-width="2"/>`;
  s += `<circle cx="${ex}" cy="${ey}" r="23" fill="#FFF6D8" opacity="0.6" filter="url(#glow)"/>`;
  s += `<circle cx="${ex + 3}" cy="${ey + 1}" r="20" fill="#0A0618" stroke="#1A1230" stroke-width="1.6"/>`;
  s += line(`M${P(ex - 12, ey - 10)} q4 -5 10 -6`, 1.2, pal.light, ' opacity="0.6"');
  s += sparkle(ex - 18, ey + 10, 5, '#FFF6D8');
  // Attache de la couronne.
  s += line(`M${P(hx - 6, hy - 28)} L${P(ex - 4, ey + 21)} M${P(hx + 6, hy - 28)} L${P(ex + 6, ey + 21)}`, 2, gold);

  s += '</g>';
  s += sparkle(26, 60, 4.4, gold) + sparkle(196, 50, 4, '#FFF6D8') + sparkle(176, 104, 3.6, pal.accent2) + sparkle(30, 140, 3.4, '#FFF6D8');
  return s;
};
