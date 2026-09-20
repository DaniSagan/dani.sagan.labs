export type FeigenbaumMap = 'logistic' | 'sine';
export const FEIGENBAUM_DELTA = 4.66920160910299;

export function iterateMap(kind: FeigenbaumMap, parameter: number, x: number): number {
  return kind === 'logistic' ? parameter * x * (1 - x) : parameter * Math.sin(Math.PI * x);
}

export function orbit(kind: FeigenbaumMap, parameter: number, seed: number, count: number, discard = 0): number[] {
  let x = seed;
  for (let i = 0; i < discard; i++) x = iterateMap(kind, parameter, x);
  const values = [x];
  for (let i = 0; i < count; i++) {
    x = iterateMap(kind, parameter, x);
    values.push(x);
  }
  return values;
}

export function lyapunov(kind: FeigenbaumMap, parameter: number, seed = 0.413, count = 3000): number {
  let x = orbit(kind, parameter, seed, 0, 1500)[0];
  let sum = 0;
  for (let i = 0; i < count; i++) {
    const derivative = kind === 'logistic' ? parameter * (1 - 2 * x) : parameter * Math.PI * Math.cos(Math.PI * x);
    if (derivative === 0) return -Infinity;
    sum += Math.log(Math.abs(derivative));
    x = iterateMap(kind, parameter, x);
  }
  return sum / count;
}

export interface SuperstableLevel { n: number; period: number; parameter: number; delta: number | null; distance: number; alpha: number | null; }

// Follow the principal period-doubling cascade, skipping inherited lower-period roots.
// Bracket the next root, then bisect; eight levels stay well within double precision.
export function superstableLevels(kind: FeigenbaumMap, levels = 8): SuperstableLevel[] {
  const result: SuperstableLevel[] = [{ n: 0, period: 1, parameter: kind === 'logistic' ? 2 : 0.5, delta: null, distance: 0, alpha: null }];
  let gap = kind === 'logistic' ? 2 : 0.5;
  const ceiling = kind === 'logistic' ? 4 : 1;
  for (let n = 1; n <= Math.min(8, levels); n++) {
    const previous = result[n - 1].parameter;
    const residual = (p: number) => orbit(kind, p, 0.5, 2 ** n)[2 ** n] - 0.5;
    let left = previous + gap * 0.02;
    let right = left;
    let fl = residual(left);
    let found = false;
    const step = gap / 500;
    while (right < Math.min(ceiling, previous + gap)) {
      right = Math.min(right + step, ceiling, previous + gap);
      const fr = residual(right);
      if (fl * fr <= 0) { found = true; break; }
      left = right;
      fl = fr;
    }
    if (!found) throw new Error('No se pudo acotar el siguiente ciclo superestable.');
    for (let i = 0; i < 55; i++) {
      const middle = (left + right) / 2;
      if (fl * residual(middle) <= 0) right = middle;
      else { left = middle; fl = residual(middle); }
    }
    const parameter = (left + right) / 2;
    const distance = orbit(kind, parameter, 0.5, 2 ** (n - 1))[2 ** (n - 1)] - 0.5;
    result.push({ n, period: 2 ** n, parameter, delta: n > 1 ? gap / (parameter - previous) : null,
      distance, alpha: n > 1 ? result[n - 1].distance / distance : null });
    gap = parameter - previous;
  }
  return result;
}
