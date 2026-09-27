import { euclid } from '../euclid/euclid.math';
import { modularPower, modulo } from '../modular/modular.math';
import { mergeCongruences, solveCongruences, satisfies } from './crt.math';

describe('General Chinese remainder theorem', () => {
  const solve = (rows: number[][]) =>
    solveCongruences(
      rows.map(([a, m]) => ({ residue: BigInt(a), modulus: BigInt(m) })),
    );
  it('constructs the classical example and verifies every selector', () => {
    const result = solve([
      [2, 3],
      [3, 5],
      [2, 7],
    ]);
    expect(result.solution).toEqual({ residue: 23n, modulus: 105n });
    expect(result.sum).toBe(233n);
    expect(result.selectors.map((s) => s.value)).toEqual([70n, 21n, 15n]);
    result.selectors.forEach((s, i) =>
      expect(s.residues).toEqual(
        [0n, 0n, 0n].map((_, j) => (i === j ? 1n : 0n)),
      ),
    );
  });
  it('uses the lcm for compatible noncoprime modules', () => {
    const result = solve([
      [2, 6],
      [5, 9],
    ]);
    expect(result.coprime).toBeFalse();
    expect(result.solution).toEqual({ residue: 14n, modulus: 18n });
    expect(result.selectors).toEqual([]);
    expect(satisfies(32n, result.equations)).toBeTrue();
  });
  it('provides incompatibility certificates, including nonadjacent rows', () => {
    expect(
      solve([
        [0, 2],
        [1, 4],
      ]).solution,
    ).toBeNull();
    const result = solve([
      [0, 2],
      [0, 3],
      [1, 4],
    ]);
    expect(result.solution).toBeNull();
    expect(
      result.pairs.find((p) => p.i === 0 && p.j === 2)?.compatible,
    ).toBeFalse();
    expect(
      result.pairs.filter((p) => p.j === p.i + 1).every((p) => p.compatible),
    ).toBeTrue();
  });
  it('normalizes negatives and large residues, without mutating the input', () => {
    const input = [
      { residue: -1n, modulus: 4n },
      { residue: 13n, modulus: 6n },
      { residue: 7n, modulus: 12n },
    ];
    const result = solveCongruences(input);
    expect(result.equations.map((row) => row.residue)).toEqual([3n, 1n, 7n]);
    expect(result.solution).toEqual({ residue: 7n, modulus: 12n });
    expect(input[0].residue).toBe(-1n);
    expect(result.steps[1].parameter).toBe(0n);
    expect(
      solve([
        [-1, 4],
        [13, 6],
        [1, 12],
      ]).solution,
    ).toBeNull();
  });
  it('handles repeated, dividing and unit moduli', () => {
    expect(
      solve([
        [2, 6],
        [8, 6],
        [2, 3],
      ]).solution,
    ).toEqual({ residue: 2n, modulus: 6n });
    expect(
      solve([
        [2, 6],
        [3, 6],
      ]).solution,
    ).toBeNull();
    expect(
      solve([
        [100, 1],
        [-2, 1],
      ]).solution,
    ).toEqual({ residue: 0n, modulus: 1n });
    const result = solve([
      [100, 1],
      [2, 3],
    ]);
    expect(result.solution).toEqual({ residue: 2n, modulus: 3n });
    expect(modulo(result.sum, result.product)).toBe(2n);
  });
  it('agrees with exhaustive enumeration of all two-row systems with small moduli', () => {
    for (let m = 1; m <= 9; m++) {
      for (let n = 1; n <= 9; n++) {
        const lcm = Number(euclid(BigInt(m), BigInt(n)).lcm);
        for (let a = -m; a < m; a++) {
          for (let b = -n; b < n; b++) {
            const result = solve([
              [a, m],
              [b, n],
            ]);
            const candidates = Array.from({ length: lcm }, (_, x) => x).filter(
              (x) => (x - a) % m === 0 && (x - b) % n === 0,
            );
            if (!candidates.length) {
              expect(result.solution).toBeNull();
            } else {
              expect(result.solution).toEqual({
                residue: BigInt(candidates[0]),
                modulus: BigInt(lcm),
              });
              expect(candidates.length).toBe(1);
            }
          }
        }
      }
    }
  });
  it('agrees with exhaustive enumeration and pair compatibility for three rows', () => {
    for (const moduli of [
      [4, 6, 9],
      [6, 10, 15],
      [2, 3, 4],
      [1, 4, 4],
    ]) {
      const lcm = moduli.reduce(
        (l, m) => Number(euclid(BigInt(l), BigInt(m)).lcm),
        1,
      );
      for (let a = 0; a < moduli[0]; a++)
        for (let b = 0; b < moduli[1]; b++)
          for (let c = 0; c < moduli[2]; c++) {
            const rows = moduli.map((m, i) => [[a, b, c][i], m]);
            const result = solve(rows);
            const expected = Array.from({ length: lcm }, (_, x) => x).filter(
              (x) => rows.every(([r, m]) => (x - r) % m === 0),
            );
            expect(!!result.solution).toBe(
              result.pairs.every((p) => p.compatible),
            );
            expect(result.solution?.residue ?? null).toBe(
              expected.length ? BigInt(expected[0]) : null,
            );
          }
    }
  });
  it('keeps exact products beyond Number precision and is independent of row order', () => {
    const x = -987654321012345678901234567890n;
    const rows = [
      999999999999999989n,
      100000000000000003n,
      97n,
      49n,
      12n,
      25n,
    ].map((modulus) => ({ residue: x, modulus }));
    const result = solveCongruences(rows);
    expect(
      result.solution!.modulus > BigInt(Number.MAX_SAFE_INTEGER),
    ).toBeTrue();
    expect(satisfies(result.solution!.residue, rows)).toBeTrue();
    expect(modulo(x, result.solution!.modulus)).toBe(result.solution!.residue);
    expect(solveCongruences([...rows].reverse()).solution).toEqual(
      result.solution,
    );
    result.steps.forEach((s) =>
      expect(s.u * s.left.modulus + s.v * s.right.modulus).toBe(s.gcd),
    );
  });
  it('verifies article applications and complete solution classes', () => {
    expect(
      solve([
        [1, 7],
        [4, 10],
      ]).solution,
    ).toEqual({ residue: 64n, modulus: 70n });
    expect(
      solve([
        [1, 4],
        [2, 5],
        [3, 7],
      ]).solution,
    ).toEqual({ residue: 17n, modulus: 140n });
    expect(modularPower(3n, 100n, 100n).value).toBe(1n);
    const result = solve([
      [2, 3],
      [3, 5],
    ]);
    expect(
      [-22n, -7n, 8n, 23n, 38n].every((x) => satisfies(x, result.equations)),
    ).toBeTrue();
  });
  it('rejects empty systems and nonpositive moduli', () => {
    expect(() => solveCongruences([])).toThrowError(RangeError);
    expect(() => solve([[1, 0]])).toThrowError(RangeError);
    expect(() =>
      mergeCongruences(
        { residue: 0n, modulus: -2n },
        { residue: 1n, modulus: 3n },
      ),
    ).toThrowError(RangeError);
  });
});
