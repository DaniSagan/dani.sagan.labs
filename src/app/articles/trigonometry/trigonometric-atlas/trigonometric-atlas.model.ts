export type TrigFamily = 'circular' | 'historical' | 'inverse' | 'hyperbolic' | 'inverse-hyperbolic' | 'historical-inverse' | 'bridges';
export interface TrigEntry {
  id: string; name: string; family: TrigFamily; formula: string; domain: string; range: string; period: string;
  input: 'angle' | 'real'; output: 'angle' | 'real'; sample: number; window: [number, number];
  valid: (x: number) => boolean; compute: (x: number) => number;
  poles?: { offset: number; period: number };
}
export const TRIG_FAMILIES: { id: TrigFamily; title: string }[] = [
  { id: 'circular', title: 'Circulares clásicas' }, { id: 'historical', title: 'Históricas y semiversos' },
  { id: 'inverse', title: 'Inversas circulares' }, { id: 'hyperbolic', title: 'Hiperbólicas' },
  { id: 'inverse-hyperbolic', title: 'Inversas hiperbólicas' },
  { id: 'historical-inverse', title: 'Inversas de las históricas' }, { id: 'bridges', title: 'Puentes y funciones relacionadas' },
];
const P = Math.PI, R = 'ℝ', bounded = (lo: number, hi: number) => (x: number) => x >= lo && x <= hi;
const sinPoles = { offset: 0, period: P }, cosPoles = { offset: P / 2, period: P };
export function atPole(x: number, pole: { offset: number; period: number }): boolean {
  // Match representable multiples exactly, without excluding small nonzero x.
  return x === pole.offset + Math.round((x - pole.offset) / pole.period) * pole.period;
}
const sinOK = (x: number) => !atPole(x, sinPoles), cosOK = (x: number) => !atPole(x, cosPoles);
const vers = (x: number) => 2 * Math.sin(x / 2) ** 2;
const covers = (x: number) => 2 * Math.sin((P / 2 - x) / 2) ** 2;
function make(family: TrigFamily, id: string, name: string, formula: string, domain: string, range: string,
  compute: (x: number) => number, options: Partial<Omit<TrigEntry, 'id' | 'name' | 'family' | 'formula' | 'domain' | 'range' | 'compute'>> = {}): TrigEntry {
  const inverse = family === 'inverse' || family === 'historical-inverse';
  const angular = family === 'circular' || family === 'historical';
  return { id, family, name, formula, domain, range, compute, valid: () => true,
    input: angular ? 'angle' : 'real', output: inverse ? 'angle' : 'real', sample: angular ? P / 3 : .5,
    window: angular ? [-P, P] : inverse ? [-2, 2] : [-3, 3], period: angular ? '2π' : 'No periódico en ℝ', ...options };
}
const historical = (id: string, name: string, formula: string, compute: (x: number) => number, half = false) =>
  make('historical', id, name, formula, R, half ? '[0, 1]' : '[0, 2]', compute);
const invHistorical = (id: string, name: string, formula: string, compute: (x: number) => number, half = false, sine = false) =>
  make('historical-inverse', id, name, formula, half ? '[0, 1]' : '[0, 2]', sine ? '[−π/2, π/2]' : '[0, π]', compute,
    { valid: bounded(0, half ? 1 : 2), window: [0, half ? 1 : 2], sample: half ? .25 : .5 });
export const TRIG_FUNCTIONS: readonly TrigEntry[] = [
  make('circular', 'sin', 'Seno', 'sin x', R, '[−1, 1]', Math.sin),
  make('circular', 'cos', 'Coseno', 'cos x', R, '[−1, 1]', Math.cos),
  make('circular', 'tan', 'Tangente', 'sin x / cos x', 'ℝ excepto π/2 + kπ', R, Math.tan, { valid: cosOK, period: 'π', poles: cosPoles }),
  make('circular', 'cot', 'Cotangente', 'cos x / sin x', 'ℝ excepto kπ', R, x => Math.cos(x) / Math.sin(x), { valid: sinOK, period: 'π', poles: sinPoles }),
  make('circular', 'sec', 'Secante', '1 / cos x', 'ℝ excepto π/2 + kπ', '(−∞, −1] ∪ [1, ∞)', x => 1 / Math.cos(x), { valid: cosOK, poles: cosPoles }),
  make('circular', 'csc', 'Cosecante', '1 / sin x', 'ℝ excepto kπ', '(−∞, −1] ∪ [1, ∞)', x => 1 / Math.sin(x), { valid: sinOK, poles: sinPoles }),
  historical('vers', 'Verseno (seno verso)', '1 − cos x = 2 sin²(x/2)', vers),
  historical('vercos', 'Vercoseno (coseno verso)', '1 + cos x = 2 cos²(x/2)', x => 2 * Math.cos(x / 2) ** 2),
  historical('covers', 'Coverseno (seno verso complementario)', '1 − sin x', covers),
  historical('covercos', 'Covercoseno', '1 + sin x', x => 2 * Math.sin((P / 2 + x) / 2) ** 2),
  historical('hav', 'Semiverseno (haverseno)', '(1 − cos x)/2 = sin²(x/2)', x => Math.sin(x / 2) ** 2, true),
  historical('havercos', 'Semivercoseno (havercoseno)', '(1 + cos x)/2 = cos²(x/2)', x => Math.cos(x / 2) ** 2, true),
  historical('hacovers', 'Semicoverseno (hacoverseno, cohaverseno)', '(1 − sin x)/2', x => covers(x) / 2, true),
  historical('hacovercos', 'Semicovercoseno (hacovercoseno)', '(1 + sin x)/2', x => Math.sin((P / 2 + x) / 2) ** 2, true),
  make('historical', 'exsec', 'Exsecante (secante exterior)', 'sec x − 1 = (1 − cos x)/cos x', 'ℝ excepto π/2 + kπ', '(−∞, −2] ∪ [0, ∞)', x => vers(x) / Math.cos(x), { valid: cosOK, poles: cosPoles }),
  make('historical', 'excsc', 'Excosecante (cosecante exterior)', 'csc x − 1 = (1 − sin x)/sin x', 'ℝ excepto kπ', '(−∞, −2] ∪ [0, ∞)', x => covers(x) / Math.sin(x), { valid: sinOK, poles: sinPoles }),
  make('inverse', 'asin', 'Arcoseno', 'arcsin x', '[−1, 1]', '[−π/2, π/2]', Math.asin, { valid: bounded(-1, 1), window: [-1, 1] }),
  make('inverse', 'acos', 'Arcocoseno', 'arccos x', '[−1, 1]', '[0, π]', Math.acos, { valid: bounded(-1, 1), window: [-1, 1] }),
  make('inverse', 'atan', 'Arcotangente', 'arctan x', R, '(−π/2, π/2)', Math.atan, { window: [-4, 4] }),
  make('inverse', 'acot', 'Arcocotangente', 'π/2 − arctan x', R, '(0, π)', x => Math.atan2(1, x), { window: [-4, 4] }),
  make('inverse', 'asec', 'Arcosecante', 'arccos(1/x)', '(−∞, −1] ∪ [1, ∞)', '[0, π] excepto π/2', x => Math.acos(1 / x), { valid: x => Math.abs(x) >= 1, window: [-4, 4], sample: 2 }),
  make('inverse', 'acsc', 'Arcocosecante', 'arcsin(1/x)', '(−∞, −1] ∪ [1, ∞)', '[−π/2, π/2] excepto 0', x => Math.asin(1 / x), { valid: x => Math.abs(x) >= 1, window: [-4, 4], sample: 2 }),
  make('hyperbolic', 'sinh', 'Seno hiperbólico', '(eˣ − e⁻ˣ)/2', R, R, Math.sinh),
  make('hyperbolic', 'cosh', 'Coseno hiperbólico', '(eˣ + e⁻ˣ)/2', R, '[1, ∞)', Math.cosh),
  make('hyperbolic', 'tanh', 'Tangente hiperbólica', 'sinh x / cosh x', R, '(−1, 1)', Math.tanh),
  make('hyperbolic', 'coth', 'Cotangente hiperbólica', 'cosh x / sinh x', 'ℝ excepto 0', '(−∞, −1) ∪ (1, ∞)', x => 1 / Math.tanh(x), { valid: x => x !== 0, poles: { offset: 0, period: Infinity } }),
  make('hyperbolic', 'sech', 'Secante hiperbólica', '1 / cosh x', R, '(0, 1]', x => 1 / Math.cosh(x)),
  make('hyperbolic', 'csch', 'Cosecante hiperbólica', '1 / sinh x', 'ℝ excepto 0', 'ℝ excepto 0', x => 1 / Math.sinh(x), { valid: x => x !== 0, poles: { offset: 0, period: Infinity } }),
  make('inverse-hyperbolic', 'asinh', 'Área seno hiperbólico (arsinh)', 'ln(x + √(x² + 1))', R, R, Math.asinh),
  make('inverse-hyperbolic', 'acosh', 'Área coseno hiperbólico (arcosh)', 'ln(x + √(x² − 1))', '[1, ∞)', '[0, ∞)', Math.acosh, { valid: x => x >= 1, window: [1, 5], sample: 2 }),
  make('inverse-hyperbolic', 'atanh', 'Área tangente hiperbólica (artanh)', '½ ln((1 + x)/(1 − x))', '(−1, 1)', R, Math.atanh, { valid: x => Math.abs(x) < 1, window: [-1, 1] }),
  make('inverse-hyperbolic', 'acoth', 'Área cotangente hiperbólica (arcoth)', '½ ln((x + 1)/(x − 1))', '(−∞, −1) ∪ (1, ∞)', 'ℝ excepto 0', x => Math.atanh(1 / x), { valid: x => Math.abs(x) > 1, window: [-3, 3], sample: 2 }),
  make('inverse-hyperbolic', 'asech', 'Área secante hiperbólica (arsech)', 'arcosh(1/x)', '(0, 1]', '[0, ∞)', x => Math.acosh(1 / x), { valid: x => x > 0 && x <= 1, window: [0, 1] }),
  make('inverse-hyperbolic', 'acsch', 'Área cosecante hiperbólica (arcsch)', 'arsinh(1/x)', 'ℝ excepto 0', 'ℝ excepto 0', x => Math.asinh(1 / x), { valid: x => x !== 0, poles: { offset: 0, period: Infinity } }),
  invHistorical('avers', 'Arcoverseno', 'arccos(1 − y)', y => 2 * Math.asin(Math.sqrt(y / 2))),
  invHistorical('avercos', 'Arcovercoseno', 'arccos(y − 1)', y => 2 * Math.acos(Math.sqrt(y / 2))),
  invHistorical('acovers', 'Arcocoverseno', 'arcsin(1 − y)', y => Math.asin(1 - y), false, true),
  invHistorical('acovercos', 'Arcocovercoseno', 'arcsin(y − 1)', y => Math.asin(y - 1), false, true),
  invHistorical('ahav', 'Arcosemiverseno (archaverseno)', '2 arcsin √y', y => 2 * Math.asin(Math.sqrt(y)), true),
  invHistorical('ahavercos', 'Arcosemivercoseno', '2 arccos √y', y => 2 * Math.acos(Math.sqrt(y)), true),
  invHistorical('ahacovers', 'Arcosemicoverseno', 'arcsin(1 − 2y)', y => Math.asin(1 - 2 * y), true, true),
  invHistorical('ahacovercos', 'Arcosemicovercoseno', 'arcsin(2y − 1)', y => Math.asin(2 * y - 1), true, true),
  make('historical-inverse', 'aexsec', 'Arcoexsecante', 'arccos(1/(y + 1))', '(−∞, −2] ∪ [0, ∞)', '[0, π] excepto π/2', y => Math.acos(1 / (y + 1)), { valid: y => y <= -2 || y >= 0, sample: 1, window: [-4, 4] }),
  make('historical-inverse', 'aexcsc', 'Arcoexcosecante', 'arcsin(1/(y + 1))', '(−∞, −2] ∪ [0, ∞)', '[−π/2, π/2] excepto 0', y => Math.asin(1 / (y + 1)), { valid: y => y <= -2 || y >= 0, sample: 1, window: [-4, 4] }),
  make('bridges', 'chord', 'Cuerda (extensión con signo)', 'crd x = 2 sin(x/2)', R, '[−2, 2]', x => 2 * Math.sin(x / 2), { input: 'angle', period: '4π', window: [-2 * P, 2 * P] }),
  make('bridges', 'sinc', 'Seno cardinal, no normalizado', 'sinc x = sin x / x; sinc 0 = 1', R, 'Subconjunto de [−1, 1]', x => x === 0 ? 1 : Math.sin(x) / x, { window: [-10, 10] }),
  make('bridges', 'sincpi', 'Seno cardinal normalizado', 'sincπ x = sin(πx)/(πx); sincπ 0 = 1', R, 'Subconjunto de [−1, 1]', x => x === 0 ? 1 : Math.sin(P * x) / (P * x), { window: [-4, 4] }),
  make('bridges', 'sinhc', 'Seno hiperbólico cardinal', 'sinhc x = sinh x / x; sinhc 0 = 1', R, '[1, ∞)', x => x === 0 ? 1 : Math.sinh(x) / x),
  make('bridges', 'coshm1', 'Coseno hiperbólico menos uno', 'cosh x − 1 = 2 sinh²(x/2)', R, '[0, ∞)', x => 2 * Math.sinh(x / 2) ** 2),
  make('bridges', 'cas', 'Cas (coseno y seno)', 'cas x = cos x + sin x', R, '[−√2, √2]', x => Math.cos(x) + Math.sin(x), { input: 'angle', period: '2π', window: [-P, P] }),
  make('bridges', 'gd', 'Gudermanniana', 'gd x = 2 arctan(tanh(x/2))', R, '(−π/2, π/2)', x => 2 * Math.atan(Math.tanh(x / 2)), { output: 'angle' }),
  make('bridges', 'agd', 'Gudermanniana inversa', 'gd⁻¹ x = arsinh(tan x)', '(−π/2, π/2)', R, x => Math.asinh(Math.tan(x)), { input: 'angle', valid: x => Math.abs(x) < P / 2, window: [-P / 2, P / 2] }),
];
export function evaluateTrig(entry: TrigEntry, x: number): { status: 'ok' | 'domain' | 'overflow'; value: number | null } {
  if (!Number.isFinite(x) || !entry.valid(x)) return { status: 'domain', value: null };
  const value = entry.compute(x);
  return Number.isFinite(value) ? { status: 'ok', value } : { status: 'overflow', value: null };
}
export function trigPlot(entry: TrigEntry, window: [number, number] = entry.window): [number, number][] {
  const [lo, hi] = window, points: [number, number][] = [];
  let previous = lo;
  for (let i = 0; i <= 800; i++) {
    const x = lo + (hi - lo) * i / 800;
    if (i && entry.poles) {
      const { offset, period } = entry.poles;
      const pole = period === Infinity ? offset : offset + (Math.floor((previous - offset) / period) + 1) * period;
      if (pole > previous && pole <= x) points.push([NaN, NaN]);
    }
    const result = evaluateTrig(entry, x);
    points.push([x, result.value === null || Math.abs(result.value) > 10000 ? NaN : result.value]);
    previous = x;
  }
  return points;
}
