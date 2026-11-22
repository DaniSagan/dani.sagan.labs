import { Fixture, Point, Room } from './cad-model';
import { distance, EPS, fixtureOffset, polygonPath, signedArea, validatePolygon } from './cad-geometry';

interface Corner { incoming: Point; outgoing: Point; }
export function interiorWallFrame(room: Room, index: number) {
  const points = wallDrawing(room).innerVertices, start = points[index], end = points[(index + 1) % points.length];
  const length = distance(start, end), a = room.vertices[index], b = room.vertices[(index + 1) % points.length];
  const referenceLength = Math.max(EPS, distance(a, b));
  const ux = length > EPS ? (end.x - start.x) / length : (b.x - a.x) / referenceLength;
  const uy = length > EPS ? (end.y - start.y) / length : (b.y - a.y) / referenceLength;
  const side = Math.sign(signedArea(room.vertices)), half = room.walls[index].thickness / 2;
  return { start, end, length, ux, uy, angle: Math.atan2(uy, ux) * 180 / Math.PI,
    axisStart: { x: start.x + uy * half * side, y: start.y - ux * half * side } };
}
export function interiorWallLength(room: Room, index: number): number { return interiorWallFrame(room, index).length; }
export function interiorFixturePlan(f: Fixture, room: Room) {
  const frame = interiorWallFrame(room, room.walls.findIndex(w => w.id === f.wallId));
  const offset = fixtureOffset(f, frame.length);
  return { point: { x: frame.axisStart.x + frame.ux * offset, y: frame.axisStart.y + frame.uy * offset }, angle: frame.angle, offset };
}

/** Edit the visible segment, keeping its starting inner corner fixed. */
export function setInteriorWall(room: Room, index: number, length: number, angle: number): void {
  if (!Number.isFinite(length) || length < 0.1 || !Number.isFinite(angle)) throw Error('Longitud o ángulo inválidos.');
  if (room.walls[index].locked) throw Error('La pared está bloqueada.');
  const candidate: Room = { ...room, vertices: room.vertices.map(p => ({ ...p })) };
  const start = interiorWallFrame(room, index).start, next = (index + 1) % room.vertices.length, radians = angle * Math.PI / 180;
  const end = { x: start.x + length * Math.cos(radians), y: start.y + length * Math.sin(radians) };
  for (let iteration = 0; iteration < 32; iteration++) {
    const corners = wallDrawing(candidate).innerVertices;
    if (distance(corners[index], start) > 1e-7) moveInteriorVertex(candidate, index, start);
    if (distance(wallDrawing(candidate).innerVertices[next], end) > 1e-7) moveInteriorVertex(candidate, next, end);
    const frame = interiorWallFrame(candidate, index);
    if (distance(frame.start, start) < 1e-7 && distance(frame.end, end) < 1e-7) {
      validatePolygon(candidate.vertices);
      room.vertices = candidate.vertices.map(p => ({ ...p }));
      return;
    }
  }
  throw Error('No se puede ajustar esa longitud manteniendo la esquina inicial y un contorno válido.');
}
export interface WallDrawing {
  /** Closed outer and inner contours, to be filled with the even-odd rule. */
  band: string;
  outer: Point[];
  /** One control per reference vertex, on the rendered inner face. At a
   * bevel or thickness transition use the centre of that joining segment. */
  innerVertices: Point[];
  sections: { hit: string; faces: string }[];
}

/** Keep the other visible corners fixed and reconstruct the reference contour.
 * All inversion and validation happens on a candidate, so failures are atomic. */
export function moveInteriorVertex(room: Room, index: number, target: Point): void {
  if (!Number.isInteger(index) || index < 0 || index >= room.vertices.length || !Number.isFinite(target.x) || !Number.isFinite(target.y)) throw Error('Coordenadas de vértice inválidas.');
  const previous = (index + room.vertices.length - 1) % room.vertices.length;
  if (room.walls[index].locked || room.walls[previous].locked) throw Error('Hay una pared adyacente bloqueada.');
  const targets = wallDrawing(room).innerVertices.map((p, i) => i === index ? { ...target } : { ...p });
  validatePolygon(targets);
  const inverse = wallDrawing({ ...room, vertices: targets });
  const candidate: Room = { ...room, walls: room.walls.map(w => ({ ...w, locked: false })), vertices: targets.map((_, i) => ({
    x: (inverse.outer[2 * i].x + inverse.outer[2 * i + 1].x) / 2,
    y: (inverse.outer[2 * i].y + inverse.outer[2 * i + 1].y) / 2,
  })) };
  for (let iteration = 0; iteration < 24; iteration++) {
    const actual = wallDrawing(candidate).innerVertices;
    if (actual.every((p, i) => distance(p, targets[i]) < 1e-7)) {
      validatePolygon(candidate.vertices);
      room.vertices = candidate.vertices.map(p => ({ ...p }));
      return;
    }
    for (let i = 0; i < targets.length; i++) {
      if (distance(wallDrawing(candidate).innerVertices[i], targets[i]) >= 1e-7) moveReferenceVertex(candidate, i, targets[i]);
    }
  }
  throw Error('No se puede mover esa esquina conservando los demás vértices interiores.');
}

function moveReferenceVertex(room: Room, index: number, target: Point): void {
  if (!Number.isInteger(index) || index < 0 || index >= room.vertices.length ||
      !Number.isFinite(target.x) || !Number.isFinite(target.y)) throw Error('Coordenadas de vértice inválidas.');
  const previous = (index + room.vertices.length - 1) % room.vertices.length;
  if (room.walls[index].locked || room.walls[previous].locked) throw Error('Hay una pared adyacente bloqueada.');
  const current = wallDrawing(room).innerVertices;
  if (current.some((p, i) => i !== index && distance(p, target) < 0.1)) throw Error('Los vértices de la cara interior no pueden coincidir.');
  const candidate: Room = { ...room, vertices: room.vertices.map(p => ({ ...p })) };
  const original = room.vertices[index], orientation = Math.sign(signedArea(room.vertices));
  const at = (p: Point): Point => {
    candidate.vertices[index] = p;
    return wallDrawing(candidate).innerVertices[index];
  };
  let axis = { x: original.x + target.x - current[index].x, y: original.y + target.y - current[index].y };
  if (!Number.isFinite(distance(at(axis), target))) axis = { ...original };
  for (let iteration = 0; iteration < 32; iteration++) {
    const p = at(axis), error = distance(p, target);
    if (error < 1e-7) {
      validatePolygon(candidate.vertices);
      if (Math.sign(signedArea(candidate.vertices)) !== orientation) break;
      room.vertices = candidate.vertices.map(v => ({ ...v }));
      return;
    }
    const shortest = Math.min(distance(axis, candidate.vertices[previous]), distance(axis, candidate.vertices[(index + 1) % candidate.vertices.length]));
    const h = Math.max(1e-5, Math.min(0.01, shortest * 0.001));
    const px = at({ x: axis.x + h, y: axis.y }), py = at({ x: axis.x, y: axis.y + h });
    const a = (px.x - p.x) / h, b = (py.x - p.x) / h, c = (px.y - p.y) / h, d = (py.y - p.y) / h;
    const determinant = a * d - b * c, ex = p.x - target.x, ey = p.y - target.y;
    const step = Math.abs(determinant) > 1e-9
      ? { x: (d * ex - b * ey) / determinant, y: (-c * ex + a * ey) / determinant }
      : { x: ex, y: ey };
    let improved = false;
    for (let scale = 1; scale >= 1 / 256; scale /= 2) {
      const next = { x: axis.x - step.x * scale, y: axis.y - step.y * scale };
      const nextError = distance(at(next), target);
      if (Number.isFinite(nextError) && nextError < error && Math.sign(signedArea(candidate.vertices)) === orientation) {
        axis = next; improved = true; break;
      }
    }
    if (!improved) break;
  }
  throw Error('No se puede situar el vértice en esas coordenadas manteniendo un contorno válido.');
}

/** Offset both sides of the reference axes. Unequal thicknesses meet at line
 * intersections; excessively long mitres become bevels instead of spikes. */
export function wallDrawing(room: Room): WallDrawing {
  const vertices = room.vertices, count = vertices.length;
  const orientation = signedArea(vertices) > 0 ? 1 : -1;
  const directions = vertices.map((a, i) => {
    const b = vertices[(i + 1) % count], length = distance(a, b);
    return { x: (b.x - a.x) / length, y: (b.y - a.y) / length };
  });
  const corners = (side: number): Corner[] => vertices.map((v, i) => {
    const previous = (i + count - 1) % count, a = directions[previous], b = directions[i];
    const previousHalf = room.walls[previous].thickness / 2, half = room.walls[i].thickness / 2;
    const incoming = { x: v.x - a.y * previousHalf * side, y: v.y + a.x * previousHalf * side };
    const outgoing = { x: v.x - b.y * half * side, y: v.y + b.x * half * side };
    const denominator = a.x * b.y - a.y * b.x;
    if (Math.abs(denominator) < EPS) return { incoming, outgoing };
    const t = ((outgoing.x - incoming.x) * b.y - (outgoing.y - incoming.y) * b.x) / denominator;
    const intersection = { x: incoming.x + a.x * t, y: incoming.y + a.y * t };
    if (distance(v, intersection) > 4 * Math.max(previousHalf, half)) return { incoming, outgoing };
    return { incoming: intersection, outgoing: intersection };
  });
  const inner = corners(orientation), outer = corners(-orientation);
  const contour = (points: Corner[]): Point[] => points.flatMap(p => [p.incoming, p.outgoing]);
  return {
    band: polygonPath(contour(outer)) + ' ' + polygonPath(contour(inner)),
    outer: contour(outer),
    innerVertices: inner.map(p => ({
      x: (p.incoming.x + p.outgoing.x) / 2,
      y: (p.incoming.y + p.outgoing.y) / 2,
    })),
    sections: vertices.map((a, i) => {
      const next = (i + 1) % count, b = vertices[next];
      const line = (points: Corner[]): string => {
        const start = points[i].outgoing, end = points[next].incoming, bevel = points[next].outgoing;
        return `M ${start.x} ${start.y} L ${end.x} ${end.y} L ${bevel.x} ${bevel.y}`;
      };
      return {
        hit: polygonPath([a, inner[i].outgoing, inner[next].incoming, b, outer[next].incoming, outer[i].outgoing]),
        faces: line(inner) + ' ' + line(outer),
      };
    }),
  };
}
