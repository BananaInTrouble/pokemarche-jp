import { aura, eye, ink, line, shadow, shine, sparkle, speckles, type Species } from './style.ts';

/** Abyssquid : calmar des abysses cosmiques enroulé autour d'un petit trou noir, tentacules spiralés lumineux (légendaire). */
export const abyssquid: Species = (c) => {
  const { pal } = c;
  const f = (v: number) => v.toFixed(1);
  const W = 222;
  const L = (x: number, y: number) => `${f(x)} ${f(y)}`;
  const R = (x: number, y: number) => `${f(W - x)} ${f(y)}`;
  const hx = 111, hy = 170; // trou noir
  let s = '';
  s += aura(111, 120, 100, pal.glow);
  s += aura(hx, hy, 46, pal.accent2);

  // Disque d'accrétion (derrière les bras).
  s += `<ellipse cx="${hx}" cy="${hy}" rx="40" ry="14" fill="none" stroke="${pal.glow}" stroke-width="9" opacity="0.45" filter="url(#soft)"/>`;
  s += `<ellipse cx="${hx}" cy="${hy}" rx="36" ry="12" fill="none" stroke="#1A1230" stroke-width="7"/>`;
  s += `<ellipse cx="${hx}" cy="${hy}" rx="36" ry="12" fill="none" stroke="${pal.accent}" stroke-width="4.5"/>`;
  s += `<ellipse cx="${hx}" cy="${hy}" rx="36" ry="12" fill="none" stroke="${pal.glow}" stroke-width="1.6" stroke-dasharray="9 5"/>`;
  // Trou noir + anneau de photons.
  s += `<circle cx="${hx}" cy="${hy}" r="18" fill="${pal.glow}" opacity="0.9" filter="url(#glow)"/>`;
  s += `<circle cx="${hx}" cy="${hy}" r="15" fill="#05030C" stroke="#1A1230" stroke-width="2"/>`;
  s += `<path d="M${hx - 36} ${hy} A36 12 0 0 0 ${hx + 36} ${hy}" fill="none" stroke="${pal.accent}" stroke-width="4.5"/>`;
  s += `<path d="M${hx - 36} ${hy} A36 12 0 0 0 ${hx + 36} ${hy}" fill="none" stroke="${pal.glow}" stroke-width="1.6" stroke-dasharray="9 5"/>`;
  s += line(`M${hx - 36} ${hy + 0.5} A36 12 0 0 0 ${hx + 36} ${hy + 0.5}`, 1.2, '#1A1230', ' opacity="0.6"');

  // Bras : ruban effilé le long d'une courbe lisse (Catmull-Rom) passant par des points de contrôle.
  const arm = (pts: [number, number][], w0: number, mirror: boolean, tip = 4.5) => {
    const q = pts.map(([x, y]) => [mirror ? W - x : x, y] as [number, number]);
    const ctr: [number, number][] = [];
    for (let i = 0; i < q.length - 1; i++) {
      const p0 = q[Math.max(0, i - 1)], p1 = q[i], p2 = q[i + 1], p3 = q[Math.min(q.length - 1, i + 2)];
      for (let k = 0; k < 8; k++) {
        const t = k / 8, t2 = t * t, t3 = t2 * t;
        const cr = (a: number, b: number, c2: number, d: number) => 0.5 * (2 * b + (-a + c2) * t + (2 * a - 5 * b + 4 * c2 - d) * t2 + (-a + 3 * b - 3 * c2 + d) * t3);
        ctr.push([cr(p0[0], p1[0], p2[0], p3[0]), cr(p0[1], p1[1], p2[1], p3[1])]);
      }
    }
    ctr.push(q[q.length - 1]);
    const N = ctr.length - 1;
    const nrm = (i: number) => {
      const [xa, ya] = ctr[Math.max(0, i - 1)], [xb, yb] = ctr[Math.min(N, i + 1)];
      const nx = -(yb - ya), ny = xb - xa, l = Math.hypot(nx, ny) || 1;
      return [nx / l, ny / l];
    };
    const wd = (i: number) => w0 * (1 - Math.pow(i / N, 1.2) * 0.85);
    const left: string[] = [], right: string[] = [];
    for (let i = 0; i <= N; i++) {
      const [x, y] = ctr[i], [nx, ny] = nrm(i), w = wd(i);
      left.push(`${f(x + nx * w)} ${f(y + ny * w)}`); right.push(`${f(x - nx * w)} ${f(y - ny * w)}`);
    }
    let o = ink(`M${left.join(' L')} L${right.reverse().join(' L')} Z`, pal.body, 2.2);
    // Ombre hachurée sur un côté.
    const sh: string[] = [], sh2: string[] = [];
    const side = mirror ? 1 : -1;
    for (let i = 0; i <= N; i++) {
      const [x, y] = ctr[i], [nx, ny] = nrm(i), w = wd(i);
      sh.push(`${f(x + side * nx * w)} ${f(y + side * ny * w)}`); sh2.push(`${f(x + side * nx * w * 0.2)} ${f(y + side * ny * w * 0.2)}`);
    }
    o += shadow(`M${sh.join(' L')} L${sh2.reverse().join(' L')} Z`, pal.shade, 0.55);
    // Ventouses lumineuses.
    for (let i = 4; i < N - 2; i += 4) {
      const [x, y] = ctr[i], [nx, ny] = nrm(i), w = wd(i);
      o += `<circle cx="${f(x - side * nx * w * 0.5)}" cy="${f(y - side * ny * w * 0.5)}" r="${f(Math.max(1, w * 0.34))}" fill="${pal.glow}" stroke="#1A1230" stroke-width="0.8"/>`;
    }
    const [tx, ty] = ctr[N];
    o += `<circle cx="${f(tx)}" cy="${f(ty)}" r="${tip + 2}" fill="${pal.glow}" opacity="0.35"/>` + sparkle(tx, ty, tip, pal.glow);
    return o;
  };
  for (const m of [false, true]) {
    // Grands bras de chasse : déployés sur les côtés, enroulés en volute vers le haut.
    s += arm([[90, 136], [62, 142], [34, 128], [20, 98], [26, 70], [44, 62], [54, 76], [44, 86], [36, 78]], 9, m, 6);
    // Bras moyens : vers le bas, terminés en crosse.
    s += arm([[94, 142], [70, 156], [46, 180], [40, 206], [56, 222], [74, 216], [72, 202], [62, 204]], 7.5, m, 4.5);
  }
  // Bras courts : enlacent le trou noir et se croisent dessous.
  s += arm([[98, 144], [76, 152], [64, 172], [74, 194], [104, 204], [130, 198], [140, 188]], 6.5, false, 4);
  s += arm([[98, 144], [76, 152], [66, 176], [82, 204], [112, 216], [136, 212]], 6, true, 4);
  // Collerette de la tête (base des bras).
  s += ink(`M${L(78, 124)} C${L(80, 140)} ${L(96, 148)} ${L(111, 148)} C${R(96, 148)} ${R(80, 140)} ${R(78, 124)} Z`, pal.shade, 2.2);

  // Manteau en fuseau, pointe vers le haut, nageoires en losange.
  for (const Q of [L, R]) {
    s += ink(`M${Q(100, 14)} C${Q(84, 14)} ${Q(64, 26)} ${Q(58, 48)} C${Q(64, 50)} ${Q(66, 56)} ${Q(72, 58)} C${Q(78, 60)} ${Q(80, 66)} ${Q(88, 68)} C${Q(92, 70)} ${Q(94, 76)} ${Q(96, 80)} Z`, pal.light, 2.4);
    s += `<path d="M${Q(96, 20)} C${Q(80, 22)} ${Q(68, 32)} ${Q(64, 44)} C${Q(74, 48)} ${Q(84, 56)} ${Q(94, 66)} Z" fill="${pal.accent}" opacity="0.6"/>`;
    s += shadow(`M${Q(58, 48)} C${Q(64, 50)} ${Q(66, 56)} ${Q(72, 58)} C${Q(78, 60)} ${Q(80, 66)} ${Q(88, 68)} C${Q(92, 70)} ${Q(94, 76)} ${Q(96, 80)} L${Q(98, 62)} C${Q(84, 56)} ${Q(70, 50)} ${Q(58, 48)} Z`, pal.shade, 0.55);
    s += line(`M${Q(98, 26)} Q${Q(82, 32)} ${Q(68, 44)} M${Q(98, 40)} Q${Q(88, 46)} ${Q(78, 54)} M${Q(98, 54)} Q${Q(92, 58)} ${Q(88, 62)}`, 1.1, pal.light);
    s += `<circle cx="${Q(76, 38).split(' ')[0]}" cy="38" r="1.8" fill="#FFF6D8"/><circle cx="${Q(86, 50).split(' ')[0]}" cy="50" r="1.4" fill="#FFF6D8"/>`;
  }
  const mantle = `M${L(111, 8)} C${L(100, 8)} ${L(90, 24)} ${L(86, 52)} C${L(83, 72)} ${L(80, 90)} ${L(80, 100)} C${L(78, 112)} ${L(80, 124)} ${L(84, 130)} L${R(84, 130)} C${R(80, 124)} ${R(78, 112)} ${R(80, 100)} C${R(80, 90)} ${R(83, 72)} ${R(86, 52)} C${R(90, 24)} ${R(100, 8)} ${L(111, 8)} Z`;
  s += ink(mantle, pal.body, 2.8);
  s += shadow(`M${R(104, 10)} C${R(94, 20)} ${R(88, 50)} ${R(82, 96)} C${R(80, 112)} ${R(82, 124)} ${R(86, 130)} L${R(96, 130)} C${R(92, 110)} ${R(94, 60)} ${R(104, 10)} Z`, pal.shade, 0.7);
  // Bandes nébuleuses + photophores.
  // Chevrons de nébuleuse.
  for (const [y, w] of [[34, 14], [58, 20], [82, 24]] as [number, number][]) {
    s += ink(`M${f(111 - w)} ${y + 10} L111 ${y} L${f(111 + w)} ${y + 10} L${f(111 + w * 0.8)} ${y + 15} L111 ${y + 7} L${f(111 - w * 0.8)} ${y + 15} Z`, pal.accent2, 1.3);
  }
  for (const [x, y, r] of [[111, 22, 2.2], [102, 52, 1.8], [120, 52, 1.8], [96, 76, 2], [126, 76, 2], [111, 74, 1.6], [90, 100, 2.2], [132, 100, 2.2], [111, 104, 1.6]] as [number, number, number][]) {
    s += `<circle cx="${x}" cy="${y}" r="${r + 1.6}" fill="${pal.glow}" opacity="0.4"/><circle cx="${x}" cy="${y}" r="${r}" fill="#FFF6D8" stroke="#1A1230" stroke-width="0.8"/>`;
  }
  s += speckles(c, 111, 70, 18, 46, 12);
  s += shine(`M${L(104, 18)} C${L(96, 36)} ${L(90, 60)} ${L(88, 84)}`, 2.2);

  // Tête : grands yeux lumineux, regard profond.
  s += ink(`M${L(80, 108)} C${L(78, 124)} ${L(90, 136)} ${L(111, 136)} C${R(90, 136)} ${R(78, 124)} ${R(80, 108)} C${R(92, 104)} ${L(92, 104)} ${L(80, 108)} Z`, pal.light, 2.4);
  s += shadow(`M${R(80, 108)} C${R(78, 124)} ${R(90, 136)} ${L(111, 136)} L${L(111, 130)} C${R(92, 130)} ${R(86, 120)} ${R(80, 108)} Z`, pal.body, 0.5);
  s += `<circle cx="93" cy="119" r="13" fill="${pal.glow}" opacity="0.45"/><circle cx="129" cy="119" r="13" fill="${pal.glow}" opacity="0.45"/>`;
  s += eye(94, 119, 9, pal.eye, 0.2) + eye(128, 119, 9, pal.eye, -0.2);
  s += line(`M${L(84, 108)} q8 -5 16 -1 M${R(84, 108)} q-8 -5 -16 -1`, 1.6);
  s += line(`M${L(106, 129)} q5 4 10 0`, 1.6);
  s += sparkle(111, 108, 4.5, pal.glow);

  // Couronne d'étoiles au sommet du manteau.
  s += sparkle(111, 6, 7.5, pal.glow);
  s += sparkle(26, 60, 5, pal.glow) + sparkle(196, 44, 4.2, '#FFF6D8') + sparkle(30, 214, 3.6, pal.accent2) + sparkle(192, 218, 3.8, '#FFF6D8');
  return s;
};
