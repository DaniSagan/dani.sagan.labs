import { bayes } from './bayes';
describe('bayes', () => {
  it('computes posteriors and a complete partition of outcomes', () => {
    const r = bayes(0.01, 0.9, 0.05);
    expect(r.posterior!).toBeCloseTo(90 / 585, 12);
    expect(r.negativePosterior!).toBeCloseTo(10 / 9415, 12);
    expect(r.truePositive + r.falseAlarm + r.missed + r.correctNegative).toBeCloseTo(1, 12);
  });
  it('handles uninformative signals, perfect sensors and impossible observations', () => {
    expect(bayes(0.2, 0.4, 0.4).posterior!).toBeCloseTo(0.2, 12);
    expect(bayes(0.2, 1, 0).posterior).toBe(1);
    expect(bayes(0.2, 1, 0).negativePosterior).toBe(0);
    expect(bayes(0, 1, 0).posterior).toBeNull();
    expect(bayes(1, 1, 0).negativePosterior).toBeNull();
    [-1, 2, NaN, Infinity].forEach(p => expect(() => bayes(p, 0.5, 0.5)).toThrow());
  });
});
