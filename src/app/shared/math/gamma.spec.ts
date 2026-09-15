import { gamma } from './gamma';
describe('gamma', () => {
  it('matches factorials and half-integers', () => {
    expect(gamma(1)).toBeCloseTo(1, 10); expect(gamma(5)).toBeCloseTo(24, 10);
    expect(gamma(0.5)).toBeCloseTo(Math.sqrt(Math.PI), 10);
    expect(gamma(-0.5)).toBeCloseTo(-2 * Math.sqrt(Math.PI), 10);
    expect(gamma(-1.5)).toBeCloseTo(4 * Math.sqrt(Math.PI) / 3, 10);
    expect(gamma(171) / 7.257415615307999e306).toBeCloseTo(1, 10);
  });
  it('handles poles, invalid input and the recurrence', () => {
    [0, -1, -170, Infinity, NaN, 172].forEach(x => expect(() => gamma(x)).toThrow());
    [-3.2, -0.2, 0.2, 3.2].forEach(x => expect(gamma(x + 1)).toBeCloseTo(x * gamma(x), 9));
    expect(gamma(-0.0001)).toBeLessThan(0); expect(gamma(0.0001)).toBeGreaterThan(0);
  });
});
