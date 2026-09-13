import { aliquotSequence } from './aliquot';

describe('aliquotSequence', () => {
  it('terminates at zero without evaluating its divisors', () => {
    expect(aliquotSequence(12).values).toEqual([12, 16, 15, 9, 4, 3, 1, 0]);
    expect(aliquotSequence(1)).toEqual({ values: [1, 0], status: 'zero', cycleStart: null });
  });
  it('detects fixed points, friends and longer cycles with their entry index', () => {
    expect(aliquotSequence(25)).toEqual({ values: [25, 6, 6], status: 'cycle', cycleStart: 1 });
    expect(aliquotSequence(220).values).toEqual([220, 284, 220]);
    expect(aliquotSequence(12496)).toEqual({ values: [12496, 14288, 15472, 14536, 14264, 12496], status: 'cycle', cycleStart: 0 });
  });
  it('distinguishes resource limits from known outcomes', () => {
    expect(aliquotSequence(12, 1).status).toBe('steps');
    expect(aliquotSequence(6, 1).status).toBe('cycle');
    expect(aliquotSequence(99792000).status).toBe('value');
    [0, -1, 1.5, NaN, Infinity, 100000001].forEach(n => expect(() => aliquotSequence(n)).toThrow());
    [0, 201, 1.5].forEach(n => expect(() => aliquotSequence(12, n)).toThrow());
  });
});
