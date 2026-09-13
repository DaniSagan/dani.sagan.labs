import { bernoulliNumbers, formatBernoulli } from './bernoulli';

describe('bernoulliNumbers', () => {
  it('returns exact reference fractions with the negative B1 convention', () => {
    const values = bernoulliNumbers(20);
    const expected: { [index: number]: string } = {
      0: '1', 1: '-1 / 2', 2: '1 / 6', 4: '-1 / 30', 6: '1 / 42',
      12: '-691 / 2730', 20: '-174611 / 330'
    };
    Object.keys(expected).forEach(index => expect(formatBernoulli(values[+index])).toBe(expected[+index]));
  });
  it('preserves exact large numerators and vanishing odd terms up to the limit', () => {
    const values = bernoulliNumbers(200);
    expect(formatBernoulli(values[100])).toBe('-94598037819122125295227433069493721872702841533066936133385696204311395415197247711 / 33330');
    for (let n = 3; n < 200; n += 2) expect(formatBernoulli(values[n])).toBe('0');
    expect(values[200].numerator < 0n).toBeTrue();
  });
  it('rejects invalid indices', () => {
    [-1, 1.5, NaN, Infinity, 201].forEach(n => expect(() => bernoulliNumbers(n)).toThrowError(/entero/));
  });
});
