import {
  ROSSLER_DEFAULTS,
  RosslerState,
  rosslerDerivative,
  rosslerEquilibria,
  rosslerOrbit,
  rosslerPeaks,
  rosslerSection,
  rosslerSeparation,
  rosslerStep,
} from './rossler';

describe('Rössler numerical model', () => {
  it('reproduces the analytic circular solution when a=b=z=0 with fourth-order convergence', () => {
    const integrate = (h: number) => {
      let state: RosslerState = [1, 0, 0];
      for (let i = 0; i < Math.round(2 / h); i++)
        state = rosslerStep(state, { a: 0, b: 0, c: 5.7 }, h);
      return Math.hypot(
        state[0] - Math.cos(2),
        state[1] - Math.sin(2),
        state[2],
      );
    };
    const coarse = integrate(0.1),
      fine = integrate(0.05);
    expect(coarse / fine).toBeGreaterThan(15);
    expect(coarse / fine).toBeLessThan(17);
    expect(fine).toBeLessThan(2e-7);
  });
  it('annuls the field at both analytic equilibria', () => {
    for (const c of [2, 4, 5.7, 6]) {
      const p = { ...ROSSLER_DEFAULTS, c };
      const equilibria = rosslerEquilibria(p);
      expect(equilibria.length).toBe(2);
      equilibria.forEach((s) =>
        expect(Math.hypot(...rosslerDerivative(s, p))).toBeLessThan(1e-11),
      );
    }
  });
  it('interpolates only positive-direction crossings and finds a parabolic peak', () => {
    expect(
      rosslerSection([
        [-1, -3, 1],
        [1, -1, 3],
        [-1, -3, 1],
      ]),
    ).toEqual([{ y: -2, z: 2 }]);
    expect(
      rosslerPeaks([
        [0, 0, 2.4375],
        [0, 0, 3.9375],
        [0, 0, 3.4375],
      ])[0],
    ).toBeCloseTo(4, 12);
    expect(
      rosslerPeaks([
        [0, 0, 1],
        [0, 0, 2],
        [0, 0, 3],
      ]),
    ).toEqual([]);
  });
  it('keeps the supported presets bounded and resolves repeated returns', () => {
    for (const c of [2, 4, 5.7, 6]) {
      const points = rosslerOrbit({ ...ROSSLER_DEFAULTS, c });
      expect(points.length).toBe(15001);
      expect(
        points.every((p) =>
          p.every((v) => Number.isFinite(v) && Math.abs(v) < 50),
        ),
      ).toBeTrue();
      expect(rosslerPeaks(points).length).toBeGreaterThan(30);
      expect(rosslerSection(points).length).toBeGreaterThan(30);
    }
  });
  it('resolves nearby trajectories without injecting noise', () => {
    const zero = rosslerSeparation(ROSSLER_DEFAULTS, 0, 2);
    expect(zero.every((p) => p.distance === 0)).toBeTrue();
    const nearby = rosslerSeparation(ROSSLER_DEFAULTS, 1e-6, 2);
    expect(nearby[0].distance).toBeCloseTo(1e-6, 12);
    expect(nearby.every((p) => Number.isFinite(p.distance))).toBeTrue();
  });
  it('rejects a divergent trajectory rather than returning invalid plotting coordinates', () => {
    expect(() => rosslerStep([1e9, 1e9, 1e9], ROSSLER_DEFAULTS)).toThrowError();
  });
});
