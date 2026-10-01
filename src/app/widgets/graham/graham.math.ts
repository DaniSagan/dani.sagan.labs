import { modularPower } from '../modular/modular.math';

export interface KnuthResult {
  value: bigint | null;
  limit: 'digits' | 'work' | null;
}
export const EXACT_DIGITS = 200;

function integerIn(value: number, min: number, max: number): void {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new RangeError(`Introduce un entero entre ${min} y ${max}.`);
  }
}

/** Bounded hyperoperation evaluation. No intermediate BigInt exceeds 402 digits.
 * Bases >= 2 make the iterates monotone, so crossing the cap is conclusive. */
export function evaluateKnuth(
  base: number,
  arrows: number,
  operand: number,
): KnuthResult {
  integerIn(base, 2, 10);
  integerIn(arrows, 1, 4);
  integerIn(operand, 0, 6);
  const cap = 10n ** BigInt(EXACT_DIGITS) - 1n,
    overflow = cap + 1n;
  let work = 8000;
  const spend = () => {
    if (--work < 0) throw new Error('work');
  };
  const multiply = (a: bigint, b: bigint) => {
    spend();
    const p = a * b;
    return p > cap ? overflow : p;
  };
  const power = (exponent: bigint): bigint => {
    let result = 1n,
      factor = BigInt(base);
    while (exponent > 0n) {
      spend();
      if (exponent % 2n) {
        result = multiply(result, factor);
        if (result > cap) return overflow;
      }
      exponent /= 2n;
      if (exponent > 0n) factor = multiply(factor, factor);
    }
    return result;
  };
  const evaluate = (rank: number, b: bigint): bigint => {
    spend();
    if (rank === 1) return power(b);
    let result = 1n;
    for (let i = 0n; i < b; i++) {
      result = evaluate(rank - 1, result);
      if (result > cap) return overflow;
    }
    return result;
  };
  try {
    const value = evaluate(arrows, BigInt(operand));
    return value > cap
      ? { value: null, limit: 'digits' }
      : { value, limit: null };
  } catch {
    return { value: null, limit: 'work' };
  }
}

export function knuthTex(
  base: number,
  arrows: number,
  operand: number | string,
): string {
  return `${base}${'\\uparrow'.repeat(arrows)} ${operand}`;
}

export function expansionTex(
  base: number,
  arrows: number,
  operand: number,
): string {
  integerIn(base, 2, 10);
  integerIn(arrows, 1, 4);
  integerIn(operand, 0, 6);
  if (operand === 0) return '1';
  if (arrows === 1) return `${base}^{${operand}}`;
  if (operand === 1) return `${base}`;
  if (arrows === 2) {
    let tower = `${base}`;
    for (let i = 1; i < operand; i++)
      tower = `${base}^{\\left(${tower}\\right)}`;
    return tower;
  }
  return `${base}${'\\uparrow'.repeat(arrows - 1)}\\left(${knuthTex(base, arrows, operand - 1)}\\right)`;
}

export function grahamDefinition(level: number): string {
  integerIn(level, 1, 64);
  return level === 1
    ? 'g_1=3\\uparrow\\uparrow\\uparrow\\uparrow3'
    : `g_{${level}}=3\\uparrow^{g_{${level - 1}}}3${level === 64 ? '=G' : ''}`;
}

/** Euler's totient for moduli in the 10^d totient chain (only factors 2,5). */
function phiTwoFive(m: bigint): bigint {
  let result = m;
  if (m % 2n === 0n) result = result / 2n;
  if (m % 5n === 0n) result = (result / 5n) * 4n;
  return result;
}

export function decimalTotientChain(digits: number): bigint[] {
  integerIn(digits, 1, 30);
  const chain = [10n ** BigInt(digits)];
  while (chain[chain.length - 1] > 1n)
    chain.push(phiTwoFive(chain[chain.length - 1]));
  return chain;
}

/** Residue of 3 ↑↑ height, not iteration of 3^x modulo a fixed modulus.
 * 3 is coprime to every modulus in this chain, so Euler applies at each step. */
export function towerThreeSuffix(height: number, digits: number): string {
  integerIn(height, 0, 100);
  const chain = decimalTotientChain(digits);
  const residue = (h: number, depth: number): bigint => {
    const m = chain[depth];
    if (m === 1n) return 0n;
    if (h === 0) return 1n;
    return modularPower(3n, residue(h - 1, depth + 1), m).value;
  };
  return residue(height, 0).toString().padStart(digits, '0');
}

export function grahamSuffix(digits: number): {
  suffix: string;
  height: number;
  chain: bigint[];
} {
  const chain = decimalTotientChain(digits);
  // Once the chain reaches 1, no additional tower levels affect the residue.
  const height = chain.length - 1;
  return { suffix: towerThreeSuffix(height, digits), height, chain };
}
