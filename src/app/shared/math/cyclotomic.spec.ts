import { cyclotomic, cyclotomicNewton, divisors, polynomialText, primitiveRoots, refineCyclotomicRoots } from './cyclotomic';

describe('Cyclotomic mathematics', () => {
  it('reconstructs x^n - 1 exactly from its cyclotomic factors for every supported index', () => {
    for (let n = 1; n <= 120; n++) {
      let product = [1n];
      for (const d of divisors(n)) {
        const factor = cyclotomic(d), next = Array<bigint>(product.length + factor.length - 1).fill(0n);
        product.forEach((a, i) => factor.forEach((b, j) => next[i + j] += a * b));
        product = next;
      }
      const expected = Array<bigint>(n + 1).fill(0n); expected[0] = -1n; expected[n] = 1n;
      expect(product).toEqual(expected);
      expect(cyclotomic(n).length - 1).toBe(primitiveRoots(n).length);
    }
  });
  it('identifies primitive roots and coefficients beyond plus or minus one', () => {
    expect(primitiveRoots(12).map(r => r.k)).toEqual([1,5,7,11]);
    expect(primitiveRoots(1)).toEqual([{ k: 0, re: 1, im: 0 }]);
    expect(polynomialText(cyclotomic(12))).toBe('x^4 − x^2 + 1');
    expect(cyclotomic(105)).toContain(-2n);
    expect(() => cyclotomic(0)).toThrow();
    expect(() => cyclotomic(121)).toThrow();
  });
  it('keeps the classical tower on the circle and doubles its degree', () => {
    let points = [{ re: -1, im: 0 }];
    for (let i = 1; i <= 8; i++) {
      points = refineCyclotomicRoots(points, false);
      expect(points.length).toBe(2 ** i);
      points.forEach(p => {
        expect(Math.hypot(p.re, p.im)).toBeCloseTo(1, 12);
        expect(Math.cos(2 ** i * Math.atan2(p.im, p.re))).toBeCloseTo(-1, 10);
      });
    }
  });
  it('implements R after F, with the right inverse transformation', () => {
    const first = refineCyclotomicRoots([{ re: -1, im: 0 }], true);
    expect(first[0].re).toBeCloseTo(1, 12); expect(first[0].im).toBeCloseTo(1, 12);
    expect(first[1].re).toBeCloseTo(1, 12); expect(first[1].im).toBeCloseTo(-1, 12);
    const parents = [{ re: 0.3, im: 0.7 }, { re: -1.2, im: 0.4 }];
    refineCyclotomicRoots(parents, true).forEach((z, i) => {
      const x = 1 - z.re, y = -z.im, norm = x * x + y * y;
      const re = x / norm, im = -y / norm;
      expect(re * re - im * im).toBeCloseTo(parents[Math.floor(i / 2)].re, 12);
      expect(2 * re * im).toBeCloseTo(parents[Math.floor(i / 2)].im, 12);
    });
  });
  it('keeps all roots finite through the maximum fractal depth', () => {
    let roots = [{ re: -1, im: 0 }];
    for (let i = 0; i < 14; i++) roots = refineCyclotomicRoots(roots, true);
    expect(roots.length).toBe(16384);
    expect(roots.every(z => Number.isFinite(z.re) && Number.isFinite(z.im))).toBe(true);
  });
  it('recognizes roots before division and separates singularities from iteration limits', () => {
    const roots = primitiveRoots(8);
    expect(cyclotomicNewton(roots, roots[0].re, roots[0].im, 30).steps).toBe(0);
    expect(cyclotomicNewton(roots, 0, 0, 30).reason).toBe('singular');
    expect(cyclotomicNewton(roots, 0.2, 0.3, 0).reason).toBe('limit');
    const linear = cyclotomicNewton(primitiveRoots(1), 0.2, 0.3, 10);
    expect(linear.root).toBe(0); expect(linear.steps).toBe(1);
  });
  it('preserves conjugation and agrees with an independent polynomial Newton step', () => {
    const roots = primitiveRoots(5), re = 0.7, im = 0.2;
    const a = cyclotomicNewton(roots, re, im, 60, true);
    const b = cyclotomicNewton(roots, re, -im, 60, true);
    expect(a.reason).toBe('root'); expect(b.reason).toBe('root'); expect(a.steps).toBe(b.steps);
    expect(roots[a.root].re).toBeCloseTo(roots[b.root].re, 12);
    expect(roots[a.root].im).toBeCloseTo(-roots[b.root].im, 12);
    let pr = 1, pi = 0, dr = 0, di = 0;
    for (let k = 3; k >= 0; k--) {
      const nd = dr * re - di * im + pr; di = dr * im + di * re + pi; dr = nd;
      const np = pr * re - pi * im + 1; pi = pr * im + pi * re; pr = np;
    }
    const norm = dr * dr + di * di;
    expect(a.points[1].re).toBeCloseTo(re - (pr * dr + pi * di) / norm, 12);
    expect(a.points[1].im).toBeCloseTo(im - (pi * dr - pr * di) / norm, 12);
  });
});
