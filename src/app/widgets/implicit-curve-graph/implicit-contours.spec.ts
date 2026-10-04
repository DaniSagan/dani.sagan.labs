import { axisTicks, niceStep, traceContours } from './implicit-contours';

describe('Implicit contour numerics', () => {
  it('builds readable ticks for negative ranges, decimals and zero', () => {
    expect(niceStep(20)).toBe(2.5);
    expect(axisTicks(-1, 1, 0.5)).toEqual([-1, -0.5, 0, 0.5, 1]);
    expect(axisTicks(1, 3, 0.5)).toEqual([1, 1.5, 2, 2.5, 3]);
    expect(axisTicks(-10, 10, 1e-10)).toEqual([]);
  });
  it('interpolates a circle to subcell accuracy', () => {
    const segments = traceContours((x, y) => x*x+y*y-1, [-2,2,-2,2], 60,60);
    expect(segments.length).toBeGreaterThan(100);
    expect(segments.every(segment => segment.every(p => Math.abs(p.x*p.x+p.y*p.y-1) < 0.001))).toBeTrue();
  });
  it('does not depend on the magnitude of the expression', () => {
    const basic = traceContours((x,y) => x*x+y*y-1, [-2,2,-2,2], 40,40);
    const scaled = traceContours((x,y) => 1e100*(x*x+y*y-1), [-2,2,-2,2], 40,40);
    expect(scaled.length).toBe(basic.length);
    expect(scaled.every(segment => segment.every(p => Math.abs(p.x*p.x+p.y*p.y-1) < 0.001))).toBeTrue();
  });
  it('rejects poles that change sign without reaching zero', () => {
    expect(traceContours(x => 1/(x-0.013), [-1,1,-1,1], 40,40).length).toBe(0);
  });
  it('skips nonfinite domains and constant fields', () => {
    expect(traceContours(() => NaN, [-1,1,-1,1], 20,20)).toEqual([]);
    expect(traceContours(() => 0, [-1,1,-1,1], 20,20)).toEqual([]);
    expect(traceContours(() => 4, [-1,1,-1,1], 20,20)).toEqual([]);
  });
  it('keeps a curve at the boundary of a restricted domain', () => {
    const segments = traceContours((x,y) => Math.sqrt(x)-y, [-1,1,-1,1], 40,40);
    expect(segments.length).toBeGreaterThan(10);
    expect(segments.every(s => s.every(p => p.x >= 0))).toBeTrue();
  });
  it('retains zeros aligned with lattice edges, including even multiplicity', () => {
    const segments = traceContours(x => x*x, [-1,1,-1,1], 20,20);
    expect(segments.length).toBeGreaterThan(0);
    expect(segments.every(s => s.every(p => Math.abs(p.x) < 1e-12))).toBeTrue();
  });
  it('preserves both branches at an exact saddle', () => {
    const segments = traceContours((x,y) => x*y, [-1,1,-1,1], 3,3);
    expect(segments.some(s => s.some(p => Math.abs(p.x)<1e-10 && Math.abs(p.y)<1e-10))).toBeTrue();
  });
});
