export interface Bridge { id: number; a: number; b: number; }
export const KONIGSBERG_BRIDGES: Bridge[] = [
  { id: 1, a: 0, b: 1 }, { id: 2, a: 0, b: 1 },
  { id: 3, a: 0, b: 2 }, { id: 4, a: 0, b: 2 },
  { id: 5, a: 0, b: 3 }, { id: 6, a: 1, b: 3 }, { id: 7, a: 2, b: 3 }
];

/** Connectivity ignores isolated vertices: the walk must cover edges, not every vertex. */
export function analyzeBridges(edges: readonly Bridge[], vertexCount = 4) {
  const degrees = Array<number>(vertexCount).fill(0);
  for (const edge of edges) { degrees[edge.a]++; degrees[edge.b]++; }
  const active = degrees.map((d, i) => d ? i : -1).filter(i => i >= 0);
  const visited = new Set<number>();
  const queue = active.length ? [active[0]] : [];
  while (queue.length) {
    const v = queue.pop()!;
    if (visited.has(v)) continue;
    visited.add(v);
    edges.forEach(e => { if (e.a === v && !visited.has(e.b)) queue.push(e.b); if (e.b === v && !visited.has(e.a)) queue.push(e.a); });
  }
  const connected = active.every(v => visited.has(v));
  const odd = degrees.map((d, i) => d % 2 ? i : -1).filter(i => i >= 0);
  const kind = !edges.length ? 'empty' : !connected || (odd.length !== 0 && odd.length !== 2) ? 'impossible' : odd.length === 2 ? 'open' : 'circuit';
  return { degrees, odd, connected, kind };
}

/** Hierholzer's algorithm. Parallel edges retain separate identities. */
export function eulerianRoute(edges: readonly Bridge[], start?: number): { vertices: number[]; edges: number[] } | null {
  const analysis = analyzeBridges(edges);
  if (analysis.kind === 'impossible' || analysis.kind === 'empty') return null;
  const first = start ?? analysis.odd[0] ?? edges[0].a;
  if (!analysis.degrees[first] || (analysis.odd.length && !analysis.odd.includes(first))) return null;
  const used = new Set<number>();
  const stack: { vertex: number; incoming?: number }[] = [{ vertex: first }];
  const vertices: number[] = [], route: number[] = [];
  while (stack.length) {
    const v = stack[stack.length - 1].vertex;
    const edge = edges.find(e => !used.has(e.id) && (e.a === v || e.b === v));
    if (edge) {
      used.add(edge.id);
      stack.push({ vertex: edge.a === v ? edge.b : edge.a, incoming: edge.id });
    } else {
      const entry = stack.pop()!;
      vertices.push(entry.vertex);
      if (entry.incoming !== undefined) route.push(entry.incoming);
    }
  }
  return used.size === edges.length ? { vertices: vertices.reverse(), edges: route.reverse() } : null;
}
