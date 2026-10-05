export type NumericFunction = (...args: number[]) => number;
export interface FunctionEntry { name: string; category: string; description: string; fn: NumericFunction; }
export interface ConstantEntry { name: string; description: string; value: number; }

const natural = (n: number, limit = 1000): boolean => Number.isInteger(n) && n >= 0 && n <= limit;
function factorial(n: number): number {
  if (!natural(n, 170)) return n > 170 && Number.isInteger(n) ? Infinity : NaN;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}
function choose(n: number, k: number): number {
  if (!natural(n) || !natural(k)) return NaN;
  if (k > n) return 0;
  k = Math.min(k, n - k);
  let result = 1;
  for (let i = 1; i <= k; i++) result *= (n - k + i) / i;
  return Math.round(result);
}
function gcd(a: number, b: number): number {
  if (!Number.isSafeInteger(a) || !Number.isSafeInteger(b)) return NaN;
  a = Math.abs(a); b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a;
}
// Lanczos (g = 7), with reflection for negative noninteger arguments.
function logGamma(x: number): number {
  if (x === Infinity) return Infinity;
  if (!Number.isFinite(x) || x <= 0) return NaN;
  if (x < 0.5) return Math.log(Math.PI) - Math.log(Math.sin(Math.PI * x)) - logGamma(1 - x);
  const c = [676.5203681218851, -1259.1392167224028, 771.3234287776531,
    -176.6150291621406, 12.507343278686905, -0.13857109526572012,
    9.984369578019572e-6, 1.5056327351493116e-7];
  x -= 1;
  let a = 0.9999999999998099;
  for (let i = 0; i < c.length; i++) a += c[i] / (x + i + 1);
  const t = x + 7.5;
  return Math.log(2 * Math.PI) / 2 + (x + 0.5) * Math.log(t) - t + Math.log(a);
}
function gamma(x: number): number {
  if (!Number.isFinite(x)) return x === Infinity ? Infinity : NaN;
  if (x <= 0 && Number.isInteger(x)) return NaN;
  return x < 0.5 ? Math.PI / (Math.sin(Math.PI * x) * gamma(1 - x)) : Math.exp(logGamma(x));
}
function erfc(x: number): number {
  if (Number.isNaN(x)) return NaN;
  if (x === 0) return 1;
  const z = Math.abs(x), t = 1 / (1 + 0.5 * z);
  // Numerical Recipes approximation, absolute error about 1.5e-7.
  const r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 +
    t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 +
    t * (1.48851587 + t * (-0.82215223 + t * 0.17087277)))))))));
  return x < 0 ? 2 - r : r;
}
const erf = (x: number): number => x < 0 ? erfc(-x) - 1 : 1 - erfc(x);
const sigmoid = (x: number): number => x >= 0 ? 1 / (1 + Math.exp(-x)) : Math.exp(x) / (1 + Math.exp(x));
const mod = (x: number, m: number): number => m > 0 ? ((x % m) + m) % m : NaN;
const mean = (...xs: number[]): number => xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN;
const variance = (...xs: number[]): number => { const m = mean(...xs); return mean(...xs.map(x => (x - m) ** 2)); };
function sequence(n: number, a: number, b: number): number {
  if (!natural(n, 1476)) return NaN;
  for (let i = 0; i < n; i++) [a, b] = [b, a + b];
  return a;
}
function polynomial(n: number, x: number, kind: string): number {
  if (!natural(n, 200)) return NaN;
  let a = 1, b = kind === 'legendre' || kind === 'chebyshevT' ? x : 2 * x;
  if (n === 0) return a;
  for (let k = 1; k < n; k++) {
    const next = kind === 'legendre' ? ((2 * k + 1) * x * b - k * a) / (k + 1)
      : kind === 'hermite' ? 2 * x * b - 2 * k * a : 2 * x * b - a;
    a = b; b = next;
  }
  return b;
}
const entry = (category: string, name: string, description: string, fn: NumericFunction): FunctionEntry =>
  ({ category, name, description, fn });

export const EXTRA_FUNCTIONS: FunctionEntry[] = [
  entry('Álgebra', 'square', 'square(x): x al cuadrado.', x => x * x),
  entry('Álgebra', 'cube', 'cube(x): x al cubo.', x => x * x * x),
  entry('Álgebra', 'root', 'root(x, n): raíz real n-ésima; n entero positivo. Permite x negativo si n es impar.', (x, n) => Number.isInteger(n) && n > 0 ? x < 0 && n % 2 ? -Math.pow(-x, 1 / n) : Math.pow(x, 1 / n) : NaN),
  entry('Álgebra', 'logb', 'logb(x, base): logaritmo con x > 0 y base > 0 distinta de 1.', (x, b) => x > 0 && b > 0 && b !== 1 ? Math.log(x) / Math.log(b) : NaN),
  entry('Álgebra', 'exp2', 'exp2(x): 2 elevado a x.', x => 2 ** x),
  entry('Álgebra', 'exp10', 'exp10(x): 10 elevado a x.', x => 10 ** x),
  entry('Álgebra', 'ln', 'ln(x): logaritmo natural, equivalente a log(x).', Math.log),
  entry('Álgebra', 'reciprocal', 'reciprocal(x): inverso multiplicativo, 1/x.', x => 1 / x),
  entry('Geometría', 'distance', 'distance(x1,y1,x2,y2): distancia euclídea entre dos puntos del plano.', (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1)),
  entry('Geometría', 'distance3D', 'distance3D(x1,y1,z1,x2,y2,z2): distancia euclídea en el espacio.', (x1, y1, z1, x2, y2, z2) => Math.hypot(x2 - x1, y2 - y1, z2 - z1)),
  entry('Geometría', 'manhattan', 'manhattan(x1,y1,x2,y2): distancia |x2-x1|+|y2-y1|.', (x1, y1, x2, y2) => Math.abs(x2 - x1) + Math.abs(y2 - y1)),
  entry('Geometría', 'polarX', 'polarX(r,ángulo): coordenada x=r·cos(ángulo); ángulo en radianes.', (r, a) => r * Math.cos(a)),
  entry('Geometría', 'polarY', 'polarY(r,ángulo): coordenada y=r·sin(ángulo); ángulo en radianes.', (r, a) => r * Math.sin(a)),
  entry('Geometría', 'rotateX', 'rotateX(x,y,ángulo): coordenada x tras rotación antihoraria; radianes.', (x, y, a) => x * Math.cos(a) - y * Math.sin(a)),
  entry('Geometría', 'rotateY', 'rotateY(x,y,ángulo): coordenada y tras rotación antihoraria; radianes.', (x, y, a) => x * Math.sin(a) + y * Math.cos(a)),
  entry('Geometría', 'dot', 'dot(ax,ay,bx,by): producto escalar de dos vectores del plano.', (ax, ay, bx, by) => ax * bx + ay * by),
  entry('Geometría', 'cross2D', 'cross2D(ax,ay,bx,by): determinante ax·by-ay·bx; área orientada.', (ax, ay, bx, by) => ax * by - ay * bx),
  entry('Geometría', 'circleArea', 'circleArea(r): área πr²; radio r ≥ 0.', r => r >= 0 ? Math.PI * r * r : NaN),
  entry('Geometría', 'circumference', 'circumference(r): longitud 2πr; radio r ≥ 0.', r => r >= 0 ? 2 * Math.PI * r : NaN),
  entry('Geometría', 'sphereVolume', 'sphereVolume(r): volumen 4πr³/3; radio r ≥ 0.', r => r >= 0 ? 4 * Math.PI * r ** 3 / 3 : NaN),
  entry('Geometría', 'sphereArea', 'sphereArea(r): superficie 4πr²; radio r ≥ 0.', r => r >= 0 ? 4 * Math.PI * r * r : NaN),
  entry('Trigonometría', 'sec', 'sec(x): secante, 1/cos(x); radianes.', x => 1 / Math.cos(x)),
  entry('Trigonometría', 'csc', 'csc(x): cosecante, 1/sin(x); radianes.', x => 1 / Math.sin(x)),
  entry('Trigonometría', 'cot', 'cot(x): cotangente, 1/tan(x); radianes.', x => 1 / Math.tan(x)),
  entry('Trigonometría', 'asec', 'asec(x): arco secante en [0, π]; |x| ≥ 1.', x => Math.acos(1 / x)),
  entry('Trigonometría', 'acsc', 'acsc(x): arco cosecante en [-π/2, π/2]; |x| ≥ 1.', x => Math.asin(1 / x)),
  entry('Trigonometría', 'acot', 'acot(x): arco cotangente en (0, π).', x => Math.atan2(1, x)),
  entry('Trigonometría', 'radians', 'radians(grados): convierte grados a radianes.', x => x * Math.PI / 180),
  entry('Trigonometría', 'degrees', 'degrees(radianes): convierte radianes a grados.', x => x * 180 / Math.PI),
  entry('Trigonometría', 'sind', 'sind(grados): seno de un ángulo en grados.', x => Math.sin(x * Math.PI / 180)),
  entry('Trigonometría', 'cosd', 'cosd(grados): coseno de un ángulo en grados.', x => Math.cos(x * Math.PI / 180)),
  entry('Trigonometría', 'tand', 'tand(grados): tangente de un ángulo en grados.', x => Math.tan(x * Math.PI / 180)),
  entry('Trigonometría', 'sinc', 'sinc(x): sin(x)/x, con sinc(0) = 1.', x => x === 0 ? 1 : Math.sin(x) / x),
  entry('Trigonometría', 'sincpi', 'sincpi(x): sin(πx)/(πx), con sincpi(0) = 1.', x => x === 0 ? 1 : Math.sin(Math.PI * x) / (Math.PI * x)),
  entry('Hiperbólicas', 'sech', 'sech(x): secante hiperbólica, 1/cosh(x).', x => 1 / Math.cosh(x)),
  entry('Hiperbólicas', 'csch', 'csch(x): cosecante hiperbólica, 1/sinh(x).', x => 1 / Math.sinh(x)),
  entry('Hiperbólicas', 'coth', 'coth(x): cotangente hiperbólica, 1/tanh(x).', x => 1 / Math.tanh(x)),
  entry('Hiperbólicas', 'asech', 'asech(x): arco secante hiperbólica; 0 < x ≤ 1.', x => x > 0 && x <= 1 ? Math.acosh(1 / x) : NaN),
  entry('Hiperbólicas', 'acsch', 'acsch(x): arco cosecante hiperbólica; x distinto de cero.', x => x !== 0 ? Math.asinh(1 / x) : NaN),
  entry('Hiperbólicas', 'acoth', 'acoth(x): arco cotangente hiperbólica; |x| > 1.', x => Math.abs(x) > 1 ? Math.atanh(1 / x) : NaN),
  entry('Enteros', 'factorial', 'factorial(n): n!, para enteros n ≥ 0; desborda a partir de 171.', factorial),
  entry('Enteros', 'doubleFactorial', 'doubleFactorial(n): n!!, producto de enteros de la misma paridad; 0 ≤ n ≤ 300.', n => { if (!natural(n, 300)) return NaN; let r = 1; for (let k = n; k > 1; k -= 2) r *= k; return r; }),
  entry('Enteros', 'choose', 'choose(n, k): coeficiente binomial; enteros entre 0 y 1000. Resultado aproximado para enteros grandes.', choose),
  entry('Enteros', 'permutations', 'permutations(n, k): n!/(n-k)!; 0 ≤ k ≤ n ≤ 1000, enteros.', (n, k) => { if (!natural(n) || !natural(k) || k > n) return NaN; let r = 1; for (let i = 0; i < k; i++) r *= n - i; return r; }),
  entry('Enteros', 'gcd', 'gcd(a, b): máximo común divisor de dos enteros seguros.', gcd),
  entry('Enteros', 'lcm', 'lcm(a, b): mínimo común múltiplo de dos enteros seguros; resultados grandes pueden perder precisión.', (a, b) => { const g = gcd(a, b); return Number.isNaN(g) ? NaN : g === 0 ? 0 : Math.abs((a / g) * b); }),
  entry('Enteros', 'isPrime', 'isPrime(n): 1 si n es primo y 0 en caso contrario; enteros 0 ≤ n ≤ 10⁹.', n => { if (!natural(n, 1e9)) return NaN; if (n < 2) return 0; if (n % 2 === 0) return n === 2 ? 1 : 0; for (let d = 3; d * d <= n; d += 2) if (n % d === 0) return 0; return 1; }),
  entry('Enteros', 'fibonacci', 'fibonacci(n): F₀=0, F₁=1; 0 ≤ n ≤ 1476. Valores grandes aproximados.', n => sequence(n, 0, 1)),
  entry('Enteros', 'lucas', 'lucas(n): L₀=2, L₁=1; 0 ≤ n ≤ 1476. Valores grandes aproximados.', n => sequence(n, 2, 1)),
  entry('Enteros', 'triangular', 'triangular(n): n(n+1)/2; entero n ≥ 0.', n => Number.isSafeInteger(n) && n >= 0 ? n * (n + 1) / 2 : NaN),
  entry('Enteros', 'harmonic', 'harmonic(n): suma 1 + 1/2 + … + 1/n; 0 ≤ n ≤ 1000.', n => { if (!natural(n)) return NaN; let r = 0; for (let k = 1; k <= n; k++) r += 1 / k; return r; }),
  entry('Enteros', 'catalan', 'catalan(n): número de Catalan, choose(2n,n)/(n+1); entero 0 ≤ n ≤ 500.', n => natural(n, 500) ? choose(2 * n, n) / (n + 1) : NaN),
  entry('Ondas y ajustes', 'mod', 'mod(x, m): módulo en [0,m); m > 0, también admite x negativo.', mod),
  entry('Ondas y ajustes', 'fract', 'fract(x): parte fraccionaria x-floor(x), en [0,1).', x => x - Math.floor(x)),
  entry('Ondas y ajustes', 'clamp', 'clamp(x, mínimo, máximo): limita x al intervalo; mínimo ≤ máximo.', (x, a, b) => a <= b ? Math.max(a, Math.min(b, x)) : NaN),
  entry('Ondas y ajustes', 'lerp', 'lerp(a, b, t): interpolación a+(b-a)t; extrapola fuera de [0,1].', (a, b, t) => a + (b - a) * t),
  entry('Ondas y ajustes', 'step', 'step(borde, x): 0 si x < borde; 1 en caso contrario.', (a, x) => Number.isNaN(a) || Number.isNaN(x) ? NaN : x < a ? 0 : 1),
  entry('Ondas y ajustes', 'heaviside', 'heaviside(x): 0 para x<0, 1/2 en cero y 1 para x>0.', x => Number.isNaN(x) ? NaN : x < 0 ? 0 : x > 0 ? 1 : 0.5),
  entry('Ondas y ajustes', 'smoothstep', 'smoothstep(a,b,x): transición cúbica de 0 a 1 entre a y b; a < b.', (a, b, x) => { if (!(a < b)) return NaN; const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); }),
  entry('Ondas y ajustes', 'smootherstep', 'smootherstep(a,b,x): transición quíntica de 0 a 1; a < b.', (a, b, x) => { if (!(a < b)) return NaN; const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t ** 3 * (t * (6 * t - 15) + 10); }),
  entry('Ondas y ajustes', 'sawtooth', 'sawtooth(x): onda de sierra de período 1 en [-1,1).', x => 2 * mod(x, 1) - 1),
  entry('Ondas y ajustes', 'triangleWave', 'triangleWave(x): onda triangular de período 1; valor 1 en x=0 y -1 en x=1/2.', x => 4 * Math.abs(mod(x, 1) - 0.5) - 1),
  entry('Ondas y ajustes', 'squareWave', 'squareWave(x): onda cuadrada de período 1; +1 en la primera mitad y -1 en la segunda.', x => Number.isFinite(x) ? mod(x, 1) < 0.5 ? 1 : -1 : NaN),
  entry('Ondas y ajustes', 'rect', 'rect(x): pulso rectangular; 1 si |x|<1/2, 1/2 en los bordes y 0 fuera.', x => Number.isNaN(x) ? NaN : Math.abs(x) < 0.5 ? 1 : Math.abs(x) === 0.5 ? 0.5 : 0),
  entry('Ondas y ajustes', 'tent', 'tent(x): pulso triangular max(0,1-|x|).', x => Math.max(0, 1 - Math.abs(x))),
  entry('Estadística', 'sum', 'sum(a,b,…): suma de los argumentos; sin argumentos devuelve 0.', (...xs) => xs.reduce((a, b) => a + b, 0)),
  entry('Estadística', 'product', 'product(a,b,…): producto de los argumentos; sin argumentos devuelve 1.', (...xs) => xs.reduce((a, b) => a * b, 1)),
  entry('Estadística', 'mean', 'mean(a,b,…): media aritmética; necesita al menos un valor.', mean),
  entry('Estadística', 'median', 'median(a,b,…): mediana; necesita al menos un valor.', (...xs) => { if (!xs.length || xs.some(Number.isNaN)) return NaN; xs.sort((a, b) => a - b); const m = Math.floor(xs.length / 2); return xs.length % 2 ? xs[m] : (xs[m - 1] + xs[m]) / 2; }),
  entry('Estadística', 'variance', 'variance(a,b,…): varianza poblacional (divide por N).', variance),
  entry('Estadística', 'stddev', 'stddev(a,b,…): desviación estándar poblacional.', (...xs) => Math.sqrt(variance(...xs))),
  entry('Estadística', 'rms', 'rms(a,b,…): raíz de la media de los cuadrados.', (...xs) => Math.sqrt(mean(...xs.map(x => x * x)))),
  entry('Estadística', 'sigmoid', 'sigmoid(x): función logística 1/(1+exp(-x)).', sigmoid),
  entry('Estadística', 'logit', 'logit(p): log(p/(1-p)); 0 ≤ p ≤ 1, infinita en los extremos.', p => p >= 0 && p <= 1 ? Math.log(p) - Math.log1p(-p) : NaN),
  entry('Estadística', 'softplus', 'softplus(x): log(1+exp(x)), evaluada evitando desbordamientos.', x => Math.max(0, x) + Math.log1p(Math.exp(-Math.abs(x)))),
  entry('Estadística', 'gaussian', 'gaussian(x): exp(-x²/2), campana de altura 1.', x => Math.exp(-x * x / 2)),
  entry('Estadística', 'normalPDF', 'normalPDF(x, media=0, sigma=1): densidad normal; sigma > 0.', (x, mu = 0, sigma = 1) => sigma > 0 ? Math.exp(-0.5 * ((x - mu) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI)) : NaN),
  entry('Estadística', 'normalCDF', 'normalCDF(x, media=0, sigma=1): probabilidad acumulada normal; aproximación, error absoluto ≈ 10⁻⁷.', (x, mu = 0, sigma = 1) => sigma > 0 ? 0.5 * erfc(-(x - mu) / (sigma * Math.SQRT2)) : NaN),
  entry('Especiales', 'gamma', 'gamma(x): función Γ real, aproximación de Lanczos; no definida en enteros ≤ 0.', gamma),
  entry('Especiales', 'logGamma', 'logGamma(x): logaritmo de Γ(x), aproximación de Lanczos; x > 0.', logGamma),
  entry('Especiales', 'beta', 'beta(a,b): función beta, Γ(a)Γ(b)/Γ(a+b); a,b > 0.', (a, b) => a > 0 && b > 0 ? Math.exp(logGamma(a) + logGamma(b) - logGamma(a + b)) : NaN),
  entry('Especiales', 'erf', 'erf(x): función error; aproximación con error absoluto ≈ 1,5·10⁻⁷.', erf),
  entry('Especiales', 'erfc', 'erfc(x): función error complementaria 1-erf(x); error absoluto ≈ 1,5·10⁻⁷.', erfc),
  entry('Especiales', 'legendre', 'legendre(n,x): polinomio de Legendre Pₙ(x); entero 0 ≤ n ≤ 200.', (n, x) => polynomial(n, x, 'legendre')),
  entry('Especiales', 'chebyshevT', 'chebyshevT(n,x): polinomio de Chebyshev de primera especie; entero 0 ≤ n ≤ 200.', (n, x) => polynomial(n, x, 'chebyshevT')),
  entry('Especiales', 'chebyshevU', 'chebyshevU(n,x): polinomio de Chebyshev de segunda especie; entero 0 ≤ n ≤ 200.', (n, x) => polynomial(n, x, 'chebyshevU')),
  entry('Especiales', 'hermite', 'hermite(n,x): polinomio de Hermite Hₙ (convención de física); entero 0 ≤ n ≤ 200.', (n, x) => polynomial(n, x, 'hermite')),
];

const constant = (name: string, value: number, meaning: string): ConstantEntry =>
  ({ name, value, description: `${name} ≈ ${value}: ${meaning}` });
export const EXTRA_CONSTANTS: ConstantEntry[] = [
  constant('TAU', 2 * Math.PI, 'una vuelta completa en radianes, 2π.'),
  constant('HALF_PI', Math.PI / 2, 'un ángulo recto en radianes.'),
  constant('QUARTER_PI', Math.PI / 4, '45 grados en radianes.'),
  constant('INV_PI', 1 / Math.PI, 'inverso de π.'),
  constant('SQRT_PI', Math.sqrt(Math.PI), 'raíz cuadrada de π.'),
  constant('SQRT_TAU', Math.sqrt(2 * Math.PI), 'raíz cuadrada de 2π.'),
  constant('SQRT3', Math.sqrt(3), 'raíz cuadrada de 3.'),
  constant('SQRT5', Math.sqrt(5), 'raíz cuadrada de 5.'),
  constant('CBRT2', Math.cbrt(2), 'raíz cúbica de 2.'),
  constant('DEG_TO_RAD', Math.PI / 180, 'factor de conversión de grados a radianes.'),
  constant('RAD_TO_DEG', 180 / Math.PI, 'factor de conversión de radianes a grados.'),
  constant('PHI', (1 + Math.sqrt(5)) / 2, 'número áureo.'),
  constant('INV_PHI', (Math.sqrt(5) - 1) / 2, 'inverso del número áureo.'),
  constant('SILVER_RATIO', 1 + Math.SQRT2, 'razón de plata.'),
  constant('PLASTIC', 1.324717957244746, 'número plástico, raíz real de x³=x+1.'),
  constant('EULER_GAMMA', 0.5772156649015329, 'constante de Euler–Mascheroni, límite de Hₙ-ln(n).'),
  constant('CATALAN', 0.915965594177219, 'constante de Catalan, suma alternada de 1/(2n+1)².'),
  constant('APERY', 1.2020569031595942, 'constante de Apéry, ζ(3).'),
  constant('ZETA2', Math.PI ** 2 / 6, 'ζ(2), suma de los inversos de los cuadrados.'),
  constant('ZETA4', Math.PI ** 4 / 90, 'ζ(4), suma de los inversos de las cuartas potencias.'),
  constant('FEIGENBAUM_DELTA', 4.66920160910299, 'constante de escala de las bifurcaciones por duplicación de período.'),
  constant('FEIGENBAUM_ALPHA', 2.5029078750958926, 'magnitud de la constante de escala espacial de Feigenbaum.'),
  constant('KHINCHIN', 2.6854520010653064, 'media geométrica límite de los coeficientes de casi todas las fracciones continuas.'),
  constant('GLAISHER', 1.2824271291006226, 'constante de Glaisher–Kinkelin.'),
  constant('OMEGA', 0.5671432904097838, 'solución de x·exp(x)=1.'),
  constant('LN_PHI', Math.log((1 + Math.sqrt(5)) / 2), 'logaritmo natural del número áureo.'),
  constant('GELFOND', Math.exp(Math.PI), 'constante de Gelfond, e elevado a π.'),
  constant('GELFOND_SCHNEIDER', 2 ** Math.SQRT2, 'constante de Gelfond–Schneider, 2 elevado a √2.'),
  constant('RAMANUJAN', Math.exp(Math.PI * Math.sqrt(163)), 'e elevado a π√163, célebre por su proximidad a un entero; precisión de coma flotante.'),
  constant('SQRT_PHI', Math.sqrt((1 + Math.sqrt(5)) / 2), 'raíz cuadrada del número áureo.'),
  constant('PI_SQUARED', Math.PI ** 2, 'π al cuadrado.'),
  constant('E_TO_E', Math.exp(Math.E), 'e elevado a e.'),
];

export function mathCategory(name: string): string {
  if (/^(sin|cos|tan|asin|acos|atan)/.test(name)) return name.endsWith('h') ? 'Hiperbólicas' : 'Trigonometría';
  return 'Álgebra';
}
