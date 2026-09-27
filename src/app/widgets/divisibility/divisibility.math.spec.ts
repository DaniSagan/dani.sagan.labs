import { absolute } from '../euclid/euclid.math';
import { modulo } from '../modular/modular.math';
import {
  baseRepresentation,
  CRITERION_DIVISORS,
  decimalBlocks,
  discoverPowers,
  divisibilityTrace,
  parseDecimal,
} from './divisibility.math';

describe('Divisibility criteria mathematics', () => {
  it('accepts exact signed decimal inputs and rejects invalid or excessive input', () => {
    expect(parseDecimal(' +00042 ')).toBe(42n);
    expect(parseDecimal('-0')).toBe(0n);
    expect(parseDecimal('9'.repeat(40))).toBe(10n ** 40n - 1n);
    for (const text of [
      '',
      ' ',
      '-',
      '1.5',
      '1e6',
      '0xff',
      '1 234',
      'NaN',
      '9'.repeat(41),
    ]) {
      expect(() => parseDecimal(text)).toThrowError(RangeError);
    }
  });

  it('groups from the right and keeps internal zero positions', () => {
    expect(decimalBlocks(12003n, 3).map((term) => term.text)).toEqual([
      '12',
      '003',
    ]);
    expect(decimalBlocks(918082n, 1, true).map((term) => term.weight)).toEqual([
      -1n,
      1n,
      -1n,
      1n,
      -1n,
      1n,
    ]);
    expect(decimalBlocks(0n, 3)).toEqual([
      { text: '0', value: 0n, position: 0, weight: 1n },
    ]);
    expect(() => decimalBlocks(12n, 0)).toThrowError(RangeError);
  });

  it('checks both directions of every trace for all signed integers from -1000 to 1000', () => {
    for (const m of CRITERION_DIVISORS) {
      for (let number = -1000; number <= 1000; number++) {
        const input = BigInt(number),
          trace = divisibilityTrace(input, m);
        expect(trace.divisible).toBe(input % BigInt(m) === 0n);
        for (const step of trace.steps) {
          const modulus = BigInt(step.modulus);
          expect(step.input % modulus === 0n).toBe(
            step.output % modulus === 0n,
          );
          if (step.relation === 'congruence') {
            expect((step.input - step.output) % modulus).toBe(0n);
          }
        }
      }
    }
  });

  it('verifies large inputs and proves iteration reduces the absolute value above the stopping threshold', () => {
    const samples = [
      10n ** 40n - 1n,
      -(10n ** 39n + 104n),
      1000000000000000000000000000000000000001n,
    ];
    for (const input of samples) {
      for (const m of CRITERION_DIVISORS) {
        const trace = divisibilityTrace(input, m);
        expect(trace.divisible).toBe(input % BigInt(m) === 0n);
        for (const step of trace.steps) {
          expect(step.input % BigInt(step.modulus) === 0n).toBe(
            step.output % BigInt(step.modulus) === 0n,
          );
          if (
            step.title.startsWith('Restar el doble') ||
            step.title.startsWith('Sumar el cuádruple')
          ) {
            expect(absolute(step.output) < absolute(step.input)).toBeTrue();
          }
        }
        expect(trace.steps.length).toBeLessThan(85);
        if (m === 7 || m === 13) {
          expect(
            absolute(trace.steps[trace.steps.length - 1].output) < 100n,
          ).toBeTrue();
        }
      }
    }
  });

  it('distinguishes recursive divisibility from equality of residues', () => {
    const step = divisibilityTrace(204n, 7).steps[1];
    expect(step.output).toBe(12n);
    expect(step.relation).toBe('divisibility');
    expect(modulo(step.input, 7n)).toBe(1n);
    expect(modulo(step.output, 7n)).toBe(5n);
    expect(divisibilityTrace(1001n, 13).steps.map((row) => row.output)).toEqual(
      [1001n, 104n, 26n, 26n],
    );
    expect(divisibilityTrace(918082n, 11).steps[1].output).toBe(-22n);
    expect(divisibilityTrace(918082n, 11).divisible).toBeTrue();
  });

  it('requires every coprime factor when combining criteria', () => {
    expect(divisibilityTrace(15n, 6).checks).toEqual([
      { divisor: 2, divisible: false },
      { divisor: 3, divisible: true },
    ]);
    expect(divisibilityTrace(15n, 6).divisible).toBeFalse();
    expect(divisibilityTrace(18n, 12).divisible).toBeFalse();
    expect(divisibilityTrace(12n, 24).divisible).toBeFalse();
    expect(divisibilityTrace(12312n, 24).divisible).toBeTrue();
  });

  it('finds the first positive exponent, includes the repeated endpoint and detects absent patterns', () => {
    expect(discoverPowers(10, 4).patterns).toEqual([
      { kind: 'zero', exponent: 2 },
    ]);
    expect(discoverPowers(10, 9).patterns).toEqual([
      { kind: 'one', exponent: 1 },
    ]);
    expect(discoverPowers(10, 7).patterns).toEqual([
      { kind: 'one', exponent: 6 },
      { kind: 'minus-one', exponent: 3 },
    ]);
    expect(discoverPowers(10, 13).patterns).toEqual([
      { kind: 'one', exponent: 6 },
      { kind: 'minus-one', exponent: 3 },
    ]);
    expect(discoverPowers(10, 37).patterns).toEqual([
      { kind: 'one', exponent: 3 },
    ]);
    expect(discoverPowers(10, 99).patterns).toEqual([
      { kind: 'one', exponent: 2 },
    ]);
    expect(discoverPowers(10, 101).patterns).toEqual([
      { kind: 'one', exponent: 4 },
      { kind: 'minus-one', exponent: 2 },
    ]);
    expect(discoverPowers(10, 6).values).toEqual([1, 4, 4]);
    expect(discoverPowers(10, 6).patterns).toEqual([]);
  });

  it('compares all visual power cycles with direct integer powers in every allowed base and modulus', () => {
    for (let base = 2; base <= 16; base++) {
      for (let m = 2; m <= 150; m++) {
        const discovery = discoverPowers(base, m);
        expect(discovery.values.length <= m + 1).toBeTrue();
        expect(discovery.values[discovery.values.length - 1]).toBe(
          discovery.values[discovery.start],
        );
        expect(new Set(discovery.values.slice(0, -1)).size).toBe(
          discovery.values.length - 1,
        );
        discovery.values.forEach((value, exponent) => {
          expect(value).toBe(
            Number(BigInt(base) ** BigInt(exponent) % BigInt(m)),
          );
        });
      }
    }
  });

  it('checks the criteria generated from all decimal patterns on independent numbers', () => {
    for (let m = 2; m <= 150; m++) {
      for (const pattern of discoverPowers(10, m).patterns) {
        for (const n of [
          0n,
          1n,
          12003n,
          918082n,
          123321n,
          123422n,
          10n ** 40n - 1n,
        ]) {
          const terms = decimalBlocks(
            n,
            pattern.exponent,
            pattern.kind === 'minus-one',
          );
          const reduced = terms.reduce(
            (sum, term) =>
              sum +
              (pattern.kind === 'zero' && term.position !== 0
                ? 0n
                : term.weight * term.value),
            0n,
          );
          expect((n - reduced) % BigInt(m)).toBe(0n);
        }
      }
    }
  });

  it('reconstructs integers in other bases and verifies each family and its factors', () => {
    for (let base = 2; base <= 16; base++) {
      for (const input of [
        -999n,
        -104n,
        0n,
        1n,
        30n,
        63n,
        143n,
        255n,
        10n ** 40n - 1n,
      ]) {
        const result = baseRepresentation(input, base);
        const reconstructed = result.digits.reduce(
          (value, digit) => value * BigInt(base) + BigInt(digit.value),
          0n,
        );
        expect(reconstructed).toBe(absolute(input));
        for (const family of result.families) {
          expect(
            (result.n - BigInt(family.reduced)) % BigInt(family.related),
          ).toBe(0n);
          for (const check of family.divisors) {
            expect(check.divisible).toBe(input % BigInt(check.divisor) === 0n);
          }
        }
      }
    }
    expect(baseRepresentation(63n, 8).encoded).toBe('77');
    expect(baseRepresentation(143n, 12).encoded).toBe('BB');
    expect(baseRepresentation(255n, 16).encoded).toBe('FF');
  });

  it('checks article examples and all possible unknown digits independently', () => {
    for (const [n, m] of [
      [1358, 2],
      [2345, 5],
      [2340, 10],
      [7316, 4],
      [12104, 8],
      [12375, 25],
      [12345, 3],
      [12348, 9],
      [918082, 11],
      [203, 7],
      [1001, 13],
      [123321, 37],
      [12375, 99],
      [123422, 101],
      [1236, 12],
      [12345, 15],
      [12348, 18],
      [12312, 24],
      [123201, 27],
    ]) {
      expect(n % m).toBe(0);
    }
    const candidates = Array.from({ length: 10 }, (_, a) => a);
    expect(candidates.filter((a) => (47032 + 100 * a) % 3 === 0)).toEqual([
      2, 5, 8,
    ]);
    expect(candidates.filter((a) => (47032 + 100 * a) % 9 === 0)).toEqual([2]);
    expect(candidates.filter((a) => (47032 + 100 * a) % 11 === 0)).toEqual([4]);
    expect(candidates.filter((a) => (47032 + 100 * a) % 33 === 0)).toEqual([]);
    for (let a = 0; a < 100; a++) {
      for (let b = 0; b < 10; b++) {
        expect((10 * a + b) % 17 === 0).toBe((a - 5 * b) % 17 === 0);
      }
    }
  });

  it('rejects unsupported divisors, invalid bases and invalid discovery bounds', () => {
    expect(() => divisibilityTrace(123n, 0)).toThrowError(RangeError);
    expect(() => divisibilityTrace(123n, 17)).toThrowError(RangeError);
    for (const base of [0, 1, 2.5, 17, NaN]) {
      expect(() => baseRepresentation(12n, base)).toThrowError(RangeError);
      expect(() => discoverPowers(base, 7)).toThrowError(RangeError);
    }
    for (const m of [0, 1, 2.5, 151, NaN]) {
      expect(() => discoverPowers(10, m)).toThrowError(RangeError);
    }
  });
});
