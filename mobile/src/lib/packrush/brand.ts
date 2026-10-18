/**
 * Identité visuelle de Pack Rush (SVG) : fragment de cristal (monnaie d'artisanat), emblème de chaque set,
 * marque Pack Rush, dos des cartes et habillage du pack. Les textes (logo « PACK RUSH », nom du set) sont posés
 * par-dessus en texte de l'appli (polices Unbounded / Manrope), voir components/packrush.
 */
const uri = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
const GOLD = '#E9C25B', GOLD_LIGHT = '#FFE8A3', NIGHT = '#120C26';

/** Étoile de cristal facettée : 4 branches dont une longue, chaque branche en deux facettes claire/sombre. */
function crystal(cx: number, cy: number, s: number, light = '#C9D2FF', mid = '#7F7CFF', dark = '#3B33B8'): string {
  const tips: [number, number][] = [[0, -1], [1.05, 0.05], [0.95, 1.45], [-0.9, 0.12]];
  const waists: [number, number][] = [[0.22, -0.2], [0.26, 0.3], [-0.12, 0.3], [-0.24, -0.16]];
  let out = '';
  for (let i = 0; i < 4; i++) {
    const t = tips[i], a = waists[(i + 3) % 4], b = waists[i];
    const P = (p: [number, number]) => `${(cx + p[0] * s).toFixed(1)} ${(cy + p[1] * s).toFixed(1)}`;
    out += `<path d="M${P([0, 0])} L${P(a)} L${P(t)} Z" fill="${i % 2 ? mid : light}"/>`;
    out += `<path d="M${P([0, 0])} L${P(t)} L${P(b)} Z" fill="${i % 2 ? dark : mid}"/>`;
  }
  const outline = [0, 1, 2, 3].flatMap((i) => [tips[i], waists[i]]).map((p, i) => `${i ? 'L' : 'M'}${(cx + p[0] * s).toFixed(1)} ${(cy + p[1] * s).toFixed(1)}`).join(' ') + 'Z';
  return out + `<path d="${outline}" fill="none" stroke="#FFFFFF" stroke-opacity="0.75" stroke-width="${(s * 0.035).toFixed(2)}" stroke-linejoin="round"/>`;
}

/** Fragment (icône de monnaie). */
export function fragmentIcon(): string {
  return uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><filter id="g" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.4"/></filter></defs>
    <g opacity="0.55" filter="url(#g)">${crystal(29, 26, 21, '#9DA8FF', '#7F7CFF', '#6A4CFF')}</g>${crystal(29, 26, 21)}</svg>`);
}

/** Emblème d'un set (blason). Premier set : croissant de lune berçant un éclat de cristal, rayons et étoiles. */
function emblemBody(setId: string): string {
  void setId;
  const rays = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2, r1 = i % 2 ? 50 : 46, r2 = i % 2 ? 54 : 60;
    return `<line x1="${(100 + Math.cos(a) * r1).toFixed(1)}" y1="${(100 + Math.sin(a) * r1).toFixed(1)}" x2="${(100 + Math.cos(a) * r2).toFixed(1)}" y2="${(100 + Math.sin(a) * r2).toFixed(1)}" stroke="${GOLD}" stroke-width="${i % 2 ? 1.2 : 2}" stroke-linecap="round"/>`;
  }).join('');
  const shield = 'M100 18 C126 30 150 30 166 26 C168 74 160 128 100 182 C40 128 32 74 34 26 C50 30 74 30 100 18 Z';
  return `<path d="${shield}" fill="${NIGHT}" stroke="${GOLD}" stroke-width="4" stroke-linejoin="round"/>
    <path d="${shield}" fill="none" stroke="${GOLD_LIGHT}" stroke-width="1.2" transform="translate(100 100) scale(0.9) translate(-100 -100)" opacity="0.8"/>
    <circle cx="100" cy="100" r="40" fill="#2A1F5C" opacity="0.9"/>${rays}
    <path d="M62 104 A40 40 0 0 0 138 104 A34 30 0 0 1 62 104 Z" fill="${GOLD}" stroke="${GOLD_LIGHT}" stroke-width="1.2"/>
    ${crystal(100, 84, 26)}
    <circle cx="70" cy="56" r="2.2" fill="${GOLD_LIGHT}"/><circle cx="132" cy="60" r="1.8" fill="${GOLD_LIGHT}"/><circle cx="100" cy="152" r="2.4" fill="${GOLD_LIGHT}"/>
    <path d="M86 150 h-14 M114 150 h14" stroke="${GOLD}" stroke-width="1.5" stroke-linecap="round"/>`;
}

export function setEmblem(setId: string): string {
  return uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><filter id="g" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter></defs>
    <g filter="url(#g)" opacity="0.6"><path d="M100 18 C126 30 150 30 166 26 C168 74 160 128 100 182 C40 128 32 74 34 26 C50 30 74 30 100 18 Z" fill="#8E7BFF"/></g>${emblemBody(setId)}</svg>`);
}

/** Marque Pack Rush seule (étoile filante dans un anneau), pour le dos des cartes et les petits formats. */
function markBody(cx: number, cy: number, r: number): string {
  const lines = [0, 1, 2].map((i) => `<path d="M${cx - r * 0.95} ${cy + r * (0.15 + i * 0.22)} h${r * (0.7 - i * 0.18)}" stroke="${GOLD}" stroke-width="${r * 0.07}" stroke-linecap="round" opacity="${1 - i * 0.25}"/>`).join('');
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${GOLD}" stroke-width="${r * 0.08}"/>
    <circle cx="${cx}" cy="${cy}" r="${r * 0.84}" fill="none" stroke="${GOLD_LIGHT}" stroke-width="${r * 0.025}" opacity="0.7"/>${lines}
    ${crystal(cx + r * 0.12, cy - r * 0.1, r * 0.5, GOLD_LIGHT, GOLD, '#B07A1A')}`;
}

/** Dos des cartes Pack Rush. */
export function cardBack(): string {
  const stars = Array.from({ length: 30 }, (_, i) => {
    const x = (i * 73) % 230 + 10, y = (i * 131) % 330 + 10;
    return `<circle cx="${x}" cy="${y}" r="${(i % 3) * 0.5 + 0.6}" fill="#FFF6D8" opacity="${0.3 + (i % 4) * 0.15}"/>`;
  }).join('');
  return uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 350">
    <defs><radialGradient id="b" cx="50%" cy="50%" r="70%"><stop offset="0%" stop-color="#2E2470"/><stop offset="100%" stop-color="${NIGHT}"/></radialGradient>
    <linearGradient id="f" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#C9971F"/><stop offset="50%" stop-color="${GOLD_LIGHT}"/><stop offset="100%" stop-color="#C9971F"/></linearGradient></defs>
    <rect width="250" height="350" rx="14" fill="url(#f)"/><rect x="6" y="6" width="238" height="338" rx="10" fill="url(#b)"/>${stars}
    <rect x="16" y="16" width="218" height="318" rx="8" fill="none" stroke="${GOLD}" stroke-width="1.4"/>
    <rect x="21" y="21" width="208" height="308" rx="6" fill="none" stroke="${GOLD}" stroke-width="0.6" opacity="0.7"/>
    <path d="M125 40 L131 60 L125 66 L119 60 Z M125 310 L131 290 L125 284 L119 290 Z" fill="${GOLD}"/>
    ${markBody(125, 175, 62)}</svg>`);
}

/** Petite marque Pack Rush (icône carrée). */
export function packRushMark(): string {
  return uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${markBody(50, 50, 44)}</svg>`);
}

/** Habillage du pack (sans texte) : aluminium nuit, bords sertis, reflet holographique, emblème du set au centre. */
export const PACK_W = 220, PACK_H = 340;
/** Hauteur (en unités du pack) de la bande qu'on déchire. */
export const PACK_TEAR_Y = 44;
export function packFoil(setId: string): string {
  const crimp = (y: number, dir: number) => {
    let d = `M0 ${y}`;
    for (let x = 0; x <= PACK_W; x += 10) d += ` L${x} ${y + (x / 10) % 2 * 7 * dir}`;
    return d;
  };
  const stars = Array.from({ length: 40 }, (_, i) => {
    const x = (i * 53) % 210 + 5, y = (i * 97) % 300 + 22;
    return `<circle cx="${x}" cy="${y}" r="${(i % 3) * 0.45 + 0.5}" fill="#FFF6D8" opacity="${0.25 + (i % 4) * 0.15}"/>`;
  }).join('');
  return uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${PACK_W} ${PACK_H}">
    <defs>
      <linearGradient id="foil" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0%" stop-color="#2B2068"/><stop offset="55%" stop-color="#191243"/><stop offset="100%" stop-color="#0E0A24"/></linearGradient>
      <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#FFFFFF" stop-opacity="0"/><stop offset="42%" stop-color="#B9A8FF" stop-opacity="0"/><stop offset="50%" stop-color="#E5DCFF" stop-opacity="0.32"/><stop offset="58%" stop-color="#7CF5D0" stop-opacity="0"/><stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient>
      <linearGradient id="seal" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#8C6A1C"/><stop offset="50%" stop-color="${GOLD_LIGHT}"/><stop offset="100%" stop-color="#8C6A1C"/></linearGradient>
      <radialGradient id="halo" cx="50%" cy="46%" r="45%"><stop offset="0%" stop-color="#8E7BFF" stop-opacity="0.65"/><stop offset="100%" stop-color="#8E7BFF" stop-opacity="0"/></radialGradient>
      <filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="8"/></filter>
    </defs>
    <rect x="0" y="16" width="${PACK_W}" height="${PACK_H - 32}" fill="url(#foil)"/>
    <path d="${crimp(0, 1)} L${PACK_W} 22 L0 22 Z" fill="url(#seal)"/>
    <path d="${crimp(PACK_H, -1)} L${PACK_W} ${PACK_H - 22} L0 ${PACK_H - 22} Z" fill="url(#seal)"/>
    ${[10, 14, 18].map((y) => `<path d="M0 ${y} H${PACK_W}" stroke="#5E4410" stroke-width="0.8" opacity="0.6"/><path d="M0 ${PACK_H - y} H${PACK_W}" stroke="#5E4410" stroke-width="0.8" opacity="0.6"/>`).join('')}
    ${stars}
    <ellipse cx="60" cy="230" rx="70" ry="30" fill="#4FA3FF" opacity="0.18" filter="url(#soft)"/>
    <ellipse cx="170" cy="110" rx="60" ry="28" fill="#E86FB5" opacity="0.16" filter="url(#soft)"/>
    <circle cx="110" cy="158" r="96" fill="url(#halo)"/>
    <rect x="10" y="30" width="${PACK_W - 20}" height="${PACK_H - 60}" rx="10" fill="none" stroke="${GOLD}" stroke-width="1.2" opacity="0.85"/>
    <path d="M10 ${PACK_TEAR_Y} H${PACK_W - 10}" stroke="${GOLD_LIGHT}" stroke-width="0.8" stroke-dasharray="3 4" opacity="0.55"/>
    <g transform="translate(32 76) scale(0.78)">${emblemBody(setId)}</g>
    <rect x="0" y="0" width="${PACK_W}" height="${PACK_H}" fill="url(#sheen)"/>
  </svg>`);
}
