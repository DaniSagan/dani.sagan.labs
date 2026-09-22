export const GOLDBACH_LIMIT = 100000;

/** Exact Eratosthenes sieve for the bounded, interactive experiments. */
export function primeSieve(limit: number): Uint8Array {
  if (!Number.isInteger(limit) || limit < 2 || limit > GOLDBACH_LIMIT) {
    throw new RangeError('Límite de criba no válido');
  }
  const prime = new Uint8Array(limit + 1);
  prime.fill(1, 2);
  for (let p = 2; p * p <= limit; p++) {
    if (prime[p]) for (let k = p * p; k <= limit; k += p) prime[k] = 0;
  }
  return prime;
}

export function goldbachPairs(
  n: number,
  prime: Uint8Array,
): [number, number][] {
  if (!Number.isInteger(n) || n < 4 || n % 2 !== 0 || n >= prime.length) {
    throw new RangeError('Elige un número par dentro de la criba');
  }
  const pairs: [number, number][] = [];
  for (let p = 2; p <= n / 2; p++) {
    if (prime[p] && prime[n - p]) pairs.push([p, n - p]);
  }
  return pairs;
}

/** Exclude proper multiples, preserving the prime divisor itself. */
export function excludedBy(
  p: number,
  n: number,
  divisors: readonly number[],
): number | undefined {
  return divisors.find(
    (d) => (p > d && p % d === 0) || (n - p > d && (n - p) % d === 0),
  );
}
