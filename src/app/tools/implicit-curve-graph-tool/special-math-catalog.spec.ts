import { SPECIAL_CONSTANTS, SPECIAL_FUNCTIONS } from './special-math-catalog';

describe('Special mathematical catalog', () => {
  const fn = Object.fromEntries(SPECIAL_FUNCTIONS.map(entry => [entry.name, entry.fn]));
  const constants = Object.fromEntries(SPECIAL_CONSTANTS.map(entry => [entry.name, entry.value]));

  it('exposes generic functions instead of entries for fixed orders', () => {
    for (const entry of SPECIAL_FUNCTIONS) {
      expect(entry.name).not.toMatch(/^(legendre\d|jacobi\d|sinHarmonic|cosHarmonic|bernstein49_|rising\d|falling\d|powerMeanNeg\d)/);
      expect(entry.description.length).toBeGreaterThan(entry.name.length);
    }
    expect(new Set([...SPECIAL_FUNCTIONS, ...SPECIAL_CONSTANTS].map(entry => entry.name)).size)
      .toBe(SPECIAL_FUNCTIONS.length + SPECIAL_CONSTANTS.length);
    expect(fn['jacobi'](2, 0.5, 1, 2)).toBeCloseTo(-0.1875, 12);
    expect(fn['laguerre'](2, 2)).toBeCloseTo(-1, 12);
    expect(fn['gegenbauer'](2, 0.5, 1)).toBeCloseTo(0, 12);
    expect(fn['hermiteHe'](2, 2)).toBe(3);
    expect(fn['laguerre'](0, 1, -1)).toBeNaN();
    expect(fn['jacobi'](201, 1)).toBeNaN();
    expect(fn['risingFactorial'](1, 5)).toBe(120);
    expect(fn['fallingFactorial'](5, 5)).toBe(120);
    expect(fn['risingFactorial'](1, 0)).toBe(1);
    expect(fn['powerMean'](0, 1, 4)).toBeCloseTo(2, 12);
    expect(fn['powerMean'](1e-12, 1, 4)).toBeCloseTo(2, 10);
  });

  it('evaluates zeta and polygamma against known special values', () => {
    expect(fn['zeta'](2)).toBeCloseTo(Math.PI ** 2 / 6, 12);
    expect(fn['zeta'](3)).toBeCloseTo(1.2020569031595942, 12);
    expect(fn['zeta'](2, 0.5)).toBeCloseTo(Math.PI ** 2 / 2, 11);
    expect(fn['polygamma'](0, 1)).toBeCloseTo(-0.5772156649015329, 12);
    expect(fn['polygamma'](1, 1)).toBeCloseTo(Math.PI ** 2 / 6, 12);
    expect(fn['polygamma'](2, 1)).toBeCloseTo(-2 * 1.2020569031595942, 12);
    expect(fn['zeta'](1)).toBeNaN();
    expect(fn['zeta'](2, 0)).toBeNaN();
    expect(fn['polygamma'](1.5, 2)).toBeNaN();
  });

  it('preserves zeta and polygamma recurrence relations', () => {
    for (const s of [1.1, 2, 5, 15, 50]) {
      expect(fn['zeta'](s, 0.7) - fn['zeta'](s, 1.7)).toBeCloseTo(0.7 ** -s, 7);
    }
    for (let order = 0, factorial = 1; order <= 6; order++) {
      if (order > 0) factorial *= order;
      expect(fn['polygamma'](order, 1.7) - fn['polygamma'](order, 0.7))
        .toBeCloseTo((order % 2 ? -1 : 1) * factorial / 0.7 ** (order + 1), 9);
    }
  });

  it('solves both real Lambert W branches including very small values', () => {
    expect(fn['lambertW'](1)).toBeCloseTo(0.5671432904097838, 13);
    expect(fn['lambertW'](-1 / Math.E)).toBe(-1);
    expect(fn['lambertW'](Number.MIN_VALUE)).toBe(Number.MIN_VALUE);
    expect(fn['lambertW'](-Number.MIN_VALUE)).toBe(-Number.MIN_VALUE);
    for (const x of [-0.36, -0.1, -1e-30]) {
      const w = fn['lambertW'](x, -1);
      expect(w).toBeLessThanOrEqual(-1);
      expect(w + Math.log(-w)).toBeCloseTo(Math.log(-x), 11);
    }
    const large = fn['lambertW'](1e308);
    expect(large + Math.log(large)).toBeCloseTo(Math.log(1e308), 11);
    expect(fn['lambertW'](0, -1)).toBe(-Infinity);
    expect(fn['lambertW'](-1)).toBeNaN();
    expect(fn['lambertW'](1, -1)).toBeNaN();
    expect(fn['lambertW'](1, 2)).toBeNaN();
  });

  it('evaluates complete elliptic integrals using parameter m', () => {
    expect(fn['ellipticK'](0)).toBeCloseTo(Math.PI / 2, 12);
    expect(fn['ellipticE'](0)).toBeCloseTo(Math.PI / 2, 12);
    expect(fn['ellipticK'](0.5)).toBeCloseTo(1.8540746773013719, 12);
    expect(fn['ellipticE'](0.5)).toBeCloseTo(1.3506438810476755, 12);
    expect(fn['ellipticK'](1)).toBe(Infinity);
    expect(fn['ellipticE'](1)).toBe(1);
    expect(fn['ellipticK'](-0.1)).toBeNaN();
    expect(fn['agm'](0, 1)).toBe(0);
    expect(fn['agm'](1, 1)).toBe(1);
    expect(Math.PI / fn['agm'](1, Math.SQRT2)).toBeCloseTo(constants['LEMNISCATE'], 12);
  });

  it('evaluates the exponential integral on both sides of its algorithm boundary', () => {
    expect(fn['expIntegralE1'](1)).toBeCloseTo(0.2193839343955203, 12);
    expect(fn['expIntegralE1'](2)).toBeCloseTo(0.04890051070806112, 12);
    expect(fn['expIntegralE1'](0.1)).toBeCloseTo(1.8229239584193906, 12);
    expect(fn['expIntegralE1'](1 + 1e-10)).toBeCloseTo(fn['expIntegralE1'](1), 9);
    expect(fn['expIntegralE1'](0)).toBe(Infinity);
    expect(fn['expIntegralE1'](Infinity)).toBe(0);
    expect(fn['expIntegralE1'](-1)).toBeNaN();
  });

  it('evaluates arithmetic functions including repeated prime factors', () => {
    expect(fn['totient'](1)).toBe(1);
    expect(fn['totient'](36)).toBe(12);
    expect(fn['mobius'](1)).toBe(1);
    expect(fn['mobius'](30)).toBe(-1);
    expect(fn['mobius'](12)).toBe(0);
    expect(fn['liouville'](12)).toBe(-1);
    expect(fn['divisorSigma'](12)).toBe(28);
    expect(fn['divisorSigma'](12, 0)).toBe(6);
    expect(fn['totient'](0)).toBeNaN();
    expect(fn['mobius'](1.5)).toBeNaN();
  });

  it('preserves generic Bernstein normalization and named constant identities', () => {
    for (const n of [0, 1, 5, 49, 200]) {
      let sum = 0;
      for (let k = 0; k <= n; k++) sum += fn['bernstein'](n, k, 0.3);
      expect(sum).toBeCloseTo(1, 10);
    }
    expect(Math.cos(constants['DOTTIE'])).toBeCloseTo(constants['DOTTIE'], 14);
    let erdos = 0;
    for (let n = 1; n <= 60; n++) erdos += 1 / (2 ** n - 1);
    expect(erdos).toBeCloseTo(constants['ERDOS_BORWEIN'], 14);
    for (const entry of SPECIAL_CONSTANTS) expect(Number.isFinite(entry.value)).toBeTrue();
  });
});
