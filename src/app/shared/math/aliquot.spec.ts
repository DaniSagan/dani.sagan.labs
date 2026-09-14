import { aliquotSequence } from './aliquot';

describe('aliquotSequence', () => {
  it('terminates at zero without evaluating its divisors', () => {
    expect(aliquotSequence(12).values).toEqual([12n, 16n, 15n, 9n, 4n, 3n, 1n, 0n]);
    expect(aliquotSequence(1)).toEqual({ values: [1n, 0n], status: 'zero', cycleStart: null });
  });
  it('detects fixed points, friends and longer cycles with their entry index', () => {
    expect(aliquotSequence(25)).toEqual({ values: [25n, 6n, 6n], status: 'cycle', cycleStart: 1 });
    expect(aliquotSequence(220).values).toEqual([220n, 284n, 220n]);
    expect(aliquotSequence(12496)).toEqual({ values: [12496n, 14288n, 15472n, 14536n, 14264n, 12496n], status: 'cycle', cycleStart: 0 });
  });
  it('distinguishes resource limits from known outcomes', () => {
    expect(aliquotSequence(12, 1).status).toBe('steps');
    expect(aliquotSequence(6, 1).status).toBe('cycle');
    expect(aliquotSequence(99792000, 2).values.length).toBe(3);
    expect(aliquotSequence(2 ** 52, 1).values).toEqual([2n ** 52n, 2n ** 52n - 1n]);
    expect(aliquotSequence(3n * 2n ** 51n, 1).values).toEqual([3n * 2n ** 51n, 5n * 2n ** 51n - 4n]);
    expect(aliquotSequence((2n ** 80n).toString(), 1).values).toEqual([2n ** 80n, 2n ** 80n - 1n]);
    [0, -1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1].forEach(n => expect(() => aliquotSequence(n)).toThrow());
    [0, 201, 1.5].forEach(n => expect(() => aliquotSequence(12, n)).toThrow());
  });
});
