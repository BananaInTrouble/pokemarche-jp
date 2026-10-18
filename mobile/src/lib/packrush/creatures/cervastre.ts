import { aura, eye, ground, ink, line, shadow, shine, sparkle, speckles, type Species } from './style.ts';

const f = (v: number) => v.toFixed(1);

/** Cervastre → Cervelune → Astrocerf → (éveillé) : cerf dont les bois deviennent des constellations. */
export const cervastre: Species = (c) => {
  const { pal, stage } = c;
  const st = Math.min(stage, 3);
  const gy = 206;
  // Proportions par stade : faon trapu à grosse tête → grand cerf élancé.
  const L = [
    { hx: 80, hy: 98, hr: 37, bx: 136, by: 154, rx: 44, ry: 27, lw: 14, ant: 0 },
    { hx: 72, hy: 98, hr: 29, bx: 132, by: 142, rx: 50, ry: 28, lw: 14, ant: 1 },
    { hx: 80, hy: 106, hr: 25, bx: 140, by: 134, rx: 52, ry: 30, lw: 15, ant: 2 },
    { hx: 80, hy: 100, hr: 25, bx: 140, by: 132, rx: 52, ry: 30, lw: 15, ant: 3 },
  ][st];
  const { hx, hy, hr, bx, by, rx, ry, lw } = L;
  const P = (x: number, y: number) => `${f(x)} ${f(y)}`;
  let s = '';

  if (st >= 3) {
    s += aura(hx + 10, hy - 30, 95, pal.glow);
    s += aura(bx, by, 70, pal.accent2);
  }
  s += ground(bx - 10, gy + 2, rx + 40);

  // --- Bois (derrière la tête) ---
  // Segments [x1,y1,x2,y2,solide?] pour le bois gauche, en coordonnées locales (x vers l'extérieur, y vers le haut).
  const antler = (dir: number) => {
    const ax = hx + dir * hr * 0.42, ay = hy - hr * 0.78;
    const Q = (x: number, y: number) => P(ax + dir * x, ay - y);
    let out = '';
    if (L.ant === 1) {
      const d = `M${Q(0, 0)} C${Q(2, 10)} ${Q(10, 16)} ${Q(12, 30)} M${Q(5, 14)} C${Q(12, 16)} ${Q(18, 20)} ${Q(22, 26)}`;
      out += line(d, 7.5) + line(d, 4, pal.light);
      out += sparkle(ax + dir * 12, ay - 33, 4, pal.glow) + sparkle(ax + dir * 23, ay - 28, 3, pal.glow);
      return out;
    }
    const big = L.ant === 3 ? 1.15 : 1;
    const R = (x: number, y: number) => Q(x * big * 0.8, y * big * 0.8);
    // Merrain solide, bifurqué.
    const solid = `M${R(0, 0)} C${R(4, 10)} ${R(12, 18)} ${R(16, 30)} C${R(20, 40)} ${R(22, 50)} ${R(20, 60)}`
      + ` M${R(14, 26)} C${R(22, 28)} ${R(30, 28)} ${R(38, 34)}`
      + ` M${R(20, 46)} C${R(28, 50)} ${R(34, 56)} ${R(38, 64)}`;
    out += line(solid, 8.5) + line(solid, 5, pal.light);
    out += line(`M${R(3, 6)} C${R(8, 14)} ${R(14, 22)} ${R(17, 34)}`, 1.6, '#FFFFFF', ' opacity="0.7"');
    // Prolongements en constellation : traits lumineux fins reliant des étoiles.
    const nodes: [number, number][] = [[20, 60], [38, 34], [38, 64], [52, 40], [62, 30], [50, 74], [64, 66], [24, 80], [34, 92], [72, 82]];
    const links: [number, number][] = [[1, 3], [3, 4], [2, 5], [5, 6], [0, 7], [7, 8], [5, 8], [6, 9]];
    for (const [a, b] of links) {
      const [x1, y1] = nodes[a], [x2, y2] = nodes[b];
      out += line(`M${R(x1, y1)} L${R(x2, y2)}`, 3.2, pal.ink, ' opacity="0.55"');
      out += line(`M${R(x1, y1)} L${R(x2, y2)}`, 1.6, pal.glow);
    }
    nodes.forEach(([x, y], i) => {
      const tip = i >= 3;
      const X = ax + dir * x * big * 0.8, Y = ay - y * big * 0.8;
      if (tip) out += `<circle cx="${f(X)}" cy="${f(Y)}" r="${f(8 * big)}" fill="${pal.glow}" opacity="0.3" filter="url(#glow)"/>`;
      out += tip ? sparkle(X, Y, (i % 3 === 0 ? 6 : 4.5) * big, i % 2 ? pal.glow : '#FFF6D8') : `<circle cx="${f(X)}" cy="${f(Y)}" r="3" fill="${pal.glow}" stroke="${pal.ink}" stroke-width="1.2"/>`;
    });
    return out;
  };
  if (L.ant >= 1) s += antler(-1) + antler(1);

  // --- Pattes du fond (plus sombres) ---
  // Pattes fines de cerf : cuisse large cachée sous le corps, canon fin, sabot sombre ; `hind` ajoute le jarret.
  const leg = (x: number, top: number, w: number, fill: string, hind: boolean) => {
    const len = gy - top, kw = w * 0.27;
    const kx = hind ? x + w * 0.35 : x, ky = top + len * (hind ? 0.55 : 0.5);
    const d = `M${P(x - w * 0.7, top - 10)} C${P(x - w * 0.75, top + len * 0.2)} ${P(kx - kw - 2, ky - 10)} ${P(kx - kw, ky)}`
      + ` C${P(kx - kw - 1, ky + 10)} ${P(x - kw, gy - 20)} ${P(x - kw, gy - 7)} L${P(x + kw, gy - 7)}`
      + ` C${P(x + kw, gy - 20)} ${P(kx + kw + 1, ky + 8)} ${P(kx + kw + 1, ky)}`
      + ` C${P(kx + kw + 3, ky - 12)} ${P(x + w * 0.75, top + len * 0.2)} ${P(x + w * 0.7, top - 10)} Z`;
    let o = ink(d, fill, 2.2);
    o += ink(`M${P(x - kw - 1, gy - 8)} L${P(x + kw + 1, gy - 8)} L${P(x + kw + 3, gy)} L${P(x - kw - 3, gy)} Z`, pal.ink, 1.8);
    o += line(`M${P(x - kw * 0.6, gy - 10)} q${f(kw * 0.6)} -2 ${f(kw * 1.2)} 0`, 1.1, '#FFF6D8', ' opacity="0.6"');
    return o;
  };
  const legTop = by + ry * 0.2;
  s += leg(bx - rx * 0.4, legTop, lw - 1, pal.shade, false);
  s += leg(bx + rx * 0.7, legTop, lw - 1, pal.shade, true);
  s += leg(bx - rx * 0.64, legTop, lw, pal.body, false);
  s += leg(bx + rx * 0.5, legTop, lw, pal.body, true);
  if (st >= 3) {
    for (const x of [bx - rx * 0.64, bx + rx * 0.5]) s += `<ellipse cx="${f(x)}" cy="${gy - 2}" rx="10" ry="3" fill="${pal.glow}" opacity="0.8"/>`;
  }

  // --- Queue (petite houppe levée) ---
  const tx = bx + rx * 0.92, ty = by - ry * 0.55;
  s += ink(`M${P(tx - 4, ty + 6)} C${P(tx + 4, ty - 8)} ${P(tx + 14, ty - 16)} ${P(tx + 20, ty - 14)} C${P(tx + 22, ty - 4)} ${P(tx + 14, ty + 8)} ${P(tx + 2, ty + 12)} Z`, pal.body, 2.2);
  s += ink(`M${P(tx + 2, ty + 6)} C${P(tx + 8, ty - 2)} ${P(tx + 14, ty - 8)} ${P(tx + 18, ty - 10)} C${P(tx + 18, ty - 2)} ${P(tx + 12, ty + 6)} ${P(tx + 4, ty + 9)} Z`, '#FFF6D8', 1.2);

  // --- Corps ---
  const body = `M${P(bx - rx, by)} C${P(bx - rx * 1.02, by - ry * 1.15)} ${P(bx - rx * 0.35, by - ry * 1.02)} ${P(bx, by - ry * 0.92)}`
    + ` C${P(bx + rx * 0.55, by - ry * 0.85)} ${P(bx + rx * 1.08, by - ry * 1.2)} ${P(bx + rx, by)}`
    + ` C${P(bx + rx * 0.98, by + ry * 1.05)} ${P(bx + rx * 0.4, by + ry)} ${P(bx, by + ry * 0.85)}`
    + ` C${P(bx - rx * 0.4, by + ry * 0.95)} ${P(bx - rx * 0.98, by + ry * 1.05)} ${P(bx - rx, by)} Z`;
  s += ink(body, pal.body, 2.6);
  s += shadow(`M${P(bx - rx * 0.9, by + ry * 0.45)} C${P(bx - rx * 0.4, by + ry * 0.75)} ${P(bx + rx * 0.4, by + ry * 0.6)} ${P(bx + rx * 0.98, by + ry * 0.2)} C${P(bx + rx * 0.98, by + ry * 0.9)} ${P(bx + rx * 0.4, by + ry * 0.95)} ${P(bx, by + ry * 0.82)} C${P(bx - rx * 0.4, by + ry * 0.92)} ${P(bx - rx * 0.85, by + ry * 0.9)} ${P(bx - rx * 0.9, by + ry * 0.45)} Z`, pal.shade, 0.75);
  // Cuisse arrière.
  s += line(`M${P(bx + rx * 0.35, by + ry * 0.7)} C${P(bx + rx * 0.3, by - ry * 0.2)} ${P(bx + rx * 0.62, by - ry * 0.6)} ${P(bx + rx * 0.9, by - ry * 0.55)}`, 1.6);
  s += shine(`M${P(bx - rx * 0.4, by - ry * 0.7)} q14 -6 30 -4`, 2.2);

  // Taches d'étoiles sur le dos (faon) / constellation dessinée sur le flanc (adulte).
  if (st <= 1) {
    const spots: [number, number, number][] = [[-0.55, -0.45, 3.2], [-0.25, -0.6, 2.6], [0.05, -0.5, 3.4], [0.35, -0.6, 2.6], [0.6, -0.4, 3], [-0.1, -0.15, 2.4], [0.25, -0.18, 2.8]];
    for (const [u, v, r0] of spots) s += `<circle cx="${f(bx + u * rx)}" cy="${f(by + v * ry)}" r="${r0}" fill="#FFF6D8" stroke="${pal.ink}" stroke-width="0.9"/>`;
    s += sparkle(bx - rx * 0.1, by - ry * 0.4, 4.5, pal.glow);
  } else {
    const cs: [number, number][] = [[-0.5, -0.3], [-0.15, -0.5], [0.2, -0.25], [0.5, -0.45], [0.15, 0.2]];
    s += line(cs.slice(0, 4).map(([u, v], i) => `${i ? 'L' : 'M'}${P(bx + u * rx, by + v * ry)}`).join(' ') + ` M${P(bx + 0.2 * rx, by - 0.25 * ry)} L${P(bx + 0.15 * rx, by + 0.2 * ry)}`, 1.4, pal.glow, st >= 3 ? ' opacity="1"' : ' opacity="0.85"');
    cs.forEach(([u, v], i) => { s += sparkle(bx + u * rx, by + v * ry, i === 1 ? 4.5 : 3.2, '#FFF6D8'); });
    s += speckles(c, bx + rx * 0.2, by - ry * 0.1, rx * 0.6, ry * 0.5, 6 + st * 2);
  }

  // --- Cou ---
  const nb1 = P(bx - rx * 0.92, by - ry * 0.1), nb2 = P(bx - rx * 0.45, by - ry * 0.85);
  const nt1 = P(hx - hr * 0.45, hy + hr * 0.6), nt2 = P(hx + hr * 0.45, hy + hr * 0.3);
  const neck = `M${nb1} C${P(bx - rx * 1.05, by - ry * 0.8)} ${P(hx - hr * 0.5, hy + hr * 1.1)} ${nt1} L${nt2} C${P(hx + hr * 0.6, hy + hr * 0.8)} ${P(bx - rx * 0.55, by - ry * 1.3)} ${nb2} Z`;
  s += `<path d="${neck}" fill="${pal.body}"/>`;
  s += line(`M${nb1} C${P(bx - rx * 1.05, by - ry * 0.8)} ${P(hx - hr * 0.5, hy + hr * 1.1)} ${nt1}`, 2.6);
  s += line(`M${nt2} C${P(hx + hr * 0.6, hy + hr * 0.8)} ${P(bx - rx * 0.55, by - ry * 1.3)} ${nb2}`, 2.6);
  // Collerette de poils clairs sur le poitrail.
  if (st >= 1) {
    const jx = bx - rx * 0.9, jy = by - ry * 0.35, z = st >= 2 ? 1.15 : 1;
    const J = (x: number, y: number) => P(jx + x * z, jy + y * z);
    s += ink(`M${J(-10, -26)} C${J(-16, -14)} ${J(-16, -4)} ${J(-12, 4)} L${J(-6, 2)} L${J(-4, 12)} L${J(3, 6)} L${J(8, 14)} L${J(11, 4)} L${J(17, 6)} C${J(16, -8)} ${J(8, -20)} ${J(-10, -26)} Z`, pal.belly, 1.7);
    s += line(`M${J(-6, -14)} q3 4 1 9 M${J(4, -10)} q3 4 1 9`, 1.1);
  }

  // --- Oreilles ---
  const ear = (dir: number) => {
    const el = st === 0 ? 1.55 : 1.35;
    const b1 = P(hx + dir * hr * 0.55, hy - hr * 0.7), b2 = P(hx + dir * hr * 0.85, hy - hr * 0.2);
    const tip = P(hx + dir * hr * (0.55 + el), hy - hr * 0.62);
    const o = `M${b1} C${P(hx + dir * hr * 1.1, hy - hr * 1.15)} ${P(hx + dir * hr * (0.3 + el), hy - hr * 0.95)} ${tip} C${P(hx + dir * hr * (0.25 + el), hy - hr * 0.2)} ${P(hx + dir * hr * 1.1, hy - hr * 0.05)} ${b2} Z`;
    const i = `M${P(hx + dir * hr * 0.8, hy - hr * 0.6)} C${P(hx + dir * hr * 1.15, hy - hr * 0.88)} ${P(hx + dir * hr * (0.2 + el), hy - hr * 0.78)} ${P(hx + dir * hr * (0.4 + el), hy - hr * 0.62)} C${P(hx + dir * hr * (0.2 + el), hy - hr * 0.35)} ${P(hx + dir * hr * 1.1, hy - hr * 0.3)} ${P(hx + dir * hr * 0.85, hy - hr * 0.35)} Z`;
    return ink(o, pal.body, 2.4) + ink(i, pal.accent, 1.3);
  };
  s += ear(-1) + ear(1);

  // --- Tête (face : front rond, museau plus étroit) ---
  const head = `M${P(hx - hr, hy - hr * 0.1)} C${P(hx - hr * 1.02, hy - hr * 1.05)} ${P(hx + hr * 1.02, hy - hr * 1.05)} ${P(hx + hr, hy - hr * 0.1)}`
    + ` C${P(hx + hr * 0.98, hy + hr * 0.45)} ${P(hx + hr * 0.55, hy + hr * 0.7)} ${P(hx + hr * 0.45, hy + hr * 1.0)}`
    + ` C${P(hx + hr * 0.35, hy + hr * 1.3)} ${P(hx - hr * 0.35, hy + hr * 1.3)} ${P(hx - hr * 0.45, hy + hr * 1.0)}`
    + ` C${P(hx - hr * 0.55, hy + hr * 0.7)} ${P(hx - hr * 0.98, hy + hr * 0.45)} ${P(hx - hr, hy - hr * 0.1)} Z`;
  s += ink(head, pal.body, 2.6);
  s += shadow(`M${P(hx + hr * 0.55, hy - hr * 0.7)} C${P(hx + hr * 1.0, hy - hr * 0.5)} ${P(hx + hr * 1.02, hy + hr * 0.3)} ${P(hx + hr * 0.5, hy + hr * 0.85)} C${P(hx + hr * 0.75, hy + hr * 0.2)} ${P(hx + hr * 0.8, hy - hr * 0.3)} ${P(hx + hr * 0.55, hy - hr * 0.7)} Z`, pal.shade, 0.6);
  // Museau clair.
  s += ink(`M${P(hx - hr * 0.42, hy + hr * 0.62)} C${P(hx - hr * 0.5, hy + hr * 1.2)} ${P(hx + hr * 0.5, hy + hr * 1.2)} ${P(hx + hr * 0.42, hy + hr * 0.62)} C${P(hx + hr * 0.2, hy + hr * 0.45)} ${P(hx - hr * 0.2, hy + hr * 0.45)} ${P(hx - hr * 0.42, hy + hr * 0.62)} Z`, pal.belly, 1.5);
  s += ink(`M${P(hx - hr * 0.17, hy + hr * 0.72)} C${P(hx - hr * 0.17, hy + hr * 0.62)} ${P(hx + hr * 0.17, hy + hr * 0.62)} ${P(hx + hr * 0.17, hy + hr * 0.72)} C${P(hx + hr * 0.12, hy + hr * 0.86)} ${P(hx - hr * 0.12, hy + hr * 0.86)} ${P(hx - hr * 0.17, hy + hr * 0.72)} Z`, pal.ink, 1.2);
  s += `<circle cx="${f(hx - hr * 0.06)}" cy="${f(hy + hr * 0.68)}" r="1.4" fill="#fff"/>`;
  s += line(`M${P(hx, hy + hr * 0.86)} l0 ${f(hr * 0.1)} M${P(hx - hr * 0.14, hy + hr * 1.0)} q${f(hr * 0.14)} ${f(hr * 0.1)} ${f(hr * 0.28)} 0`, 1.4);
  s += shine(`M${P(hx - hr * 0.7, hy - hr * 0.45)} q${f(hr * 0.2)} ${f(-hr * 0.3)} ${f(hr * 0.5)} ${f(-hr * 0.35)}`, 2.2);

  // Marque du front.
  if (st <= 1) s += sparkle(hx, hy - hr * 0.55, st === 0 ? 7 : 6, pal.glow);
  else {
    const fy = hy - hr * 0.5;
    s += line(`M${P(hx, fy - 9)} L${P(hx - 6, fy)} L${P(hx, fy + 7)} L${P(hx + 6, fy)} Z`, 1.3, pal.glow);
    s += sparkle(hx, fy - 9, 3.4, '#FFF6D8') + sparkle(hx, fy + 7, 2.6, '#FFF6D8');
    s += `<circle cx="${f(hx - 6)}" cy="${f(fy)}" r="1.8" fill="#FFF6D8"/><circle cx="${f(hx + 6)}" cy="${f(fy)}" r="1.8" fill="#FFF6D8"/>`;
  }

  // Yeux (cils pour le faon, regard calme et noble chez l'adulte).
  const er = hr * [0.27, 0.24, 0.22, 0.22][st];
  const ey = hy + hr * 0.08, ex = hr * 0.44;
  s += eye(hx - ex, ey, er, pal.eye, 0.15) + eye(hx + ex, ey, er, pal.eye, 0.15);
  for (const d of [-1, 1]) s += line(`M${P(hx + d * (ex + er * 0.7), ey - er * 0.7)} l${f(d * 5)} -4 M${P(hx + d * (ex + er * 0.95), ey - er * 0.2)} l${f(d * 5)} -1`, 1.5);
  if (st >= 2) for (const d of [-1, 1]) s += line(`M${P(hx + d * (ex - er), ey - er * 1.25)} q${f(d * er)} ${f(-er * 0.45)} ${f(d * er * 2)} 0`, 1.6);
  if (st <= 1) s += `<ellipse cx="${f(hx - hr * 0.7)}" cy="${f(hy + hr * 0.5)}" rx="5" ry="3" fill="#FF8FB1" opacity="0.55"/><ellipse cx="${f(hx + hr * 0.7)}" cy="${f(hy + hr * 0.5)}" rx="5" ry="3" fill="#FF8FB1" opacity="0.55"/>`;

  // Étincelles d'ambiance.
  if (st >= 3) {
    for (let i = 0; i < 7; i++) s += sparkle(20 + c.r() * 182, 20 + c.r() * 120, 2 + c.r() * 3, i % 2 ? pal.glow : '#FFF6D8');
    // Croissant de lune suspendu entre les bois.
    const my = hy - hr * 2.3;
    s += `<circle cx="${f(hx)}" cy="${f(my)}" r="16" fill="${pal.glow}" opacity="0.35" filter="url(#glow)"/>`;
    s += ink(`M${P(hx - 4, my - 11)} a11 11 0 1 0 9 19 a9 9 0 1 1 -9 -19 Z`, pal.glow, 1.6);
    s += line(`M${P(hx, my + 13)} L${P(hx, hy - hr * 1.15)}`, 1, pal.glow, ' opacity="0.6" stroke-dasharray="2 3"');
    return `<g transform="translate(111 206) scale(1.1) translate(-111 -200)">${s}</g>`;
  } else if (st === 0) {
    s += sparkle(hx + hr * 1.5, hy - hr * 1.2, 4, pal.glow) + sparkle(bx + rx * 0.9, by - ry * 1.6, 3, '#FFF6D8');
  }
  return s;
};
