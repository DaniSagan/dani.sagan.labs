export const BASEL_SUM = Math.PI ** 2 / 6;
export const MAX_BASEL_N = 10000;

// Compensated summation keeps the small terms from losing precision.
const partialSums = new Float64Array(MAX_BASEL_N + 1);
let sum = 0;
let correction = 0;
for (let n = 1; n <= MAX_BASEL_N; n++) {
  const term = 1 / (n * n) - correction;
  const next = sum + term;
  correction = (next - sum) - term;
  sum = next;
  partialSums[n] = sum;
}

export function baselPartialSum(n: number): number {
  if (!Number.isInteger(n) || n < 1 || n > MAX_BASEL_N) {
    throw new RangeError(`Expected an integer between 1 and ${MAX_BASEL_N}.`);
  }
  return partialSums[n];
}

export function baselBounds(n: number): { lower: number; upper: number } {
  const partial = baselPartialSum(n);
  return { lower: partial + 1 / (n + 1), upper: partial + 1 / n };
}

/** N-term Fourier reconstruction of x² on [-π, π]. */
export function baselFourier(x: number, n: number): number {
  if (!Number.isFinite(x) || !Number.isInteger(n) || n < 1 || n > 80) {
    throw new RangeError('Expected finite x and 1 to 80 harmonics.');
  }
  let value = Math.PI ** 2 / 3;
  for (let k = 1; k <= n; k++) {
    value += 4 * (k % 2 === 0 ? 1 : -1) * Math.cos(k * x) / (k * k);
  }
  return value;
}
