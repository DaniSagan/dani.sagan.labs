export interface TrackPoint { x: number; y: number; t: number; }
export interface Cycloid { radius: number; theta: number; time: number; }

/** y measures depth below release; the physical branch has 0 < theta < 2π. */
export function solveCycloid(x: number, y: number, gravity = 9.81): Cycloid {
  if (!(x > 0 && y > 0 && gravity > 0) || ![x, y, gravity].every(Number.isFinite)) {
    throw new RangeError('Positive finite distances and gravity required');
  }
  let lo = 1e-7, hi = 2 * Math.PI - 1e-7;
  for (let i = 0; i < 80; i++) {
    const theta = (lo + hi) / 2;
    if ((theta - Math.sin(theta)) / (2 * Math.sin(theta / 2) ** 2) < x / y) lo = theta;
    else hi = theta;
  }
  const theta = (lo + hi) / 2;
  const radius = y / (2 * Math.sin(theta / 2) ** 2);
  return { radius, theta, time: theta * Math.sqrt(radius / gravity) };
}

export function cycloidPoint(radius: number, theta: number): { x: number; y: number } {
  return { x: radius * (theta - Math.sin(theta)), y: 2 * radius * Math.sin(theta / 2) ** 2 };
}

/** Exact segment times for a frictionless polygonal track, including release at rest. */
export function sampleTrack(curve: (u: number) => { x: number; y: number }, gravity: number, count = 600): TrackPoint[] {
  const points: TrackPoint[] = [{ ...curve(0), t: 0 }];
  for (let i = 1; i <= count; i++) {
    const p = curve(i / count), prev = points[i - 1];
    const length = Math.hypot(p.x - prev.x, p.y - prev.y);
    const speedSum = Math.sqrt(2 * gravity * prev.y) + Math.sqrt(2 * gravity * p.y);
    points.push({ ...p, t: prev.t + (length === 0 ? 0 : 2 * length / speedSum) });
  }
  return points;
}

export function positionAt(points: TrackPoint[], time: number): TrackPoint {
  if (time <= 0) return points[0];
  if (time >= points[points.length - 1].t) return points[points.length - 1];
  let lo = 0, hi = points.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (points[mid].t < time) lo = mid; else hi = mid;
  }
  const a = points[lo], b = points[hi];
  const f = (time - a.t) / (b.t - a.t);
  // Constant tangential acceleration along a straight segment.
  const va = Math.sqrt(a.y), vb = Math.sqrt(b.y);
  const fraction = va + vb > 0 ? (2 * va * f + (vb - va) * f * f) / (va + vb) : f;
  return { x: a.x + fraction * (b.x - a.x), y: a.y + fraction * (b.y - a.y), t: time };
}

/** Arc distance from the bottom follows a simple harmonic oscillator. */
export function tautochroneTheta(start: number, phase: number): number {
  return 2 * Math.acos(Math.cos(start / 2) * Math.cos(Math.min(1, Math.max(0, phase)) * Math.PI / 2));
}
