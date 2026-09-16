export interface JordanPoint { x: number; y: number; }
export function segmentDistance(p: JordanPoint, a: JordanPoint, b: JordanPoint): number {
  const dx = b.x - a.x, dy = b.y - a.y;
  const length = dx * dx + dy * dy;
  const t = length ? Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / length)) : 0;
  return Math.hypot(p.x - a.x - t * dx, p.y - a.y - t * dy);
}

/** Half-open vertical intervals avoid double-counting vertices in ray casting. */
export function classifyJordanPoint(p: JordanPoint, polygon: readonly JordanPoint[], tolerance = 1e-8) {
  let boundary = false;
  const crossings: number[] = [];
  polygon.forEach((a, i) => {
    const b = polygon[(i + 1) % polygon.length];
    if (segmentDistance(p, a, b) <= tolerance) boundary = true;
    if ((a.y > p.y) !== (b.y > p.y)) {
      const x = a.x + (p.y - a.y) * (b.x - a.x) / (b.y - a.y);
      if (x > p.x) crossings.push(x);
    }
  });
  crossings.sort((a, b) => a - b);
  return { location: boundary ? 'boundary' : crossings.length % 2 ? 'inside' : 'outside', crossings };
}

export function jordanPolygon(kind: string, amplitude = 0.35): JordanPoint[] {
  if (kind === 'bay') return [[150,75],[590,75],[590,155],[255,155],[255,325],[590,325],[590,405],[150,405]].map(([x,y]) => ({x,y}));
  const n = kind === 'star' ? 12 : 160;
  return Array.from({length:n}, (_, i) => {
    const angle = i * 2 * Math.PI / n;
    // Positive radii and angular gaps < pi guarantee a simple radial polygon.
    const radius = kind === 'star' ? (i % 2 ? 0.5 : 1) : kind === 'flower' ? 0.77 + amplitude * 0.55 * Math.cos(3 * angle) + amplitude * 0.2 * Math.sin(5 * angle) : 0.87;
    return { x: 370 + 250 * radius * Math.cos(angle), y: 240 + 180 * radius * Math.sin(angle) };
  });
}

export function jordanPath(points: readonly JordanPoint[], closed = true): string {
  return points.length ? 'M' + points.map(p => `${p.x.toFixed(3)},${p.y.toFixed(3)}`).join('L') + (closed ? 'Z' : '') : '';
}
