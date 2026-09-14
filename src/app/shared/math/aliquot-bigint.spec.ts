import { aliquotDivisors, bigintDivisorData, parseAliquotStart } from './aliquot-bigint';

describe('bigint divisor calculations', () => {
  it('matches exhaustive divisors and sums', () => {
    for (let n = 1n; n <= 300n; n++) {
      const expected: bigint[] = [];
      for (let d = 1n; d < n; d++) if (n % d === 0n) expected.push(d);
      expect(bigintDivisorData(n).divisors).toEqual(expected);
      expect(bigintDivisorData(n).sum).toBe(expected.reduce((a, b) => a + b, 0n));
    }
  });
  it('reuses immutable cached results', () => {
    const result = bigintDivisorData(2n ** 80n);
    expect(aliquotDivisors(2n ** 80n).next()).toEqual({ done: true, value: result });
    expect(Object.isFrozen(result.divisors)).toBeTrue();
    expect(result.sum).toBe(2n ** 80n - 1n);
  });
  it('preserves decimal input and rejects imprecise or malformed inputs', () => {
    expect(parseAliquotStart('9007199254740993')).toBe(9007199254740993n);
    ['', '-1', '1.5', '1e20', '0x10', '0'].forEach(n => expect(() => parseAliquotStart(n)).toThrow());
    expect(() => parseAliquotStart(Number.MAX_SAFE_INTEGER + 1)).toThrow();
  });
});
