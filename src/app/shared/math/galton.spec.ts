import { binomialMasses, choose, galtonPath, galtonRandom, normalBinProbability, normalCdf } from './galton';

describe('Galton probability model', () => {
  it('recovers the six-row Pascal distribution', () => {
    expect(binomialMasses(6, 0.5)).toEqual([1, 6, 15, 20, 15, 6, 1].map(x => x / 64));
    expect(choose(6, 3)).toBe(20);
  });
  it('preserves unit mass, mean and variance for large and biased boards', () => {
    for (const [n, p] of [[160, 0.01], [160, 0.5], [160, 0.99], [20, 0.8]]) {
      const masses = binomialMasses(n, p);
      expect(masses.every(x => Number.isFinite(x) && x >= 0)).toBeTrue();
      expect(masses.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 12);
      expect(masses.reduce((a, b, k) => a + k * b, 0)).toBeCloseTo(n * p, 10);
      expect(masses.reduce((a, b, k) => a + (k - n * p) ** 2 * b, 0)).toBeCloseTo(n * p * (1 - p), 10);
    }
  });
  it('handles deterministic endpoints and zero rows without NaN', () => {
    expect(binomialMasses(3, 0)).toEqual([1, 0, 0, 0]);
    expect(binomialMasses(3, 1)).toEqual([0, 0, 0, 1]);
    expect(binomialMasses(0, 0.4)).toEqual([1]);
    expect(normalBinProbability(20, 0, 0, 2)).toBeNull();
    expect(normalBinProbability(20, 1, 18, 20)).toBeNull();
  });
  it('rejects invalid binomial inputs', () => {
    expect(() => binomialMasses(3.5, 0.5)).toThrowError(RangeError);
    expect(() => binomialMasses(12, NaN)).toThrowError(RangeError);
  });
  it('produces repeatable paths with only left and right steps', () => {
    const a = galtonRandom(2026);
    const b = galtonRandom(2026);
    for (let i = 0; i < 100; i++) {
      const path = galtonPath(12, 0.7, a);
      expect(path).toEqual(galtonPath(12, 0.7, b));
      expect(path.length).toBe(13);
      expect(path.slice(1).every((k, row) => k === path[row] || k === path[row] + 1)).toBeTrue();
    }
  });
  it('routes deterministic decisions to the corresponding edge', () => {
    expect(galtonPath(3, 0, galtonRandom(1))).toEqual([0, 0, 0, 0]);
    expect(galtonPath(3, 1, galtonRandom(1))).toEqual([0, 1, 2, 3]);
  });
  it('matches reference normal CDF values', () => {
    expect(normalCdf(0)).toBe(0.5);
    expect(normalCdf(1.95996398454)).toBeCloseTo(0.975, 6);
    expect(normalCdf(-1.95996398454)).toBeCloseTo(0.025, 6);
  });
  it('uses a full-width interval for a single bin with continuity correction', () => {
    const exact = binomialMasses(60, 0.5)[30];
    expect(normalBinProbability(60, 0.5, 30, 30, false)).toBe(0);
    expect(Math.abs(normalBinProbability(60, 0.5, 30, 30, true)! - exact)).toBeLessThan(0.001);
  });
});
