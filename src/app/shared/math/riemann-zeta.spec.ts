import { riemannZeta } from './riemann-zeta';

describe('riemannZeta', () => {
  it('evaluates known real values on both sides of the pole', () => {
    [
      [2, Math.PI ** 2 / 6],
      [4, Math.PI ** 4 / 90],
      [0, -0.5],
      [-1, -1 / 12],
      [-3, 1 / 120],
      [0.5, -1.4603545088095868],
    ].forEach(([s, expected]) => {
      expect(riemannZeta(s, 0).re).toBeCloseTo(expected, 10);
      expect(riemannZeta(s, 0).im).toBe(0);
    });
  });
  it('evaluates complex reference values and conjugate symmetry', () => {
    const z = riemannZeta(2, 3);
    expect(z.re).toBeCloseTo(0.7980219851462757, 9);
    expect(z.im).toBeCloseTo(-0.1137443080529385, 9);
    const negative = riemannZeta(-2, 3);
    expect(negative.re).toBeCloseTo(0.132971155879298, 9);
    expect(negative.im).toBeCloseTo(0.123053300404588, 9);
    expect(riemannZeta(-2, -3).re).toBeCloseTo(negative.re, 10);
    expect(riemannZeta(-2, -3).im).toBeCloseTo(-negative.im, 10);
  });
  it('finds trivial and the first three nontrivial zeros', () => {
    [-2, -4, -20].forEach((s) =>
      expect(riemannZeta(s, 0)).toEqual({ re: 0, im: 0 }),
    );
    [14.134725141734695, 21.022039638771555, 25.01085758014569].forEach((t) => {
      const z = riemannZeta(0.5, t);
      expect(Math.hypot(z.re, z.im)).toBeLessThan(1e-10);
    });
  });
  it('handles the pole, near-pole values and invalid input explicitly', () => {
    expect(() => riemannZeta(1, 0)).toThrowError(/polo/);
    expect(() => riemannZeta(NaN, 0)).toThrowError(/finitos/);
    expect(() => riemannZeta(0, Infinity)).toThrowError(/finitos/);
    expect(() => riemannZeta(0.5, 100001)).toThrowError(/límite/);
    expect(riemannZeta(1 + 1e-6, 0).re * 1e-6).toBeCloseTo(1, 5);
    const z = riemannZeta(1, (2 * Math.PI) / Math.LN2);
    expect(Number.isFinite(z.re) && Number.isFinite(z.im)).toBeTrue();
  });
});
