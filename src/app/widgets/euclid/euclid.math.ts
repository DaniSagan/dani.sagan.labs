export interface EuclidRow {
  remainder: bigint;
  x: bigint;
  y: bigint;
  quotient: bigint | null;
}

export interface EuclidDivision {
  dividend: bigint;
  divisor: bigint;
  quotient: bigint;
  remainder: bigint;
}

export interface EuclidResult {
  a: bigint;
  b: bigint;
  gcd: bigint;
  lcm: bigint;
  x: bigint;
  y: bigint;
  rows: EuclidRow[];
  divisions: EuclidDivision[];
}

export const absolute = (n: bigint): bigint => n < 0n ? -n : n;

/** Decimal text avoids losing precision before conversion to BigInt. */
export function parseInteger(text: string): bigint {
  if (!/^[+-]?\d{1,18}$/.test(text.trim())) {
    throw new RangeError('Introduce enteros de hasta 18 cifras, sin decimales ni exponentes.');
  }
  return BigInt(text.trim());
}

export function euclid(a: bigint, b: bigint): EuclidResult {
  const rows: EuclidRow[] = [
    { remainder: absolute(a), x: a < 0n ? -1n : 1n, y: 0n, quotient: null },
    { remainder: absolute(b), x: 0n, y: b < 0n ? -1n : 1n, quotient: null }
  ];
  const divisions: EuclidDivision[] = [];
  let previous = rows[0], current = rows[1];
  while (current.remainder !== 0n) {
    const quotient = previous.remainder / current.remainder;
    const remainder = previous.remainder % current.remainder;
    divisions.push({ dividend: previous.remainder, divisor: current.remainder, quotient, remainder });
    const next = {
      remainder, quotient,
      x: previous.x - quotient * current.x,
      y: previous.y - quotient * current.y
    };
    rows.push(next);
    previous = current;
    current = next;
  }
  const gcd = previous.remainder;
  return {
    a, b, gcd, lcm: gcd === 0n ? 0n : absolute((a / gcd) * b),
    x: gcd === 0n ? 0n : previous.x, y: gcd === 0n ? 0n : previous.y,
    rows, divisions
  };
}

export interface BackSubstitution {
  replaced: number | null;
  terms: { index: number; coefficient: bigint }[];
}

/** Eliminate R_k using R_k = R_(k-2) - q_k R_(k-1). */
export function backSubstitutions(result: EuclidResult): BackSubstitution[] {
  if (result.gcd === 0n) { return []; }
  const last = result.rows.length - 2;
  const coefficients = new Map<number, bigint>([[last, 1n]]);
  const snapshot = (replaced: number | null): BackSubstitution => ({
    replaced,
    terms: Array.from(coefficients, ([index, coefficient]) => ({ index, coefficient }))
      .filter(term => term.coefficient !== 0n).sort((a, b) => a.index - b.index)
  });
  const steps = [snapshot(null)];
  for (let k = last; k >= 2; k--) {
    const coefficient = coefficients.get(k) ?? 0n;
    coefficients.delete(k);
    coefficients.set(k - 2, (coefficients.get(k - 2) ?? 0n) + coefficient);
    coefficients.set(k - 1, (coefficients.get(k - 1) ?? 0n) - coefficient * result.rows[k].quotient!);
    steps.push(snapshot(k));
  }
  return steps;
}
