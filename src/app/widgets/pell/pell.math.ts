import { exactConvergents } from '../continued-fractions/continued-fractions.math';

export interface PellPoint {
  x: bigint;
  y: bigint;
}
export interface SurdState {
  index: number;
  m: bigint;
  d: bigint;
  a: bigint;
}
export interface SqrtExpansion {
  D: bigint;
  a0: bigint;
  square: boolean;
  period: bigint[];
  states: SurdState[];
}

export function integerRoot(n: bigint): bigint {
  if (n < 0n) {
    throw new RangeError('La raíz entera requiere un número no negativo.');
  }
  if (n < 2n) {
    return n;
  }
  let x = 1n << BigInt(Math.ceil(n.toString(2).length / 2));
  while (true) {
    const next = (x + n / x) / 2n;
    if (next >= x) {
      return x;
    }
    x = next;
  }
}
export function sqrtExpansion(D: bigint, maxSteps = 100000): SqrtExpansion {
  if (D <= 0n) {
    throw new RangeError('D debe ser positivo.');
  }
  if (!Number.isSafeInteger(maxSteps) || maxSteps < 1) {
    throw new RangeError('Límite de pasos no válido.');
  }
  const a0 = integerRoot(D),
    states: SurdState[] = [{ index: 0, m: 0n, d: 1n, a: a0 }];
  const result: SqrtExpansion = {
    D,
    a0,
    square: a0 * a0 === D,
    period: [],
    states,
  };
  if (result.square) {
    return result;
  }
  let m = 0n,
    d = 1n,
    a = a0;
  for (let index = 1; index <= maxSteps; index++) {
    m = d * a - m;
    d = (D - m * m) / d;
    a = (a0 + m) / d;
    states.push({ index, m, d, a });
    result.period.push(a);
    if (m === a0 && d === 1n) {
      return result;
    }
  }
  throw new RangeError(
    'Se alcanzó el límite de pasos; no se ha completado el período.',
  );
}
export function pellConvergents(expansion: SqrtExpansion, count: number) {
  if (!Number.isSafeInteger(count) || count < 1 || count > 200000) {
    throw new RangeError('Número de convergentes no válido.');
  }
  if (expansion.square) {
    throw new RangeError(
      'La raíz cuadrada exacta no tiene período irracional.',
    );
  }
  const coefficients = Array.from({ length: count }, (_, n) =>
    n === 0
      ? expansion.a0
      : expansion.period[(n - 1) % expansion.period.length],
  );
  return exactConvergents(coefficients).map((row) => ({
    ...row,
    norm: row.p * row.p - expansion.D * row.q * row.q,
  }));
}
export function fundamental(
  expansion: SqrtExpansion,
  sign: 1 | -1 = 1,
): PellPoint | null {
  if (expansion.square) {
    return null;
  }
  const L = expansion.period.length;
  if (sign === -1 && L % 2 === 0) {
    return null;
  }
  const count = sign === 1 && L % 2 === 1 ? 2 * L : L;
  const row = pellConvergents(expansion, count)[count - 1];
  return { x: row.p, y: row.q };
}
export function norm(D: bigint, p: PellPoint): bigint {
  return p.x * p.x - D * p.y * p.y;
}
export function multiply(D: bigint, p: PellPoint, q: PellPoint): PellPoint {
  return { x: p.x * q.x + D * p.y * q.y, y: p.x * q.y + p.y * q.x };
}
export function pellSolutions(
  D: bigint,
  unit: PellPoint,
  count: number,
): PellPoint[] {
  if (D <= 0n || unit.x <= 1n || unit.y <= 0n || norm(D, unit) !== 1n) {
    throw new RangeError('Se requiere una solución positiva de norma 1.');
  }
  if (!Number.isSafeInteger(count) || count < 1 || count > 1000) {
    throw new RangeError('Número de soluciones no válido.');
  }
  const result: PellPoint[] = [];
  let point = { x: 1n, y: 0n };
  for (let n = 0; n < count; n++) {
    point = multiply(D, point, unit);
    result.push(point);
  }
  return result;
}
/** Demonstration only: bounded search, never used to find the fundamental solution. */
export function smallSearch(D: bigint, maxY: number): PellPoint[] {
  if (D <= 0n || !Number.isSafeInteger(maxY) || maxY < 0 || maxY > 1000) {
    throw new RangeError('Búsqueda limitada a 0 ≤ y ≤ 1000.');
  }
  const points: PellPoint[] = [];
  for (let value = 1; value <= maxY; value++) {
    const y = BigInt(value),
      x = integerRoot(1n + D * y * y);
    if (norm(D, { x, y }) === 1n) {
      points.push({ x, y });
    }
  }
  return points;
}
/** Approximate logarithm for display only; preserves the decimal exponent of huge integers. */
export function logInteger(value: bigint): number {
  if (value <= 0n) {
    throw new RangeError('El logaritmo requiere un entero positivo.');
  }
  const text = value.toString(),
    head = text.slice(0, 15);
  return Math.log10(Number(head)) + text.length - head.length;
}
export function logApproximationError(D: bigint, p: bigint, q: bigint): number {
  if (D <= 0n || p <= 0n || q <= 0n) {
    throw new RangeError('Se requieren valores positivos.');
  }
  const delta = p * p - D * q * q,
    abs = delta < 0n ? -delta : delta;
  if (abs === 0n) {
    return -Infinity;
  }
  const left = logInteger(p),
    right = logInteger(q) + logInteger(D) / 2;
  const largest = Math.max(left, right);
  const logSum =
    largest + Math.log10(10 ** (left - largest) + 10 ** (right - largest));
  return logInteger(abs) - logInteger(q) - logSum;
}
export function scientificError(D: bigint, p: bigint, q: bigint): string {
  const value = logApproximationError(D, p, q);
  if (!Number.isFinite(value)) {
    return '0';
  }
  const exponent = Math.floor(value);
  return (10 ** (value - exponent)).toFixed(3) + ' × 10^' + exponent;
}
/** Visual ratio only: conversion is bounded by 10^6 for 0 <= value <= scale. */
export function plotRatio(value: bigint, scale: bigint): number {
  if (scale <= 0n) {
    throw new RangeError('Escala no válida.');
  }
  return Number((value * 1000000n) / scale) / 1000000;
}
