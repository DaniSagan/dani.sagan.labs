import { BASEL_SUM, baselBounds, baselFourier, baselPartialSum } from './basel';

describe('Basel numerical model', () => {
  it('calculates known partial sums', () => {
    expect(baselPartialSum(1)).toBe(1);
    expect(baselPartialSum(2)).toBe(1.25);
    expect(baselPartialSum(3)).toBeCloseTo(49 / 36, 14);
  });

  it('increases towards the limit inside the integral remainder bounds', () => {
    let previous = 0;
    for (const n of [1, 2, 10, 100, 1000, 10000]) {
      const value = baselPartialSum(n);
      const remainder = BASEL_SUM - value;
      const bounds = baselBounds(n);
      expect(value).toBeGreaterThan(previous);
      expect(remainder).toBeGreaterThan(1 / (n + 1));
      expect(remainder).toBeLessThan(1 / n);
      expect(bounds.lower).toBeLessThan(BASEL_SUM);
      expect(bounds.upper).toBeGreaterThan(BASEL_SUM);
      expect(bounds.upper - bounds.lower).toBeCloseTo(1 / (n * (n + 1)), 14);
      previous = value;
    }
  });

  it('rejects invalid summation and harmonic counts', () => {
    for (const n of [0, -1, 1.5, NaN, Infinity, 10001]) {
      expect(() => baselPartialSum(n)).toThrowError(RangeError);
    }
    expect(() => baselFourier(NaN, 5)).toThrowError(RangeError);
    expect(() => baselFourier(0, 81)).toThrowError(RangeError);
  });

  it('recovers the Basel partial sum at both endpoints', () => {
    for (const n of [1, 5, 20, 80]) {
      const expected = Math.PI ** 2 / 3 + 4 * baselPartialSum(n);
      expect(baselFourier(Math.PI, n)).toBeCloseTo(expected, 12);
      expect(baselFourier(-Math.PI, n)).toBeCloseTo(expected, 12);
      expect(Math.PI ** 2 - expected).toBeCloseTo(4 * (BASEL_SUM - baselPartialSum(n)), 12);
    }
  });

  it('is even and approaches the parabola away from the endpoints', () => {
    for (const x of [0, 0.4, 1.5, 2.5]) {
      expect(baselFourier(x, 80)).toBeCloseTo(baselFourier(-x, 80), 12);
      expect(Math.abs(baselFourier(x, 80) - x * x)).toBeLessThan(0.002);
    }
  });
});
