import { mersenneConstruction, properDivisors, properDivisorSum } from './perfect-numbers';

describe('perfect number calculations', () => {
  it('finds proper divisors without duplicating square roots or including n', () => {
    expect(properDivisors(1)).toEqual([]);
    expect(properDivisors(13)).toEqual([1]);
    expect(properDivisors(36)).toEqual([1, 2, 3, 4, 6, 9, 12, 18]);
    [6, 28, 496, 8128, 33550336].forEach(n => expect(properDivisors(n).reduce((a, b) => a + b, 0)).toBe(n));
    expect(properDivisors(1000000000).includes(1000000000)).toBeFalse();
  });
  it('factors large values and protects cached divisors from mutation', () => {
    expect(properDivisors(1000000007)).toEqual([1]);
    expect(properDivisorSum(2 ** 52)).toBe(2 ** 52 - 1);
    expect(properDivisorSum(3 * 2 ** 51)).toBeNull();
    const divisors = properDivisors(36);
    divisors.push(999);
    expect(properDivisors(36)).toEqual([1, 2, 3, 4, 6, 9, 12, 18]);
    for (let n = 1; n <= 300; n++) {
      const expected = Array.from({ length: n - 1 }, (_, i) => i + 1).filter(d => n % d === 0);
      expect(properDivisors(n)).toEqual(expected);
    }
  });
  it('rejects invalid numbers and exponents', () => {
    [0, -1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1].forEach(n => expect(() => properDivisors(n)).toThrow());
    [1, 32, 2.5, NaN].forEach(p => expect(() => mersenneConstruction(p)).toThrow());
  });
  it('distinguishes prime Mersenne numbers from prime exponents and preserves large integers', () => {
    expect(mersenneConstruction(5)).toEqual({ mersenne: 31, factor: null, candidate: 496n });
    expect(mersenneConstruction(11).factor).toBe(23);
    expect(mersenneConstruction(4).factor).toBe(3);
    expect(mersenneConstruction(31).candidate.toString()).toBe('2305843008139952128');
    expect(mersenneConstruction(31).factor).toBeNull();
  });
});
