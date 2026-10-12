const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const article = path.join(root, 'src/app/articles/combinatorics/googology');
function load(file) {
  const result = { exports: {} };
  const source = fs.readFileSync(file, 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, experimentalDecorators: true } }).outputText;
  const requireLocal = name => name.includes('googology.model') ? m : new Proxy({}, { get: (_, key) => key === 'Component' ? () => target => target : class {} });
  vm.runInThisContext(`(function(require,module,exports){${code}\n})`, { filename: file })(requireLocal, result, result.exports);
  return result.exports;
}
const m = load(path.join(article, 'googology.model.ts'));
const near = (a, b) => assert(Math.abs(a - b) < 1e-10, `${a} vs ${b}`);
const pow = (a, b) => a ** b;
assert.equal(m.factory(3, 3, 1, 3).value, 12n);
assert.equal(m.factory(3, 3, 2, 3).value, 81n);
assert.equal(m.factory(3, 3, 3, 1).value, 27n);
assert.equal(m.factory(3, 3, 3, 2).value, 7625597484987n);
assert.equal(m.factory(3, 3, 4, 1).value, 7625597484987n);
assert.equal(m.factory(2, 2, 5, 1).value, 4n);
assert.equal(m.factory(2, 3, 5, 1).value, 65536n);
assert.equal(m.factory(2, 2, 6, 1).value, 4n);
assert.equal(m.factory(3, 0, 4, 1).value, 1n);
assert.equal(m.factory(10, 3, 3, 2).digits, '1001');
assert.equal(m.factory(10, 3, 3, 2).value, null);
for (let a = 2; a <= 10; a++) for (let b = 0; b <= 6; b++) {
  assert.equal(m.factory(a, b, 3, 1).value, pow(BigInt(a), BigInt(b)));
  assert.equal(m.factory(a, b, 1, 6).value, BigInt(b + 6 * a));
  assert.equal(m.factory(a, b, 2, 6).value, BigInt(b) * BigInt(a) ** 6n);
}
assert.equal(m.tower(3, 0).value, 1n);
assert.equal(m.tower(3, 3).value, 3n ** 27n);
assert.equal(m.tower(2, 4).value, 65536n);
assert.equal(m.tower(2, 5).value, null);
assert(m.towerTex(3, 12).length < 80);
assert.equal(m.ordinaryPower(10, 13).value, 10n ** 13n);
for (let n = 0; n <= 12; n++) {
  assert.equal(m.fastGrowth(0, n).value, BigInt(n + 1));
  assert.equal(m.fastGrowth(1, n).value, BigInt(2 * n));
  assert.equal(m.fastGrowth(2, n).value, BigInt(n) * 2n ** BigInt(n));
}
assert.equal(m.fastGrowth(3, 2).value, 2048n);
assert.equal(m.fastGrowth(3, 3).value, null);
assert.equal(m.fastGrowth(4, 1).value, 2n);
for (let n = 1; n <= 12; n++) {
  assert.equal(m.growth('exp', n).value, 2n ** BigInt(n));
  assert.equal(m.growth('self', n).value, BigInt(n) ** BigInt(n));
}
assert.equal(m.growth('factorial', 12).value, 479001600n);
near(m.logInteger(10n ** 100n), 100);
near(m.logInteger(101n), Math.log10(101));
const writing = m.writingEstimate('1000', 1, 10);
near(writing.logMetres, 0); near(writing.logSeconds, 2);
near(writing.logAu, -Math.log10(149597870700));
assert(Number.isFinite(m.writingEstimate(String(10n ** 100n + 1n), 1, 10).logMetres));
for (let a = 0; a <= 20; a++) for (let e = 0; e <= 30; e++) for (let k = 1; k <= 6; k++) {
  if (a === 0 && e === 0) continue;
  assert.equal(m.lastDigits(String(a), String(e), k), (BigInt(a) ** BigInt(e) % (10n ** BigInt(k))).toString().padStart(k, '0'));
}
assert.equal(m.lastDigits('7', '1000', 6), (7n ** 1000n % 1000000n).toString().padStart(6, '0'));
assert.equal(m.lastDigits('10', '0', 3), '001');
assert.equal(m.lastDigits('2', '1' + '0'.repeat(99), 12).length, 12);
assert.throws(() => m.lastDigits('0', '0', 6));
assert.throws(() => m.lastDigits('1e6', '2', 6));
assert.throws(() => m.lastDigits('3', '-1', 6));
assert.throws(() => m.writingEstimate('0', 1, 10));
assert.throws(() => m.writingEstimate('1'.repeat(121), 1, 10));
assert.throws(() => m.factory(10, 7, 4, 1));
assert.throws(() => m.factory(2, 2, 7, 1));
assert.throws(() => m.tower(3, 13));
assert.throws(() => m.fastGrowth(5, 3));
for (const [i, expected] of [[0, [0,2]], [1, null], [2, null], [3, [1,2]]]) {
  const ex = m.TREE_EXAMPLES[i]; assert.deepEqual(m.embedding(ex.source, ex.target), expected);
}
const branch = { parents: [-1,0,0,1,1], labels: [1,2,3,3,2] };
assert.equal(m.meet(branch, 3, 4), 1);
assert.equal(m.meet(branch, 2, 4), 0);
assert.deepEqual(m.embedding(branch, branch), [0,1,2,3,4]);
assert.throws(() => m.embedding({ parents: [-1,1], labels: [1,1] }, branch));
const sequence = [ { parents: [-1], labels: [1] }, { parents: [-1,0], labels: [2,2] }, { parents: [-1], labels: [2] } ];
assert(m.badSequence(sequence, 2));
assert(!m.badSequence([...sequence, sequence[2]], 2));
assert(!m.badSequence([sequence[1]], 2));
assert(!m.badSequence(sequence, 1));
for (const [index, steps, ones, status] of [[0,1,1,'Detenida'], [1,6,4,'Detenida'], [2,21,5,'Detenida'], [3,200,200,'Límite alcanzado']]) {
  let state = m.initialMachine();
  for (let i = 0; i < 250; i++) state = m.stepMachine(m.MACHINES[index], state);
  assert.equal(state.steps, steps); assert.equal(state.tape.size, ones); assert.equal(state.status, status);
  assert.strictEqual(m.stepMachine(m.MACHINES[index], state), state);
}
// Independently check each challenge using tractable algebraic comparison.
assert(2n ** 1000n > 10n ** 100n);
assert(10n ** 100n > 1000n);
assert(3n ** 27n > 512n && 3n ** 512n > 4n ** 256n);
assert(3n ** 27n > (3n ** 3n) ** 3n);
assert(16n > 4n); assert(27n > 24n);
assert.deepEqual(m.CHALLENGES.map(c => c.answer), ['right','left','left','left','left','right']);
const { GoogologyArticleComponent } = load(path.join(article, 'googology-article.component.ts'));
const page = new GoogologyArticleComponent();
assert.equal(page.factoryResult.value, 27n);
page.base = 10; page.operand = 6; page.rank = 6; page.iterations = 6; page.updateFactory();
assert.equal(page.factoryResult.status, 'Simbólico'); assert.equal(page.factoryError, '');
page.resetFactory(); assert.equal(page.factoryResult.value, 27n);
page.base = NaN; page.updateFactory(); assert(page.factoryError); page.resetFactory();
page.toggleFunction('tower'); page.growthN = 12; page.updateGrowth();
assert(page.growthPaths.every(p => !/Infinity|NaN/.test(p.points)));
page.growthScale = 'linear'; page.updateGrowth(); assert(page.growthPaths.every(p => !/Infinity|NaN/.test(p.points)));
page.writingDigits = ''; page.updateWriting(); assert(page.writingError);
page.writingPreset('googolplex'); assert.equal(page.writingError, '');
page.modularBase = ''; page.updateModular(); assert(page.modularError);
page.answer('right'); assert.equal(page.challengeScore, 1);
page.machineIndex = 2; page.resetMachine(); page.run(); assert.equal(page.machineState.steps, 21);
const html = fs.readFileSync(path.join(article, 'googology-article.component.html'), 'utf8');
const narrative = [...html.matchAll(/<div class="prose">([\s\S]*?)<\/div>/g)].map(m => m[1].replace(/<[^>]*>/g,' ')).join(' ');
const words = narrative.trim().split(/\s+/).length;
assert(words >= 1000 && words <= 1500);
const sourceFiles = fs.readdirSync(path.join(root, 'src/app/articles'), {recursive: true}).filter(f => f.endsWith('.ts'));
const routes = new Set(sourceFiles.flatMap(file => [...fs.readFileSync(path.join(root, 'src/app/articles', file), 'utf8').matchAll(/static\s+(?:readonly\s+)?route(?:\s*:\s*string)?\s*=\s*['"]([^'"]+)/g)].map(m=>m[1])));
for (const link of [...html.matchAll(/routerLink="\/articles\/([^"#]+)/g)].map(m=>m[1])) assert(routes.has(link), `Missing route: ${link}`);
for (const milestone of m.MILESTONES) assert(routes.has(milestone.link), milestone.link);
const start = performance.now();
for (let a = 2; a <= 10; a++) for (let b = 0; b <= 6; b++) for (let rank = 1; rank <= 6; rank++) {
  const result = m.factory(a, b, rank, 6);
  assert(result.tex.length <= 512);
  if (result.value !== null) assert(result.value.toString().length <= 200);
}
assert(performance.now() - start < 4000, 'Bounded evaluation exceeded four seconds for the full control grid');
console.log(`PASS: bounded hyperoperations, hierarchy, modular powers, physical units, tree embeddings, Turing examples, six comparisons, article interactions; ${words} narrative words; learning links valid.`);