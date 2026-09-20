import { FEIGENBAUM_DELTA, lyapunov, orbit, superstableLevels } from './feigenbaum';

describe('Feigenbaum numerical laboratory', () => {
  for (const kind of ['logistic', 'sine'] as const) {
    const rows = superstableLevels(kind);
    it(`${kind}: finds exact-period cycles, not inherited roots`, () => {
      expect(rows.length).toBe(9);
      for (const row of rows.slice(1)) {
        const values = orbit(kind, row.parameter, 0.5, row.period);
        expect(Math.abs(values[row.period] - 0.5)).toBeLessThan(1e-10);
        expect(Math.abs(values[row.period / 2] - 0.5)).toBeGreaterThan(1e-5);
        expect(row.parameter).toBeGreaterThan(rows[row.n - 1].parameter);
      }
    });
    it(`${kind}: recovers both universal scaling constants`, () => {
      // At eight levels the sine family's delta still differs by about 5e-5.
      expect(Math.abs(rows[8].delta! - FEIGENBAUM_DELTA)).toBeLessThan(0.0001);
      expect(Math.abs(rows[8].delta! - FEIGENBAUM_DELTA)).toBeLessThan(Math.abs(rows[6].delta! - FEIGENBAUM_DELTA));
      expect(Math.abs(rows[8].alpha! + 2.502907875)).toBeLessThan(0.0001);
      expect(Math.abs(rows[8].alpha! + 2.502907875)).toBeLessThan(Math.abs(rows[6].alpha! + 2.502907875));
    });
  }
  it('recovers the first analytic logistic superstable parameters', () => {
    const rows = superstableLevels('logistic');
    expect(rows[0].parameter).toBe(2);
    expect(rows[1].parameter).toBeCloseTo(1 + Math.sqrt(5), 12);
    expect(rows[2].parameter).toBeCloseTo(3.4985616993277, 11);
  });
  it('distinguishes contraction, chaos and a periodic window', () => {
    expect(lyapunov('logistic', 2.8)).toBeCloseTo(Math.log(0.8), 8);
    expect(lyapunov('logistic', 3.9)).toBeGreaterThan(0.4);
    expect(lyapunov('logistic', 3.83)).toBeLessThan(0);
  });
  it('matches the known Lyapunov exponent at r = 4', () => {
    expect(Math.abs(lyapunov('logistic', 4, 0.413, 20000) - Math.log(2))).toBeLessThan(0.002);
  });
});
