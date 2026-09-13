import { fibonacciSequence, fibonacciSquares } from './fibonacci';

describe('Fibonacci calculations', () => {
  it('computes exact terms including values beyond Number precision', () => {
    expect(fibonacciSequence(0)).toEqual([0n]);
    expect(fibonacciSequence(7)).toEqual([0n, 1n, 1n, 2n, 3n, 5n, 8n, 13n]);
    expect(fibonacciSequence(100)[100].toString()).toBe('354224848179261915075');
    expect(fibonacciSequence(1000)[1000].toString().length).toBe(209);
    [-1, 1.5, NaN, Infinity, 1001].forEach(n => expect(() => fibonacciSequence(n)).toThrow());
  });
  it('tiles a rectangle without overlap and preserves the sum of square areas', () => {
    for (let n = 2; n <= 10; n++) {
      const squares = fibonacciSquares(n);
      const width = Math.max(...squares.map(s => s.x + s.size)) - Math.min(...squares.map(s => s.x));
      const height = Math.max(...squares.map(s => s.y + s.size)) - Math.min(...squares.map(s => s.y));
      const sequence = fibonacciSequence(n + 1);
      expect(width * height).toBe(Number(sequence[n] * sequence[n + 1]));
      expect(squares.reduce((sum, s) => sum + s.size ** 2, 0)).toBe(width * height);
      squares.forEach((a, i) => squares.slice(i + 1).forEach(b => {
        expect(a.x + a.size <= b.x || b.x + b.size <= a.x || a.y + a.size <= b.y || b.y + b.size <= a.y).toBeTrue();
      }));
    }
  });
});
