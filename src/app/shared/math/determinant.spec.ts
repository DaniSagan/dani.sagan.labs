import {
  determinant,
  eliminationSteps,
  exactDeterminant,
  Fraction,
  interpolateIdentity,
  Matrix,
  multiplyMatrices,
  permutations,
  permutationSign,
} from './determinant';

describe('Determinant mathematics', () => {
  it('computes oriented areas and volumes, including rank loss', () => {
    expect(
      determinant([
        [2, 1],
        [0, 3],
      ]),
    ).toBe(6);
    expect(
      determinant([
        [0, 1],
        [1, 0],
      ]),
    ).toBe(-1);
    expect(
      determinant([
        [1, 0, 1],
        [0, 1, 1],
        [0, 0, 0],
      ]),
    ).toBe(0);
    expect(
      determinant([
        [2, 1, 0],
        [1, 3, 1],
        [0, 2, 2],
      ]),
    ).toBe(6);
  });
  it('satisfies multiplicativity independently of commutativity', () => {
    const a = [
        [2, 1],
        [0, 1],
      ],
      b = [
        [0, 1],
        [1, 0],
      ];
    expect(multiplyMatrices(a, b)).not.toEqual(multiplyMatrices(b, a));
    expect(determinant(multiplyMatrices(a, b))).toBe(
      determinant(a) * determinant(b),
    );
  });
  it('detects the singular midpoint of the straight path to minus identity', () => {
    const a = [
      [-1, 0],
      [0, -1],
    ];
    expect(determinant(a)).toBe(1);
    expect(determinant(interpolateIdentity(a, 0.5))).toBe(0);
  });
  it('enumerates six signed products with three positive and three negative permutations', () => {
    const orders = permutations(3);
    expect(orders.length).toBe(6);
    expect(new Set(orders.map((p) => p.join())).size).toBe(6);
    expect(orders.map(permutationSign).filter((s) => s === 1).length).toBe(3);
    const a = [
      [2, -1, 3],
      [0, 4, 2],
      [1, 1, -2],
    ];
    const sum = orders.reduce(
      (s, p) => s + permutationSign(p) * p.reduce((v, j, i) => v * a[i][j], 1),
      0,
    );
    expect(sum).toBe(determinant(a));
  });
  it('normalizes exact fractions and rejects zero denominators', () => {
    expect(new Fraction(2, -4).toString()).toBe('-1/2');
    expect(new Fraction(1, 3).add(new Fraction(1, 6)).toString()).toBe('1/2');
    expect(new Fraction(0, 5).toString()).toBe('0');
    expect(() => new Fraction(1, 0)).toThrow();
  });
  it('preserves the determinant ledger through every exact operation, including singular inputs', () => {
    const matrices: Matrix[] = [
      [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ],
      [
        [0, 1, 2],
        [0, 2, 3],
        [0, 4, 5],
      ],
      [
        [0, 2, 1],
        [2, 1, 3],
        [1, 0, 1],
      ],
      [
        [1, 2, 3],
        [2, 4, 6],
        [0, 1, 1],
      ],
    ];
    for (let seed = 0; seed < 60; seed++)
      matrices.push(
        Array.from({ length: 3 }, (_, i) =>
          Array.from(
            { length: 3 },
            (_, j) => ((seed * 17 + i * 7 + j * 11 + i * j * seed) % 11) - 5,
          ),
        ),
      );
    for (const matrix of matrices) {
      const snapshots = eliminationSteps(matrix),
        original = exactDeterminant(snapshots[0].matrix);
      expect(original.toString()).toBe(String(determinant(matrix)));
      for (const s of snapshots)
        expect(exactDeterminant(s.matrix).toString()).toBe(
          original.multiply(s.factor).toString(),
        );
      const last = snapshots[snapshots.length - 1];
      for (let i = 0; i < 3; i++)
        for (let j = 0; j < i; j++) expect(last.matrix[i][j].zero).toBe(true);
      const diagonal = last.matrix.reduce(
        (v, row, i) => v.multiply(row[i]),
        new Fraction(1),
      );
      expect(diagonal.divide(last.factor).toString()).toBe(original.toString());
    }
  });
});
