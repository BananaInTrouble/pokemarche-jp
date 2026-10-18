import { aura, eye, ink, line, shadow, shine, sparkle, speckles, type Species } from './style.ts';

/** Nébularaie : raie manta géante faite de nébuleuse, planant, constellations sur le dos (légendaire). */
export const nebularaie: Species = (c) => {
  const { pal } = c;
  const W = 222;
  const f = (v: number) => v.toFixed(1);
  // Point gauche (x,y) et son miroir droit.
  const L = (x: number, y: number) => `${f(x)} ${f(y)}`;
  const R = (x: number, y: number) => `${f(W - x)} ${f(y)}`;
  let s = '<g transform="rotate(-5 111 120) translate(111 118) scale(0.97 1.1) translate(-111 -118)">';
  s += aura(111, 112, 98, pal.glow);
  s += aura(60, 120, 40, pal.accent2);
  s += aura(162, 120, 40, pal.accent);

  // Queue fouet, derrière : longue courbe en S terminée par une comète.
  const tail = `M${L(104, 160)} C${L(100, 190)} ${L(134, 196)} ${L(146, 212)} C${L(152, 222)} ${L(146, 230)} ${L(138, 232)} C${L(146, 226)} ${L(146, 218)} ${L(140, 214)} C${L(126, 200)} ${L(108, 196)} ${L(118, 160)} Z`;
  s += ink(tail, pal.shade, 2.2);
  s += shine(`M${L(108, 176)} C${L(112, 188)} ${L(128, 196)} ${L(138, 206)}`, 1.4);
  s += sparkle(139, 232, 7, pal.glow);

  // Grand corps-ailes : bord d'attaque arqué, pointes relevées, bord de fuite ondulé.
  const wing = (P: (x: number, y: number) => string) =>
    `C${P(70, 60)} ${P(36, 66)} ${P(14, 92)} C${P(4, 104)} ${P(2, 82)} ${P(10, 66)} C${P(6, 96)} ${P(10, 118)} ${P(26, 130)} C${P(44, 142)} ${P(58, 134)} ${P(70, 146)} C${P(80, 156)} ${P(92, 164)} ${P(111, 166)}`;
  const body = `M${L(111, 70)} C${L(100, 66)} ${L(92, 62)} ${L(84, 60)} ${wing(L).replace(/^C/, 'C')}`
    + ` C${R(92, 164)} ${R(80, 156)} ${R(70, 146)} C${R(58, 134)} ${R(44, 142)} ${R(26, 130)} C${R(10, 118)} ${R(6, 96)} ${R(3, 70)} C${R(2, 82)} ${R(4, 104)} ${R(14, 92)} C${R(36, 66)} ${R(70, 60)} ${R(84, 60)} C${R(92, 62)} ${R(100, 66)} ${R(111, 70)} Z`;
  s += ink(body, pal.body, 2.8);

  // Dessous des pointes d'ailes, retournées (couleur ventre).
  for (const P of [L, R]) {
    s += ink(`M${P(14, 92)} C${P(4, 104)} ${P(2, 82)} ${P(10, 66)} C${P(8, 78)} ${P(14, 84)} ${P(14, 92)} Z`, pal.belly, 1.8);
  }

  // Nébuleuse : nuages bosselés translucides qui s'étirent du dos vers les pointes.
  const cloud = (cx: number, cy: number, rx: number, ry: number, rot: number, bumps: number) => {
    let d = '';
    const pt = (a: number, k: number) => {
      const x = Math.cos(a) * rx * k, y = Math.sin(a) * ry * k;
      const cr = Math.cos(rot), sr = Math.sin(rot);
      return `${f(cx + x * cr - y * sr)} ${f(cy + x * sr + y * cr)}`;
    };
    for (let i = 0; i < bumps; i++) {
      const a0 = (i / bumps) * Math.PI * 2, a1 = ((i + 1) / bumps) * Math.PI * 2, am = (a0 + a1) / 2;
      d += (i === 0 ? `M${pt(a0, 1)}` : '') + ` Q${pt(am, 1.32)} ${pt(a1, 1)}`;
    }
    return d + 'Z';
  };
  const neb = (sx: number, col1: string, col2: string) => {
    const X = (x: number) => (sx > 0 ? x : W - x);
    const r = sx > 0 ? 1 : -1;
    return `<path d="${cloud(X(64), 108, 34, 15, r * 0.32, 7)}" fill="${col1}" opacity="0.7"/>`
      + `<path d="${cloud(X(36), 104, 20, 9, r * 0.55, 6)}" fill="${col2}" opacity="0.65"/>`
      + `<path d="${cloud(X(78), 126, 18, 9, r * 0.1, 6)}" fill="${col2}" opacity="0.55"/>`
      + `<path d="${cloud(X(58), 106, 14, 6, r * 0.32, 5)}" fill="${pal.glow}" opacity="0.75"/>`;
  };
  s += neb(1, pal.accent2, pal.accent) + neb(-1, pal.accent, pal.accent2);
  // Volutes de nébuleuse (traits).
  s += line(`M${L(26, 104)} C${L(40, 96)} ${L(52, 92)} ${L(66, 94)}`, 1.4, pal.light);
  s += line(`M${R(26, 104)} C${R(40, 96)} ${R(52, 92)} ${R(66, 94)}`, 1.4, pal.light);

  // Ombres hachurées : bord de fuite et flancs.
  for (const P of [L, R]) {
    s += shadow(`M${P(26, 130)} C${P(44, 142)} ${P(58, 134)} ${P(70, 146)} C${P(80, 156)} ${P(92, 164)} ${P(111, 166)} L${P(111, 154)} C${P(92, 152)} ${P(80, 142)} ${P(68, 134)} C${P(54, 126)} ${P(40, 132)} ${P(26, 130)} Z`, pal.shade, 0.75);
  }

  // Dos central : arête plus claire.
  s += `<path d="M${L(111, 76)} C${L(98, 84)} ${L(96, 112)} ${L(102, 140)} C${L(106, 150)} ${R(106, 150)} ${R(102, 140)} C${R(96, 112)} ${R(98, 84)} ${R(111, 76)} Z" fill="${pal.light}" opacity="0.55"/>`;
  s += line(`M${L(111, 84)} L${L(111, 146)}`, 1.2, pal.shade, ' opacity="0.6"');
  // Constellations sur le dos : étoiles reliées.
  const constel = (pts: [number, number][], col: string) => {
    let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
    for (const [x, y] of pts.slice(1)) d += ` L${f(x)} ${f(y)}`;
    let o = line(d, 1.1, col, ' opacity="0.9" stroke-dasharray="2.5 2"');
    pts.forEach(([x, y], i) => { o += i % 2 === 0 ? sparkle(x, y, 3.6, '#FFF6D8', false) : `<circle cx="${f(x)}" cy="${f(y)}" r="1.9" fill="#FFF6D8"/>`; });
    return o;
  };
  s += constel([[40, 116], [58, 108], [76, 116], [84, 132], [70, 138]], '#FFF6D8');
  s += constel([[182, 116], [164, 108], [146, 116], [138, 132], [152, 138]], '#FFF6D8');
  s += constel([[111, 92], [104, 108], [111, 124], [118, 108], [111, 92]], pal.glow);
  s += sparkle(111, 108, 4.4, pal.glow);
  s += speckles(c, 60, 96, 30, 14, 10);
  s += speckles(c, 162, 96, 30, 14, 10);

  // Perles d'étoiles le long du bord de fuite.
  for (const P of [L, R]) {
    for (const [x, y] of [[30, 128], [46, 136], [62, 138], [80, 152], [96, 160]] as [number, number][]) {
      s += `<circle cx="${P(x, y).split(' ')[0]}" cy="${y - 4}" r="1.6" fill="${pal.glow}"/>`;
    }
  }
  // Reflets sur le bord d'attaque.
  s += shine(`M${L(80, 66)} C${L(60, 66)} ${L(40, 74)} ${L(24, 88)}`, 2);
  s += shine(`M${R(80, 66)} C${R(66, 66)} ${R(54, 70)} ${R(44, 76)}`, 1.6);

  // Nageoires céphaliques enroulées (cornes de la raie).
  for (const P of [L, R]) {
    s += ink(`M${P(82, 64)} C${P(74, 52)} ${P(78, 40)} ${P(90, 40)} C${P(100, 40)} ${P(102, 50)} ${P(96, 54)} C${P(92, 56)} ${P(88, 52)} ${P(91, 49)} C${P(96, 54)} ${P(100, 60)} ${P(100, 68)} Z`, pal.body, 2.2);
    s += line(`M${P(84, 60)} C${P(80, 52)} ${P(82, 45)} ${P(90, 44)}`, 1.3, pal.light);
  }
  // Tête : front large et plat, bouche en sourire, yeux sur les côtés.
  s += shadow(`M${L(84, 66)} C${L(92, 76)} ${R(92, 76)} ${R(84, 66)} C${R(90, 80)} ${L(90, 80)} ${L(84, 66)} Z`, pal.shade, 0.6);
  s += line(`M${L(98, 76)} C${L(104, 82)} ${R(104, 82)} ${R(98, 76)}`, 2);
  s += `<ellipse cx="82" cy="80" rx="4.5" ry="2.6" fill="#FF8FB1" opacity="0.55"/><ellipse cx="140" cy="80" rx="4.5" ry="2.6" fill="#FF8FB1" opacity="0.55"/>`;
  s += eye(88, 71, 6.4, pal.eye, -0.3) + eye(134, 71, 6.4, pal.eye, 0.3);
  // Diadème d'étoile au front.
  s += sparkle(111, 54, 7.5, pal.glow) + line(`M${L(104, 62)} q7 4 14 0`, 1.4, pal.glow);

  // Étoiles filantes / étincelles autour.
  s += sparkle(24, 50, 5, pal.glow) + sparkle(200, 152, 4.5, '#FFF6D8') + sparkle(36, 160, 3.6, pal.accent2) + sparkle(190, 40, 3.8, '#FFF6D8');
  s += line(`M${f(170)} ${f(186)} l22 -8`, 1.4, pal.glow, ' opacity="0.7"') + sparkle(168, 187, 3.4, pal.glow);
  return s + '</g>';
};
