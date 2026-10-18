/* Enforce the 2^20-bit BigInt ceiling used by SpiderMonkey/JavaScriptCore,
 * even when this regression runs under V8's much larger native limit. */
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), ts = require('typescript'), assert = require('node:assert/strict');
const source = fs.readFileSync(path.resolve(__dirname, '../src/app/tools/pi-decimal/pi-engine.ts'), 'utf8');
const maximum = (1n << 1048576n) - 1n;
let largestBits = 0;
const checked = value => {
  if (typeof value === 'bigint') {
    const positive = value < 0n ? -value : value;
    if (positive > maximum) throw new RangeError('BigInt is too large to allocate (simulated 2^20-bit limit)');
    // Record only larger values, avoiding binary conversion for small operands.
    if (positive >> BigInt(largestBits)) largestBits = positive.toString(2).length;
  }
  return value;
};
const arithmetic = new Set([ts.SyntaxKind.PlusToken, ts.SyntaxKind.MinusToken, ts.SyntaxKind.AsteriskToken, ts.SyntaxKind.AsteriskAsteriskToken, ts.SyntaxKind.SlashToken, ts.SyntaxKind.PercentToken, ts.SyntaxKind.LessThanLessThanToken, ts.SyntaxKind.GreaterThanGreaterThanToken]);
const guard = context => {
  const visit = node => {
    const visited = ts.visitEachChild(node, visit, context);
    return ts.isBinaryExpression(visited) && arithmetic.has(visited.operatorToken.kind)
      ? ts.factory.createCallExpression(ts.factory.createIdentifier('checked'), undefined, [visited]) : visited;
  };
  return file => ts.visitNode(file, visit);
};
const compilerOptions = { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS };
const engine = {};
vm.runInNewContext(ts.transpileModule(source, { compilerOptions, transformers: { before: [guard] } }).outputText, { exports: engine, performance, checked });
const result = engine.calculatePi(100000);
assert.equal(engine.piDigitLimit(), 100000);
assert.throws(() => engine.calculatePi(100001));
const reference = {};
vm.runInNewContext(ts.transpileModule(source, { compilerOptions }).outputText, { exports: reference, performance });
assert.equal(reference.piDigitLimit(), 1000000);
assert.equal(result.decimals, reference.calculatePi(100000).decimals);
assert.equal(result.decimals.length, 100000);
assert.equal(result.decimals.slice(-20), '67420805655493624646');
console.log(`PASS 100000 verified digits under a 2^20-bit ceiling; largest arithmetic result: ${largestBits} bits.`);
