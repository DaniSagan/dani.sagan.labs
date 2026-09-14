export type FourierWave = 'square' | 'saw' | 'triangle';

export function fourierCoefficients(wave: FourierWave, maximum: number): number[] {
  if (!Number.isInteger(maximum) || maximum < 1 || maximum > 99) {
    throw new RangeError('N debe ser un entero entre 1 y 99.');
  }
  return Array.from({ length: maximum }, (_, index) => {
    const k = index + 1;
    if (wave === 'saw') { return 2 * (k % 2 ? 1 : -1) / (Math.PI * k); }
    if (k % 2 === 0) { return 0; }
    return wave === 'square' ? 4 / (Math.PI * k)
      : 8 * (((k - 1) / 2) % 2 ? -1 : 1) / (Math.PI ** 2 * k ** 2);
  });
}

export function fourierSum(coefficients: readonly number[], x: number, fejer = false): number {
  return coefficients.reduce((sum, coefficient, index) => {
    const k = index + 1;
    return sum + coefficient * Math.sin(k * x) * (fejer ? 1 - k / (coefficients.length + 1) : 1);
  }, 0);
}

/** At jumps, use the average of the lateral limits. */
export function waveValue(wave: FourierWave, x: number): number {
  const phase = Math.atan2(Math.sin(x), Math.cos(x));
  if (wave === 'triangle') { return 2 / Math.PI * Math.asin(Math.sin(x)); }
  if (Math.abs(Math.abs(phase) - Math.PI) < 1e-12) { return 0; }
  if (wave === 'saw') { return phase / Math.PI; }
  return Math.abs(phase) < 1e-12 ? 0 : Math.sign(phase);
}
