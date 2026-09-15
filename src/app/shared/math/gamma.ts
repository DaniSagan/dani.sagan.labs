/** Real gamma, Lanczos approximation with reflection. */
export function gamma(x: number): number {
  if (!Number.isFinite(x)) throw new Error('Introduce un número real finito.');
  if (x <= 0 && Number.isInteger(x)) throw new Error('Γ tiene un polo en los enteros no positivos; no hay un valor finito.');
  if (x < -170 || x > 171) throw new Error('La calculadora admite −170 ≤ x ≤ 171, excepto los polos.');
  const coefficients = [676.5203681218851, -1259.1392167224028, 771.3234287776531,
    -176.6150291621406, 12.507343278686905, -0.13857109526572012, 9.984369578019572e-6, 1.5056327351493116e-7];
  const logGamma = (z: number): number => {
    const w = z - 1;
    let sum = 0.99999999999980993;
    coefficients.forEach((c, i) => sum += c / (w + i + 1));
    const t = w + 7.5;
    return 0.9189385332046727 + (w + 0.5) * Math.log(t) - t + Math.log(sum);
  };
  let value: number;
  if (x < 0.5) {
    const sine = Math.sin(Math.PI * (x % 2));
    value = Math.sign(sine) * Math.exp(Math.log(Math.PI) - Math.log(Math.abs(sine)) - logGamma(1 - x));
  } else value = Math.exp(logGamma(x));
  if (!Number.isFinite(value) || value === 0) throw new Error('El resultado supera el rango numérico representable.');
  return value;
}
