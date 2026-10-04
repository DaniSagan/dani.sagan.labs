import { Fraction, Matrix } from './determinant';

const f = (n: number | bigint) => new Fraction(n);
/** Interpret the finite decimal entered by the reader exactly, including exponent notation. */
export function decimalFraction(value: number): Fraction {
  if (!Number.isFinite(value)) throw new Error('Introduce números finitos.');
  const [mantissa, exponent = '0'] = value.toString().split('e');
  const digits = mantissa.split('.');
  const places = (digits[1]?.length || 0) - Number(exponent);
  const numerator = BigInt(digits.join(''));
  return places >= 0
    ? new Fraction(numerator, 10n ** BigInt(places))
    : new Fraction(numerator * 10n ** BigInt(-places));
}
function sqrtInteger(n: bigint): bigint {
  if (n < 0n) throw new Error('Raíz real de un número negativo.');
  if (n < 2n) return n;
  let x = n,
    y = (x + 1n) / 2n;
  while (y < x) {
    x = y;
    y = (x + n / x) / 2n;
  }
  return x;
}
/** Exact arithmetic in Q(sqrt(r)); r may be negative for complex eigenvalues. */
export class Quadratic {
  readonly a: Fraction;
  readonly b: Fraction;
  readonly r: Fraction;
  constructor(a: Fraction, b = f(0), r = f(0)) {
    if (r.n >= 0n) {
      const sn = sqrtInteger(r.n),
        sd = sqrtInteger(r.d);
      if (sn * sn === r.n && sd * sd === r.d) {
        a = a.add(b.multiply(new Fraction(sn, sd)));
        b = f(0);
        r = f(0);
      }
    }
    this.a = a;
    this.b = b;
    this.r = r;
  }
  private field(other: Quadratic): Fraction {
    if (
      !this.b.zero &&
      !other.b.zero &&
      this.r.toString() !== other.r.toString()
    )
      throw new Error('Cuerpos cuadráticos incompatibles.');
    return this.b.zero ? other.r : this.r;
  }
  add(other: Quadratic): Quadratic {
    return new Quadratic(
      this.a.add(other.a),
      this.b.add(other.b),
      this.field(other),
    );
  }
  negate(): Quadratic {
    return new Quadratic(this.a.negate(), this.b.negate(), this.r);
  }
  subtract(other: Quadratic): Quadratic {
    return this.add(other.negate());
  }
  multiply(other: Quadratic): Quadratic {
    const r = this.field(other);
    return new Quadratic(
      this.a.multiply(other.a).add(this.b.multiply(other.b).multiply(r)),
      this.a.multiply(other.b).add(this.b.multiply(other.a)),
      r,
    );
  }
  divide(other: Quadratic): Quadratic {
    if (other.zero) throw new Error('División entre cero.');
    const norm = other.a
      .multiply(other.a)
      .add(other.b.multiply(other.b).multiply(other.r).negate());
    return this.multiply(
      new Quadratic(
        other.a.divide(norm),
        other.b.negate().divide(norm),
        other.r,
      ),
    );
  }
  get zero(): boolean {
    return this.a.zero && this.b.zero;
  }
  equals(other: Quadratic): boolean {
    return this.subtract(other).zero;
  }
  get real(): boolean {
    return this.b.zero || this.r.n >= 0n;
  }
  approximate(): number {
    if (!this.real) return NaN;
    return (
      Number(this.a.n) / Number(this.a.d) +
      (Number(this.b.n) / Number(this.b.d)) *
        Math.sqrt(Number(this.r.n) / Number(this.r.d))
    );
  }
  tex(): string {
    const frac = (v: Fraction) =>
      v.d === 1n ? `${v.n}` : `\\frac{${v.n}}{${v.d}}`;
    if (this.b.zero) return frac(this.a);
    const radical =
      this.r.n < 0n
        ? `i\\sqrt{${frac(this.r.negate())}}`
        : `\\sqrt{${frac(this.r)}}`;
    return `${this.a.zero ? '' : frac(this.a)}${this.b.n > 0n && !this.a.zero ? '+' : ''}${frac(this.b)}${radical}`;
  }
}
export const scalar = (n: number): Quadratic =>
  new Quadratic(decimalFraction(n));
export type ExactMatrix = Quadratic[][];
export function exactMatrix(a: Matrix): ExactMatrix {
  if (!a.length || a.some((row) => row.length !== a.length))
    throw new Error('La matriz debe ser cuadrada.');
  return a.map((row) => row.map(scalar));
}
export const identityExact = (n: number): ExactMatrix =>
  Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => scalar(i === j ? 1 : 0)),
  );
export function productExact(a: ExactMatrix, b: ExactMatrix): ExactMatrix {
  return a.map((row) =>
    b[0].map((_, j) =>
      row.reduce((sum, v, k) => sum.add(v.multiply(b[k][j])), scalar(0)),
    ),
  );
}
export function inverseExact(a: ExactMatrix): ExactMatrix {
  const n = a.length,
    rows = a.map((row, i) => [...row, ...identityExact(n)[i]]);
  for (let col = 0; col < n; col++) {
    const pivot = rows.findIndex((row, i) => i >= col && !row[col].zero);
    if (pivot < 0) throw new Error('La matriz no es invertible.');
    [rows[col], rows[pivot]] = [rows[pivot], rows[col]];
    const p = rows[col][col];
    rows[col] = rows[col].map((v) => v.divide(p));
    rows.forEach((row, i) => {
      if (i !== col) {
        const c = row[col];
        rows[i] = row.map((v, j) => v.subtract(c.multiply(rows[col][j])));
      }
    });
  }
  return rows.map((row) => row.slice(n));
}
export function powerExact(a: ExactMatrix, exponent: number): ExactMatrix {
  if (!Number.isSafeInteger(exponent) || exponent < 0)
    throw new Error('El exponente debe ser un entero no negativo.');
  let result = identityExact(a.length),
    base = a,
    n = exponent;
  while (n) {
    if (n % 2) result = productExact(result, base);
    n = Math.floor(n / 2);
    if (n) base = productExact(base, base);
  }
  return result;
}
export function kernelExact(a: ExactMatrix): {
  basis: Quadratic[][];
  reduced: ExactMatrix;
} {
  const rows = a.map((row) => [...row]),
    pivots: number[] = [];
  let rank = 0;
  for (let col = 0; col < a[0].length; col++) {
    const pivot = rows.findIndex((row, i) => i >= rank && !row[col].zero);
    if (pivot < 0) continue;
    [rows[rank], rows[pivot]] = [rows[pivot], rows[rank]];
    const p = rows[rank][col];
    rows[rank] = rows[rank].map((v) => v.divide(p));
    rows.forEach((row, i) => {
      if (i !== rank) {
        const c = row[col];
        rows[i] = row.map((v, j) => v.subtract(c.multiply(rows[rank][j])));
      }
    });
    pivots.push(col);
    rank++;
  }
  const basis: Quadratic[][] = [];
  for (let free = 0; free < a[0].length; free++)
    if (!pivots.includes(free)) {
      const v = a[0].map(() => scalar(0));
      v[free] = scalar(1);
      pivots.forEach((col, row) => (v[col] = rows[row][free].negate()));
      basis.push(v);
    }
  return { basis, reduced: rows };
}
export interface EigenSpace {
  value: Quadratic;
  algebraic: number;
  geometric: number;
  basis: Quadratic[][];
  system: ExactMatrix;
  reduced: ExactMatrix;
}
export interface Spectrum {
  matrix: ExactMatrix;
  spaces: EigenSpace[];
  realDiagonalizable: boolean;
  complexDiagonalizable: boolean;
  count: number;
  discriminant?: Fraction;
  trace?: Fraction;
  determinant?: Fraction;
}
function assemble(matrix: ExactMatrix, roots: Quadratic[]): Spectrum {
  const spaces: EigenSpace[] = [];
  roots.forEach((value) => {
    const old = spaces.find((space) => space.value.equals(value));
    if (old) {
      old.algebraic++;
      return;
    }
    const system = matrix.map((row, i) =>
      row.map((v, j) => (i === j ? v.subtract(value) : v)),
    );
    const { basis, reduced } = kernelExact(system);
    spaces.push({
      value,
      algebraic: 1,
      geometric: basis.length,
      basis,
      system,
      reduced,
    });
  });
  const count = spaces.reduce((sum, space) => sum + space.geometric, 0);
  return {
    matrix,
    spaces,
    count,
    complexDiagonalizable: count === matrix.length,
    realDiagonalizable:
      count === matrix.length && spaces.every((space) => space.value.real),
  };
}
export function spectrum2(a: Matrix): Spectrum {
  if (a.length !== 2 || a.some((row) => row.length !== 2))
    throw new Error('Se necesita una matriz 2 × 2.');
  const matrix = exactMatrix(a),
    [[aa, b], [c, d]] = matrix;
  const trace = aa.a.add(d.a),
    determinant = aa.a.multiply(d.a).add(b.a.multiply(c.a).negate());
  const discriminant = trace
    .multiply(trace)
    .add(f(4).multiply(determinant).negate());
  const roots = [
    new Quadratic(trace.divide(f(2)), new Fraction(1, 2), discriminant),
    new Quadratic(trace.divide(f(2)), new Fraction(-1, 2), discriminant),
  ];
  return { ...assemble(matrix, roots), trace, determinant, discriminant };
}
/** Higher-dimensional rational examples: verify a supplied complete spectrum exactly.
 * The certificate prod(A-lambda I)=0 alone is insufficient for defective matrices;
 * verify the characteristic polynomial via its determinant polynomial instead. */
export function rationalSpectrum(a: Matrix, roots: number[]): Spectrum {
  const matrix = exactMatrix(a),
    n = a.length;
  if (roots.length !== n)
    throw new Error('Se necesita el espectro completo con multiplicidades.');
  // Degree n polynomials with identical leading coefficient agree if they agree at n points.
  for (let t = 0; t < n; t++) {
    const shifted = matrix.map((row, i) =>
      row.map((v, j) => (i === j ? v.subtract(scalar(t)) : v)),
    );
    const determinant = (m: ExactMatrix): Quadratic =>
      m.length === 1
        ? m[0][0]
        : m[0].reduce(
            (sum, v, j) =>
              sum.add(
                v
                  .multiply(
                    determinant(
                      m.slice(1).map((row) => row.filter((_, k) => k !== j)),
                    ),
                  )
                  .multiply(scalar(j % 2 ? -1 : 1)),
              ),
            scalar(0),
          );
    const expected = roots.reduce(
      (p, root) => p.multiply(scalar(root).subtract(scalar(t))),
      scalar(1),
    );
    if (!determinant(shifted).equals(expected))
      throw new Error('Los valores propuestos no son el espectro completo.');
  }
  return assemble(matrix, roots.map(scalar));
}
export function diagonalization(
  s: Spectrum,
  reverse = false,
): { p: ExactMatrix; d: ExactMatrix; inverse: ExactMatrix } | null {
  if (!s.complexDiagonalizable) return null;
  const columns = s.spaces.flatMap((space) =>
    space.basis.map((vector) => ({ vector, value: space.value })),
  );
  if (reverse) columns.reverse();
  const p = s.matrix.map((_, i) => columns.map((col) => col.vector[i]));
  const d = s.matrix.map((_, i) =>
    columns.map((col, j) => (i === j ? col.value : scalar(0))),
  );
  return { p, d, inverse: inverseExact(p) };
}
export function matrixTex(a: ExactMatrix): string {
  return `\\begin{pmatrix}${a.map((row) => row.map((v) => v.tex()).join('&')).join('\\\\')}\\end{pmatrix}`;
}
export function matricesEqual(a: ExactMatrix, b: ExactMatrix): boolean {
  return (
    a.length === b.length &&
    a.every(
      (row, i) =>
        row.length === b[i].length && row.every((v, j) => v.equals(b[i][j])),
    )
  );
}
