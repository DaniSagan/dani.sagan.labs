import {
  convert,
  goldenExpansion,
  integerRepresentation,
  otherSystem,
  parsePositional,
  parseSystem,
  parseValue,
  positiveExpansion,
  quaterImaginary,
  rational,
  rationalBase,
  realExpansion,
} from './bases.math';

describe('Extraordinary numeral systems: value preservation', () => {
  it('round trips signed integers in every integer base', () => {
    for (let b = 2; b <= 36; b++)
      for (const n of [
        -12345n,
        -42n,
        -1n,
        0n,
        1n,
        42n,
        12345n,
        123456789012345678901234567890n,
      ]) {
        for (const base of [b, -b])
          expect(
            parsePositional(integerRepresentation(n, base).text, base),
          ).toEqual(rational(n));
      }
    expect(integerRepresentation(42n, -2).text).toBe('1111110');
  });
  it('round trips balanced ternary with both signs', () => {
    for (let n = -150; n <= 150; n++)
      expect(
        parseSystem(integerRepresentation(BigInt(n), 3, true).text, 'balanced')
          .re,
      ).toEqual(rational(BigInt(n)));
  });
  it('preserves fractions and certifies periods', () => {
    expect(parseValue('0.125', 10).re).toEqual(rational(1n, 8n));
    expect(parseValue('-A/F', 16).re).toEqual(rational(-2n, 3n));
    expect(positiveExpansion(rational(1n, 3n), 10, 20).text).toBe('0.(3)');
    expect(positiveExpansion(rational(1n, 3n), 3, 20).text).toBe('0.1');
    expect(positiveExpansion(rational(1n, 7n), 10, 20).text).toBe('0.(142857)');
    expect(positiveExpansion(rational(1n, 97n), 10, 10).exact).toBe(false);
    const r = positiveExpansion(rational(-1n, 8n), 2, 20);
    expect(parsePositional(r.text, 2)).toEqual(rational(-1n, 8n));
    expect(r.terms.find((t) => t.position === -3)?.contribution).toBe('-1/8');
  });
  it('uses AFS rational-base normalization', () => {
    expect(rationalBase(1n, 3, 2).text).toBe('2');
    expect(rationalBase(2n, 3, 2).text).toBe('21');
    for (const [p, q] of [
      [3, 2],
      [4, 3],
      [5, 2],
    ])
      for (let n = 0; n < 100; n++)
        expect(
          parseSystem(rationalBase(BigInt(n), p, q).text, `${p}/${q}`).re,
        ).toEqual(rational(BigInt(n)));
  });
  it('constructs canonical finite φ expansions of integers', () => {
    const phi = (1 + Math.sqrt(5)) / 2;
    expect(goldenExpansion({ a: 2n, b: 0n, d: 1n }, 20).text).toBe('10.01');
    expect(goldenExpansion({ a: 0n, b: 1n, d: 1n }, 20).text).toBe('10');
    for (let n = 0; n <= 150; n++) {
      const result = goldenExpansion({ a: BigInt(n), b: 0n, d: 1n }, 50);
      expect(result.exact).toBe(true);
      expect(result.text.replace('.', '').includes('11')).toBe(false);
      expect(
        result.terms.reduce((sum, t) => sum + phi ** t.position, 0),
      ).toBeCloseTo(n, 8);
    }
    expect(goldenExpansion({ a: 1n, b: 0n, d: 3n }, 10).exact).toBe(false);
  });
  it('round trips Gaussian integers with odd and even imaginary parts', () => {
    expect(quaterImaginary(parseValue('3+2i', 10)).text).toBe('13');
    for (let re = -15; re <= 15; re++)
      for (let im = -15; im <= 15; im++) {
        const v = { re: rational(BigInt(re)), im: rational(BigInt(im)) };
        expect(parseSystem(quaterImaginary(v).text, '2i')).toEqual(v);
      }
    expect(parseSystem('0.2', '2i').im).toEqual(rational(-1n));
  });
  it('round trips factorial and Zeckendorf', () => {
    for (let n = 0; n < 150; n++)
      for (const s of ['factorial', 'zeckendorf'] as const)
        expect(parseSystem(otherSystem(BigInt(n), s).text, s).re).toEqual(
          rational(BigInt(n)),
        );
    expect(
      otherSystem(42n, 'zeckendorf')
        .terms.filter((t) => t.digit === '1')
        .map((t) => t.contribution),
    ).toEqual(['34', '8']);
  });
  it('rejects invalid numerals and incompatible domains', () => {
    for (const input of ['', '1/0', '3/0.0', '1e3', '0x10', '1/2/3'])
      expect(() => parseValue(input, 10)).toThrow();
    expect(() => parseValue('2', 2)).toThrow();
    expect(() => convert(parseValue('1/3', 10), '-2', 20)).toThrow();
    expect(() => convert(parseValue('1+i', 10), 'phi', 20)).toThrow();
    expect(() => quaterImaginary(parseValue('1+0.5i', 10))).toThrow();
    expect(() => parseSystem('11', 'zeckendorf')).toThrow();
    expect(() => parseSystem('2:0', 'factorial')).toThrow();
    expect(() => parsePositional('1', 1)).toThrow();
  });
  it('labels all floating β expansions as approximate', () => {
    for (const beta of [Math.SQRT2, Math.E, Math.PI]) {
      const result = realExpansion(rational(2n), beta, 50);
      expect(result.exact).toBe(false);
      expect(result.text.endsWith('…')).toBe(true);
      expect(result.note).toContain('IEEE-754');
    }
  });
});
