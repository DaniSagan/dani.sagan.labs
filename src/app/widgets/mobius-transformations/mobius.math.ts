import { Complex } from '../../shared/math/complex';
export { Complex };
const add = Complex.sum, sub = Complex.diff, mul = Complex.multiply, div = Complex.div;
const conj = (z: Complex) => new Complex(z.real, -z.imaginary);
export interface MobiusMap { a: Complex; b: Complex; c: Complex; d: Complex; }
const z = (real: number, imaginary = 0) => new Complex(real, imaginary);
export const MOBIUS_PRESETS: (MobiusMap & { label: string })[] = [
  { label: 'Inversión: 1/z', a: z(0), b: z(1), c: z(1), d: z(0) },
  { label: 'Giro y traslación: iz + 1', a: z(0, 1), b: z(1), c: z(0), d: z(1) },
  { label: 'Cayley: (z − i)/(z + i)', a: z(1), b: z(0, -1), c: z(1), d: z(0, 1) },
  { label: 'Fracción: z/(z/2 + 1)', a: z(1), b: z(0), c: z(0.5), d: z(1) }
];
/** null represents the single point at infinity. */
export function mobius(map: MobiusMap, point: Complex | null): Complex | null {
  if (sub(mul(map.a, map.d), mul(map.b, map.c)).absSquared() === 0) {
    throw new RangeError('El determinante debe ser distinto de cero.');
  }
  if (point === null) { return map.c.absSquared() === 0 ? null : div(map.a, map.c); }
  const denominator = add(mul(map.c, point), map.d);
  return denominator.absSquared() < 1e-24 ? null : div(add(mul(map.a, point), map.b), denominator);
}
export function pole(map: MobiusMap): Complex | null {
  return map.c.absSquared() === 0 ? null : div(mul(-1, map.d), map.c);
}
export function crossRatio(points: readonly Complex[]): Complex {
  const [a, b, c, d] = points;
  return div(mul(sub(a, b), sub(c, d)), mul(sub(a, d), sub(c, b)));
}
/** Image equation: A|w|² + 2 Re(Lw) + C = 0. */
export function imageCircle(map: MobiusMap, center: Complex, radius: number) {
  const p = add(map.d, mul(center, map.c));
  const q = mul(-1, add(map.b, mul(center, map.a)));
  const A = p.absSquared() - radius ** 2 * map.c.absSquared();
  const L = add(mul(p, conj(q)), mul(radius ** 2, mul(map.c, conj(map.a))));
  const C = q.absSquared() - radius ** 2 * map.a.absSquared();
  if (Math.abs(A) < 1e-10) { return { kind: 'line' as const, A, L, C, center: z(0), radius: 0 }; }
  return { kind: 'circle' as const, A, L, C, center: mul(-1 / A, conj(L)),
    radius: Math.sqrt(Math.max(0, L.absSquared() / A ** 2 - C / A)) };
}
