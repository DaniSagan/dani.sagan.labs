import { euclid } from '../euclid/euclid.math';
import { modulo } from '../modular/modular.math';

export interface Congruence {
  residue: bigint;
  modulus: bigint;
}
export interface PairCheck {
  i: number;
  j: number;
  gcd: bigint;
  difference: bigint;
  compatible: boolean;
}
export interface MergeStep {
  left: Congruence;
  right: Congruence;
  gcd: bigint;
  difference: bigint;
  u: bigint;
  v: bigint;
  reducedModulus: bigint;
  parameter: bigint | null;
  result: Congruence | null;
}
export interface Selector {
  partial: bigint;
  inverse: bigint;
  value: bigint;
  contribution: bigint;
  residues: bigint[];
}
export interface CrtResult {
  equations: Congruence[];
  pairs: PairCheck[];
  coprime: boolean;
  steps: MergeStep[];
  solution: Congruence | null;
  product: bigint;
  selectors: Selector[];
  sum: bigint;
}

/** Merge whole solution classes. Modulus 1 is a valid, vacuous condition. */
export function mergeCongruences(
  first: Congruence,
  second: Congruence,
): MergeStep {
  const left = {
    residue: modulo(first.residue, first.modulus),
    modulus: first.modulus,
  };
  const right = {
    residue: modulo(second.residue, second.modulus),
    modulus: second.modulus,
  };
  const certificate = euclid(left.modulus, right.modulus);
  const { gcd, x: u, y: v } = certificate;
  const difference = right.residue - left.residue;
  const reducedModulus = right.modulus / gcd;
  const parameter =
    difference % gcd === 0n
      ? modulo((difference / gcd) * u, reducedModulus)
      : null;
  const result =
    parameter === null
      ? null
      : {
          residue: modulo(
            left.residue + left.modulus * parameter,
            certificate.lcm,
          ),
          modulus: certificate.lcm,
        };
  return {
    left,
    right,
    gcd,
    difference,
    u,
    v,
    reducedModulus,
    parameter,
    result,
  };
}

export function solveCongruences(input: readonly Congruence[]): CrtResult {
  if (!input.length) {
    throw new RangeError('Introduce al menos una congruencia.');
  }
  const equations = input.map((row) => ({
    residue: modulo(row.residue, row.modulus),
    modulus: row.modulus,
  }));
  const pairs: PairCheck[] = [];
  for (let i = 0; i < equations.length; i++) {
    for (let j = i + 1; j < equations.length; j++) {
      const gcd = euclid(equations[i].modulus, equations[j].modulus).gcd;
      const difference = equations[j].residue - equations[i].residue;
      pairs.push({
        i,
        j,
        gcd,
        difference,
        compatible: difference % gcd === 0n,
      });
    }
  }
  const coprime = pairs.every((pair) => pair.gcd === 1n);
  let solution: Congruence | null = equations[0];
  const steps: MergeStep[] = [];
  for (let i = 1; i < equations.length && solution; i++) {
    const step = mergeCongruences(solution, equations[i]);
    steps.push(step);
    solution = step.result;
  }
  const product = equations.reduce((value, row) => value * row.modulus, 1n);
  const selectors: Selector[] = coprime
    ? equations.map((row) => {
        const partial = product / row.modulus;
        // Modulo 1 the sole class is both [0] and [1]; no inverse calculation is needed.
        const inverse =
          row.modulus === 1n
            ? 0n
            : modulo(euclid(partial, row.modulus).x, row.modulus);
        const value = partial * inverse;
        return {
          partial,
          inverse,
          value,
          contribution: row.residue * value,
          residues: equations.map((equation) =>
            modulo(value, equation.modulus),
          ),
        };
      })
    : [];
  return {
    equations,
    pairs,
    coprime,
    steps,
    solution,
    product,
    selectors,
    sum: selectors.reduce(
      (total, selector) => total + selector.contribution,
      0n,
    ),
  };
}

export function satisfies(
  value: bigint,
  equations: readonly Congruence[],
): boolean {
  return equations.every(
    (row) => modulo(value - row.residue, row.modulus) === 0n,
  );
}
