export const MAX_FIBONACCI_INDEX = 1000;

export function fibonacciSequence(n: number): bigint[] {
  if (!Number.isInteger(n) || n < 0 || n > MAX_FIBONACCI_INDEX) {
    throw new Error(`Introduce un índice entero entre 0 y ${MAX_FIBONACCI_INDEX}.`);
  }
  const values = [0n];
  if (n > 0) values.push(1n);
  for (let i = 2; i <= n; i++) values.push(values[i - 1] + values[i - 2]);
  return values;
}

export interface FibonacciSquare { x: number; y: number; size: number; index: number; }

/** Add consecutive squares around the bounding rectangle: right, down, left, up. */
export function fibonacciSquares(count: number): FibonacciSquare[] {
  if (!Number.isInteger(count) || count < 2 || count > 10) throw new Error('Elige entre 2 y 10 cuadrados.');
  const values = fibonacciSequence(count);
  const squares: FibonacciSquare[] = [{ x: 0, y: 0, size: 1, index: 1 }];
  let left = 0, top = 0, right = 1, bottom = 1;
  for (let i = 2; i <= count; i++) {
    const size = Number(values[i]);
    let x = left, y = top;
    switch ((i - 2) % 4) {
      case 0: x = right; right += size; break;
      case 1: y = bottom; bottom += size; break;
      case 2: x = left - size; left = x; break;
      case 3: y = top - size; top = y; break;
    }
    squares.push({ x, y, size, index: i });
  }
  return squares;
}
