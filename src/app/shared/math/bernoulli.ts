export interface BernoulliFraction { numerator: bigint; denominator: bigint; }
export const MAX_BERNOULLI_INDEX = 200;

function reduce(numerator: bigint, denominator: bigint): BernoulliFraction {
  let a = numerator < 0n ? -numerator : numerator;
  let b = denominator;
  while (b !== 0n) { const remainder = a % b; a = b; b = remainder; }
  return { numerator: numerator / a, denominator: denominator / a };
}

/** Exact recurrence with the convention B1 = -1/2. */
export function bernoulliNumbers(n: number): BernoulliFraction[] {
  if (!Number.isInteger(n) || n < 0 || n > MAX_BERNOULLI_INDEX) {
    throw new Error(`Introduce un índice entero entre 0 y ${MAX_BERNOULLI_INDEX}.`);
  }
  const values: BernoulliFraction[] = [{ numerator: 1n, denominator: 1n }];
  for (let m = 1; m <= n; m++) {
    if (m > 1 && m % 2 !== 0) { values.push({ numerator: 0n, denominator: 1n }); continue; }
    let sum: BernoulliFraction = { numerator: 0n, denominator: 1n };
    let binomial = 1n;
    for (let k = 0; k < m; k++) {
      const value = values[k];
      sum = reduce(sum.numerator * value.denominator + binomial * value.numerator * sum.denominator,
        sum.denominator * value.denominator);
      binomial = binomial * BigInt(m + 1 - k) / BigInt(k + 1);
    }
    values.push(reduce(-sum.numerator, sum.denominator * BigInt(m + 1)));
  }
  return values;
}

export function formatBernoulli(value: BernoulliFraction): string {
  return value.denominator === 1n ? value.numerator.toString() : `${value.numerator} / ${value.denominator}`;
}
