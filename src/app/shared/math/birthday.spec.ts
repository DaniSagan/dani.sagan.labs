import { birthdayProbability, sampleBirthdays } from './birthday';
describe('birthday probability', () => {
  it('handles boundaries and the classical threshold', () => {
    expect(birthdayProbability(0)).toBeCloseTo(0, 12);
    expect(birthdayProbability(1)).toBeCloseTo(0, 12);
    expect(birthdayProbability(2)).toBeCloseTo(1 / 365, 12);
    expect(birthdayProbability(22)).toBeLessThan(0.5);
    expect(birthdayProbability(23)).toBeCloseTo(0.5072972343239854, 12);
    expect(birthdayProbability(366)).toBe(1);
    expect(() => birthdayProbability(-1)).toThrow();
  });
  it('samples dates in the modeled year', () => {
    expect(sampleBirthdays(3, () => 0)).toEqual([0, 0, 0]);
    expect(sampleBirthdays(2, () => 0.99999)).toEqual([364, 364]);
  });
});
