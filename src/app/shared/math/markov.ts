export type TransitionMatrix = number[][];
export const MARKOV_PRESETS = {
  mixing: [[0.7, 0.2, 0.1], [0.2, 0.5, 0.3], [0.1, 0.3, 0.6]],
  cycle: [[0, 1, 0], [0, 0, 1], [1, 0, 0]],
  absorbing: [[1, 0, 0], [0.25, 0.5, 0.25], [0, 0, 1]],
};
export function normalizeWeights(weights: number[][]): TransitionMatrix {
  if (!weights.length || weights.some(row => row.length !== weights.length || row.some(v => !Number.isFinite(v) || v < 0) || row.reduce((a, b) => a + b, 0) <= 0)) throw new Error('Cada fila necesita pesos no negativos y al menos un peso positivo.');
  return weights.map(row => { const sum = row.reduce((a, b) => a + b, 0); if (!Number.isFinite(sum)) throw new Error('Los pesos son demasiado grandes.'); return row.map(v => v / sum); });
}
export function markovStep(distribution: number[], matrix: TransitionMatrix): number[] {
  return distribution.map((_, j) => distribution.reduce((sum, value, i) => sum + value * matrix[i][j], 0));
}
export function markovHistory(initial: number[], matrix: TransitionMatrix, steps: number): number[][] {
  const history = [[...initial]];
  for (let t = 0; t < steps; t++) history.push(markovStep(history[t], matrix));
  return history;
}
export function solveLinear(matrix: number[][], rhs: number[]): number[] | null {
  const n = rhs.length, a = matrix.map((row, i) => [...row, rhs[i]]);
  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let i = col + 1; i < n; i++) if (Math.abs(a[i][col]) > Math.abs(a[pivot][col])) pivot = i;
    if (Math.abs(a[pivot][col]) < 1e-12) return null;
    [a[col], a[pivot]] = [a[pivot], a[col]];
    const scale = a[col][col]; for (let j = col; j <= n; j++) a[col][j] /= scale;
    for (let i = 0; i < n; i++) if (i !== col) { const factor = a[i][col]; for (let j = col; j <= n; j++) a[i][j] -= factor * a[col][j]; }
  }
  return a.map(row => row[n]);
}
export function stationaryDistribution(p: TransitionMatrix): number[] | null {
  const n = p.length;
  const a = p.map((_, j) => p.map((row, i) => row[j] - +(i === j)));
  a[n - 1] = Array(n).fill(1);
  return solveLinear(a, Array.from({ length: n }, (_, i) => +(i === n - 1)));
}
export function isIrreducible(p: TransitionMatrix): boolean {
  return p.every((_, start) => {
    const seen = new Set([start]), queue = [start];
    for (let i = 0; i < queue.length; i++) p[queue[i]].forEach((v, j) => { if (v > 0 && !seen.has(j)) { seen.add(j); queue.push(j); } });
    return seen.size === p.length;
  });
}
export function chainPeriod(p: TransitionMatrix): number | null {
  if (!isIrreducible(p)) return null;
  const distances = Array(p.length).fill(-1); distances[0] = 0;
  const queue = [0];
  for (let i = 0; i < queue.length; i++) p[queue[i]].forEach((v, j) => { if (v > 0 && distances[j] < 0) { distances[j] = distances[queue[i]] + 1; queue.push(j); } });
  const gcd = (a: number, b: number): number => { while (b) { const r = a % b; a = b; b = r; } return a; };
  let period = 0;
  p.forEach((row, i) => row.forEach((v, j) => { if (v > 0) period = gcd(period, Math.abs(distances[i] + 1 - distances[j])); }));
  return period;
}
export function markovRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => { state = (Math.imul(1664525, state) + 1013904223) >>> 0; return (state + 0.5) / 4294967296; };
}
export function sampleTransition(row: number[], random: () => number): number {
  const u = random(); let sum = 0;
  for (let i = 0; i < row.length; i++) { sum += row[i]; if (u < sum) return i; }
  return row.length - 1;
}
export function absorbingWalk(n: number, p: number): { matrix: TransitionMatrix; right: number[]; time: number[] } {
  const matrix = Array.from({ length: n + 1 }, (_, i) => Array.from({ length: n + 1 }, (_, j) => i === 0 || i === n ? +(i === j) : j === i + 1 ? p : j === i - 1 ? 1 - p : 0));
  const a = Array.from({ length: n - 1 }, (_, i) => Array.from({ length: n - 1 }, (_, j) => +(i === j) - matrix[i + 1][j + 1]));
  const right = solveLinear(a, Array.from({ length: n - 1 }, (_, i) => matrix[i + 1][n]))!;
  const time = solveLinear(a, Array(n - 1).fill(1))!;
  return { matrix, right: [0, ...right, 1], time: [0, ...time, 0] };
}
