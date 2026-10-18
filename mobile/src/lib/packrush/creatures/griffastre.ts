import { aura, eye, ground, ink, line, shadow, shine, sparkle, speckles, type Species } from './style.ts';

/** Griffastre : griffon céleste (tête d'aigle, corps félin), ailes de plumes-étoiles, couronne de constellation (légendaire). */
export const griffastre: Species = (c) => {
  const { pal } = c;
  const f = (v: number) => v.toFixed(1);
  const P = (x: number, y: number) => `${f(x)} ${f(y)}`;
  let s = '';
  s += aura(118, 100, 100, pal.glow);
  s += ground(130, 208, 82);

  // Plume en feuille : base (x,y), angle (degrés), longueur, demi-largeur.
  const feather = (x: number, y: number, ang: number, l: number, w: number, fill: string, star: boolean, sw = 1.8) => {
    const a = (ang * Math.PI) / 180, dx = Math.cos(a), dy = Math.sin(a), nx = -dy, ny = dx;
    const tx = x + dx * l, ty = y + dy * l;
    const d = `M${P(x, y)} Q${P(x + dx * l * 0.45 + nx * w * 1.6, y + dy * l * 0.45 + ny * w * 1.6)} ${P(tx, ty)} Q${P(x + dx * l * 0.45 - nx * w * 1.6, y + dy * l * 0.45 - ny * w * 1.6)} ${P(x, y)} Z`;
    let o = ink(d, fill, sw);
    o += line(`M${P(x + dx * 4, y + dy * 4)} L${P(x + dx * l * 0.8, y + dy * l * 0.8)}`, 1, '#1A1230', ' opacity="0.55"');
    if (star) o += sparkle(tx, ty, 4.2, pal.glow);
    return o;
  };

  // Aile : os (épaule → coude → poignet → pointe), éventail de rémiges, couvertures pleines écaillées.
  const wing = (dir: number, ox: number, oy: number, sc: number, col: string, col2: string, far: boolean) => {
    const X = (x: number) => ox + dir * x * sc, Y = (y: number) => oy - (112 - y) * sc;
    const bone: [number, number][] = [[0, 112], [8, 62], [32, 26], [66, 10]];
    const at = (t: number) => {
      const seg = Math.min(2, Math.floor(t * 3)), u = t * 3 - seg;
      const [x0, y0] = bone[seg], [x1, y1] = bone[seg + 1];
      return [x0 + (x1 - x0) * u, y0 + (y1 - y0) * u];
    };
    const ang = (deg: number) => (dir > 0 ? deg : 180 - deg);
    const dirv = (deg: number) => { const a = (ang(deg) * Math.PI) / 180; return [Math.cos(a), Math.sin(a)]; };
    let o = '';
    // Rémiges : de la pointe (primaires, vers le haut) à l'épaule (secondaires, vers le bas).
    const n = 12;
    for (let i = 0; i < n; i++) {
      const t = 1 - i / (n - 1);
      const [bx, by] = at(0.22 + t * 0.78);
      const deg = 112 - t * 34;
      const l = (28 + t * 32) * sc;
      o += feather(X(bx), Y(by), ang(deg), l, 8 * sc, i % 2 ? col : col2, t > 0.3 && !far && i % 2 === 0, far ? 1.6 : 1.9);
    }
    // Couvertures : masse pleine bordée d'écailles.
    const top: string[] = [], bot: string[] = [];
    const m = 8;
    for (let i = 0; i <= m; i++) {
      const t = i / m, [bx, by] = at(0.02 + t * 0.96), [dx, dy] = dirv(112 - t * 34);
      top.push(`${f(X(bx) - dx * 4)} ${f(Y(by) - dy * 4)}`);
      bot.push([X(bx) + dx * 22 * sc, Y(by) + dy * 22 * sc].map(f).join(' '));
    }
    let cov = `M${top.join(' L')}`;
    const br = bot.reverse();
    for (let i = 0; i < br.length; i++) {
      const [x, y] = br[i].split(' ').map(Number);
      if (i === 0) { cov += ` L${br[i]}`; continue; }
      const [px, py] = br[i - 1].split(' ').map(Number);
      cov += ` Q${f((x + px) / 2 + (dir > 0 ? 3 : -3))} ${f((y + py) / 2 + 5)} ${br[i]}`;
    }
    o += ink(cov + ' Z', far ? col : pal.light, 2);
    // Petite rangée d'écailles.
    for (let i = 1; i < m; i++) {
      const t = i / m, [bx, by] = at(0.02 + t * 0.96), [dx, dy] = dirv(112 - t * 34);
      const x = X(bx) + dx * 9 * sc, y = Y(by) + dy * 9 * sc;
      o += line(`M${f(x - 4)} ${f(y - 1)} q4 5 8 0`, 1.1, far ? '#1A1230' : pal.shade, ' opacity="0.7"');
    }
    // Bord d'attaque.
    const b = bone.map(([x, y]) => `${f(X(x))} ${f(Y(y))}`);
    o += line(`M${b[0]} L${b[1]} L${b[2]} L${b[3]}`, 8 * sc, '#1A1230');
    o += line(`M${b[0]} L${b[1]} L${b[2]} L${b[3]}`, 5 * sc, far ? col : pal.body);
    if (!far) { o += line(`M${b[1]} L${b[2]} L${b[3]}`, 1.4, '#FFFFFF', ' opacity="0.8"'); o += sparkle(X(66), Y(10), 5.5, pal.glow); }
    return o;
  };

  // Aile lointaine (derrière, plus sombre).
  s += wing(-1, 98, 108, 0.95, pal.shade, pal.body, true);

  // Queue féline, au sol, houppe en étoile.
  s += ink(`M${P(172, 196)} C${P(200, 204)} ${P(214, 192)} ${P(210, 168)} C${P(208, 160)} ${P(202, 158)} ${P(200, 164)} C${P(204, 186)} ${P(196, 192)} ${P(176, 186)} Z`, pal.body, 2.2);
  s += ink(`M${P(205, 166)} L${P(196, 150)} L${P(206, 156)} L${P(212, 140)} L${P(214, 158)} L${P(222, 156)} L${P(212, 168)} Z`, pal.accent, 1.8);
  s += sparkle(211, 152, 4, pal.glow);

  // Corps félin assis.
  const body = `M${P(84, 120)} C${P(76, 150)} ${P(80, 186)} ${P(94, 204)} L${P(156, 206)} C${P(190, 206)} ${P(196, 168)} ${P(180, 144)} C${P(166, 124)} ${P(132, 118)} ${P(108, 104)} Z`;
  s += ink(body, pal.body, 2.8);
  s += shadow(`M${P(150, 206)} C${P(186, 206)} ${P(192, 170)} ${P(178, 146)} C${P(184, 168)} ${P(176, 196)} ${P(142, 200)} Z`, pal.shade, 0.8);
  // Cuisse arrière + patte de félin.
  s += ink(`M${P(126, 200)} C${P(118, 168)} ${P(138, 144)} ${P(162, 150)} C${P(184, 158)} ${P(186, 188)} ${P(170, 202)} Z`, pal.body, 2.4);
  s += shadow(`M${P(170, 202)} C${P(186, 188)} ${P(184, 160)} ${P(166, 152)} C${P(176, 168)} ${P(174, 190)} ${P(160, 200)} Z`, pal.shade, 0.7);
  s += ink(`M${P(136, 206)} C${P(134, 194)} ${P(160, 192)} ${P(162, 206)} Z`, pal.light, 2);
  s += line(`M${P(144, 206)} l0 -4 M${P(151, 206)} l0 -4`, 1.3);
  // Constellation sur le flanc.
  const st: [number, number][] = [[140, 160], [154, 166], [166, 160], [160, 180], [146, 184]];
  s += line(`M${st.map(([x, y]) => P(x, y)).join(' L')}`, 1, '#FFF6D8', ' opacity="0.85" stroke-dasharray="2.5 2"');
  for (const [x, y] of st) s += `<circle cx="${x}" cy="${y}" r="1.8" fill="#FFF6D8"/>`;
  s += sparkle(154, 166, 3.6, pal.glow, false);

  // Aile proche (devant le corps, derrière la tête).
  s += wing(1, 124, 128, 1.1, pal.body, pal.accent, false);

  // Pattes avant d'aigle : écailles + serres.
  for (const x of [88, 112]) {
    s += ink(`M${P(x - 7, 150)} C${P(x - 8, 170)} ${P(x - 5, 186)} ${P(x - 4, 198)} L${P(x + 5, 198)} C${P(x + 5, 186)} ${P(x + 7, 168)} ${P(x + 8, 150)} Z`, pal.glow, 2.2);
    s += shadow(`M${P(x + 2, 152)} C${P(x + 2, 170)} ${P(x + 2, 186)} ${P(x + 1, 198)} L${P(x + 5, 198)} C${P(x + 5, 186)} ${P(x + 7, 168)} ${P(x + 8, 150)} Z`, pal.accent, 0.5);
    s += line(`M${P(x - 6, 174)} q5 3 11 0 M${P(x - 5, 182)} q5 3 10 0 M${P(x - 5, 190)} q5 3 10 0`, 1.1, '#1A1230', ' opacity="0.6"');
    for (const [k, a] of [[-11, -1], [-4, -0.3], [4, 0.4]] as [number, number][]) {
      s += ink(`M${P(x, 196)} C${P(x + k * 0.5, 197)} ${P(x + k, 200)} ${P(x + k, 205)} L${P(x + k + 3, 205)} C${P(x + k + 3, 201)} ${P(x + 2, 199)} ${P(x + 2, 196)} Z`, pal.glow, 1.6);
      s += ink(`M${P(x + k, 204)} q${f(a * 4 - 2)} 3 ${f(a * 3 - 4)} 2 q3 -1 6 -2 Z`, '#FFF6D8', 1.2);
    }
  }

  // Culottes de plumes en haut des pattes.
  for (const x of [88, 112]) {
    s += ink(`M${P(x - 10, 150)} C${P(x - 12, 164)} ${P(x - 10, 174)} ${P(x - 8, 180)} Q${P(x - 5, 176)} ${P(x - 3, 182)} Q${P(x, 177)} ${P(x + 3, 182)} Q${P(x + 6, 176)} ${P(x + 9, 180)} C${P(x + 11, 170)} ${P(x + 11, 160)} ${P(x + 10, 150)} Z`, pal.light, 2);
    s += line(`M${P(x - 4, 160)} q2 6 0 12 M${P(x + 4, 158)} q2 6 0 12`, 1, pal.shade);
  }
  s += speckles(c, 158, 176, 20, 18, 7);

  // Jabot de plumes (poitrail).
  let ruff = `M${P(70, 92)}`;
  const rp: [number, number][] = [[72, 108], [80, 120], [84, 134], [92, 146], [104, 150], [112, 140], [114, 124], [110, 108], [104, 96]];
  for (const [x, y] of rp) ruff += ` Q${P(x - 6, y - 2)} ${P(x, y)}`;
  s += ink(ruff + ' Z', pal.belly, 2.2);
  for (const [x, y] of [[82, 116], [94, 128], [100, 140], [88, 104], [100, 114], [108, 126]] as [number, number][]) s += line(`M${P(x - 5, y - 3)} q5 5 10 0`, 1.1, pal.shade);
  s += shine(`M${P(80, 106)} q2 8 8 14`, 1.8);

  s += '<g transform="translate(86 86) scale(1.16) translate(-84 -80)">';
  // Tête d'aigle (profil gauche) avec crête de plumes.
  for (const [x, y, a, l] of [[94, 56, -40, 26], [100, 62, -24, 30], [104, 72, -8, 28], [104, 84, 10, 22]] as [number, number, number, number][]) {
    s += feather(x, y, a, l, 5, pal.body, false, 1.8);
  }
  const head = `M${P(62, 72)} C${P(62, 52)} ${P(84, 44)} ${P(98, 52)} C${P(112, 60)} ${P(112, 82)} ${P(104, 96)} C${P(96, 104)} ${P(78, 104)} ${P(70, 96)} C${P(64, 90)} ${P(62, 82)} ${P(62, 72)} Z`;
  s += ink(head, pal.light, 2.6);
  s += shadow(`M${P(98, 52)} C${P(112, 60)} ${P(112, 82)} ${P(104, 96)} C${P(96, 104)} ${P(84, 104)} ${P(78, 100)} C${P(96, 96)} ${P(106, 76)} ${P(98, 52)} Z`, pal.body, 0.55);
  // Bec crochu doré.
  s += ink(`M${P(66, 68)} C${P(54, 64)} ${P(42, 70)} ${P(40, 82)} C${P(40, 90)} ${P(42, 96)} ${P(46, 98)} C${P(46, 92)} ${P(48, 86)} ${P(54, 84)} C${P(58, 84)} ${P(62, 86)} ${P(66, 88)} Z`, pal.glow, 2.4);
  s += ink(`M${P(66, 88)} C${P(58, 86)} ${P(52, 88)} ${P(50, 92)} C${P(54, 96)} ${P(62, 96)} ${P(70, 94)} Z`, pal.glow, 2);
  s += shadow(`M${P(62, 80)} C${P(54, 78)} ${P(46, 84)} ${P(45, 96)} C${P(46, 90)} ${P(50, 85)} ${P(56, 84)} C${P(60, 84)} ${P(64, 86)} ${P(66, 88)} Z`, pal.accent, 0.5);
  s += `<circle cx="58" cy="74" r="1.5" fill="#1A1230"/>`;
  s += shine(`M${P(52, 70)} q-6 2 -8 8`, 1.6);
  // Œil perçant + sourcil.
  s += eye(80, 70, 6.6, pal.eye, -0.6);
  s += ink(`M${P(70, 62)} C${P(78, 56)} ${P(88, 58)} ${P(92, 64)} C${P(86, 62)} ${P(78, 62)} ${P(70, 64)} Z`, pal.ink, 1.2);
  s += line(`M${P(72, 80)} q8 4 16 0`, 1.2, pal.shade);
  // Marque d'étoile sur la joue.
  s += sparkle(92, 84, 3.6, pal.glow, false);

  s += '</g>';

  // Couronne de constellation flottante.
  const cr: [number, number][] = [[50, 38], [54, 20], [66, 30], [78, 8], [90, 28], [102, 18], [106, 36]];
  s += line(`M${cr.map(([x, y]) => P(x, y)).join(' L')}`, 1.3, pal.glow, ' stroke-dasharray="3 2"');
  s += line(`M${P(50, 38)} Q${P(78, 48)} ${P(106, 36)}`, 1.3, pal.glow, ' opacity="0.8"');
  for (const [i, [x, y]] of cr.entries()) s += i % 2 ? sparkle(x, y, i === 3 ? 6.5 : 4.6, pal.glow) : `<circle cx="${x}" cy="${y}" r="2.2" fill="#FFF6D8" stroke="#1A1230" stroke-width="0.8"/>`;

  s += speckles(c, 150, 60, 40, 30, 8);
  s += sparkle(24, 140, 4.5, pal.glow) + sparkle(30, 196, 3.4, '#FFF6D8') + sparkle(206, 108, 3.6, pal.accent2);
  return s;
};
