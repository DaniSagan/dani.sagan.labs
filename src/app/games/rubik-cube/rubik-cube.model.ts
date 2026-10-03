export type Face = 'R' | 'L' | 'U' | 'D' | 'F' | 'B';
export type Vector = [number, number, number];
export interface Move {
  face: Face;
  inverse: boolean;
}
export interface Cubie {
  id: number;
  position: Vector;
  basis: [Vector, Vector, Vector];
  stickers: { normal: Vector; face: Face }[];
}
export const FACES: {
  face: Face;
  axis: 0 | 1 | 2;
  layer: number;
  name: string;
  color: string;
}[] = [
  { face: 'U', axis: 1, layer: 1, name: 'Superior', color: '#f2f5f8' },
  { face: 'R', axis: 0, layer: 1, name: 'Derecha', color: '#dc1934' },
  { face: 'F', axis: 2, layer: 1, name: 'Frontal', color: '#00a96c' },
  { face: 'D', axis: 1, layer: -1, name: 'Inferior', color: '#ffea00' },
  { face: 'L', axis: 0, layer: -1, name: 'Izquierda', color: '#cc5000' },
  { face: 'B', axis: 2, layer: -1, name: 'Trasera', color: '#328bff' },
];
export const notation = (move: Move) => move.face + (move.inverse ? '′' : '');
export function rotateVector(
  v: Vector,
  axis: number,
  direction: number,
): Vector {
  const [x, y, z] = v;
  if (axis === 0) return [x, -direction * z, direction * y];
  if (axis === 1) return [direction * z, y, -direction * x];
  return [-direction * y, direction * x, z];
}
export class RubikCubeModel {
  cubies: Cubie[] = [];
  constructor() {
    this.reset();
  }
  reset(): void {
    this.cubies = [];
    for (let x = -1; x <= 1; x++)
      for (let y = -1; y <= 1; y++)
        for (let z = -1; z <= 1; z++) {
          if (!x && !y && !z) continue;
          const position: Vector = [x, y, z];
          const stickers = FACES.filter(
            (f) => position[f.axis] === f.layer,
          ).map((f) => {
            const normal: Vector = [0, 0, 0];
            normal[f.axis] = f.layer;
            return { normal, face: f.face };
          });
          this.cubies.push({
            id: this.cubies.length,
            position,
            basis: [
              [1, 0, 0],
              [0, 1, 0],
              [0, 0, 1],
            ],
            stickers,
          });
        }
  }
  layer(move: Move): Cubie[] {
    const face = FACES.find((f) => f.face === move.face)!;
    return this.cubies.filter((c) => c.position[face.axis] === face.layer);
  }
  turn(move: Move): void {
    const face = FACES.find((f) => f.face === move.face)!;
    // Clockwise when looking straight at the chosen face from outside.
    const direction = -face.layer * (move.inverse ? -1 : 1);
    for (const c of this.layer(move)) {
      c.position = rotateVector(c.position, face.axis, direction);
      c.basis = c.basis.map((v) =>
        rotateVector(v, face.axis, direction),
      ) as Cubie['basis'];
      c.stickers.forEach(
        (s) => (s.normal = rotateVector(s.normal, face.axis, direction)),
      );
    }
  }
  get solved(): boolean {
    return this.cubies.every((c) =>
      c.stickers.every((s) => {
        const f = FACES.find((f) => f.face === s.face)!;
        return s.normal[f.axis] === f.layer;
      }),
    );
  }
  get correctStickers(): number {
    return this.cubies.reduce(
      (n, c) =>
        n +
        c.stickers.filter(
          (s) =>
            s.normal[FACES.find((f) => f.face === s.face)!.axis] ===
            FACES.find((f) => f.face === s.face)!.layer,
        ).length,
      0,
    );
  }
}
