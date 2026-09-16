/** Reference rounded to IEEE-754 double precision, used only to compare errors. */
export const EULER_MASCHERONI = 0.5772156649015329;
export const MAX_HARMONIC_N = 100000;
const harmonicCache: number[] = [0];
let compensation = 0;

/** Compensated summation; the approximation itself does not use the reference constant. */
export function harmonicNumber(n: number): number {
  if (!Number.isInteger(n) || n < 1 || n > MAX_HARMONIC_N) throw new RangeError('n debe ser un entero entre 1 y 100000.');
  for (let k = harmonicCache.length; k <= n; k++) {
    const previous = harmonicCache[k-1];
    const term = 1 / k - compensation;
    const sum = previous + term;
    compensation = (sum - previous) - term;
    harmonicCache.push(sum);
  }
  return harmonicCache[n];
}

export function eulerApproximations(n: number): number[] {
  const raw = harmonicNumber(n) - Math.log(n);
  const first = raw - 1 / (2*n);
  const second = first + 1 / (12*n*n);
  const third = second - 1 / (120*n**4);
  return [raw, first, second, third];
}

export function harmonicBounds(n: number) {
  const h = harmonicNumber(n);
  return { lower: h - Math.log1p(n), upper: h - Math.log(n), width: Math.log1p(1/n) };
}

export function harmonicGap(k: number): number {
  if (!Number.isInteger(k) || k < 1) throw new RangeError('k debe ser un entero positivo.');
  return 1/k - Math.log1p(1/k);
}
