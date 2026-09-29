import {
  affineRange,
  allowed,
  ceilDivide,
  floorDivide,
  parameterRange,
  parameterSamples,
  rangeCount,
  solutionAt,
  solveDiophantine,
  SolutionConstraints,
} from './diophantine.math';

const box = (min: bigint, max: bigint): SolutionConstraints => ({
  x: { min, max },
  y: { min, max },
});

describe('Linear Diophantine arithmetic', () => {
  for (const [a, b, c] of [
    [84n, 30n, 6n],
    [35n, 22n, 3n],
    [-4n, 6n, -2n],
    [4n, -6n, 2n],
    [-4n, -6n, -2n],
    [6n, 9n, 0n],
    [0n, -5n, 10n],
    [-4n, 0n, 12n],
    [999999999999999989n, 999999999999999983n, -999999999999999999n],
  ]) {
    it(
      'constructs and verifies every sampled solution of ' +
        [a, b, c].join(','),
      () => {
        const r = solveDiophantine(a, b, c);
        expect(r.kind).toBe('line');
        expect(a * r.euclid.x + b * r.euclid.y).toBe(r.euclid.gcd);
        expect(r.particular!.x).toBe(r.euclid.x * r.scale!);
        for (const t of [-10000000000000000000n, -2n, 0n, 1n, 99n]) {
          const p = solutionAt(r, t);
          expect(a * p.x + b * p.y).toBe(c);
        }
      },
    );
  }
  it('rejects impossible and treats both-zero coefficients separately', () => {
    for (const [a, b, c] of [
      [4n, 6n, 5n],
      [0n, 5n, 3n],
      [5n, 0n, 3n],
      [0n, 0n, 1n],
    ]) {
      const r = solveDiophantine(a, b, c);
      expect(r.kind).toBe('none');
      expect(r.particular).toBeNull();
      expect(() => solutionAt(r, 0n)).toThrow();
    }
    const plane = solveDiophantine(0n, 0n, 0n);
    expect(plane.kind).toBe('plane');
    expect(plane.direction).toBeNull();
    expect(() => parameterRange(plane, box(0n, 3n))).toThrow();
  });
  it('uses mathematical floor and ceiling for every sign combination', () => {
    for (let a = -20; a <= 20; a++) {
      for (let b = -9; b <= 9; b++) {
        if (b) {
          expect(floorDivide(BigInt(a), BigInt(b))).toBe(
            BigInt(Math.floor(a / b)),
          );
          expect(ceilDivide(BigInt(a), BigInt(b))).toBe(
            BigInt(Math.ceil(a / b)),
          );
        }
      }
    }
    expect(() => floorDivide(1n, 0n)).toThrow();
  });
  it('does not lose or add solutions in an exhaustive small integer grid', () => {
    const constraints = box(-5n, 5n);
    for (let a = -5n; a <= 5n; a++) {
      for (let b = -5n; b <= 5n; b++) {
        if (a === 0n && b === 0n) {
          continue;
        }
        for (let c = -10n; c <= 10n; c++) {
          const r = solveDiophantine(a, b, c);
          let count = 0n;
          for (let x = -5n; x <= 5n; x++) {
            for (let y = -5n; y <= 5n; y++) {
              if (a * x + b * y === c) {
                count++;
                expect(r.kind).toBe('line');
                const step = r.direction!,
                  p = r.particular!;
                const t =
                  step.x !== 0n ? (x - p.x) / step.x : (y - p.y) / step.y;
                expect(solutionAt(r, t)).toEqual({ x, y });
              }
            }
          }
          if (r.kind === 'none') {
            expect(count).toBe(0n);
          } else {
            const range = parameterRange(r, constraints);
            expect(rangeCount(range)).toBe(count);
            for (const t of parameterSamples(range, 0n)) {
              expect(allowed(solutionAt(r, t), constraints)).toBeTrue();
            }
          }
        }
      }
    }
  });
  it('counts the article examples with positive, nonnegative and finite bounds', () => {
    const r = solveDiophantine(3n, 5n, 30n);
    expect(
      rangeCount(
        parameterRange(r, {
          x: { min: 0n, max: null },
          y: { min: 0n, max: null },
        }),
      ),
    ).toBe(3n);
    expect(
      rangeCount(
        parameterRange(r, {
          x: { min: 1n, max: null },
          y: { min: 1n, max: null },
        }),
      ),
    ).toBe(1n);
    expect(
      rangeCount(
        parameterRange(solveDiophantine(84n, 30n, 6n), {
          x: { min: 0n, max: null },
          y: { min: 0n, max: null },
        }),
      ),
    ).toBe(0n);
    expect(
      rangeCount(
        parameterRange(solveDiophantine(84n, 30n, 6n), {
          x: { min: -6n, max: 9n },
          y: { min: -25n, max: 17n },
        }),
      ),
    ).toBe(4n);
    expect(
      rangeCount(
        parameterRange(solveDiophantine(3n, 5n, 31n), {
          x: { min: 1n, max: null },
          y: { min: 1n, max: null },
        }),
      ),
    ).toBe(2n);
    expect(
      rangeCount(parameterRange(solveDiophantine(5n, 7n, 43n), box(0n, 43n))),
    ).toBe(1n);
    expect(
      rangeCount(parameterRange(solveDiophantine(6n, 9n, 60n), box(0n, 60n))),
    ).toBe(4n);
  });
  it('handles constant coordinates, half-lines and impossible restrictions', () => {
    expect(affineRange(3n, 0n, { min: 0n, max: 4n })).toEqual({
      min: null,
      max: null,
      empty: false,
    });
    expect(affineRange(3n, 0n, { min: 4n, max: null }).empty).toBeTrue();
    expect(affineRange(3n, -2n, { min: 0n, max: null })).toEqual({
      min: null,
      max: 1n,
      empty: false,
    });
    expect(
      rangeCount(
        parameterRange(solveDiophantine(-4n, 6n, -2n), {
          x: { min: 1n, max: null },
          y: { min: 1n, max: null },
        }),
      ),
    ).toBeNull();
    expect(
      rangeCount(
        parameterRange(solveDiophantine(0n, -5n, 10n), {
          x: { min: 0n, max: null },
          y: { min: 0n, max: null },
        }),
      ),
    ).toBe(0n);
    expect(() => affineRange(0n, 1n, { min: 2n, max: 1n })).toThrow();
  });
  it('samples enormous and unbounded intervals without enumerating them', () => {
    expect(
      parameterSamples(
        { min: 2n, max: 4n, empty: false },
        100000000000000000000n,
      ),
    ).toEqual([2n, 3n, 4n]);
    expect(
      parameterSamples(
        { min: 2n, max: 4n, empty: false },
        -100000000000000000000n,
      ),
    ).toEqual([2n, 3n, 4n]);
    expect(
      parameterSamples({ min: null, max: null, empty: false }, 0n),
    ).toEqual([-4n, -3n, -2n, -1n, 0n, 1n, 2n, 3n, 4n]);
    expect(
      parameterSamples({ min: null, max: 0n, empty: false }, 100n),
    ).toEqual([-8n, -7n, -6n, -5n, -4n, -3n, -2n, -1n, 0n]);
    expect(parameterSamples({ min: null, max: null, empty: true }, 0n)).toEqual(
      [],
    );
    expect(() =>
      parameterSamples({ min: null, max: null, empty: false }, 0n, 1000),
    ).toThrow();
  });
});
