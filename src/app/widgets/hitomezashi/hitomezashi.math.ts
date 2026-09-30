export type Bit = 0 | 1;
export interface Stitch {
  x: number;
  y: number;
  horizontal: boolean;
  line: number;
}

export function periodicBits(pattern: string, length: number): Bit[] {
  const bits = pattern.replace(/\s/g, '');
  if (!/^[01]{1,32}$/.test(bits))
    throw new Error('Introduce entre 1 y 32 bits (0 o 1).');
  return Array.from({ length }, (_, i) => Number(bits[i % bits.length]) as Bit);
}

/** Deterministic 32-bit generator; the seed reproduces both independent draws. */
export function randomBits(seed: number, length: number): Bit[] {
  let state = seed >>> 0;
  return Array.from({ length }, () => {
    state += 0x6d2b79f5;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 31) as Bit;
  });
}

export function stitches(rows: Bit[], columns: Bit[]): Stitch[] {
  if (
    rows.length !== columns.length ||
    rows.length < 2 ||
    [...rows, ...columns].some((b) => b !== 0 && b !== 1)
  )
    throw new Error('Secuencias incompatibles.');
  const n = rows.length - 1;
  const result: Stitch[] = [];
  rows.forEach((bit, y) => {
    for (let x = bit; x < n; x += 2)
      result.push({ x, y, horizontal: true, line: y });
  });
  columns.forEach((bit, x) => {
    for (let y = bit; y < n; y += 2)
      result.push({ x, y, horizontal: false, line: x });
  });
  return result;
}

/** Adjacent cells change color precisely when their shared edge is a stitch.
 * The even degree at interior vertices makes this independent of the path. */
export function regionColors(rows: Bit[], columns: Bit[]): Bit[][] {
  stitches(rows, columns); // Validate the two binary sequences.
  const n = rows.length - 1;
  const colors: Bit[][] = [];
  for (let y = 0; y < n; y++) {
    const line: Bit[] = [
      y === 0 ? 0 : ((colors[y - 1][0] ^ (rows[y] === 0 ? 1 : 0)) as Bit),
    ];
    for (let x = 1; x < n; x++) {
      line.push((line[x - 1] ^ (y % 2 === columns[x] ? 1 : 0)) as Bit);
    }
    colors.push(line);
  }
  return colors;
}

/** Euler's planar graph identity: bounded faces = E - V + C.
 * Only stitch endpoints count; the viewport boundary adds no edges. */
export function closedRegions(edges: Stitch[]): number {
  const parent = new Map<string, string>();
  const root = (v: string): string => {
    if (!parent.has(v)) parent.set(v, v);
    let r = v;
    while (parent.get(r) !== r) r = parent.get(r)!;
    while (v !== r) {
      const next = parent.get(v)!;
      parent.set(v, r);
      v = next;
    }
    return r;
  };
  for (const e of edges) {
    const a = root(`${e.x},${e.y}`);
    const b = root(
      `${e.x + (e.horizontal ? 1 : 0)},${e.y + (e.horizontal ? 0 : 1)}`,
    );
    parent.set(a, b);
  }
  const components = new Set([...parent.keys()].map(root)).size;
  return edges.length - parent.size + components;
}
