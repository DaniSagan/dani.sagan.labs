const fs = require('fs'), ts = require('typescript'), vm = require('vm'), assert = require('assert/strict');
function load(file, requireModule = require) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, experimentalDecorators: true } }).outputText, { exports, require: requireModule, Math, localStorage: storage });
  return exports;
}
let saved = null;
const storage = { getItem: () => saved, setItem: (_, value) => { saved = value; } };
const model = load('src/app/games/probability-detective/detective.model.ts');
const { CASES, posterior, information, score, draw } = model;
const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-10, `${a} != ${b}`);
assert.equal(CASES.length, 18);
for (const c of CASES) {
  for (const test of c.experiments) for (const p of test.probabilities) { close(p.reduce((a, b) => a + b), 1); assert.ok(p.every(v => v > 0 && v < 1)); }
  close(posterior(c, []).reduce((a, b) => a + b), 1);
  for (let t = 0; t < 2; t++) assert.ok(information(c, [], t) >= 0);
  const evidence = Array.from({ length: 1000 }, () => ({ experiment: 0, outcome: 0 }));
  assert.ok(posterior(c, evidence).every(Number.isFinite));
}
const p = posterior(CASES[0], [{ experiment: 0, outcome: 0 }]);
close(p[0], .2 / 1.5); close(p[2], .8 / 1.5);
const paired = posterior(CASES[3], [{ experiment: 1, outcome: 0 }]); close(paired[0], paired[2]);
assert.equal(draw([.2, .3, .5], .1), 0); assert.equal(draw([.2, .3, .5], .25), 1); assert.equal(draw([.2, .3, .5], .9), 2);
assert.ok(score(0, 100, 1, 0, false) < score(0, 40, 1, 0, false));
assert.equal(score(0, 100, 0, 40, true), 100);
const angular = { Component: () => target => target, CommonModule: {}, FormsModule: {} };
const { ProbabilityDetectiveComponent: Game } = load('src/app/games/probability-detective/probability-detective.component.ts', name => name === './detective.model' ? model : angular);
const game = new Game(); game.start(); game.navigate(4); assert.equal(game.index, 0);
game.close(); assert.equal(game.completed, 0);
for (let i = 0; i < 18; i++) {
  assert.equal(game.index, i);
  for (let n = 0; n < 3; n++) game.collect(n % 2);
  const evidence = game.record.evidence.length;
  game.choose(game.record.truth); game.answer(game.file.correct); game.close();
  game.collect(0); game.choose((game.record.truth + 1) % 3);
  assert.equal(game.record.evidence.length, evidence); assert.equal(game.record.choice, game.record.truth);
  game.navigate(i + 1);
}
assert.equal(game.completed, 18); assert.equal(game.correct, 18); assert.ok(game.total <= 1800);
const restored = new Game(); assert.equal(restored.completed, 18); assert.equal(restored.total, game.total);
restored.start(); for (let n = 0; n < 100; n++) restored.collect(1); assert.ok(restored.budget >= 0); assert.equal(restored.record.evidence.length, 10);
saved = '{bad json'; assert.equal(new Game().started, false);
saved = JSON.stringify({ index: 99, records: [] }); assert.equal(new Game().started, false);
console.log('PASS: 18 cases, Bayes reference, symmetric urns, stable likelihoods, scoring, campaign progression, budget, closed-case protection, persistence and invalid saves.');
