export interface DivisorData { divisors: readonly bigint[]; sum: bigint; }
const cache = new Map<bigint, DivisorData>();
let cacheCost = 0;
const CACHE_BUDGET = 100000;

export function parseAliquotStart(input: string | number | bigint | null): bigint {
  if (input === null || (typeof input === 'number' && !Number.isSafeInteger(input)) ||
      !/^[0-9]+$/.test(String(input).trim())) throw new Error('Introduce un entero positivo en formato decimal.');
  const value = BigInt(String(input).trim());
  if (value < 1n) throw new Error('Introduce un entero positivo.');
  return value;
}

// Yield during factorization so the explorer can process cancellation and repaint.
export function* aliquotDivisors(n: bigint): Generator<void, DivisorData> {
  if (n < 1n) throw new Error('Introduce un entero positivo.');
  const hit = cache.get(n);
  if (hit) {
    cache.delete(n); cache.set(n, hit);
    return hit;
  }
  let remainder = n;
  const divisors = [1n];
  for (let d = 2n, increment = 2n; remainder > 1n;) {
    if (d > remainder / d) d = remainder;
    const length = divisors.length;
    let power = 1n;
    while (remainder % d === 0n) {
      remainder /= d; power *= d;
      for (let i = 0; i < length; i++) { divisors.push(divisors[i] * power); yield; }
    }
    if (d === 2n) d = 3n;
    else if (d === 3n) d = 5n;
    else { d += increment; increment = 6n - increment; }
    yield;
  }
  const proper = divisors.filter(d => d !== n).sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
  const data = Object.freeze({ divisors: Object.freeze(proper), sum: proper.reduce((a, b) => a + b, 0n) });
  // Charge for digit storage too, so very large integers cannot dominate the cache.
  const cost = proper.reduce((total, d) => total + d.toString().length, n.toString().length + data.sum.toString().length);
  if (cost <= CACHE_BUDGET) {
    while (cacheCost + cost > CACHE_BUDGET) {
      const key = cache.keys().next().value!;
      const old = cache.get(key)!;
      cacheCost -= old.divisors.reduce((total, d) => total + d.toString().length, key.toString().length + old.sum.toString().length);
      cache.delete(key);
    }
    cache.set(n, data); cacheCost += cost;
  }
  return data;
}

export function bigintDivisorData(n: bigint): DivisorData {
  const calculation = aliquotDivisors(n);
  let step = calculation.next();
  while (!step.done) step = calculation.next();
  return step.value;
}

/** Approximate only the logarithm, without converting a huge integer to Infinity. */
export function bigintLog10(value: bigint): number {
  const digits = value.toString();
  const leading = digits.slice(0, 15);
  return Math.log10(Number(leading)) + digits.length - leading.length;
}
