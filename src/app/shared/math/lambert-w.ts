export const LAMBERT_BRANCH_POINT = -1 / Math.E;
/** Real branches, bracketed bisection; logarithmic evaluation avoids exponential overflow. */
export function lambertW(z: number, branch: 0 | -1 = 0): number {
  if (!Number.isFinite(z)) throw new Error('Introduce un número real finito.');
  if (branch !== 0 && branch !== -1) throw new Error('Elige la rama 0 o −1.');
  if (z < LAMBERT_BRANCH_POINT || (branch === -1 && z >= 0)) throw new Error(branch === -1
    ? 'W₋₁ solo tiene valores reales finitos en [−1/e, 0).'
    : 'W₀ no tiene valores reales para z < −1/e.');
  if (z === LAMBERT_BRANCH_POINT) return -1;
  if (z === 0) return 0;
  if (branch === 0 && Math.abs(z) < 1e-8) return z * (1 - z + 1.5 * z * z);
  let left: number, right: number;
  if (branch === -1) {
    right = -1; left = Math.min(-2, 2 * Math.log(-z));
  } else { left = z < 0 ? -1 : 0; right = z < 0 ? 0 : Math.max(1, Math.log1p(z)); }
  const target = Math.log(Math.abs(z));
  for (let i = 0; i < 200; i++) {
    const mid = left + (right - left) / 2;
    if (mid === left || mid === right) return mid;
    if (z < 0 && branch === 0) {
      if (mid * Math.exp(mid) < z) left = mid; else right = mid;
    } else {
      if (mid + Math.log(Math.abs(mid)) < target) left = mid; else right = mid;
    }
  }
  return left + (right - left) / 2;
}

/** All real solutions of x exp(-x) = c. */
export function decayRoots(c: number): number[] {
  if (!Number.isFinite(c)) throw new Error('Introduce un valor finito.');
  if (c > 1 / Math.E) return [];
  if (c <= 0) return [-lambertW(-c)];
  if (c === 1 / Math.E) return [1];
  return [-lambertW(-c), -lambertW(-c, -1)];
}
