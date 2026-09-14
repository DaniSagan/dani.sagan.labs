import { pascalRows } from '../pascal-triangle/pascal.math';

export function binomialTerms(n: number, a: number, b: number) {
  if (!Number.isInteger(n) || n < 0 || n > 10 ||
      ![a, b].every(value => Number.isInteger(value) && Math.abs(value) <= 3)) {
    throw new RangeError('Usa n entre 0 y 10 y enteros a, b entre −3 y 3.');
  }
  return pascalRows(n)[n].map((coefficient, k) => ({
    k, coefficient, powerA: n - k, powerB: k,
    value: coefficient * a ** (n - k) * b ** k
  }));
}

export function binomialChoices(n: number, k: number): string[] {
  if (!Number.isInteger(n) || n < 1 || n > 6 || !Number.isInteger(k) || k < 0 || k > n) {
    throw new RangeError('Usa entre 1 y 6 factores y un número válido de letras b.');
  }
  const choices: string[] = [];
  for (let mask = 0; mask < 2 ** n; mask++) {
    const letters = Array.from({ length: n }, (_, i) => (mask & (1 << i)) ? 'b' : 'a');
    if (letters.filter(letter => letter === 'b').length === k) { choices.push(letters.join('')); }
  }
  return choices;
}
