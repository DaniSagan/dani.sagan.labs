/** Exact counterpart for quadratic irrationals and large Diophantine solutions. */
export function exactConvergents(coefficients: readonly bigint[]) {
  let previousP = 1n,
    olderP = 0n,
    previousQ = 0n,
    olderQ = 1n;
  return coefficients.map((a, index) => {
    if (a < 0n || (index > 0 && a === 0n)) {
      throw new RangeError('Coeficiente no válido.');
    }
    const p = a * previousP + olderP,
      q = a * previousQ + olderQ;
    olderP = previousP;
    previousP = p;
    olderQ = previousQ;
    previousQ = q;
    return { index, a, p, q };
  });
}

export function convergents(coefficients: readonly number[]) {
  let previousP = 1,
    olderP = 0,
    previousQ = 0,
    olderQ = 1;
  return coefficients.map((a) => {
    const p = a * previousP + olderP;
    const q = a * previousQ + olderQ;
    olderP = previousP;
    previousP = p;
    olderQ = previousQ;
    previousQ = q;
    return { a, p, q, value: p / q };
  });
}

export function euclideanSteps(numerator: number, denominator: number) {
  if (
    ![numerator, denominator].every(
      (n) => Number.isInteger(n) && n >= 1 && n <= 100,
    )
  ) {
    throw new RangeError('Introduce enteros entre 1 y 100.');
  }
  const steps: {
    dividend: number;
    divisor: number;
    quotient: number;
    remainder: number;
  }[] = [];
  while (denominator !== 0) {
    const quotient = Math.floor(numerator / denominator);
    const remainder = numerator % denominator;
    steps.push({
      dividend: numerator,
      divisor: denominator,
      quotient,
      remainder,
    });
    numerator = denominator;
    denominator = remainder;
  }
  return steps;
}
