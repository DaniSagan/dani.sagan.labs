import { cycloidPoint, positionAt, sampleTrack, solveCycloid, tautochroneTheta } from './brachistochrone';

describe('Brachistochrone physics', () => {
  it('solves endpoints across both descending and ascending branches', () => {
    for (const [x, y] of [[1, 6], [6, 3], [10, 0.5]]) {
      const c = solveCycloid(x, y);
      const end = cycloidPoint(c.radius, c.theta);
      expect(end.x).toBeCloseTo(x, 9);
      expect(end.y).toBeCloseTo(y, 9);
      expect(c.theta).toBeGreaterThan(0);
      expect(c.theta).toBeLessThan(2 * Math.PI);
    }
    expect(solveCycloid(10, 0.5).theta).toBeGreaterThan(Math.PI);
    expect(solveCycloid(1, 6).theta).toBeLessThan(Math.PI);
  });
  it('recovers the analytic half-cycloid and gravity scaling', () => {
    const c = solveCycloid(Math.PI, 2);
    expect(c.radius).toBeCloseTo(1, 10);
    expect(c.theta).toBeCloseTo(Math.PI, 10);
    expect(c.time).toBeCloseTo(Math.PI / Math.sqrt(9.81), 10);
    expect(solveCycloid(Math.PI, 2, 9.81 / 4).time).toBeCloseTo(2 * c.time, 10);
    expect(solveCycloid(4 * Math.PI, 8).time).toBeCloseTo(2 * c.time, 10);
  });
  it('matches constant-acceleration straight-track timing and positions', () => {
    const x = 6, y = 3, g = 9.81;
    const points = sampleTrack(u => ({ x: x * u, y: y * u }), g);
    const duration = Math.sqrt(2 * (x * x + y * y) / (g * y));
    expect(points[600].t).toBeCloseTo(duration, 10);
    expect(positionAt(points, duration / 2).x).toBeCloseTo(x / 4, 8);
    expect(positionAt(points, duration / 2).y).toBeCloseTo(y / 4, 8);
    expect(positionAt(points, 0)).toEqual(points[0]);
    expect(positionAt(points, duration * 2)).toEqual(points[600]);
    expect(solveCycloid(x, y).time).toBeLessThan(duration);
  });
  it('converges to the exact cycloid time, including its singular start', () => {
    const c = solveCycloid(9, 1);
    const points = sampleTrack(u => cycloidPoint(c.radius, c.theta * u), 9.81, 2400);
    expect(Math.abs(points[2400].t - c.time)).toBeLessThan(0.00001);
  });
  it('keeps editable parabolas slower than the optimum', () => {
    for (const [x, y] of [[1, 6], [6, 3], [10, 0.5]]) {
      for (const bend of [0, 1, 3, 8]) {
        const points = sampleTrack(u => ({ x: x * u, y: y * u + 4 * bend * u * (1 - u) }), 9.81);
        expect(points[600].t).toBeGreaterThan(solveCycloid(x, y).time);
        expect(points.every(p => Number.isFinite(p.t))).toBe(true);
      }
    }
  });
  it('preserves starting points and brings all tautochrone releases to the bottom together', () => {
    for (const start of [0.15, 0.65, 1.65, 2.5]) {
      expect(tautochroneTheta(start, 0)).toBeCloseTo(start, 10);
      expect(tautochroneTheta(start, 1)).toBeCloseTo(Math.PI, 10);
      const ratio = Math.cos(tautochroneTheta(start, 0.5) / 2) / Math.cos(start / 2);
      expect(ratio).toBeCloseTo(Math.SQRT1_2, 10);
    }
  });
  it('rejects invalid boundary data', () => {
    expect(() => solveCycloid(0, 1)).toThrowError(RangeError);
    expect(() => solveCycloid(1, -1)).toThrowError(RangeError);
    expect(() => solveCycloid(1, 1, 0)).toThrowError(RangeError);
    expect(() => solveCycloid(Infinity, 1)).toThrowError(RangeError);
  });
});
