import { euclid } from '../euclid/euclid.math';

/** Canonical remainder, including negative integers. */
export function modulo(a: bigint, n: bigint): bigint {
  if (n <= 0n) {
    throw new RangeError('El módulo debe ser un entero positivo.');
  }
  return ((a % n) + n) % n;
}

export interface PowerStep {
  exponent: bigint;
  base: bigint;
  accumulator: bigint;
  odd: boolean;
  nextAccumulator: bigint;
}

export function modularPower(
  a: bigint,
  exponent: bigint,
  n: bigint,
): { value: bigint; steps: PowerStep[] } {
  if (exponent < 0n) {
    throw new RangeError('El exponente debe ser no negativo.');
  }
  let base = modulo(a, n),
    accumulator = modulo(1n, n),
    e = exponent;
  const steps: PowerStep[] = [];
  while (e > 0n) {
    const odd = e % 2n === 1n;
    const nextAccumulator = odd ? modulo(accumulator * base, n) : accumulator;
    steps.push({ exponent: e, base, accumulator, odd, nextAccumulator });
    accumulator = nextAccumulator;
    base = modulo(base * base, n);
    e /= 2n;
  }
  return { value: accumulator, steps };
}

export function modularInverse(a: bigint, n: bigint) {
  if (n < 2n) {
    throw new RangeError(
      'Para explorar inversos, elige un módulo mayor o igual que 2.',
    );
  }
  const result = euclid(a, n);
  return { ...result, inverse: result.gcd === 1n ? modulo(result.x, n) : null };
}

export function powerCycle(
  a: bigint,
  n: number,
): { values: number[]; start: number; period: number } {
  if (!Number.isInteger(n) || n < 1 || n > 120) {
    throw new RangeError('El módulo visual debe estar entre 1 y 120.');
  }
  const seen = new Map<number, number>(),
    values: number[] = [];
  let value = Number(modulo(1n, BigInt(n)));
  const base = Number(modulo(a, BigInt(n)));
  while (!seen.has(value)) {
    seen.set(value, values.length);
    values.push(value);
    value = (value * base) % n;
  }
  const start = seen.get(value)!;
  return { values, start, period: values.length - start };
}

export type ClockOperation = 'add' | 'subtract' | 'multiply' | 'power';
export interface ClockFrame {
  raw: bigint;
  residue: number;
  turns: bigint;
  angle: number;
}

/** Bounded teaching trace; exact values are separate from the animated angle. */
export function clockFrames(
  a: number,
  b: number,
  n: number,
  operation: ClockOperation,
): ClockFrame[] {
  if (
    !Number.isInteger(n) ||
    n < 1 ||
    n > 24 ||
    !Number.isInteger(a) ||
    Math.abs(a) > 60 ||
    !Number.isInteger(b) ||
    (operation === 'power' ? b < 0 || b > 20 : Math.abs(b) > 60)
  ) {
    throw new RangeError(
      'Revisa los límites del reloj: n entre 1 y 24; a y b entre −60 y 60; exponentes entre 0 y 20.',
    );
  }
  const modulus = BigInt(n);
  let raw =
    operation === 'multiply' ? 0n : operation === 'power' ? 1n : BigInt(a);
  let previousResidue = Number(modulo(raw, modulus));
  let angle = (previousResidue * 360) / n;
  const frame = (): ClockFrame => {
    const residue = Number(modulo(raw, modulus));
    return { raw, residue, turns: (raw - BigInt(residue)) / modulus, angle };
  };
  const frames = [frame()];
  for (let i = 0; i < Math.abs(b); i++) {
    const jump =
      (operation === 'subtract' ? -1 : operation === 'multiply' ? a : 1) *
      Math.sign(b);
    raw = operation === 'power' ? raw * BigInt(a) : raw + BigInt(jump);
    const residue = Number(modulo(raw, modulus));
    // Powers show the forward arc between residues, not every turn of a huge integer.
    angle +=
      operation === 'power'
        ? (((residue - previousResidue + n) % n) * 360) / n
        : (jump * 360) / n;
    previousResidue = residue;
    frames.push(frame());
  }
  return frames;
}

export function isPrime(n: number): boolean {
  if (!Number.isInteger(n) || n < 2) {
    return false;
  }
  for (let d = 2; d * d <= n; d++) {
    if (n % d === 0) {
      return false;
    }
  }
  return true;
}
