import { factorialScientific, laplaceArea, laplaceKernel, logFactorial, stirlingLogs, stirlingRelativeErrors } from './stirling';

describe('Stirling numerical model', () => {
  it('matches small factorials and represents large ones without overflow', () => {
    expect(logFactorial(1)).toBe(0);
    expect(logFactorial(10)).toBeCloseTo(Math.log(3628800), 13);
    expect(factorialScientific(logFactorial(1000)).exponent).toBe(2567);
    expect(factorialScientific(logFactorial(1000)).mantissa).toBe('4.0238726');
  });
  it('brackets the log factorial with the corrected approximations', () => {
    for (const n of [1, 2, 5, 10, 20]) {
      const [base, upper, lower] = stirlingLogs(n);
      expect(base).toBeLessThan(logFactorial(n));
      expect(upper).toBeGreaterThan(logFactorial(n));
      expect(lower).toBeLessThan(logFactorial(n));
    }
  });
  it('reduces the relative error with successive corrections', () => {
    const errors = stirlingRelativeErrors(10).map(Math.abs);
    expect(errors[0]).toBeCloseTo(0.0082959604, 9);
    expect(errors[1]).toBeLessThan(errors[0]);
    expect(errors[2]).toBeLessThan(errors[1]);
  });
  it('has a unit-height peak and vanishes outside the integral domain', () => {
    for (const n of [1, 5, 1000]) {
      expect(laplaceKernel(n, 0)).toBe(1);
      expect(laplaceKernel(n, -Math.sqrt(n))).toBe(0);
      expect(laplaceKernel(n, -Math.sqrt(n) - 1)).toBe(0);
      expect(laplaceKernel(n, 1)).toBeLessThan(1);
    }
  });
  it('approaches the Gaussian profile and area', () => {
    expect(laplaceArea(1)).toBeCloseTo(Math.E, 13);
    expect(Math.abs(laplaceArea(1000) - Math.sqrt(2 * Math.PI))).toBeLessThan(0.00021);
    const gaussian = Math.exp(-0.5);
    expect(Math.abs(laplaceKernel(1000, 1) - gaussian)).toBeLessThan(Math.abs(laplaceKernel(5, 1) - gaussian));
  });
  it('rejects invalid inputs', () => {
    for (const n of [0, -1, 1.5, NaN, Infinity, 1001]) expect(() => logFactorial(n)).toThrowError(RangeError);
    expect(() => laplaceKernel(1, NaN)).toThrowError(RangeError);
  });
});
