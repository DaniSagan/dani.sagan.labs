export function catalanSequence(n: number): bigint[] {
  if (!Number.isInteger(n) || n < 0 || n > 1000) throw new Error('Introduce un índice entero entre 0 y 1000.');
  const values = [1n];
  for (let k = 0; k < n; k++) values.push(values[k] * BigInt(4 * k + 2) / BigInt(k + 2));
  return values;
}

/** Enumerate balanced parentheses; every prefix has at least as many opens as closes. */
export function dyckWords(n: number): string[] {
  if (!Number.isInteger(n) || n < 0 || n > 7) throw new Error('Elige entre 0 y 7 pares.');
  const result: string[] = [];
  const visit = (word: string, opens: number, closes: number): void => {
    if (closes === n) { result.push(word); return; }
    if (opens < n) visit(word + '(', opens + 1, closes);
    if (closes < opens) visit(word + ')', opens, closes + 1);
  };
  visit('', 0, 0);
  return result;
}
