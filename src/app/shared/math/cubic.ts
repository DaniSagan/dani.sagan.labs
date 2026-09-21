export interface CubicRoot {
  re: number;
  im: number;
}
export interface CubicSolution {
  p: number;
  q: number;
  shift: number;
  delta: number;
  kind: 'one' | 'three' | 'multiple';
  roots: CubicRoot[];
}

/** Real coefficients in the bounded range used by the interactive laboratory. */
export function solveCubic(
  a: number,
  b: number,
  c: number,
  d: number,
): CubicSolution {
  if (![a, b, c, d].every(Number.isFinite) || a === 0)
    throw new Error('Se requiere a ≠ 0 y coeficientes finitos.');
  const B = b / a,
    C = c / a,
    D = d / a;
  const shift = B / 3;
  const p = C - (B * B) / 3;
  const q = (2 * B * B * B) / 27 - (B * C) / 3 + D;
  const delta = (q * q) / 4 + (p * p * p) / 27;
  const tolerance =
    32 *
    Number.EPSILON *
    Math.max(Math.abs((q * q) / 4), Math.abs((p * p * p) / 27));
  let kind: CubicSolution['kind'];
  let roots: CubicRoot[];
  if (Math.abs(delta) <= tolerance) {
    kind = 'multiple';
    const u = Math.cbrt(-q / 2);
    roots = [2 * u, -u, -u].map((t) => ({ re: t - shift, im: 0 }));
  } else if (delta < 0) {
    kind = 'three';
    const r = 2 * Math.sqrt(-p / 3);
    const theta =
      Math.acos(
        Math.max(-1, Math.min(1, -q / (2 * Math.sqrt(-((p / 3) ** 3))))),
      ) / 3;
    roots = [0, 1, 2].map((k) => ({
      re: r * Math.cos(theta - (2 * Math.PI * k) / 3) - shift,
      im: 0,
    }));
  } else {
    kind = 'one';
    // Choose the larger radicand, then enforce uv = -p/3 to avoid cancellation.
    const u = Math.cbrt(-q / 2 - (q >= 0 ? 1 : -1) * Math.sqrt(delta));
    const v = u === 0 ? 0 : -p / (3 * u);
    const t = u + v;
    const im = (Math.sqrt(3) * Math.abs(u - v)) / 2;
    roots = [
      { re: t - shift, im: 0 },
      { re: -t / 2 - shift, im },
      { re: -t / 2 - shift, im: -im },
    ];
  }
  roots.sort((u, v) => u.re - v.re || u.im - v.im);
  return { p, q, shift, delta, kind, roots };
}

export function cubicResidual(
  a: number,
  b: number,
  c: number,
  d: number,
  z: CubicRoot,
): number {
  let re = a,
    im = 0;
  for (const coefficient of [b, c, d]) {
    const next = re * z.re - im * z.im + coefficient;
    im = re * z.im + im * z.re;
    re = next;
  }
  return Math.hypot(re, im);
}
