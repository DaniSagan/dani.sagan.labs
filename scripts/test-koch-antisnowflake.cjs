const fs = require('node:fs'), vm = require('node:vm'), ts = require('typescript'), assert = require('node:assert/strict');
const angular = { Component: () => type => type };
const compile = file => ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, experimentalDecorators: true } }).outputText;
const base = 'src/app/articles/fractals/';
const vec = {}, renderer = {}, anti = {}, snow = {};
vm.runInNewContext(compile('src/app/shared/math/vec2.ts'), { exports: vec });
vm.runInNewContext(compile(base + 'shared/l-system-renderer.ts'), { exports: renderer, require: () => vec });
const requireModule = name => name.includes('vec2') ? vec : name.includes('l-system-renderer') ? renderer : name.includes('fractal-explorer') ? { paint() {} } : angular;
for (const [folder, name, exports] of [['koch-antisnowflake', 'koch-antisnowflake', anti], ['koch-snowflake', 'koch-snowflake', snow]]) {
  vm.runInNewContext(compile(base + folder + '/' + name + '.component.ts'), { exports, require: requireModule });
}
const close = (a, b, message) => assert(Math.abs(a - b) < 1e-7, `${message}: ${a} != ${b}`);
function signedArea(points) {
  return points.slice(0, -1).reduce((area, p, i) => area + p.x * points[i + 1].y - p.y * points[i + 1].x, 0) / 2;
}
const cross = (a, b, p) => (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x);
const app = new anti.KochAntisnowflakeComponent();
for (let n = 0; n <= 6; n++) {
  const points = [];
  const ctx = { beginPath() {}, moveTo(x, y) { points.push({ x, y }); }, lineTo(x, y) { points.push({ x, y }); }, stroke() {} };
  app.draw(ctx, n, 480);
  const stride = 4 ** n;
  assert.equal(points.length, 3 * stride + 1, 'three sides, four subsegments per level');
  close(points[0].x, points.at(-1).x, 'closed x'); close(points[0].y, points.at(-1).y, 'closed y');
  const triangle = [points[0], points[stride], points[2 * stride], points[0]];
  const initialArea = signedArea(triangle), area = signedArea(points);
  close(area / initialArea, 2 / 5 + 3 / 5 * (4 / 9) ** n, 'antisnowflake area ratio at level '+n);
  const sign = Math.sign(initialArea);
  const segmentLength = Math.hypot(triangle[1].x - triangle[0].x, triangle[1].y - triangle[0].y) / 3 ** n;
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    assert(Number.isFinite(p.x) && Number.isFinite(p.y));
    assert(p.x >= 24 - 1e-7 && p.x <= 456 + 1e-7 && p.y >= 24 - 1e-7 && p.y <= 456 + 1e-7, 'canvas margins');
    for (let side = 0; side < 3; side++) assert(sign * cross(triangle[side], triangle[side + 1], p) >= -1e-6, 'no outward teeth');
    if (i) close(Math.hypot(p.x - points[i - 1].x, p.y - points[i - 1].y), segmentLength, 'equal segment lengths');
  }
  if (n === 1) {
    const center = { x: (triangle[0].x + triangle[1].x + triangle[2].x) / 3, y: (triangle[0].y + triangle[1].y + triangle[2].y) / 3 };
    for (const i of [2, 6, 10]) { close(points[i].x, center.x, 'first-level tip x'); close(points[i].y, center.y, 'first-level tip y'); }
  }
}
// Keep the ordinary snowflake as a control: its area must increase instead.
const ordinary = new snow.KochSnowflakeComponent();
for (let n = 0; n <= 4; n++) {
  const points = [], ctx = { beginPath() {}, moveTo(x, y) { points.push({ x, y }); }, lineTo(x, y) { points.push({ x, y }); }, stroke() {} };
  ordinary.draw(ctx, n, 480);
  const k = 4 ** n, triangle = [points[0], points[k], points[2 * k], points[0]];
  close(signedArea(points) / signedArea(triangle), 8 / 5 - 3 / 5 * (4 / 9) ** n, 'ordinary snowflake control');
}
console.log('PASS actual renderers: inward teeth; first-level centroid contacts; area tending to 2/5; triangle containment; 3*4^n segments; 1/3 scale; closure/margins through level 6; ordinary snowflake outward control.');
