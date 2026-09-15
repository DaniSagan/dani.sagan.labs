export function birthdayProbability(n: number, days = 365): number {
  if (!Number.isInteger(n) || n < 0 || !Number.isInteger(days) || days < 1) throw new Error('El grupo debe ser un entero no negativo y los días un entero positivo.');
  if (n > days) return 1;
  let logDistinct = 0;
  for (let k = 1; k < n; k++) logDistinct += Math.log1p(-k / days);
  return -Math.expm1(logDistinct);
}

export function sampleBirthdays(n: number, random: () => number = Math.random): number[] {
  if (!Number.isInteger(n) || n < 0 || n > 100) throw new Error('El tamaño debe estar entre 0 y 100.');
  return Array.from({ length: n }, () => Math.floor(random() * 365));
}
