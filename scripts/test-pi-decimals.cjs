const fs = require('node:fs'), vm = require('node:vm'), ts = require('typescript'), assert = require('node:assert/strict'), path = require('node:path');
const folder = path.resolve(__dirname, '../src/app/tools/pi-decimal');
const compile = file => ts.transpileModule(fs.readFileSync(path.join(folder, file), 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText;
const engine = {};
vm.runInNewContext(compile('pi-engine.ts'), { exports: engine, performance });
// Independent Machin formula with fixed-point integer arithmetic and 30 guard
// digits. Its truncation errors are negligible at these test precisions.
function machin(n) {
  const scale = 10n ** BigInt(n + 30);
  const atan = q => {
    let x = scale / q, sum = 0n, k = 0;
    while (x) { sum += (k % 2 ? -1n : 1n) * (x / BigInt(2 * k + 1)); x /= q * q; k++; }
    return sum;
  };
  return ((16n * atan(5n) - 4n * atan(239n)) / (10n ** 30n)).toString().slice(1);
}
const reference = machin(10000);
assert(reference.startsWith('14159265358979323846264338327950288419716939937510'));
for (const n of [...Array(201).keys(), 999, 1000, 1001, 9999, 10000]) {
  const progress = [];
  const r = engine.calculatePi(n, p => progress.push(p));
  assert.equal(r.decimals, reference.slice(0, n), 'independent agreement at '+n+' digits');
  assert.equal(r.digits, n); assert.equal(r.decimals.length, n);
  assert.equal(progress.at(-1).stage, 'verify');
  assert(progress.every(p => p.completedTerms <= p.totalTerms));
}
for (const n of [-1, 1.5, NaN, Infinity, 1000001]) assert.throws(() => engine.calculatePi(n));
for (const n of [0n, 1n, 2n, 3n, 4n, 10005n * 10n ** 200n, (1n << 4096n) - 1n]) {
  const root = engine.integerSqrt(n); assert(root * root <= n && (root + 1n) ** 2n > n);
}
assert.throws(() => engine.integerSqrt(-1n));
for (const size of [0, 1, 3, 7, 10, 100, 1000]) {
  const blocks = engine.digitBlocks(reference, size);
  assert.equal(blocks.join(''), reference);
  if (size) assert(blocks.slice(0, -1).every(block => block.length === size));
  assert.equal(engine.piText(reference, size, true).replace(/\s/g, ''), '3.' + reference);
  if (size) assert.equal(engine.piText(reference, size, true), ['3.', ...blocks].join('\r\n') + '\r\n');
  assert.equal(engine.piText(reference, size, false), '3.' + reference + '\n');
}
assert.equal(engine.piText('', 10, true), '3\r\n');
for (const size of [-1, 1.5, NaN, Infinity, 1001]) assert.throws(() => engine.digitBlocks(reference, size));
let receive; const messages = [];
vm.runInNewContext(compile('pi.worker.ts'), { exports: {}, require: () => engine, addEventListener: (_, callback) => { receive = callback; }, postMessage: message => messages.push(message) });
receive({ data: { digits: 100 } }); assert.equal(messages.at(-1).kind, 'result'); assert.equal(messages.at(-1).result.decimals, reference.slice(0, 100));
receive({ data: { digits: -1 } }); assert.equal(messages.at(-1).kind, 'error');
console.log('PASS independent Machin comparison (0–200, 999/1000/1001 and 9999/10000 digits); integer-root bounds; validation; blocks; complete grouped/plain TXT; worker protocol.');
