import { euclid, EuclidResult } from '../euclid/euclid.math';

export interface IntegerPoint {
  x: bigint;
  y: bigint;
}
export interface DiophantineResult {
  a: bigint;
  b: bigint;
  c: bigint;
  euclid: EuclidResult;
  kind: 'none' | 'line' | 'plane';
  scale: bigint | null;
  particular: IntegerPoint | null;
  direction: IntegerPoint | null;
}
export interface IntegerBounds {
  min: bigint | null;
  max: bigint | null;
}
export interface ParameterRange extends IntegerBounds {
  empty: boolean;
}
export interface SolutionConstraints {
  x: IntegerBounds;
  y: IntegerBounds;
}

export function solveDiophantine(
  a: bigint,
  b: bigint,
  c: bigint,
): DiophantineResult {
  const certificate = euclid(a, b),
    d = certificate.gcd;
  const base = {
    a,
    b,
    c,
    euclid: certificate,
    scale: null,
    particular: null,
    direction: null,
  };
  if (d === 0n) {
    return { ...base, kind: c === 0n ? 'plane' : 'none' };
  }
  if (c % d !== 0n) {
    return { ...base, kind: 'none' };
  }
  const scale = c / d;
  return {
    ...base,
    kind: 'line',
    scale,
    particular: { x: scale * certificate.x, y: scale * certificate.y },
    direction: { x: b / d, y: -a / d },
  };
}

/** Mathematical floor, unlike BigInt division which truncates towards zero. */
export function floorDivide(a: bigint, b: bigint): bigint {
  if (b === 0n) {
    throw new RangeError('No se puede dividir por cero.');
  }
  const q = a / b,
    r = a % b;
  return r !== 0n && r < 0n !== b < 0n ? q - 1n : q;
}
export function ceilDivide(a: bigint, b: bigint): bigint {
  return -floorDivide(-a, b);
}

export function affineRange(
  origin: bigint,
  step: bigint,
  bounds: IntegerBounds,
): ParameterRange {
  if (bounds.min !== null && bounds.max !== null && bounds.min > bounds.max) {
    throw new RangeError('El límite inferior no puede superar al superior.');
  }
  if (step === 0n) {
    return { min: null, max: null, empty: !within(origin, bounds) };
  }
  const min =
    step > 0n
      ? bounds.min === null
        ? null
        : ceilDivide(bounds.min - origin, step)
      : bounds.max === null
        ? null
        : ceilDivide(bounds.max - origin, step);
  const max =
    step > 0n
      ? bounds.max === null
        ? null
        : floorDivide(bounds.max - origin, step)
      : bounds.min === null
        ? null
        : floorDivide(bounds.min - origin, step);
  return { min, max, empty: min !== null && max !== null && min > max };
}

export function parameterRange(
  result: DiophantineResult,
  constraints: SolutionConstraints,
): ParameterRange {
  if (result.kind !== 'line') {
    throw new RangeError('Esta ecuación no tiene una familia de un parámetro.');
  }
  const x = affineRange(
    result.particular!.x,
    result.direction!.x,
    constraints.x,
  );
  const y = affineRange(
    result.particular!.y,
    result.direction!.y,
    constraints.y,
  );
  const min =
    x.min === null
      ? y.min
      : y.min === null
        ? x.min
        : x.min > y.min
          ? x.min
          : y.min;
  const max =
    x.max === null
      ? y.max
      : y.max === null
        ? x.max
        : x.max < y.max
          ? x.max
          : y.max;
  return {
    min,
    max,
    empty: x.empty || y.empty || (min !== null && max !== null && min > max),
  };
}
export function rangeCount(range: ParameterRange): bigint | null {
  return range.empty
    ? 0n
    : range.min === null || range.max === null
      ? null
      : range.max - range.min + 1n;
}
export function solutionAt(result: DiophantineResult, t: bigint): IntegerPoint {
  if (result.kind !== 'line') {
    throw new RangeError('No hay una familia de un parámetro.');
  }
  return {
    x: result.particular!.x + result.direction!.x * t,
    y: result.particular!.y + result.direction!.y * t,
  };
}
export function within(value: bigint, bounds: IntegerBounds): boolean {
  return (
    (bounds.min === null || value >= bounds.min) &&
    (bounds.max === null || value <= bounds.max)
  );
}
export function allowed(
  point: IntegerPoint,
  constraints: SolutionConstraints,
): boolean {
  return within(point.x, constraints.x) && within(point.y, constraints.y);
}
/** Sample a parameter interval without iterating through a potentially enormous set. */
export function parameterSamples(
  range: ParameterRange,
  center: bigint,
  limit = 9,
): bigint[] {
  if (!Number.isInteger(limit) || limit < 1 || limit > 101) {
    throw new RangeError('Tamaño de muestra no válido.');
  }
  if (range.empty) {
    return [];
  }
  let start = center - BigInt(Math.floor(limit / 2));
  if (range.max !== null && start + BigInt(limit - 1) > range.max) {
    start = range.max - BigInt(limit - 1);
  }
  if (range.min !== null && start < range.min) {
    start = range.min;
  }
  return Array.from({ length: limit }, (_, i) => start + BigInt(i)).filter(
    (t) => within(t, range),
  );
}
