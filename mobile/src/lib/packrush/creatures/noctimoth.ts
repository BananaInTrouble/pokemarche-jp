import { aura, eye, ground, ink, line, shadow, shine, sparkle, speckles, type Species } from './style.ts';

/**
 * Noctimoth → Phalénuit → Séléniaile → Astrophalène : papillon de nuit cosmique. Boule de duvet aux antennes
 * plumeuses, puis ailes de nuit à ocelles, puis grandes ailes-nébuleuses ornées de lunes, enfin ailes constellées.
 */

const f = (v: number) => v.toFixed(1);

/** Contour duveteux : ellipse bordée de petites bosses. */
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

/** Antenne plumeuse : tige courbe + barbules inclinées vers la pointe. */
function antenna(x0: number, y0: number, qx: number, qy: number, x1: number, y1: number, n: number, len: number): string {
  let barbs = '';
  for (let i = 1; i < n; i++) {
    const t = i / n, u = 1 - t;
    const x = u * u * x0 + 2 * u * t * qx + t * t * x1, y = u * u * y0 + 2 * u * t * qy + t * t * y1;
    let tx = 2 * u * (qx - x0) + 2 * t * (x1 - qx), ty = 2 * u * (qy - y0) + 2 * t * (y1 - qy);
    const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
    const L = len * (1 - t * 0.55);
    for (const sd of [-1, 1]) {
      const nx = -ty * sd, ny = tx * sd;
      barbs += `M${f(x)} ${f(y)} l${f((nx * 0.85 + tx * 0.55) * L)} ${f((ny * 0.85 + ty * 0.55) * L)} `;
    }
  }
  return line(barbs, 1.3) + line(`M${f(x0)} ${f(y0)} Q${f(qx)} ${f(qy)} ${f(x1)} ${f(y1)}`, 2.2);
}

type Pt = [number, number];
type Wing = { start: Pt; segs: [Pt, Pt, Pt][] };

/** Chemin d'aile (coordonnées relatives au centre, `dir` = côté). */
function wingD(cx: number, w: Wing, dir: number): string {
  const P = (p: Pt) => `${f(cx + dir * p[0])} ${f(p[1])}`;
  return `M${P(w.start)} ` + w.segs.map((s) => `C${P(s[0])} ${P(s[1])} ${P(s[2])}`).join(' ') + ' Z';
}
const scaled = (ax: number, ay: number, k: number, inner: string) =>
  `<g transform="translate(${f(ax)} ${f(ay)}) scale(${k}) translate(${f(-ax)} ${f(-ay)})">${inner}</g>`;

/** Croissant de lune. */
const crescent = (x: number, y: number, r: number, fill: string, w = 1.2) =>
  ink(`M${f(x - r * 0.8)} ${f(y - r * 0.1)} a${f(r)} ${f(r)} 0 1 0 ${f(r * 1.6)} 0 a${f(r * 0.82)} ${f(r * 0.82)} 0 1 1 ${f(-r * 1.6)} 0 Z`, fill, w);

const FORE: Wing[] = [
  { start: [14, 120], segs: [[[40, 80], [88, 82], [90, 114]], [[90, 140], [56, 148], [20, 140]]] },
  { start: [12, 112], segs: [[[38, 62], [86, 38], [104, 50]], [[112, 78], [102, 116], [80, 132]], [[56, 144], [28, 138], [12, 128]]] },
  { start: [12, 100], segs: [[[36, 40], [88, 6], [108, 18]], [[120, 44], [110, 96], [84, 116]], [[60, 132], [28, 126], [12, 116]]] },
  { start: [12, 98], segs: [[[32, 34], [84, 0], [108, 6]], [[122, 32], [114, 90], [86, 114]], [[60, 132], [28, 124], [12, 114]]] },
];
const HIND: Wing[] = [
  { start: [18, 150], segs: [[[50, 148], [80, 164], [72, 186]], [[64, 204], [32, 196], [16, 170]]] },
  { start: [12, 134], segs: [[[48, 132], [90, 150], [86, 182]], [[80, 206], [44, 206], [14, 160]]] },
  { start: [12, 122], segs: [[[52, 118], [96, 132], [92, 160]], [[88, 178], [72, 186], [66, 198]], [[60, 212], [70, 226], [56, 230]], [[42, 228], [44, 206], [34, 188]], [[26, 172], [14, 152], [12, 134]]] },
  { start: [12, 120], segs: [[[54, 114], [102, 130], [98, 164]], [[94, 186], [74, 192], [68, 208]], [[60, 222], [72, 238], [58, 244]], [[42, 244], [42, 218], [34, 196]], [[26, 174], [14, 150], [12, 132]]] },
];
// Ocelles [x, y, r] (aile avant, aile arrière).
const OCF: [number, number, number][] = [[54, 112, 8], [64, 92, 11], [72, 62, 15], [74, 58, 16]];
const OCH: [number, number, number][] = [[46, 172, 6], [56, 172, 8], [60, 152, 10], [62, 154, 11]];
// Constellations des ailes éveillées.
const CONST: Pt[] = [[28, 84], [42, 50], [66, 24], [96, 12], [110, 38], [102, 74], [80, 104]];

export const noctimoth: Species = (c) => {
  const { pal, stage: st0 } = c;
  const stage = Math.min(3, st0);
  const cx = 111;
  let s = '';
  const head: Pt = [[0, 0], [0, 92], [0, 78], [0, 76]][stage] as Pt;
  if (stage >= 3) s += aura(cx, 100, 118, pal.glow);
  s += ground(cx, 212, [56, 64, 74, 80][stage]);

  // Ailes (arrière puis avant), de chaque côté.
  const fw = FORE[stage], hw = HIND[stage];
  for (const dir of [-1, 1]) {
    const ax = cx + dir * hw.start[0], ay = hw.start[1];
    const d = wingD(cx, hw, dir);
    s += ink(d, stage >= 2 ? pal.shade : pal.body, 2.6);
    s += scaled(ax, ay, 0.84, ink(d, stage >= 2 ? pal.accent : pal.light, 2));
    if (stage >= 2) s += scaled(ax, ay, 0.55, `<path d="${d}" fill="${pal.accent2}" opacity="0.8"/>`);
    s += scaled(ax, ay, 0.42, shadow(d, pal.shade, 0.6));
    const [ox, oy, orr] = OCH[stage];
    if (stage >= 1) s += `<circle cx="${f(cx + dir * ox)}" cy="${oy}" r="${orr}" fill="${pal.belly}" stroke="#1A1230" stroke-width="1.6"/><circle cx="${f(cx + dir * ox)}" cy="${oy}" r="${f(orr * 0.6)}" fill="${pal.ink}"/>`;
    if (stage >= 1) s += `<circle cx="${f(cx + dir * ox - 1)}" cy="${oy - 1}" r="${f(orr * 0.22)}" fill="${pal.glow}"/>`;
    if (stage >= 2) {
      const tp = hw.segs[2][1];
      s += crescent(cx + dir * (tp[0] - 8), tp[1] - 4, stage >= 3 ? 6 : 4.5, pal.glow);
    }
  }
  for (const dir of [-1, 1]) {
    const ax = cx + dir * fw.start[0], ay = fw.start[1];
    const d = wingD(cx, fw, dir);
    s += ink(d, stage >= 2 ? pal.shade : pal.body, 2.6);
    s += scaled(ax, ay, stage >= 2 ? 0.88 : 0.82, ink(d, stage >= 2 ? pal.body : pal.light, 2));
    if (stage >= 2) {
      // Voiles de nébuleuse.
      s += scaled(ax, ay, 0.66, `<path d="${d}" fill="${pal.accent2}" opacity="0.75"/>`);
      s += scaled(ax, ay, 0.44, `<path d="${d}" fill="${pal.accent}" opacity="0.8"/>`);
    }
    s += scaled(ax, ay, 0.36, shadow(d, pal.shade, 0.7));
    // Nervures.
    const vs = fw.segs.map((g) => g[2]).concat([fw.segs[0][1]]);
    s += line(vs.map((p) => `M${f(ax)} ${f(ay)} L${f(ax + (cx + dir * p[0] - ax) * 0.72)} ${f(ay + (p[1] - ay) * 0.72)}`).join(' '), 1.2, '#1A1230', ' opacity="0.55"');
    // Points clairs sur la bordure.
    const tip = fw.segs[stage === 0 ? 0 : 0][2];
    s += speckles(c, cx + dir * tip[0] * 0.8, tip[1] + 18, 14 + stage * 4, 16 + stage * 3, 4 + stage * 3);
    // Ocelle : œil de nuit, puis lune.
    const [ox, oy, orr] = OCF[stage];
    const x = cx + dir * ox;
    if (stage === 0) s += `<circle cx="${f(x)}" cy="${oy}" r="${orr}" fill="${pal.accent}" stroke="#1A1230" stroke-width="1.6"/><circle cx="${f(x)}" cy="${oy}" r="${f(orr * 0.4)}" fill="${pal.belly}"/>`;
    else {
      s += `<circle cx="${f(x)}" cy="${oy}" r="${f(orr * 1.25)}" fill="${pal.light}" stroke="#1A1230" stroke-width="1.8"/>`;
      s += `<circle cx="${f(x)}" cy="${oy}" r="${orr}" fill="${pal.ink}" stroke="#1A1230" stroke-width="1.4"/>`;
      if (stage >= 2) s += crescent(x, oy + orr * 0.12, orr * 0.78, pal.glow, 1.2);
      else s += `<circle cx="${f(x)}" cy="${oy}" r="${f(orr * 0.45)}" fill="${pal.eye}"/>`;
      if (stage < 2) s += `<circle cx="${f(x - orr * 0.35)}" cy="${f(oy - orr * 0.45)}" r="${f(orr * 0.16)}" fill="#fff"/>`;
      if (stage >= 3) for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2;
        s += `<circle cx="${f(x + Math.cos(a) * orr * 1.55)}" cy="${f(oy + Math.sin(a) * orr * 1.55)}" r="1.6" fill="${pal.glow}"/>`;
      }
    }
    if (stage >= 3) {
      const pts = CONST.map((p) => [cx + dir * p[0], p[1]] as Pt);
      s += line('M' + pts.map((p) => `${f(p[0])} ${f(p[1])}`).join(' L'), 1.7, pal.glow, ' stroke-dasharray="5 3"');
      pts.forEach((p, i) => { s += i % 2 ? sparkle(p[0], p[1], 4, pal.glow) : `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="3" fill="#FFF6D8" stroke="#1A1230" stroke-width="1"/>`; });
    }
    s += shine(`M${f(cx + dir * fw.segs[0][0][0] * 0.9)} ${f(fw.segs[0][0][1] + 14)} q${dir * 10} -12 ${dir * 22} -16`, 1.8);
  }

  if (stage === 0) {
    // Bébé : boule de duvet, collerette, petites pattes.
    const by = 148;
    s += antenna(cx - 12, 108, cx - 22, 72, cx - 50, 66, 6, 9) + antenna(cx + 12, 108, cx + 22, 72, cx + 50, 66, 6, 9);
    s += `<circle cx="${cx - 50}" cy="66" r="4" fill="${pal.glow}" stroke="#1A1230" stroke-width="1.4"/><circle cx="${cx + 50}" cy="66" r="4" fill="${pal.glow}" stroke="#1A1230" stroke-width="1.4"/>`;
    for (const x of [-16, 16]) s += ink(`M${f(cx + x - 8)} ${by + 46} q8 14 16 0 Z`, pal.light, 1.8);
    s += ink(fluff(cx, by, 50, 48, 16, 0.12), pal.body, 2.6);
    s += shadow(`M${cx + 20} ${by - 40} C${cx + 54} ${by - 20} ${cx + 52} ${by + 30} ${cx + 20} ${by + 46} C${cx + 36} ${by + 20} ${cx + 38} ${by - 16} ${cx + 20} ${by - 40} Z`, pal.shade, 0.55);
    s += ink(fluff(cx, by + 30, 36, 16, 10, 0.25, Math.PI), pal.belly, 1.8);
    s += speckles(c, cx, by - 28, 22, 8, 6);
    s += crescent(cx, by - 34, 6, pal.glow);
    s += eye(cx - 19, by - 6, 13, pal.eye, 0.2) + eye(cx + 19, by - 6, 13, pal.eye, 0.2);
    s += line(`M${cx - 5} ${by + 12} q5 5 10 0`, 1.8);
    s += `<ellipse cx="${cx - 34}" cy="${by + 10}" rx="6" ry="3.5" fill="${pal.accent}" opacity="0.6"/><ellipse cx="${cx + 34}" cy="${by + 10}" rx="6" ry="3.5" fill="${pal.accent}" opacity="0.6"/>`;
    s += shine(`M${cx - 38} ${by - 22} q6 -12 18 -16`, 2.4);
    return s;
  }

  // Corps : abdomen annelé, thorax duveteux, collerette, tête.
  const [hx, hy] = [cx, head[1]];
  const hr = [0, 24, 22, 22][stage];
  const ty = hy + 36, ab = [0, 30, 34, 36][stage];
  const ay = ty + 22 + ab * 0.6;
  s += ink(`M${cx - 15} ${ty + 12} C${cx - 22} ${ay} ${cx - 10} ${ay + ab} ${cx} ${ay + ab + 4} C${cx + 10} ${ay + ab} ${cx + 22} ${ay} ${cx + 15} ${ty + 12} Z`, pal.body, 2.4);
  s += shadow(`M${cx + 6} ${ty + 16} C${cx + 18} ${ay} ${cx + 10} ${ay + ab - 4} ${cx + 2} ${ay + ab + 2} C${cx + 8} ${ay + ab - 10} ${cx + 12} ${ay} ${cx + 6} ${ty + 16} Z`, pal.shade, 0.6);
  for (let i = 1; i <= 4; i++) {
    const y = ty + 12 + (ay + ab - ty - 12) * (i / 5.2);
    const w = 16 * Math.sin((i / 5.2) * Math.PI * 0.9 + 0.5);
    s += line(`M${f(cx - w)} ${f(y)} q${f(w)} 5 ${f(2 * w)} 0`, 1.4);
  }
  if (stage >= 3) s += `<circle cx="${cx}" cy="${f(ay + ab - 2)}" r="4" fill="${pal.glow}" stroke="#1A1230" stroke-width="1.2"/>`;
  s += ink(fluff(cx, ty, 22, 21, 11, 0.14), pal.belly, 2.2);
  s += speckles(c, cx, ty, 12, 10, 5, pal.light);
  // Petites pattes.
  s += line(`M${cx - 16} ${ty + 12} q-10 6 -12 16 M${cx + 16} ${ty + 12} q10 6 12 16 M${cx - 12} ${ty + 18} q-4 8 -2 16 M${cx + 12} ${ty + 18} q4 8 2 16`, 1.8);
  // Antennes.
  const al = [1, 1, 1.2, 1.08][stage];
  for (const dir of [-1, 1]) {
    const x0 = hx + dir * 9, y0 = hy - hr * 0.8;
    const x1 = hx + dir * 46 * al, y1 = hy - 62 * al;
    s += antenna(x0, y0, hx + dir * 8, hy - 58 * al, x1, y1, stage === 1 ? 7 : 9, stage === 1 ? 9 : 11);
    if (stage >= 2) s += sparkle(x1, y1, 6, pal.glow);
    else s += `<circle cx="${f(x1)}" cy="${f(y1)}" r="3.5" fill="${pal.glow}" stroke="#1A1230" stroke-width="1.3"/>`;
  }
  s += ink(fluff(hx, hy + hr * 0.75, hr * 1.25, 10, 12, 0.3, Math.PI * 0.05), pal.light, 2);
  s += ink(fluff(hx, hy, hr, hr * 0.92, 12, 0.1), pal.body, 2.6);
  s += shadow(`M${f(hx + hr * 0.4)} ${f(hy - hr * 0.8)} C${f(hx + hr * 1.1)} ${f(hy - hr * 0.3)} ${f(hx + hr * 1.0)} ${f(hy + hr * 0.6)} ${f(hx + hr * 0.4)} ${f(hy + hr * 0.85)} C${f(hx + hr * 0.75)} ${f(hy + hr * 0.4)} ${f(hx + hr * 0.75)} ${f(hy - hr * 0.3)} ${f(hx + hr * 0.4)} ${f(hy - hr * 0.8)} Z`, pal.shade, 0.5);
  if (stage >= 2) s += crescent(hx, hy - hr * 0.62, 5.5, pal.glow);
  else s += sparkle(hx, hy - hr * 0.6, 5, pal.glow);
  if (stage >= 3) s += sparkle(hx - 12, hy - hr * 0.5, 3, pal.glow) + sparkle(hx + 12, hy - hr * 0.5, 3, pal.glow);
  const er = [0, 10, 8.5, 8.5][stage];
  s += eye(hx - hr * 0.42, hy + 1, er, pal.eye, 0.2) + eye(hx + hr * 0.42, hy + 1, er, pal.eye, 0.2);
  if (stage >= 2) s += line(`M${f(hx - hr * 0.42 - er)} ${f(hy - er * 1.2)} q${f(er)} -4 ${f(er * 2)} 1 M${f(hx + hr * 0.42 + er)} ${f(hy - er * 1.2)} q${f(-er)} -4 ${f(-er * 2)} 1`, 1.6);
  s += line(`M${cx - 4} ${f(hy + hr * 0.5)} q4 4 8 0`, 1.6);
  if (stage === 1) s += `<ellipse cx="${f(hx - hr * 0.72)}" cy="${f(hy + hr * 0.42)}" rx="4.5" ry="2.8" fill="${pal.accent}" opacity="0.6"/><ellipse cx="${f(hx + hr * 0.72)}" cy="${f(hy + hr * 0.42)}" rx="4.5" ry="2.8" fill="${pal.accent}" opacity="0.6"/>`;
  s += shine(`M${f(hx - hr * 0.75)} ${f(hy - hr * 0.3)} q4 -8 12 -11`, 2);
  if (stage >= 3) for (let i = 0; i < 6; i++) s += sparkle(20 + c.r() * 182, 10 + c.r() * 200, 2 + c.r() * 2.5, pal.glow, false);
  return s;
};
