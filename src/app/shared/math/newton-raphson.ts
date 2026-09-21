export interface NewtonExample {
  label: string;
  formula: string;
  f: (x: number) => number;
  df: (x: number) => number;
  seed: number;
  xmin: number;
  xmax: number;
  ymin: number;
  ymax: number;
}
export const NEWTON_EXAMPLES: NewtonExample[] = [
  {
    label: 'Una raíz cuadrada',
    formula: 'x² − 2',
    f: (x) => x * x - 2,
    df: (x) => 2 * x,
    seed: 2.8,
    xmin: -3.5,
    xmax: 3.5,
    ymin: -3,
    ymax: 10,
  },
  {
    label: 'Un punto fijo del coseno',
    formula: 'cos x − x',
    f: (x) => Math.cos(x) - x,
    df: (x) => -Math.sin(x) - 1,
    seed: 2,
    xmin: -3,
    xmax: 3,
    ymin: -4,
    ymax: 4,
  },
  {
    label: 'Una raíz triple',
    formula: '(x − 1)³',
    f: (x) => (x - 1) ** 3,
    df: (x) => 3 * (x - 1) ** 2,
    seed: 2.5,
    xmin: -1,
    xmax: 3,
    ymin: -4,
    ymax: 5,
  },
  {
    label: 'Un ciclo de período dos',
    formula: 'x³ − 2x + 2',
    f: (x) => x ** 3 - 2 * x + 2,
    df: (x) => 3 * x * x - 2,
    seed: 0,
    xmin: -3,
    xmax: 3,
    ymin: -6,
    ymax: 6,
  },
  {
    label: 'Sin raíces reales',
    formula: 'x² + 1',
    f: (x) => x * x + 1,
    df: (x) => 2 * x,
    seed: 1,
    xmin: -3,
    xmax: 3,
    ymin: -2,
    ymax: 10,
  },
];
export interface NewtonRow {
  x: number;
  fx: number;
  derivative: number;
}
export type NewtonStatus =
  | 'converged'
  | 'singular'
  | 'cycle'
  | 'escaped'
  | 'stalled'
  | 'limit';
export interface NewtonResult {
  rows: NewtonRow[];
  status: NewtonStatus;
}
export const NEWTON_STATUS: Record<NewtonStatus, string> = {
  converged: 'Criterio numérico satisfecho',
  singular: 'Derivada nula: no hay paso de Newton',
  cycle: 'Ciclo detectado: se repite una aproximación',
  escaped: 'Fuera del límite numérico del laboratorio',
  stalled: 'Estancamiento por redondeo',
  limit: 'Límite de iteraciones alcanzado',
};

export function newtonIterate(
  f: (x: number) => number,
  df: (x: number) => number,
  seed: number,
  max = 30,
  tolerance = 1e-12,
  multiplicity = 1,
): NewtonResult {
  const rows: NewtonRow[] = [];
  let x = seed;
  for (let n = 0; n <= max; n++) {
    const fx = f(x),
      derivative = df(x);
    if (![x, fx, derivative].every(Number.isFinite) || Math.abs(x) > 1e8)
      return { rows, status: 'escaped' };
    rows.push({ x, fx, derivative });
    if (
      fx === 0 ||
      (n > 0 &&
        Math.abs(fx) <= tolerance &&
        Math.abs(x - rows[n - 1].x) <= tolerance * (1 + Math.abs(x)))
    )
      return { rows, status: 'converged' };
    if (derivative === 0) return { rows, status: 'singular' };
    if (n === max) return { rows, status: 'limit' };
    const next = x - (multiplicity * fx) / derivative;
    if (next === x)
      return {
        rows,
        status: Math.abs(fx) <= tolerance ? 'converged' : 'stalled',
      };
    if (rows.slice(0, -1).some((row) => row.x === next)) {
      rows.push({ x: next, fx: f(next), derivative: df(next) });
      return { rows, status: 'cycle' };
    }
    x = next;
  }
  return { rows, status: 'limit' };
}

export function bisectionSequence(
  f: (x: number) => number,
  left: number,
  right: number,
  count: number,
): number[] {
  let fl = f(left),
    fr = f(right);
  if (![fl, fr].every(Number.isFinite) || fl * fr > 0)
    throw new RangeError('A finite sign-changing bracket is required');
  if (fl === 0) return [left];
  if (fr === 0) return [right];
  const result: number[] = [];
  for (let i = 0; i < count; i++) {
    const mid = (left + right) / 2,
      fm = f(mid);
    result.push(mid);
    if (fm === 0 || mid === left || mid === right) break;
    if (fm > 0 === fl > 0) {
      left = mid;
      fl = fm;
    } else right = mid;
  }
  return result;
}

export interface ComplexPoint {
  re: number;
  im: number;
}
export const CUBIC_ROOTS: ComplexPoint[] = [
  { re: 1, im: 0 },
  { re: -0.5, im: Math.sqrt(3) / 2 },
  { re: -0.5, im: -Math.sqrt(3) / 2 },
];
export interface BasinResult {
  root: number;
  iterations: number;
  reason: 'root' | 'singular' | 'limit';
  orbit: ComplexPoint[];
}
/** Newton map for z³ − 1: N(z) = (2z + 1/z²)/3. */
export function cubicBasin(
  re: number,
  im: number,
  max = 40,
  keepOrbit = false,
): BasinResult {
  const orbit: ComplexPoint[] = [];
  for (let n = 0; n <= max; n++) {
    if (keepOrbit) orbit.push({ re, im });
    const root = CUBIC_ROOTS.findIndex(
      (r) => Math.hypot(re - r.re, im - r.im) < 1e-7,
    );
    if (root >= 0) return { root, iterations: n, reason: 'root', orbit };
    const norm = re * re + im * im;
    if (norm === 0 || !Number.isFinite(norm))
      return { root: -1, iterations: n, reason: 'singular', orbit };
    if (n === max) break;
    const realInverse = (re * re - im * im) / (norm * norm);
    const imagInverse = (-2 * re * im) / (norm * norm);
    re = (2 * re + realInverse) / 3;
    im = (2 * im + imagInverse) / 3;
  }
  return { root: -1, iterations: max, reason: 'limit', orbit };
}
