/** Chudnovsky with binary splitting and exact rational enclosure.
 * Algorithm reference: numberworld.org/y-cruncher/internals/binary-splitting.html
 * Adjacent partial sums enclose the alternating, decreasing series; an integer
 * square root encloses sqrt(10005). Accept only when both bounds truncate alike.
 */
export const MAX_PI_DIGITS = 1000000;
let detectedDigitLimit: number | undefined;
export function piDigitLimit(): number {
  if (detectedDigitLimit !== undefined) return detectedDigitLimit;
  try {
    // Probe a 128 KiB integer, not a user-agent string. Firefox/JavaScriptCore
    // reject this size; V8 supports it. Cache the result in each worker/UI realm.
    detectedDigitLimit = (1n << 1048576n) > 0n ? MAX_PI_DIGITS : 100000;
  } catch { detectedDigitLimit = 100000; }
  return detectedDigitLimit;
}
export interface PiProgress {
  stage: 'series' | 'sqrt' | 'verify'; completedTerms: number; totalTerms: number;
}
export interface PiResult {
  decimals: string; digits: number; terms: number; guardDigits: number; elapsedMs: number;
}
const A = 13591409n, B = 545140134n, C = 10939058860032000n;
type Sum = { p: bigint; q: bigint; t: bigint };
export function validateDigits(n: number): void {
  const maximum = piDigitLimit();
  if (!Number.isSafeInteger(n) || n < 0 || n > maximum) throw new Error(`Elige un número entero de decimales entre 0 y ${maximum}, el máximo compatible con este navegador.`);
}
export function validateBlockSize(size: number): void {
  if (!Number.isSafeInteger(size) || size < 0 || size > 1000) throw new Error('El tamaño de bloque debe ser un entero entre 0 y 1000 (0 = sin separación).');
}
export function integerSqrt(n: bigint): bigint {
  if (n < 0n) throw new Error('La raíz necesita un entero no negativo.');
  if (n < 2n) return n;
  let x = 1n << BigInt(Math.ceil(n.toString(2).length / 2));
  for (;;) { const y = (x + n / x) >> 1n; if (y >= x) return x; x = y; }
}
function leaf(k: number): Sum {
  if (k === 0) return { p: 1n, q: 1n, t: A };
  const b = BigInt(k), p = (6n * b - 5n) * (2n * b - 1n) * (6n * b - 1n);
  return { p, q: b ** 3n * C, t: p * (A + B * b) * (k % 2 ? -1n : 1n) };
}
function combine(left: Sum, right: Sum): Sum {
  return { p: left.p * right.p, q: left.q * right.q, t: left.t * right.q + left.p * right.t };
}
export function calculatePi(digits: number, progress: (p: PiProgress) => void = () => {}): PiResult {
  validateDigits(digits);
  const started = performance.now();
  // Extra precision is a starting estimate, never the correctness criterion.
  for (let guardDigits = 24; ; guardDigits += 16) {
    const precision = digits + guardDigits, terms = Math.ceil(precision / 14) + 1;
    let completedTerms = 0;
    const totalTerms = terms + 1; // Includes the adjacent sum used for certification.
    progress({ stage: 'series', completedTerms, totalTerms });
    const split = (a: number, b: number): Sum => {
      if (b - a === 1) {
        completedTerms++;
        if (completedTerms % 128 === 0) progress({ stage: 'series', completedTerms, totalTerms });
        return leaf(a);
      }
      const m = Math.floor((a + b) / 2);
      return combine(split(a, m), split(m, b));
    };
    const sum = split(0, terms), next = combine(sum, leaf(terms));
    progress({ stage: 'sqrt', completedTerms: totalTerms, totalTerms });
    const scale = 10n ** BigInt(precision), root = integerSqrt(10005n * scale * scale);
    progress({ stage: 'verify', completedTerms: totalTerms, totalTerms });
    // The next term has sign (-1)^terms. Use that ordering directly:
    // cross-multiplying these fractions needlessly doubles intermediate sizes
    // and exceeds Firefox/Safari's 2^20-bit BigInt ceiling at 100000 digits.
    const lowerSum = terms % 2 === 0 ? sum : next;
    const upperSum = lowerSum === sum ? next : sum;
    const guardScale = 10n ** BigInt(guardDigits);
    const lowerPi = 426880n * root * upperSum.q / (upperSum.t * guardScale);
    const upperPi = 426880n * (root + 1n) * lowerSum.q / (lowerSum.t * guardScale);
    if (lowerPi !== upperPi) continue;
    const allDigits = lowerPi.toString();
    if (allDigits.length !== digits + 1 || allDigits[0] !== '3') throw new Error('No se pudo verificar el formato del resultado.');
    return { decimals: allDigits.slice(1), digits, terms: totalTerms, guardDigits, elapsedMs: performance.now() - started };
  }
}
export function digitBlocks(decimals: string, size: number): string[] {
  validateBlockSize(size);
  if (!decimals) return [];
  if (size === 0) return [decimals];
  const blocks: string[] = [];
  for (let i = 0; i < decimals.length; i += size) blocks.push(decimals.slice(i, i + size));
  return blocks;
}
export function piText(decimals: string, blockSize: number, grouped: boolean): string {
  validateBlockSize(blockSize);
  if (!grouped || blockSize === 0) return '3' + (decimals ? '.' + decimals : '') + '\n';
  const blocks = digitBlocks(decimals, blockSize);
  return (decimals ? ['3.', ...blocks] : ['3']).join('\r\n') + '\r\n';
}
