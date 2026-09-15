export type Vector4D = [number, number, number, number];
export const ROTATION_PLANES: [number, number][] = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];
export const TESSERACT_VERTICES: Vector4D[] = Array.from({ length: 16 }, (_, i) =>
  [0, 1, 2, 3].map(axis => (i & (1 << axis)) ? 1 : -1) as Vector4D);
export const TESSERACT_EDGES: [number, number][] = TESSERACT_VERTICES.flatMap((_, i) =>
  [0, 1, 2, 3].filter(axis => !(i & (1 << axis))).map(axis => [i, i | (1 << axis)] as [number, number]));
export const TESSERACT_FACES: number[][] = ROTATION_PLANES.flatMap(([a, b]) =>
  Array.from({ length: 16 }, (_, i) => i).filter(i => !(i & (1 << a)) && !(i & (1 << b)))
    .map(i => [i, i | (1 << a), i | (1 << a) | (1 << b), i | (1 << b)]));
export const TESSERACT_CELLS = [0, 1, 2, 3].flatMap(axis => [-1, 1].map(sign => ({
  axis, sign, label: `${'xyzw'[axis]} = ${sign > 0 ? '+' : '−'}1`,
  vertices: TESSERACT_VERTICES.map((v, i) => v[axis] === sign ? i : -1).filter(i => i >= 0)
})));

/** Angles in radians; rotations are applied in the displayed plane order. */
export function rotate4D(vertex: Vector4D, angles: readonly number[]): Vector4D {
  const result = [...vertex] as Vector4D;
  ROTATION_PLANES.forEach(([a, b], i) => {
    const c = Math.cos(angles[i] || 0), s = Math.sin(angles[i] || 0);
    const x = result[a], y = result[b];
    result[a] = c * x - s * y;
    result[b] = s * x + c * y;
  });
  return result;
}

export function project4D(v: Vector4D, distance = 4, perspective = true): [number, number, number] {
  if (perspective && distance <= 2) throw new RangeError('La distancia debe superar el radio 4D del teseracto (2).');
  const scale = perspective ? distance / (distance - v[3]) : 1;
  return [v[0] * scale, v[1] * scale, v[2] * scale];
}

/** Vertices of the convex intersection with the hyperplane w = offset. */
export function sliceTesseract(vertices: Vector4D[], offset: number): [number, number, number][] {
  const points: [number, number, number][] = [];
  const add = (p: [number, number, number]) => {
    if (!points.some(q => Math.hypot(...q.map((x, i) => x - p[i])) < 1e-8)) points.push(p);
  };
  for (const [a, b] of TESSERACT_EDGES) {
    const p = vertices[a], q = vertices[b];
    const da = p[3] - offset, db = q[3] - offset;
    if (Math.abs(da) < 1e-9) add([p[0], p[1], p[2]]);
    if (Math.abs(db) < 1e-9) add([q[0], q[1], q[2]]);
    if (da * db < 0) {
      const t = -da / (db - da);
      add([0, 1, 2].map(i => p[i] + t * (q[i] - p[i])) as [number, number, number]);
    }
  }
  return points;
}

export function hasSpatialVolume(points: [number, number, number][]): boolean {
  if (points.length < 4) return false;
  const a = points[0];
  for (let i = 1; i < points.length - 2; i++) {
    const u = points[i].map((x, k) => x - a[k]);
    for (let j = i + 1; j < points.length - 1; j++) {
      const v = points[j].map((x, k) => x - a[k]);
      const cross = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
      for (let k = j + 1; k < points.length; k++) {
        if (Math.abs(cross.reduce((sum, x, n) => sum + x * (points[k][n] - a[n]), 0)) > 1e-8) return true;
      }
    }
  }
  return false;
}
