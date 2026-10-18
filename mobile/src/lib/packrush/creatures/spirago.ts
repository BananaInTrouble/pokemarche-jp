import { aura, eye, ground, ink, line, shadow, shine, sparkle, speckles, type Species } from './style.ts';

const f = (v: number) => v.toFixed(1);

/** Spirago → Volutoile → Galactemple : escargot dont la coquille tourbillonne jusqu'à devenir une galaxie. */
export const spirago: Species = (c) => {
  const { pal, stage } = c;
  const st = Math.min(stage, 2);
  const gy = 206;
  const L = [
    { sx: 142, sy: 152, R: 44, hx: 70, hy: 130, hr: 38, fh: 26, x0: 34, x1: 206 },
    { sx: 138, sy: 134, R: 56, hx: 60, hy: 124, hr: 31, fh: 28, x0: 26, x1: 210 },
    { sx: 136, sy: 130, R: 62, hx: 54, hy: 120, hr: 31, fh: 30, x0: 18, x1: 214 },
  ][st];
  const { sx, sy, R, hx, hy, hr, fh, x0, x1 } = L;
  const P = (x: number, y: number) => `${f(x)} ${f(y)}`;
  let s = '';

  if (st >= 2) s += aura(sx, sy, R + 30, pal.accent2);
  s += ground(118, gy + 2, 96);

  // --- Orbite (moitié arrière) ---
  const orb = st >= 2 ? { rx: R + 14, ry: 17, rot: 26 } : null;
  const orbit = (front: boolean) => {
    if (!orb) return '';
    const a0 = front ? 0 : Math.PI, a1 = a0 + Math.PI;
    const pt = (a: number) => {
      const x = Math.cos(a) * orb.rx, y = Math.sin(a) * orb.ry, r = (orb.rot * Math.PI) / 180;
      return [sx + 10 + x * Math.cos(r) - y * Math.sin(r), sy + 8 + x * Math.sin(r) + y * Math.cos(r)];
    };
    let d = '';
    for (let i = 0; i <= 24; i++) { const [x, y] = pt(a0 + ((a1 - a0) * i) / 24); d += `${i ? 'L' : 'M'}${P(x, y)} `; }
    let o = line(d, 3.6, pal.ink, ' opacity="0.6"') + line(d, 1.8, pal.glow);
    const bodies = front ? [[0.5, 6, pal.accent], [2.2, 3.5, '#FFF6D8']] : [[3.9, 4.5, pal.glow], [5.3, 3, '#FFF6D8']];
    for (const [a, r0, col] of bodies as [number, number, string][]) {
      const [x, y] = pt(a);
      if (r0 >= 5) {
        o += ink(`M${P(x - r0, y)} a${r0} ${r0} 0 1 0 ${f(r0 * 2)} 0 a${r0} ${r0} 0 1 0 ${f(-r0 * 2)} 0 Z`, col as string, 1.6);
        o += line(`M${P(x - r0 * 1.7, y + 1)} q${f(r0 * 1.7)} ${f(r0 * 0.9)} ${f(r0 * 3.4)} -2`, 1.4);
        o += `<circle cx="${f(x - r0 * 0.35)}" cy="${f(y - r0 * 0.35)}" r="${f(r0 * 0.3)}" fill="#fff"/>`;
      } else o += sparkle(x, y, r0 + 1, col as string);
    }
    return o;
  };
  s += orbit(false);

  // --- Pied (corps de limace) ---
  const ft = gy - fh;
  const foot = `M${P(x1, gy - 3)} C${P(x1 - 14, gy - 8)} ${P(x1 - 30, ft + 2)} ${P(sx + R * 0.4, ft)}`
    + ` L${P(hx + hr * 0.6, ft)} C${P(hx - hr * 0.2, ft - 2)} ${P(x0, ft + 4)} ${P(x0, gy - 8)}`
    + ` C${P(x0, gy + 1)} ${P(x0 + 8, gy + 1)} ${P(x0 + 16, gy + 1)} L${P(x1 - 20, gy + 1)} C${P(x1 - 10, gy)} ${P(x1 - 2, gy - 1)} ${P(x1, gy - 3)} Z`;
  s += ink(foot, pal.body, 2.6);
  s += shadow(`M${P(x0 + 6, gy - 7)} C${P(x0 + 40, gy - 3)} ${P(x1 - 60, gy - 4)} ${P(x1 - 6, gy - 4)} L${P(x1 - 20, gy)} L${P(x0 + 16, gy)} Z`, pal.shade, 0.7);
  // Ourlet clair et petites ondulations.
  for (let x = x0 + 18; x < x1 - 24; x += 14) s += line(`M${P(x, gy - 2)} q4 -4 8 0`, 1.2, pal.ink, ' opacity="0.7"');
  s += speckles(c, (x0 + x1) / 2 + 20, ft + fh * 0.45, (x1 - x0) * 0.4, fh * 0.25, 6 + st * 3);

  // --- Cou (montant vers la tête) ---
  const nw = hr * 0.62;
  s += `<path d="M${P(hx - nw, ft + 6)} C${P(hx - nw - 2, hy + hr * 0.6)} ${P(hx - nw, hy + hr * 0.4)} ${P(hx - nw * 0.6, hy)} L${P(hx + nw * 0.8, hy)} C${P(hx + nw * 1.2, hy + hr * 0.6)} ${P(hx + nw * 1.6, ft - 4)} ${P(hx + nw * 2.2, ft + 6)} Z" fill="${pal.body}"/>`;
  s += line(`M${P(hx - nw, ft + 4)} C${P(hx - nw - 2, hy + hr * 0.6)} ${P(hx - nw, hy + hr * 0.4)} ${P(hx - nw * 0.6, hy)}`, 2.6);
  s += line(`M${P(hx + nw * 0.8, hy + hr * 0.3)} C${P(hx + nw * 1.2, hy + hr * 0.7)} ${P(hx + nw * 1.5, ft - 2)} ${P(hx + nw * 2.4, ft)}`, 2.2);
  s += line(`M${P(hx - nw * 0.3, ft - 4)} C${P(hx - nw * 0.4, hy + hr * 1.3)} ${P(hx - nw * 0.2, hy + hr)} ${P(hx, hy + hr * 0.9)}`, 1.4, pal.ink, ' opacity="0.5"');

  // --- Coquille-galaxie ---
  s += `<circle cx="${f(sx)}" cy="${f(sy)}" r="${f(R + 7)}" fill="${pal.glow}" opacity="${st >= 1 ? 0.35 : 0.2}" filter="url(#glow)"/>`;
  // Lèvre de la coquille posée sur le pied.
  s += ink(`M${P(sx - R * 0.95, sy + R * 0.45)} C${P(sx - R * 0.6, ft + 10)} ${P(sx + R * 0.6, ft + 10)} ${P(sx + R * 0.95, sy + R * 0.45)} Z`, pal.shade, 2.2);
  s += ink(`M${P(sx - R, sy)} a${R} ${R} 0 1 0 ${f(2 * R)} 0 a${R} ${R} 0 1 0 ${f(-2 * R)} 0 Z`, pal.shade, 2.8);
  // Voile intérieur plus clair (moitié haute).
  s += `<path d="M${P(sx - R * 0.9, sy - R * 0.1)} C${P(sx - R * 0.8, sy - R * 1.0)} ${P(sx + R * 0.8, sy - R * 1.0)} ${P(sx + R * 0.92, sy - R * 0.05)} C${P(sx + R * 0.4, sy - R * 0.35)} ${P(sx - R * 0.4, sy - R * 0.35)} ${P(sx - R * 0.9, sy - R * 0.1)} Z" fill="${pal.body}" opacity="0.55"/>`;
  // Bras de galaxie : spirales logarithmiques, de plus en plus nombreux.
  const arms = [1, 2, 3][st];
  const spin = (phase: number, r0: number, r1: number, turns: number) => {
    let d = '';
    const N = 48;
    for (let i = 0; i <= N; i++) {
      const t = i / N, a = phase + t * turns * Math.PI * 2, r = r0 * Math.pow(r1 / r0, t);
      d += `${i ? 'L' : 'M'}${P(sx + Math.cos(a) * r, sy + Math.sin(a) * r * 0.96)} `;
    }
    return d;
  };
  for (let k = 0; k < arms; k++) {
    const ph = (k * Math.PI * 2) / arms + 0.4;
    const d = spin(ph, R * 0.08, R * 0.9, 1.15);
    s += line(d, R * 0.22, k % 2 ? pal.accent2 : pal.accent, ' opacity="0.55"');
    s += line(d, R * 0.08, pal.light, ' opacity="0.8"');
  }
  // Sillon d'encre de la volute (la vraie coquille).
  s += line(spin(-0.6, R * 0.06, R * 0.98, 2.2), 2.2);
  s += shadow(`M${P(sx - R * 0.2, sy + R * 0.98)} C${P(sx + R * 0.6, sy + R * 0.92)} ${P(sx + R * 1.0, sy + R * 0.4)} ${P(sx + R * 0.98, sy - R * 0.1)} C${P(sx + R * 0.8, sy + R * 0.5)} ${P(sx + R * 0.4, sy + R * 0.8)} ${P(sx - R * 0.2, sy + R * 0.98)} Z`, pal.ink, 0.35);
  s += speckles(c, sx, sy, R * 0.85, R * 0.85, 14 + st * 10);
  // Noyau lumineux.
  s += `<circle cx="${f(sx)}" cy="${f(sy)}" r="${f(R * 0.2)}" fill="${pal.glow}" opacity="0.6" filter="url(#glow)"/>`;
  s += sparkle(sx, sy, R * 0.16, '#FFF6D8');
  for (let i = 0; i < 2 + st * 2; i++) {
    const a = c.r() * Math.PI * 2, d = R * (0.35 + c.r() * 0.45);
    s += sparkle(sx + Math.cos(a) * d, sy + Math.sin(a) * d, 2.5 + c.r() * 2, i % 2 ? pal.glow : '#FFF6D8', false);
  }
  s += shine(`M${P(sx - R * 0.72, sy - R * 0.38)} q${f(R * 0.18)} ${f(-R * 0.36)} ${f(R * 0.52)} ${f(-R * 0.5)}`, 2.6);

  // --- Petit temple au sommet de la coquille (adulte) ---
  if (st >= 2) {
    const ty = sy - R + 4, tw = 24;
    s += '<g transform="translate(' + f(sx) + ' ' + f(ty) + ') scale(0.88) translate(' + f(-sx) + ' ' + f(-ty) + ')">';
    s += ink(`M${P(sx - tw, ty)} L${P(sx + tw, ty)} L${P(sx + tw - 4, ty - 6)} L${P(sx - tw + 4, ty - 6)} Z`, pal.light, 2);
    for (const u of [-0.7, -0.23, 0.23, 0.7]) {
      const x = sx + u * (tw - 6);
      s += ink(`M${P(x - 3, ty - 6)} L${P(x - 3, ty - 26)} L${P(x + 3, ty - 26)} L${P(x + 3, ty - 6)} Z`, '#FFF6D8', 1.6);
    }
    s += `<path d="M${P(sx - tw + 8, ty - 7)} L${P(sx + tw - 8, ty - 7)} L${P(sx + tw - 8, ty - 25)} L${P(sx - tw + 8, ty - 25)} Z" fill="${pal.glow}" opacity="0.45"/>`;
    s += ink(`M${P(sx - tw + 2, ty - 26)} L${P(sx + tw - 2, ty - 26)} L${P(sx + tw - 5, ty - 31)} L${P(sx - tw + 5, ty - 31)} Z`, pal.light, 1.8);
    s += ink(`M${P(sx - tw + 6, ty - 31)} C${P(sx - tw + 8, ty - 48)} ${P(sx + tw - 8, ty - 48)} ${P(sx + tw - 6, ty - 31)} Z`, pal.accent, 2);
    s += shine(`M${P(sx - 10, ty - 37)} q5 -6 11 -6`, 1.8);
    s += line(`M${P(sx, ty - 44)} l0 -8`, 2);
    s += `<circle cx="${f(sx)}" cy="${f(ty - 58)}" r="9" fill="${pal.glow}" opacity="0.5" filter="url(#glow)"/>`;
    s += sparkle(sx, ty - 58, 7, pal.glow);
    s += '</g>';
  }
  s += orbit(true);

  // --- Antennes à pointes d'étoile ---
  const ant = (dir: number, len: number, lean: number, tipR: number) => {
    const bx = hx + dir * hr * 0.35, by = hy - hr * 0.75;
    const tx = bx + dir * lean, ty = by - len;
    let o = line(`M${P(bx, by)} C${P(bx + dir * lean * 0.1, by - len * 0.5)} ${P(tx - dir * lean * 0.3, ty + len * 0.2)} ${P(tx, ty)}`, 6.5);
    o += line(`M${P(bx, by)} C${P(bx + dir * lean * 0.1, by - len * 0.5)} ${P(tx - dir * lean * 0.3, ty + len * 0.2)} ${P(tx, ty)}`, 3.4, pal.body);
    o += `<circle cx="${f(tx)}" cy="${f(ty)}" r="${f(tipR * 1.8)}" fill="${pal.glow}" opacity="0.4" filter="url(#glow)"/>`;
    o += ink(`M${P(tx - tipR, ty)} a${tipR} ${tipR} 0 1 0 ${f(tipR * 2)} 0 a${tipR} ${tipR} 0 1 0 ${f(-tipR * 2)} 0 Z`, pal.glow, 1.6);
    o += sparkle(tx, ty, tipR * 0.75, '#FFF6D8', false);
    return o;
  };
  const al = [24, 34, 40][st];
  s += ant(-1, al, [8, 12, 14][st], [6, 6, 6.5][st]) + ant(1, al * 0.9, [10, 16, 20][st], [5.5, 5.5, 6][st]);

  // --- Tête ---
  const head = `M${P(hx - hr, hy + hr * 0.1)} C${P(hx - hr * 1.02, hy - hr * 0.95)} ${P(hx + hr * 1.02, hy - hr * 0.95)} ${P(hx + hr, hy + hr * 0.1)} C${P(hx + hr * 0.98, hy + hr * 0.75)} ${P(hx + hr * 0.5, hy + hr * 0.9)} ${P(hx, hy + hr * 0.9)} C${P(hx - hr * 0.5, hy + hr * 0.9)} ${P(hx - hr * 0.98, hy + hr * 0.75)} ${P(hx - hr, hy + hr * 0.1)} Z`;
  s += ink(head, pal.body, 2.6);
  s += shadow(`M${P(hx + hr * 0.6, hy - hr * 0.6)} C${P(hx + hr * 1.05, hy - hr * 0.2)} ${P(hx + hr, hy + hr * 0.6)} ${P(hx + hr * 0.3, hy + hr * 0.88)} C${P(hx + hr * 0.75, hy + hr * 0.4)} ${P(hx + hr * 0.82, hy - hr * 0.1)} ${P(hx + hr * 0.6, hy - hr * 0.6)} Z`, pal.shade, 0.6);
  s += shine(`M${P(hx - hr * 0.7, hy - hr * 0.35)} q${f(hr * 0.15)} ${f(-hr * 0.3)} ${f(hr * 0.45)} ${f(-hr * 0.4)}`, 2.4);
  // Tentacules inférieurs (adulte).
  if (st >= 2) for (const d of [-1, 1]) s += ink(`M${P(hx + d * hr * 0.45, hy + hr * 0.75)} C${P(hx + d * hr * 0.6, hy + hr * 1.05)} ${P(hx + d * hr * 0.9, hy + hr * 1.05)} ${P(hx + d * hr * 0.95, hy + hr * 0.95)} C${P(hx + d * hr * 0.85, hy + hr * 0.8)} ${P(hx + d * hr * 0.7, hy + hr * 0.7)} ${P(hx + d * hr * 0.6, hy + hr * 0.62)} Z`, pal.body, 1.6);
  // Visage.
  const er = hr * [0.3, 0.27, 0.25][st];
  const ey = hy + hr * 0.05, ex = hr * 0.4;
  s += eye(hx - ex, ey, er, pal.eye, -0.3) + eye(hx + ex, ey, er, pal.eye, -0.3);
  if (st >= 1) for (const d of [-1, 1]) s += line(`M${P(hx + d * (ex - er * 0.8), ey - er * 1.35)} q${f(d * er * 0.8)} ${f(-er * 0.35)} ${f(d * er * 1.6)} 0`, 1.6);
  s += line(`M${P(hx - hr * 0.16, hy + hr * 0.5)} q${f(hr * 0.16)} ${f(hr * 0.16)} ${f(hr * 0.32)} 0`, 1.8);
  s += `<ellipse cx="${f(hx - hr * 0.72)}" cy="${f(hy + hr * 0.42)}" rx="${f(hr * 0.15)}" ry="${f(hr * 0.09)}" fill="#FF8FB1" opacity="0.6"/><ellipse cx="${f(hx + hr * 0.72)}" cy="${f(hy + hr * 0.42)}" rx="${f(hr * 0.15)}" ry="${f(hr * 0.09)}" fill="#FF8FB1" opacity="0.6"/>`;
  // Marque du front.
  s += sparkle(hx, hy - hr * 0.55, hr * 0.14, pal.glow);

  if (st === 0) s += sparkle(sx + R * 1.1, sy - R * 0.9, 4, pal.glow) + sparkle(hx - hr * 1.1, hy - hr * 1.2, 3, '#FFF6D8');
  return s;
};
