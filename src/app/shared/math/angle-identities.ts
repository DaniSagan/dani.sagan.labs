export function angleValues(degrees: number): { sin: number; cos: number; tan: number | null } {
  const radians = (degrees % 360) * Math.PI / 180;
  const sin = Math.sin(radians), cos = Math.cos(radians);
  return { sin, cos, tan: Math.abs(cos) < 1e-12 ? null : sin / cos };
}

/** Binomial expansion of (c + is)^n; coefficients are exact at these small orders. */
export function multipleAnglePolynomials(n: number): { sine: string; cosine: string } {
  if (!Number.isInteger(n) || n < 2 || n > 8) throw new Error('El orden debe estar entre 2 y 8.');
  const sine: string[] = [], cosine: string[] = [];
  let coefficient = 1;
  const power = (symbol: string, exponent: number): string => exponent === 0 ? '' : exponent === 1 ? symbol : `${symbol}^{${exponent}}`;
  for (let k = 0; k <= n; k++) {
    const target = k % 2 === 0 ? cosine : sine;
    const negative = Math.floor(k / 2) % 2 !== 0;
    const term = (coefficient === 1 ? '' : coefficient.toString()) + power('c', n - k) + power('s', k);
    target.push((negative ? '-' : target.length ? '+' : '') + term);
    coefficient = coefficient * (n - k) / (k + 1);
  }
  return { sine: sine.join(''), cosine: cosine.join('') };
}
