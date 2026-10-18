/** BigInt factorization, for use in a worker. ECM stage 1: Montgomery/Suyama.
 * References: members.loria.fr/PZimmermann/papers/Chap8.pdf;
 * miller-rabin.appspot.com/ (deterministic bases below 2^64).
 */
export interface PrimeFactor { base: string; exponent: number; certainty: 'prime' | 'probable'; proof?: string; }
export interface PendingFactor { base: string; exponent: number; }
export interface FactorizationResult {
  input: string; factors: PrimeFactor[]; pending: PendingFactor[];
  status: 'running' | 'complete' | 'partial'; stage: string;
  elapsedMs: number; operations: number; curves: number;
  proofRequired?: boolean;
}
export interface FactorizationOptions {
  /** null disables the deadline, including subsidiary primality proofs. */
  timeMs?: number | null; requireProof?: boolean; onProgress?: (result: FactorizationResult) => void; now?: () => number;
}
export function parseInteger(text: string): bigint {
  const value = text.trim();
  if (!/^[+-]?\d+$/.test(value)) throw new Error('Escribe un entero decimal, sin puntos, comas ni exponentes.');
  const n = BigInt(value);
  if (n === 0n) throw new Error('El cero no tiene una factorización finita en primos.');
  return n;
}
const abs = (a: bigint): bigint => a < 0n ? -a : a;
const mod = (a: bigint, n: bigint): bigint => ((a % n) + n) % n;
export function gcd(a: bigint, b: bigint): bigint {
  while (b) [a, b] = [b, a % b];
  return abs(a);
}
function primesTo(limit: number): number[] {
  const sieve = new Uint8Array(limit + 1), primes: number[] = [];
  for (let p = 2; p <= limit; p++) if (!sieve[p]) {
    primes.push(p);
    for (let j = p * p; j <= limit; j += p) sieve[j] = 1;
  }
  return primes;
}
const PRIMES = primesTo(50000);
const BASES64 = [2n, 325n, 9375n, 28178n, 450775n, 9780504n, 1795265022n];
class TimeLimit extends Error {}
type Point = readonly [bigint, bigint];

export function factorInteger(text: string, options: FactorizationOptions = {}): FactorizationResult {
  const input = parseInteger(text), positive = abs(input);
  const now = options.now ?? (() => performance.now());
  const started = now(), timeMs = options.timeMs === null ? Infinity : options.timeMs ?? 15000;
  if (options.timeMs !== null && !(timeMs > 0 && Number.isFinite(timeMs))) throw new Error('El tiempo debe ser positivo y finito, o null para una búsqueda sin límite.');
  let lastReport = -Infinity, operations = 0, curves = 0, stage = 'División por primos pequeños';
  const factors = new Map<bigint, PrimeFactor>();
  const pending: { value: bigint; exponent: number }[] = positive > 1n ? [{ value: positive, exponent: 1 }] : [];
  const snapshot = (status: FactorizationResult['status']): FactorizationResult => ({
    input: input.toString(), proofRequired: !!options.requireProof, factors: [...factors.values()].map(f => ({ ...f })).sort((a, b) => BigInt(a.base) < BigInt(b.base) ? -1 : 1),
    pending: pending.map(p => ({ base: p.value.toString(), exponent: p.exponent })),
    status, stage, elapsedMs: Math.max(0, now() - started), operations, curves,
  });
  const report = (force = false): void => {
    const t = now();
    if (force || t - lastReport >= 100) { lastReport = t; options.onProgress?.(snapshot('running')); }
  };
  const check = (): void => {
    operations++;
    if (now() - started >= timeMs) throw new TimeLimit();
    report();
  };
  const power = (a: bigint, e: bigint, n: bigint): bigint => {
    let r = 1n; a = mod(a, n);
    while (e) { check(); if (e & 1n) r = r * a % n; a = a * a % n; e >>= 1n; }
    return r;
  };
  const randomBelow = (limit: bigint): bigint => {
    const bits = limit.toString(2).length, bytes = new Uint8Array(Math.ceil(bits / 8));
    for (;;) {
      check();
      for (let i = 0; i < bytes.length; i += 65536) crypto.getRandomValues(bytes.subarray(i, i + 65536));
      bytes[0] &= 255 >>> (bytes.length * 8 - bits);
      const value = BigInt('0x' + Array.from(bytes, b => b.toString(16).padStart(2, '0')).join(''));
      if (value < limit) return value;
    }
  };
  const primality = (n: bigint): PrimeFactor['certainty'] | null => {
    for (const p of PRIMES.slice(0, 25)) {
      if (n === BigInt(p)) return 'prime';
      if (n % BigInt(p) === 0n) return null;
    }
    let d = n - 1n, s = 0;
    while (!(d & 1n)) { d >>= 1n; s++; }
    const deterministic = n < (1n << 64n);
    for (let i = 0; i < (deterministic ? BASES64.length : 32); i++) {
      const a = deterministic ? BASES64[i] % n : 2n + randomBelow(n - 3n);
      if (a === 0n) continue;
      let x = power(a, d, n);
      if (x === 1n || x === n - 1n) continue;
      let passed = false;
      for (let r = 1; r < s; r++) { check(); x = x * x % n; if (x === n - 1n) { passed = true; break; } }
      if (!passed) return null;
    }
    return deterministic ? 'prime' : 'probable';
  };
  const addFactor = (n: bigint, exponent: number, certainty: PrimeFactor['certainty'], proof?: string): void => {
    factors.set(n, { base: n.toString(), exponent: (factors.get(n)?.exponent ?? 0) + exponent, certainty, proof });
  };
  const squareRoot = (n: bigint): bigint => {
    let x = 1n << BigInt(Math.ceil(n.toString(2).length / 2));
    for (;;) { check(); const y = (x + n / x) >> 1n; if (y >= x) return x; x = y; }
  };
  const pMinusOne = (n: bigint): bigint => {
    let a = 2n;
    for (const p of PRIMES) {
      if (p > 2000) break;
      let pk = p; while (pk * p <= 2000) pk *= p;
      a = power(a, BigInt(pk), n);
      const g = gcd(a - 1n, n);
      if (g > 1n) return g < n ? g : 1n;
    }
    return 1n;
  };
  const brent = (n: bigint, limit: number): bigint => {
    let y = 1n + randomBelow(n - 1n);
    const c = 1n + randomBelow(n - 1n);
    let g = 1n, r = 1, x = y, ys = y, used = 0;
    const f = (v: bigint): bigint => { check(); used++; return (v * v + c) % n; };
    while (g === 1n && used < limit) {
      x = y;
      for (let i = 0; i < r && used < limit; i++) y = f(y);
      for (let k = 0; k < r && g === 1n && used < limit; k += 64) {
        ys = y; let q = 1n;
        for (let i = 0; i < Math.min(64, r - k) && used < limit; i++) { y = f(y); q = q * abs(x - y) % n; }
        g = gcd(q, n);
      }
      r *= 2;
    }
    if (g === n) do { ys = f(ys); g = gcd(abs(x - ys), n); } while (g === 1n && used < limit);
    return g > 1n && g < n ? g : 1n;
  };
  const ecm = (n: bigint, bound: number): bigint => {
    curves++;
    const sigma = 6n + randomBelow(n - 6n), u = mod(sigma * sigma - 5n, n), v = 4n * sigma % n;
    const u3 = u * u % n * u % n, v3 = v * v % n * v % n;
    const denominator = 16n * u3 * v % n, g = gcd(denominator, n);
    if (g > 1n) return g < n ? g : 1n;
    let t = 0n, nextT = 1n, r = n, nextR = denominator;
    while (nextR) { check(); const q = r / nextR; [t, nextT] = [nextT, t - q * nextT]; [r, nextR] = [nextR, r - q * nextR]; }
    const a24 = mod((v - u) ** 3n * (3n * u + v) * mod(t, n), n);
    const double = ([x, z]: Point): Point => {
      const a = (x + z) ** 2n % n, b = mod((x - z) ** 2n, n), c = mod(a - b, n);
      return [a * b % n, c * mod(b + a24 * c, n) % n];
    };
    const add = ([x, z]: Point, [y, w]: Point, [dx, dz]: Point): Point => {
      const a = (x + z) * (y - w) % n, b = (x - z) * (y + w) % n;
      return [mod(dz * (a + b) ** 2n, n), mod(dx * (a - b) ** 2n, n)];
    };
    const multiply = (p: Point, scalar: number): Point => {
      let a = p, b = double(p);
      for (const bit of scalar.toString(2).slice(1)) { check(); if (bit === '0') { b = add(a, b, p); a = double(a); } else { a = add(a, b, p); b = double(b); } }
      return a;
    };
    let point: Point = [u3, v3];
    for (const p of PRIMES) {
      if (p > bound) break;
      let pk = p; while (pk * p <= bound) pk *= p;
      point = multiply(point, pk);
      const d = gcd(point[1], n);
      if (d > 1n) return d < n ? d : 1n;
    }
    return 1n;
  };
  const prove = (n: bigint): string | null => {
    // Lucas–Lehmer proves Mersenne primality; its exponent must itself be prime.
    const bits = n.toString(2);
    if (/^1+$/.test(bits) && primality(BigInt(bits.length)) === 'prime') {
      stage = 'Demostración · Lucas–Lehmer'; report(true);
      let s = 4n;
      for (let i = 0; i < bits.length - 2; i++) { check(); s = mod(s * s - 2n, n); }
      return s === 0n ? 'Lucas–Lehmer' : null;
    }
    // Pocklington: a completely proved divisor F of n−1 with F² > n is enough.
    // The subsidiary factorization has its own snapshots; none are published as
    // factors of the original input. It shares the outer wall-clock deadline.
    stage = 'Demostración · factorización de n−1'; report(true); check();
    let certified: PrimeFactor[] = [];
    class EnoughFactors extends Error {}
    const inspect = (r: FactorizationResult): void => {
      check();
      operations += Math.max(0, r.operations - subsidiaryOperations);
      subsidiaryOperations = r.operations;
      certified = r.factors.filter(f => f.certainty === 'prime');
      const f = certified.reduce((v, q) => v * BigInt(q.base) ** BigInt(q.exponent), 1n);
      if (f * f > n && gcd(f, (n - 1n) / f) === 1n) throw new EnoughFactors();
    };
    let subsidiaryOperations = 0;
    try {
      const remaining = timeMs - (now() - started);
      if (remaining <= 0) throw new TimeLimit();
      const r = factorInteger((n - 1n).toString(), { requireProof: true, timeMs: timeMs === Infinity ? null : remaining, now, onProgress: inspect });
      inspect(r);
    } catch (error) { if (!(error instanceof EnoughFactors)) throw error; }
    const f = certified.reduce((v, q) => v * BigInt(q.base) ** BigInt(q.exponent), 1n);
    if (f * f <= n || (n - 1n) % f !== 0n || gcd(f, (n - 1n) / f) !== 1n) return null;
    stage = 'Demostración · testigos de Pocklington'; report(true);
    for (const q of certified) {
      let found = false;
      for (let attempt = 0; attempt < 64; attempt++) {
        const a = attempt < 8 ? BigInt(attempt + 2) : 2n + randomBelow(n - 3n);
        if (power(a, n - 1n, n) !== 1n) return null;
        if (gcd(power(a, (n - 1n) / BigInt(q.base), n) - 1n, n) === 1n) { found = true; break; }
      }
      if (!found) return null;
    }
    return 'Pocklington (n−1)';
  };
  report(true);
  try {
    while (pending.length) {
      const current = pending[pending.length - 1];
      stage = 'División por primos pequeños';
      for (const prime of PRIMES) {
        if (prime > 1000) break;
        check(); const p = BigInt(prime);
        if (current.value % p) continue;
        do {
          current.value /= p;
          addFactor(p, current.exponent, 'prime');
          check();
        } while (current.value % p === 0n);
        report(true);
      }
      if (current.value === 1n) { pending.pop(); continue; }
      stage = 'Detección de cuadrados perfectos';
      const root = squareRoot(current.value);
      if (root * root === current.value) { current.value = root; current.exponent *= 2; continue; }
      stage = 'Primalidad · Miller–Rabin';
      let certainty = primality(current.value);
      let proof: string | undefined;
      if (certainty === 'probable' && options.requireProof) {
        proof = prove(current.value) ?? undefined;
        if (!proof) {
          stage = 'Primalidad pendiente de demostración';
          return snapshot('partial');
        }
        certainty = 'prime';
      }
      if (certainty) {
        addFactor(current.value, current.exponent, certainty, proof ?? (certainty === 'prime' ? 'Miller–Rabin determinista (<2⁶⁴)' : undefined));
        pending.pop(); report(true); continue;
      }
      stage = 'Pollard p−1 · etapa 1';
      let divisor = pMinusOne(current.value), attempt = 0;
      while (divisor === 1n) {
        stage = 'Pollard–Brent · búsqueda de factores';
        divisor = brent(current.value, attempt < 2 ? 12000 : 50000);
        if (divisor !== 1n) break;
        const bound = attempt < 8 ? 2000 : attempt < 24 ? 10000 : 50000;
        stage = `ECM · curva ${curves + 1} · B₁ = ${bound}`;
        divisor = ecm(current.value, bound); attempt++;
      }
      const quotient = current.value / divisor;
      if (divisor <= 1n || quotient * divisor !== current.value) throw new Error('Factor interno no válido.');
      current.value = quotient;
      pending.push({ value: divisor, exponent: current.exponent }); report(true);
    }
  } catch (error) {
    if (!(error instanceof TimeLimit)) throw error;
    stage = 'Tiempo de búsqueda agotado';
    return snapshot('partial');
  }
  const reconstructed = [...factors.values()].reduce((n, f) => n * BigInt(f.base) ** BigInt(f.exponent), 1n);
  if (reconstructed !== positive) throw new Error('No se pudo verificar el producto de los factores.');
  stage = 'Producto verificado';
  return snapshot('complete');
}
