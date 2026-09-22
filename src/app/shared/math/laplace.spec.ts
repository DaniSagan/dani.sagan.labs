import {
  exponentialIntegral,
  oscillatorPoles,
  oscillatorStep,
  pulseResponse,
} from './laplace';

describe('Laplace laboratory calculations', () => {
  it('matches independent midpoint quadrature for convergent, boundary and divergent integrands', () => {
    for (const [a, sigma, omega, t] of [
      [0.5, 1.5, 2, 4],
      [0.5, 0.5, 2, 4],
      [0.5, 0, 2, 4],
      [0.5, 0.5, 0, 4],
    ]) {
      const count = 20000;
      const dt = t / count;
      let re = 0;
      let im = 0;
      for (let i = 0; i < count; i++) {
        const x = (i + 0.5) * dt;
        const scale = Math.exp((a - sigma) * x) * dt;
        re += scale * Math.cos(omega * x);
        im -= scale * Math.sin(omega * x);
      }
      const actual = exponentialIntegral(a, sigma, omega, t);
      expect(actual.re).toBeCloseTo(re, 6);
      expect(actual.im).toBeCloseTo(im, 6);
    }
    expect(exponentialIntegral(1, 1, 0, 7)).toEqual({ re: 7, im: 0 });
    expect(exponentialIntegral(0, 1e-10, 0, 1).re).toBeCloseTo(1, 9);
  });
  it('satisfies the initial conditions and differential equation in all damping regimes', () => {
    const w = 2;
    const h = 0.0001;
    for (const z of [0, 0.3, 0.999, 1, 1.001, 1.8]) {
      expect(oscillatorStep(0, z, w)).toBe(0);
      expect(oscillatorStep(h, z, w) / h).toBeCloseTo(0, 3);
      for (const t of [0.2, 1, 4]) {
        const y = oscillatorStep(t, z, w);
        const before = oscillatorStep(t - h, z, w);
        const after = oscillatorStep(t + h, z, w);
        const residual =
          (after - 2 * y + before) / h ** 2 +
          (2 * z * w * (after - before)) / (2 * h) +
          w ** 2 * y;
        expect(residual).toBeCloseTo(w ** 2, 5);
      }
    }
    expect(oscillatorStep(1, 1, 2)).toBeCloseTo(1 - 3 * Math.exp(-2), 12);
    expect(oscillatorStep(Math.PI / 2, 0, 2)).toBeCloseTo(2, 12);
  });
  it('places poles at the roots of the characteristic polynomial including the double pole', () => {
    for (const z of [0, 0.3, 1, 1.8, 2]) {
      for (const p of oscillatorPoles(z, 2)) {
        expect(p.re ** 2 - p.im ** 2 + 4 * z * p.re + 4).toBeCloseTo(0, 10);
        expect(2 * p.re * p.im + 4 * z * p.im).toBeCloseTo(0, 10);
      }
    }
    expect(oscillatorPoles(1, 2)).toEqual([
      { re: -2, im: 0 },
      { re: -2, im: -0 },
    ]);
  });
  it('agrees with direct convolution and is continuous at both pulse edges', () => {
    for (const t of [0, 1, 2, 3, 5, 8]) {
      const k = 0.7;
      const a = 2;
      const b = 3;
      const end = Math.min(t, a + b);
      const dt = Math.max(0, end - a) / 10000;
      let integral = 0;
      for (let i = 0; i < 10000; i++)
        integral += Math.exp(-k * (t - a - (i + 0.5) * dt)) * dt;
      expect(pulseResponse(t, k, a, b)).toBeCloseTo(integral, 7);
    }
    expect(pulseResponse(2, 1, 2, 3)).toBe(0);
    expect(pulseResponse(5 - 1e-8, 1, 2, 3)).toBeCloseTo(
      pulseResponse(5 + 1e-8, 1, 2, 3),
      7,
    );
    expect(pulseResponse(8, 1, 4, 3)).toBeCloseTo(
      pulseResponse(6, 1, 2, 3),
      12,
    );
  });
});
