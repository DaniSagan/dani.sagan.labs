const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const { curves } = require('./generate-additional-curve-articles.cjs');
const root = path.resolve(__dirname, '..');
const cache = new Map();
function load(file) {
  file = path.resolve(file);
  if (cache.has(file)) return cache.get(file);
  const source = fs.readFileSync(file, 'utf8');
  const result = { exports: {} };
  cache.set(file, result.exports);
  const code = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, experimentalDecorators: true } }).outputText;
  const requireLocal = name => {
    if (name === '@angular/core') return { Component: () => target => target, ViewChild: () => () => undefined };
    if (name.includes('/widgets/') || name.includes('/formula/') || name.startsWith('@angular/')) return new Proxy({}, { get: () => class {} });
    const destination = name.startsWith('src/') ? path.join(root, name) : path.resolve(path.dirname(file), name);
    return load(destination + '.ts');
  };
  vm.runInThisContext(`(function(require,module,exports){${code}\n})`, { filename: file })(requireLocal, result, result.exports);
  return result.exports;
}
const instances = new Map();
assert.equal(curves.length, 100);
assert.equal(new Set(curves.map(c => c.slug)).size, 100);
const oldCollection = fs.readFileSync(path.join(root, 'src/app/articles/curves/curves-articles.ts'), 'utf8');
assert(!oldCollection.includes('ADDITIONAL_CURVE'));
const provider = fs.readFileSync(path.join(root, 'src/app/shared/content/articles-provider-service.service.ts'), 'utf8');
assert(!provider.includes('ADDITIONAL_CURVE'));
for (const c of curves) assert(provider.includes(`route: '${c.slug}'`));
const newRoutes = new Set(curves.map(c => c.slug));
let oldCount = 0;
for (const match of oldCollection.matchAll(/from '\.\/([^']+\.component)'/g)) {
  const source = fs.readFileSync(path.join(root, 'src/app/articles/curves', match[1] + '.ts'), 'utf8');
  const route = source.match(/static\s+(?:readonly\s+)?route(?:\s*:\s*string)?\s*=\s*['"]([^'"]+)/)?.[1];
  assert(route, `Existing route missing: ${match[1]}`);
  newRoutes.delete(route);
  oldCount++;
}
assert.equal(oldCount, 120);
assert.equal(newRoutes.size, 0);
curves.forEach(c => newRoutes.add(c.slug));
for (const c of curves) {
  const folder = path.join(root, 'src/app/articles/curves', c.slug + '-article');
  const stem = path.join(folder, c.slug + '-article.component');
  const source = fs.readFileSync(stem + '.ts', 'utf8');
  const html = fs.readFileSync(stem + '.html', 'utf8');
  assert(fs.existsSync(stem + '.css'));
  assert(!/\bextends\b/.test(source), `${c.slug}: shared article base`);
  assert(source.includes('standalone: true'));
  assert(html.includes('<h3>Referencias</h3>') && html.includes('<details>'));
  assert(html.includes(c.slug + '-parameter'));
  const component = Object.values(load(stem + '.ts'))[0];
  assert.equal(component.route, c.slug);
  assert.equal(component.title, c.title);
  const instance = new component();
  instances.set(c.slug, instance);
  for (const p of [c.parameter.min, c.parameter.value, c.parameter.max]) {
    instance.onParameterChanged(p);
    assert(instance.parameter >= c.parameter.min && instance.parameter <= c.parameter.max);
    assert(!instance.getEquation().includes('$'));
    assert(instance.getEquation().includes('\\quad p='));
    if (c.type === 'implicit') {
      let visibleSegments = 0;
      const { traceContours } = load(path.join(root, 'src/app/widgets/implicit-curve-graph/implicit-contours.ts'));
      const [xMin, xMax, yMin, yMax] = c.bounds;
      visibleSegments = traceContours((x, y) => instance.evaluateImplicit(x, y), [xMin, xMax, yMin, yMax], 80, 80).length;
      assert(visibleSegments > 0, `${c.slug} has no visible contour for p=${p}`);
    } else {
      let visiblePoints = 0;
      for (const [a, b] of c.ranges) for (let i = 0; i <= 100; i++) {
        const point = instance.point(a + (b - a) * i / 100);
        if (point.every(Number.isFinite) && point[0] >= c.bounds[0] && point[0] <= c.bounds[1] && point[1] >= c.bounds[2] && point[1] <= c.bounds[3]) visiblePoints++;
      }
      assert(visiblePoints > 5, `${c.slug} has no visible parametric arc for p=${p}`);
    }
  }
  const before = instance.parameter;
  instance.onParameterChanged(NaN);
  assert.equal(instance.parameter, before);
  instance.reset();
  assert.equal(instance.parameter, c.parameter.value);
}
function near(actual, expected, tolerance = 1e-9) { assert(Math.abs(actual - expected) < tolerance, `${actual} != ${expected}`); }
function point(slug, t, p = 1) { const c = instances.get(slug); c.parameter = p; return c.point(t); }
function residual(slug, x, y) { const c = instances.get(slug); c.parameter = 1; near(c.evaluateImplicit(x, y), 0); }
residual('descartes-folium', 1.5, 1.5);
residual('sylvester-bicorn', 0, 1 / 3);
residual('longchamps-piriform', 1.5, 3 * Math.sqrt(3) / 4);
residual('right-strophoid', 1, 0);
residual('maclaurin-trisectrix', 3, 0);
residual('sluze-conchoid', 1, Math.sqrt(1.5));
residual('cartesian-oval', 5 / 3, 0);
residual('perseus-spiric', 0, Math.sqrt(3) / 2);
for (const t of [-1.2, -0.4, 0, 0.7, 1.2]) {
  const [x, y] = point('neile-semicubical', t); near(y * y, x ** 3);
}
for (const t of [0, 0.3, 1.2, 3, 5]) {
  const [x, y] = point('nephroid-curve', t); near((x * x + y * y - 4) ** 3, 108 * y * y, 1e-8);
  const [a, b] = point('lame-superellipse', t, 4); near((a / 2) ** 4 + b ** 4, 1);
  const [c, d] = point('gerono-lemniscate', t); near(c ** 4, c * c - d * d);
  const v = instances.get('viviani-curve'); v.parameter = 1;
  const [vx, vy, vz] = v.spacePoint(t); near(vx * vx + vy * vy + vz * vz, 4); near((vx - 1) ** 2 + vy * vy, 1);
}
near(point('chebyshev-curve', 0.5, 3)[1], -1);
near(point('legendre-curve', 0, 2)[1], -0.5);
near(point('hermite-probabilist-curve', 0, 4)[1], 3);
near(point('laguerre-curve', 2, 2)[1], -1);
near(point('bessel-j0-curve', 2)[1], 0.2238907791412357, 1e-10);
near(point('airy-ai-curve', 1)[1], 0.1352924163128814, 2e-9);
near(point('airy-ai-curve', -1)[1], 0.5355608832923521, 2e-9);
near(point('error-function-curve', 1)[1], 0.8427007929497149, 1e-9);
near(point('dawson-curve', 1)[1], 0.5380795069127684, 1e-9);
near(point('sinc-curve', 0)[1], 1);
near(point('beta-density-curve', 0.5, 3)[1], 1.875);
near(point('gamma-density-curve', 0, 1)[1], 1);
near(point('student-density-curve', 0, 1)[1], 1 / Math.PI);
for (const t of [-1, 0, 1, 2]) { const [x, y] = point('lagrange-interpolation-curve', t, 1.5); near(y, { '-1': 1.5, 0: 0, 1: -1, 2: 1 }[t]); near(x, t); }
near(point('rational-bezier-curve', 0.5, 2)[1], 4 / 3);
near(point('natural-cubic-spline', 0, 2)[1], 2);
near(point('natural-cubic-spline', 1, 2)[1], 0);
const nurbs = instances.get('nurbs-curve'); nurbs.parameter = 1;
assert.deepEqual(nurbs.point(0), [-2, 0]); assert.deepEqual(nurbs.point(1), [2, 0]);
for (const t of [0.1, 0.3, 0.5, 0.8]) near([0, 1, 2, 3].reduce((sum, i) => sum + nurbs.basis(i, 2, t), 0), 1);
const navigation = load(path.join(root, 'src/app/shared/content/article-navigation-groups.ts'));
const items = [...curves.map(c => ({ name: c.title, route: c.slug })), ...['parabola', 'hyperbola', 'ellipse', 'archimedean-spiral', 'logarithmic-spiral', 'cardioid', 'astroid', 'deltoid', 'epicycloid', 'hypocycloid', 'cycloid', 'rose', 'lemniscate', 'cassini', 'trifolium', 'agnesi-witch', 'lissajous', 'conchoid', 'cissoid', 'parabola-like'].map(route => ({ name: route, route }))];
const menu = navigation.groupArticleItems(items, 'curves');
assert.equal(menu.length, 17);
assert(menu.every(g => g.items.length <= 10));
assert.equal(menu.flatMap(g => g.items).length, 120);
assert.equal(new Set(menu.flatMap(g => g.items.map(i => i.route))).size, 120);
assert(!menu.some(g => g.name === 'Otros temas'));
console.log('PASS: 100 independent components; 120 unique curve routes; 17 thematic groups (max 10); visible explorers at parameter bounds; mathematical identities and numerical reference values.');
