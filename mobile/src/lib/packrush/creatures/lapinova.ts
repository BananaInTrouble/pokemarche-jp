import { aura, eye, ground, ink, line, shadow, shine, sparkle, type Species } from './style.ts';

const f = (v: number) => v.toFixed(1);

/** Petit cratère lunaire (tache sur le pelage). */
const crater = (x: number, y: number, r: number, fill: string) =>
  `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(r)}" ry="${f(r * 0.82)}" fill="${fill}" stroke="#1A1230" stroke-width="1.2" opacity="0.95"/>`
  + `<path d="M${f(x - r * 0.65)} ${f(y + r * 0.2)} Q${f(x)} ${f(y + r * 0.9)} ${f(x + r * 0.65)} ${f(y + r * 0.2)}" fill="none" stroke="#FFF6D8" stroke-width="1.3" stroke-linecap="round" opacity="0.8"/>`;

/** Oreille-antenne : de (bx,by) vers (tx,ty), largeur w, courbure bend ; pointe étoilée. */
function ear(bx: number, by: number, tx: number, ty: number, w: number, bend: number, body: string, inner: string, glow: string, star: number): string {
  const dx = tx - bx, dy = ty - by, L = Math.hypot(dx, dy);
  const nx = -dy / L, ny = dx / L; // normale
  const mx = bx + dx * 0.5 + nx * bend * 2, my = by + dy * 0.5 + ny * bend * 2;
  // Ligne médiane (quadratique) + profil de largeur : forme de feuille effilée.
  const N = 16;
  const at = (t: number, k: number) => {
    const u = 1 - t;
    const x = u * u * bx + 2 * u * t * mx + t * t * tx, y = u * u * by + 2 * u * t * my + t * t * ty;
    const gx = 2 * u * (mx - bx) + 2 * t * (tx - mx), gy = 2 * u * (my - by) + 2 * t * (ty - my), g = Math.hypot(gx, gy) || 1;
    const wd = w * k * (0.85 + Math.sin(Math.PI * Math.min(1, t * 1.1)) * 0.55) * (1 - t * 0.75);
    return [x - (gy / g) * wd, y + (gx / g) * wd, x + (gy / g) * wd, y - (gx / g) * wd];
  };
  const shape = (k: number, t0: number, t1: number) => {
    const a: string[] = [], b: string[] = [];
    for (let i = 0; i <= N; i++) {
      const t = t0 + ((t1 - t0) * i) / N;
      const [x1, y1, x2, y2] = at(t, k);
      a.push(`${f(x1)} ${f(y1)}`); b.unshift(`${f(x2)} ${f(y2)}`);
    }
    return `M${a.join(' L')} L${b.join(' L')} Z`;
  };
  const sx = tx + (dx / L) * star * 0.4, sy = ty + (dy / L) * star * 0.4;
  return ink(shape(1, 0, 1), body, 2.4) + ink(shape(0.5, 0.1, 0.86), inner, 1.4)
    + `<circle cx="${f(sx)}" cy="${f(sy)}" r="${f(star * 0.9)}" fill="${glow}" opacity="0.6" filter="url(#glow)"/>`
    + sparkle(sx, sy, star, glow);
}

/** Lapinova → Lunalièvre → Sélénalto : lièvre lunaire aux taches de cratères et oreilles-antennes étoilées. */
export const lapinova: Species = (c) => {
  const { pal, stage } = c;
  const st = Math.min(stage, 3);
  let s = '';

  if (st <= 1) {
    // ---- Assis, de face ----
    const cx = 111, gy = 204;
    const hr = st === 0 ? 40 : 33;
    const bodyH = st === 0 ? 56 : 76;
    const bw = st === 0 ? 36 : 34;
    const hy = gy - bodyH - hr * 0.45;
    s += ground(cx, gy + 2, 66);
    // Queue pompon (derrière, à droite).
    s += ink(`M${f(cx + bw - 2)} ${f(gy - 22)} c10 -12 28 -4 22 10 c4 10 -12 16 -20 8 Z`, pal.belly, 2.2);
    // Corps.
    const body = `M${f(cx - bw)} ${f(gy)} C${f(cx - bw - 10)} ${f(gy - bodyH * 0.6)} ${f(cx - bw * 0.5)} ${f(gy - bodyH)} ${f(cx)} ${f(gy - bodyH - 2)} C${f(cx + bw * 0.5)} ${f(gy - bodyH)} ${f(cx + bw + 10)} ${f(gy - bodyH * 0.6)} ${f(cx + bw)} ${f(gy)} Z`;
    s += ink(body, pal.body, 2.6);
    s += shadow(`M${f(cx + bw * 0.4)} ${f(gy - bodyH * 0.92)} C${f(cx + bw + 8)} ${f(gy - bodyH * 0.6)} ${f(cx + bw + 6)} ${f(gy - bodyH * 0.2)} ${f(cx + bw)} ${f(gy)} L${f(cx + bw * 0.5)} ${f(gy)} C${f(cx + bw * 0.8)} ${f(gy - bodyH * 0.3)} ${f(cx + bw * 0.8)} ${f(gy - bodyH * 0.6)} ${f(cx + bw * 0.4)} ${f(gy - bodyH * 0.92)} Z`, pal.shade, 0.65);
    s += ink(`M${f(cx - 16)} ${f(gy - 4)} C${f(cx - 20)} ${f(gy - bodyH * 0.55)} ${f(cx - 10)} ${f(gy - bodyH * 0.86)} ${f(cx)} ${f(gy - bodyH * 0.88)} C${f(cx + 10)} ${f(gy - bodyH * 0.86)} ${f(cx + 20)} ${f(gy - bodyH * 0.55)} ${f(cx + 16)} ${f(gy - 4)} Z`, pal.belly, 1.6);
    s += crater(cx - bw * 0.72, gy - bodyH * 0.42, 5, pal.light) + crater(cx + bw * 0.62, gy - bodyH * 0.52, 4, pal.light);
    if (st === 1) s += crater(cx - bw * 0.5, gy - bodyH * 0.18, 3.4, pal.light);
    // Grands pieds arrière + pattes avant.
    for (const dir of [-1, 1]) {
      s += ink(`M${f(cx + dir * 8)} ${f(gy + 2)} C${f(cx + dir * 8)} ${f(gy - 10)} ${f(cx + dir * 40)} ${f(gy - 10)} ${f(cx + dir * 42)} ${f(gy - 1)} C${f(cx + dir * 42)} ${f(gy + 4)} ${f(cx + dir * 10)} ${f(gy + 5)} ${f(cx + dir * 8)} ${f(gy + 2)} Z`, pal.light, 2.2);
      s += ink(`M${f(cx + dir * 4)} ${f(gy - 6)} C${f(cx + dir * 2)} ${f(gy - 22)} ${f(cx + dir * 18)} ${f(gy - 24)} ${f(cx + dir * 18)} ${f(gy - 8)} C${f(cx + dir * 16)} ${f(gy - 2)} ${f(cx + dir * 6)} ${f(gy - 2)} ${f(cx + dir * 4)} ${f(gy - 6)} Z`, pal.body, 2);
      s += line(`M${f(cx + dir * 9)} ${f(gy - 4)} l0 -3 M${f(cx + dir * 13)} ${f(gy - 4)} l0 -3`, 1.2);
    }
    // Oreilles-antennes.
    if (st === 0) {
      s += ear(cx - hr * 0.4, hy - hr * 0.7, cx - hr * 1.2, hy - hr * 1.9, 9, -10, pal.body, pal.accent, pal.glow, 7);
      // L'autre oreille retombe, toute molle.
      s += ear(cx + hr * 0.4, hy - hr * 0.72, cx + hr * 1.5, hy - hr * 1.15, 9, -12, pal.body, pal.accent, pal.glow, 7);
    } else {
      s += ear(cx - hr * 0.35, hy - hr * 0.75, cx - hr * 0.95, hy - hr * 2.6, 9.5, -8, pal.body, pal.accent, pal.glow, 8);
      s += ear(cx + hr * 0.35, hy - hr * 0.75, cx + hr * 1.1, hy - hr * 2.5, 9.5, 10, pal.body, pal.accent, pal.glow, 8);
    }
    // Tête ronde aux joues duveteuses.
    const head = `M${f(cx - hr)} ${f(hy)} C${f(cx - hr)} ${f(hy - hr * 1.05)} ${f(cx + hr)} ${f(hy - hr * 1.05)} ${f(cx + hr)} ${f(hy)} L${f(cx + hr * 1.1)} ${f(hy + hr * 0.3)} L${f(cx + hr * 0.9)} ${f(hy + hr * 0.36)} C${f(cx + hr * 0.7)} ${f(hy + hr * 0.82)} ${f(cx - hr * 0.7)} ${f(hy + hr * 0.82)} ${f(cx - hr * 0.9)} ${f(hy + hr * 0.36)} L${f(cx - hr * 1.1)} ${f(hy + hr * 0.3)} Z`;
    s += ink(head, pal.body, 2.6);
    s += shadow(`M${f(cx + hr * 0.5)} ${f(hy - hr * 0.72)} C${f(cx + hr * 1.02)} ${f(hy - hr * 0.3)} ${f(cx + hr * 1.0)} ${f(hy + hr * 0.2)} ${f(cx + hr * 0.82)} ${f(hy + hr * 0.4)} C${f(cx + hr * 0.82)} ${f(hy)} ${f(cx + hr * 0.75)} ${f(hy - hr * 0.4)} ${f(cx + hr * 0.5)} ${f(hy - hr * 0.72)} Z`, pal.shade, 0.55);
    s += ink(`M${f(cx - hr * 0.42)} ${f(hy + hr * 0.3)} C${f(cx - hr * 0.4)} ${f(hy + hr * 0.72)} ${f(cx + hr * 0.4)} ${f(hy + hr * 0.72)} ${f(cx + hr * 0.42)} ${f(hy + hr * 0.3)} C${f(cx + hr * 0.2)} ${f(hy + hr * 0.14)} ${f(cx - hr * 0.2)} ${f(hy + hr * 0.14)} ${f(cx - hr * 0.42)} ${f(hy + hr * 0.3)} Z`, pal.belly, 1.4);
    s += crater(cx + hr * 0.42, hy - hr * 0.55, hr * 0.13, pal.light);
    s += shine(`M${f(cx - hr * 0.72)} ${f(hy - hr * 0.42)} q6 -12 18 -16`, 2.2);
    // Croissant de lune au front.
    s += ink(`M${f(cx - 6)} ${f(hy - hr * 0.68)} a8 8 0 1 0 12 0 a6 6 0 1 1 -12 0 Z`, pal.glow, 1.3);
    const er = hr * (st === 0 ? 0.28 : 0.25);
    s += eye(cx - hr * 0.42, hy + hr * 0.02, er, pal.eye, 0.1) + eye(cx + hr * 0.42, hy + hr * 0.02, er, pal.eye, 0.1);
    s += ink(`M${f(cx - 4)} ${f(hy + hr * 0.3)} Q${f(cx)} ${f(hy + hr * 0.26)} ${f(cx + 4)} ${f(hy + hr * 0.3)} Q${f(cx)} ${f(hy + hr * 0.4)} ${f(cx - 4)} ${f(hy + hr * 0.3)} Z`, '#FF8FB1', 1.2);
    s += line(`M${f(cx)} ${f(hy + hr * 0.38)} l0 4 M${f(cx - 6)} ${f(hy + hr * 0.5)} q3 3 6 0 q3 3 6 0`, 1.4);
    // Moustaches.
    s += line(`M${f(cx - hr * 0.5)} ${f(hy + hr * 0.4)} l-14 -3 M${f(cx - hr * 0.5)} ${f(hy + hr * 0.48)} l-14 3 M${f(cx + hr * 0.5)} ${f(hy + hr * 0.4)} l14 -3 M${f(cx + hr * 0.5)} ${f(hy + hr * 0.48)} l14 3`, 1.2);
    s += `<ellipse cx="${f(cx - hr * 0.66)}" cy="${f(hy + hr * 0.36)}" rx="5" ry="3" fill="#FF8FB1" opacity="0.6"/><ellipse cx="${f(cx + hr * 0.66)}" cy="${f(hy + hr * 0.36)}" rx="5" ry="3" fill="#FF8FB1" opacity="0.6"/>`;
    s += sparkle(cx - 74, hy - 10, 4.5, pal.glow) + sparkle(cx + 78, gy - 60, 3.5, '#FFF6D8');
    return s;
  }

  // ---- Stade 2+ : grand lièvre élancé en plein bond (profil, vers la gauche) ----
  if (st >= 3) s += aura(118, 110, 100, pal.glow);
  s += ground(116, 206, 76);
  // Traînée de poussière d'étoiles derrière.
  s += line('M150 188 Q176 178 204 186 M162 198 Q184 192 214 196 M140 176 Q158 168 178 170', 2, pal.glow, ' opacity="0.7"');
  for (const [x, y, r] of [[204, 168, 4], [212, 186, 3], [188, 196, 2.5], [180, 162, 2]]) s += sparkle(x, y, r + 1, '#FFF6D8', r > 2.5);

  // Patte arrière lointaine (sombre).
  s += ink('M150 122 C168 132 184 150 196 160 C206 168 214 170 216 176 C208 180 192 176 182 168 C168 158 150 148 138 140 Z', pal.shade, 2.2);
  // Patte avant lointaine.
  s += ink('M76 132 C64 144 50 154 36 158 C30 160 28 166 34 168 C48 168 64 160 86 144 Z', pal.shade, 2.2);
  // Oreille lointaine (rabattue en arrière).
  s += ear(66, 62, 150, 30, 8, -12, pal.shade, pal.accent, pal.glow, 7);

  // Corps allongé, incliné.
  const body = 'M58 106 C70 88 110 86 146 94 C172 100 182 122 168 138 C154 152 114 150 88 142 C68 136 52 122 58 106 Z';
  s += ink(body, pal.body, 2.6);
  s += shadow('M100 146 C126 152 156 150 168 138 C180 124 176 106 164 98 C170 120 156 140 100 146 Z', pal.shade, 0.6);
  s += ink('M60 114 C64 132 84 144 112 147 C104 136 90 130 80 116 C74 108 64 106 60 114 Z', pal.belly, 1.6);
  s += crater(118, 104, 6, pal.light) + crater(140, 118, 4.5, pal.light) + crater(104, 126, 3.5, pal.light) + crater(152, 100, 3, pal.light);
  s += shine('M80 94 q16 -10 34 -10', 2.2);
  // Queue pompon.
  s += ink('M172 104 c8 -14 28 -10 26 4 c6 10 -10 20 -22 12 Z', pal.belly, 2.2);
  // Cuisse + patte arrière proche, tendue en arrière.
  s += ink('M134 112 C160 104 180 124 172 146 C184 156 200 164 212 168 C222 172 220 182 210 182 C190 182 168 170 150 160 C132 152 120 126 134 112 Z', pal.body, 2.4);
  s += line('M150 150 q10 -10 6 -24', 1.4, pal.shade);
  s += line('M206 174 l-4 6 M200 172 l-4 7', 1.2);
  // Patte avant proche, tendue vers l'avant.
  s += ink('M70 126 C60 140 44 150 26 152 C18 154 18 162 26 164 C46 164 66 154 88 138 Z', pal.body, 2.4);
  s += line('M28 156 l-3 5 M34 156 l-2 6', 1.2);

  // Tête de profil (museau vers la gauche).
  const head = 'M30 76 C28 58 46 46 66 46 C86 46 98 60 94 76 C90 90 76 96 60 96 C46 96 36 92 26 88 C18 86 18 78 30 76 Z';
  s += ink(head, pal.body, 2.6);
  s += shadow('M80 50 C94 58 98 74 92 84 C86 94 74 98 62 96 C82 88 90 70 80 50 Z', pal.shade, 0.55);
  s += ink('M24 84 C28 90 38 94 52 94 C48 88 44 82 42 76 C36 76 28 78 24 84 Z', pal.belly, 1.4);
  s += ink('M20 81 q3 -4 6 0 q-3 4 -6 0 Z', '#FF8FB1', 1.2);
  s += line('M26 88 q6 4 12 0', 1.4);
  s += line('M30 82 l-18 -5 M30 84 l-18 3', 1.1);
  s += shine('M52 54 q8 -6 18 -6', 2);
  s += eye(56, 66, 9, pal.eye, -0.6);
  s += `<ellipse cx="66" cy="82" rx="5" ry="3" fill="#FF8FB1" opacity="0.55"/>`;
  s += sparkle(42, 60, 4.5, pal.glow);
  // Oreille proche, longue antenne étoilée qui flotte vers l'arrière.
  s += ear(76, 56, 172, 22, 9.5, -16, pal.body, pal.accent, pal.glow, 9);

  s += sparkle(28, 26, 5, pal.glow) + sparkle(196, 60, 4, '#FFF6D8') + sparkle(120, 36, 3.5, pal.glow);
  if (st >= 3) {
    s += line('M84 112 L104 104 L118 116 L140 108', 1.2, pal.glow, ' opacity="0.9"');
    s += sparkle(20, 120, 5, pal.glow) + sparkle(110, 186, 4, pal.glow);
  }
  return s;
};
