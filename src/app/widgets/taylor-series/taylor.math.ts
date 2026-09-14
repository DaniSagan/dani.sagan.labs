export type TaylorFunction = 'exp' | 'sin' | 'cos';

export function functionValue(kind: TaylorFunction, x: number): number {
  return kind === 'exp' ? Math.exp(x) : kind === 'sin' ? Math.sin(x) : Math.cos(x);
}

export function taylorCoefficients(kind: TaylorFunction, center: number, order: number): number[] {
  if (!Number.isFinite(center) || !Number.isInteger(order) || order < 0 || order > 30) {
    throw new RangeError('Centro finito y orden entero entre 0 y 30 requeridos.');
  }
  const sin = Math.sin(center), cos = Math.cos(center);
  const cycle = kind === 'sin' ? [sin, cos, -sin, -cos] : [cos, -sin, -cos, sin];
  let factorial = 1;
  return Array.from({ length: order + 1 }, (_, k) => {
    if (k > 0) { factorial *= k; }
    return (kind === 'exp' ? Math.exp(center) : cycle[k % 4]) / factorial;
  });
}

export function evaluateTaylor(coefficients: readonly number[], offset: number): number {
  return coefficients.reduceRight((value, coefficient) => value * offset + coefficient, 0);
}

export function geometricSums(x: number, order: number): number[] {
  if (!Number.isFinite(x) || !Number.isInteger(order) || order < 0 || order > 30) {
    throw new RangeError('Punto finito y orden entero entre 0 y 30 requeridos.');
  }
  let term = 1, sum = 0;
  return Array.from({ length: order + 1 }, () => {
    sum += term; term *= x; return sum;
  });
}
