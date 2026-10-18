const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require('typescript');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const folder = path.join(root, 'src/app/widgets/prime-decomposition');
const compile = name => ts.transpileModule(fs.readFileSync(path.join(folder, name), 'utf8'), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
}).outputText;
// Reproducible search parameters in tests; the browser uses Web Crypto.
let seed = 123456789;
const crypto = { getRandomValues(bytes) { for (let i = 0; i < bytes.length; i++) { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; bytes[i] = seed >>> 24; } return bytes; } };
const engine = {};
vm.runInNewContext(compile('factorization-engine.ts'), { exports: engine, crypto, performance });
function verify(result) {
  const n = BigInt(result.input), positive = n < 0n ? -n : n;
  const product = [...result.factors, ...result.pending].reduce((n, f) => n * BigInt(f.base) ** BigInt(f.exponent), 1n);
  assert.equal(product, positive, 'exact product invariant, including partial snapshots');
}
function run(input, options = {}) {
  const result = engine.factorInteger(String(input), { timeMs: 10000, onProgress: verify, ...options });
  verify(result); return result;
}
function trial(n) {
  const result = [];
  for (let p = 2; p * p <= n; p++) {
    let e = 0; while (n % p === 0) { n /= p; e++; }
    if (e) result.push([String(p), e]);
  }
  if (n > 1) result.push([String(n), 1]);
  return result;
}
for (let n = 1; n <= 600; n++) {
  const r = run(n); assert.equal(r.status, 'complete');
  assert.equal(JSON.stringify(r.factors.map(f => [f.base, f.exponent])), JSON.stringify(trial(n)));
  assert(r.factors.every(f => f.certainty === 'prime'));
}
for (const input of ['', '0', '-0', '1e20', '12.3', '1,000', '3abc', '2 3', 'Infinity', 'NaN']) assert.throws(() => engine.parseInteger(input));
assert.equal(engine.parseInteger(' +000123 '), 123n);
assert.equal(run(-360).input, '-360');
assert.equal(run(-1).factors.length, 0);
assert.equal(run('9007199254740993').factors[2].base, '28059810762433');
const square = run(1000000007n ** 4n);
assert.equal(square.factors[0].exponent, 4);
assert.equal(square.factors[0].base, '1000000007');
const giant = run(2n ** 4096n);
assert.equal(giant.input.length, 1234); assert.equal(giant.factors[0].exponent, 4096);
for (const composite of ['3215031751', '341550071728321', '3825123056546413051']) {
  const r = run(composite); assert.equal(r.status, 'complete'); assert(r.factors.length > 1);
}
const ecm = run('1050809297549059047257');
assert.equal(ecm.status, 'complete'); assert(ecm.curves > 0, 'ECM path exercised');
assert.equal(ecm.factors.map(f => f.base).join(','), '32416187567,32416190071');
const prime64 = run('18446744073709551557');
assert.equal(prime64.factors[0].certainty, 'prime');
const probable = run('170141183460469231731687303715884105727');
assert.equal(probable.factors[0].certainty, 'probable');
for (const [input, proof] of [
  ['170141183460469231731687303715884105727', 'Lucas–Lehmer'],
  ['18446744073709551629', 'Pocklington (n−1)'],
  ['18446744073709551653', 'Pocklington (n−1)'],
]) {
  const r = run(input, { requireProof: true });
  assert.equal(r.status, 'complete'); assert.equal(r.proofRequired, true);
  assert.equal(r.factors[0].certainty, 'prime'); assert.equal(r.factors[0].proof, proof);
  let clock = 0;
  const interrupted = run(input, {
    requireProof: true, timeMs: 100, now: () => clock,
    onProgress: r => { verify(r); if (r.stage.startsWith('Demostración')) clock = 101; },
  });
  assert.equal(interrupted.status, 'partial'); assert.equal(interrupted.factors.length, 0);
  assert.equal(interrupted.pending[0].base, input);
}
const provedProduct = run(-8n * 18446744073709551629n, { requireProof: true });
assert.equal(provedProduct.status, 'complete'); assert(provedProduct.factors.every(f => f.certainty === 'prime'));
assert.equal(run('360', { timeMs: 600000 }).status, 'complete');
let unlimitedClock = 0;
const unlimited = run('18446744073709551629', { timeMs: null, requireProof: true, now: () => unlimitedClock += 1000000 });
assert.equal(unlimited.status, 'complete');
assert.equal(unlimited.factors[0].certainty, 'prime');
assert.equal(unlimited.factors[0].proof, 'Pocklington (n−1)');
for (const timeMs of [0, -1, Infinity, NaN]) assert.throws(() => run('360', { timeMs }));
let ticks = 0;
const partial = run((2n ** 12n) * ((1n << 521n) - 1n) * ((1n << 607n) - 1n), { timeMs: 800, now: () => ticks++ });
assert.equal(partial.status, 'partial'); assert(partial.pending.length); assert(partial.factors.length);
let receive; const messages = [];
vm.runInNewContext(compile('factorization.worker.ts'), { exports: {}, require: () => engine, addEventListener: (_, callback) => { receive = callback; }, postMessage: message => messages.push(message) });
receive({ data: { input: '360', timeMs: 1000 } });
assert.equal(messages.at(-1).kind, 'result'); verify(messages.at(-1).result);
receive({ data: { input: '170141183460469231731687303715884105727', timeMs: 1000, requireProof: true } });
assert.equal(messages.at(-1).result.factors[0].proof, 'Lucas–Lehmer');
receive({ data: { input: '0', timeMs: 1000 } }); assert.equal(messages.at(-1).kind, 'error');
console.log('PASS exhaustive 1–600; exact products at every progress event; validation/sign/units; >2^53; 1234 digits; powers; strong pseudoprimes; 64-bit proof vs 127-bit probable prime; ECM; timeout; worker protocol.');
