export function imaginaryExponentialSums(angle: number, order: number) {
  if (!Number.isFinite(angle) || Math.abs(angle) > Math.PI || !Number.isInteger(order) || order < 0 || order > 24) {
    throw new RangeError('Ángulo entre −π y π y orden entero entre 0 y 24 requeridos.');
  }
  let termReal = 1, termImaginary = 0, real = 1, imaginary = 0;
  const sums = [{ n: 0, real, imaginary, termReal, termImaginary }];
  for (let n = 1; n <= order; n++) {
    const nextReal = -termImaginary * angle / n;
    termImaginary = termReal * angle / n;
    termReal = nextReal;
    real += termReal; imaginary += termImaginary;
    sums.push({ n, real, imaginary, termReal, termImaginary });
  }
  return sums;
}
