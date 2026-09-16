export interface PlanePoint { x: number; y: number; }
export type PlaneEdge = readonly [number, number];
export const PLANE_POINTS: PlanePoint[] = Array.from({ length: 9 }, (_, i) => ({ x: 155 + (i % 3) * 190, y: 90 + Math.floor(i / 3) * 150 }));
export const PLANE_EDGES: PlaneEdge[] = [[0,1],[1,2],[3,4],[4,5],[6,7],[7,8],[0,3],[3,6],[1,4],[4,7],[2,5],[5,8],[1,3],[2,4],[4,6],[5,7]];

export function planeComponents(vertexCount: number, edges: readonly PlaneEdge[]): number[] {
  const roots = Array.from({ length: vertexCount }, (_, i) => i);
  const root = (v: number): number => { while (roots[v] !== v) v = roots[v]; return v; };
  edges.forEach(([a, b]) => { roots[root(b)] = root(a); });
  return roots.map((_, i) => root(i));
}

/** Trace directed half-edges of a straight-line plane embedding, independently of Euler's formula.
 * Positive signed area selects bounded boundary walks (screen coordinates).
 * The laboratory uses a fixed noncrossing mesh with no nested disconnected cycles.
 */
export function boundedPlaneFaces(points: readonly PlanePoint[], edges: readonly PlaneEdge[]): number[][] {
  const neighbors = points.map(() => [] as number[]);
  edges.forEach(([a, b]) => { neighbors[a].push(b); neighbors[b].push(a); });
  neighbors.forEach((list, i) => list.sort((a, b) =>
    Math.atan2(points[a].y - points[i].y, points[a].x - points[i].x) - Math.atan2(points[b].y - points[i].y, points[b].x - points[i].x)));
  const seen = new Set<string>(), faces: number[][] = [];
  edges.forEach(([a, b]) => {
    for (const [first, second] of [[a, b], [b, a]]) {
      if (seen.has(`${first}:${second}`)) continue;
      let u = first, v = second;
      const boundary: number[] = [];
      do {
        seen.add(`${u}:${v}`); boundary.push(u);
        const list = neighbors[v];
        const next = list[(list.indexOf(u) + list.length - 1) % list.length];
        u = v; v = next;
      } while (u !== first || v !== second);
      const area = boundary.reduce((sum, index, i) => {
        const p = points[index], q = points[boundary[(i + 1) % boundary.length]];
        return sum + p.x * q.y - q.x * p.y;
      }, 0);
      if (area > 1e-7) faces.push(boundary);
    }
  });
  return faces;
}

export function cycleEdgeIndex(vertexCount: number, edges: readonly PlaneEdge[]): number {
  const components = new Set(planeComponents(vertexCount, edges)).size;
  return edges.findIndex((_, i) => new Set(planeComponents(vertexCount, edges.filter((__, j) => j !== i))).size === components);
}

/** Pick an interior label with clearance from the boundary, including concave faces. */
export function planeFaceLabel(points: readonly PlanePoint[], boundary: readonly number[]): PlanePoint {
  const polygon = boundary.map(i => points[i]);
  const minX = Math.min(...polygon.map(p => p.x)), maxX = Math.max(...polygon.map(p => p.x));
  const minY = Math.min(...polygon.map(p => p.y)), maxY = Math.max(...polygon.map(p => p.y));
  let best = polygon[0], clearance = -1;
  for (let ix = 1; ix < 24; ix++) for (let iy = 1; iy < 24; iy++) {
    const p = { x: minX + (maxX - minX) * ix / 24, y: minY + (maxY - minY) * iy / 24 };
    let inside = false, distance = Infinity;
    polygon.forEach((a, i) => {
      const b = polygon[(i + 1) % polygon.length];
      if ((a.y > p.y) !== (b.y > p.y) && p.x < (b.x - a.x) * (p.y - a.y) / (b.y - a.y) + a.x) inside = !inside;
      const dx = b.x - a.x, dy = b.y - a.y;
      const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy)));
      distance = Math.min(distance, (p.x - a.x - t * dx) ** 2 + (p.y - a.y - t * dy) ** 2);
    });
    if (inside && distance > clearance) { best = p; clearance = distance; }
  }
  return best;
}
