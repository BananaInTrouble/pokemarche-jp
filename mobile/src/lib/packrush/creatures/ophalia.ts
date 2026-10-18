import { aura, eye, ink, line, shadow, shine, sparkle, type Species } from './style.ts';

type Pt = [number, number];

/**
 * Ophalia : serpent ailé céleste (mythique, carte plein cadre). Dragon-serpent à plumes et à six ailes,
 * enroulé autour d'un petit soleil qu'il couve : un anneau passe devant l'astre, un autre derrière.
 */
export const ophalia: Species = (c) => {
  const { pal } = c;
  const CREAM = '#FFF6D8';
  const f = (v: number) => v.toFixed(1);
  const P = (p: Pt) => `${f(p[0])} ${f(p[1])}`;
  let s = '';

  // --- Plume (feuille effilée) de la base b vers la pointe t.
  const feather = (b: Pt, t: Pt, w: number, fill: string, tipFill: string) => {
    const dx = t[0] - b[0], dy = t[1] - b[1], L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
    const m = (k: number, o: number): Pt => [b[0] + dx * k + nx * o, b[1] + dy * k + ny * o];
    const d = `M${P(b)} Q${P(m(0.55, w * 1.5))} ${P(t)} Q${P(m(0.55, -w * 1.5))} ${P(b)} Z`;
    const tip = `M${P(m(0.72, w * 0.85))} Q${P(m(0.86, w * 0.7))} ${P(t)} Q${P(m(0.86, -w * 0.7))} ${P(m(0.72, -w * 0.85))} Q${P(m(0.7, 0))} ${P(m(0.72, w * 0.85))} Z`;
    return ink(d, fill, 2) + `<path d="${tip}" fill="${tipFill}"/>` + line(`M${P(m(0.15, 0))} L${P(m(0.9, 0))}`, 1.2)
      + `<circle cx="${f(m(0.8, 0)[0])}" cy="${f(m(0.8, 0)[1])}" r="${f(w * 0.32)}" fill="${CREAM}"/>`;
  };
  // Aile : bras (bord d'attaque) bombé, rémiges qui pendent vers l'arrière, couvertures par-dessus.
  const wing = (root: Pt, a: number, L: number, side: number) => {
    const r = (a * Math.PI) / 180, u: Pt = [Math.cos(r), Math.sin(r)], up: Pt = [Math.sin(r), -Math.cos(r)];
    const at = (k: number, h: number): Pt => [root[0] + side * (u[0] * L * k + up[0] * h), root[1] + u[1] * L * k + up[1] * h];
    const dir = (th: number, l: number, from: Pt): Pt => {
      const t = (th * Math.PI) / 180;
      return [from[0] + side * (u[0] * Math.cos(t) - up[0] * Math.sin(t)) * l, from[1] + (u[1] * Math.cos(t) - up[1] * Math.sin(t)) * l];
    };
    let o = '';
    for (let i = 5; i >= 0; i--) {
      const base = at(0.92 - 0.12 * i, 0);
      o += feather(base, dir(12 + 15 * i, L * (0.48 - 0.035 * i), base), 8.5, i % 2 ? pal.light : pal.body, pal.accent);
    }
    let lead = `M${P(at(0, -4))}`;
    for (let k = 0.1; k <= 1.001; k += 0.1) lead += ` L${P(at(k, L * 0.13 * Math.sin(Math.PI * Math.min(1, k * 1.1)) + 4))}`;
    let back = '';
    for (let k = 1; k >= 0; k -= 0.125) back += ` Q${P(at(k + 0.06, -L * 0.07))} ${P(at(k, -L * 0.035))}`;
    o += ink(lead + back + ' Z', pal.accent2, 2.2);
    o += line(lead, 1.6, '#FFFFFF', ' opacity="0.6"');
    for (let k = 0.3; k < 0.95; k += 0.16) o += line(`M${P(at(k, L * 0.08))} Q${P(at(k + 0.05, 0))} ${P(at(k, -L * 0.03))}`, 1.2);
    o += sparkle(at(0.98, 2)[0], at(0.98, 2)[1], 3.5, CREAM, false);
    return o;
  };

  // --- Soleil : rayons + disque (dessiné entre les deux passages du corps).
  const sx = 112, sy = 128, sr = 52;
  s += aura(sx, sy, 110, pal.glow);
  s += aura(sx, 40, 80, pal.accent2);

  // Six ailes (derrière tout), racines cachées derrière le soleil.
  const root: Pt = [112, 104];
  for (const [a, len] of [[20, 110], [-18, 132], [-56, 128]] as Pt[]) {
    s += wing(root, a, len, 1);
    s += wing(root, a, len, -1);
  }

  // --- Corps : spline de Catmull-Rom, épaisseur variable.
  const C: Pt[] = [[22, 232], [62, 252], [126, 252], [180, 232], [204, 196], [184, 170], [116, 164], [50, 150], [22, 116], [44, 96], [110, 132], [176, 112], [194, 66], [168, 30], [130, 18]];
  const M = 12;
  const pts: Pt[] = [];
  for (let i = 0; i < C.length - 1; i++) {
    const p0 = C[Math.max(0, i - 1)], p1 = C[i], p2 = C[i + 1], p3 = C[Math.min(C.length - 1, i + 2)];
    for (let j = 0; j < M; j++) {
      const t = j / M, t2 = t * t, t3 = t2 * t;
      const q = (k: number) => 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3);
      pts.push([q(0), q(1)]);
    }
  }
  pts.push(C[C.length - 1]);
  const N = pts.length;
  const W = (u: number) => (u < 0.22 ? 2 + (u / 0.22) * 11 : u > 0.82 ? 13 - (u - 0.82) * 14 : 13);
  const off = (i: number, k: number): Pt => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(N - 1, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, w = W(i / (N - 1)) * k;
    return [pts[i][0] - (dy / L) * w, pts[i][1] + (dx / L) * w];
  };
  const band = (i0: number, i1: number, k0: number, k1: number) => {
    let d = '';
    for (let i = i0; i <= i1; i++) d += `${i === i0 ? 'M' : 'L'}${P(off(i, k0))}`;
    for (let i = i1; i >= i0; i--) d += `L${P(off(i, k1))}`;
    return d + 'Z';
  };
  const edge = (i0: number, i1: number, k: number) => {
    let d = '';
    for (let i = i0; i <= i1; i++) d += `${i === i0 ? 'M' : 'L'}${P(off(i, k))}`;
    return d;
  };
  const segment = (i0: number, i1: number, outlined: boolean) => {
    let o = outlined ? ink(band(i0, i1, 1, -1), pal.body, 2.6) : `<path d="${band(i0, i1, 1, -1)}" fill="${pal.body}"/>`;
    o += `<path d="${band(i0, i1, -0.2, -0.85)}" fill="${pal.belly}"/>`;
    o += shadow(band(i0, i1, 0.45, 1), pal.shade, 0.75);
    // Écailles ventrales.
    for (let i = i0 + 2; i < i1; i += 3) o += line(`M${P(off(i, -0.2))} L${P(off(i, -0.85))}`, 1.1);
    // Écailles dorsales en chevrons + étoiles.
    for (let i = i0 + 4; i < i1 - 1; i += 7) {
      o += line(`M${P(off(i - 1, 0.25))} L${P(off(i + 1, 0.05))} L${P(off(i - 1, -0.12))}`, 1.2, pal.glow, ' opacity="0.9"');
    }
    o += line(edge(i0, i1, -0.55), 1.6, '#FFFFFF', ' opacity="0.55"');
    if (!outlined) o += line(edge(i0, i1, 1), 2.6) + line(edge(i0, i1, -1), 2.6);
    return o;
  };

  // Plumet de queue (avant le corps).
  const tailRoot = pts[0];
  s += feather(tailRoot, [tailRoot[0] - 20, tailRoot[1] - 36], 5.5, pal.light, pal.accent);
  s += feather(tailRoot, [tailRoot[0] - 30, tailRoot[1] - 16], 5.5, pal.body, pal.accent);
  s += feather(tailRoot, [tailRoot[0] - 30, tailRoot[1] + 6], 5, pal.light, pal.accent);

  // Corps entier (le passage arrière sera masqué par le soleil).
  s += segment(0, N - 1, true);

  // Soleil.
  let rays = '';
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2, b = a + Math.PI / 16, e = a - Math.PI / 16, R = i % 2 ? sr + 12 : sr + 20;
    rays += `${i ? 'L' : 'M'}${f(sx + Math.cos(e) * (sr - 2))} ${f(sy + Math.sin(e) * (sr - 2))} L${f(sx + Math.cos(a) * R)} ${f(sy + Math.sin(a) * R)} L${f(sx + Math.cos(b) * (sr - 2))} ${f(sy + Math.sin(b) * (sr - 2))}`;
  }
  s += ink(rays + 'Z', pal.glow, 2);
  s += `<circle cx="${sx}" cy="${sy}" r="${sr}" fill="${pal.glow}" stroke="${pal.ink}" stroke-width="2.6"/>`;
  s += `<circle cx="${sx}" cy="${sy}" r="${sr - 12}" fill="${CREAM}" opacity="0.85"/>`;
  s += shadow(`M${sx + sr} ${sy} A${sr} ${sr} 0 0 1 ${sx - sr * 0.4} ${sy + sr * 0.92} C${sx + 20} ${sy + 30} ${sx + 36} ${sy + 10} ${sx + sr} ${sy} Z`, pal.accent, 0.35);
  // Glyphe spiral au cœur de l'astre.
  let sp = '';
  for (let i = 0; i <= 30; i++) { const t = i / 30, a = t * Math.PI * 3.2, r = 4 + t * 22; sp += `${i ? 'L' : 'M'}${f(sx + Math.cos(a) * r)} ${f(sy + 14 + Math.sin(a) * r)}`; }
  s += line(sp, 2, pal.accent, ' opacity="0.8"');
  s += shine(`M${sx - 34} ${sy - 24} q12 -16 30 -20`, 3);

  // Passage avant du corps, par-dessus le soleil.
  s += segment(7 * M, 12 * M, false);

  // Tête (tournée vers la gauche), crête de plumes.
  const hx = 104, hy = 12;
  s += `<g transform="translate(${hx} ${hy}) scale(1.22) translate(${-hx} ${-hy})">`;
  s += feather([hx + 14, hy - 6], [hx + 44, hy - 40], 5, pal.accent2, pal.glow);
  s += feather([hx + 10, hy - 8], [hx + 24, hy - 48], 5.5, pal.light, pal.accent);
  s += feather([hx + 6, hy - 8], [hx - 2, hy - 44], 5, pal.accent2, pal.glow);
  const head = `M${hx + 30} ${hy + 14} C${hx + 30} ${hy - 6} ${hx + 16} ${hy - 14} ${hx} ${hy - 12} C${hx - 14} ${hy - 10} ${hx - 26} ${hy - 4} ${hx - 38} ${hy + 2} C${hx - 44} ${hy + 6} ${hx - 42} ${hy + 14} ${hx - 34} ${hy + 15} C${hx - 20} ${hy + 18} ${hx - 6} ${hy + 22} ${hx + 8} ${hy + 24} C${hx + 18} ${hy + 25} ${hx + 28} ${hy + 22} ${hx + 30} ${hy + 14} Z`;
  s += ink(head, pal.body, 2.6);
  s += shadow(`M${hx - 34} ${hy + 15} C${hx - 20} ${hy + 18} ${hx - 6} ${hy + 22} ${hx + 8} ${hy + 24} C${hx + 18} ${hy + 25} ${hx + 28} ${hy + 22} ${hx + 30} ${hy + 14} C${hx + 10} ${hy + 18} ${hx - 14} ${hy + 12} ${hx - 34} ${hy + 15} Z`, pal.shade, 0.75);
  s += ink(`M${hx - 36} ${hy + 10} C${hx - 20} ${hy + 12} ${hx - 6} ${hy + 16} ${hx + 8} ${hy + 18} L${hx + 8} ${hy + 24} C${hx - 8} ${hy + 22} ${hx - 22} ${hy + 18} ${hx - 34} ${hy + 15} Z`, pal.belly, 1.4);
  s += line(`M${hx - 36} ${hy + 10} C${hx - 20} ${hy + 12} ${hx - 6} ${hy + 16} ${hx + 8} ${hy + 18}`, 1.8);
  s += ink(`M${hx - 18} ${hy + 13} l1 6 l4 -5 Z`, CREAM, 1.1);
  s += `<circle cx="${hx - 34}" cy="${hy + 3}" r="1.6" fill="${pal.ink}"/>`;
  s += eye(hx - 6, hy - 1, 5.5, pal.eye, -0.7);
  s += ink(`M${hx - 14} ${hy - 9} C${hx - 4} ${hy - 16} ${hx + 10} ${hy - 16} ${hx + 26} ${hy - 26} C${hx + 18} ${hy - 12} ${hx + 6} ${hy - 6} ${hx - 14} ${hy - 6} Z`, pal.accent2, 1.6);
  s += line(`M${hx - 14} ${hy - 6} q8 -6 18 -2`, 2.2);
  s += shine(`M${hx - 28} ${hy - 2} q8 -5 16 -6`, 2);
  // Moustaches de lumière.
  s += line(`M${hx - 38} ${hy + 8} q-12 6 -14 20 M${hx - 30} ${hy + 14} q-6 12 -2 24`, 1.8, pal.glow);
  s += sparkle(hx - 52, hy + 30, 3, CREAM, false) + sparkle(hx - 32, hy + 40, 2.6, CREAM, false);
  // Collier de plumes à la jonction tête-cou.
  for (const [a, b] of [[[hx + 24, hy + 4], [hx + 42, hy - 6]], [[hx + 26, hy + 12], [hx + 48, hy + 12]], [[hx + 22, hy + 18], [hx + 40, hy + 32]]] as Pt[][]) {
    s += feather(a, b, 4, pal.light, pal.accent);
  }
  s += '</g>';

  s += sparkle(20, 50, 5, CREAM) + sparkle(206, 120, 4, pal.glow) + sparkle(30, 180, 3.5, pal.glow) + sparkle(196, 6, 3.5, CREAM);
  return s;
};
