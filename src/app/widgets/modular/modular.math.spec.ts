import { euclid } from '../euclid/euclid.math';
import {
  clockFrames,
  ClockOperation,
  isPrime,
  modularInverse,
  modularPower,
  modulo,
  powerCycle,
} from './modular.math';

describe('Exact modular arithmetic', () => {
  it('normalizes signed integers to the unique Euclidean remainder', () => {
    for (let n = 1; n <= 30; n++) {
      for (let a = -100; a <= 100; a++) {
        expect(modulo(BigInt(a), BigInt(n))).toBe(
          BigInt(a - n * Math.floor(a / n)),
        );
      }
    }
    expect(modulo(-999999999999999999n, 100n)).toBe(1n);
    expect(() => modulo(1n, 0n)).toThrowError(RangeError);
    expect(() => modulo(1n, -5n)).toThrowError(RangeError);
  });

  it('matches direct integer exponentiation for signed bases and composite moduli', () => {
    for (let n = 1n; n <= 25n; n++) {
      for (let a = -12n; a <= 12n; a++) {
        for (let k = 0n; k <= 15n; k++) {
          const direct = a ** k;
          expect(modularPower(a, k, n).value).toBe(((direct % n) + n) % n);
        }
      }
    }
  });

  it('preserves the binary exponentiation invariant and bounds the number of steps', () => {
    const a = -123456789012345678n,
      n = 999999999999999989n,
      k = 97n;
    const result = modularPower(a, k, n);
    const expected = modulo(a ** k, n);
    for (const row of result.steps) {
      expect(modulo(row.accumulator * row.base ** row.exponent, n)).toBe(
        expected,
      );
      expect(row.nextAccumulator >= 0n && row.nextAccumulator < n).toBeTrue();
    }
    expect(result.value).toBe(expected);
    expect(result.steps.length).toBe(k.toString(2).length);
    const huge = modularPower(-1n, 999999999999999999n, 100n);
    expect(huge.value).toBe(99n);
    expect(huge.steps.length).toBe(60);
  });

  it('treats exponent zero and modulus one explicitly and rejects negative exponents', () => {
    expect(modularPower(0n, 0n, 7n)).toEqual({ value: 1n, steps: [] });
    expect(modularPower(0n, 0n, 1n)).toEqual({ value: 0n, steps: [] });
    expect(modularPower(0n, 5n, 7n).value).toBe(0n);
    expect(() => modularPower(2n, -1n, 7n)).toThrowError(RangeError);
    expect(() => modularPower(2n, 0n, 0n)).toThrowError(RangeError);
  });

  it('agrees with an exhaustive inverse search, including negative inputs', () => {
    for (let n = 2n; n <= 40n; n++) {
      for (let a = -30n; a <= 30n; a++) {
        let expected: bigint | null = null;
        for (let x = 0n; x < n; x++) {
          if ((((a * x) % n) + n) % n === 1n) {
            expected = x;
            break;
          }
        }
        const result = modularInverse(a, n);
        expect(result.inverse).toBe(expected);
        expect(a * result.x + n * result.y).toBe(result.gcd);
      }
    }
    expect(
      modularInverse(999999999999999998n, 999999999999999999n).inverse,
    ).toBe(999999999999999998n);
    expect(() => modularInverse(3n, 1n)).toThrowError(RangeError);
  });

  it('finds the exact tail and minimal cycle, not just a repeated value', () => {
    expect(powerCycle(2n, 7)).toEqual({
      values: [1, 2, 4],
      start: 0,
      period: 3,
    });
    expect(powerCycle(2n, 8)).toEqual({
      values: [1, 2, 4, 0],
      start: 3,
      period: 1,
    });
    expect(powerCycle(0n, 7)).toEqual({ values: [1, 0], start: 1, period: 1 });
    expect(powerCycle(7n, 1)).toEqual({ values: [0], start: 0, period: 1 });
    for (let n = 1; n <= 120; n++) {
      for (let a = -3n; a <= 5n; a++) {
        const cycle = powerCycle(a, n);
        expect(new Set(cycle.values).size).toBe(cycle.values.length);
        expect(cycle.values.length <= n).toBeTrue();
        let current = 1n % BigInt(n);
        for (let k = 0; k <= 2 * n + 2; k++) {
          const index =
            k < cycle.start
              ? k
              : cycle.start + ((k - cycle.start) % cycle.period);
          expect(cycle.values[index]).toBe(Number(current));
          current = modulo(current * a, BigInt(n));
        }
        if (euclid(a, BigInt(n)).gcd === 1n) {
          expect(cycle.start).toBe(0);
        }
      }
    }
    for (const invalid of [0, -1, 1.5, 121, NaN]) {
      expect(() => powerCycle(2n, invalid)).toThrowError(RangeError);
    }
  });

  it('keeps clock traces consistent with ordinary arithmetic in all four modes', () => {
    const operations: ClockOperation[] = [
      'add',
      'subtract',
      'multiply',
      'power',
    ];
    for (const operation of operations) {
      for (const a of [-60, -3, 0, 10, 60]) {
        for (const b of operation === 'power'
          ? [0, 1, 2, 20]
          : [-60, -2, 0, 4, 60]) {
          for (const n of [1, 2, 6, 7, 12, 24]) {
            const frames = clockFrames(a, b, n, operation);
            const expected =
              operation === 'add'
                ? BigInt(a + b)
                : operation === 'subtract'
                  ? BigInt(a - b)
                  : operation === 'multiply'
                    ? BigInt(a * b)
                    : BigInt(a) ** BigInt(b);
            expect(frames[frames.length - 1].raw).toBe(expected);
            for (const frame of frames) {
              expect(frame.turns * BigInt(n) + BigInt(frame.residue)).toBe(
                frame.raw,
              );
              expect(frame.residue >= 0 && frame.residue < n).toBeTrue();
              expect(Number.isFinite(frame.angle)).toBeTrue();
              const visual = ((((frame.angle / 360) * n) % n) + n) % n;
              expect(
                Math.min(
                  Math.abs(visual - frame.residue),
                  n - Math.abs(visual - frame.residue),
                ),
              ).toBeLessThan(0.000001);
            }
          }
        }
      }
    }
    expect(() => clockFrames(2, -1, 7, 'power')).toThrowError(RangeError);
    expect(() => clockFrames(2, 21, 7, 'power')).toThrowError(RangeError);
    expect(() => clockFrames(2, 3, 0, 'add')).toThrowError(RangeError);
  });

  it('checks the numerical examples, divisibility rules, and false cancellation', () => {
    expect(modulo(123n * 456n + 789n, 7n)).toBe(2n);
    expect(modularPower(2n, 100n, 7n).value).toBe(2n);
    expect(modularPower(7n, 2025n, 10n).value).toBe(7n);
    expect(modularPower(7n, 222n, 100n).value).toBe(49n);
    expect(modularInverse(-3n, 11n).inverse).toBe(7n);
    expect(modularInverse(17n, 43n).inverse).toBe(38n);
    expect(123456789n % 9n).toBe(0n);
    expect(2728n % 11n).toBe(0n);
    expect([1n, 12n, 123n, 1234n, 12345n].map((a) => modulo(a, 7n))).toEqual([
      1n,
      5n,
      4n,
      2n,
      4n,
    ]);
    expect(modulo(2n - 8n, 6n)).toBe(0n);
    expect(modulo(1n - 4n, 6n)).not.toBe(0n);
    expect([2, 3, 5, 7, 11].every(isPrime)).toBeTrue();
    expect([1, 4, 6, 8, 9, 10, 12].some(isPrime)).toBeFalse();
  });
});
