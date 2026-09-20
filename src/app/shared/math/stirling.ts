export const MAX_STIRLING_N = 1000;
export const STIRLING_ERROR_FLOOR = 1e-11;
const logs = new Float64Array(MAX_STIRLING_N + 1);
let total = 0;
let compensation = 0;
for (let n = 1; n <= MAX_STIRLING_N; n++) {
  const increment = Math.log(n) - compensation;
  const next = total + increment;
  compensation = (next - total) - increment;
  logs[n] = total = next;
}

function validate(n: number): void {
  if (!Number.isInteger(n) || n < 1 || n > MAX_STIRLING_N) {
    throw new RangeError(`Expected an integer between 1 and ${MAX_STIRLING_N}.`);
  }
}

export function logFactorial(n: number): number { validate(n); return logs[n]; }

export function stirlingLogs(n: number): number[] {
  validate(n);
  const leading = (n + 0.5) * Math.log(n) - n + 0.5 * Math.log(2 * Math.PI);
  return [leading, leading + 1 / (12 * n), leading + 1 / (12 * n) - 1 / (360 * n ** 3)];
}

export function stirlingRelativeErrors(n: number): number[] {
  const reference = logFactorial(n);
  return stirlingLogs(n).map(value => Math.expm1(value - reference));
}

export function factorialScientific(logValue: number): { mantissa: string; exponent: number } {
  const decimal = logValue / Math.LN10;
  let exponent = Math.floor(decimal);
  let mantissa = Number((10 ** (decimal - exponent)).toFixed(7));
  if (mantissa >= 10) { mantissa = 1; exponent++; }
  return { mantissa: mantissa.toFixed(7), exponent };
}

/** Integrand after t = n + sqrt(n) u, divided by its peak. */
export function laplaceKernel(n: number, u: number): number {
  validate(n);
  if (!Number.isFinite(u)) throw new RangeError('Expected a finite coordinate.');
  const v = u / Math.sqrt(n);
  if (v <= -1) return 0;
  return Math.exp(n * (Math.log1p(v) - v));
}

export function laplaceArea(n: number): number {
  return Math.sqrt(2 * Math.PI) * Math.exp(logFactorial(n) - stirlingLogs(n)[0]);
}
