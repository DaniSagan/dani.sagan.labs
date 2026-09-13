import { properDivisors } from './perfect-numbers';

export function amicableJourney(n: number): { n: number; partner: number; returned: number | null; firstDivisors: number[]; secondDivisors: number[]; kind: 'amicable' | 'perfect' | 'other' | 'zero' } {
  if (!Number.isInteger(n) || n < 1 || n > 1000000) throw new Error('Introduce un entero entre 1 y 1000000.');
  const firstDivisors = properDivisors(n);
  const partner = firstDivisors.reduce((a, b) => a + b, 0);
  if (partner === 0) return { n, partner, returned: null, firstDivisors, secondDivisors: [], kind: 'zero' };
  const secondDivisors = properDivisors(partner);
  const returned = secondDivisors.reduce((a, b) => a + b, 0);
  return { n, partner, returned, firstDivisors, secondDivisors,
    kind: partner === n ? 'perfect' : returned === n ? 'amicable' : 'other' };
}

/** Sieve; only pairs whose two members lie inside the inclusive bound are returned. */
export function findAmicablePairs(limit: number): [number, number][] {
  if (!Number.isInteger(limit) || limit < 1 || limit > 100000) throw new Error('Introduce un límite entero entre 1 y 100000.');
  const sums = new Float64Array(limit + 1);
  for (let d = 1; d <= limit / 2; d++) {
    for (let multiple = 2 * d; multiple <= limit; multiple += d) sums[multiple] += d;
  }
  const result: [number, number][] = [];
  for (let a = 2; a <= limit; a++) {
    const b = sums[a];
    if (b > a && b <= limit && sums[b] === a) result.push([a, b]);
  }
  return result;
}
