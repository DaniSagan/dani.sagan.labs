export function integerSqrt(n: bigint): bigint {
  if (n < 0n) throw new Error('Raíz de un entero negativo.');
  if (n < 2n) return n;
  let x = 1n << BigInt(Math.ceil(n.toString(2).length / 2));
  for (;;) { const y = (x + n / x) / 2n; if (y >= x) return x; x = y; }
}
export function spiralValue(x: bigint, y: bigint): bigint {
  const abs = (n: bigint) => n < 0n ? -n : n;
  const r = abs(x) > abs(y) ? abs(x) : abs(y);
  if (r === 0n) return 1n;
  const max = (2n * r + 1n) ** 2n;
  if (y === -r) return max - (r - x);
  if (x === -r) return max - 2n * r - (y + r);
  if (y === r) return max - 4n * r - (x + r);
  return max - 6n * r - (r - y);
}
export function spiralPosition(n: bigint): { x: bigint; y: bigint } {
  if (n < 1n) throw new Error('Introduce un entero positivo.');
  if (n === 1n) return { x: 0n, y: 0n };
  const r = (integerSqrt(n - 1n) + 1n) / 2n;
  const d = (2n * r + 1n) ** 2n - n, side = 2n * r;
  if (d < side) return { x: r - d, y: -r };
  if (d < 2n * side) return { x: -r, y: -r + d - side };
  if (d < 3n * side) return { x: -r + d - 2n * side, y: r };
  return { x: r, y: r - (d - 3n * side) };
}
export type PrimeState = 'unit' | 'composite' | 'prime' | 'probable';
// Cooperative operations keep navigation/cancellation available during large tests.
export function* classifyPrime(n: bigint): Generator<void, PrimeState> {
  if (n === 1n) return 'unit';
  for (const p of [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n]) {
    if (n === p) return 'prime';
    if (n % p === 0n) return 'composite';
  }
  if (n <= 1000000n) {
    for (let d = 41n; d * d <= n; d += 2n) { if (n % d === 0n) return 'composite'; yield; }
    return 'prime';
  }
  let d = n - 1n, s = 0;
  while (d % 2n === 0n) { d /= 2n; s++; yield; }
  for (const base of [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n]) {
    let exponent = d, power = base, x = 1n;
    while (exponent > 0n) {
      if (exponent % 2n) x = x * power % n;
      power = power * power % n; exponent /= 2n; yield;
    }
    if (x === 1n || x === n - 1n) continue;
    let passes = false;
    for (let j = 1; j < s; j++) { x = x * x % n; yield; if (x === n - 1n) { passes = true; break; } }
    if (!passes) return 'composite';
  }
  return 'probable';
}
