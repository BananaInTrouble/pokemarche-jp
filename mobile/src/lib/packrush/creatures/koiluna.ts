import { aura, eye, ink, line, shadow, shine, sparkle, type Species } from './style.ts';

/** Koiluna : deux carpes célestes (une claire, une sombre) tournant en cercle autour d'une lune (légendaire). */
export const koiluna: Species = (c) => {
  const { pal } = c;
  const f = (v: number) => v.toFixed(1);
  const cx = 111, cy = 118, R0 = 68;
  let s = '';
  s += aura(cx, cy, 104, pal.glow);

  // Remous : cercles d'eau céleste.
  s += `<circle cx="${cx}" cy="${cy}" r="${R0 + 30}" fill="none" stroke="${pal.light}" stroke-width="1.3" opacity="0.45" stroke-dasharray="14 9"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${R0 - 26}" fill="none" stroke="${pal.glow}" stroke-width="1.2" opacity="0.5" stroke-dasharray="6 6"/>`;

  // Lune au centre : disque crème, ombre en croissant, cratères.
  s += `<circle cx="${cx}" cy="${cy}" r="40" fill="${pal.glow}" opacity="0.4" filter="url(#soft)"/>`;
  s += ink(`M${cx - 30} ${cy} a30 30 0 1 0 60 0 a30 30 0 1 0 -60 0 Z`, '#FFF6D8', 2.6);
  s += shadow(`M${cx + 4} ${cy - 29.7} a30 30 0 0 1 0 59.4 a22 30 0 0 0 0 -59.4 Z`, pal.light, 0.9);
  for (const [x, y, r] of [[-10, -12, 6], [-14, 8, 4], [2, 14, 5], [-2, -2, 2.6], [6, -18, 2.4]] as [number, number, number][]) {
    s += `<circle cx="${cx + x}" cy="${cy + y}" r="${r}" fill="${pal.light}" stroke="#1A1230" stroke-width="1" opacity="0.85"/>`;
  }
  s += shine(`M${cx - 22} ${cy - 14} q6 -10 16 -14`, 2.2);

  // Une carpe vue de dessus, nageant en arc autour de la lune.
  const koi = (body: string, fin: string, spot: string, dark: boolean) => {
    const a0 = -0.35, span = 2.85;
    const N = 36;
    const ctr: [number, number][] = [], nrm: [number, number][] = [], tan: [number, number][] = [];
    for (let i = 0; i <= N; i++) {
      const t = i / N, a = a0 - span * t, r = R0 + Math.sin(t * Math.PI * 1.6) * 6;
      ctr.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
    for (let i = 0; i <= N; i++) {
      const [xa, ya] = ctr[Math.max(0, i - 1)], [xb, yb] = ctr[Math.min(N, i + 1)];
      const l = Math.hypot(xb - xa, yb - ya) || 1;
      tan.push([(xb - xa) / l, (yb - ya) / l]);
      nrm.push([-(yb - ya) / l, (xb - xa) / l]);
    }
    const tb = 0.84;
    const wd = (t: number) => {
      if (t < 0.1) return 8 + Math.sqrt(t / 0.1) * 11;
      if (t < 0.32) return 19 + ((t - 0.1) / 0.22) * 3;
      return 22 - Math.pow((t - 0.32) / (tb - 0.32), 1.3) * 18;
    };
    const at = (t: number, off: number) => {
      const i = Math.min(N, Math.round(t * N));
      return [ctr[i][0] + nrm[i][0] * off, ctr[i][1] + nrm[i][1] * off];
    };
    const P = (x: number, y: number) => `${f(x)} ${f(y)}`;
    let o = '';
    const ib = Math.round(tb * N);
    const [bx, by] = ctr[ib], [tx, ty] = tan[ib], [nx, ny] = nrm[ib];
    // Queue voilée (deux lobes ondulants).
    for (const sg of [1, -1]) {
      const p1 = [bx + tx * 20 + nx * sg * 14, by + ty * 20 + ny * sg * 14];
      const tip = [bx + tx * 50 + nx * sg * 32, by + ty * 50 + ny * sg * 32];
      const p2 = [bx + tx * 36 + nx * sg * 6, by + ty * 36 + ny * sg * 6];
      const d = `M${P(bx + nx * sg * 2, by + ny * sg * 2)} Q${P(p1[0] - nx * sg * 2, p1[1] - ny * sg * 2)} ${P(tip[0], tip[1])} Q${P(p2[0] + nx * sg * 6, p2[1] + ny * sg * 6)} ${P(p2[0], p2[1])} Q${P(bx + tx * 22, by + ty * 22)} ${P(bx + tx * 24 - nx * sg * 2, by + ty * 24 - ny * sg * 2)} Q${P(bx + tx * 10, by + ty * 10)} ${P(bx, by)} Z`;
      o += ink(d, fin, 2, ' opacity="0.95"');
      o += line(`M${P(bx + tx * 4, by + ty * 4)} L${P(bx + tx * 30 + nx * sg * 18, by + ty * 30 + ny * sg * 18)} M${P(bx + tx * 6, by + ty * 6)} L${P(bx + tx * 26 + nx * sg * 8, by + ty * 26 + ny * sg * 8)}`, 1, '#1A1230', ' opacity="0.45"');
      o += sparkle(tip[0], tip[1], 3.4, pal.glow);
    }
    // Nageoires pectorales et pelviennes.
    for (const [t, len, w] of [[0.2, 30, 14], [0.55, 18, 8]] as [number, number, number][]) {
      const i = Math.round(t * N), [x0, y0] = ctr[i], [ax, ay] = tan[i], [mx, my] = nrm[i], ww = wd(t);
      for (const sg of [1, -1]) {
        const bx2 = x0 + mx * sg * ww * 0.8, by2 = y0 + my * sg * ww * 0.8;
        const tip = [bx2 + ax * len * 0.8 + mx * sg * len * 0.7, by2 + ay * len * 0.8 + my * sg * len * 0.7];
        const d = `M${P(bx2 - ax * 3, by2 - ay * 3)} Q${P(bx2 + mx * sg * w + ax * 2, by2 + my * sg * w + ay * 2)} ${P(tip[0], tip[1])} Q${P(bx2 + ax * len * 0.7, by2 + ay * len * 0.7)} ${P(bx2 + ax * 8, by2 + ay * 8)} Z`;
        o += ink(d, fin, 1.8);
        o += line(`M${P(bx2, by2)} L${P(tip[0] * 0.8 + bx2 * 0.2, tip[1] * 0.8 + by2 * 0.2)}`, 0.9, '#1A1230', ' opacity="0.45"');
      }
    }
    // Corps.
    const left: string[] = [], right: string[] = [];
    for (let i = 0; i <= ib; i++) {
      const t = i / N, w = wd(t), [x, y] = ctr[i], [mx, my] = nrm[i];
      left.push(P(x + mx * w, y + my * w)); right.push(P(x - mx * w, y - my * w));
    }
    const [hx, hy] = ctr[0], [hax, hay] = tan[0];
    const snout = P(hx - hax * 8, hy - hay * 8);
    o += ink(`M${right[0]} Q${snout} ${left[0]} L${left.join(' L')} L${right.reverse().join(' L')} Z`, body, 2.6);
    // Ombre hachurée côté intérieur.
    const sh1: string[] = [], sh2: string[] = [];
    for (let i = 2; i <= ib; i++) {
      const t = i / N, w = wd(t), [x, y] = ctr[i], [mx, my] = nrm[i];
      sh1.push(P(x - mx * w, y - my * w)); sh2.push(P(x - mx * w * 0.35, y - my * w * 0.35));
    }
    o += shadow(`M${sh1.join(' L')} L${sh2.reverse().join(' L')} Z`, dark ? '#1A1230' : pal.shade, dark ? 0.35 : 0.55);
    // Taches de koi.
    for (const [t, off, rr] of [[0.14, -4, 6], [0.3, 6, 8], [0.47, -5, 6.5], [0.62, 3, 4.5]] as [number, number, number][]) {
      const [x, y] = at(t, off);
      o += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rr)}" ry="${f(rr * 0.75)}" fill="${spot}" stroke="#1A1230" stroke-width="1" transform="rotate(${f((Math.atan2(tan[Math.round(t * N)][1], tan[Math.round(t * N)][0]) * 180) / Math.PI)} ${f(x)} ${f(y)})"/>`;
    }
    // Arête dorsale en pointillés d'étoiles.
    for (let t = 0.24; t < 0.8; t += 0.07) {
      const [x, y] = at(t, 0);
      o += `<circle cx="${f(x)}" cy="${f(y)}" r="1.4" fill="${dark ? pal.glow : '#FFFFFF'}"/>`;
    }
    // Écailles (petits arcs).
    for (const [t, off] of [[0.36, -9], [0.42, 9], [0.5, 2], [0.58, -6], [0.66, 6], [0.72, -2]] as [number, number][]) {
      const i = Math.round(t * N), [x, y] = at(t, off), [ax, ay] = tan[i], [mx, my] = nrm[i];
      o += line(`M${P(x + mx * 3, y + my * 3)} Q${P(x - ax * 3, y - ay * 3)} ${P(x - mx * 3, y - my * 3)}`, 1, dark ? pal.light : pal.shade, ' opacity="0.7"');
    }
    // Reflet.
    const sl: string[] = [];
    for (let i = 5; i < 18; i++) { const [x, y] = at(i / N, wd(i / N) * 0.6); sl.push(P(x, y)); }
    o += line(`M${sl.join(' L')}`, 2, '#FFFFFF', ' opacity="0.8"');
    // Tête : yeux sur les côtés, barbillons.
    for (const sg of [1, -1]) {
      const [ex, ey] = at(0.06, sg * 12);
      o += eye(ex, ey, 5, pal.eye, 0);
      const [wx, wy] = at(0.02, sg * 6);
      o += line(`M${P(wx, wy)} q${f(-hax * 8 + nrm[0][0] * sg * 6)} ${f(-hay * 8 + nrm[0][1] * sg * 6)} ${f(-hax * 14 + nrm[0][0] * sg * 14)} ${f(-hay * 14 + nrm[0][1] * sg * 14)}`, 1.4, dark ? pal.light : '#1A1230');
    }
    const [mx0, my0] = at(0, 0);
    o += `<circle cx="${f(mx0 - hax * 5)}" cy="${f(my0 - hay * 5)}" r="2" fill="#1A1230"/>`;
    // Marque lunaire sur le front.
    const [fx, fy] = at(0.09, 0);
    o += dark ? sparkle(fx, fy, 4.5, pal.glow) : `<path d="M${f(fx - 3)} ${f(fy - 4)} a5 5 0 1 0 6 7 a4 4 0 1 1 -6 -7 Z" fill="${pal.accent}" stroke="#1A1230" stroke-width="1"/>`;
    return o;
  };

  // Carpe claire (en haut) et carpe sombre (rotation de 180°).
  s += koi('#FFF6D8', pal.light, pal.accent, false);
  s += `<g transform="rotate(180 ${cx} ${cy})">` + koi(pal.shade, pal.body, pal.glow, true) + '</g>';

  // Étincelles autour.
  s += sparkle(22, 30, 4.4, pal.glow) + sparkle(204, 206, 4.2, '#FFF6D8') + sparkle(196, 28, 3.4, pal.accent2) + sparkle(26, 210, 3.4, pal.accent2);
  return s;
};
