import { aura, ink, line, shadow, shine, sparkle, speckles, type Species } from './style.ts';

/**
 * Lunaphage : grand loup cosmique (mythique, carte plein cadre). Sa fourrure est une nuit étoilée parcourue de
 * constellations ; assis, tête renversée, il hurle devant une pleine lune dont il a déjà arraché une bouchée :
 * les éclats de lune dérivent vers sa gueule.
 */
export const lunaphage: Species = (c) => {
  const { pal } = c;
  const CREAM = '#FFF6D8';
  const f = (v: number) => v.toFixed(1);
  let s = '';

  // Halo lunaire + lune mordue (derrière tout).
  const mx = 130, my = 34, mr = 66;
  s += aura(mx, my, mr + 34, pal.glow);
  s += aura(118, 160, 95, pal.accent2);
  // Bouchée : cercle (bx, by, br) retiré du disque lunaire, côté gueule.
  const bx = 70, by = 64, br = 26;
  const dd = Math.hypot(bx - mx, by - my);
  const a = (mr * mr - br * br + dd * dd) / (2 * dd), hh = Math.sqrt(mr * mr - a * a);
  const ux = (bx - mx) / dd, uy = (by - my) / dd;
  const p1 = [mx + a * ux - hh * uy, my + a * uy + hh * ux], p2 = [mx + a * ux + hh * uy, my + a * uy - hh * ux];
  const moon = `M${f(p1[0])} ${f(p1[1])} A${br} ${br} 0 0 1 ${f(p2[0])} ${f(p2[1])} A${mr} ${mr} 0 1 0 ${f(p1[0])} ${f(p1[1])} Z`;
  s += ink(moon, CREAM, 2.6);
  // Terminateur (ombre du croissant) et cratères.
  s += shadow(`M${f(mx + 20)} ${f(my - mr + 2)} A${mr} ${mr} 0 0 1 ${f(mx + 30)} ${f(my + mr - 6)} C${f(mx + 58)} ${f(my + 30)} ${f(mx + 60)} ${f(my - 30)} ${f(mx + 20)} ${f(my - mr + 2)} Z`, pal.light, 0.8);
  for (const [x, y, r] of [[150, 4, 9], [112, 10, 6], [160, 46, 7], [128, 68, 5], [104, -14, 4], [176, 20, 4]]) {
    s += `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.8}" fill="${pal.light}" stroke="${pal.ink}" stroke-width="1.3" opacity="0.9"/>`;
    s += line(`M${x - r * 0.6} ${y + r * 0.3} q${r * 0.6} ${r * 0.5} ${r * 1.2} 0`, 1, '#FFFFFF', ' opacity="0.8"');
  }
  s += shine(`M${mx - 44} ${my - 26} q10 -22 34 -32`, 3);
  // Éclats de lune happés vers la gueule.
  for (const [x, y, k] of [[50, 92, 5], [36, 82, 4], [28, 98, 3], [44, 108, 2.6]]) {
    s += ink(`M${x - k} ${y} L${x - k * 0.2} ${y - k} L${x + k} ${y - k * 0.3} L${x + k * 0.4} ${y + k * 0.9} Z`, CREAM, 1.3);
  }
  s += line('M58 98 q-12 -2 -20 -12 M46 112 q-10 -4 -14 -10', 1.3, CREAM, ' opacity="0.7"');

  // Queue de nébuleuse (derrière le corps), qui s'enroule vers l'avant et remonte à gauche.
  const tail = 'M188 226 C164 262 92 262 50 250 C14 238 0 204 10 170 C14 156 32 152 32 168 C30 196 46 222 80 230 C120 238 160 230 182 204 Z';
  s += ink(tail, pal.accent, 2.6);
  s += shadow('M188 226 C164 262 92 262 50 250 C14 238 0 204 10 170 C8 206 34 236 84 242 C130 246 168 240 188 226 Z', pal.accent2, 0.6);
  s += shadow('M10 170 C14 156 32 152 32 168 C26 164 18 166 10 170 Z', pal.shade, 0.6);
  s += line('M22 176 q2 30 30 50 M40 238 q50 12 110 -4', 1.6, CREAM, ' opacity="0.6"');
  s += speckles(c, 60, 236, 46, 10, 14);
  s += speckles(c, 20, 196, 8, 24, 6);

  // Fourrure « nuit » : teinte sombre + voile d'encre.
  const fur = pal.shade;
  const night = (d: string, op = 0.5) => ink(d, fur) + `<path d="${d}" fill="${pal.ink}" opacity="${op}"/>`;

  // Patte avant lointaine.
  s += night('M102 178 L104 242 C104 250 126 250 124 243 L122 186 Z', 0.55);
  // Corps assis.
  const body = 'M98 88 C70 116 56 160 62 202 C66 232 98 246 140 246 L200 246 C218 230 220 186 200 158 C184 134 162 112 146 92 Z';
  s += night(body);
  // Cuisse arrière.
  const haunch = 'M146 178 C158 140 214 152 208 206 C204 240 164 250 148 232 C140 220 140 196 146 178 Z';
  s += night(haunch, 0.25);
  s += shadow('M208 206 C204 240 164 250 148 232 C170 236 196 226 208 206 Z', pal.ink, 0.5);
  s += line('M158 170 q20 -10 40 6', 1.6, pal.body, ' opacity="0.8"');
  // Voie lactée qui traverse le pelage.
  s += `<path d="M146 104 C170 130 150 170 176 196 C190 210 206 206 210 196 C200 214 172 214 158 196 C138 170 156 132 136 110 Z" fill="${CREAM}" opacity="0.16"/>`;
  s += speckles(c, 166, 160, 16, 40, 16);
  // Mèches du dos et liseré de lumière lunaire.
  s += line('M150 98 l8 2 M162 112 l9 1 M174 128 l9 0 M186 144 l8 -1', 1.6);
  s += line('M148 96 C164 112 182 132 196 156', 1.8, pal.light, ' opacity="0.75"');
  // Patte arrière.
  s += night('M150 234 C148 252 206 252 206 242 C206 232 182 230 162 230 Z', 0.2);
  s += line('M186 244 l0 5 M194 243 l0 5', 1.3);
  // Patte avant proche.
  s += night('M66 172 C64 206 70 230 64 243 C64 252 100 253 100 245 C96 230 98 206 100 180 Z', 0.2);
  s += line('M76 245 l0 6 M86 245 l0 6', 1.4);
  s += shine('M71 190 q-2 24 0 44', 1.8);

  // Collerette de crinière (lumière lunaire sur le poitrail).
  const ruff = 'M96 74 C80 92 70 112 66 134 L76 128 L70 150 L82 140 L80 162 L92 148 L96 168 L104 150 L114 160 L116 140 L128 146 L126 124 L140 126 C140 104 132 86 120 74 Z';
  s += ink(ruff, pal.body, 2.4);
  s += shadow('M120 74 C132 86 140 104 140 126 L126 124 L128 146 L116 140 C122 118 122 94 120 74 Z', pal.shade, 0.75);
  s += line('M84 112 l6 10 M96 120 l4 12 M108 118 l2 12 M90 96 l6 8', 1.4);
  s += line('M80 106 q-4 12 -6 22', 1.8, CREAM, ' opacity="0.8"');

  // Constellations sur la fourrure.
  const stars: number[][] = [[156, 190], [176, 176], [190, 196], [180, 218], [80, 196], [86, 222], [116, 210], [138, 120], [160, 140]];
  s += line('M156 190 L176 176 L190 196 L180 218 M80 196 L86 222 L116 210 M138 120 L160 140', 1, pal.glow, ' opacity="0.75"');
  for (const [x, y] of stars) s += sparkle(x, y, 3.2, pal.glow, false);
  s += speckles(c, 150, 196, 44, 40, 26);
  s += speckles(c, 90, 210, 18, 30, 8);

  // Oreilles (dressées, en contre-jour sur la lune).
  s += night('M122 58 L154 10 C160 28 158 50 150 68 Z', 0.5);
  s += night('M104 50 L124 2 C134 20 138 42 134 60 Z', 0.3);
  s += ink('M112 48 L124 14 C130 28 132 42 128 54 Z', pal.accent, 1.4);

  // Tête renversée, gueule grande ouverte vers la lune.
  const skull = 'M142 84 C146 56 132 34 110 30 C100 29 94 30 86 22 C76 12 62 6 50 0 C40 -4 28 6 34 14 L50 28 C62 38 74 48 88 56 C104 68 122 82 142 84 Z';
  const jaw = 'M90 58 L52 60 C42 60 40 68 46 71 C62 80 82 90 102 98 C118 103 136 98 142 86 C122 86 104 74 90 58 Z';
  // Intérieur de la gueule.
  s += ink('M46 22 L92 58 L48 64 C44 50 44 36 46 22 Z', pal.ink, 2);
  s += ink('M52 56 C64 52 76 54 88 58 L56 62 Z', pal.accent, 1);
  s += night(jaw, 0.3);
  s += night(skull, 0.12);
  s += shadow('M142 84 C146 56 132 34 110 30 C124 42 132 62 130 84 Z', pal.ink, 0.45);
  s += night('M128 66 L154 74 L142 82 L156 92 L138 94 L146 106 L122 100 Z', 0.3);
  s += line('M140 82 l-8 2 M140 94 l-9 0', 1.3);
  // Crocs.
  s += ink('M50 30 l3 10 l4 -7 Z', CREAM, 1.1) + ink('M74 46 l1 8 l5 -5 Z', CREAM, 1.1) + ink('M52 62 l2 -9 l4 8 Z', CREAM, 1.1) + ink('M70 60 l2 -6 l3 6 Z', CREAM, 1.1);
  // Éclat de lune happé entre les mâchoires.
  s += ink('M58 46 a9 9 0 1 0 12 -8 a7 7 0 1 1 -12 8 Z', CREAM, 1.4);
  // Truffe, arête du museau, reflets de lune.
  s += ink('M30 8 C32 0 42 0 44 8 C42 14 32 14 30 8 Z', pal.ink, 1.2);
  s += shine('M58 8 q14 6 26 14', 2.4);
  s += line('M88 26 q8 -4 18 -2', 1.6, pal.body, ' opacity="0.9"');
  s += line('M54 74 q20 10 40 20', 1.4, pal.body, ' opacity="0.7"');
  // Œil plissé lumineux.
  s += ink('M94 48 C100 41 112 41 116 48 C110 53 100 53 94 48 Z', pal.glow, 1.6);
  s += `<circle cx="106" cy="47.5" r="2.2" fill="${pal.ink}"/>`;
  s += line('M92 43 q12 -9 27 -2', 2);
  s += line('M118 50 l8 3', 1.4);
  // Croissant au front.
  s += ink('M122 58 a7 7 0 1 0 8 10 a5.5 5.5 0 1 1 -8 -10 Z', pal.glow, 1.2);
  s += speckles(c, 112, 68, 14, 8, 5);
  // Joue touffue.
  s += line('M128 84 l8 4 M122 90 l6 6 M112 94 l4 6', 1.5);

  // Hurlement : ondes et étincelles.
  s += line('M30 4 q-8 -10 -4 -22 M22 18 q-14 -8 -14 -24', 1.8, pal.glow, ' opacity="0.8"');
  s += sparkle(196, 108, 6, pal.glow) + sparkle(30, 110, 5, CREAM) + sparkle(206, 140, 3.5, CREAM) + sparkle(16, 56, 4, pal.accent2);
  return s;
};
