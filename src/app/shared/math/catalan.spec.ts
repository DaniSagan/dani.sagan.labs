import { catalanSequence, dyckWords } from './catalan';

describe('Catalan calculations', () => {
  it('computes exact terms and rejects invalid indices', () => {
    expect(catalanSequence(7)).toEqual([1n, 1n, 2n, 5n, 14n, 42n, 132n, 429n]);
    expect(catalanSequence(35)[35].toString()).toBe('3116285494907301262');
    expect(catalanSequence(1000).length).toBe(1001);
    [-1, 0.5, NaN, Infinity, 1001].forEach(n => expect(() => catalanSequence(n)).toThrow());
  });
  it('enumerates each balanced word exactly once, including the empty word', () => {
    expect(dyckWords(0)).toEqual(['']);
    for (let n = 0; n <= 7; n++) {
      const words = dyckWords(n);
      expect(BigInt(words.length)).toBe(catalanSequence(n)[n]);
      expect(new Set(words).size).toBe(words.length);
      words.forEach(word => {
        expect(word.length).toBe(2 * n);
        let balance = 0;
        for (const char of word) { balance += char === '(' ? 1 : -1; expect(balance).toBeGreaterThanOrEqual(0); }
        expect(balance).toBe(0);
      });
    }
    expect(() => dyckWords(8)).toThrow();
  });
});
