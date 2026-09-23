import {
  colorConflicts,
  fourColorMap,
  kempeComponent,
  solveMap,
} from './four-color';

describe('Four-color geometry and search', () => {
  it('distinguishes positive-length boundaries from isolated point contacts', () => {
    const point = fourColorMap('point');
    expect(point.edges).toEqual([
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 3],
    ]);
    expect(fourColorMap('four').edges.length).toBe(6);
    expect(solveMap(point, 2).status).toBe('solved');
    expect(solveMap(fourColorMap('four'), 3).status).toBe('impossible');
    expect(solveMap(fourColorMap('four'), 4).status).toBe('solved');
  });
  it('partitions the rectangle and produces valid four-colorings over many seeds', () => {
    for (let seed = 1; seed <= 30; seed++) {
      const map = fourColorMap('mosaic', seed);
      const area = map.cells.reduce(
        (sum, cell) =>
          sum +
          Math.abs(
            cell.reduce((a, p, i) => {
              const q = cell[(i + 1) % cell.length];
              return a + p.x * q.y - p.y * q.x;
            }, 0),
          ) /
            2,
        0,
      );
      expect(area).toBeCloseTo(580 * 400, 5);
      expect(map.edges.length).toBeLessThanOrEqual(3 * map.sites.length - 6);
      const solution = solveMap(map, 4);
      expect(solution.status).toBe('solved');
      expect(solution.colors.every((c) => c >= 0 && c < 4)).toBeTrue();
      expect(colorConflicts(map.edges, solution.colors).length).toBe(0);
    }
  });
  it('marks a bounded unfinished search as inconclusive and logs real backtracking', () => {
    const map = fourColorMap('four');
    expect(solveMap(map, 4, 1).status).toBe('limit');
    const search = solveMap(map, 3);
    expect(
      search.frames.some((frame) => frame.message.startsWith('Retroceder')),
    ).toBeTrue();
    expect(
      search.frames.every(
        (frame) => colorConflicts(map.edges, frame.colors).length === 0,
      ),
    ).toBeTrue();
  });
  it('preserves valid colorings under every bicolor component swap', () => {
    const map = fourColorMap(),
      colors = solveMap(map, 4).colors;
    for (let a = 0; a < 4; a++)
      for (let b = a + 1; b < 4; b++)
        for (let start = 0; start < colors.length; start++) {
          const component = kempeComponent(map, colors, start, a, b);
          const swap = (values: number[]) =>
            values.map((c, i) =>
              component.includes(i) ? (c === a ? b : a) : c,
            );
          const changed = swap(colors);
          expect(colorConflicts(map.edges, changed).length).toBe(0);
          expect(swap(changed)).toEqual(colors);
        }
  });
});
