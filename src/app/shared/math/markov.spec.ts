import { absorbingWalk, chainPeriod, isIrreducible, MARKOV_PRESETS, markovHistory, markovRandom, markovStep, normalizeWeights, sampleTransition, stationaryDistribution } from './markov';

describe('Finite Markov models', () => {
  it('normalizes rows and rejects invalid weights', () => {
    expect(normalizeWeights([[2, 2], [1, 3]])).toEqual([[0.5, 0.5], [0.25, 0.75]]);
    for (const bad of [[[0, 0], [1, 1]], [[-1, 2], [1, 1]], [[NaN, 1], [1, 1]], [[1e308, 1e308], [1, 1]]]) expect(() => normalizeWeights(bad)).toThrowError();
  });
  it('uses row distributions and matches the two-step probability', () => {
    const history = markovHistory([1, 0, 0], MARKOV_PRESETS.mixing, 60);
    expect(history[2][0]).toBeCloseTo(0.54, 12);
    history.forEach(row => expect(row.reduce((a,b) => a+b, 0)).toBeCloseTo(1, 12));
  });
  it('distinguishes stationarity, periodicity and nonuniqueness', () => {
    expect(chainPeriod(MARKOV_PRESETS.mixing)).toBe(1);
    expect(chainPeriod(MARKOV_PRESETS.cycle)).toBe(3);
    const pi = stationaryDistribution(MARKOV_PRESETS.cycle)!;
    pi.forEach(v => expect(v).toBeCloseTo(1/3, 12));
    expect(markovHistory([1,0,0], MARKOV_PRESETS.cycle, 3)[3]).toEqual([1,0,0]);
    expect(isIrreducible(MARKOV_PRESETS.absorbing)).toBeFalse();
    expect(stationaryDistribution(MARKOV_PRESETS.absorbing)).toBeNull();
    expect(stationaryDistribution([[1,0],[0.5,0.5]])).toEqual([1,0]);
    const stationary = stationaryDistribution(MARKOV_PRESETS.mixing)!;
    markovStep(stationary, MARKOV_PRESETS.mixing).forEach((v,i) => expect(v).toBeCloseTo(stationary[i], 12));
  });
  it('matches the symmetric absorption formulas and first-step equations', () => {
    const symmetric = absorbingWalk(6, 0.5);
    for (let i = 0; i <= 6; i++) {
      expect(symmetric.right[i]).toBeCloseTo(i/6, 12);
      expect(symmetric.time[i]).toBeCloseTo(i * (6-i), 12);
    }
    for (const p of [0.05, 0.3, 0.8, 0.95]) {
      const m = absorbingWalk(6, p);
      for (let i = 1; i < 6; i++) {
        expect(m.right[i]).toBeCloseTo((1-p)*m.right[i-1]+p*m.right[i+1], 12);
        expect(m.time[i]).toBeCloseTo(1+(1-p)*m.time[i-1]+p*m.time[i+1], 12);
      }
    }
  });
  it('samples reproducibly and never chooses zero-probability transitions', () => {
    const a = markovRandom(42), b = markovRandom(42);
    for (let i = 0; i < 100; i++) { expect(a()).toBe(b()); expect(sampleTransition([0,1,0], a)).toBe(1); sampleTransition([0,1,0], b); }
  });
});
