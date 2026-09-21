import {
  bisectionSequence,
  CUBIC_ROOTS,
  cubicBasin,
  NEWTON_EXAMPLES,
  newtonIterate,
} from './newton-raphson';

describe('Newton–Raphson numerical core', () => {
  it('reproduces the square-root iteration and both real roots', () => {
    const e = NEWTON_EXAMPLES[0];
    for (const sign of [-1, 1]) {
      const r = newtonIterate(e.f, e.df, 2 * sign);
      expect(r.status).toBe('converged');
      expect(r.rows[1].x).toBe(1.5 * sign);
      expect(r.rows[r.rows.length - 1].x).toBeCloseTo(Math.SQRT2 * sign, 12);
    }
  });
  it('recovers quadratic error decay before roundoff dominates', () => {
    const e = NEWTON_EXAMPLES[0],
      r = newtonIterate(e.f, e.df, 2);
    const errors = r.rows.map((row) => row.x - Math.SQRT2);
    expect(errors[3] / errors[2] ** 2).toBeCloseTo(1 / (2 * r.rows[2].x), 8);
    expect(errors[4] / errors[3] ** 2).toBeCloseTo(1 / (2 * Math.SQRT2), 3);
  });
  it('converges for the cosine fixed-point equation', () => {
    const e = NEWTON_EXAMPLES[1],
      r = newtonIterate(e.f, e.df, 2);
    expect(r.status).toBe('converged');
    expect(r.rows[r.rows.length - 1].x).toBeCloseTo(0.7390851332151607, 12);
  });
  it('distinguishes a singular derivative from an already-found multiple root', () => {
    const e = NEWTON_EXAMPLES[0];
    expect(newtonIterate(e.f, e.df, 0).status).toBe('singular');
    const m = NEWTON_EXAMPLES[2];
    expect(newtonIterate(m.f, m.df, 1).status).toBe('converged');
  });
  it('identifies the exact 0 → 1 → 0 cycle', () => {
    const e = NEWTON_EXAMPLES[3],
      r = newtonIterate(e.f, e.df, 0);
    expect(r.status).toBe('cycle');
    expect(r.rows.map((row) => row.x)).toEqual([0, 1, 0]);
  });
  it('does not invent a real root for x² + 1', () => {
    const e = NEWTON_EXAMPLES[4],
      r = newtonIterate(e.f, e.df, 1);
    expect(r.status).toBe('singular');
    expect(r.rows.map((row) => row.x)).toEqual([1, 0]);
  });
  it('recovers the linear factor for a triple root and its multiplicity correction', () => {
    const e = NEWTON_EXAMPLES[2],
      r = newtonIterate(e.f, e.df, 2.5, 6);
    for (let n = 1; n < r.rows.length; n++)
      expect((r.rows[n].x - 1) / (r.rows[n - 1].x - 1)).toBeCloseTo(2 / 3, 12);
    const corrected = newtonIterate(e.f, e.df, 2.5, 6, 1e-12, 3);
    expect(corrected.status).toBe('converged');
    expect(corrected.rows.length).toBe(2);
    expect(corrected.rows[1].x).toBe(1);
  });
  it('does not accept a tiny initial residual as sufficient accuracy', () => {
    const e = NEWTON_EXAMPLES[2],
      r = newtonIterate(e.f, e.df, 1.00001, 1);
    expect(r.rows.length).toBe(2);
    expect(r.status).toBe('limit');
  });
  it('bounds numerical excursions and detects roundoff stagnation', () => {
    expect(
      newtonIterate(
        () => 1,
        () => 1e-20,
        1,
      ).status,
    ).toBe('escaped');
    expect(
      newtonIterate(
        () => 1,
        () => 1e30,
        1,
      ).status,
    ).toBe('stalled');
    expect(newtonIterate(Math.log, (x) => 1 / x, -1).status).toBe('escaped');
  });
  it('bisects with a rigorous midpoint error bound', () => {
    const seq = bisectionSequence((x) => x * x - 2, 0, 2, 30);
    for (let n = 0; n < seq.length; n++)
      expect(Math.abs(seq[n] - Math.SQRT2)).toBeLessThanOrEqual(
        1 / 2 ** n + 1e-15,
      );
    expect(() => bisectionSequence((x) => x * x + 1, -1, 1, 10)).toThrowError(
      RangeError,
    );
    expect(bisectionSequence((x) => x, 0, 1, 10)).toEqual([0]);
  });
  it('recognizes all three complex roots and their nearby basins', () => {
    CUBIC_ROOTS.forEach((root, i) => {
      expect(cubicBasin(root.re, root.im).root).toBe(i);
      expect(cubicBasin(root.re + 0.05, root.im + 0.02).root).toBe(i);
    });
  });
  it('uses the actual complex Newton map for each orbit step', () => {
    const r = cubicBasin(0.5, 0.5, 40, true);
    expect(r.orbit[1].re).toBeCloseTo(1 / 3, 12);
    expect(r.orbit[1].im).toBeCloseTo(-1 / 3, 12);
    expect(r.root).toBeGreaterThanOrEqual(0);
    const last = r.orbit[r.orbit.length - 1],
      target = CUBIC_ROOTS[r.root];
    expect(Math.hypot(last.re - target.re, last.im - target.im)).toBeLessThan(
      1e-7,
    );
  });
  it('separates a singularity from an unclassified finite iteration budget', () => {
    expect(cubicBasin(0, 0).reason).toBe('singular');
    expect(cubicBasin(0.5, 0.5, 1).reason).toBe('limit');
    expect(cubicBasin(0.5, 0.5, 1).root).toBe(-1);
  });
  it('respects conjugation symmetry of a real-coefficient polynomial', () => {
    const upper = cubicBasin(-0.6, 0.7),
      lower = cubicBasin(-0.6, -0.7);
    expect(upper.root).toBe(1);
    expect(lower.root).toBe(2);
    expect(upper.iterations).toBe(lower.iterations);
  });
});
