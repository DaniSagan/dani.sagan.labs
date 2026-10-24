export interface HanoiMove { from: number; to: number; disk: number; }
export function topDisk(state: readonly number[], peg: number): number { return state.indexOf(peg); }
export function legalMove(state: readonly number[], from: number, to: number): boolean {
  const disk = topDisk(state, from), target = topDisk(state, to);
  return from !== to && disk >= 0 && (target < 0 || disk < target);
}
export function encode(state: readonly number[]): number { return state.reduce((sum, peg, i) => sum + peg * 3 ** i, 0); }
export function decode(code: number, n: number): number[] { return Array.from({length: n}, () => { const peg = code % 3; code = Math.floor(code / 3); return peg; }); }
/** Breadth-first distances to C: at most 3^8 = 6561 legal configurations. */
export function goalDistances(n: number): Int16Array {
  const distances = new Int16Array(3 ** n).fill(-1), goal = 3 ** n - 1;
  distances[goal] = 0;
  const queue = [goal];
  for (let head = 0; head < queue.length; head++) {
    const code = queue[head], state = decode(code, n);
    for (let from = 0; from < 3; from++) for (let to = 0; to < 3; to++) {
      if (!legalMove(state, from, to)) continue;
      const disk = topDisk(state, from), next = code + (to - from) * 3 ** disk;
      if (distances[next] >= 0) continue;
      distances[next] = distances[code] + 1; queue.push(next);
    }
  }
  return distances;
}
export function nextMove(state: readonly number[], distances: Int16Array): HanoiMove | null {
  const code = encode(state);
  for (let from = 0; from < 3; from++) for (let to = 0; to < 3; to++) {
    if (!legalMove(state, from, to)) continue;
    const disk = topDisk(state, from);
    if (distances[code + (to - from) * 3 ** disk] === distances[code] - 1) return { from, to, disk };
  }
  return null;
}
