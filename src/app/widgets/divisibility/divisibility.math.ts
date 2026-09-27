import { absolute } from '../euclid/euclid.math';
import { modulo } from '../modular/modular.math';

export const CRITERION_DIVISORS = [
  2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 18, 24, 25, 37, 99, 101,
] as const;

export interface DigitTerm {
  text: string;
  value: bigint;
  position: number;
  weight: bigint;
}

export interface CriterionStep {
  title: string;
  explanation: string;
  input: bigint;
  output: bigint;
  modulus: number;
  relation: 'congruence' | 'divisibility';
  formula: string;
  terms: DigitTerm[];
}

export function parseDecimal(text: string): bigint {
  if (!/^[+-]?\d{1,40}$/.test(text.trim())) {
    throw new RangeError(
      'Introduce un entero decimal de hasta 40 cifras, con signo opcional y sin separadores.',
    );
  }
  return BigInt(text.trim());
}

/** Terms are displayed in reading order; position zero is the rightmost block. */
export function decimalBlocks(
  n: bigint,
  size: number,
  alternating = false,
): DigitTerm[] {
  if (!Number.isInteger(size) || size < 1 || size > 150) {
    throw new RangeError('El tamaño del bloque debe estar entre 1 y 150.');
  }
  const text = absolute(n).toString();
  const terms: DigitTerm[] = [];
  for (let end = text.length, position = 0; end > 0; end -= size, position++) {
    const block = text.slice(Math.max(0, end - size), end);
    terms.push({
      text: block,
      value: BigInt(block),
      position,
      weight: alternating && position % 2 ? -1n : 1n,
    });
  }
  return terms.reverse();
}

const weightedSum = (terms: DigitTerm[]): bigint =>
  terms.reduce((sum, term) => sum + term.weight * term.value, 0n);

function simpleCriterion(n: bigint, modulus: number): CriterionStep[] {
  const steps: CriterionStep[] = [];
  let value = n;
  const trailing: Record<number, number> = {
    2: 1,
    4: 2,
    5: 1,
    8: 3,
    10: 1,
    25: 2,
  };
  const add = (step: Omit<CriterionStep, 'modulus'>): void => {
    steps.push({ ...step, modulus });
    value = step.output;
  };
  if (trailing[modulus]) {
    const k = trailing[modulus],
      power = 10n ** BigInt(k);
    const output = value % power;
    add({
      title: 'Conservar las últimas cifras',
      input: value,
      output,
      relation: 'congruence',
      explanation: `Como ${modulus} divide a 10^${k}, toda la parte anterior a las últimas ${k} cifras es un múltiplo de ${modulus}. Si hay menos cifras, se conserva el número entero.`,
      formula: `${value}=10^{${k}}\\cdot${value / power}+${output}\\equiv${output}\\pmod{${modulus}}`,
      terms: decimalBlocks(value, k).map((term) => ({
        ...term,
        weight: term.position === 0 ? 1n : 0n,
      })),
    });
  } else if (modulus === 3 || modulus === 9) {
    do {
      const terms = decimalBlocks(value, 1),
        output = weightedSum(terms);
      add({
        title: 'Sumar las cifras',
        input: value,
        output,
        relation: 'congruence',
        explanation: `10 ≡ 1 (mod ${modulus}); todas las potencias de 10 tienen peso 1. Se puede volver a sumar.`,
        formula: `${value}\\equiv${terms.map((term) => term.text).join('+')}=${output}\\pmod{${modulus}}`,
        terms,
      });
    } while (value >= 10n);
  } else if (modulus === 7 || modulus === 13) {
    while (absolute(value) >= 100n) {
      if (value < 0n) {
        add({
          title: 'Trabajar con el valor absoluto',
          input: value,
          output: -value,
          relation: 'divisibility',
          terms: [],
          explanation:
            'Cambiar el signo conserva la divisibilidad, aunque puede cambiar el resto.',
          formula: `${modulus}\\mid(${value})\\Longleftrightarrow${modulus}\\mid(${-value})`,
        });
      }
      const a = value / 10n,
        b = value % 10n,
        coefficient = modulus === 7 ? -2n : 4n;
      const output = a + coefficient * b;
      add({
        title:
          modulus === 7
            ? 'Restar el doble de la última cifra'
            : 'Sumar el cuádruple de la última cifra',
        input: value,
        output,
        relation: 'divisibility',
        explanation: `${value} = 10·${a} + ${b}. Transformamos en ${a} ${coefficient < 0n ? '− 2' : '+ 4'}·${b} = ${output}. El factor 10 es coprimo con ${modulus}, de modo que se puede cancelar. Paramos al bajar de 100 en valor absoluto.`,
        formula: `${value}\\equiv10\\cdot(${output})\\pmod{${modulus}},\\qquad${modulus}\\mid${value}\\Longleftrightarrow${modulus}\\mid(${output})`,
        terms: [
          { text: a.toString(), value: a, position: 1, weight: 1n },
          { text: b.toString(), value: b, position: 0, weight: coefficient },
        ],
      });
    }
  } else {
    const size = modulus === 37 ? 3 : modulus === 11 ? 1 : 2;
    const alternating = modulus === 11 || modulus === 101;
    const terms = decimalBlocks(value, size, alternating),
      output = weightedSum(terms);
    const expression = terms
      .map((term) => `${term.weight < 0n ? '-' : '+'}${term.value}`)
      .join('')
      .replace(/^\+/, '');
    add({
      title: alternating
        ? 'Alternar signos desde la derecha'
        : 'Sumar bloques desde la derecha',
      input: value,
      output,
      relation: 'congruence',
      terms,
      explanation: `10^${size} ≡ ${alternating ? '−1' : '1'} (mod ${modulus}). Los bloques de ${size} cifras llevan pesos ${alternating ? '+1, −1, +1, … contando desde la derecha' : 'iguales a 1'}. Los ceros dentro de un bloque conservan su posición.`,
      formula: `${value}\\equiv ${expression}=${output}\\pmod{${modulus}}`,
    });
  }
  const remainder = modulo(value, BigInt(modulus)),
    quotient = (value - remainder) / BigInt(modulus);
  steps.push({
    title: `Decidir la divisibilidad por ${modulus}`,
    input: value,
    output: value,
    modulus,
    relation: 'congruence',
    terms: [],
    explanation:
      remainder === 0n
        ? `${value} es múltiplo de ${modulus}. El criterio se cumple.`
        : `${value} deja resto ${remainder} al dividir entre ${modulus}. El criterio no se cumple.`,
    formula: `${value}=${modulus}\\cdot(${quotient})+${remainder}`,
  });
  return steps;
}

export function divisibilityTrace(input: bigint, modulus: number) {
  if (!(CRITERION_DIVISORS as readonly number[]).includes(modulus)) {
    throw new RangeError('Selecciona uno de los divisores del laboratorio.');
  }
  const n = absolute(input);
  const factors: Record<number, number[]> = {
    6: [2, 3],
    12: [3, 4],
    15: [3, 5],
    18: [2, 9],
    24: [3, 8],
  };
  const parts = factors[modulus] ?? [modulus];
  const steps: CriterionStep[] = [
    {
      title: 'Partir del entero y separar el signo',
      input,
      output: n,
      modulus,
      relation: 'divisibility',
      explanation:
        'Un entero y su opuesto tienen los mismos divisores. El cero es divisible por todos los divisores positivos. Las cifras describen el valor absoluto.',
      formula: `${modulus}\\mid(${input})\\Longleftrightarrow${modulus}\\mid${n}`,
      terms: [],
    },
  ];
  for (const part of parts) {
    steps.push(...simpleCriterion(n, part));
  }
  const checks = parts.map((divisor) => ({
    divisor,
    divisible: n % BigInt(divisor) === 0n,
  }));
  if (parts.length > 1) {
    steps.push({
      title: 'Combinar las dos comprobaciones',
      input: n,
      output: n,
      modulus,
      relation: 'divisibility',
      terms: [],
      explanation: `${modulus} = ${parts.join('·')} y los factores son coprimos. Deben cumplirse ambos criterios: ${checks.map((check) => `${check.divisor}: ${check.divisible ? 'sí' : 'no'}`).join('; ')}.`,
      formula: `${modulus}\\mid N\\Longleftrightarrow(${parts[0]}\\mid N\\ \\text{y}\\ ${parts[1]}\\mid N)`,
    });
  }
  return {
    input,
    modulus,
    steps,
    checks,
    divisible: checks.every((check) => check.divisible),
    remainder: modulo(input, BigInt(modulus)),
  };
}

export interface PowerPattern {
  kind: 'zero' | 'one' | 'minus-one';
  exponent: number;
}
export function discoverPowers(base: number, modulus: number) {
  if (
    !Number.isInteger(base) ||
    base < 2 ||
    base > 16 ||
    !Number.isInteger(modulus) ||
    modulus < 2 ||
    modulus > 150
  ) {
    throw new RangeError('Usa una base de 2 a 16 y un módulo de 2 a 150.');
  }
  const seen = new Map<number, number>(),
    values: number[] = [];
  let remainder = 1;
  while (!seen.has(remainder)) {
    seen.set(remainder, values.length);
    values.push(remainder);
    remainder = (remainder * base) % modulus;
  }
  const start = seen.get(remainder)!;
  const period = values.length - start;
  values.push(remainder);
  const patterns: PowerPattern[] = [];
  for (const [kind, target] of [
    ['zero', 0],
    ['one', 1],
    ['minus-one', modulus - 1],
  ] as const) {
    const exponent = values.findIndex((value, i) => i > 0 && value === target);
    if (exponent > 0) {
      patterns.push({ kind, exponent });
    }
  }
  return { base, modulus, values, start, period, patterns };
}

export function baseRepresentation(input: bigint, base: number) {
  if (!Number.isInteger(base) || base < 2 || base > 16) {
    throw new RangeError('La base debe ser un entero entre 2 y 16.');
  }
  const n = absolute(input),
    encoded = n.toString(base).toUpperCase();
  const digits = Array.from(encoded, (symbol, index) => ({
    symbol,
    value: parseInt(symbol, base),
    position: encoded.length - 1 - index,
  }));
  const sum = digits.reduce((acc, digit) => acc + digit.value, 0);
  const alternating = digits.reduce(
    (acc, digit) => acc + (digit.position % 2 ? -digit.value : digit.value),
    0,
  );
  const last = digits[digits.length - 1].value;
  const families = [
    {
      name: 'Última cifra',
      related: base,
      reduced: last,
      reason: `${base} ≡ 0`,
    },
    {
      name: 'Suma de cifras',
      related: base - 1,
      reduced: sum,
      reason: `${base} ≡ 1`,
    },
    {
      name: 'Suma alternada',
      related: base + 1,
      reduced: alternating,
      reason: `${base} ≡ −1`,
    },
  ].map((family) => ({
    ...family,
    divisors: Array.from({ length: family.related }, (_, i) => i + 1)
      .filter((d) => family.related % d === 0)
      .map((divisor) => ({
        divisor,
        divisible: modulo(BigInt(family.reduced), BigInt(divisor)) === 0n,
      })),
  }));
  return { n, base, encoded, digits, sum, alternating, last, families };
}
