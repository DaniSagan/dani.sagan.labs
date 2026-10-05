import type { ConstantEntry, FunctionEntry, NumericFunction } from './math-catalog';

// Classical polynomial recurrences: https://dlmf.nist.gov/18.9
// Parameterized families keep one entry per mathematical function.
type PolynomialKind = 'legendre' | 'shiftedLegendre' | 'chebyshevT' | 'chebyshevU'
  | 'hermite' | 'hermiteHe' | 'laguerre' | 'generalizedLaguerre' | 'gegenbauer' | 'jacobi';

function orthogonal(kind: PolynomialKind, n: number, x: number, alpha = 0, beta = 0): number {
  if (!Number.isInteger(n) || n < 0 || n > 200 || !Number.isFinite(x)) return NaN;
  if (kind === 'shiftedLegendre') return orthogonal('legendre', n, 2 * x - 1);
  if (kind === 'generalizedLaguerre' && (!Number.isFinite(alpha) || alpha <= -1)) return NaN;
  if (kind === 'gegenbauer' && (!Number.isFinite(alpha) || alpha <= 0)) return NaN;
  if (kind === 'jacobi' && (!Number.isFinite(alpha) || !Number.isFinite(beta) || alpha <= -1 || beta <= -1)) return NaN;
  if (n === 0) return 1;
  let previous = 1;
  let current: number;
  switch (kind) {
    case 'legendre': case 'chebyshevT': case 'hermiteHe': current = x; break;
    case 'chebyshevU': case 'hermite': current = 2 * x; break;
    case 'laguerre': current = 1 - x; break;
    case 'generalizedLaguerre': current = 1 + alpha - x; break;
    case 'gegenbauer': current = 2 * alpha * x; break;
    case 'jacobi': current = ((alpha + beta + 2) * x + alpha - beta) / 2; break;
  }
  for (let k = 1; k < n; k++) {
    let next: number;
    switch (kind) {
      case 'legendre': next = ((2 * k + 1) * x * current - k * previous) / (k + 1); break;
      case 'chebyshevT': case 'chebyshevU': next = 2 * x * current - previous; break;
      case 'hermite': next = 2 * x * current - 2 * k * previous; break;
      case 'hermiteHe': next = x * current - k * previous; break;
      case 'laguerre': case 'generalizedLaguerre': {
        const a = kind === 'laguerre' ? 0 : alpha;
        next = ((2 * k + a + 1 - x) * current - (k + a) * previous) / (k + 1);
        break;
      }
      case 'gegenbauer': next = (2 * (k + alpha) * x * current - (k + 2 * alpha - 1) * previous) / (k + 1); break;
      case 'jacobi': {
        const s = alpha + beta, t = 2 * k + s;
        const a = (t + 1) * (t + 2) / (2 * (k + 1) * (k + s + 1));
        const b = (alpha * alpha - beta * beta) * (t + 1) / (2 * (k + 1) * (k + s + 1) * t);
        const c = (k + alpha) * (k + beta) * (t + 2) / ((k + 1) * (k + s + 1) * t);
        next = (a * x + b) * current - c * previous;
        break;
      }
    }
    previous = current; current = next;
  }
  return current;
}

// Euler–Maclaurin expansion: https://dlmf.nist.gov/25.11
function zeta(s: number, a = 1): number {
  if (!Number.isFinite(s) || s <= 1 || s > 1000 || !Number.isFinite(a) || a <= 0) return NaN;
  let sum = 0, x = a;
  // Move the tail away from the singularity. Bound work per graph sample.
  for (let i = 0; i < 32; i++, x++) sum += x ** -s;
  let tail = x ** (1 - s) / (s - 1) + 0.5 * x ** -s;
  const coefficients = [1 / 12, -1 / 720, 1 / 30240, -1 / 1209600, 1 / 47900160, -691 / 1307674368000];
  let term = s * x ** (-s - 1);
  for (let k = 0; k < coefficients.length; k++) {
    if (k > 0) term *= ((s + 2 * k - 1) / x) * ((s + 2 * k) / x);
    tail += coefficients[k] * term;
  }
  return sum + tail;
}

function polygamma(order: number, x: number): number {
  if (!Number.isInteger(order) || order < 0 || order > 20 || !Number.isFinite(x) || x <= 0) return NaN;
  if (order > 0) {
    let factorial = 1;
    for (let i = 2; i <= order; i++) factorial *= i;
    return (order % 2 ? 1 : -1) * factorial * zeta(order + 1, x);
  }
  let correction = 0;
  while (x < 12) { correction -= 1 / x; x++; }
  const t = 1 / (x * x);
  return correction + Math.log(x) - 1 / (2 * x) - t * (1 / 12 - t * (1 / 120 - t * (1 / 252 - t * (1 / 240 - t / 132))));
}

// Real Lambert W branches; logarithmic bisection also handles subnormal inputs.
// https://dlmf.nist.gov/4.13
function lambertW(x: number, branch = 0): number {
  const boundary = -1 / Math.E;
  if (branch !== 0 && branch !== -1) return NaN;
  if (Number.isNaN(x) || x < boundary || (branch === -1 && x > 0)) return NaN;
  if (x === boundary) return -1;
  if (x === 0) return branch === -1 ? -Infinity : x;
  if (x === Infinity) return Infinity;
  if (branch === 0 && Math.abs(x) < 1e-8) return x - x * x + 1.5 * x * x * x;
  let left: number, right: number;
  if (branch === -1) {
    const target = Math.log(-x);
    left = target - 2 * Math.log(-target) - 2; right = -1;
    for (let i = 0; i < 100; i++) {
      const middle = (left + right) / 2;
      if (middle + Math.log(-middle) < target) left = middle; else right = middle;
    }
  } else {
    left = x < 0 ? -1 : 0; right = x < 0 ? 0 : x <= 1 ? x : Math.max(1, Math.log(x));
    for (let i = 0; i < 100; i++) {
      const middle = (left + right) / 2;
      const below = x > 0 ? middle + Math.log(middle) < Math.log(x) : middle * Math.exp(middle) < x;
      if (below) left = middle; else right = middle;
    }
  }
  return (left + right) / 2;
}

function agm(a: number, b: number): number {
  if (!Number.isFinite(a) || !Number.isFinite(b) || a < 0 || b < 0) return NaN;
  if (a === 0 || b === 0) return 0;
  for (let i = 0; i < 60; i++) {
    const nextA = a / 2 + b / 2, nextB = Math.sqrt(a) * Math.sqrt(b);
    if (Math.abs(nextA - nextB) <= 2e-15 * nextA) return nextA;
    a = nextA; b = nextB;
  }
  return a;
}

// Complete elliptic integrals use the parameter m=k² (not the modulus k).
// AGM transformations: https://dlmf.nist.gov/19.8
function elliptic(m: number, secondKind: boolean): number {
  if (!Number.isFinite(m) || m < 0 || m > 1) return NaN;
  if (m === 1) return secondKind ? 1 : Infinity;
  let a = 1, b = Math.sqrt(1 - m), correction = m / 2, weight = 1;
  for (let i = 0; i < 60; i++) {
    const c = (a - b) / 2;
    correction += weight * c * c;
    const nextA = (a + b) / 2;
    b = Math.sqrt(a * b); a = nextA;
    if (Math.abs(c) <= 1e-15 * a) break;
    weight *= 2;
  }
  const k = Math.PI / (2 * a);
  return secondKind ? k * (1 - correction) : k;
}

function exponentialIntegralE1(x: number): number {
  if (x === Infinity) return 0;
  if (x === 0) return Infinity;
  if (!Number.isFinite(x) || x < 0) return NaN;
  if (x <= 1) {
    let term = -x, sum = term;
    for (let k = 2; k < 100; k++) { term *= -x / k; const add = term / k; sum += add; if (Math.abs(add) < 1e-16) break; }
    return -0.5772156649015329 - Math.log(x) - sum;
  }
  let b = x + 1, c = 1e300, d = 1 / b, h = d;
  for (let i = 1; i <= 200; i++) {
    const a = -i * i;
    b += 2; d = 1 / (b + a * d); c = b + a / c;
    const delta = c * d; h *= delta;
    if (Math.abs(delta - 1) < 1e-15) break;
  }
  return h * Math.exp(-x);
}

function primeFactors(n: number): [number, number][] | null {
  if (!Number.isInteger(n) || n < 1 || n > 1e9) return null;
  const factors: [number, number][] = [];
  for (let p = 2; p * p <= n; p = p === 2 ? 3 : p + 2) {
    let count = 0;
    while (n % p === 0) { n /= p; count++; }
    if (count) factors.push([p, count]);
  }
  if (n > 1) factors.push([n, 1]);
  return factors;
}

function bernstein(n: number, k: number, x: number): number {
  if (!Number.isInteger(n) || n < 0 || n > 200 || !Number.isInteger(k) || k < 0 || k > n || !(x >= 0 && x <= 1)) return NaN;
  if (x === 0) return k === 0 ? 1 : 0;
  if (x === 1) return k === n ? 1 : 0;
  let logCoefficient = 0;
  for (let i = 1; i <= Math.min(k, n - k); i++) logCoefficient += Math.log(n - i + 1) - Math.log(i);
  return Math.exp(logCoefficient + k * Math.log(x) + (n - k) * Math.log1p(-x));
}

function factorialProduct(x: number, n: number, direction: number): number {
  if (!Number.isFinite(x) || !Number.isInteger(n) || n < 0 || n > 200) return NaN;
  let result = 1;
  for (let i = 0; i < n; i++) result *= x + direction * i;
  return result;
}

function powerMean(p: number, ...xs: number[]): number {
  if (!Number.isFinite(p) || !xs.length || xs.some(x => !Number.isFinite(x) || x <= 0)) return NaN;
  const logs = xs.map(Math.log);
  const center = logs.reduce((a, b) => a + b, 0) / xs.length;
  if (p === 0) return Math.exp(center);
  const values = logs.map(x => p * (x - center));
  if (values.some(x => !Number.isFinite(x))) return NaN;
  if (Math.max(...values.map(Math.abs)) < 1e-4) {
    return Math.exp(center + Math.log1p(values.reduce((sum, x) => sum + Math.expm1(x), 0) / xs.length) / p);
  }
  const largest = Math.max(...values);
  return Math.exp(center + (largest + Math.log(values.reduce((sum, x) => sum + Math.exp(x - largest), 0) / xs.length)) / p);
}

function entry(name: string, category: string, description: string, fn: NumericFunction): FunctionEntry {
  return { name, category, description, fn };
}

export const SPECIAL_FUNCTIONS: FunctionEntry[] = [
  entry('zeta', 'Especiales', 'zeta(s,a=1): zeta de Hurwitz Σ(n+a)^(-s); a=1 da la zeta de Riemann. Dominio implementado: 1<s≤1000, a>0 finito. Aproximación Euler–Maclaurin.', zeta),
  entry('polygamma', 'Especiales', 'polygamma(orden,x): derivada de orden+1 de log Γ(x); orden 0 es digamma, 1 es trigamma. Orden entero 0–20, x>0 finito; aproximación numérica.', polygamma),
  entry('lambertW', 'Especiales', 'lambertW(x,rama=0): resuelve w·exp(w)=x. Rama 0: x≥-1/e; rama -1: -1/e≤x≤0. Solo ramas reales; aproximación por bisección.', lambertW),
  entry('expIntegralE1', 'Especiales', 'expIntegralE1(x): integral de exp(-t)/t desde x hasta ∞; x≥0. Serie y fracción continua aproximadas.', exponentialIntegralE1),
  entry('agm', 'Elípticas', 'agm(a,b): media aritmético-geométrica, límite de iterar media aritmética y geométrica. a,b≥0 finitos.', agm),
  entry('ellipticK', 'Elípticas', 'ellipticK(m): integral elíptica completa de primera especie ∫₀^(π/2)(1-m·sin²t)^(-1/2)dt. Parámetro m=k², 0≤m≤1; K(1)=∞. Aproximación AGM.', m => elliptic(m, false)),
  entry('ellipticE', 'Elípticas', 'ellipticE(m): integral elíptica completa de segunda especie ∫₀^(π/2)√(1-m·sin²t)dt. Parámetro m=k², 0≤m≤1; E(1)=1. Aproximación AGM.', m => elliptic(m, true)),
  entry('totient', 'Teoría de números', 'totient(n): función φ de Euler, cuenta enteros 1≤k≤n coprimos con n; entero 1≤n≤10⁹.', n => { const f = primeFactors(n); if (!f) return NaN; let result = n; for (const [p] of f) result = result / p * (p - 1); return Math.round(result); }),
  entry('mobius', 'Teoría de números', 'mobius(n): función μ de Möbius: 0 si n tiene un factor cuadrado; (-1)^r si tiene r factores primos distintos; μ(1)=1. Entero 1≤n≤10⁹.', n => { const f = primeFactors(n); return !f ? NaN : f.some(([, e]) => e > 1) ? 0 : f.length % 2 ? -1 : 1; }),
  entry('liouville', 'Teoría de números', 'liouville(n): función λ(n)=(-1)^Ω(n), contando factores primos con multiplicidad. Entero 1≤n≤10⁹.', n => { const f = primeFactors(n); return f ? f.reduce((sum, [, e]) => sum + e, 0) % 2 ? -1 : 1 : NaN; }),
  entry('divisorSigma', 'Teoría de números', 'divisorSigma(n,p=1): suma de las potencias p de los divisores positivos; p=0 cuenta divisores. Entero 1≤n≤10⁹, p finito.', (n, p = 1) => { const f = primeFactors(n); if (!f || !Number.isFinite(p)) return NaN; let result = 1; for (const [prime, exponent] of f) { let sum = 1; for (let k = 1; k <= exponent; k++) sum += prime ** (p * k); result *= sum; } return result; }),
  entry('laguerre', 'Polinomios', 'laguerre(n,x,alpha=0): polinomio de Laguerre generalizado Lₙ^(alpha)(x). Entero 0≤n≤200, alpha>-1; recurrencia numérica.', (n, x, alpha = 0) => orthogonal('generalizedLaguerre', n, x, alpha)),
  entry('jacobi', 'Polinomios', 'jacobi(n,x,alpha=0,beta=0): polinomio de Jacobi Pₙ^(alpha,beta)(x). Entero 0≤n≤200; alpha,beta>-1; recurrencia numérica.', (n, x, alpha = 0, beta = 0) => orthogonal('jacobi', n, x, alpha, beta)),
  entry('gegenbauer', 'Polinomios', 'gegenbauer(n,x,lambda=1): polinomio ultrasférico Cₙ^(lambda)(x). Entero 0≤n≤200, lambda>0; recurrencia numérica.', (n, x, lambda = 1) => orthogonal('gegenbauer', n, x, lambda)),
  entry('hermiteHe', 'Polinomios', 'hermiteHe(n,x): Hermite probabilista Heₙ(x), He₁=x. Entero 0≤n≤200; recurrencia numérica. hermite(n,x) usa la convención de física.', (n, x) => orthogonal('hermiteHe', n, x)),
  entry('bernstein', 'Polinomios', 'bernstein(n,k,x): base de Bernstein choose(n,k)·x^k·(1-x)^(n-k). Enteros 0≤k≤n≤200, 0≤x≤1; evaluación logarítmica.', bernstein),
  entry('risingFactorial', 'Enteros', 'risingFactorial(x,n): producto x(x+1)…(x+n-1); x real finito, n entero 0–200. Para n=0 devuelve 1.', (x, n) => factorialProduct(x, n, 1)),
  entry('fallingFactorial', 'Enteros', 'fallingFactorial(x,n): producto x(x-1)…(x-n+1); x real finito, n entero 0–200. Para n=0 devuelve 1.', (x, n) => factorialProduct(x, n, -1)),
  entry('powerMean', 'Estadística', 'powerMean(p,a,b,…): media generalizada de orden real p; valores positivos finitos. p=0 geométrica, p=-1 armónica, p=1 aritmética; evaluación logarítmica.', powerMean),
];

function constant(name: string, value: number, definition: string): ConstantEntry {
  return { name, value, description: `${name} ≈ ${value}: ${definition}` };
}

// Named constants, rounded to available IEEE-754 precision; definitions and
// references: Wolfram MathWorld pages named in the descriptions below.
export const SPECIAL_CONSTANTS: ConstantEntry[] = [
  constant('DOTTIE', 0.7390851332151607, 'número de Dottie, solución real de cos(x)=x.'),
  constant('TWIN_PRIME', 0.6601618158468696, 'constante de los primos gemelos C₂, producto de 1-1/(p-1)² sobre primos p>2.'),
  constant('ARTIN', 0.3739558136192023, 'constante de Artin, producto de 1-1/(p(p-1)) sobre todos los primos.'),
  constant('LEVY', Math.exp(Math.PI ** 2 / (12 * Math.LN2)), 'constante de Lévy, tasa de crecimiento de los denominadores de casi todas las fracciones continuas.'),
  constant('CONWAY', 1.3035772690342964, 'constante de Conway, tasa de crecimiento asintótica de la sucesión «look-and-say».'),
  constant('CHAMPERNOWNE', 0.12345678910111213, 'constante de Champernowne en base 10: concatenación decimal 0,123456789101112…; valor redondeado.'),
  constant('COPELAND_ERDOS', 0.23571113171923293, 'constante de Copeland–Erdős en base 10: concatenación decimal de los números primos; valor redondeado.'),
  constant('LANDAU_RAMANUJAN', 0.7642236535892206, 'constante de Landau–Ramanujan: los enteros ≤x expresables como suma de dos cuadrados son asintóticamente K·x/√log(x).'),
  constant('MEISSEL_MERTENS', 0.2614972128476428, 'constante de Meissel–Mertens, límite de Σ(p≤x)1/p-log(log(x)), con p primo.'),
  constant('CAHEN', 0.643410546288338, 'constante de Cahen, suma alternada de 1/(sₙ-1) para la sucesión de Sylvester 2,3,7,43,…'),
  constant('ERDOS_BORWEIN', 1.6066951524152917, 'constante de Erdős–Borwein, suma de 1/(2ⁿ-1) para n≥1.'),
  constant('RECIPROCAL_FIBONACCI', 3.3598856662431775, 'constante de los inversos de Fibonacci, suma de 1/Fₙ para n≥1, con F₁=F₂=1.'),
  constant('LEMNISCATE', 2.6220575542921198, 'constante lemniscática ϖ=2∫₀¹dt/√(1-t⁴), semiperíodo de las funciones lemniscáticas.'),
];

