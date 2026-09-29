import { exactConvergents } from '../continued-fractions/continued-fractions.math';
import {
  fundamental,
  integerRoot,
  logApproximationError,
  logInteger,
  multiply,
  norm,
  pellConvergents,
  pellSolutions,
  plotRatio,
  scientificError,
  smallSearch,
  sqrtExpansion,
} from './pell.math';

describe('Exact Pell arithmetic', () => {
  const cases: {
    D: bigint;
    period: bigint[];
    positive: [bigint, bigint];
    negative: [bigint, bigint] | null;
  }[] = [
    { D: 2n, period: [2n], positive: [3n, 2n], negative: [1n, 1n] },
    { D: 3n, period: [1n, 2n], positive: [2n, 1n], negative: null },
    { D: 5n, period: [4n], positive: [9n, 4n], negative: [2n, 1n] },
    { D: 6n, period: [2n, 4n], positive: [5n, 2n], negative: null },
    { D: 7n, period: [1n, 1n, 1n, 4n], positive: [8n, 3n], negative: null },
    {
      D: 13n,
      period: [1n, 1n, 1n, 1n, 6n],
      positive: [649n, 180n],
      negative: [18n, 5n],
    },
  ];
  for (const test of cases) {
    it('computes the exact period and both signs for D=' + test.D, () => {
      const e = sqrtExpansion(test.D),
        p = fundamental(e)!,
        negative = fundamental(e, -1);
      expect(e.period).toEqual(test.period);
      expect(p).toEqual({ x: test.positive[0], y: test.positive[1] });
      expect(norm(test.D, p)).toBe(1n);
      if (test.negative) {
        expect(negative).toEqual({ x: test.negative[0], y: test.negative[1] });
        expect(norm(test.D, negative!)).toBe(-1n);
      } else {
        expect(negative).toBeNull();
      }
      const rows = pellConvergents(e, 2 * e.period.length);
      const first = rows.find((r) => r.norm === 1n)!;
      expect(first.index).toBe(
        (e.period.length % 2 ? 2 * e.period.length : e.period.length) - 1,
      );
    });
  }
  it('takes integer roots without floating point, including enormous adjacent squares', () => {
    const k = 10n ** 100n + 123456789n;
    expect(integerRoot(k * k)).toBe(k);
    expect(integerRoot(k * k - 1n)).toBe(k - 1n);
    expect(integerRoot(k * k + 2n * k)).toBe(k);
    for (let n = 0n; n < 1000n; n++) {
      const r = integerRoot(n);
      expect(r * r <= n && (r + 1n) * (r + 1n) > n).toBeTrue();
    }
    expect(() => integerRoot(-1n)).toThrow();
  });
  it('detects squares and rejects invalid inputs and incomplete periods', () => {
    for (const D of [1n, 4n, 9n, 10000n, 10n ** 80n]) {
      const e = sqrtExpansion(D);
      expect(e.square).toBeTrue();
      expect(e.period).toEqual([]);
      expect(fundamental(e)).toBeNull();
      expect(() => pellConvergents(e, 3)).toThrow();
    }
    expect(() => sqrtExpansion(0n)).toThrow();
    expect(() => sqrtExpansion(-2n)).toThrow();
    expect(() => sqrtExpansion(13n, 4)).toThrow();
    expect(() => sqrtExpansion(2n, 0)).toThrow();
    expect(() => pellConvergents(sqrtExpansion(2n), 0)).toThrow();
  });
  it('matches every row of the D=13 example and the period certificate', () => {
    const e = sqrtExpansion(13n),
      rows = pellConvergents(e, 10);
    expect(rows.map((r) => r.p)).toEqual([
      3n,
      4n,
      7n,
      11n,
      18n,
      119n,
      137n,
      256n,
      393n,
      649n,
    ]);
    expect(rows.map((r) => r.q)).toEqual([
      1n,
      1n,
      2n,
      3n,
      5n,
      33n,
      38n,
      71n,
      109n,
      180n,
    ]);
    expect(rows.map((r) => r.norm)).toEqual([
      -4n,
      3n,
      -3n,
      4n,
      -1n,
      4n,
      -3n,
      3n,
      -4n,
      1n,
    ]);
    expect(e.states.map((s) => [s.m, s.d, s.a])).toEqual([
      [0n, 1n, 3n],
      [3n, 4n, 1n],
      [1n, 3n, 1n],
      [2n, 3n, 1n],
      [1n, 4n, 1n],
      [3n, 1n, 6n],
    ]);
  });
  it('checks the norm identity and minimal indices for all nonsquares up to 200', () => {
    for (let D = 2n; D <= 200n; D++) {
      const e = sqrtExpansion(D);
      if (e.square) continue;
      const L = e.period.length,
        rows = pellConvergents(e, 2 * L + 2);
      for (const r of rows) {
        const d = e.states[(r.index % L) + 1].d;
        expect(r.norm).toBe((r.index % 2 === 0 ? -1n : 1n) * d);
        expect(r.norm === 1n || r.norm === -1n).toBe((r.index + 1) % L === 0);
      }
      const p = fundamental(e)!;
      const searched = smallSearch(D, p.y <= 200n ? Number(p.y) : 200);
      if (p.y <= 200n) expect(searched[0]).toEqual(p);
      else expect(searched).toEqual([]);
    }
  });
  it('generates and verifies very large solutions and both recurrences', () => {
    const D = 61n,
      p = fundamental(sqrtExpansion(D))!;
    expect(p).toEqual({ x: 1766319049n, y: 226153980n });
    const points = [{ x: 1n, y: 0n }, ...pellSolutions(D, p, 40)];
    expect(points[40].x.toString().length).toBeGreaterThan(300);
    for (let i = 1; i < points.length; i++) {
      expect(norm(D, points[i])).toBe(1n);
      expect(points[i].x > points[i - 1].x).toBeTrue();
      expect(multiply(D, points[i - 1], p)).toEqual(points[i]);
      if (i > 1) {
        expect(points[i].x).toBe(2n * p.x * points[i - 1].x - points[i - 2].x);
        expect(points[i].y).toBe(2n * p.x * points[i - 1].y - points[i - 2].y);
      }
    }
  });
  it('verifies powers, negative products and the transformed applications', () => {
    expect(pellSolutions(2n, { x: 3n, y: 2n }, 5)).toEqual([
      { x: 3n, y: 2n },
      { x: 17n, y: 12n },
      { x: 99n, y: 70n },
      { x: 577n, y: 408n },
      { x: 3363n, y: 2378n },
    ]);
    expect(multiply(13n, { x: 18n, y: 5n }, { x: 18n, y: 5n })).toEqual({
      x: 649n,
      y: 180n,
    });
    for (const p of pellSolutions(8n, { x: 3n, y: 1n }, 10)) {
      const n = (p.x - 1n) / 2n;
      expect((n * (n + 1n)) / 2n).toBe(p.y * p.y);
    }
    for (const [X, Y] of [
      [7n, 5n],
      [41n, 29n],
    ]) {
      const r = (X - 1n) / 2n;
      expect(r * r + (r + 1n) * (r + 1n)).toBe(Y * Y);
    }
    expect(smallSearch(13n, 100)).toEqual([]);
    expect(smallSearch(13n, 180)).toEqual([{ x: 649n, y: 180n }]);
    expect(() => smallSearch(2n, 1001)).toThrow();
    expect(() => pellSolutions(2n, { x: 1n, y: 1n }, 5)).toThrow();
  });
  it('keeps display errors finite long after decimal subtraction would give zero', () => {
    expect(logApproximationError(2n, 3n, 2n)).toBeCloseTo(
      Math.log10(1.5 - Math.SQRT2),
      10,
    );
    const p = pellSolutions(61n, fundamental(sqrtExpansion(61n))!, 40)[39];
    expect(Number.isFinite(logApproximationError(61n, p.x, p.y))).toBeTrue();
    expect(logApproximationError(61n, p.x, p.y)).toBeLessThan(-700);
    expect(scientificError(61n, p.x, p.y)).not.toBe('0');
    expect(logInteger(10n ** 1000n)).toBe(1000);
    expect(plotRatio(10n ** 1000n, 2n * 10n ** 1000n)).toBe(0.5);
  });
  it('reuses exact convergents with the established indexing', () => {
    expect(exactConvergents([1n, 2n, 2n]).map((r) => [r.p, r.q])).toEqual([
      [1n, 1n],
      [3n, 2n],
      [7n, 5n],
    ]);
    const rows = exactConvergents([10n ** 30n, 10n ** 30n]);
    expect(rows[1].p).toBe(10n ** 60n + 1n);
    expect(() => exactConvergents([1n, 0n])).toThrow();
  });
});
