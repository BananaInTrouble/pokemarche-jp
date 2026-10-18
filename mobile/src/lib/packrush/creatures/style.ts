/**
 * Style commun des créatures Pack Rush : trait d'encre légèrement tremblé (filtre `wobble`), aplats de couleur,
 * ombres hachurées (motif `hatch`), petits reflets blancs. Chaque espèce dessine dans la fenêtre d'illustration
 * (0..AW × 0..AH, sol vers y≈200) avec ces outils, pour que les 58 cartes aient la même « main ».
 */
export const AW = 222, AH = 236;

export interface Palette {
  ink: string; body: string; shade: string; light: string; belly: string;
  accent: string; accent2: string; glow: string; eye: string;
}

export interface DrawCtx {
  /** Aléatoire déterministe propre à la carte (variations de détail, jamais de forme). */
  r: () => number;
  hue: number;
  pal: Palette;
  /** 0 bébé, 1 jeune, 2 adulte, 3 éveillé (variante rare), 4 légendaire. */
  stage: number;
}

export type Species = (c: DrawCtx) => string;

export const hsl = (h: number, s: number, l: number, a = 1) =>
  `hsla(${Math.round(((h % 360) + 360) % 360)},${s}%,${l}%,${a})`;

export function palette(h: number): Palette {
  return {
    ink: '#1A1230',
    body: hsl(h, 48, 60),
    shade: hsl(h + 12, 46, 40),
    light: hsl(h - 8, 70, 82),
    belly: hsl(h - 20, 55, 88),
    accent: hsl(h + 150, 72, 64),
    accent2: hsl(h + 200, 80, 72),
    glow: hsl(h + 40, 95, 82),
    eye: hsl(h + 170, 90, 70),
  };
}

const n = (v: number) => +v.toFixed(1);

/** Forme encrée : aplat + contour d'encre. */
export const ink = (d: string, fill: string, w = 2.4, extra = '') =>
  `<path d="${d}" fill="${fill}" stroke="#1A1230" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"${extra}/>`;

/** Trait d'encre seul (détails, poils, plis). */
export const line = (d: string, w = 1.8, color = '#1A1230', extra = '') =>
  `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;

/** Ombre : teinte sombre + hachures par-dessus. */
export const shadow = (d: string, color: string, opacity = 0.9) =>
  `<path d="${d}" fill="${color}" opacity="${opacity}"/><path d="${d}" fill="url(#hatch)"/>`;

/** Reflet : petit trait blanc. */
export const shine = (d: string, w = 2) => line(d, w, '#FFFFFF', ' opacity="0.85"');

/** Étincelle à 4 branches (dessinée). */
export function sparkle(x: number, y: number, s: number, fill = '#FFF6D8', stroke = true): string {
  const k = s * 0.22;
  const d = `M${n(x)} ${n(y - s)} Q${n(x + k)} ${n(y - k)} ${n(x + s)} ${n(y)} Q${n(x + k)} ${n(y + k)} ${n(x)} ${n(y + s)} Q${n(x - k)} ${n(y + k)} ${n(x - s)} ${n(y)} Q${n(x - k)} ${n(y - k)} ${n(x)} ${n(y - s)}Z`;
  return `<path d="${d}" fill="${fill}"${stroke ? ' stroke="#1A1230" stroke-width="1.2" stroke-linejoin="round"' : ''}/>`;
}

/** Œil expressif : blanc, iris lumineux, pupille, deux reflets. `look` décale le regard (-1..1). */
export function eye(x: number, y: number, rad: number, iris: string, look = 0, closed = false): string {
  if (closed) return line(`M${n(x - rad)} ${n(y)} Q${n(x)} ${n(y + rad * 0.8)} ${n(x + rad)} ${n(y)}`, 2.2);
  const ix = x + look * rad * 0.25;
  return `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(rad)}" ry="${n(rad * 1.12)}" fill="#FFFDF5" stroke="#1A1230" stroke-width="2"/>`
    + `<ellipse cx="${n(ix)}" cy="${n(y + rad * 0.12)}" rx="${n(rad * 0.68)}" ry="${n(rad * 0.82)}" fill="${iris}"/>`
    + `<ellipse cx="${n(ix)}" cy="${n(y + rad * 0.18)}" rx="${n(rad * 0.36)}" ry="${n(rad * 0.48)}" fill="#1A1230"/>`
    + `<circle cx="${n(ix - rad * 0.28)}" cy="${n(y - rad * 0.28)}" r="${n(rad * 0.24)}" fill="#fff"/>`
    + `<circle cx="${n(ix + rad * 0.22)}" cy="${n(y + rad * 0.32)}" r="${n(rad * 0.11)}" fill="#fff"/>`;
}

/** Points d'étoiles dispersés sur une forme (taches de pelage « constellation »). */
export function speckles(c: DrawCtx, cx: number, cy: number, rx: number, ry: number, count: number, color = '#FFF6D8'): string {
  let s = '';
  for (let i = 0; i < count; i++) {
    const a = c.r() * Math.PI * 2, d = Math.sqrt(c.r());
    s += `<circle cx="${n(cx + Math.cos(a) * rx * d)}" cy="${n(cy + Math.sin(a) * ry * d)}" r="${n(0.8 + c.r() * 1.4)}" fill="${color}"/>`;
  }
  return s;
}

/** Ombre portée au sol (ellipse douce). */
export const ground = (x: number, y: number, rx: number) =>
  `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(rx)}" ry="${n(rx * 0.16)}" fill="#000" opacity="0.28"/>`;

/** Halo lumineux derrière la créature. */
export const aura = (x: number, y: number, rad: number, color: string) =>
  `<circle cx="${n(x)}" cy="${n(y)}" r="${n(rad)}" fill="${color}" opacity="0.35" filter="url(#soft)"/>`;

/** Définitions SVG partagées (à placer dans <defs>). */
export const STYLE_DEFS = `
  <filter id="wobble" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="2.6"/></filter>
  <filter id="soft" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="10"/></filter>
  <filter id="glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="8"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.09 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
  <pattern id="hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="5" stroke="#1A1230" stroke-width="1" opacity="0.45"/></pattern>`;
