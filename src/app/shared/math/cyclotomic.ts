export interface CyclotomicPoint { re: number; im: number; }

export function gcd(a: number, b: number): number {
  while (b) { const r = a % b; a = b; b = r; }
  return a;
}
export function divisors(n: number): number[] {
  return Array.from({ length: n }, (_, i) => i + 1).filter(d => n % d === 0);
}
const cache = new Map<number, readonly bigint[]>();
/** Ascending coefficients. Exact monic division, with a deliberately bounded UI range. */
export function cyclotomic(n: number): readonly bigint[] {
  if (!Number.isInteger(n) || n < 1 || n > 120) throw new Error('El índice debe estar entre 1 y 120.');
  const known = cache.get(n);
  if (known) return known;
  let result = Array<bigint>(n + 1).fill(0n);
  result[0] = -1n; result[n] = 1n;
  for (const d of divisors(n).filter(d => d < n)) {
    const factor = cyclotomic(d), degree = factor.length - 1;
    const quotient = Array<bigint>(result.length - degree).fill(0n);
    for (let k = result.length - 1; k >= degree; k--) {
      const coefficient = result[k]; quotient[k - degree] = coefficient;
      for (let j = 0; j <= degree; j++) result[k - degree + j] -= coefficient * factor[j];
    }
    if (result.some(c => c !== 0n)) throw new Error('División no exacta.');
    result = quotient;
  }
  const frozen = Object.freeze(result);
  cache.set(n, frozen);
  return frozen;
}
export function primitiveRoots(n: number): (CyclotomicPoint & { k: number })[] {
  return Array.from({ length: n }, (_, k) => k).filter(k => gcd(k, n) === 1)
    .map(k => ({ k, re: Math.cos(2 * Math.PI * k / n), im: Math.sin(2 * Math.PI * k / n) }));
}
export function polynomialText(coefficients: readonly bigint[]): string {
  const terms: string[] = [];
  for (let k = coefficients.length - 1; k >= 0; k--) {
    const c = coefficients[k]; if (!c) continue;
    const absolute = c < 0n ? -c : c;
    const term = (absolute === 1n && k ? '' : absolute.toString()) + (k ? k === 1 ? 'x' : `x^${k}` : '');
    terms.push(`${terms.length ? c < 0n ? ' − ' : ' + ' : c < 0n ? '−' : ''}${term}`);
  }
  return terms.join('') || '0';
}

/** Roots of f(z^2), followed optionally by Rf=(z-1)^d f(1/(1-z)). */
export function refineCyclotomicRoots(points: readonly CyclotomicPoint[], rotate: boolean): CyclotomicPoint[] {
  return points.flatMap(z => {
    const radius = Math.sqrt(Math.hypot(z.re, z.im)), angle = Math.atan2(z.im, z.re) / 2;
    const re = radius * Math.cos(angle), im = radius * Math.sin(angle);
    return [1, -1].map(sign => {
      const x = sign * re, y = sign * im;
      if (!rotate) return { re: x, im: y };
      const norm = x * x + y * y;
      return { re: 1 - x / norm, im: y / norm };
    });
  });
}

export interface CyclotomicOrbit {
  root: number; steps: number; reason: 'root' | 'singular' | 'limit'; points: CyclotomicPoint[];
}
/** Newton using P'/P = sum 1/(z-root), avoiding large polynomial coefficients. */
export function cyclotomicNewton(roots: readonly CyclotomicPoint[], re: number, im: number, max: number, trace = false): CyclotomicOrbit {
  const points: CyclotomicPoint[] = [];
  for (let step = 0; step <= max; step++) {
    if (trace) points.push({ re, im });
    let sr = 0, si = 0;
    for (let k = 0; k < roots.length; k++) {
      const x = re - roots[k].re, y = im - roots[k].im, norm = x * x + y * y;
      if (norm < 1e-12) return { root: k, steps: step, reason: 'root', points };
      sr += x / norm; si -= y / norm;
    }
    if (step === max) break;
    const denominator = sr * sr + si * si;
    if (!Number.isFinite(denominator) || denominator < 1e-26) return { root: -1, steps: step, reason: 'singular', points };
    re -= sr / denominator; im += si / denominator;
  }
  return { root: -1, steps: max, reason: 'limit', points };
}
