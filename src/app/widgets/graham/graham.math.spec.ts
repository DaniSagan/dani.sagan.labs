import {
  decimalTotientChain,
  evaluateKnuth,
  expansionTex,
  grahamDefinition,
  grahamSuffix,
  towerThreeSuffix,
} from './graham.math';

describe('Bounded Knuth arithmetic', () => {
  it('agrees with ordinary powers, including exponent zero', () => {
    for (let a = 2; a <= 10; a++)
      for (let b = 0; b <= 6; b++) {
        expect(evaluateKnuth(a, 1, b).value).toBe(BigInt(a) ** BigInt(b));
      }
  });
  it('evaluates small higher operations exactly and associates towers to the right', () => {
    expect(evaluateKnuth(3, 2, 3).value).toBe(7625597484987n);
    expect(evaluateKnuth(4, 2, 3).value).toBe(4n ** 256n);
    expect(evaluateKnuth(2, 2, 4).value).toBe(65536n);
    expect(evaluateKnuth(2, 3, 3).value).toBe(65536n);
    expect(evaluateKnuth(2, 4, 2).value).toBe(4n);
    for (let k = 1; k <= 4; k++) {
      expect(evaluateKnuth(3, k, 0).value).toBe(1n);
      expect(evaluateKnuth(3, k, 1).value).toBe(3n);
    }
  });
  it('stops before allocating enormous results throughout the supported domain', () => {
    for (let a = 2; a <= 10; a++)
      for (let k = 1; k <= 4; k++)
        for (let b = 0; b <= 6; b++) {
          const result = evaluateKnuth(a, k, b);
          if (result.value !== null)
            expect(result.value.toString().length).toBeLessThanOrEqual(200);
          else expect(result.limit).toBe('digits');
        }
    expect(evaluateKnuth(3, 2, 4)).toEqual({ value: null, limit: 'digits' });
    expect(evaluateKnuth(10, 4, 6).value).toBeNull();
  });
  it('validates every input before computation', () => {
    for (const [a, k, b] of [
      [0, 1, 3],
      [1, 2, 3],
      [11, 1, 3],
      [3, 0, 3],
      [3, 5, 3],
      [3, 2, -1],
      [3, 2, 7],
      [3, 2, 1.5],
      [NaN, 2, 3],
      [3, Infinity, 3],
    ]) {
      expect(() => evaluateKnuth(a, k, b)).toThrow();
    }
  });
  it('represents the recursive operation rather than multiplying arrow counts', () => {
    expect(expansionTex(3, 3, 3)).toBe(
      '3\\uparrow\\uparrow\\left(3\\uparrow\\uparrow\\uparrow 2\\right)',
    );
    expect(expansionTex(3, 2, 3)).toBe(
      '3^{\\left(3^{\\left(3\\right)}\\right)}',
    );
    expect(grahamDefinition(1)).toBe(
      'g_1=3\\uparrow\\uparrow\\uparrow\\uparrow3',
    );
    expect(grahamDefinition(64)).toBe('g_{64}=3\\uparrow^{g_{63}}3=G');
    expect(() => grahamDefinition(65)).toThrow();
  });
});

describe('Graham decimal suffixes', () => {
  it('matches directly evaluated towers, including zero height', () => {
    for (let d = 1; d <= 20; d++) {
      [1n, 3n, 27n, 7625597484987n].forEach((value, h) => {
        expect(towerThreeSuffix(h, d)).toBe(
          (value % 10n ** BigInt(d)).toString().padStart(d, '0'),
        );
      });
    }
  });
  it('agrees with independently tabulated digits (OEIS A133613)', () => {
    expect(grahamSuffix(1).suffix).toBe('7');
    expect(grahamSuffix(10).suffix).toBe('2464195387');
    expect(grahamSuffix(20).suffix).toBe('04575627262464195387');
  });
  it('terminates the totient chain and proves stability for every supported width', () => {
    expect(decimalTotientChain(2)).toEqual([100n, 40n, 16n, 8n, 4n, 2n, 1n]);
    for (let d = 1; d <= 30; d++) {
      const result = grahamSuffix(d);
      expect(result.height).toBe(3 * d);
      expect(result.chain[result.chain.length - 1]).toBe(1n);
      expect(towerThreeSuffix(result.height + 1, d)).toBe(result.suffix);
      expect(towerThreeSuffix(100, d)).toBe(result.suffix);
      expect(result.suffix.endsWith(grahamSuffix(1).suffix)).toBeTrue();
    }
  });
  it('rejects unbounded or invalid suffix requests', () => {
    for (const d of [0, 31, 1.2, NaN, Infinity])
      expect(() => grahamSuffix(d)).toThrow();
    expect(() => towerThreeSuffix(101, 10)).toThrow();
    expect(() => towerThreeSuffix(-1, 10)).toThrow();
  });
});
