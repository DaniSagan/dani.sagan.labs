import { EXTRA_CONSTANTS, EXTRA_FUNCTIONS } from './math-catalog';

describe('Extended mathematical catalog', () => {
  const fn = Object.fromEntries(EXTRA_FUNCTIONS.map(entry => [entry.name, entry.fn]));
  const constants = Object.fromEntries(EXTRA_CONSTANTS.map(entry => [entry.name, entry.value]));

  it('reproduces the expanded wave sums and rejects unsupported source counts', () => {
    for (const n of [3,7,16]) {
      const x = 0.37, y = -0.81, f = 5;
      let crystal = 0, circular = 0;
      for (let k = 0; k < n; k++) {
        crystal += Math.cos(f*(Math.cos(Math.PI*k/n)*x+Math.sin(Math.PI*k/n)*y));
        circular += Math.cos(f*Math.hypot(x-Math.cos(2*Math.PI*k/n),y-Math.sin(2*Math.PI*k/n)));
      }
      expect(fn['waveCrystal'](x,y,n,f)).toBeCloseTo(crystal,12);
      expect(fn['circularWaves'](x,y,n,f)).toBeCloseTo(circular,12);
    }
    for (const name of ['waveCrystal','circularWaves']) {
      expect(fn[name](0,0,2.5,4)).toBeNaN();
      expect(fn[name](0,0,0,4)).toBeNaN();
      expect(fn[name](0,0,65,4)).toBeNaN();
      expect(fn[name](Infinity,0,5,4)).toBeNaN();
    }
  });

  it('evaluates Gielis radii and complex iterations with documented domains', () => {
    for (const t of [0,0.2,1,Math.PI,2*Math.PI]) {
      expect(fn['superformula'](t,4,2,2,2)).toBeCloseTo(1, 12);
      expect(fn['superformula'](t,5,0.35,1.7,1.7)).toBeCloseTo(fn['superformula'](t+2*Math.PI,5,0.35,1.7,1.7), 12);
    }
    expect(fn['superformula'](0,6,0,2,2)).toBeNaN();
    expect(fn['superformula'](NaN,6,1,2,2)).toBeNaN();
    expect(fn['superformula'](0,4,2,2,2,0,1)).toBeNaN();
    expect(fn['mandelbrotRadius'](1,0,3)).toBe(5);
    expect(fn['mandelbrotRadius'](0,1,2)).toBeCloseTo(Math.sqrt(2), 12);
    expect(fn['mandelbrotRadius'](0,1,2,3)).toBe(0);
    expect(fn['mandelbrotRadius'](0,0,12,8)).toBe(0);
    expect(fn['mandelbrotRadius'](3,3,12,8)).toBe(Infinity);
    expect(fn['mandelbrotRadius'](0,0,0)).toBeNaN();
    expect(fn['mandelbrotRadius'](0,0,2,2.5)).toBeNaN();
  });

  it('provides unique identifiers and help for every entry', () => {
    const entries = [...EXTRA_FUNCTIONS, ...EXTRA_CONSTANTS];
    expect(new Set(entries.map(entry => entry.name)).size).toBe(entries.length);
    for (const entry of entries) {
      expect(entry.name).toMatch(/^[A-Za-z_][A-Za-z0-9_]*$/);
      expect(entry.description.length).toBeGreaterThan(entry.name.length);
    }
  });

  it('evaluates real special functions and respects their domains', () => {
    expect(fn['gamma'](0.5)).toBeCloseTo(Math.sqrt(Math.PI), 12);
    expect(fn['gamma'](-0.5)).toBeCloseTo(-2 * Math.sqrt(Math.PI), 12);
    expect(fn['gamma'](6)).toBeCloseTo(120, 10);
    expect(fn['gamma'](-2)).toBeNaN();
    expect(fn['logGamma'](1000)).toBeCloseTo(5905.220423209181, 8);
    expect(fn['beta'](2, 3)).toBeCloseTo(1 / 12, 12);
    expect(fn['erf'](0)).toBe(0);
    expect(fn['erf'](1)).toBeCloseTo(0.8427007929497149, 6);
    expect(fn['erf'](-1)).toBeCloseTo(-fn['erf'](1), 12);
    expect(fn['erfc'](Infinity)).toBe(0);
  });

  it('handles integers, combinatorics and invalid arguments', () => {
    expect(fn['factorial'](0)).toBe(1);
    expect(fn['factorial'](10)).toBe(3628800);
    expect(fn['factorial'](0.5)).toBeNaN();
    expect(fn['choose'](52, 5)).toBe(2598960);
    expect(fn['choose'](5, 6)).toBe(0);
    expect(fn['gcd'](-48, 18)).toBe(6);
    expect(fn['lcm'](0, 0)).toBe(0);
    expect(fn['gcd'](1.5, 3)).toBeNaN();
    expect(fn['isPrime'](997)).toBe(1);
    expect(fn['isPrime'](999)).toBe(0);
    expect(fn['fibonacci'](10)).toBe(55);
    expect(fn['lucas'](5)).toBe(11);
    expect(fn['catalan'](5)).toBe(42);
    expect(fn['harmonic'](1001)).toBeNaN();
  });

  it('handles statistical tails, waves and polynomial conventions', () => {
    expect(fn['normalCDF'](0)).toBe(0.5);
    expect(fn['normalCDF'](-8)).toBeGreaterThan(0);
    expect(fn['normalPDF'](0)).toBeCloseTo(1 / Math.sqrt(2 * Math.PI), 12);
    expect(fn['normalPDF'](0, 0, -1)).toBeNaN();
    expect(fn['sigmoid'](-1000)).toBe(0);
    expect(fn['softplus'](1000)).toBe(1000);
    expect(fn['variance'](1, 2, 3)).toBeCloseTo(2 / 3, 12);
    expect(fn['mod'](-1, 3)).toBe(2);
    expect(fn['sinc'](0)).toBe(1);
    expect(fn['root'](-8, 3)).toBe(-2);
    expect(fn['smoothstep'](0, 1, 0.5)).toBe(0.5);
    expect(fn['legendre'](2, 0.5)).toBe(-0.125);
    expect(fn['chebyshevT'](3, 0.5)).toBe(-1);
    expect(fn['chebyshevU'](2, 0.5)).toBe(0);
    expect(fn['hermite'](2, 0.5)).toBe(-1);
    expect(fn['distance'](0, 0, 3, 4)).toBe(5);
    expect(fn['rotateX'](1, 0, Math.PI / 2)).toBeCloseTo(0, 14);
    expect(fn['rotateY'](1, 0, Math.PI / 2)).toBeCloseTo(1, 14);
  });

  it('preserves defining identities of mathematical constants', () => {
    expect(constants['PHI'] ** 2).toBeCloseTo(constants['PHI'] + 1, 14);
    expect(constants['PLASTIC'] ** 3).toBeCloseTo(constants['PLASTIC'] + 1, 14);
    expect(constants['OMEGA'] * Math.exp(constants['OMEGA'])).toBeCloseTo(1, 14);
    for (const entry of EXTRA_CONSTANTS) expect(Number.isFinite(entry.value)).toBeTrue();
  });
});
