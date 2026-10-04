export interface ContourPoint { x: number; y: number; }
export type ContourSegment = [ContourPoint, ContourPoint];

export function niceStep(range: number, targetCount = 8): number {
  const raw = range / targetCount;
  if (!Number.isFinite(raw) || raw <= 0) return 1;
  const power = 10 ** Math.floor(Math.log10(raw));
  return ([1, 2, 2.5, 5, 10].find(value => value * power >= raw) ?? 10) * power;
}

export function axisTicks(min: number, max: number, step: number): number[] {
  if (!(step > 0) || ![min, max, step].every(Number.isFinite)) return [];
  const count = Math.floor((max - min) / step) + 2;
  if (count > 500 || count < 0) return [];
  const first = Math.ceil(min / step - 1e-10);
  return Array.from({ length: count }, (_, i) => (first + i) * step)
    .filter(value => value >= min - step * 1e-9 && value <= max + step * 1e-9)
    .map(value => Math.abs(value) < step * 1e-9 ? 0 : value);
}

/** Marching squares with shared samples, refined roots and saddle disambiguation. */
export function traceContours(fn: (x: number, y: number) => number,
  bounds: [number, number, number, number], columns: number, rows: number): ContourSegment[] {
  const [xMin, xMax, yMin, yMax] = bounds;
  columns = Math.max(2, Math.min(800, Math.round(columns)));
  rows = Math.max(2, Math.min(800, Math.round(rows)));
  const segments: ContourSegment[] = [];
  const dx = (xMax - xMin) / columns, dy = (yMax - yMin) / rows;
  const sample = (x: number, y: number): number => {
    const value = fn(x, y);
    return typeof value === 'number' && Number.isFinite(value) ? value : NaN;
  };
  const root = (a: ContourPoint, b: ContourPoint, fa: number, fb: number): ContourPoint | null => {
    if (fa === 0) return a;
    if (fb === 0) return b;
    const initialScale = Math.max(Math.abs(fa), Math.abs(fb));
    // Roundoff near a lattice vertex must not leave gaps in smooth contours.
    for (const [point, value] of [[a, fa], [b, fb]] as [ContourPoint, number][]) {
      if (Math.abs(value) <= initialScale * Number.EPSILON * 64) {
        const ox = (b.x - a.x) * 1e-4, oy = (b.y - a.y) * 1e-4;
        const before = sample(point.x - ox, point.y - oy), after = sample(point.x + ox, point.y + oy);
        if (Number.isFinite(before) && Number.isFinite(after) && (before < 0) !== (after < 0)) return point;
      }
    }
    const tolerance = Math.min(Math.abs(fa), Math.abs(fb)) * 0.2;
    let lo = 0, hi = 1, best: ContourPoint | null = null, residual = Infinity;
    for (let i = 0; i < 12; i++) {
      const scale = Math.max(Math.abs(fa), Math.abs(fb));
      const fraction = Math.abs(fa / scale) / (Math.abs(fa / scale) + Math.abs(fb / scale));
      const t = lo + (hi - lo) * Math.max(0.1, Math.min(0.9, fraction));
      const point = { x: a.x + t * (b.x - a.x), y: a.y + t * (b.y - a.y) };
      const value = sample(point.x, point.y);
      if (!Number.isFinite(value)) return null;
      if (Math.abs(value) < residual) { best = point; residual = Math.abs(value); }
      if (value === 0 || residual <= tolerance * 1e-4) break;
      if ((value < 0) === (fa < 0)) { lo = t; fa = value; } else { hi = t; fb = value; }
    }
    // A pole can change sign without tending towards zero.
    return residual <= tolerance ? best : null;
  };
  let previous = Array.from({ length: columns + 1 }, (_, i) => sample(xMin + i * dx, yMin));
  for (let row = 0; row < rows; row++) {
    const y = yMin + row * dy;
    const next = Array.from({ length: columns + 1 }, (_, i) => sample(xMin + i * dx, y + dy));
    for (let col = 0; col < columns; col++) {
      const x = xMin + col * dx;
      const points = [{ x, y }, { x: x + dx, y }, { x: x + dx, y: y + dy }, { x, y: y + dy }];
      const values = [previous[col], previous[col + 1], next[col + 1], next[col]];
      if (!values.every(Number.isFinite) || values.every(v => v === 0)) continue;
      const crossings = new Map<number, ContourPoint>();
      for (let edge = 0; edge < 4; edge++) {
        const end = (edge + 1) % 4;
        if (values[edge] === 0 && values[end] === 0) segments.push([points[edge], points[end]]);
        if ((values[edge] < 0) !== (values[end] < 0)) {
          const point = root(points[edge], points[end], values[edge], values[end]);
          if (point) crossings.set(edge, point);
        }
      }
      const connect = (a: number, b: number) => {
        if (crossings.has(a) && crossings.has(b)) segments.push([crossings.get(a)!, crossings.get(b)!]);
      };
      if (crossings.size === 2) {
        const edges = [...crossings.keys()]; connect(edges[0], edges[1]);
      } else if (crossings.size === 4) {
        const center = sample(x + dx / 2, y + dy / 2);
        if (!Number.isFinite(center)) continue;
        if (Math.abs(center) <= Math.max(...values.map(Math.abs)) * Number.EPSILON * 64) {
          const point = { x: x + dx / 2, y: y + dy / 2 };
          for (const crossing of crossings.values()) segments.push([crossing, point]);
        } else if ((center < 0) === (values[0] < 0)) { connect(0, 1); connect(2, 3); }
        else { connect(0, 3); connect(1, 2); }
      }
    }
    previous = next;
  }
  return segments;
}
