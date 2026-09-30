import {
  binaryGroups,
  checkBase,
  decodeTwos,
  digitCount,
  divisionDigits,
  encodeNumeral,
  hornerTrace,
  parseNumeral,
  positionalTerms,
  signedEncodings,
} from './numeration.math';

describe('Positional integer representation', () => {
  it('reproduces the article examples and arithmetic in different bases', () => {
    expect(parseNumeral('101101', 2)).toBe(45n);
    expect(parseNumeral('2431', 5)).toBe(366n);
    expect(parseNumeral('7a3', 16)).toBe(1955n);
    for (const [base, text] of [
      [2, '10011100'],
      [5, '1111'],
      [8, '234'],
      [16, '9C'],
    ] as const) {
      expect(encodeNumeral(156n, base)).toBe(text);
    }
    expect(
      encodeNumeral(parseNumeral('243', 5) + parseNumeral('134', 5), 5),
    ).toBe('432');
    expect(
      encodeNumeral(parseNumeral('302', 5) - parseNumeral('134', 5), 5),
    ).toBe('113');
    expect(
      encodeNumeral(parseNumeral('23', 5) * parseNumeral('14', 5), 5),
    ).toBe('432');
    expect(
      encodeNumeral(parseNumeral('101', 2) * parseNumeral('11', 2), 2),
    ).toBe('1111');
    expect(parseNumeral('132', 5)).toBe(42n);
    expect(parseNumeral('132', 6)).toBe(56n);
    for (let b = 4; b <= 36; b++) expect(parseNumeral('132', b)).not.toBe(47n);
  });
  it('round-trips all small signed values in every supported base', () => {
    for (let base = 2; base <= 36; base++)
      for (let n = -100n; n <= 100n; n++) {
        expect(parseNumeral(encodeNumeral(n, base), base)).toBe(n);
        expect(encodeNumeral(n, base)).toBe(n.toString(base).toUpperCase());
      }
  });
  it('preserves large exact values, signs and canonical zero', () => {
    const n = 10n ** 70n + 12345678901234567890n;
    for (const base of [5, 10, 16, 36])
      expect(parseNumeral(encodeNumeral(-n, base), base)).toBe(-n);
    expect(parseNumeral('+000a', 16)).toBe(10n);
    expect(encodeNumeral(parseNumeral('-000', 2), 16)).toBe('0');
    expect(divisionDigits(0n, 2)).toEqual([
      { dividend: 0n, quotient: 0n, remainder: 0n, symbol: '0', position: 0 },
    ]);
  });
  it('rejects invalid bases, symbols and partial numerals', () => {
    for (const base of [1, 37, 2.5, NaN, Infinity])
      expect(() => checkBase(base)).toThrow();
    for (const text of [
      '',
      '+',
      '-',
      '1.2',
      '1 0',
      '0x10',
      '12!',
      '١٢',
      '1'.repeat(121),
    ])
      expect(() => parseNumeral(text, 16)).toThrow();
    expect(() => parseNumeral('102', 2)).toThrow();
    expect(() => parseNumeral('152', 5)).toThrow();
    expect(() => parseNumeral('G', 16)).toThrow();
  });
  it('certifies each division and reconstructs each digit weight and Horner prefix', () => {
    const n = 9876543210123456789n;
    for (let base = 2; base <= 36; base++) {
      const b = BigInt(base),
        steps = divisionDigits(n, base);
      for (const [i, s] of steps.entries()) {
        expect(s.dividend).toBe(b * s.quotient + s.remainder);
        expect(s.remainder >= 0n && s.remainder < b).toBeTrue();
        if (i > 0) expect(s.dividend).toBe(steps[i - 1].quotient);
      }
      expect(steps[steps.length - 1].quotient).toBe(0n);
      const terms = positionalTerms(n, base);
      expect(terms.reduce((sum, t) => sum + t.contribution, 0n)).toBe(n);
      for (const t of terms)
        expect(t.contribution).toBe(t.digit * b ** BigInt(t.position));
      const trace = hornerTrace(n, base);
      expect(trace[trace.length - 1].after).toBe(n);
      for (const row of trace)
        expect(row.after).toBe(row.before * b + row.digit);
    }
  });
  it('counts exact lengths at power boundaries without logarithms', () => {
    for (let base = 2; base <= 36; base++) {
      const power = BigInt(base) ** 40n;
      expect(digitCount(power - 1n, base)).toBe(40);
      expect(digitCount(power, base)).toBe(41);
      expect(digitCount(-power, base)).toBe(41);
    }
    expect(digitCount(0n, 2)).toBe(1);
    expect(digitCount(10n ** 100n, 2)).toBe(333);
  });
  it('groups only from the right and retains zeros within blocks', () => {
    expect(binaryGroups(156n, 3).blocks).toEqual([
      { bits: '010', symbol: '2' },
      { bits: '011', symbol: '3' },
      { bits: '100', symbol: '4' },
    ]);
    expect(binaryGroups(156n, 4).blocks).toEqual([
      { bits: '1001', symbol: '9' },
      { bits: '1100', symbol: 'C' },
    ]);
    for (const size of [3, 4] as const)
      for (const n of [0n, 1n, 256n, -156n, 10n ** 90n]) {
        const g = binaryGroups(n, size);
        expect(g.blocks.every((b) => b.bits.length === size)).toBeTrue();
        expect(g.blocks.map((b) => b.symbol).join('')).toBe(
          encodeNumeral(n < 0n ? -n : n, g.targetBase),
        );
      }
  });
});
describe('Fixed-width signed integers', () => {
  it('distinguishes the three representations and the asymmetric bound', () => {
    const r = signedEncodings(-13n, 8);
    expect(r.twos).toBe('11110011');
    expect(r.ones).toBe('11110010');
    expect(r.signMagnitude).toBe('10001101');
    const min = signedEncodings(-128n, 8);
    expect(min.twos).toBe('10000000');
    expect(min.ones).toBeNull();
    expect(min.signMagnitude).toBeNull();
    expect(() => signedEncodings(128n, 8)).toThrow();
    expect(() => signedEncodings(-129n, 8)).toThrow();
  });
  it('round-trips every bit pattern for widths 2 through 10', () => {
    for (let width = 2; width <= 10; width++) {
      const half = 1n << BigInt(width - 1);
      for (let n = -half; n < half; n++) {
        const r = signedEncodings(n, width);
        expect(decodeTwos(r.twos)).toBe(n);
        expect(r.twos.length).toBe(width);
        expect(r.unsigned).toBe(n < 0n ? n + 2n * half : n);
      }
    }
  });
  it('supports zero variants and exact 64-bit endpoints', () => {
    const r = signedEncodings(0n, 8);
    expect(r.twos).toBe('00000000');
    expect(r.negativeZeroSign).toBe('10000000');
    expect(r.negativeZeroOnes).toBe('11111111');
    for (const n of [-(1n << 63n), (1n << 63n) - 1n])
      expect(decodeTwos(signedEncodings(n, 64).twos)).toBe(n);
    for (const bits of ['1', '1020', '0'.repeat(65)])
      expect(() => decodeTwos(bits)).toThrow();
    expect(() => signedEncodings(0n, 1)).toThrow();
  });
});
