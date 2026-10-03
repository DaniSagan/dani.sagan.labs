import { DIGIT_SYMBOLS } from '../numeration/numeration.math';

export interface Rational {
  n: bigint;
  d: bigint;
}
export interface Value {
  re: Rational;
  im: Rational;
}
export interface Term {
  digit: string;
  position: number;
  weight: string;
  contribution: string;
}
export interface Representation {
  text: string;
  exact: boolean;
  note: string;
  steps: string[];
  terms: Term[];
}
const abs = (n: bigint) => (n < 0n ? -n : n);
export function rational(n: bigint, d = 1n): Rational {
  if (!d) throw Error('El denominador no puede ser cero.');
  if (d < 0n) {
    n = -n;
    d = -d;
  }
  let a = abs(n),
    b = d;
  while (b) {
    const r = a % b;
    a = b;
    b = r;
  }
  return { n: n / a, d: d / a };
}
const add = (a: Rational, b: Rational) =>
  rational(a.n * b.d + b.n * a.d, a.d * b.d);
const mul = (a: Rational, b: Rational) => rational(a.n * b.n, a.d * b.d);
export const fractionText = (r: Rational) =>
  r.d === 1n ? String(r.n) : `${r.n}/${r.d}`;
export const valueText = (v: Value) =>
  v.im.n
    ? `${fractionText(v.re)} ${v.im.n < 0n ? '−' : '+'} ${fractionText(rational(abs(v.im.n), v.im.d))}i`
    : fractionText(v.re);
function checkBase(base: number): void {
  if (!Number.isInteger(base) || Math.abs(base) < 2 || Math.abs(base) > 36)
    throw Error('La base entera debe cumplir 2 ≤ |β| ≤ 36.');
}
/** Exact positional evaluation, including fractional digits and negative bases. */
export function parsePositional(input: string, base: number): Rational {
  checkBase(base);
  const text = input.trim().toUpperCase();
  if (!/^[+-]?[0-9A-Z]+(?:\.[0-9A-Z]+)?$/.test(text) || text.length > 120)
    throw Error('Usa hasta 120 caracteres: cifras 0–9, A–Z y punto decimal.');
  const negative = text[0] === '-',
    parts = text.replace(/^[+-]/, '').split('.');
  let n = 0n;
  for (const c of parts.join('')) {
    const digit = DIGIT_SYMBOLS.indexOf(c);
    if (digit >= Math.abs(base))
      throw Error(`La cifra ${c} no pertenece a la base ${base}.`);
    n = n * BigInt(base) + BigInt(digit);
  }
  return rational(
    negative ? -n : n,
    BigInt(base) ** BigInt(parts[1]?.length || 0),
  );
}
export function parseValue(input: string, base: number): Value {
  const text = input.replace(/\s/g, '').replace(/−/g, '-');
  if (text.length > 120)
    throw Error('Entrada demasiado larga (máximo 120 caracteres).');
  const scalar = (s: string): Rational => {
    const pieces = s.split('/');
    if (pieces.length > 2) throw Error('Usa una sola barra de fracción.');
    const a = parsePositional(pieces[0], base);
    if (pieces.length === 1) return a;
    const b = parsePositional(pieces[1], base);
    return rational(a.n * b.d, a.d * b.n);
  };
  if (!text.endsWith('i')) return { re: scalar(text), im: rational(0n) };
  if (base !== 10)
    throw Error('Introduce complejos a + bi con origen decimal.');
  const body = text.slice(0, -1);
  const split = Math.max(body.lastIndexOf('+'), body.lastIndexOf('-'));
  const imaginary = (s: string) =>
    scalar(s === '' || s === '+' ? '1' : s === '-' ? '-1' : s);
  return split > 0
    ? { re: scalar(body.slice(0, split)), im: imaginary(body.slice(split)) }
    : { re: rational(0n), im: imaginary(body) };
}
export function integerRepresentation(
  n: bigint,
  base: number,
  balanced = false,
): Representation {
  checkBase(base);
  if (balanced && base !== 3)
    throw Error('El sistema balanceado implementado usa base 3.');
  const sign = base > 0 && !balanced && n < 0n ? '-' : '';
  let current = sign ? -n : n;
  const digits: string[] = [],
    steps: string[] = [],
    terms: Term[] = [];
  const b = BigInt(base),
    modulus = abs(b);
  do {
    let digit = ((current % modulus) + modulus) % modulus;
    if (balanced && digit === 2n) digit = -1n;
    const quotient = (current - digit) / b;
    const symbol = balanced
      ? digit === -1n
        ? '−'
        : digit === 1n
          ? '+'
          : '0'
      : DIGIT_SYMBOLS[Number(digit)];
    const position = digits.length,
      weight = b ** BigInt(position);
    steps.push(`${current} = ${base} · (${quotient}) + (${digit})`);
    terms.push({
      digit: symbol,
      position,
      weight: String(weight),
      contribution: String((sign ? -digit : digit) * weight),
    });
    digits.push(symbol);
    current = quotient;
  } while (current !== 0n);
  return {
    text: sign + digits.reverse().join(''),
    exact: true,
    steps,
    terms: terms.reverse(),
    note: balanced
      ? 'Dígitos −, 0, + = −1, 0, +1. Sin signo externo.'
      : 'Restos no negativos; se leen de abajo arriba. Escritura finita canónica.',
  };
}
export function positiveExpansion(
  value: Rational,
  base: number,
  precision: number,
): Representation {
  checkBase(base);
  if (base < 0)
    throw Error('Este algoritmo fraccionario requiere base positiva.');
  const result = integerRepresentation(abs(value.n) / value.d, base);
  if (value.n < 0n) {
    result.text = '-' + result.text;
    result.terms.forEach(
      (t) => (t.contribution = String(-BigInt(t.contribution))),
    );
  }
  let remainder = abs(value.n) % value.d;
  const seen = new Map<bigint, number>(),
    digits: string[] = [];
  let repeat = -1;
  while (remainder && digits.length < precision) {
    if (seen.has(remainder)) {
      repeat = seen.get(remainder)!;
      break;
    }
    seen.set(remainder, digits.length);
    const before = remainder;
    remainder *= BigInt(base);
    const digit = remainder / value.d;
    remainder %= value.d;
    result.steps.push(
      `${before}/${value.d} × ${base} → cifra ${digit}; resto ${remainder}/${value.d}`,
    );
    digits.push(DIGIT_SYMBOLS[Number(digit)]);
    const denominator = BigInt(base) ** BigInt(digits.length);
    result.terms.push({
      digit: digits[digits.length - 1],
      position: -digits.length,
      weight: `1/${denominator}`,
      contribution: fractionText(
        rational(value.n < 0n ? -digit : digit, denominator),
      ),
    });
  }
  if (remainder && repeat < 0 && seen.has(remainder))
    repeat = seen.get(remainder)!;
  if (digits.length)
    result.text +=
      '.' +
      (repeat >= 0
        ? digits.slice(0, repeat).join('') +
          '(' +
          digits.slice(repeat).join('') +
          ')'
        : digits.join('') + (remainder ? '…' : ''));
  result.exact = !remainder || repeat >= 0;
  result.note =
    repeat >= 0
      ? 'Exacta y periódica: los paréntesis indican el bloque que se repite. Un resto repetido certifica el período.'
      : remainder
        ? `Truncada a ${precision} cifras fraccionarias; error absoluto < ${base}^−${precision}. No se ha determinado el período completo.`
        : 'Exacta y finita. La convención elige la escritura terminada, aunque existe otra con cola de cifras máximas.';
  return result;
}
export function rationalBase(n: bigint, p: number, q: number): Representation {
  if (n < 0n) throw Error('El preset p/q admite enteros no negativos.');
  let current = n;
  const digits: string[] = [],
    steps: string[] = [],
    terms: Term[] = [];
  do {
    const scaled = BigInt(q) * current,
      digit = scaled % BigInt(p),
      quotient = scaled / BigInt(p);
    const k = digits.length;
    const weight = rational(BigInt(p) ** BigInt(k), BigInt(q) ** BigInt(k + 1));
    digits.push(String(digit));
    steps.push(`${q} · ${current} = ${p} · ${quotient} + ${digit}`);
    terms.push({
      digit: String(digit),
      position: k,
      weight: fractionText(weight),
      contribution: fractionText(mul(rational(digit), weight)),
    });
    current = quotient;
  } while (current);
  return {
    text: digits.reverse().join(''),
    exact: true,
    steps,
    terms: terms.reverse(),
    note: `Convención Akiyama–Frougny–Sakarovitch: valor = Σ (aₖ/${q})(${p}/${q})ᵏ; dígitos 0…${p - 1}. NO se interpreta como Σ aₖβᵏ.`,
  };
}
// Q(φ): exact arithmetic (a + bφ)/d, using φ² = φ + 1.
export interface Golden {
  a: bigint;
  b: bigint;
  d: bigint;
}
function goldenSign(a: bigint, b: bigint): number {
  const x = 2n * a + b;
  if (!b) return x < 0n ? -1 : x > 0n ? 1 : 0;
  if (x >= 0n && b > 0n) return 1;
  if (x <= 0n && b < 0n) return -1;
  const cmp = x * x - 5n * b * b;
  return x > 0n ? (cmp > 0n ? 1 : -1) : cmp > 0n ? -1 : 1;
}
function phiPower(k: number): [bigint, bigint] {
  let a = 1n,
    b = 0n;
  for (let i = 0; i < Math.abs(k); i++)
    [a, b] = k >= 0 ? [b, a + b] : [b - a, a];
  return [a, b];
}
export function goldenExpansion(v: Golden, precision: number): Representation {
  const negative = goldenSign(v.a, v.b) < 0;
  let a = negative ? -v.a : v.a,
    b = negative ? -v.b : v.b;
  let top = 0;
  while (top < 600) {
    const [pa, pb] = phiPower(top + 1);
    if (goldenSign(a - v.d * pa, b - v.d * pb) < 0) break;
    top++;
  }
  if (top === 600)
    throw Error('Valor demasiado grande para el explorador de φ.');
  let text = '',
    steps: string[] = [],
    terms: Term[] = [];
  for (let k = top; k >= -precision; k--) {
    if (k === -1) text += '.';
    const [pa, pb] = phiPower(k),
      take = goldenSign(a - v.d * pa, b - v.d * pb) >= 0;
    text += take ? '1' : '0';
    if (take) {
      a -= v.d * pa;
      b -= v.d * pb;
      terms.push({
        digit: '1',
        position: k,
        weight: `φ^${k}`,
        contribution: `${negative ? '−' : ''}φ^${k}`,
      });
    }
    steps.push(
      `φ^${k}: cifra ${take ? 1 : 0}; resto exacto (${a} + (${b})φ)/${v.d}`,
    );
    if (!a && !b && k <= 0) break;
  }
  const exact = !a && !b;
  return {
    text: (negative ? '-' : '') + text + (exact ? '' : '…'),
    exact,
    steps,
    terms,
    note: exact
      ? 'Finita exacta en Q(φ). Selección voraz, sin unos adyacentes; excluye las colas alternativas infinitas.'
      : `Prefijo exacto calculado en Q(φ), truncado a ${precision} posiciones fraccionarias; error < φ^−${precision}. No certifica periodicidad.`,
  };
}
export function realExpansion(
  value: Rational,
  beta: number,
  precision: number,
): Representation {
  let x = Number(abs(value.n)) / Number(value.d);
  if (!Number.isFinite(x) || x > 1e12)
    throw Error('Las β-expansiones aproximadas admiten |x| ≤ 10¹².');
  let top = x ? Math.max(0, Math.floor(Math.log(x) / Math.log(beta))) : 0;
  while (beta ** (top + 1) <= x) top++;
  const reliable = Math.min(
    precision,
    Math.max(0, Math.floor(13 / Math.log10(beta)) - top),
  );
  let text = '';
  const steps: string[] = [],
    terms: Term[] = [];
  for (let k = top; k >= -reliable; k--) {
    if (k === -1) text += '.';
    const weight = beta ** k,
      digit = Math.min(Math.ceil(beta) - 1, Math.floor(x / weight));
    x -= digit * weight;
    text += DIGIT_SYMBOLS[digit];
    steps.push(
      `Peso β^${k} ≈ ${weight.toPrecision(7)}; cifra ${digit}; resto ≈ ${x.toPrecision(7)}`,
    );
    if (digit)
      terms.push({
        digit: String(digit),
        position: k,
        weight: `β^${k}`,
        contribution: `≈ ${(digit * weight * (value.n < 0n ? -1 : 1)).toPrecision(7)}`,
      });
  }
  return {
    text: (value.n < 0n ? '-' : '') + text + '…',
    exact: false,
    steps,
    terms,
    note: `Aproximación voraz en IEEE-754 (≈15 cifras decimales significativas). Solicitadas ${precision} posiciones; mostradas ${reliable} fraccionarias para limitar la propagación del error. No certifica terminación, unicidad ni periodicidad.`,
  };
}
export function otherSystem(
  n: bigint,
  system: 'factorial' | 'zeckendorf',
): Representation {
  if (n < 0n) throw Error('Este sistema admite enteros no negativos.');
  const terms: Term[] = [],
    steps: string[] = [],
    digits: string[] = [];
  let remaining = n;
  if (system === 'factorial') {
    let radix = 2n,
      weight = 1n;
    do {
      const digit = remaining % radix,
        quotient = remaining / radix;
      const k = Number(radix - 1n);
      digits.push(String(digit));
      terms.push({
        digit: String(digit),
        position: k,
        weight: `${k}! = ${weight}`,
        contribution: String(digit * weight),
      });
      steps.push(`${remaining} ÷ ${radix} = ${quotient}, resto ${digit}`);
      remaining = quotient;
      weight *= radix;
      radix++;
    } while (remaining);
    return {
      text: digits.reverse().join(' : ') + ' : 0',
      exact: true,
      terms: terms.reverse(),
      steps,
      note: 'Cifras separadas por «:»; pesos k!, 0 ≤ aₖ ≤ k. La posición 0! tiene cifra obligatoria 0. Relacionado con el código de Lehmer de permutaciones.',
    };
  }
  const weights = [1n, 2n];
  while (weights[weights.length - 1] <= n)
    weights.push(weights[weights.length - 1] + weights[weights.length - 2]);
  while (weights.length > 1 && weights[weights.length - 1] > n) weights.pop();
  for (let k = weights.length - 1; k >= 0; k--) {
    const digit = remaining >= weights[k] ? 1n : 0n;
    remaining -= digit * weights[k];
    digits.push(String(digit));
    terms.push({
      digit: String(digit),
      position: k,
      weight: String(weights[k]),
      contribution: String(digit * weights[k]),
    });
    if (digit) steps.push(`Elegir ${weights[k]}; queda ${remaining}.`);
  }
  return {
    text: digits.join(''),
    exact: true,
    steps,
    terms,
    note: 'Pesos 1, 2, 3, 5, 8…; unos no consecutivos. Descomposición única de Zeckendorf (incluimos 0 como cadena 0).',
  };
}
export function quaterImaginary(v: Value): Representation {
  if (v.re.d !== 1n || v.im.d !== 1n)
    throw Error(
      'Este conversor 2i admite enteros gaussianos a + bi. Otros complejos pueden requerir expansiones infinitas.',
    );
  const odd = ((v.im.n % 2n) + 2n) % 2n;
  // a₋₁=2 contributes −i; the remaining imaginary part is even.
  const real = integerRepresentation(v.re.n, -4),
    imaginary = integerRepresentation((v.im.n + odd) / 2n, -4);
  const re = real.text.split('').reverse(),
    im = imaginary.text.split('').reverse();
  const digits: string[] = [];
  for (let k = 0; k < Math.max(re.length, im.length); k++)
    digits.push(re[k] || '0', im[k] || '0');
  while (digits.length > 1 && digits[digits.length - 1] === '0') digits.pop();
  const terms = digits
    .map((digit, k): Term => {
      const w = (k % 2 ? 2n : 1n) * (-4n) ** BigInt(Math.floor(k / 2));
      return {
        digit,
        position: k,
        weight: String(w) + (k % 2 ? 'i' : ''),
        contribution: String(BigInt(digit) * w) + (k % 2 ? 'i' : ''),
      };
    })
    .reverse();
  if (odd)
    terms.push({
      digit: '2',
      position: -1,
      weight: '−i/2',
      contribution: '−i',
    });
  return {
    text: digits.reverse().join('') + (odd ? '.2' : ''),
    exact: true,
    terms,
    steps: [
      `Separar parte real ${v.re.n} y parte imaginaria ${v.im.n}.`,
      ...(odd
        ? [
            'Añadir cifra fraccionaria 2: 2(2i)^−1 = −i; compensar +i en la parte entera.',
          ]
        : []),
      'Codificar la parte real en −4 (posiciones pares).',
      ...real.steps,
      'Codificar la mitad de la parte imaginaria compensada en −4 (posiciones impares).',
      ...imaginary.steps,
      'Intercalar ambas cadenas.',
    ],
    note: 'Exacta, dígitos 0–3. Las partes imaginarias impares necesitan la posición −1. 3 + 2i = 13₂ᵢ.',
  };
}
export function convert(
  v: Value,
  target: string,
  precision: number,
): Representation {
  if (![10, 20, 50].includes(precision))
    throw Error('Precisión admitida: 10, 20 o 50.');
  if (target === '2i') return quaterImaginary(v);
  if (v.im.n) throw Error('El destino elegido solo representa valores reales.');
  if (target === 'phi')
    return goldenExpansion({ a: v.re.n, b: 0n, d: v.re.d }, precision);
  const beta = (
    { sqrt2: Math.SQRT2, e: Math.E, pi: Math.PI } as Record<string, number>
  )[target];
  if (beta) return realExpansion(v.re, beta, precision);
  if (/^\d+$/.test(target))
    return positiveExpansion(v.re, Number(target), precision);
  if (v.re.d !== 1n)
    throw Error(
      'Este preset admite enteros; elige una base positiva o β real para fracciones.',
    );
  if (/^-\d+$/.test(target))
    return integerRepresentation(v.re.n, Number(target));
  if (target === 'balanced') return integerRepresentation(v.re.n, 3, true);
  if (target === 'factorial' || target === 'zeckendorf')
    return otherSystem(v.re.n, target);
  if (['3/2', '4/3', '5/2'].includes(target)) {
    const [p, q] = target.split('/').map(Number);
    return rationalBase(v.re.n, p, q);
  }
  throw Error('Sistema de destino desconocido.');
}

/** Decoders use each system's weights, rather than parseInt. */
export function parseSystem(input: string, source: string): Value {
  if (/^-?\d+$/.test(source)) return parseValue(input, Number(source));
  const text = input.trim().replace(/−/g, '-');
  if (text.length > 120)
    throw Error('Entrada demasiado larga (máximo 120 caracteres).');
  let re = rational(0n),
    im = rational(0n);
  if (source === 'balanced') {
    if (!/^[+0-]+$/.test(text))
      throw Error('Usa exclusivamente las cifras +, 0 y −.');
    for (const c of text)
      re = add(
        mul(re, rational(3n)),
        rational(c === '+' ? 1n : c === '-' ? -1n : 0n),
      );
  } else if (source === '2i') {
    if (!/^[0-3]+(?:\.[0-3]+)?$/.test(text))
      throw Error('En base 2i usa cifras 0–3 y punto opcional.');
    const parts = text.split('.'),
      count = parts[0].length;
    for (const [index, digit] of Array.from(parts.join('')).entries()) {
      const k = count - index - 1;
      const power = Math.floor(k / 2),
        p =
          power >= 0
            ? rational((-4n) ** BigInt(power))
            : rational(1n, (-4n) ** BigInt(-power));
      const term = mul(rational(BigInt(digit) * (k % 2 ? 2n : 1n)), p);
      if (k % 2) im = add(im, term);
      else re = add(re, term);
    }
  } else if (source === 'factorial') {
    const digits = text.split(':').map((s) => s.trim());
    if (
      digits.some((s) => !/^\d+$/.test(s)) ||
      digits[digits.length - 1] !== '0'
    )
      throw Error('Usa cifras separadas por : y termina con la cifra 0 de 0!.');
    let weight = 1n;
    for (let k = 0; k < digits.length; k++) {
      if (k) weight *= BigInt(k);
      const digit = BigInt(digits[digits.length - k - 1]);
      if (digit > BigInt(k))
        throw Error(`La cifra de ${k}! debe estar entre 0 y ${k}.`);
      re = add(re, rational(digit * weight));
    }
  } else if (source === 'zeckendorf') {
    if (!/^[01]+$/.test(text) || text.includes('11'))
      throw Error('Zeckendorf usa bits sin unos consecutivos.');
    let a = 1n,
      b = 2n;
    for (const c of Array.from(text).reverse()) {
      if (c === '1') re = add(re, rational(a));
      [a, b] = [b, a + b];
    }
  } else if (['3/2', '4/3', '5/2'].includes(source)) {
    const [p, q] = source.split('/').map(BigInt);
    if (!/^\d+$/.test(text))
      throw Error('Usa una cadena de cifras sin punto ni signo.');
    for (const c of text) {
      if (BigInt(c) >= p) throw Error('Cifra fuera del alfabeto p/q.');
      re = add(mul(re, rational(p, q)), rational(BigInt(c), q));
    }
  } else throw Error('Origen no compatible.');
  return { re, im };
}
