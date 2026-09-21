import { cubicResidual, solveCubic } from './cubic';

describe('Cubic solver', () => {
  it('finds three distinct real roots', () => {
    const result = solveCubic(1, -6, 11, -6);
    expect(result.kind).toBe('three');
    result.roots.forEach((root, i) => {
      expect(root.re).toBeCloseTo(i + 1, 10);
      expect(root.im).toBe(0);
    });
  });
  it('handles double and translated triple roots', () => {
    expect(solveCubic(1, 0, -3, 2).roots.map((r) => r.re)).toEqual([-2, 1, 1]);
    expect(solveCubic(1, -3, 3, -1).roots.map((r) => r.re)).toEqual([1, 1, 1]);
  });
  it('handles pure cubes and complex conjugates', () => {
    for (const d of [-8, 0, 8]) {
      const result = solveCubic(1, 0, 0, d);
      result.roots.forEach((root) =>
        expect(cubicResidual(1, 0, 0, d, root)).toBeLessThan(1e-10),
      );
    }
    expect(solveCubic(1, 0, 1, 1).kind).toBe('one');
  });
  it('distinguishes both sides of the multiple-root boundary', () => {
    expect(solveCubic(1, 0, -3, 2 - 1e-8).kind).toBe('three');
    expect(solveCubic(1, 0, -3, 2 + 1e-8).kind).toBe('one');
  });
  it('satisfies the equation and Vieta across the coefficient range', () => {
    for (const a of [-3, 0.1, 1, 4])
      for (const b of [-5, 0, 6])
        for (const c of [-15, 0, 8])
          for (const d of [-4, 0, 9]) {
            const result = solveCubic(a, b, c, d);
            expect(
              result.roots.reduce((sum, root) => sum + root.re, 0),
            ).toBeCloseTo(-b / a, 8);
            result.roots.forEach((root) => {
              const magnitude = Math.hypot(root.re, root.im);
              const scale =
                Math.abs(a) * magnitude ** 3 +
                Math.abs(b) * magnitude ** 2 +
                Math.abs(c) * magnitude +
                Math.abs(d) +
                1;
              expect(cubicResidual(a, b, c, d, root) / scale).toBeLessThan(
                1e-10,
              );
            });
          }
  });
  it('rejects non-cubic and non-finite inputs', () => {
    expect(() => solveCubic(0, 1, 2, 3)).toThrow();
    expect(() => solveCubic(1, NaN, 2, 3)).toThrow();
  });
});
