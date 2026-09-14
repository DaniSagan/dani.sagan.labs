/** Rows 0–32 remain exactly representable as JavaScript integers. */
export function pascalRows(lastRow: number): number[][] {
  if (!Number.isInteger(lastRow) || lastRow < 0 || lastRow > 32) {
    throw new RangeError('La última fila debe estar entre 0 y 32.');
  }
  const rows = [[1]];
  for (let n = 1; n <= lastRow; n++) {
    const previous = rows[n - 1];
    rows.push(Array.from({ length: n + 1 }, (_, k) => (previous[k - 1] ?? 0) + (previous[k] ?? 0)));
  }
  return rows;
}

export function binomialProbabilities(n: number, p: number): number[] {
  const row = pascalRows(n)[n];
  if (!Number.isFinite(p) || p < 0 || p > 1) {
    throw new RangeError('La probabilidad debe estar entre 0 y 1.');
  }
  return row.map((coefficient, k) => {
    if (p === 0) { return k === 0 ? 1 : 0; }
    if (p === 1) { return k === n ? 1 : 0; }
    return coefficient * p ** k * (1 - p) ** (n - k);
  });
}
