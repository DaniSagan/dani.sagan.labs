import {
  Bit,
  closedRegions,
  periodicBits,
  randomBits,
  regionColors,
  stitches,
} from './hitomezashi.math';

describe('Hitomezashi mathematics', () => {
  it('changes region color across stitches and preserves it across every gap', () => {
    for (let n = 4; n <= 9; n++)
      for (let seed = 0; seed < 30; seed++) {
        const rows = randomBits(seed, n + 1),
          columns = randomBits(seed + 30, n + 1);
        const colors = regionColors(rows, columns);
        for (let y = 0; y < n; y++)
          for (let x = 0; x < n; x++) {
            if (x > 0)
              expect(colors[y][x] !== colors[y][x - 1]).toBe(
                y % 2 === columns[x],
              );
            if (y > 0)
              expect(colors[y][x] !== colors[y - 1][x]).toBe(x % 2 === rows[y]);
          }
      }
  });
  it('repeats binary words and rejects other symbols', () => {
    expect(periodicBits('0 01', 7)).toEqual([0, 0, 1, 0, 0, 1, 0]);
    for (const bad of ['', '012', 'x', '0'.repeat(33)])
      expect(() => periodicBits(bad, 5)).toThrow();
  });
  it('reproduces random seeds without producing nonbinary values', () => {
    expect(randomBits(2026, 82)).toEqual(randomBits(2026, 82));
    expect(randomBits(0, 82)).not.toEqual(randomBits(2026, 82));
    expect(new Set(randomBits(2026, 1000))).toEqual(new Set([0, 1]));
  });
  it('changes exactly one line and leaves perpendicular stitches untouched', () => {
    const r = periodicBits('0', 21),
      c = periodicBits('01', 21);
    const before = stitches(r, c);
    r[7] = 1;
    const after = stitches(r, c);
    expect(before.length).toBe(420);
    expect(after.length).toBe(420);
    expect(before.filter((e) => !e.horizontal || e.line !== 7)).toEqual(
      after.filter((e) => !e.horizontal || e.line !== 7),
    );
    expect(
      after.filter((e) => e.horizontal && e.line === 7).map((e) => e.x),
    ).toEqual([1, 3, 5, 7, 9, 11, 13, 15, 17, 19]);
    expect(stitches(periodicBits('0', 6), periodicBits('0', 6)).length).toBe(
      36,
    );
    expect(stitches(periodicBits('1', 6), periodicBits('1', 6)).length).toBe(
      24,
    );
  });
  it('has one horizontal and one vertical at every interior vertex', () => {
    const e = stitches(randomBits(72, 21), randomBits(96, 21));
    for (let x = 1; x < 20; x++)
      for (let y = 1; y < 20; y++) {
        expect(
          e.filter(
            (s) => s.horizontal && s.y === y && (s.x === x || s.x + 1 === x),
          ).length,
        ).toBe(1);
        expect(
          e.filter(
            (s) => !s.horizontal && s.x === x && (s.y === y || s.y + 1 === y),
          ).length,
        ).toBe(1);
      }
  });
  it('counts closed regions independently of the viewport boundary', () => {
    expect(closedRegions([])).toBe(0);
    expect(closedRegions(stitches([0, 0], [0, 0]))).toBe(1);
    expect(closedRegions(stitches([0, 1], [0, 0]))).toBe(0);
    // Independent oracle: flood-fill cells across gaps, joining boundary gaps to outside.
    for (let seed = 0; seed < 100; seed++) {
      const n = 7,
        edges = stitches(
          randomBits(seed, n + 1),
          randomBits(seed + 100, n + 1),
        );
      const h = new Set(
        edges.filter((e) => e.horizontal).map((e) => `${e.x},${e.y}`),
      );
      const v = new Set(
        edges.filter((e) => !e.horizontal).map((e) => `${e.x},${e.y}`),
      );
      const seen = new Set<string>();
      let bounded = 0;
      for (let x = 0; x < n; x++)
        for (let y = 0; y < n; y++) {
          if (seen.has(`${x},${y}`)) continue;
          const stack = [[x, y]];
          let exterior = false;
          while (stack.length) {
            const [a, b] = stack.pop()!;
            if (a < 0 || b < 0 || a >= n || b >= n) {
              exterior = true;
              continue;
            }
            const key = `${a},${b}`;
            if (seen.has(key)) continue;
            seen.add(key);
            if (!h.has(`${a},${b}`)) stack.push([a, b - 1]);
            if (!h.has(`${a},${b + 1}`)) stack.push([a, b + 1]);
            if (!v.has(`${a},${b}`)) stack.push([a - 1, b]);
            if (!v.has(`${a + 1},${b}`)) stack.push([a + 1, b]);
          }
          if (!exterior) bounded++;
        }
      expect(closedRegions(edges)).toBe(bounded);
    }
  });
  it('rejects inconsistent sequences', () => {
    expect(() => stitches([0], [0])).toThrow();
    expect(() => stitches([0, 1], [0])).toThrow();
    expect(() => stitches([2 as Bit, 0], [0, 1])).toThrow();
  });
});
