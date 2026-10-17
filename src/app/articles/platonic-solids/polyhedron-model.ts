export type Point3 = readonly [number, number, number];
export interface PolyhedronFace { vertices: number[]; center: Point3; normal: Point3; }
export interface PolyhedronModel {
  name: string; dualName: string; p: number; q: number;
  vertices: Point3[]; faces: PolyhedronFace[]; edges: [number, number][];
  radius: number; inradius: number; midradius: number;
  area: number; volume: number; dihedral: number; central: number;
}
export const add = (a: Point3, b: Point3): Point3 => [a[0]+b[0], a[1]+b[1], a[2]+b[2]];
export const sub = (a: Point3, b: Point3): Point3 => [a[0]-b[0], a[1]-b[1], a[2]-b[2]];
export const scale = (a: Point3, k: number): Point3 => [a[0]*k, a[1]*k, a[2]*k];
export const dot = (a: Point3, b: Point3): number => a.reduce((s, x, i) => s + x * b[i], 0);
export const cross = (a: Point3, b: Point3): Point3 => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
export const length = (a: Point3): number => Math.hypot(...a);
export const mean = (a: Point3[]): Point3 => scale(a.reduce(add, [0, 0, 0]), 1 / a.length);

/** Convex hull of a small, centered vertex set. Coplanar triangles become ONE
 * polygonal face, so pentagons and squares never acquire false diagonal edges. */
export function convexFaces(vertices: Point3[]): PolyhedronFace[] {
  const faces = new Map<string, PolyhedronFace>();
  const epsilon = 1e-7;
  for (let i=0; i<vertices.length; i++) for (let j=i+1; j<vertices.length; j++) for (let k=j+1; k<vertices.length; k++) {
    let normal = cross(sub(vertices[j], vertices[i]), sub(vertices[k], vertices[i]));
    if (length(normal) < epsilon) continue;
    normal = scale(normal, 1 / length(normal));
    const distances = vertices.map(v => dot(normal, sub(v, vertices[i])));
    if (distances.some(d => d > epsilon) && distances.some(d => d < -epsilon)) continue;
    const ids = distances.flatMap((d, n) => Math.abs(d) < epsilon ? [n] : []);
    const key = ids.join(':');
    if (faces.has(key)) continue;
    const center = mean(ids.map(n => vertices[n]));
    if (dot(normal, center) < 0) normal = scale(normal, -1);
    const u = sub(vertices[ids[0]], center), v = cross(normal, u);
    ids.sort((a, b) => Math.atan2(dot(sub(vertices[a], center), v), dot(sub(vertices[a], center), u)) - Math.atan2(dot(sub(vertices[b], center), v), dot(sub(vertices[b], center), u)));
    faces.set(key, { vertices: ids, center, normal });
  }
  return [...faces.values()];
}

/** Coordinate sets are normalized to edge length one, not circumradius one. */
export function regularPolyhedron(name: string, dualName: string, raw: Point3[], p: number, q: number): PolyhedronModel {
  let edge = Infinity;
  raw.forEach((a, i) => raw.slice(i+1).forEach(b => edge = Math.min(edge, length(sub(a, b)))));
  const vertices = raw.map(v => scale(v, 1 / edge));
  const faces = convexFaces(vertices), edges = new Map<string, [number, number]>();
  let area = 0, volume = 0;
  for (const face of faces) {
    face.vertices.forEach((a, i) => {
      const b = face.vertices[(i+1) % face.vertices.length];
      edges.set([a, b].sort((x, y) => x-y).join(':'), [a, b]);
    });
    for (let i=1; i<face.vertices.length-1; i++) {
      const [a, b, c] = [face.vertices[0], face.vertices[i], face.vertices[i+1]].map(n => vertices[n]);
      area += length(cross(sub(b, a), sub(c, a))) / 2;
      volume += dot(a, cross(b, c)) / 6;
    }
  }
  const allEdges = [...edges.values()], [a, b] = allEdges[0];
  const adjacent = faces.filter(f => f.vertices.includes(a) && f.vertices.includes(b));
  const radius = length(vertices[0]);
  return { name, dualName, vertices, faces, edges: allEdges, p, q, radius,
    inradius: length(faces[0].center), midradius: length(mean([vertices[a], vertices[b]])), area, volume,
    dihedral: Math.acos(Math.max(-1, Math.min(1, -dot(adjacent[0].normal, adjacent[1].normal)))) * 180 / Math.PI,
    central: 2 * Math.asin(1 / (2 * radius)) * 180 / Math.PI };
}
