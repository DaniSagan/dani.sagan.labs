export interface RamseyEdge {
  a: number;
  b: number;
}
export interface RamseyTriangle {
  vertices: number[];
  edges: number[];
  red: boolean;
}

export function ramseyEdges(n: number): RamseyEdge[] {
  const edges: RamseyEdge[] = [];
  for (let a = 0; a < n; a++)
    for (let b = a + 1; b < n; b++) edges.push({ a, b });
  return edges;
}

export function ramseyTriples(
  n: number,
): { vertices: number[]; edges: number[]; bits: number }[] {
  const edges = ramseyEdges(n);
  const index = (a: number, b: number) =>
    edges.findIndex((e) => e.a === a && e.b === b);
  const triples = [];
  for (let a = 0; a < n; a++)
    for (let b = a + 1; b < n; b++)
      for (let c = b + 1; c < n; c++) {
        const ids = [index(a, b), index(a, c), index(b, c)];
        triples.push({
          vertices: [a, b, c],
          edges: ids,
          bits: ids.reduce((s, i) => s | (1 << i), 0),
        });
      }
  return triples;
}

/** Each bit colors one labelled edge: 1 = red, 0 = blue. n is 5 or 6 in the UI. */
export function monochromaticTriangles(
  n: number,
  mask: number,
): RamseyTriangle[] {
  return ramseyTriples(n)
    .filter((t) => (mask & t.bits) === 0 || (mask & t.bits) === t.bits)
    .map((t) => ({
      vertices: t.vertices,
      edges: t.edges,
      red: (mask & t.bits) === t.bits,
    }));
}

export function pentagonMask(n: number): number {
  return ramseyEdges(n).reduce(
    (mask, e, i) =>
      mask |
      (e.b < 5 && (e.b - e.a === 1 || (e.a === 0 && e.b === 4)) ? 1 << i : 0),
    0,
  );
}

export function resizeRamseyMask(
  oldN: number,
  n: number,
  mask: number,
): number {
  const old = ramseyEdges(oldN);
  return ramseyEdges(n).reduce((next, e, i) => {
    const j = old.findIndex((v) => v.a === e.a && v.b === e.b);
    return next | (j >= 0 && mask & (1 << j) ? 1 << i : 0);
  }, 0);
}

/** Constructive pigeonhole proof; returns an actual monochromatic witness. */
export function ramseyWitness(mask: number, pivot: number) {
  const edges = ramseyEdges(6);
  const edgeIndex = (a: number, b: number) =>
    edges.findIndex((e) => e.a === Math.min(a, b) && e.b === Math.max(a, b));
  const neighbors = Array.from({ length: 6 }, (_, i) => i).filter(
    (i) => i !== pivot,
  );
  const redNeighbors = neighbors.filter(
    (i) => !!(mask & (1 << edgeIndex(pivot, i))),
  );
  const red = redNeighbors.length >= 3;
  const chosen = (
    red ? redNeighbors : neighbors.filter((i) => !redNeighbors.includes(i))
  ).slice(0, 3);
  const spokes = chosen.map((i) => edgeIndex(pivot, i));
  const inner = [
    edgeIndex(chosen[0], chosen[1]),
    edgeIndex(chosen[0], chosen[2]),
    edgeIndex(chosen[1], chosen[2]),
  ];
  const matching = inner.find((i) => !!(mask & (1 << i)) === red);
  const vertices =
    matching === undefined
      ? chosen
      : [pivot, edges[matching].a, edges[matching].b];
  const triangle = monochromaticTriangles(6, mask).find((t) =>
    t.vertices.every((v) => vertices.includes(v)),
  )!;
  return { red, chosen, spokes, inner, matching, triangle };
}

export function mixedWedges(n: number, mask: number): number[] {
  const degrees = Array(n).fill(0) as number[];
  ramseyEdges(n).forEach((e, i) => {
    if (mask & (1 << i)) {
      degrees[e.a]++;
      degrees[e.b]++;
    }
  });
  return degrees.map((d) => d * (n - 1 - d));
}
