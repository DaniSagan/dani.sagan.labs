/** Dynamic convolution avoids factorial overflow, including at p = 0 and p = 1. */
export function binomialMasses(n: number, p: number): number[] {
  if (!Number.isInteger(n) || n < 0 || n > 200 || !Number.isFinite(p) || p < 0 || p > 1) {
    throw new RangeError('Se requieren 0 ≤ n ≤ 200 y 0 ≤ p ≤ 1.');
  }
  let masses = [1];
  for (let row = 0; row < n; row++) {
    const next = Array(row + 2).fill(0) as number[];
    masses.forEach((mass, k) => { next[k] += mass * (1 - p); next[k + 1] += mass * p; });
    masses = next;
  }
  return masses;
}

export function choose(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  let value = 1;
  for (let i = 1; i <= Math.min(k, n - k); i++) value = value * (n - i + 1) / i;
  return Math.round(value);
}

/** Mulberry32: a reproducible educational PRNG, not cryptographic randomness. */
export function galtonRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6D2B79F5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function galtonPath(n: number, p: number, random: () => number): number[] {
  const path = [0];
  for (let row = 0; row < n; row++) path.push(path[row] + (random() < p ? 1 : 0));
  return path;
}

/** Standard normal CDF; absolute approximation error below about 8e-8. */
export function normalCdf(z: number): number {
  if (z === 0) return 0.5;
  if (z === Infinity) return 1;
  if (z === -Infinity) return 0;
  const x = Math.abs(z);
  const t = 1 / (1 + 0.2316419 * x);
  const tail = Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI) * t *
    (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  return z > 0 ? 1 - tail : tail;
}

export function normalBinProbability(n: number, p: number, lower: number, upper: number, correction = true): number | null {
  const sigma = Math.sqrt(n * p * (1 - p));
  if (sigma === 0) return null;
  const half = correction ? 0.5 : 0;
  return Math.max(0, normalCdf((upper + half - n * p) / sigma) - normalCdf((lower - half - n * p) / sigma));
}
