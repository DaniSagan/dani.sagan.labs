/** Deterministic open-interval PRNG: reproducible experiments, never log(0). */
export function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => { state = (Math.imul(1664525, state) + 1013904223) >>> 0; return (state + 0.5) / 4294967296; };
}

export function normalCdf(x: number): number {
  if (x === 0) return 0.5;
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const tail = Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI) * t *
    (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  return x > 0 ? 1 - tail : tail;
}

export type Population = 'uniform' | 'exponential' | 'bernoulli' | 'bimodal';
export function observation(kind: Population, random: () => number): number {
  const u = random();
  switch (kind) {
    case 'uniform': return u;
    case 'exponential': return -Math.log(u);
    case 'bernoulli': return u < 0.05 ? 1 : 0;
    case 'bimodal': return (u < 0.5 ? -2 : 2) + random() - 0.5;
  }
}
export function moments(kind: Population): { mean: number; variance: number } {
  switch (kind) {
    case 'uniform': return { mean: 0.5, variance: 1 / 12 };
    case 'exponential': return { mean: 1, variance: 1 };
    case 'bernoulli': return { mean: 0.05, variance: 0.0475 };
    case 'bimodal': return { mean: 0, variance: 4 + 1 / 12 };
  }
}

/** Binomial masses in log space, including p=0 and p=1. */
export function binomialMasses(n: number, p: number): number[] {
  if (p === 0 || p === 1) return Array.from({ length: n + 1 }, (_, k) => +(k === n * p));
  let logChoose = 0;
  return Array.from({ length: n + 1 }, (_, k) => {
    if (k > 0) logChoose += Math.log(n - k + 1) - Math.log(k);
    return Math.exp(logChoose + k * Math.log(p) + (n - k) * Math.log1p(-p));
  });
}
