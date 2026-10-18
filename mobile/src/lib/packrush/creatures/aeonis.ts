import { aura, eye, ground, ink, line, shadow, shine, sparkle, speckles, type Species } from './style.ts';

/**
 * Aeonis : tortue-monde ancestrale (mythique, carte plein cadre). Sur sa carapace tourne une galaxie spirale
 * posée comme un disque ; au centre se dressent des montagnes enneigées et un arbre de lumière.
 */
export const aeonis: Species = (c) => {
  const { pal } = c;
  const CREAM = '#FFF6D8';
  const f = (v: number) => v.toFixed(1);
  const night = (d: string, op = 0.4) => ink(d, pal.shade) + `<path d="${d}" fill="${pal.ink}" opacity="${op}"/>`;
  let s = '';

  s += aura(124, 30, 80, pal.glow);
  s += aura(111, 170, 100, pal.accent2);
  s += ground(116, 250, 96);

  // Pattes lointaines (derrière la carapace).
  s += night('M150 196 C150 222 152 238 150 248 C158 254 180 254 184 246 C180 232 180 214 182 196 Z', 0.45);
  s += night('M82 200 C82 222 84 236 82 246 C90 252 108 252 112 244 C110 230 110 214 112 200 Z', 0.45);

  // Pattes proches (le haut est caché par le bord de carapace).
  const leg = (x: number, w: number) => {
    const d = `M${x - w} 176 C${x - w - 2} 218 ${x - w - 4} 236 ${x - w - 6} 248 C${x - w} 256 ${x + w} 256 ${x + w + 4} 248 C${x + w + 2} 232 ${x + w} 214 ${x + w} 176 Z`;
    return ink(d, pal.body, 2.6)
      + shadow(`M${x + w * 0.3} 180 C${x + w * 0.4} 220 ${x + w * 0.4} 236 ${x + w * 0.6} 250 C${x + w} 252 ${x + w + 4} 250 ${x + w + 4} 248 C${x + w + 2} 232 ${x + w} 214 ${x + w} 176 Z`, pal.shade, 0.7)
      + line(`M${x - w + 2} 214 q${w} 5 ${w * 2 - 2} 0 M${x - w + 1} 228 q${w} 5 ${w * 2} 0`, 1.4)
      + ink(`M${x - w - 2} 250 l3 -7 l4 7 Z M${x - 3} 252 l3 -8 l4 8 Z M${x + w - 4} 251 l4 -7 l3 7 Z`, CREAM, 1.2);
  };
  s += leg(66, 17) + leg(168, 16);
  // Queue.
  s += ink('M196 182 C210 184 222 194 224 208 C214 202 204 200 192 198 Z', pal.body, 2.2);

  // Carapace : dôme + bord festonné.
  const dome = 'M24 176 C26 132 66 112 118 112 C170 112 210 132 212 176 Z';
  s += ink(dome, pal.body, 2.8);
  s += shadow('M150 114 C188 122 210 142 212 176 L172 176 C176 150 168 128 150 114 Z', pal.shade, 0.75);
  // Écailles hexagonales.
  const plate = (x: number, y: number, w: number, h: number) =>
    ink(`M${f(x - w)} ${f(y)} L${f(x - w * 0.5)} ${f(y - h)} L${f(x + w * 0.5)} ${f(y - h)} L${f(x + w)} ${f(y)} L${f(x + w * 0.5)} ${f(y + h)} L${f(x - w * 0.5)} ${f(y + h)} Z`, pal.light, 1.6);
  s += plate(60, 158, 14, 12) + plate(94, 150, 15, 13) + plate(132, 150, 15, 13) + plate(170, 158, 14, 12);
  s += line('M44 158 L60 146 M60 170 L58 176 M94 163 L94 176 M132 163 L132 176 M170 170 L172 176 M190 158 L184 146', 1.4);
  for (const [x, y] of [[60, 158], [94, 150], [132, 150], [170, 158]]) s += sparkle(x, y, 4, pal.glow, false);
  // Bord de carapace.
  s += ink('M18 172 L214 172 L216 180 C180 200 56 200 16 180 Z', pal.shade, 2.4);
  s += line('M30 184 l4 6 M60 188 l2 7 M94 190 l0 7 M130 190 l0 7 M164 188 l-2 7 M194 184 l-4 6', 1.4);

  // Plastron + pattes proches.

  // Disque galactique posé sur la carapace.
  const gx = 120, gy = 116, grx = 104, gry = 28;
  s += `<ellipse cx="${gx}" cy="${gy}" rx="${grx + 6}" ry="${gry + 6}" fill="${pal.accent2}" opacity="0.35" filter="url(#soft)"/>`;
  s += `<ellipse cx="${gx}" cy="${gy}" rx="${grx}" ry="${gry}" fill="${pal.shade}" stroke="${pal.ink}" stroke-width="2.4"/>`;
  s += `<ellipse cx="${gx}" cy="${gy}" rx="${grx}" ry="${gry}" fill="${pal.ink}" opacity="0.45"/>`;
  for (let k = 0; k < 3; k++) {
    let d = '';
    for (let i = 0; i <= 28; i++) {
      const t = i / 28, th = k * (Math.PI * 2 / 3) + t * Math.PI * 1.7, rr = 10 + t * (grx - 12);
      d += `${i ? 'L' : 'M'}${f(gx + Math.cos(th) * rr)} ${f(gy + Math.sin(th) * rr * (gry / grx))}`;
    }
    s += line(d, 7, pal.accent, ' opacity="0.55"') + line(d, 2.4, pal.glow, ' opacity="0.95"');
  }
  s += speckles(c, gx, gy, grx - 8, gry - 4, 40);
  s += `<ellipse cx="${gx}" cy="${gy}" rx="22" ry="8" fill="${CREAM}" opacity="0.9"/>`;
  s += shine(`M${gx - 80} ${gy - 16} q40 -14 90 -12`, 1.8);

  // Cou et tête ancestrale (à gauche, devant le disque).
  s += ink('M84 182 C66 184 52 176 44 164 L64 144 C68 158 76 168 90 172 Z', pal.body, 2.4);
  s += line('M54 160 q6 6 14 4 M50 170 q8 5 16 2', 1.3);
  const head = 'M66 156 C68 132 50 118 28 120 C8 122 -6 136 -4 154 C-2 170 12 182 30 184 C48 186 64 174 66 156 Z';
  s += ink(head, pal.body, 2.8);
  s += shadow('M66 156 C68 132 50 118 28 120 C48 128 58 146 52 178 C60 172 66 164 66 156 Z', pal.shade, 0.7);
  // Plaques du crâne, arcade lourde, cornes de cristal.
  s += ink('M24 122 C34 118 46 120 52 126 L44 132 C38 128 30 126 24 128 Z', pal.light, 1.6);
  s += ink('M44 128 L58 98 L58 134 Z', pal.accent, 1.8) + ink('M54 136 L74 116 L66 146 Z', pal.accent, 1.8);
  s += shine('M54 110 l2 -8', 1.6) + shine('M64 126 l4 -5', 1.4);
  s += ink('M6 140 C14 128 34 126 46 134 C36 134 22 136 10 146 Z', pal.shade, 2);
  s += eye(26, 146, 7, pal.eye, -0.6);
  s += ink('M18.4 147 C17 135 35 135 33.6 147 C29 143 23 143 18.4 147 Z', pal.body, 1.8);
  s += line('M14 138 q12 -6 24 -1', 2.4);
  s += line('M30 158 q4 3 10 1', 1.3);
  // Bec ancien et narine.
  s += line('M-4 160 C6 166 18 166 30 162', 2);
  s += `<circle cx="0" cy="150" r="1.8" fill="${pal.ink}"/>`;
  // Barbe de filaments lumineux.
  s += line('M6 170 q-6 16 0 30 M16 176 q-4 16 4 30 M28 180 q0 14 8 26 M40 180 q4 10 12 16', 2.2, CREAM, ' opacity="0.9"');
  s += sparkle(6, 200, 3.2, pal.glow, false) + sparkle(20, 206, 3, pal.glow, false) + sparkle(36, 206, 2.6, pal.glow, false);
  s += shine('M6 134 q8 -8 18 -10', 2.2);

  // Montagnes enneigées au centre du disque.
  const mount = (x0: number, peak: number, x1: number, py: number, fill: string) =>
    ink(`M${x0} ${gy + 4} L${peak - 6} ${py + 6} L${peak} ${py} L${peak + 7} ${py + 8} L${x1} ${gy + 4} Q${(x0 + x1) / 2} ${gy + 10} ${x0} ${gy + 4} Z`, fill, 2.2)
    + ink(`M${peak - 6} ${py + 6} L${peak} ${py} L${peak + 7} ${py + 8} L${peak + 3} ${py + 14} L${peak - 1} ${py + 9} L${peak - 5} ${py + 15} Z`, CREAM, 1.4)
    + shadow(`M${peak} ${py} L${peak + 7} ${py + 8} L${x1} ${gy + 4} L${peak + 4} ${gy + 6} Z`, pal.shade, 0.7);
  s += mount(66, 88, 108, 78, pal.light);
  s += mount(148, 160, 178, 86, pal.light);
  s += mount(90, 120, 152, 52, pal.body);

  // Arbre de lumière sur le pic central.
  s += aura(120, 6, 58, pal.glow);
  for (let i = 0; i < 12; i++) {
    const th = (i / 12) * Math.PI * 2 + 0.2;
    s += line(`M${f(120 + Math.cos(th) * 58)} ${f(4 + Math.sin(th) * 46)} L${f(120 + Math.cos(th) * 72)} ${f(4 + Math.sin(th) * 58)}`, 2, pal.glow, ' opacity="0.7"');
  }
  const canopy = 'M72 14 C62 -6 82 -26 102 -20 C108 -34 134 -34 140 -20 C160 -26 180 -6 168 14 C178 30 154 42 140 32 C128 42 110 42 100 32 C84 42 60 30 72 14 Z';
  s += ink(canopy, pal.glow, 2.4);
  s += shadow('M168 14 C178 30 154 42 140 32 C128 42 110 42 100 32 C84 42 66 32 72 22 C100 30 140 30 168 14 Z', pal.accent, 0.5);
  s += `<ellipse cx="116" cy="-4" rx="30" ry="18" fill="${CREAM}" opacity="0.55"/>`;
  // Tronc et branches.
  s += ink('M113 58 C118 46 116 34 110 24 C104 16 96 12 86 10 C98 9 106 13 113 19 C113 11 115 3 115 -6 C120 3 122 11 122 19 C128 11 136 5 148 3 C139 11 131 19 128 29 C126 41 126 50 129 58 Z', pal.belly, 2);
  s += shadow('M122 19 C128 11 136 5 148 3 C139 11 131 19 128 29 C126 41 126 50 129 58 L122 58 C124 46 123 32 122 19 Z', pal.shade, 0.6);
  for (const [x, y, r] of [[90, -2, 5], [122, -18, 5.5], [150, -8, 5], [100, 22, 4], [146, 24, 4], [78, 18, 3.5], [162, 6, 3.5], [134, 4, 3]]) {
    s += `<circle cx="${x}" cy="${y}" r="${r}" fill="${CREAM}" stroke="${pal.ink}" stroke-width="1.2"/>`;
  }
  s += shine('M84 -6 q10 -12 22 -12', 2.2);
  s += sparkle(120, -30, 7, CREAM) + sparkle(178, -16, 4, pal.glow) + sparkle(62, -10, 3.5, pal.glow);
  // Lucioles tombant de l'arbre.
  for (const [x, y] of [[80, 44], [166, 48], [98, 62], [150, 64]]) s += sparkle(x, y, 2.6, CREAM, false);

  s += sparkle(206, 90, 5, pal.glow) + sparkle(14, 96, 4, CREAM) + sparkle(210, 150, 3, CREAM);
  return s;
};
