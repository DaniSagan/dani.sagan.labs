import {
  cell,
  differences,
  evolve,
  frequencies,
  reflectedRule,
  ruleBit,
  singleSeed,
} from './cellular-automata.math';

describe('Elementary cellular automata mathematics', () => {
  it('encodes the eight Rule 30 outputs in descending neighborhood order', () => {
    expect([7, 6, 5, 4, 3, 2, 1, 0].map((n) => ruleBit(30, n)).join('')).toBe(
      '00011110',
    );
  });
  it('matches the Boolean expression for all eight Rule 30 neighborhoods', () => {
    for (let n = 0; n < 8; n++)
      expect(ruleBit(30, n)).toBe((n >>> 2) ^ (((n >>> 1) & 1) | (n & 1)));
  });
  it('evolves Rule 30 simultaneously without mutating the seed', () => {
    const initial = singleSeed(9);
    const rows = evolve(30, initial, 3, 'fixed');
    expect(rows.map((row) => Array.from(row).join(''))).toEqual([
      '000010000',
      '000111000',
      '001100100',
      '011011110',
    ]);
    expect(Array.from(initial).join('')).toBe('000010000');
    rows[0][0] = 1;
    expect(initial[0]).toBe(0);
  });
  it('reads fixed ghosts as zero and wraps both sides of periodic rows', () => {
    const row = new Uint8Array([1, 0, 0]);
    expect(cell(row, -1, 'fixed')).toBe(0);
    expect(cell(row, 3, 'periodic')).toBe(1);
    expect(cell(row, -3, 'periodic')).toBe(1);
    expect(Array.from(evolve(90, row, 1, 'fixed')[1])).toEqual([0, 1, 0]);
    expect(Array.from(evolve(90, row, 1, 'periodic')[1])).toEqual([0, 1, 1]);
    expect(
      Array.from(evolve(90, new Uint8Array([1]), 1, 'periodic')[1]),
    ).toEqual([0]);
  });
  it('uses the correct lookup for every rule and every neighborhood', () => {
    for (let rule = 0; rule < 256; rule++) {
      for (let n = 0; n < 8; n++) {
        const seed = new Uint8Array([n >>> 2, (n >>> 1) & 1, n & 1]);
        expect(evolve(rule, seed, 1, 'fixed')[1][1]).toBe(
          Math.floor(rule / 2 ** n) % 2,
        );
      }
    }
  });
  it('Rule 90 gives the parities of Pascal coefficients at the reachable positions', () => {
    const rows = evolve(90, singleSeed(41), 16, 'fixed');
    let pascal = [1];
    for (let t = 0; t <= 16; t++) {
      const expected = new Uint8Array(41);
      pascal.forEach((value, j) => (expected[20 - t + 2 * j] = value % 2));
      expect(Array.from(rows[t])).toEqual(Array.from(expected));
      pascal = Array.from(
        { length: pascal.length + 1 },
        (_, j) => (pascal[j - 1] ?? 0) + (pascal[j] ?? 0),
      );
    }
  });
  it('Rule 184 is simultaneous rightward traffic and conserves cars on a ring', () => {
    for (let mask = 0; mask < 256; mask++) {
      const initial = new Uint8Array(
        Array.from({ length: 8 }, (_, i) => (mask >>> i) & 1),
      );
      const expected = new Uint8Array(8);
      for (let i = 0; i < 8; i++)
        if (initial[i]) expected[initial[(i + 1) % 8] ? i : (i + 1) % 8] = 1;
      const rows = evolve(184, initial, 12, 'periodic');
      expect(Array.from(rows[1])).toEqual(Array.from(expected));
      for (const row of rows)
        expect(row.reduce((a, b) => a + b, 0)).toBe(
          initial.reduce((a, b) => a + b, 0),
        );
    }
  });
  it('reflecting both rule and seed reflects the entire evolution for all rules', () => {
    const initial = new Uint8Array([1, 0, 1, 1, 0, 0, 0]);
    expect(reflectedRule(30)).toBe(86);
    for (let rule = 0; rule < 256; rule++) {
      expect(reflectedRule(reflectedRule(rule))).toBe(rule);
      for (const boundary of ['fixed', 'periodic'] as const) {
        const a = evolve(rule, initial, 10, boundary);
        const b = evolve(
          reflectedRule(rule),
          initial.slice().reverse(),
          10,
          boundary,
        );
        a.forEach((row, t) =>
          expect(Array.from(row).reverse()).toEqual(Array.from(b[t])),
        );
      }
    }
  });
  it('a perturbation cannot travel faster than one cell per step', () => {
    const initial = singleSeed(41);
    const changed = initial.slice();
    changed[21] ^= 1;
    const diff = differences(
      evolve(30, initial, 15, 'fixed'),
      evolve(30, changed, 15, 'fixed'),
    );
    expect(diff[0].reduce((a, b) => a + b, 0)).toBe(1);
    diff.forEach((row, t) =>
      row.forEach((bit, i) => {
        if (Math.abs(i - 21) > t) expect(bit).toBe(0);
      }),
    );
    expect(() => differences(diff, [])).toThrowError(RangeError);
  });
  it('counts overlapping blocks with their actual denominator', () => {
    expect(frequencies([0, 1, 0, 1, 0], 2).map((item) => item.count)).toEqual([
      0, 2, 2, 0,
    ]);
    expect(frequencies([0, 1, 0, 1, 0], 2).map((item) => item.percent)).toEqual(
      [0, 50, 50, 0],
    );
    expect(frequencies([1, 1, 1, 1], 3)[7].count).toBe(2);
    expect(
      frequencies([1], 2).every(
        (item) => item.count === 0 && item.percent === 0,
      ),
    ).toBeTrue();
    expect(frequencies([], 1).every((item) => item.percent === 0)).toBeTrue();
  });
  it('handles empty evolution, blank states and the maximum supported grid', () => {
    expect(evolve(30, singleSeed(3), 0, 'fixed').length).toBe(1);
    expect(
      evolve(30, new Uint8Array(10), 20, 'fixed').every((row) =>
        row.every((bit) => bit === 0),
      ),
    ).toBeTrue();
    expect(
      evolve(0, singleSeed(9), 5, 'fixed')
        .slice(1)
        .every((row) => row.every((bit) => bit === 0)),
    ).toBeTrue();
    expect(
      evolve(255, new Uint8Array(9), 5, 'fixed')
        .slice(1)
        .every((row) => row.every((bit) => bit === 1)),
    ).toBeTrue();
    const maximum = evolve(30, singleSeed(401), 500, 'periodic');
    expect(maximum.length).toBe(501);
    expect(maximum[500].length).toBe(401);
  });
  it('rejects noninteger, nonbinary and unbounded inputs', () => {
    for (const rule of [-1, 256, 3.5, NaN, Infinity])
      expect(() => evolve(rule, singleSeed(3), 1, 'fixed')).toThrowError(
        RangeError,
      );
    for (const count of [-1, 501, 1.5, NaN])
      expect(() => evolve(30, singleSeed(3), count, 'fixed')).toThrowError(
        RangeError,
      );
    expect(() => evolve(30, new Uint8Array([2]), 1, 'fixed')).toThrowError(
      RangeError,
    );
    expect(() => singleSeed(402)).toThrowError(RangeError);
    expect(() => singleSeed(0)).toThrowError(RangeError);
    expect(() => frequencies([2], 2)).toThrowError(RangeError);
    expect(() => frequencies([0], 4)).toThrowError(RangeError);
  });
});
