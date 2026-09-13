export interface ComplexValue {
  re: number;
  im: number;
}
const add = (a: ComplexValue, b: ComplexValue): ComplexValue => ({
  re: a.re + b.re,
  im: a.im + b.im,
});
const mul = (a: ComplexValue, b: ComplexValue): ComplexValue => ({
  re: a.re * b.re - a.im * b.im,
  im: a.re * b.im + a.im * b.re,
});
const scale = (a: ComplexValue, k: number): ComplexValue => ({
  re: a.re * k,
  im: a.im * k,
});
const log = (a: ComplexValue): ComplexValue => ({
  re: Math.log(Math.hypot(a.re, a.im)),
  im: Math.atan2(a.im, a.re),
});
const exp = (a: ComplexValue): ComplexValue => ({
  re: Math.exp(a.re) * Math.cos(a.im),
  im: Math.exp(a.re) * Math.sin(a.im),
});
const div = (a: ComplexValue, b: ComplexValue): ComplexValue => {
  const norm = Math.hypot(b.re, b.im);
  return {
    re: (a.re * (b.re / norm) + a.im * (b.im / norm)) / norm,
    im: (a.im * (b.re / norm) - a.re * (b.im / norm)) / norm,
  };
};

// Lanczos log-gamma, used only for Re(z) > 1 in the reflection formula.
function logGamma(z: ComplexValue): ComplexValue {
  const coefficients = [
    676.5203681218851, -1259.1392167224028, 771.3234287776531,
    -176.6150291621406, 12.507343278686905, -0.13857109526572012,
    9.984369578019572e-6, 1.5056327351493116e-7,
  ];
  const w = add(z, { re: -1, im: 0 });
  let x = { re: 0.99999999999980993, im: 0 };
  coefficients.forEach(
    (c, i) => (x = add(x, div({ re: c, im: 0 }, add(w, { re: i + 1, im: 0 })))),
  );
  const t = add(w, { re: 7.5, im: 0 });
  return add(
    add(mul(add(w, { re: 0.5, im: 0 }), log(t)), scale(t, -1)),
    add({ re: 0.9189385332046727, im: 0 }, log(x)),
  );
}

// B_(2k)/(2k)!, Euler–Maclaurin (DLMF 25.2 / 25.11).
const bernoulli = [
  1 / 12,
  -1 / 720,
  1 / 30240,
  -1 / 1209600,
  1 / 47900160,
  -691 / 1307674368000,
  7 / 523069747200,
  -3617 / 10670622842880000,
  43867 / 5109094217170944000,
  -174611 / 802857662698291200000,
];

function eulerMaclaurin(s: ComplexValue, n: number): ComplexValue {
  let sum = { re: 0, im: 0 };
  for (let k = 1; k < n; k++) sum = add(sum, exp(scale(s, -Math.log(k))));
  const power = exp(scale(s, -Math.log(n)));
  sum = add(
    sum,
    add(div(scale(power, n), add(s, { re: -1, im: 0 })), scale(power, 0.5)),
  );
  let term = scale(mul(power, s), 1 / n);
  bernoulli.forEach((b, k) => {
    sum = add(sum, scale(term, b));
    term = mul(
      term,
      mul(
        scale(add(s, { re: 2 * k + 1, im: 0 }), 1 / n),
        scale(add(s, { re: 2 * k + 2, im: 0 }), 1 / n),
      ),
    );
  });
  return sum;
}

/** Double precision continuation. Throws instead of returning unreliable/nonfinite values. */
export function riemannZeta(re: number, im: number): ComplexValue {
  if (!Number.isFinite(re) || !Number.isFinite(im))
    throw new Error('Introduce dos números reales finitos.');
  if (re === 1 && im === 0)
    throw new Error(
      'En s = 1 hay un polo simple: ζ(s) no tiene un valor finito.',
    );
  if (re === 0 && im === 0) return { re: -0.5, im: 0 };
  if (im === 0 && re < 0 && Number.isSafeInteger(re) && re % 2 === 0)
    return { re: 0, im: 0 };
  if (Math.abs(im) > 100000 || Math.abs(re) > 10000)
    throw new Error(
      'Este punto supera el límite de cálculo del navegador (|Re(s)| ≤ 10000, |Im(s)| ≤ 100000).',
    );
  let result: ComplexValue;
  if (re < 0) {
    const s = { re, im };
    const reflected = riemannZeta(1 - re, -im);
    // Stable log(sin(πs/2)), avoiding sinh overflow at large imaginary parts.
    const x = (Math.PI * (re % 4)) / 2,
      y = (Math.PI * im) / 2;
    const decay = Math.exp(-2 * Math.abs(y));
    const sine = {
      re: Math.sin(x) * (1 + decay),
      im: Math.cos(x) * Math.sign(y) * (1 - decay),
    };
    const logSine = add(log(sine), { re: Math.abs(y) - Math.LN2, im: 0 });
    const factor = add(
      add(scale(s, Math.log(2 * Math.PI)), { re: -Math.log(Math.PI), im: 0 }),
      add(logSine, logGamma({ re: 1 - re, im: -im })),
    );
    result = exp(add(factor, log(reflected)));
  } else if (re > 60) {
    result = { re: 1, im: 0 }; // Tail is below double-precision resolution.
  } else {
    const n = Math.max(32, Math.ceil(Math.abs(im) / 2));
    const a = eulerMaclaurin({ re, im }, n);
    result = eulerMaclaurin({ re, im }, 2 * n);
    if (
      Math.hypot(a.re - result.re, a.im - result.im) >
      1e-8 * Math.max(1, Math.hypot(result.re, result.im))
    ) {
      throw new Error(
        'No se ha alcanzado una precisión estable para este punto.',
      );
    }
  }
  if (
    !Number.isFinite(result.re) ||
    !Number.isFinite(result.im) ||
    (re < 0 && result.re === 0 && result.im === 0)
  ) {
    throw new Error(
      'El resultado queda fuera del rango numérico representable.',
    );
  }
  return im === 0 ? { re: result.re, im: 0 } : result;
}

export function formatComplex(z: ComplexValue): string {
  return `${z.re.toPrecision(9)} ${z.im < 0 ? '−' : '+'} ${Math.abs(z.im).toPrecision(9)}i`;
}
