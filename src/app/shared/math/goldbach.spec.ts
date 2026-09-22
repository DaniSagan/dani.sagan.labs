import { excludedBy, goldbachPairs, primeSieve } from './goldbach';

describe('Goldbach exact arithmetic', () => {
  const prime = primeSieve(1000);
  const trialPrime = (n: number) =>
    n >= 2 &&
    !Array.from(
      { length: Math.max(0, Math.floor(Math.sqrt(n)) - 1) },
      (_, i) => i + 2,
    ).some((d) => n % d === 0);
  it('agrees with independent trial division including squares and boundaries', () => {
    for (let n = 0; n <= 1000; n++) expect(!!prime[n]).toBe(trialPrime(n));
  });
  it('includes repeated primes and never duplicates reversed pairs', () => {
    expect(goldbachPairs(4, prime)).toEqual([[2, 2]]);
    expect(goldbachPairs(10, prime)).toEqual([
      [3, 7],
      [5, 5],
    ]);
    expect(goldbachPairs(100, prime)).toEqual([
      [3, 97],
      [11, 89],
      [17, 83],
      [29, 71],
      [41, 59],
      [47, 53],
    ]);
    for (let n = 4; n <= 300; n += 2) {
      const expected: [number, number][] = [];
      for (let p = 2; p <= n / 2; p++)
        if (trialPrime(p) && trialPrime(n - p)) expected.push([p, n - p]);
      expect(goldbachPairs(n, prime)).toEqual(expected);
    }
  });
  it('rejects invalid inputs rather than reporting false counterexamples', () => {
    [NaN, Infinity, 0, 3, 5, 4.5, 1002].forEach((n) =>
      expect(() => goldbachPairs(n, prime)).toThrow(),
    );
    [NaN, Infinity, 1, 3.5, 100001].forEach((n) =>
      expect(() => primeSieve(n)).toThrow(),
    );
    expect(goldbachPairs(100000, primeSieve(100000)).length).toBeGreaterThan(0);
  });
  it('preserves the divisor itself and detects composites on either side', () => {
    expect(excludedBy(3, 10, [2, 3, 5, 7])).toBeUndefined();
    expect(excludedBy(23, 100, [2, 3, 5])).toBeUndefined();
    expect(excludedBy(23, 100, [7])).toBe(7);
    expect(excludedBy(49, 100, [7])).toBe(7);
    for (let n = 4; n <= 200; n += 2) {
      for (let p = 2; p <= n / 2; p++) {
        expect(!excludedBy(p, n, [2, 3, 5, 7, 11, 13])).toBe(
          !!(prime[p] && prime[n - p]),
        );
      }
    }
  });
});
