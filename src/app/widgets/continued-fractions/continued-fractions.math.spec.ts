import { convergents, euclideanSteps } from './continued-fractions.math';
import { EuclideanSquaresComponent } from './euclidean-squares.component';

describe('Continued fractions mathematics', () => {
  it('reproduces the classical convergents of pi', () => {
    expect(convergents([3, 7, 15, 1]).map(({ p, q }) => [p, q]))
      .toEqual([[3, 1], [22, 7], [333, 106], [355, 113]]);
  });

  it('reconstructs every rational allowed by the square widget in lowest terms', () => {
    for (let p = 1; p <= 100; p++) {
      for (let q = 1; q <= 100; q++) {
        const steps = euclideanSteps(p, q);
        const rows = convergents(steps.map(step => step.quotient));
        const last = rows[rows.length - 1];
        const gcd = steps[steps.length - 1].divisor;
        expect([last.p, last.q]).toEqual([p / gcd, q / gcd]);
      }
    }
  });

  it('rejects invalid inputs', () => {
    for (const n of [0, -1, 1.5, NaN, Infinity, 101]) {
      expect(() => euclideanSteps(n, 19)).toThrowError(RangeError);
      expect(() => euclideanSteps(43, n)).toThrowError(RangeError);
    }
  });

  it('tiles rectangles completely, including fractions below one and integers', () => {
    const widget = new EuclideanSquaresComponent();
    for (const [p, q] of [[43, 19], [19, 43], [34, 21], [12, 4], [7, 7], [1, 100], [100, 1]]) {
      widget.numerator = p; widget.denominator = q; widget.reset();
      const squares = widget.squares;
      expect(squares.reduce((area, square) => area + square.size ** 2, 0)).toBe(p * q);
      for (let x = 0; x < p; x++) {
        for (let y = 0; y < q; y++) {
          expect(squares.filter(s => x >= s.x && x < s.x + s.size && y >= s.y && y < s.y + s.size).length).toBe(1);
        }
      }
    }
  });
});
