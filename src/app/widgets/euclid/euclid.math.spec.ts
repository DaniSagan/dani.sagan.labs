import { absolute, backSubstitutions, euclid, parseInteger } from './euclid.math';

describe('Exact Euclidean arithmetic', () => {
  it('reproduces the article divisions and Bézout coefficients', () => {
    const result = euclid(252n, 198n);
    expect(result.divisions.map(d => [d.dividend, d.divisor, d.quotient, d.remainder])).toEqual([
      [252n, 198n, 1n, 54n], [198n, 54n, 3n, 36n], [54n, 36n, 1n, 18n], [36n, 18n, 2n, 0n]
    ]);
    expect([result.gcd, result.x, result.y, result.lcm]).toEqual([18n, 4n, -5n, 2772n]);
  });

  it('agrees with independent divisor enumeration for small signed integers', () => {
    for (let a = -25; a <= 25; a++) {
      for (let b = -25; b <= 25; b++) {
        let expected = 0;
        for (let d = 1; d <= Math.max(Math.abs(a), Math.abs(b)); d++) {
          if (a % d === 0 && b % d === 0) { expected = d; }
        }
        const result = euclid(BigInt(a), BigInt(b));
        expect(result.gcd).toBe(BigInt(expected));
        expect(BigInt(a) * result.x + BigInt(b) * result.y).toBe(result.gcd);
        expect(result.gcd * result.lcm).toBe(absolute(BigInt(a * b)));
        if (a && b) {
          expect(result.lcm % BigInt(a)).toBe(0n);
          expect(result.lcm % BigInt(b)).toBe(0n);
        }
        for (const row of result.rows) {
          expect(BigInt(a) * row.x + BigInt(b) * row.y).toBe(row.remainder);
        }
        for (const division of result.divisions) {
          expect(division.divisor * division.quotient + division.remainder).toBe(division.dividend);
          expect(division.remainder >= 0n && division.remainder < division.divisor).toBeTrue();
        }
      }
    }
  });

  it('reconstructs the gcd at every backward substitution, including signs and zero', () => {
    for (const [a, b] of [[252n, 198n], [-84n, 30n], [18n, 48n], [35n, 22n], [0n, -42n], [-42n, 0n], [7n, 7n]]) {
      const result = euclid(a, b);
      const steps = backSubstitutions(result);
      for (const step of steps) {
        expect(step.terms.reduce((sum, term) => sum + term.coefficient * result.rows[term.index].remainder, 0n)).toBe(result.gcd);
      }
      const final = steps[steps.length - 1].terms;
      expect(final.every(term => term.index < 2)).toBeTrue();
      expect((final.find(term => term.index === 0)?.coefficient ?? 0n) * (a < 0n ? -1n : 1n)).toBe(result.x);
      expect((final.find(term => term.index === 1)?.coefficient ?? 0n) * (b < 0n ? -1n : 1n)).toBe(result.y);
    }
    expect(backSubstitutions(euclid(0n, 0n))).toEqual([]);
  });

  it('handles zero, equality, exact division and a first quotient of zero', () => {
    expect(euclid(0n, 0n).gcd).toBe(0n);
    expect(euclid(0n, 0n).lcm).toBe(0n);
    expect(euclid(-42n, 0n).divisions.length).toBe(0);
    expect(euclid(0n, -42n).gcd).toBe(42n);
    expect(euclid(12n, 12n).gcd).toBe(12n);
    expect(euclid(84n, 7n).divisions.length).toBe(1);
    expect(euclid(18n, 48n).divisions[0].quotient).toBe(0n);
  });

  it('keeps 18-digit inputs and products beyond Number precision exact', () => {
    const a = parseInteger('999999999999999999');
    const b = parseInteger('999999999999999998');
    const result = euclid(a, b);
    expect(result.gcd).toBe(1n);
    expect(result.lcm).toBe(999999999999999997000000000000000002n);
    expect(a * result.x + b * result.y).toBe(1n);
  });

  it('accepts signed decimal integers and rejects ambiguous or excessive inputs', () => {
    expect(parseInteger(' +0042 ')).toBe(42n);
    expect(parseInteger('-0')).toBe(0n);
    for (const input of ['', ' ', '-', '1.5', '1e6', 'NaN', 'Infinity', '0x10', '1 000', '1000000000000000000']) {
      expect(() => parseInteger(input)).toThrowError(RangeError);
    }
  });

  it('checks the numerical exercises and example with negative input', () => {
    expect(euclid(414n, 662n).gcd).toBe(2n);
    const signed = euclid(-84n, 30n);
    expect([signed.gcd, signed.x, signed.y, signed.lcm]).toEqual([6n, 1n, 3n, 420n]);
    const inverse = euclid(17n, 43n);
    expect((inverse.x % 43n + 43n) % 43n).toBe(38n);
    expect(10n % euclid(24n, 36n).gcd).not.toBe(0n);
    expect(252n * 4n + 198n * -5n).toBe(18n);
  });
});
