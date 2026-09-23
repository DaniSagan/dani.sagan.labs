export interface MapPoint {
  x: number;
  y: number;
}
export interface PlanarMap {
  sites: MapPoint[];
  cells: MapPoint[][];
  edges: [number, number][];
}
export const MAP_PALETTE = ['#f4ba71', '#8bd7c3', '#aab8ff', '#f09db7'];

/** Clip a convex polygon to the half-plane A*x+B*y <= C. */
function clip(
  polygon: MapPoint[],
  a: number,
  b: number,
  c: number,
): MapPoint[] {
  const result: MapPoint[] = [];
  for (let i = 0; i < polygon.length; i++) {
    const p = polygon[i],
      q = polygon[(i + 1) % polygon.length];
    const dp = a * p.x + b * p.y - c,
      dq = a * q.x + b * q.y - c;
    if (dp <= 1e-8) result.push(p);
    if ((dp < 0 && dq > 0) || (dp > 0 && dq < 0)) {
      const t = dp / (dp - dq);
      result.push({ x: p.x + t * (q.x - p.x), y: p.y + t * (q.y - p.y) });
    }
  }
  return result;
}

/** Connected convex Voronoi regions; a point contact is never an adjacency. */
export function makePlanarMap(sites: MapPoint[]): PlanarMap {
  const cells = sites.map((p, i) => {
    let polygon = [
      { x: 30, y: 30 },
      { x: 610, y: 30 },
      { x: 610, y: 430 },
      { x: 30, y: 430 },
    ];
    sites.forEach((q, j) => {
      if (i !== j)
        polygon = clip(
          polygon,
          2 * (q.x - p.x),
          2 * (q.y - p.y),
          q.x ** 2 + q.y ** 2 - p.x ** 2 - p.y ** 2,
        );
    });
    return polygon;
  });
  const edges: [number, number][] = [];
  for (let i = 0; i < sites.length; i++)
    for (let j = i + 1; j < sites.length; j++) {
      const p = sites[i],
        q = sites[j],
        a = 2 * (q.x - p.x),
        b = 2 * (q.y - p.y),
        c = q.x ** 2 + q.y ** 2 - p.x ** 2 - p.y ** 2;
      const onLine = cells[i].filter(
        (v) => Math.abs(a * v.x + b * v.y - c) / Math.hypot(a, b) < 1e-6,
      );
      if (
        onLine.some((v, k) =>
          onLine
            .slice(k + 1)
            .some((w) => Math.hypot(v.x - w.x, v.y - w.y) > 1e-5),
        )
      )
        edges.push([i, j]);
    }
  return { sites, cells, edges };
}

export function fourColorMap(kind = 'mosaic', seed = 2026): PlanarMap {
  if (kind === 'four')
    return makePlanarMap([
      { x: 320, y: 215 },
      { x: 320, y: 70 },
      { x: 150, y: 340 },
      { x: 490, y: 340 },
    ]);
  if (kind === 'point')
    return makePlanarMap([
      { x: 175, y: 125 },
      { x: 465, y: 125 },
      { x: 175, y: 335 },
      { x: 465, y: 335 },
    ]);
  let state = seed >>> 0;
  const random = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  return makePlanarMap(
    Array.from({ length: 12 }, (_, i) => ({
      x: 100 + (i % 4) * 145 + (random() - 0.5) * 65,
      y: 95 + Math.floor(i / 4) * 135 + (random() - 0.5) * 65,
    })),
  );
}

export function colorConflicts(
  edges: [number, number][],
  colors: number[],
): [number, number][] {
  return edges.filter(([a, b]) => colors[a] >= 0 && colors[a] === colors[b]);
}

export interface ColoringFrame {
  colors: number[];
  vertex: number;
  message: string;
}
export interface ColoringSearch {
  status: 'solved' | 'impossible' | 'limit';
  colors: number[];
  frames: ColoringFrame[];
  attempts: number;
}
/** DSATUR ordering plus complete backtracking, bounded to keep UI work finite. */
export function solveMap(
  map: PlanarMap,
  k: number,
  limit = 10000,
): ColoringSearch {
  const n = map.sites.length,
    colors = Array(n).fill(-1) as number[];
  const neighbors = Array.from({ length: n }, (_, v) =>
    map.edges
      .filter((e) => e.includes(v))
      .map((e) => (e[0] === v ? e[1] : e[0])),
  );
  const frames: ColoringFrame[] = [
    {
      colors: [...colors],
      vertex: -1,
      message: 'Inicio: todas las regiones están sin colorear.',
    },
  ];
  let attempts = 0,
    limited = false;
  const search = (): boolean => {
    let selected = -1,
      saturation = -1,
      degree = -1;
    for (let v = 0; v < n; v++)
      if (colors[v] < 0) {
        const s = new Set(
          neighbors[v].map((w) => colors[w]).filter((c) => c >= 0),
        ).size;
        if (
          s > saturation ||
          (s === saturation && neighbors[v].length > degree)
        ) {
          selected = v;
          saturation = s;
          degree = neighbors[v].length;
        }
      }
    if (selected < 0) return true;
    for (let c = 0; c < k; c++) {
      if (neighbors[selected].some((v) => colors[v] === c)) continue;
      if (attempts >= limit) {
        limited = true;
        return false;
      }
      attempts++;
      colors[selected] = c;
      frames.push({
        colors: [...colors],
        vertex: selected,
        message: `Asignar color ${c + 1} a ${String.fromCharCode(65 + selected)}.`,
      });
      if (search()) return true;
      colors[selected] = -1;
      frames.push({
        colors: [...colors],
        vertex: selected,
        message: `Retroceder: retirar el color de ${String.fromCharCode(65 + selected)}.`,
      });
      if (limited) return false;
    }
    return false;
  };
  const solved = search();
  const status = solved ? 'solved' : limited ? 'limit' : 'impossible';
  frames.push({
    colors: [...colors],
    vertex: -1,
    message: solved
      ? 'Coloración completa y sin conflictos.'
      : limited
        ? 'Límite de búsqueda alcanzado: resultado no concluyente.'
        : `Búsqueda agotada: este grafo no admite ${k} colores.`,
  });
  return { status, colors: [...colors], frames, attempts };
}

export function kempeComponent(
  map: PlanarMap,
  colors: number[],
  start: number,
  a: number,
  b: number,
): number[] {
  if (colors[start] !== a && colors[start] !== b) return [];
  const visited = new Set([start]),
    queue = [start];
  for (let i = 0; i < queue.length; i++)
    for (const [u, v] of map.edges) {
      const next = u === queue[i] ? v : v === queue[i] ? u : -1;
      if (
        next >= 0 &&
        !visited.has(next) &&
        (colors[next] === a || colors[next] === b)
      ) {
        visited.add(next);
        queue.push(next);
      }
    }
  return queue;
}
