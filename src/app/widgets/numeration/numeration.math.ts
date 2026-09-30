import { absolute } from '../euclid/euclid.math';
import { modulo } from '../modular/modular.math';

export const DIGIT_SYMBOLS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export function checkBase(base: number): void {
  if (!Number.isInteger(base) || base < 2 || base > 36) {
    throw new RangeError('La base debe ser un entero entre 2 y 36.');
  }
}
export function parseNumeral(input: string, base: number): bigint {
  checkBase(base);
  const text = input.trim().toUpperCase();
  if (!/^[+-]?[0-9A-Z]{1,120}$/.test(text)) {
    throw new RangeError(
      'Escribe de 1 a 120 cifras, con signo opcional y sin espacios internos, prefijos ni separadores.',
    );
  }
  const negative = text.startsWith('-'),
    digits = text.replace(/^[+-]/, '');
  let value = 0n;
  for (const symbol of digits) {
    const digit = DIGIT_SYMBOLS.indexOf(symbol);
    if (digit >= base) {
      throw new RangeError(
        'La cifra ' + symbol + ' no pertenece a la base ' + base + '.',
      );
    }
    value = value * BigInt(base) + BigInt(digit);
  }
  return negative ? -value : value;
}
export interface DivisionDigit {
  dividend: bigint;
  quotient: bigint;
  remainder: bigint;
  symbol: string;
  position: number;
}
export function divisionDigits(value: bigint, base: number): DivisionDigit[] {
  checkBase(base);
  let n = absolute(value);
  const b = BigInt(base),
    steps: DivisionDigit[] = [];
  do {
    const quotient = n / b,
      remainder = n % b;
    steps.push({
      dividend: n,
      quotient,
      remainder,
      symbol: DIGIT_SYMBOLS[Number(remainder)],
      position: steps.length,
    });
    n = quotient;
  } while (n > 0n);
  return steps;
}
export function encodeNumeral(value: bigint, base: number): string {
  return (
    (value < 0n ? '-' : '') +
    divisionDigits(value, base)
      .reverse()
      .map((s) => s.symbol)
      .join('')
  );
}
export function positionalTerms(value: bigint, base: number) {
  checkBase(base);
  let weight = 1n;
  return divisionDigits(value, base)
    .map((row) => {
      const term = {
        symbol: row.symbol,
        digit: row.remainder,
        position: row.position,
        weight,
        contribution: row.remainder * weight,
      };
      weight *= BigInt(base);
      return term;
    })
    .reverse();
}
export function hornerTrace(value: bigint, base: number) {
  let accumulator = 0n;
  return positionalTerms(value, base).map((term) => {
    const before = accumulator;
    accumulator = before * BigInt(base) + term.digit;
    return { ...term, before, after: accumulator };
  });
}
export function digitCount(value: bigint, base: number): number {
  return divisionDigits(value, base).length;
}
export function binaryGroups(value: bigint, size: 3 | 4) {
  if (size !== 3 && size !== 4) {
    throw new RangeError('Agrupa de tres o cuatro bits.');
  }
  const binary = encodeNumeral(absolute(value), 2);
  const padded = binary.padStart(Math.ceil(binary.length / size) * size, '0');
  const blocks: { bits: string; symbol: string }[] = [];
  for (let i = 0; i < padded.length; i += size) {
    const bits = padded.slice(i, i + size);
    blocks.push({ bits, symbol: DIGIT_SYMBOLS[Number(parseNumeral(bits, 2))] });
  }
  return { negative: value < 0n, padded, blocks, targetBase: 2 ** size };
}
export function signedEncodings(value: bigint, width: number) {
  if (!Number.isInteger(width) || width < 2 || width > 64) {
    throw new RangeError('El ancho debe estar entre 2 y 64 bits.');
  }
  const modulus = 1n << BigInt(width),
    half = modulus / 2n;
  if (value < -half || value >= half) {
    throw new RangeError(
      'El entero debe estar entre ' + -half + ' y ' + (half - 1n) + '.',
    );
  }
  const bits = (n: bigint) => encodeNumeral(n, 2).padStart(width, '0');
  const magnitudeFits = absolute(value) < half;
  return {
    width,
    modulus,
    min: -half,
    max: half - 1n,
    unsigned: modulo(value, modulus),
    twos: bits(modulo(value, modulus)),
    signMagnitude: magnitudeFits
      ? bits(value < 0n ? half + absolute(value) : value)
      : null,
    ones: magnitudeFits
      ? bits(value < 0n ? modulus - 1n - absolute(value) : value)
      : null,
    negativeZeroSign: bits(half),
    negativeZeroOnes: bits(modulus - 1n),
  };
}
export function decodeTwos(bits: string): bigint {
  if (!/^[01]{2,64}$/.test(bits)) {
    throw new RangeError('Se necesitan entre 2 y 64 bits.');
  }
  const unsigned = parseNumeral(bits, 2);
  return bits[0] === '1' ? unsigned - (1n << BigInt(bits.length)) : unsigned;
}
