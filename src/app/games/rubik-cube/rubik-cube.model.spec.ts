import { FACES, Move, RubikCubeModel } from './rubik-cube.model';
describe('Exact Rubik cube mechanics', () => {
  const snapshot = (m: RubikCubeModel) => JSON.stringify(m.cubies);
  it('has 26 cubies, 54 stickers and nine pieces per face', () => {
    const cube = new RubikCubeModel();
    expect(cube.cubies.length).toBe(26);
    expect(cube.correctStickers).toBe(54);
    expect(cube.solved).toBe(true);
    expect(cube.cubies.reduce((n, c) => n + c.stickers.length, 0)).toBe(54);
    FACES.forEach((f) =>
      expect(cube.layer({ face: f.face, inverse: false }).length).toBe(9),
    );
  });
  it('restores orientation and position with four turns or an inverse', () => {
    for (const f of FACES) {
      const cube = new RubikCubeModel(),
        initial = snapshot(cube);
      cube.turn({ face: f.face, inverse: false });
      expect(cube.solved).toBe(false);
      cube.turn({ face: f.face, inverse: true });
      expect(snapshot(cube)).toBe(initial);
      for (let i = 0; i < 4; i++) cube.turn({ face: f.face, inverse: false });
      expect(snapshot(cube)).toBe(initial);
    }
  });
  it('uses clockwise notation viewed from outside', () => {
    const cube = new RubikCubeModel(),
      c = cube.cubies.find((c) => c.position.join(',') === '1,1,1')!;
    cube.turn({ face: 'R', inverse: false });
    expect(c.position).toEqual([1, 1, -1]);
    const front = cube.cubies.find((c) => c.position.join(',') === '-1,1,1')!;
    cube.turn({ face: 'F', inverse: false });
    expect(front.position).toEqual([1, 1, 1]);
  });
  it('preserves the lattice and stickers through 500 moves and their inverses', () => {
    const cube = new RubikCubeModel(),
      original = snapshot(cube),
      moves: Move[] = [];
    let seed = 1729;
    for (let i = 0; i < 500; i++) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      const move = { face: FACES[seed % 6].face, inverse: !!(seed & 128) };
      moves.push(move);
      cube.turn(move);
      expect(new Set(cube.cubies.map((c) => c.position.join(','))).size).toBe(
        26,
      );
      for (const c of cube.cubies) {
        expect(
          c.position.every((n) => Number.isInteger(n) && Math.abs(n) <= 1),
        ).toBe(true);
        for (const s of c.stickers) {
          expect(s.normal.reduce((n, v) => n + Math.abs(v), 0)).toBe(1);
          expect(s.normal.reduce((n, v, k) => n + v * c.position[k], 0)).toBe(
            1,
          );
        }
        const [a, b, d] = c.basis;
        const det =
          a[0] * (b[1] * d[2] - b[2] * d[1]) -
          b[0] * (a[1] * d[2] - a[2] * d[1]) +
          d[0] * (a[1] * b[2] - a[2] * b[1]);
        expect(det).toBe(1);
      }
    }
    moves
      .reverse()
      .forEach((m) => cube.turn({ face: m.face, inverse: !m.inverse }));
    expect(snapshot(cube)).toBe(original);
    expect(cube.solved).toBe(true);
  });
  it('restores the cube with six repetitions of R U R′ U′', () => {
    const cube = new RubikCubeModel(),
      initial = snapshot(cube);
    for (let i = 0; i < 6; i++)
      for (const move of [
        { face: 'R', inverse: false },
        { face: 'U', inverse: false },
        { face: 'R', inverse: true },
        { face: 'U', inverse: true },
      ] as Move[])
        cube.turn(move);
    expect(snapshot(cube)).toBe(initial);
  });
});
