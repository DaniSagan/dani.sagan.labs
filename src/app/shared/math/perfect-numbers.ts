export const MAX_PERFECT_INPUT = 1000000000;

export function properDivisors(n: number): number[] {
  if (!Number.isInteger(n) || n < 1 || n > MAX_PERFECT_INPUT) {
    throw new Error(`Introduce un entero entre 1 y ${MAX_PERFECT_INPUT}.`);
  }
  if (n === 1) return [];
  const divisors = [1];
  for (let d = 2; d * d <= n; d++) {
    if (n % d === 0) {
      divisors.push(d);
      if (d * d !== n) divisors.push(n / d);
    }
  }
  return divisors.sort((a, b) => a - b);
}

export function mersenneConstruction(p: number): { mersenne: number; factor: number | null; candidate: bigint } {
  if (!Number.isInteger(p) || p < 2 || p > 31) throw new Error('Elige un exponente entero entre 2 y 31.');
  const mersenne = 2 ** p - 1;
  let factor: number | null = null;
  for (let d = 3; d * d <= mersenne; d += 2) {
    if (mersenne % d === 0) { factor = d; break; }
  }
  return { mersenne, factor, candidate: (2n ** BigInt(p - 1)) * BigInt(mersenne) };
}
