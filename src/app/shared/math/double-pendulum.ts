/** Absolute angles from the downward vertical, angular velocities in radians/s. */
export type PendulumState = [number, number, number, number];
export interface PendulumParameters {
  m1: number;
  m2: number;
  l1: number;
  l2: number;
  g: number;
}
export const DEFAULT_PENDULUM: PendulumParameters = {
  m1: 1,
  m2: 1,
  l1: 1,
  l2: 1,
  g: 9.81,
};

export function pendulumDerivative(
  s: PendulumState,
  p: PendulumParameters,
): PendulumState {
  const [a, b, u, v] = s,
    delta = a - b;
  const A = (p.m1 + p.m2) * p.l1 * p.l1;
  const B = p.m2 * p.l1 * p.l2 * Math.cos(delta);
  const C = p.m2 * p.l2 * p.l2;
  const coupling = p.m2 * p.l1 * p.l2 * Math.sin(delta);
  const r1 = -coupling * v * v - (p.m1 + p.m2) * p.g * p.l1 * Math.sin(a);
  const r2 = coupling * u * u - p.m2 * p.g * p.l2 * Math.sin(b);
  const determinant = A * C - B * B;
  return [
    u,
    v,
    (C * r1 - B * r2) / determinant,
    (A * r2 - B * r1) / determinant,
  ];
}

export function pendulumStep(
  s: PendulumState,
  p: PendulumParameters,
  h: number,
): PendulumState {
  const add = (k: PendulumState, scale: number) =>
    s.map((v, i) => v + scale * k[i]) as PendulumState;
  const k1 = pendulumDerivative(s, p);
  const k2 = pendulumDerivative(add(k1, h / 2), p);
  const k3 = pendulumDerivative(add(k2, h / 2), p);
  const k4 = pendulumDerivative(add(k3, h), p);
  return s.map(
    (v, i) => v + (h * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i])) / 6,
  ) as PendulumState;
}

export function pendulumEnergy(
  s: PendulumState,
  p: PendulumParameters,
): { kinetic: number; potential: number; total: number } {
  const [a, b, u, v] = s;
  const kinetic =
    0.5 * (p.m1 + p.m2) * (p.l1 * u) ** 2 +
    0.5 * p.m2 * (p.l2 * v) ** 2 +
    p.m2 * p.l1 * p.l2 * u * v * Math.cos(a - b);
  // Zero potential energy at the lower equilibrium, avoiding negative energy bars.
  const potential =
    (p.m1 + p.m2) * p.g * p.l1 * (1 - Math.cos(a)) +
    p.m2 * p.g * p.l2 * (1 - Math.cos(b));
  return { kinetic, potential, total: kinetic + potential };
}

export function pendulumPositions(s: PendulumState, p: PendulumParameters) {
  const x1 = p.l1 * Math.sin(s[0]),
    y1 = -p.l1 * Math.cos(s[0]);
  return {
    x1,
    y1,
    x2: x1 + p.l2 * Math.sin(s[1]),
    y2: y1 - p.l2 * Math.cos(s[1]),
  };
}
export function wrapAngle(a: number): number {
  return Math.atan2(Math.sin(a), Math.cos(a));
}
export function pendulumDistance(
  a: PendulumState,
  b: PendulumState,
  p: PendulumParameters,
): number {
  const frequency = Math.sqrt(p.g / p.l1);
  return Math.hypot(
    wrapAngle(a[0] - b[0]),
    wrapAngle(a[1] - b[1]),
    (a[2] - b[2]) / frequency,
    (a[3] - b[3]) / frequency,
  );
}
export function pendulumMomentum(
  s: PendulumState,
  p: PendulumParameters,
): number {
  return (
    (p.m1 + p.m2) * p.l1 ** 2 * s[2] +
    p.m2 * p.l1 * p.l2 * Math.cos(s[0] - s[1]) * s[3]
  );
}

/** An upward crossing of theta2 = 0 mod 2π, refined within the RK4 time step. */
export function pendulumSection(
  before: PendulumState,
  after: PendulumState,
  p: PendulumParameters,
  h: number,
): PendulumState | null {
  if (after[1] <= before[1]) return null;
  const level = 2 * Math.PI * (Math.floor(before[1] / (2 * Math.PI)) + 1);
  if (level > after[1]) return null;
  let lo = 0,
    hi = h;
  for (let i = 0; i < 18; i++) {
    const mid = (lo + hi) / 2;
    if (pendulumStep(before, p, mid)[1] < level) lo = mid;
    else hi = mid;
  }
  const state = pendulumStep(before, p, (lo + hi) / 2);
  return state[3] > 0 ? state : null;
}

/** Equal masses and lengths, zero initial angular velocities, linearized dynamics. */
export function normalModeState(
  time: number,
  amplitude: number,
  mix: number,
  g = 9.81,
  length = 1,
): PendulumState {
  const low = Math.sqrt((g / length) * (2 - Math.SQRT2)),
    high = Math.sqrt((g / length) * (2 + Math.SQRT2));
  const slow = amplitude * (1 - mix),
    fast = amplitude * mix;
  const a = slow * Math.cos(low * time),
    b = fast * Math.cos(high * time);
  const u = -slow * low * Math.sin(low * time),
    v = -fast * high * Math.sin(high * time);
  return [a + b, Math.SQRT2 * (a - b), u + v, Math.SQRT2 * (u - v)];
}
