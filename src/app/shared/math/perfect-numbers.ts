export const MAX_PERFECT_INPUT = 1000000000;

// Bound the cache by the number of stored divisors, including entries for primes.
const divisorCache = new Map<number, readonly number[]>();
const CACHE_BUDGET = 100000;
let cachedSize = 0;

export function properDivisors(n: number): number[] {
  if (!Number.isSafeInteger(n) || n < 1) {
    throw new Error(`Introduce un entero entre 1 y ${Number.MAX_SAFE_INTEGER}.`);
  }
  const cached = divisorCache.get(n);
  if (cached) {
    divisorCache.delete(n);
    divisorCache.set(n, cached);
    return [...cached];
  }

  // Factor the shrinking remainder, then generate divisors from prime powers.
  let remainder = n;
  const divisors = [1];
  const extract = (prime: number): void => {
    const length = divisors.length;
    let power = 1;
    while (remainder % prime === 0) {
      remainder /= prime;
      power *= prime;
      for (let i = 0; i < length; i++) divisors.push(divisors[i] * power);
    }
  };
  extract(2);
  extract(3);
  // All remaining prime factors are of the form 6k ? 1.
  for (let d = 5, increment = 2; d <= remainder / d; d += increment, increment = 6 - increment) {
    extract(d);
  }
  if (remainder > 1) extract(remainder);
  const result = divisors.filter(d => d !== n).sort((a, b) => a - b);
  const cost = result.length + 1;
  if (cost <= CACHE_BUDGET) {
    while (cachedSize + cost > CACHE_BUDGET) {
      const oldest = divisorCache.keys().next().value!;
      cachedSize -= divisorCache.get(oldest)!.length + 1;
      divisorCache.delete(oldest);
    }
    divisorCache.set(n, result);
    cachedSize += cost;
  }
  // Callers can modify their copy without corrupting subsequent calculations.
  return [...result];
}

/** Returns null when the exact sum cannot be represented safely as a number. */
export function properDivisorSum(n: number): number | null {
  const sum = properDivisors(n).reduce((total, divisor) => total + BigInt(divisor), 0n);
  return sum <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(sum) : null;
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
