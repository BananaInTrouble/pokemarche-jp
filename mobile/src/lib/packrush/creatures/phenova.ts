import { aura, eye, ground, ink, line, shadow, shine, sparkle, speckles, type DrawCtx, type Species } from './style.ts';

/** Phenova → Pyrastrel → Supernovis : oiseau de supernova, plumes de braise, ailes en explosion d'étoile. */

const f = (v: number) => v.toFixed(1);

/** Plume effilée partant de (x, y) dans la direction `a` (radians). */
function feather(x: number, y: number, a: number, len: number, w: number, fill: string, sw = 2, bend = 0): string {
  const ux = Math.cos(a), uy = Math.sin(a), nx = -uy, ny = ux;
  // `bend` courbe la plume (pointe déviée sur le côté, comme une flammèche).
  const P = (t: number, o: number) => {
    const b = bend * len * t * t;
    return `${f(x + ux * len * t + nx * (o + b))} ${f(y + uy * len * t + ny * (o + b))}`;
  };
  const [tx, ty] = P(1, 0).split(' ').map(Number);
  const d = `M${P(0, -w * 0.4)} C${P(0.35, -w)} ${P(0.75, -w * 0.8)} ${f(tx)} ${f(ty)} C${P(0.75, w * 0.8)} ${P(0.35, w)} ${P(0, w * 0.4)} Z`;
  return ink(d, fill, sw) + line(`M${P(0.08, 0)} Q${P(0.5, 0)} ${P(0.8, 0)}`, 1.1, '#1A1230', ' opacity="0.55"');
}

/** Flammèche recourbée (aigrette, queue). */
function flame(x: number, y: number, h: number, w: number, lean: number, fill: string, sw = 2): string {
  const d = `M${f(x - w)} ${f(y)} C${f(x - w * 1.2)} ${f(y - h * 0.5)} ${f(x + lean * 0.4 - w * 0.2)} ${f(y - h * 0.7)} ${f(x + lean)} ${f(y - h)} C${f(x + lean * 0.5 + w * 0.6)} ${f(y - h * 0.6)} ${f(x + w * 1.3)} ${f(y - h * 0.4)} ${f(x + w)} ${f(y)} Z`;
  return ink(d, fill, sw);
}

/** Étoile-explosion : polygone à rayons alternés. */
function burst(cx: number, cy: number, n: number, r1: number, r2: number, rot = 0): string {
  let d = '';
  for (let i = 0; i < n * 2; i++) {
    const a = rot + (i / (n * 2)) * Math.PI * 2, r = i % 2 ? r1 : r2;
    d += `${i ? 'L' : 'M'}${f(cx + Math.cos(a) * r)} ${f(cy + Math.sin(a) * r)} `;
  }
  return d + 'Z';
}

function beak(x: number, y: number, s: number, c: DrawCtx): string {
  return ink(`M${f(x - s)} ${f(y)} Q${f(x)} ${f(y - s * 0.5)} ${f(x + s)} ${f(y)} Q${f(x + s * 0.3)} ${f(y + s * 0.6)} ${f(x)} ${f(y + s * 1.25)} Q${f(x - s * 0.3)} ${f(y + s * 0.6)} ${f(x - s)} ${f(y)} Z`, c.pal.glow, 1.6)
    + line(`M${f(x - s * 0.7)} ${f(y + s * 0.15)} Q${f(x)} ${f(y + s * 0.4)} ${f(x + s * 0.7)} ${f(y + s * 0.15)}`, 1.1);
}

function foot(x: number, y: number, s: number, fill: string): string {
  return line(`M${f(x)} ${f(y - s * 1.2)} L${f(x)} ${f(y)} M${f(x)} ${f(y)} l${f(-s * 0.8)} ${f(s * 0.35)} M${f(x)} ${f(y)} l0 ${f(s * 0.45)} M${f(x)} ${f(y)} l${f(s * 0.8)} ${f(s * 0.35)}`, 3.6)
    + line(`M${f(x)} ${f(y - s * 1.2)} L${f(x)} ${f(y)} M${f(x)} ${f(y)} l${f(-s * 0.8)} ${f(s * 0.35)} M${f(x)} ${f(y)} l0 ${f(s * 0.45)} M${f(x)} ${f(y)} l${f(s * 0.8)} ${f(s * 0.35)}`, 1.8, fill);
}

export const phenova: Species = (c) => {
  const { pal, stage } = c;
  let s = '';
  const gy = 206;

  if (stage === 0) {
    // ---- Oisillon braise : boule de duvet, aigrette de trois flammèches ----
    const cx = 111, cy = 144, R = 54;
    s += ground(cx, gy, 58);
    s += sparkle(40, 90, 4, pal.glow) + sparkle(184, 110, 3.5, pal.glow) + sparkle(172, 70, 3, pal.accent2);
    // Aigrette.
    s += flame(cx - 14, cy - R + 8, 34, 8, -16, pal.accent);
    s += flame(cx + 14, cy - R + 8, 34, 8, 18, pal.accent);
    s += flame(cx, cy - R + 6, 50, 10, 4, pal.glow);
    s += ink(`M${f(cx - 3)} ${f(cy - R - 4)} C${f(cx - 6)} ${f(cy - R - 20)} ${f(cx + 2)} ${f(cy - R - 28)} ${f(cx + 4)} ${f(cy - R - 34)} C${f(cx + 6)} ${f(cy - R - 20)} ${f(cx + 6)} ${f(cy - R - 10)} ${f(cx + 3)} ${f(cy - R - 4)} Z`, '#FFF6D8', 1.2);
    // Petites ailes-moignons.
    for (const d of [-1, 1]) {
      s += feather(cx + d * (R - 8), cy + 4, Math.PI / 2 - d * 1.15, 30, 12, pal.shade);
      s += feather(cx + d * (R - 10), cy + 2, Math.PI / 2 - d * 1.45, 24, 9, pal.accent, 1.6);
    }
    // Pattes.
    s += foot(cx - 18, gy - 2, 9, pal.glow) + foot(cx + 18, gy - 2, 9, pal.glow);
    // Corps-boule au bas duveteux.
    const startA = Math.PI * 0.15;
    const ballTop = `M${f(cx + Math.cos(startA) * R)} ${f(cy + Math.sin(startA) * R)} C${f(cx + R * 1.15)} ${f(cy - R * 0.3)} ${f(cx + R * 0.7)} ${f(cy - R * 1.02)} ${f(cx)} ${f(cy - R)} C${f(cx - R * 0.7)} ${f(cy - R * 1.02)} ${f(cx - R * 1.15)} ${f(cy - R * 0.3)} ${f(cx + Math.cos(Math.PI * 0.85) * R)} ${f(cy + Math.sin(Math.PI * 0.85) * R)}`;
    // Contour : dessus lisse puis franges de duvet de gauche à droite (inversées).
    let back = '';
    for (let i = 7; i >= 0; i--) {
      const a = Math.PI * (0.15 + (i / 8) * 0.7), a2 = a + Math.PI * 0.7 / 16;
      back += ` Q${f(cx + Math.cos(a2) * (R + 7))} ${f(cy + Math.sin(a2) * (R + 6))} ${f(cx + Math.cos(a) * R)} ${f(cy + Math.sin(a) * R)}`;
    }
    s += ink(`${ballTop}${back} Z`, pal.body, 2.6);
    s += shadow(`M${f(cx + R * 0.55)} ${f(cy - R * 0.75)} C${f(cx + R * 1.1)} ${f(cy - R * 0.3)} ${f(cx + R * 1.0)} ${f(cy + R * 0.5)} ${f(cx + R * 0.6)} ${f(cy + R * 0.8)} C${f(cx + R * 0.75)} ${f(cy + R * 0.3)} ${f(cx + R * 0.8)} ${f(cy - R * 0.3)} ${f(cx + R * 0.55)} ${f(cy - R * 0.75)} Z`, pal.shade, 0.65);
    // Poitrail de braise.
    s += ink(`M${f(cx - 24)} ${f(cy + 14)} C${f(cx - 28)} ${f(cy + 44)} ${f(cx + 28)} ${f(cy + 44)} ${f(cx + 24)} ${f(cy + 14)} C${f(cx + 12)} ${f(cy + 4)} ${f(cx - 12)} ${f(cy + 4)} ${f(cx - 24)} ${f(cy + 14)} Z`, pal.belly, 1.6);
    s += line(`M${f(cx - 10)} ${f(cy + 22)} q4 4 8 0 M${f(cx + 2)} ${f(cy + 22)} q4 4 8 0 M${f(cx - 4)} ${f(cy + 32)} q4 4 8 0`, 1.2, pal.shade);
    s += speckles(c, cx - 20, cy - 10, 16, 10, 5);
    s += shine(`M${f(cx - R * 0.72)} ${f(cy - R * 0.4)} q8 -16 22 -20`, 2.4);
    s += eye(cx - 19, cy - 12, 12, pal.eye, 0.2) + eye(cx + 19, cy - 12, 12, pal.eye, 0.2);
    s += beak(cx, cy + 4, 8, c);
    s += `<ellipse cx="${f(cx - 34)}" cy="${f(cy + 4)}" rx="6" ry="3.5" fill="#FF8FB1" opacity="0.6"/><ellipse cx="${f(cx + 34)}" cy="${f(cy + 4)}" rx="6" ry="3.5" fill="#FF8FB1" opacity="0.6"/>`;
    return s;
  }

  if (stage === 1) {
    // ---- Jeune oiseau de feu stellaire : debout, ailes entrouvertes, queue de flammes ----
    const cx = 104, by = 142, hy = 78;
    s += ground(cx + 10, gy, 66);
    // Queue : trois longues plumes-flammes vers la droite avec bouts d'étoile.
    const tails: [number, number, string][] = [[0.18, 84, pal.accent], [0.5, 78, pal.glow], [-0.12, 70, pal.accent2]];
    for (const [a, l, col] of tails) {
      s += feather(cx + 20, by + 26, a, l, 11, col, 2, -0.12);
      s += sparkle(cx + 20 + Math.cos(a) * (l + 6), by + 26 + Math.sin(a) * (l + 6), 5, pal.glow);
    }
    // Ailes entrouvertes (éventail de 4 plumes).
    for (const d of [-1, 1]) {
      const sx = cx + d * 26, sy = by - 18;
      for (let i = 0; i < 4; i++) {
        const a = -Math.PI / 2 + d * (0.55 + i * 0.32);
        s += feather(sx, sy, a, 56 - i * 6, 10, i % 2 ? pal.accent : pal.shade, 2, -d * 0.18);
      }
    }
    // Pattes.
    s += foot(cx - 13, gy - 2, 11, pal.glow) + foot(cx + 13, gy - 2, 11, pal.glow);
    // Corps ovoïde + cou.
    const body = `M${f(cx - 34)} ${f(by)} C${f(cx - 36)} ${f(by - 34)} ${f(cx - 20)} ${f(hy + 14)} ${f(cx)} ${f(hy + 12)} C${f(cx + 20)} ${f(hy + 14)} ${f(cx + 36)} ${f(by - 34)} ${f(cx + 34)} ${f(by)} C${f(cx + 32)} ${f(by + 38)} ${f(cx - 32)} ${f(by + 38)} ${f(cx - 34)} ${f(by)} Z`;
    s += ink(body, pal.body, 2.6);
    s += shadow(`M${f(cx + 16)} ${f(hy + 24)} C${f(cx + 36)} ${f(by - 30)} ${f(cx + 38)} ${f(by + 8)} ${f(cx + 22)} ${f(by + 30)} C${f(cx + 26)} ${f(by)} ${f(cx + 26)} ${f(by - 30)} ${f(cx + 16)} ${f(hy + 24)} Z`, pal.shade, 0.7);
    // Plastron en écailles de plumes.
    s += ink(`M${f(cx - 20)} ${f(by - 24)} C${f(cx - 26)} ${f(by + 20)} ${f(cx + 26)} ${f(by + 20)} ${f(cx + 20)} ${f(by - 24)} C${f(cx + 10)} ${f(by - 34)} ${f(cx - 10)} ${f(by - 34)} ${f(cx - 20)} ${f(by - 24)} Z`, pal.belly, 1.6);
    for (let r = 0; r < 3; r++) for (let i = -1; i <= 1; i++) s += line(`M${f(cx + i * 11 - 5 + (r % 2) * 5)} ${f(by - 16 + r * 11)} q5 5 10 0`, 1.2, pal.shade);
    // Aigrette : cinq flammes vers l'arrière.
    for (let i = 0; i < 5; i++) s += flame(cx - 8 + i * 5, hy - 20, 40 - Math.abs(i - 2) * 6, 6, 12 + i * 5, i % 2 ? pal.accent : pal.glow, 1.8);
    // Tête.
    s += ink(`M${f(cx - 30)} ${f(hy)} C${f(cx - 30)} ${f(hy - 36)} ${f(cx + 30)} ${f(hy - 36)} ${f(cx + 30)} ${f(hy)} C${f(cx + 30)} ${f(hy + 26)} ${f(cx - 30)} ${f(hy + 26)} ${f(cx - 30)} ${f(hy)} Z`, pal.body, 2.6);
    s += shine(`M${f(cx - 22)} ${f(hy - 12)} q6 -12 18 -14`, 2.2);
    s += eye(cx - 13, hy - 2, 9, pal.eye, 0.2) + eye(cx + 13, hy - 2, 9, pal.eye, 0.2);
    for (const d of [-1, 1]) s += line(`M${f(cx + d * 4)} ${f(hy - 12)} L${f(cx + d * 22)} ${f(hy - 16)}`, 2.4);
    s += beak(cx, hy + 9, 7, c);
    s += speckles(c, cx, by + 6, 14, 10, 5);
    s += sparkle(28, 70, 4, pal.glow) + sparkle(196, 60, 3.5, pal.glow);
    return s;
  }

  // ---- Stade 2+ : grand oiseau, ailes déployées en explosion d'étoile ----
  const cx = 111, by = 136, hy = 70;
  if (stage >= 3) s += aura(cx, 100, 100, pal.glow);
  s += ground(cx, gy + 2, 70);
  // Halo d'explosion d'étoile derrière.
  s += `<path d="${burst(cx, 96, 16, 52, 110, -Math.PI / 2)}" fill="${pal.glow}" opacity="0.28"/>`;
  s += ink(burst(cx, 96, 12, 40, 70, -Math.PI / 2 + 0.13), pal.glow, 1.4, ' opacity="0.8"');
  // Longues plumes de queue (derrière), qui retombent en s'écartant.
  const tails: [number, number, number, string][] = [[0.95, 70, 0.12, pal.accent2], [-0.95, 70, -0.12, pal.accent2], [0.42, 76, 0.1, pal.accent], [-0.42, 76, -0.1, pal.accent], [0, 80, 0, pal.glow]];
  for (const [o, l, b, col] of tails) {
    const a = Math.PI / 2 - o * 0.6;
    s += feather(cx, by + 20, a, l, 10, col, 2, b);
  }
  for (const o of [-0.95, 0.95]) s += sparkle(cx + Math.cos(Math.PI / 2 - o * 0.6) * 76, by + 20 + Math.sin(Math.PI / 2 - o * 0.6) * 74, 4.5, '#FFF6D8');
  // Ailes : rémiges rayonnant depuis le bras de l'aile (explosion d'étoile).
  for (const d of [-1, 1]) {
    const S: [number, number] = [cx + d * 22, by - 32], W: [number, number] = [cx + d * 66, 58];
    const N = 9;
    const at = (t: number): [number, number] => [S[0] + (W[0] - S[0]) * t, S[1] + (W[1] - S[1]) * t - Math.sin(t * Math.PI) * 10];
    // Rémiges inférieures (vers l'extérieur et le bas).
    for (let i = 0; i < 5; i++) {
      const a = Math.PI / 2 - d * (Math.PI / 2 + 0.25 - i * 0.2);
      s += feather(S[0] + d * 6, S[1] + 8, a, 70 - i * 6, 10, i % 2 ? pal.body : pal.shade, 2, d * 0.05);
    }
    // Rémiges principales le long du bras : de « vers l'extérieur-bas » à l'épaule à « vers le haut » au poignet.
    const armA = Math.atan2(W[1] - S[1], W[0] - S[0]);
    for (let i = N - 1; i >= 0; i--) {
      const t = i / (N - 1), [px, py] = at(t);
      const a = armA + d * (Math.PI / 2 * (1 - t) + 0.12 * t);
      const l = 46 + Math.sin(t * Math.PI) * 16 - t * 4;
      s += feather(px, py, a, l, 10, i % 2 ? pal.accent : pal.accent2, 2.2, -d * 0.08);
      if (i % 2 === 0) s += sparkle(px + Math.cos(a) * (l + 7), py + Math.sin(a) * (l + 7), i === N - 1 ? 5.5 : 4, '#FFF6D8');
    }
    // Bras de l'aile + couvertures en écailles.
    const [mx, my] = at(0.5);
    s += ink(`M${f(S[0] - d * 4)} ${f(S[1] + 4)} Q${f(mx - d * 6)} ${f(my - 12)} ${f(W[0])} ${f(W[1] - 6)} Q${f(W[0] + d * 6)} ${f(W[1] + 2)} ${f(W[0] + d * 2)} ${f(W[1] + 6)} Q${f(mx + d * 8)} ${f(my + 10)} ${f(S[0] + d * 10)} ${f(S[1] + 20)} Z`, pal.light, 2.2);
    for (let i = 0; i < 5; i++) {
      const [qx, qy] = at(0.08 + i * 0.2);
      s += line(`M${f(qx - 6)} ${f(qy + 4)} q6 7 12 0`, 1.3, pal.shade);
    }
    s += ink(burst(W[0], W[1] - 2, 5, 3, 8, -Math.PI / 2), pal.glow, 1.2);
  }
  // Corps.
  const body = `M${f(cx - 30)} ${f(by - 4)} C${f(cx - 34)} ${f(by - 36)} ${f(cx - 18)} ${f(hy + 18)} ${f(cx)} ${f(hy + 16)} C${f(cx + 18)} ${f(hy + 18)} ${f(cx + 34)} ${f(by - 36)} ${f(cx + 30)} ${f(by - 4)} C${f(cx + 26)} ${f(by + 36)} ${f(cx - 26)} ${f(by + 36)} ${f(cx - 30)} ${f(by - 4)} Z`;
  s += ink(body, pal.body, 2.6);
  s += shadow(`M${f(cx + 14)} ${f(hy + 26)} C${f(cx + 34)} ${f(by - 30)} ${f(cx + 34)} ${f(by + 8)} ${f(cx + 16)} ${f(by + 28)} C${f(cx + 21)} ${f(by)} ${f(cx + 21)} ${f(by - 30)} ${f(cx + 14)} ${f(hy + 26)} Z`, pal.shade, 0.7);
  s += ink(`M${f(cx - 17)} ${f(by - 34)} C${f(cx - 23)} ${f(by + 12)} ${f(cx + 23)} ${f(by + 12)} ${f(cx + 17)} ${f(by - 34)} C${f(cx + 8)} ${f(by - 42)} ${f(cx - 8)} ${f(by - 42)} ${f(cx - 17)} ${f(by - 34)} Z`, pal.belly, 1.6);
  // Cœur de supernova sur le poitrail.
  s += ink(burst(cx, by - 14, 8, 4.5, 11, -Math.PI / 2), pal.glow, 1.4);
  s += `<circle cx="${cx}" cy="${f(by - 14)}" r="3.2" fill="#FFF6D8"/>`;
  for (let r = 0; r < 2; r++) for (let i = -1; i <= 1; i += 2) s += line(`M${f(cx + i * 10 - 4)} ${f(by + 3 + r * 9)} q4 4 8 0`, 1.2, pal.shade);
  // Pattes.
  s += foot(cx - 11, by + 36, 9, pal.glow) + foot(cx + 11, by + 36, 9, pal.glow);
  // Couronne d'aigrette rayonnante.
  const crown = [30, 38, 44, 50, 44, 38, 30];
  for (let i = 0; i < 7; i++) {
    const a = -Math.PI / 2 + (i - 3) * 0.25;
    s += feather(cx + (i - 3) * 2.5, hy - 16, a, crown[i], 5.5, i % 2 ? pal.accent : pal.glow, 1.8);
  }
  for (const i of [0, 3, 6]) {
    const a = -Math.PI / 2 + (i - 3) * 0.25;
    s += sparkle(cx + (i - 3) * 2.5 + Math.cos(a) * (crown[i] + 5), hy - 16 + Math.sin(a) * (crown[i] + 5), i === 3 ? 6 : 4, '#FFF6D8');
  }
  // Tête fine, regard noble.
  s += ink(`M${f(cx - 24)} ${f(hy)} C${f(cx - 26)} ${f(hy - 30)} ${f(cx + 26)} ${f(hy - 30)} ${f(cx + 24)} ${f(hy)} C${f(cx + 22)} ${f(hy + 22)} ${f(cx - 22)} ${f(hy + 22)} ${f(cx - 24)} ${f(hy)} Z`, pal.body, 2.6);
  for (const d of [-1, 1]) s += ink(`M${f(cx + d * 3)} ${f(hy - 6)} C${f(cx + d * 12)} ${f(hy - 16)} ${f(cx + d * 26)} ${f(hy - 12)} ${f(cx + d * 36)} ${f(hy - 20)} C${f(cx + d * 28)} ${f(hy - 2)} ${f(cx + d * 16)} ${f(hy + 8)} ${f(cx + d * 3)} ${f(hy + 2)} Z`, pal.accent2, 1.4);
  s += shine(`M${f(cx - 18)} ${f(hy - 12)} q6 -10 14 -11`, 2);
  s += eye(cx - 11, hy - 3, 7, pal.eye, 0) + eye(cx + 11, hy - 3, 7, pal.eye, 0);
  for (const d of [-1, 1]) s += line(`M${f(cx + d * 3)} ${f(hy - 11)} L${f(cx + d * 19)} ${f(hy - 13)}`, 2.6);
  s += beak(cx, hy + 7, 7, c);
  s += speckles(c, cx, by - 8, 16, 26, 6);
  return s;
};
