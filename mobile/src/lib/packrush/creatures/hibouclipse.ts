import { aura, ground, ink, line, shadow, shine, sparkle, speckles, type Palette, type Species } from './style.ts';

/**
 * Hibouclipse → Éclipsule → Grand-Umbrel → Umbrelion : chouette aux yeux d'éclipse. Boule de plumes, jeune chouette,
 * grand duc constellé aux aigrettes en croissant, puis éveillé ailes déployées devant un halo d'éclipse.
 */

const f = (v: number) => v.toFixed(1);

function fluff(cx: number, cy: number, rx: number, ry: number, n: number, amp: number, a0 = -Math.PI / 2): string {
  let d = '';
  for (let i = 0; i <= n; i++) {
    const a = a0 + (i / n) * Math.PI * 2;
    const x = cx + Math.cos(a) * rx, y = cy + Math.sin(a) * ry;
    if (i === 0) { d += `M${f(x)} ${f(y)}`; continue; }
    const am = a - Math.PI / n;
    d += ` Q${f(cx + Math.cos(am) * rx * (1 + amp))} ${f(cy + Math.sin(am) * ry * (1 + amp))} ${f(x)} ${f(y)}`;
  }
  return d + 'Z';
}

/** Œil d'éclipse : couronne lumineuse que masque un disque sombre décalé. */
function eclipseEye(x: number, y: number, r: number, pal: Palette, look = 0): string {
  const ix = x + look * r * 0.15;
  return `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="#FFF6D8" stroke="#1A1230" stroke-width="2.2"/>`
    + `<circle cx="${f(ix)}" cy="${f(y)}" r="${f(r * 0.76)}" fill="${pal.glow}" stroke="${pal.eye}" stroke-width="${f(r * 0.12)}"/>`
    + `<circle cx="${f(ix + r * 0.12)}" cy="${f(y + r * 0.06)}" r="${f(r * 0.58)}" fill="#1A1230"/>`
    + `<circle cx="${f(ix - r * 0.18)}" cy="${f(y - r * 0.3)}" r="${f(r * 0.17)}" fill="#fff"/>`
    + `<circle cx="${f(ix + r * 0.3)}" cy="${f(y + r * 0.28)}" r="${f(r * 0.08)}" fill="#fff"/>`;
}

const crescent = (x: number, y: number, r: number, fill: string, w = 1.2) =>
  ink(`M${f(x - r * 0.8)} ${f(y - r * 0.1)} a${f(r)} ${f(r)} 0 1 0 ${f(r * 1.6)} 0 a${f(r * 0.82)} ${f(r * 0.82)} 0 1 1 ${f(-r * 1.6)} 0 Z`, fill, w);

/** Rangées de petites écailles de plumes. */
function scallops(x0: number, y0: number, cols: number, rows: number, w: number, h: number): string {
  let d = '';
  for (let j = 0; j < rows; j++) {
    const off = j % 2 ? w / 2 : 0;
    for (let i = 0; i < cols - (j % 2); i++) d += `M${f(x0 + off + i * w)} ${f(y0 + j * h)} q${f(w / 2)} ${f(h * 0.9)} ${f(w)} 0 `;
  }
  return line(d, 1.3, '#1A1230', ' opacity="0.7"');
}

/** Chevrons du plastron. */
function chevrons(cx: number, y0: number, rows: number, w: number, h: number, shrink = 0.12): string {
  let d = '';
  for (let j = 0; j < rows; j++) {
    const ww = w * (1 - Math.abs(j - rows / 2) * shrink);
    for (let i = -1; i <= 1; i++) {
      const x = cx + i * ww * 0.9 + (j % 2 ? ww * 0.45 : 0) * (i === 1 ? -1 : 1) * 0;
      d += `M${f(x - ww * 0.3)} ${f(y0 + j * h)} l${f(ww * 0.3)} ${f(h * 0.45)} l${f(ww * 0.3)} ${f(-h * 0.45)} `;
    }
  }
  return line(d, 1.4, '#1A1230', ' opacity="0.65"');
}

/** Serres. */
function talons(cx: number, y: number, size: number, pal: Palette): string {
  let s = '';
  for (const dir of [-1, 1]) {
    const x = cx + dir * size * 1.4;
    s += ink(`M${f(x - size)} ${f(y - size * 0.6)} q${f(size * 0.2)} ${f(size * 0.9)} ${f(size * 0.5)} ${f(size * 0.7)} q${f(size * 0.25)} ${f(size * 0.35)} ${f(size * 0.5)} 0 q${f(size * 0.25)} ${f(size * 0.35)} ${f(size * 0.5)} 0 q${f(size * 0.4)} ${f(size * 0.2)} ${f(size * 0.5)} ${f(-size * 0.7)} Z`, pal.glow, 1.8);
  }
  return s;
}

export const hibouclipse: Species = (c) => {
  const { pal } = c;
  const stage = Math.min(3, c.stage);
  const cx = 111, gy = 206;
  let s = '';

  if (stage === 0) {
    const by = 138;
    s += ground(cx, gy + 2, 60);
    // Petites aigrettes.
    for (const dir of [-1, 1]) s += ink(`M${cx + dir * 22} ${by - 56} Q${cx + dir * 34} ${by - 80} ${cx + dir * 46} ${by - 82} Q${cx + dir * 44} ${by - 62} ${cx + dir * 40} ${by - 50} Z`, pal.shade, 2);
    s += talons(cx, gy - 4, 9, pal);
    s += ink(fluff(cx, by, 66, 62, 20, 0.08), pal.body, 2.8);
    s += shadow(`M${cx + 30} ${by - 52} C${cx + 70} ${by - 30} ${cx + 72} ${by + 30} ${cx + 30} ${by + 58} C${cx + 52} ${by + 26} ${cx + 52} ${by - 24} ${cx + 30} ${by - 52} Z`, pal.shade, 0.55);
    // Ailerons.
    for (const dir of [-1, 1]) {
      s += ink(`M${cx + dir * 54} ${by - 6} C${cx + dir * 80} ${by + 2} ${cx + dir * 80} ${by + 34} ${cx + dir * 58} ${by + 42} C${cx + dir * 52} ${by + 26} ${cx + dir * 50} ${by + 8} ${cx + dir * 54} ${by - 6} Z`, pal.shade, 2);
      s += line(`M${cx + dir * 62} ${by + 10} q${dir * 6} 6 ${dir * 8} 14 M${cx + dir * 58} ${by + 18} q${dir * 4} 6 ${dir * 5} 14`, 1.2, '#1A1230', ' opacity="0.6"');
    }
    s += ink(fluff(cx, by + 40, 30, 18, 10, 0.18), pal.light, 1.8);
    s += chevrons(cx, by + 30, 2, 14, 10, 0);
    // Disque facial en cœur.
    s += ink(`M${cx} ${by - 30} C${cx - 14} ${by - 52} ${cx - 56} ${by - 46} ${cx - 54} ${by - 12} C${cx - 52} ${by + 18} ${cx - 16} ${by + 22} ${cx} ${by + 10} C${cx + 16} ${by + 22} ${cx + 52} ${by + 18} ${cx + 54} ${by - 12} C${cx + 56} ${by - 46} ${cx + 14} ${by - 52} ${cx} ${by - 30} Z`, pal.belly, 2);
    s += eclipseEye(cx - 26, by - 14, 18, pal, 0.3) + eclipseEye(cx + 26, by - 14, 18, pal, 0.3);
    s += ink(`M${cx - 6} ${by + 2} L${cx + 6} ${by + 2} L${cx} ${by + 14} Z`, pal.glow, 1.6);
    s += `<ellipse cx="${cx - 44}" cy="${by + 12}" rx="6" ry="3.5" fill="${pal.accent}" opacity="0.6"/><ellipse cx="${cx + 44}" cy="${by + 12}" rx="6" ry="3.5" fill="${pal.accent}" opacity="0.6"/>`;
    s += sparkle(cx, by - 44, 5, pal.glow);
    s += shine(`M${cx - 50} ${by - 34} q8 -16 24 -22`, 2.4);
    return s;
  }

  // Géométrie des stades 1–3.
  const hy = [0, 94, 86, 86][stage], hrx = [0, 50, 54, 54][stage], hry = [0, 42, 42, 42][stage];
  const by = [0, 160, 156, 156][stage], brx = [0, 56, 64, 60][stage], bry = [0, 48, 56, 56][stage];
  if (stage >= 3) {
    const ey = hy - 26;
    s += aura(cx, ey, 96, pal.glow);
    // Halo d'éclipse : rayons, couronne, disque sombre.
    let rays = '';
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2, r0 = 64, r1 = 64 + (i % 2 ? 8 : 16);
      rays += `M${f(cx + Math.cos(a) * r0)} ${f(ey + Math.sin(a) * r0)} L${f(cx + Math.cos(a) * r1)} ${f(ey + Math.sin(a) * r1)} `;
    }
    s += line(rays, 2.2, pal.glow, ' opacity="0.9"');
    s += `<circle cx="${cx}" cy="${ey}" r="62" fill="${pal.glow}" stroke="#1A1230" stroke-width="2.2"/>`;
    s += `<circle cx="${cx + 7}" cy="${ey + 4}" r="57" fill="#1A1230"/>`;
    s += speckles(c, cx + 7, ey + 4, 50, 50, 22);
  }
  s += ground(cx, gy + 4, [0, 62, 70, 84][stage]);

  // Ailes déployées (éveillé).
  if (stage >= 3) {
    for (const dir of [-1, 1]) {
      const X = (x: number) => f(cx + dir * x);
      let d = `M${X(34)} 116 C${X(58)} 84 ${X(86)} 50 ${X(110)} 30`;
      const tips: [number, number][] = [[108, 62], [104, 94], [94, 124], [80, 150], [64, 170], [46, 184]];
      let px = 110, py = 30;
      for (const [tx, ty] of tips) {
        d += ` Q${X((px + tx) / 2 + 12)} ${f((py + ty) / 2 + 6)} ${X(tx)} ${ty}`;
        d += ` L${X(tx - 6)} ${ty - 4}`;
        px = tx - 6; py = ty - 4;
      }
      d += ` Q${X(36)} 186 ${X(30)} 170 Z`;
      s += ink(d, pal.shade, 2.6);
      s += `<g transform="translate(${X(34)} 120) scale(0.72) translate(${f(-(cx + dir * 34))} -120)">${ink(d, pal.body, 2)}</g>`;
      s += `<g transform="translate(${X(34)} 120) scale(0.42) translate(${f(-(cx + dir * 34))} -120)">${ink(d, pal.light, 1.6)}</g>`;
      // Rémiges.
      s += line(tips.map(([tx, ty]) => `M${X(tx - 6)} ${ty - 4} L${X(34 + (tx - 34) * 0.6)} ${f(120 + (ty - 120) * 0.6)}`).join(' '), 1.3, '#1A1230', ' opacity="0.6"');
      // Constellation sur l'aile.
      const cs: [number, number][] = [[58, 90], [78, 70], [96, 50], [90, 96], [70, 130]];
      s += line('M' + cs.map(([x, y]) => `${X(x)} ${y}`).join(' L'), 1.5, pal.glow, ' stroke-dasharray="4 3"');
      cs.forEach(([x, y], i) => { s += i === 2 ? sparkle(cx + dir * x, y, 5, pal.glow) : `<circle cx="${X(x)}" cy="${y}" r="2.6" fill="#FFF6D8" stroke="#1A1230" stroke-width="1"/>`; });
    }
  }

  // Queue.
  s += ink(`M${cx - 18} ${by + bry - 14} L${cx - 22} ${by + bry + 14} L${cx - 8} ${by + bry + 8} L${cx} ${by + bry + 18} L${cx + 8} ${by + bry + 8} L${cx + 22} ${by + bry + 14} L${cx + 18} ${by + bry - 14} Z`, pal.shade, 2);
  // Corps.
  s += ink(`M${cx - brx} ${by} C${cx - brx} ${by - bry * 1.1} ${cx + brx} ${by - bry * 1.1} ${cx + brx} ${by} C${cx + brx} ${by + bry * 0.75} ${cx + brx * 0.5} ${by + bry} ${cx} ${by + bry} C${cx - brx * 0.5} ${by + bry} ${cx - brx} ${by + bry * 0.75} ${cx - brx} ${by} Z`, pal.body, 2.6);
  // Plastron.
  s += ink(`M${cx - brx * 0.62} ${by - bry * 0.3} C${cx - brx * 0.74} ${by + bry * 0.5} ${cx - brx * 0.3} ${by + bry * 0.94} ${cx} ${by + bry * 0.94} C${cx + brx * 0.3} ${by + bry * 0.94} ${cx + brx * 0.74} ${by + bry * 0.5} ${cx + brx * 0.62} ${by - bry * 0.3} C${cx + brx * 0.4} ${by - bry * 0.8} ${cx - brx * 0.4} ${by - bry * 0.8} ${cx - brx * 0.62} ${by - bry * 0.3} Z`, pal.belly, 1.8);
  if (stage === 1) s += chevrons(cx, by - bry * 0.1, 4, 14, 11);
  else {
    for (let j = 0; j < 4; j++) for (let i = -1; i <= 1; i++) {
      const x = cx + i * 17 + (j % 2 ? 8.5 : 0), y = by - bry * 0.3 + j * 15;
      if (j % 2 && i === 1) continue;
      s += sparkle(x, y, j === 1 && i === 0 ? 5 : 3.4, (i + j) % 3 ? '#FFF6D8' : pal.glow);
    }
  }
  s += talons(cx, gy - 2, stage === 1 ? 9 : 11, pal);

  // Ailes repliées (stades 1–2).
  if (stage <= 2) {
    for (const dir of [-1, 1]) {
      const X = (x: number) => f(cx + dir * x);
      const top = by - bry * 0.62, bot = stage === 1 ? by + bry * 0.86 : by + bry + 12;
      const out = brx + (stage === 1 ? 10 : 14);
      const d = `M${X(brx * 0.62)} ${f(top)} C${X(out)} ${f(top - 4)} ${X(out + 6)} ${f(by + bry * 0.3)} ${X(brx * 0.68)} ${f(bot)} L${X(brx * 0.56)} ${f(bot - 10)} L${X(brx * 0.5)} ${f(bot + 2)} C${X(brx * 0.4)} ${f(by)} ${X(brx * 0.48)} ${f(top + 14)} ${X(brx * 0.62)} ${f(top)} Z`;
      s += ink(d, pal.shade, 2.4);
      s += ink(`M${X(brx * 0.62)} ${f(top)} C${X(out - 2)} ${f(top)} ${X(out)} ${f(top + 26)} ${X(out - 6)} ${f(top + 36)} C${X(brx * 0.7)} ${f(top + 30)} ${X(brx * 0.56)} ${f(top + 26)} ${X(brx * 0.62)} ${f(top)} Z`, pal.body, 1.6);
      s += line(`M${X(brx * 0.62)} ${f(top + 46)} Q${X(out - 4)} ${f(by + 20)} ${X(brx * 0.7)} ${f(bot - 8)} M${X(brx * 0.6)} ${f(top + 60)} Q${X(out - 10)} ${f(by + 30)} ${X(brx * 0.62)} ${f(bot - 4)}`, 1.3, '#1A1230', ' opacity="0.6"');
      if (stage === 2) {
        // Plumes constellées.
        const pts: [number, number][] = [[brx * 0.7, top + 36], [brx * 0.9, by - 4], [brx * 0.76, by + 24], [brx * 0.84, by + 46]];
        s += line('M' + pts.map(([x, y]) => `${X(x)} ${f(y)}`).join(' L'), 1.3, pal.glow, ' stroke-dasharray="3 3"');
        pts.forEach(([x, y], i) => { s += i === 1 ? sparkle(cx + dir * x, y, 4, pal.glow) : `<circle cx="${X(x)}" cy="${f(y)}" r="2.3" fill="#FFF6D8" stroke="#1A1230" stroke-width="0.9"/>`; });
      }
    }
  }

  // Aigrettes : petites pointes (jeune) ou croissants (adulte).
  for (const dir of [-1, 1]) {
    const X = (x: number) => f(cx + dir * x);
    if (stage === 1) s += ink(`M${X(18)} ${hy - hry + 6} Q${X(28)} ${hy - hry - 20} ${X(44)} ${hy - hry - 22} Q${X(42)} ${hy - hry - 2} ${X(38)} ${hy - hry + 10} Z`, pal.shade, 2);
    else {
      const t = hy - hry;
      // Aigrette en croissant, bord externe en plumes dentelées.
      s += ink(`M${X(12)} ${t + 10} C${X(14)} ${t - 22} ${X(36)} ${t - 38} ${X(54)} ${t - 40} L${X(52)} ${t - 32} L${X(66)} ${t - 38} L${X(62)} ${t - 30} L${X(80)} ${t - 30} C${X(62)} ${t - 24} ${X(44)} ${t - 14} ${X(40)} ${t + 10} Z`, pal.shade, 2.2);
      s += line(`M${X(24)} ${t + 2} C${X(26)} ${t - 18} ${X(46)} ${t - 30} ${X(66)} ${t - 30}`, 3, pal.glow);
    }
  }

  // Tête.
  s += ink(fluff(cx, hy, hrx, hry, 16, 0.07), pal.body, 2.6);
  s += shadow(`M${cx + hrx * 0.5} ${hy - hry * 0.8} C${cx + hrx * 1.08} ${hy - hry * 0.3} ${cx + hrx * 1.05} ${hy + hry * 0.5} ${cx + hrx * 0.5} ${hy + hry * 0.95} C${cx + hrx * 0.8} ${hy + hry * 0.4} ${cx + hrx * 0.8} ${hy - hry * 0.3} ${cx + hrx * 0.5} ${hy - hry * 0.8} Z`, pal.shade, 0.5);
  // Disque facial.
  const fy = hy + 4;
  s += ink(`M${cx} ${fy - 20} C${cx - 12} ${fy - 38} ${cx - hrx * 0.95} ${fy - 34} ${cx - hrx * 0.92} ${fy - 2} C${cx - hrx * 0.88} ${fy + 26} ${cx - 14} ${fy + 30} ${cx} ${fy + 18} C${cx + 14} ${fy + 30} ${cx + hrx * 0.88} ${fy + 26} ${cx + hrx * 0.92} ${fy - 2} C${cx + hrx * 0.95} ${fy - 34} ${cx + 12} ${fy - 38} ${cx} ${fy - 20} Z`, pal.belly, 1.8);
  const er = stage === 1 ? 15 : 14;
  s += eclipseEye(cx - 21, fy - 2, er, pal, stage === 1 ? 0.3 : 0) + eclipseEye(cx + 21, fy - 2, er, pal, stage === 1 ? 0.3 : 0);
  if (stage >= 2) {
    // Sourcils sévères en plumes.
    for (const dir of [-1, 1]) s += ink(`M${cx + dir * 4} ${fy - 14} L${cx + dir * 38} ${fy - 24} L${cx + dir * 34} ${fy - 17} Z`, pal.shade, 1.6);
  }
  s += ink(`M${cx - 6} ${fy + 8} L${cx + 6} ${fy + 8} L${cx} ${fy + 22} Z`, pal.glow, 1.6);
  if (stage === 1) s += `<ellipse cx="${cx - 36}" cy="${fy + 16}" rx="5" ry="3" fill="${pal.accent}" opacity="0.6"/><ellipse cx="${cx + 36}" cy="${fy + 16}" rx="5" ry="3" fill="${pal.accent}" opacity="0.6"/>`;
  if (stage >= 2) s += crescent(cx, hy - hry + 10, 5.5, pal.glow);
  else s += sparkle(cx, hy - hry + 10, 4.5, pal.glow);
  s += shine(`M${cx - hrx * 0.82} ${hy - hry * 0.45} q6 -12 18 -16`, 2.2);
  if (stage >= 3) for (let i = 0; i < 6; i++) s += sparkle(14 + c.r() * 194, 150 + c.r() * 70, 2 + c.r() * 2.5, pal.glow, false);
  return s;
};
