import { Fraction, Matrix } from './determinant';
import { decimalFraction, diagonalization, exactMatrix, identityExact, inverseExact, matricesEqual, powerExact, productExact, Quadratic, rationalSpectrum, scalar, spectrum2, Spectrum } from './diagonalization';

describe('Exact diagonalization', () => {
  function verify(s: Spectrum) {
    const dec = diagonalization(s)!;
    expect(dec).not.toBeNull();
    expect(matricesEqual(productExact(s.matrix, dec.p), productExact(dec.p, dec.d))).toBeTrue();
    expect(matricesEqual(productExact(productExact(dec.inverse, s.matrix), dec.p), dec.d)).toBeTrue();
    expect(matricesEqual(productExact(productExact(dec.p, dec.d), dec.inverse), s.matrix)).toBeTrue();
    for (const n of [0, 1, 2, 7, 100]) {
      expect(matricesEqual(powerExact(s.matrix, n), productExact(productExact(dec.p, powerExact(dec.d, n)), dec.inverse))).toBeTrue();
    }
    const reversed = diagonalization(s, true)!;
    expect(matricesEqual(productExact(productExact(reversed.p, reversed.d), reversed.inverse), s.matrix)).toBeTrue();
  }
  const cases: { name: string; matrix: Matrix; roots: number[]; dimensions: number[] }[] = [
    { name: 'diagonal', matrix: [[2, 0], [0, 0.5]], roots: [2, 0.5], dimensions: [1, 1] },
    { name: 'identity with repeated eigenvalue', matrix: [[1, 0], [0, 1]], roots: [1], dimensions: [2] },
    { name: 'distinct eigenvalues and oblique basis', matrix: [[2, 1], [0, 1]], roots: [2, 1], dimensions: [1, 1] },
    { name: 'symmetric', matrix: [[2, 1], [1, 2]], roots: [3, 1], dimensions: [1, 1] },
    { name: 'singular projection', matrix: [[1, 0], [0, 0]], roots: [1, 0], dimensions: [1, 1] },
    { name: 'zero matrix', matrix: [[0, 0], [0, 0]], roots: [0], dimensions: [2] },
    { name: 'reflection', matrix: [[1, 0], [0, -1]], roots: [1, -1], dimensions: [1, 1] },
    { name: 'negative scalar', matrix: [[-2, 0], [0, -2]], roots: [-2], dimensions: [2] },
  ];
  cases.forEach(({ name, matrix, roots, dimensions }) => it(`verifies ${name}, eigenspaces, change of base and powers`, () => {
    const s = spectrum2(matrix);
    expect(s.realDiagonalizable).toBeTrue();
    expect(s.spaces.map(space => space.value.approximate())).toEqual(roots);
    expect(s.spaces.map(space => space.geometric)).toEqual(dimensions);
    expect(s.spaces.reduce((n, space) => n + space.algebraic, 0)).toBe(2);
    verify(s);
  }));
  it('rejects the Jordan matrix even though its polynomial splits', () => {
    const s = spectrum2([[1, 1], [0, 1]]);
    expect(s.spaces.length).toBe(1);
    expect(s.spaces[0].algebraic).toBe(2);
    expect(s.spaces[0].geometric).toBe(1);
    expect(s.realDiagonalizable).toBeFalse();
    expect(s.complexDiagonalizable).toBeFalse();
    expect(diagonalization(s)).toBeNull();
    expect(matricesEqual(powerExact(s.matrix, 100), exactMatrix([[1, 100], [0, 1]]))).toBeTrue();
  });
  it('diagonalizes a real rotation over the complex field only', () => {
    const s = spectrum2([[0, -1], [1, 0]]);
    expect(s.realDiagonalizable).toBeFalse();
    expect(s.complexDiagonalizable).toBeTrue();
    expect(s.spaces.every(space => !space.value.real)).toBeTrue();
    expect(s.spaces.every(space => space.value.multiply(space.value).equals(scalar(-1)))).toBeTrue();
    verify(s);
  });
  it('keeps the irrational Fibonacci spectrum exact and computes F100', () => {
    const s = spectrum2([[1, 1], [1, 0]]);
    s.spaces.forEach(space => expect(space.value.multiply(space.value).subtract(space.value).equals(scalar(1))).toBeTrue());
    verify(s);
    expect(powerExact(s.matrix, 100)[1][0].a.toString()).toBe('354224848179261915075');
  });
  it('distinguishes close but unequal eigenvalues without a numerical tolerance', () => {
    const s = spectrum2([[1, 1], [0, 1.000000000001]]);
    expect(s.spaces.length).toBe(2);
    expect(s.realDiagonalizable).toBeTrue();
    expect(s.discriminant!.n > 0n).toBeTrue();
  });
  it('interprets finite decimal and exponent notation as exact rational input', () => {
    expect(decimalFraction(0.1).toString()).toBe('1/10');
    expect(decimalFraction(-0.125).toString()).toBe('-1/8');
    expect(decimalFraction(1e-7).toString()).toBe('1/10000000');
    expect(decimalFraction(1e21).toString()).toBe('1000000000000000000000');
  });
  it('verifies rational input with decimal entries', () => {
    verify(spectrum2([[0.3, 0.1], [0.1, 0.3]]));
  });
  it('detects a small nonzero imaginary component exactly', () => {
    const s = spectrum2([[1, -1e-12], [1e-12, 1]]);
    expect(s.realDiagonalizable).toBeFalse();
    expect(s.complexDiagonalizable).toBeTrue();
  });
  it('handles exact quadratic inversion and conjugates', () => {
    const x = new Quadratic(new Fraction(1), new Fraction(1), new Fraction(2));
    expect(x.divide(x).equals(scalar(1))).toBeTrue();
    expect(x.multiply(new Quadratic(new Fraction(1), new Fraction(-1), new Fraction(2))).equals(scalar(-1))).toBeTrue();
    expect(() => x.divide(scalar(0))).toThrow();
  });
  it('verifies a 3D repeated but diagonalizable spectrum', () => {
    const s = rationalSpectrum([[2, 0, 0], [0, 2, 0], [0, 0, -1]], [2, 2, -1]);
    expect(s.spaces.map(space => [space.algebraic, space.geometric])).toEqual([[2, 2], [1, 1]]);
    verify(s);
  });
  it('detects a 3D defective spectrum', () => {
    const s = rationalSpectrum([[2, 1, 0], [0, 2, 0], [0, 0, -1]], [2, 2, -1]);
    expect(s.spaces.map(space => [space.algebraic, space.geometric])).toEqual([[2, 1], [1, 1]]);
    expect(s.realDiagonalizable).toBeFalse();
  });
  it('verifies a non-diagonal 3D matrix with three distinct roots', () => {
    verify(rationalSpectrum([[1, 1, 0], [0, 2, 1], [0, 0, 3]], [1, 2, 3]));
  });
  it('verifies identity in dimension three', () => {
    const s = rationalSpectrum([[1, 0, 0], [0, 1, 0], [0, 0, 1]], [1, 1, 1]);
    expect(s.spaces[0].geometric).toBe(3);
    verify(s);
  });
  it('rejects incorrect supplied spectra and invalid input', () => {
    expect(() => rationalSpectrum([[1, 0], [0, 2]], [1, 1])).toThrow();
    expect(() => rationalSpectrum([[1, 0], [0, 2]], [1])).toThrow();
    expect(() => spectrum2([[1]])).toThrow();
    expect(() => spectrum2([[NaN, 0], [0, 1]])).toThrow();
    expect(() => inverseExact(exactMatrix([[1, 1], [1, 1]]))).toThrow();
    expect(() => powerExact(identityExact(2), -1)).toThrow();
    expect(() => powerExact(identityExact(2), 0.5)).toThrow();
  });
  it('checks the article counterexample for the incorrect change-of-base order', () => {
    const a = exactMatrix([[2, 1], [0, 1]]), p = exactMatrix([[2, 1], [0, -1]]), inverse = inverseExact(p);
    expect(matricesEqual(productExact(productExact(inverse, a), p), exactMatrix([[2, 0], [0, 1]]))).toBeTrue();
    expect(matricesEqual(productExact(productExact(p, a), inverse), exactMatrix([[2, -1], [0, 1]]))).toBeTrue();
  });
});

