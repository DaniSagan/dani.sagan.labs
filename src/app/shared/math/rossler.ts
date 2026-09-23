export type RosslerState = [number, number, number];
export interface RosslerParameters {
  a: number;
  b: number;
  c: number;
}
export const ROSSLER_DEFAULTS: RosslerParameters = { a: 0.2, b: 0.2, c: 5.7 };

export function rosslerDerivative(
  [x, y, z]: RosslerState,
  p: RosslerParameters,
): RosslerState {
  return [-y - z, x + p.a * y, p.b + z * (x - p.c)];
}

export function rosslerStep(
  s: RosslerState,
  p: RosslerParameters,
  h = 0.02,
): RosslerState {
  const add = (k: RosslerState, scale: number): RosslerState => [
    s[0] + scale * k[0],
    s[1] + scale * k[1],
    s[2] + scale * k[2],
  ];
  const k1 = rosslerDerivative(s, p),
    k2 = rosslerDerivative(add(k1, h / 2), p);
  const k3 = rosslerDerivative(add(k2, h / 2), p),
    k4 = rosslerDerivative(add(k3, h), p);
  const next = s.map(
    (v, i) => v + (h * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i])) / 6,
  ) as RosslerState;
  if (next.some((v) => !Number.isFinite(v) || Math.abs(v) > 10000))
    throw new Error(
      'La órbita salió del dominio numérico. Reinicia con los parámetros clásicos.',
    );
  return next;
}

export function rosslerOrbit(
  p: RosslerParameters,
  duration = 300,
  transient = 150,
  h = 0.02,
): RosslerState[] {
  let state: RosslerState = [1, 0, 0];
  for (let i = 0; i < Math.round(transient / h); i++)
    state = rosslerStep(state, p, h);
  const points = [state];
  for (let i = 0; i < Math.round(duration / h); i++) {
    state = rosslerStep(state, p, h);
    points.push(state);
  }
  return points;
}

/** Local z maxima, with a parabolic interpolation of three consecutive samples. */
export function rosslerPeaks(points: RosslerState[]): number[] {
  const peaks: number[] = [];
  for (let i = 1; i < points.length - 1; i++) {
    const a = points[i - 1][2],
      b = points[i][2],
      c = points[i + 1][2];
    if (b > a && b >= c) peaks.push(b - (c - a) ** 2 / (8 * (a - 2 * b + c)));
  }
  return peaks;
}

/** x=0 crossings in the direction dx/dt>0; linear interpolation between samples. */
export function rosslerSection(
  points: RosslerState[],
): { y: number; z: number }[] {
  const section: { y: number; z: number }[] = [];
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1],
      b = points[i];
    if (a[0] < 0 && b[0] >= 0) {
      const t = -a[0] / (b[0] - a[0]);
      section.push({
        y: a[1] + t * (b[1] - a[1]),
        z: a[2] + t * (b[2] - a[2]),
      });
    }
  }
  return section;
}

export function rosslerEquilibria(p: RosslerParameters): RosslerState[] {
  const d = p.c ** 2 - 4 * p.a * p.b;
  if (d < 0 || p.a === 0) return [];
  return [-1, 1].map((sign) => {
    const z = (p.c + sign * Math.sqrt(d)) / (2 * p.a);
    return [p.a * z, -z, z] as RosslerState;
  });
}

export function rosslerSeparation(
  p: RosslerParameters,
  epsilon: number,
  duration = 180,
  h = 0.02,
): { t: number; distance: number }[] {
  let a = rosslerOrbit(p, 0, 150, h)[0];
  let b: RosslerState = [a[0] + epsilon, a[1], a[2]];
  const values = [{ t: 0, distance: Math.hypot(...a.map((v, i) => v - b[i])) }];
  for (let i = 1; i <= Math.round(duration / h); i++) {
    a = rosslerStep(a, p, h);
    b = rosslerStep(b, p, h);
    if (i % 10 === 0)
      values.push({
        t: i * h,
        distance: Math.hypot(...a.map((v, j) => v - b[j])),
      });
  }
  return values;
}
