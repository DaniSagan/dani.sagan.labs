import { angleValues, multipleAnglePolynomials } from './angle-identities';

describe('angle identities', () => {
  it('generates the exact binomial coefficients and signs', () => {
    expect(multipleAnglePolynomials(2)).toEqual({ sine: '2cs', cosine: 'c^{2}-s^{2}' });
    expect(multipleAnglePolynomials(3)).toEqual({ sine: '3c^{2}s-s^{3}', cosine: 'c^{3}-3cs^{2}' });
    expect(multipleAnglePolynomials(4)).toEqual({ sine: '4c^{3}s-4cs^{3}', cosine: 'c^{4}-6c^{2}s^{2}+s^{4}' });
    expect(multipleAnglePolynomials(8).cosine).toBe('c^{8}-28c^{6}s^{2}+70c^{4}s^{4}-28c^{2}s^{6}+s^{8}');
    [1, 9, 2.5, NaN].forEach(n => expect(() => multipleAnglePolynomials(n)).toThrow());
  });
  it('distinguishes tangent poles from zeros and respects negative angles', () => {
    expect(angleValues(90).tan).toBeNull(); expect(angleValues(270).tan).toBeNull();
    expect(angleValues(180).tan!).toBeCloseTo(0, 10);
    expect(angleValues(-30).sin).toBeCloseTo(-0.5, 10);
    expect(angleValues(45).tan!).toBeCloseTo(1, 10);
  });
});
