import {
  DEFAULT_PENDULUM,
  PendulumState,
  normalModeState,
  pendulumDerivative,
  pendulumDistance,
  pendulumEnergy,
  pendulumMomentum,
  pendulumPositions,
  pendulumSection,
  pendulumStep,
} from './double-pendulum';

const evolve = (
  state: PendulumState,
  h: number,
  seconds: number,
): PendulumState => {
  let result: PendulumState = [...state];
  for (let i = 0; i < Math.round(seconds / h); i++)
    result = pendulumStep(result, DEFAULT_PENDULUM, h);
  return result;
};

describe('Double pendulum mechanics', () => {
  it('leaves the lower equilibrium at rest and preserves both rod lengths', () => {
    pendulumDerivative([0, 0, 0, 0], DEFAULT_PENDULUM).forEach((value) =>
      expect(Math.abs(value)).toBe(0),
    );
    expect(pendulumEnergy([0, 0, 0, 0], DEFAULT_PENDULUM).total).toBe(0);
    const p = { ...DEFAULT_PENDULUM, l1: 1.7, l2: 0.6 },
      position = pendulumPositions([2, -1, 3, 4], p);
    expect(Math.hypot(position.x1, position.y1)).toBeCloseTo(p.l1, 12);
    expect(
      Math.hypot(position.x2 - position.x1, position.y2 - position.y1),
    ).toBeCloseTo(p.l2, 12);
  });
  it('agrees with the independent Cartesian kinetic energy', () => {
    const p = { ...DEFAULT_PENDULUM, m1: 1.3, m2: 0.7, l1: 0.8, l2: 1.6 };
    const s: PendulumState = [1.1, -0.8, 2, -3];
    const vx1 = p.l1 * s[2] * Math.cos(s[0]),
      vy1 = p.l1 * s[2] * Math.sin(s[0]);
    const vx2 = vx1 + p.l2 * s[3] * Math.cos(s[1]),
      vy2 = vy1 + p.l2 * s[3] * Math.sin(s[1]);
    expect(pendulumEnergy(s, p).kinetic).toBeCloseTo(
      (p.m1 * (vx1 * vx1 + vy1 * vy1) + p.m2 * (vx2 * vx2 + vy2 * vy2)) / 2,
      12,
    );
  });
  it('has zero instantaneous energy derivative at nontrivial states', () => {
    const p = { ...DEFAULT_PENDULUM, m1: 0.5, m2: 2.7, l1: 1.8, l2: 0.6 };
    for (const s of [
      [1.2, -0.8, 2, -3],
      [-2, 2.4, -4, 1],
      [0.2, 0.1, -1, 0.3],
    ] as PendulumState[]) {
      const derivative = pendulumDerivative(s, p),
        h = 1e-6;
      const before = s.map((v, i) => v - h * derivative[i]) as PendulumState;
      const after = s.map((v, i) => v + h * derivative[i]) as PendulumState;
      expect(
        Math.abs(
          (pendulumEnergy(after, p).total - pendulumEnergy(before, p).total) /
            (2 * h),
        ),
      ).toBeLessThan(1e-6);
    }
  });
  it('conserves energy to a small tolerance over a ten second high-amplitude trajectory', () => {
    let s: PendulumState = [2.1, -0.2, 0, 0];
    const initial = pendulumEnergy(s, DEFAULT_PENDULUM).total;
    let worst = 0;
    for (let i = 0; i < 2400; i++) {
      s = pendulumStep(s, DEFAULT_PENDULUM, 1 / 240);
      worst = Math.max(
        worst,
        Math.abs(pendulumEnergy(s, DEFAULT_PENDULUM).total - initial),
      );
    }
    expect(worst / (3 * 9.81)).toBeLessThan(1e-5);
  });
  it('converges at fourth order when the step is halved over a short interval', () => {
    let coarse: PendulumState = [1.2, -0.3, 0.4, -0.2],
      fine: PendulumState = [...coarse],
      reference: PendulumState = [...coarse];
    let coarseError = 0,
      fineError = 0;
    // RMS along the trajectory avoids accidental cancellation at one endpoint.
    for (let i = 0; i < 240; i++) {
      coarse = pendulumStep(coarse, DEFAULT_PENDULUM, 1 / 120);
      for (let j = 0; j < 2; j++)
        fine = pendulumStep(fine, DEFAULT_PENDULUM, 1 / 240);
      for (let j = 0; j < 32; j++)
        reference = pendulumStep(reference, DEFAULT_PENDULUM, 1 / 3840);
      coarseError += pendulumDistance(coarse, reference, DEFAULT_PENDULUM) ** 2;
      fineError += pendulumDistance(fine, reference, DEFAULT_PENDULUM) ** 2;
    }
    expect(Math.sqrt(coarseError / fineError)).toBeGreaterThan(12);
    expect(Math.sqrt(coarseError / fineError)).toBeLessThan(20);
  });
  it('retraces motion after reversing the velocities', () => {
    const initial: PendulumState = [0.2, -0.1, 0.3, 0.1];
    const forward = evolve(initial, 1 / 480, 2);
    const reversed = evolve(
      [forward[0], forward[1], -forward[2], -forward[3]],
      1 / 480,
      2,
    );
    expect(
      pendulumDistance(
        reversed,
        [initial[0], initial[1], -initial[2], -initial[3]],
        DEFAULT_PENDULUM,
      ),
    ).toBeLessThan(1e-8);
  });
  it('treats angles separated by full turns as the same state', () => {
    expect(
      pendulumDistance(
        [0, 0, 1, 2],
        [2 * Math.PI, -4 * Math.PI, 1, 2],
        DEFAULT_PENDULUM,
      ),
    ).toBeLessThan(1e-12);
  });
  it('matches the linear modes at small amplitude and the momentum definition', () => {
    const initial = normalModeState(0, 0.005, 0.4),
      evolved = evolve(initial, 1 / 480, 5);
    expect(
      pendulumDistance(
        evolved,
        normalModeState(5, 0.005, 0.4),
        DEFAULT_PENDULUM,
      ),
    ).toBeLessThan(1e-5);
    const s: PendulumState = [0.7, -0.3, 1, 2],
      h = 1e-6;
    const plus: PendulumState = [s[0], s[1], s[2] + h, s[3]],
      minus: PendulumState = [s[0], s[1], s[2] - h, s[3]];
    expect(pendulumMomentum(s, DEFAULT_PENDULUM)).toBeCloseTo(
      (pendulumEnergy(plus, DEFAULT_PENDULUM).kinetic -
        pendulumEnergy(minus, DEFAULT_PENDULUM).kinetic) /
        (2 * h),
      7,
    );
  });
  it('refines upward section crossings and ignores downward ones', () => {
    const s: PendulumState = [0.1, -0.01, 0.2, 1],
      h = 0.02;
    const result = pendulumSection(
      s,
      pendulumStep(s, DEFAULT_PENDULUM, h),
      DEFAULT_PENDULUM,
      h,
    );
    expect(result).not.toBeNull();
    expect(Math.abs(result![1])).toBeLessThan(1e-7);
    expect(result![3]).toBeGreaterThan(0);
    expect(
      pendulumSection([0, 0.01, 0, -1], [0, -0.01, 0, -1], DEFAULT_PENDULUM, h),
    ).toBeNull();
  });
});
