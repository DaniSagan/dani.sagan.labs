export type QuadratureRule = 'midpoint' | 'trapezoid' | 'simpson' | 'gauss';

/** Composite rules on a finite interval. Simpson requires an even panel count. */
export function quadrature(
  f: (x: number) => number,
  a: number,
  b: number,
  n: number,
  rule: QuadratureRule,
): number {
  if (!Number.isInteger(n) || n < 1 || (rule === 'simpson' && n % 2 !== 0)) {
    throw new Error('Número de paneles inválido');
  }
  const h = (b - a) / n;
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const left = a + i * h;
    if (rule === 'midpoint') sum += h * f(left + h / 2);
    if (rule === 'trapezoid') sum += (h * (f(left) + f(left + h))) / 2;
    if (rule === 'gauss') {
      sum +=
        (h / 2) *
        (f(left + h / 2 - h / (2 * Math.sqrt(3))) +
          f(left + h / 2 + h / (2 * Math.sqrt(3))));
    }
  }
  if (rule === 'simpson') {
    sum = f(a) + f(b);
    for (let i = 1; i < n; i++) sum += (i % 2 ? 4 : 2) * f(a + i * h);
    sum *= h / 3;
  }
  return sum;
}

export function halton(index: number, base: number): number {
  let result = 0;
  let factor = 1;
  while (index > 0) {
    factor /= base;
    result += factor * (index % base);
    index = Math.floor(index / base);
  }
  return result;
}

export function seededPoints(
  count: number,
  seed: number,
): { x: number; y: number }[] {
  let state = seed >>> 0;
  const next = () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  return Array.from({ length: count }, () => ({ x: next(), y: next() }));
}

export function parameterIntegrand(x: number, a: number): number {
  return x === 0 ? a : Math.log1p(a * x) / x;
}

export function gaussianEstimate(lambda: number): number {
  return Math.sqrt((2 * Math.PI) / lambda);
}
