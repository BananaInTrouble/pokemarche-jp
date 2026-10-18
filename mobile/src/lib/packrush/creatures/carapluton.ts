import { aura, eye, ground, ink, line, shadow, shine, sparkle, speckles, type Species } from './style.ts';

const f = (v: number) => v.toFixed(1);

/** Bande horizontale d'une sphère (cx, cy, R) entre dy1 et dy2, bords incurvés comme sur un globe. */
function band(cx: number, cy: number, R: number, dy1: number, dy2: number, bend: number): string {
  const x1 = Math.sqrt(Math.max(0, R * R - dy1 * dy1)), x2 = Math.sqrt(Math.max(0, R * R - dy2 * dy2));
  return `M${f(cx - x1)} ${f(cy + dy1)} Q${f(cx)} ${f(cy + dy1 + bend)} ${f(cx + x1)} ${f(cy + dy1)}`
    + ` A${f(R)} ${f(R)} 0 0 1 ${f(cx + x2)} ${f(cy + dy2)}`
    + ` Q${f(cx)} ${f(cy + dy2 + bend)} ${f(cx - x2)} ${f(cy + dy2)}`
    + ` A${f(R)} ${f(R)} 0 0 1 ${f(cx - x1)} ${f(cy + dy1)} Z`;
}

/** Anneau planétaire (moitié arrière ou avant), centré, incliné de `tilt` degrés. */
function ring(cx: number, cy: number, rx: number, ry: number, wdt: number, tilt: number, front: boolean, fill: string, stripe: string): string {
  const ri = rx - wdt, ryi = ry - wdt * (ry / rx) * 1.4;
  const d = front
    ? `M${f(-rx)} 0 A${f(rx)} ${f(ry)} 0 0 0 ${f(rx)} 0 L${f(ri)} 0 A${f(ri)} ${f(ryi)} 0 0 1 ${f(-ri)} 0 Z`
    : `M${f(-rx)} 0 A${f(rx)} ${f(ry)} 0 0 1 ${f(rx)} 0 L${f(ri)} 0 A${f(ri)} ${f(ryi)} 0 0 0 ${f(-ri)} 0 Z`;
  const mid = rx - wdt * 0.5, midy = ry - wdt * 0.5 * (ry / rx) * 1.4;
  const ln = front
    ? `M${f(-mid)} 0 A${f(mid)} ${f(midy)} 0 0 0 ${f(mid)} 0`
    : `M${f(-mid)} 0 A${f(mid)} ${f(midy)} 0 0 1 ${f(mid)} 0`;
  return `<g transform="translate(${f(cx)} ${f(cy)}) rotate(${f(tilt)})">${ink(d, fill, 2.2)}${line(ln, 1.2, stripe, ' opacity="0.8"')}</g>`;
}

/** Carapluton → Orbitortue → Mondécaille : tortue dont la carapace est une petite planète. */
export const carapluton: Species = (c) => {
  const { pal, stage } = c;
  const st = Math.min(stage, 3);
  const gy = 204;
  // Géométrie par stade : planète (px, py, R), tête (hx, hy, hr), pattes.
  const G = [
    { R: 46, hr: 36, leg: 15, legH: 12 },
    { R: 54, hr: 31, leg: 16, legH: 16 },
    { R: 64, hr: 29, leg: 19, legH: 20 },
    { R: 64, hr: 29, leg: 19, legH: 20 },
  ][st];
  const { R, hr, leg, legH } = G;
  const px = st === 0 ? 132 : st === 1 ? 126 : 120;
  const by = gy - legH - 14; // dessus du corps (sous la planète)
  const py = by - R * 0.86;
  const hx = Math.max(hr + 8, px - R - hr * 0.55), hy = by - hr * (st === 0 ? 0.35 : 0.6);
  let s = '';

  if (st >= 3) s += aura(px, py, 110, pal.glow);
  s += ground(px - 10, gy + 2, st === 0 ? 70 : 88);

  // Orbites et lunes arrière (stade 2+).
  if (st >= 2) {
    s += `<ellipse cx="${f(px)}" cy="${f(py)}" rx="${f(R * 1.62)}" ry="${f(R * 0.5)}" transform="rotate(24 ${f(px)} ${f(py)})" fill="none" stroke="#FFF6D8" stroke-width="1.2" stroke-dasharray="3 5" opacity="0.6"/>`;
  }

  // Pattes arrière-plan (plus sombres).
  const legAt = (x: number, fill: string) =>
    ink(`M${f(x - leg * 0.85)} ${f(by + 2)} C${f(x - leg * 0.95)} ${f(gy - 8)} ${f(x - leg * 1.25)} ${f(gy - 2)} ${f(x - leg * 1.1)} ${f(gy + 1)} C${f(x - leg * 0.4)} ${f(gy + 4)} ${f(x + leg * 0.6)} ${f(gy + 4)} ${f(x + leg * 1.1)} ${f(gy + 1)} C${f(x + leg * 1.2)} ${f(gy - 4)} ${f(x + leg * 0.9)} ${f(gy - 8)} ${f(x + leg * 0.85)} ${f(by + 2)} Z`, fill, 2.2)
    + [-0.6, 0, 0.6].map((o) => `<ellipse cx="${f(x + leg * o)}" cy="${f(gy)}" rx="${f(leg * 0.2)}" ry="${f(leg * 0.16)}" fill="#FFF6D8" stroke="#1A1230" stroke-width="1.2"/>`).join('')
    + line(`M${f(x - leg * 0.5)} ${f(by + 10)} q${f(leg * 0.5)} 4 ${f(leg)} 0`, 1.2, '#1A1230', ' opacity="0.6"');
  s += legAt(px - R * 0.28, pal.shade) + legAt(px + R * 0.86, pal.shade);

  // Petite queue.
  s += ink(`M${f(px + R * 0.95)} ${f(by + 4)} L${f(px + R * 1.32)} ${f(by + 14)} L${f(px + R * 0.9)} ${f(by + 18)} Z`, pal.body, 2);

  // Corps / coussin ventral sous la planète.
  const bw = R * 1.12, bh = 18;
  s += ink(`M${f(px - bw)} ${f(by + 6)} C${f(px - bw)} ${f(by - 10)} ${f(px + bw)} ${f(by - 10)} ${f(px + bw)} ${f(by + 6)} C${f(px + bw * 0.9)} ${f(by + bh)} ${f(px - bw * 0.9)} ${f(by + bh)} ${f(px - bw)} ${f(by + 6)} Z`, pal.belly, 2.2);
  for (let i = -2; i <= 2; i++) s += line(`M${f(px + i * bw * 0.36)} ${f(by - 2)} l${f(i * 1.5)} ${f(bh * 0.75)}`, 1.2, pal.shade);

  // Anneau arrière.
  const tilt = -14;
  if (st >= 1) s += ring(px, py, R * (st >= 2 ? 1.42 : 1.5), R * 0.36, R * (st >= 2 ? 0.34 : 0.26), tilt, false, pal.accent, pal.glow);

  // La carapace-planète.
  const sphere = `M${f(px - R)} ${f(py)} A${f(R)} ${f(R)} 0 1 1 ${f(px + R)} ${f(py)} A${f(R)} ${f(R)} 0 1 1 ${f(px - R)} ${f(py)} Z`;
  if (st === 0) {
    // Caillou-lune bosselé.
    const pts: string[] = [];
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2, rr = R * (i % 2 ? 0.97 : 1.02);
      pts.push(`${f(px + Math.cos(a) * rr)} ${f(py + Math.sin(a) * rr)}`);
    }
    let d = `M${pts[0]}`;
    for (let i = 1; i <= 14; i++) {
      const a0 = ((i - 0.5) / 14) * Math.PI * 2;
      d += ` Q${f(px + Math.cos(a0) * R * 1.06)} ${f(py + Math.sin(a0) * R * 1.06)} ${pts[i % 14]}`;
    }
    s += ink(d + ' Z', pal.light, 2.6);
    s += shadow(`M${f(px + R * 0.2)} ${f(py - R * 0.95)} A${f(R)} ${f(R)} 0 0 1 ${f(px + R * 0.2)} ${f(py + R * 0.95)} A${f(R * 0.7)} ${f(R)} 0 0 0 ${f(px + R * 0.2)} ${f(py - R * 0.95)} Z`, pal.body, 0.6);
    for (const [dx, dy, rr] of [[-0.42, -0.3, 0.2], [0.18, -0.5, 0.13], [0.3, 0.2, 0.22], [-0.25, 0.45, 0.14], [-0.55, 0.15, 0.08]]) {
      s += `<ellipse cx="${f(px + dx * R)}" cy="${f(py + dy * R)}" rx="${f(rr * R)}" ry="${f(rr * R * 0.85)}" fill="${pal.body}" stroke="#1A1230" stroke-width="1.6"/>`;
      s += line(`M${f(px + (dx - rr * 0.6) * R)} ${f(py + (dy + rr * 0.3) * R)} Q${f(px + dx * R)} ${f(py + (dy + rr * 0.9) * R)} ${f(px + (dx + rr * 0.6) * R)} ${f(py + (dy + rr * 0.3) * R)}`, 1.4, '#FFF6D8', ' opacity="0.8"');
    }
    s += shine(`M${f(px - R * 0.72)} ${f(py - R * 0.42)} q6 -14 20 -20`, 2.4);
  } else {
    s += ink(sphere, pal.body, 2.6);
    // Bandes atmosphériques.
    s += `<path d="${band(px, py, R, -R * 0.62, -R * 0.38, 6)}" fill="${pal.light}"/>`;
    s += `<path d="${band(px, py, R, -R * 0.08, R * 0.2, 8)}" fill="${pal.accent2}" opacity="0.75"/>`;
    s += `<path d="${band(px, py, R, R * 0.48, R * 0.66, 8)}" fill="${pal.light}" opacity="0.8"/>`;
    s += line(`M${f(px - R * 0.92)} ${f(py - R * 0.2)} Q${f(px)} ${f(py - R * 0.12)} ${f(px + R * 0.95)} ${f(py - R * 0.22)}`, 1.2, pal.shade);
    if (st >= 2) {
      // Continents et nuages : c'est un petit monde.
      s += ink(`M${f(px - R * 0.5)} ${f(py - R * 0.2)} C${f(px - R * 0.62)} ${f(py - R * 0.5)} ${f(px - R * 0.1)} ${f(py - R * 0.62)} ${f(px + R * 0.02)} ${f(py - R * 0.4)} C${f(px + R * 0.2)} ${f(py - R * 0.28)} ${f(px - R * 0.02)} ${f(py + R * 0.05)} ${f(px - R * 0.2)} ${f(py + R * 0.02)} C${f(px - R * 0.34)} ${f(py + R * 0.0)} ${f(px - R * 0.42)} ${f(py - R * 0.06)} ${f(px - R * 0.5)} ${f(py - R * 0.2)} Z`, pal.accent, 1.6);
      s += ink(`M${f(px + R * 0.3)} ${f(py + R * 0.18)} C${f(px + R * 0.5)} ${f(py + R * 0.05)} ${f(px + R * 0.72)} ${f(py + R * 0.24)} ${f(px + R * 0.62)} ${f(py + R * 0.42)} C${f(px + R * 0.5)} ${f(py + R * 0.56)} ${f(px + R * 0.3)} ${f(py + R * 0.42)} ${f(px + R * 0.3)} ${f(py + R * 0.18)} Z`, pal.accent, 1.6);
      s += line(`M${f(px - R * 0.62)} ${f(py + R * 0.36)} q10 -6 20 0 q8 5 16 0`, 1.8, '#FFF6D8', ' opacity="0.9"');
      s += line(`M${f(px + R * 0.05)} ${f(py - R * 0.74)} q8 -5 16 0 q6 4 12 0`, 1.8, '#FFF6D8', ' opacity="0.9"');
    }
    s += shadow(`M${f(px + R * 0.15)} ${f(py - R * 0.99)} A${f(R)} ${f(R)} 0 0 1 ${f(px + R * 0.15)} ${f(py + R * 0.99)} A${f(R * 0.72)} ${f(R)} 0 0 0 ${f(px + R * 0.15)} ${f(py - R * 0.99)} Z`, pal.shade, 0.55);
    s += `<path d="${sphere}" fill="none" stroke="#1A1230" stroke-width="2.6"/>`;
    s += shine(`M${f(px - R * 0.74)} ${f(py - R * 0.4)} q6 -16 22 -24`, 2.6);
    s += shine(`M${f(px - R * 0.4)} ${f(py - R * 0.78)} l5 -2`, 2.6);
    // Anneau avant.
    s += ring(px, py, R * (st >= 2 ? 1.42 : 1.5), R * 0.36, R * (st >= 2 ? 0.34 : 0.26), tilt, true, pal.accent, pal.glow);
    s += speckles(c, px, py + R * 0.38, R * 1.1, 8, 4 + st * 3);
  }

  // Lunes en orbite (stade 2+).
  if (st >= 2) {
    const moon = (x: number, y: number, r: number) =>
      ink(`M${f(x - r)} ${f(y)} A${f(r)} ${f(r)} 0 1 1 ${f(x + r)} ${f(y)} A${f(r)} ${f(r)} 0 1 1 ${f(x - r)} ${f(y)} Z`, '#FFF6D8', 1.8)
      + `<path d="M${f(x + r * 0.2)} ${f(y - r * 0.98)} A${f(r)} ${f(r)} 0 0 1 ${f(x + r * 0.2)} ${f(y + r * 0.98)} A${f(r * 0.6)} ${f(r)} 0 0 0 ${f(x + r * 0.2)} ${f(y - r * 0.98)} Z" fill="${pal.light}"/>`
      + `<circle cx="${f(x - r * 0.3)}" cy="${f(y - r * 0.2)}" r="${f(r * 0.22)}" fill="${pal.light}"/>`;
    s += moon(px + R * 1.12, py - R * 0.98, 11) + moon(px - R * 1.22, py - R * 0.62, 7.5);
  }

  // Pattes avant-plan.
  s += legAt(px - R * 0.6, pal.body) + legAt(px + R * 0.55, pal.body);

  // Cou + tête (3/4, regard vers la gauche).
  const nx = px - R * 0.78, ny = by + 6, nw = hr * 0.42;
  s += ink(`M${f(nx + 6)} ${f(ny - nw)} C${f(nx - 10)} ${f(ny - nw * 1.1)} ${f(hx + hr * 0.7)} ${f(hy - nw * 0.4)} ${f(hx + hr * 0.4)} ${f(hy + nw * 0.2)} L${f(hx + hr * 0.4)} ${f(hy + hr * 0.6)} C${f(hx + hr * 0.9)} ${f(hy + hr * 0.7)} ${f(nx - 4)} ${f(ny + nw)} ${f(nx + 8)} ${f(ny + nw * 0.8)} Z`, pal.body, 2.4);
  if (st >= 1) s += line(`M${f(hx + hr * 1.1)} ${f(hy + hr * 0.05)} q4 6 0 12 M${f(hx + hr * 1.4)} ${f(hy + hr * 0.1)} q4 6 0 12`, 1.3, pal.shade);
  const head = `M${f(hx - hr)} ${f(hy + hr * 0.05)} C${f(hx - hr * 1.02)} ${f(hy - hr * 1.05)} ${f(hx + hr * 1.0)} ${f(hy - hr * 1.05)} ${f(hx + hr)} ${f(hy)} C${f(hx + hr * 0.96)} ${f(hy + hr * 0.82)} ${f(hx - hr * 0.96)} ${f(hy + hr * 0.86)} ${f(hx - hr)} ${f(hy + hr * 0.05)} Z`;
  s += ink(head, pal.body, 2.6);
  s += shadow(`M${f(hx + hr * 0.45)} ${f(hy - hr * 0.7)} C${f(hx + hr * 1.05)} ${f(hy - hr * 0.3)} ${f(hx + hr * 1.0)} ${f(hy + hr * 0.5)} ${f(hx + hr * 0.3)} ${f(hy + hr * 0.72)} C${f(hx + hr * 0.75)} ${f(hy + hr * 0.3)} ${f(hx + hr * 0.75)} ${f(hy - hr * 0.2)} ${f(hx + hr * 0.45)} ${f(hy - hr * 0.7)} Z`, pal.shade, 0.5);
  // Taches d'écailles / constellation sur le crâne.
  if (st >= 1) {
    s += `<ellipse cx="${f(hx + hr * 0.1)}" cy="${f(hy - hr * 0.62)}" rx="${f(hr * 0.28)}" ry="${f(hr * 0.16)}" fill="${pal.light}" stroke="#1A1230" stroke-width="1.3"/>`;
  }
  s += sparkle(hx - hr * 0.15, hy - hr * 0.62, st === 0 ? 5 : 4, pal.glow);
  s += shine(`M${f(hx - hr * 0.78)} ${f(hy - hr * 0.35)} q4 -10 14 -14`, 2.2);
  const er = hr * [0.3, 0.27, 0.25, 0.25][st];
  s += eye(hx - hr * 0.48, hy - hr * 0.05, er * 0.88, pal.eye, -0.4) + eye(hx + hr * 0.18, hy - hr * 0.05, er, pal.eye, -0.4);
  // Bec souriant.
  s += line(`M${f(hx - hr * 0.62)} ${f(hy + hr * 0.42)} Q${f(hx - hr * 0.2)} ${f(hy + hr * 0.62)} ${f(hx + hr * 0.15)} ${f(hy + hr * 0.4)}`, 1.9);
  s += line(`M${f(hx - hr * 0.42)} ${f(hy + hr * 0.24)} l0 0.1 M${f(hx - hr * 0.28)} ${f(hy + hr * 0.24)} l0 0.1`, 2.2);
  s += `<ellipse cx="${f(hx + hr * 0.52)}" cy="${f(hy + hr * 0.36)}" rx="${f(hr * 0.18)}" ry="${f(hr * 0.1)}" fill="#FF8FB1" opacity="0.6"/>`;

  // Étincelles.
  s += sparkle(px + R * 1.15, py - R * 0.2 - (st === 0 ? 10 : 30), 5, pal.glow);
  if (st >= 2) s += sparkle(px - R * 0.3, py - R * 1.28, 6, '#FFF6D8') + sparkle(px + R * 0.9, py + R * 0.72, 4, pal.glow);
  if (st >= 3) s += sparkle(20, 40, 6, pal.glow) + sparkle(200, 190, 5, pal.glow);
  return s;
};
