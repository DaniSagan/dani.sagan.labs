export type Matrix = number[][];
export function determinant(a: Matrix): number {
  if (a.length === 1) return a[0][0];
  if (a.length === 2) return a[0][0] * a[1][1] - a[0][1] * a[1][0];
  return a[0].reduce(
    (sum, value, j) =>
      sum + (j % 2 ? -1 : 1) * value * determinant(minor(a, 0, j)),
    0,
  );
}
export function minor(a: Matrix, row: number, column: number): Matrix {
  return a
    .filter((_, i) => i !== row)
    .map((r) => r.filter((_, j) => j !== column));
}
export function multiplyMatrices(a: Matrix, b: Matrix): Matrix {
  return a.map((row) =>
    b[0].map((_, j) => row.reduce((sum, value, k) => sum + value * b[k][j], 0)),
  );
}
export function interpolateIdentity(a: Matrix, t: number): Matrix {
  return a.map((row, i) =>
    row.map((value, j) => (i === j ? 1 - t : 0) + t * value),
  );
}
export function matrixValid(a: Matrix, limit = 5, integers = false): boolean {
  return a.every((row) =>
    row.every(
      (value) =>
        Number.isFinite(value) &&
        Math.abs(value) <= limit &&
        (!integers || Number.isInteger(value)),
    ),
  );
}
export function permutations(n: number): number[][] {
  if (!n) return [[]];
  const visit = (prefix: number[], remaining: number[]): number[][] =>
    !remaining.length
      ? [prefix]
      : remaining.flatMap((v, i) =>
          visit(
            [...prefix, v],
            remaining.filter((_, j) => j !== i),
          ),
        );
  return visit(
    [],
    Array.from({ length: n }, (_, i) => i),
  );
}
export function permutationSign(p: number[]): number {
  let inversions = 0;
  for (let i = 0; i < p.length; i++)
    for (let j = i + 1; j < p.length; j++) if (p[i] > p[j]) inversions++;
  return inversions % 2 ? -1 : 1;
}

/** Immutable exact rational arithmetic for the row-operation laboratory. */
export class Fraction {
  readonly n: bigint;
  readonly d: bigint;
  constructor(n: bigint | number, d: bigint | number = 1) {
    let numerator = BigInt(n),
      denominator = BigInt(d);
    if (!denominator) throw new Error('No se puede dividir entre cero.');
    if (denominator < 0n) {
      numerator = -numerator;
      denominator = -denominator;
    }
    let a = numerator < 0n ? -numerator : numerator,
      b = denominator;
    while (b) {
      const r = a % b;
      a = b;
      b = r;
    }
    this.n = numerator / a;
    this.d = denominator / a;
  }
  add(b: Fraction) {
    return new Fraction(this.n * b.d + b.n * this.d, this.d * b.d);
  }
  multiply(b: Fraction) {
    return new Fraction(this.n * b.n, this.d * b.d);
  }
  divide(b: Fraction) {
    return new Fraction(this.n * b.d, this.d * b.n);
  }
  negate() {
    return new Fraction(-this.n, this.d);
  }
  get zero() {
    return this.n === 0n;
  }
  toString() {
    return this.d === 1n ? `${this.n}` : `${this.n}/${this.d}`;
  }
}
export type RationalMatrix = Fraction[][];
export function exactDeterminant(a: RationalMatrix): Fraction {
  if (a.length === 1) return a[0][0];
  return a[0].reduce((sum, value, j) => {
    const m = a.slice(1).map((row) => row.filter((_, k) => k !== j));
    const term = value.multiply(exactDeterminant(m));
    return sum.add(j % 2 ? term.negate() : term);
  }, new Fraction(0));
}
export interface EliminationStep {
  matrix: RationalMatrix;
  factor: Fraction;
  description: string;
  row: number;
  pivot: number;
  triangular: boolean;
}
/** Every snapshot satisfies det(current) = factor * det(original). */
export function eliminationSteps(input: Matrix): EliminationStep[] {
  let a = input.map((row) => row.map((value) => new Fraction(value)));
  let factor = new Fraction(1);
  const steps: EliminationStep[] = [];
  const record = (
    description: string,
    row = -1,
    pivot = -1,
    triangular = false,
  ) =>
    steps.push({
      matrix: a.map((r) => [...r]),
      factor,
      description,
      row,
      pivot,
      triangular,
    });
  record('Matriz inicial. El factor acumulado vale 1.');
  for (let col = 0; col < a.length; col++) {
    const pivotRow = a.findIndex((row, i) => i >= col && !row[col].zero);
    if (pivotRow < 0) {
      record(
        `La columna ${col + 1} ya tiene ceros desde la diagonal hacia abajo. No hay pivote en esta columna.`,
        -1,
        col,
      );
      continue;
    }
    if (pivotRow !== col) {
      [a[col], a[pivotRow]] = [a[pivotRow], a[col]];
      factor = factor.negate();
      record(
        `Intercambiar F${col + 1} y F${pivotRow + 1}: el determinante cambia de signo.`,
        col,
        col,
      );
    }
    const pivot = a[col][col];
    if (pivot.toString() !== '1') {
      const scale = new Fraction(1).divide(pivot);
      a[col] = a[col].map((value) => value.multiply(scale));
      factor = factor.multiply(scale);
      record(
        `F${col + 1} ← (${scale}) F${col + 1}: el determinante se multiplica por ${scale}.`,
        col,
        col,
      );
    }
    for (let row = col + 1; row < a.length; row++) {
      if (a[row][col].zero) continue;
      const coefficient = a[row][col].negate();
      a[row] = a[row].map((value, j) =>
        value.add(coefficient.multiply(a[col][j])),
      );
      record(
        `F${row + 1} ← F${row + 1} + (${coefficient}) F${col + 1}: el determinante no cambia.`,
        row,
        col,
      );
    }
  }
  record(
    'Matriz triangular. Multiplica la diagonal y divide por el factor acumulado para recuperar det(A).',
    -1,
    -1,
    true,
  );
  return steps;
}
