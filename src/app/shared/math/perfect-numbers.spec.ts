import { mersenneConstruction, properDivisors } from './perfect-numbers';

describe('perfect number calculations', () => {
  it('finds proper divisors without duplicating square roots or including n', () => {
    expect(properDivisors(1)).toEqual([]);
    expect(properDivisors(13)).toEqual([1]);
    expect(properDivisors(36)).toEqual([1, 2, 3, 4, 6, 9, 12, 18]);
    [6, 28, 496, 8128, 33550336].forEach(n => expect(properDivisors(n).reduce((a, b) => a + b, 0)).toBe(n));
    expect(properDivisors(1000000000).includes(1000000000)).toBeFalse();
  });
  it('rejects invalid numbers and exponents', () => {
    [0, -1, 1.5, NaN, Infinity, 1000000001].forEach(n => expect(() => properDivisors(n)).toThrow());
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
