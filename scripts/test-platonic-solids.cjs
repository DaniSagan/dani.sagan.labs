const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const ts = require('typescript'), assert = require('node:assert/strict');
const base = path.resolve('src/app/articles/platonic-solids');
const cache = new Map();
function load(file) {
  if (cache.has(file)) return cache.get(file);
  const exports = {};
  const js = ts.transpileModule(fs.readFileSync(file,'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(js, { exports, require: name => load(path.resolve(path.dirname(file),name+'.ts')), Math });
  cache.set(file,exports); return exports;
}
const { dot, sub, length, convexFaces } = load(path.join(base,'polyhedron-model.ts'));
const solids = load(path.join(base,'platonic-models.ts'));
const s = Math.sqrt, phi = (1+s(5))/2;
const expected = {
  TETRAHEDRON:[4,6,4,3,3,s(3),s(2)/12,s(6)/4,s(6)/12,s(2)/4,Math.acos(1/3)],
  HEXAHEDRON:[8,12,6,4,3,6,1,s(3)/2,0.5,s(2)/2,Math.PI/2],
  OCTAHEDRON:[6,12,8,3,4,2*s(3),s(2)/3,s(2)/2,s(6)/6,0.5,Math.acos(-1/3)],
  DODECAHEDRON:[20,30,12,5,3,3*s(25+10*s(5)),(15+7*s(5))/4,s(3)*phi/2,s(250+110*s(5))/20,(3+s(5))/4,Math.acos(-1/s(5))],
  ICOSAHEDRON:[12,30,20,3,5,5*s(3),5*(3+s(5))/12,s(10+2*s(5))/4,s(3)*(3+s(5))/12,phi/2,Math.acos(-s(5)/3)],
};
function close(a,b,context) { assert(Math.abs(a-b)<1e-8,`${context}: ${a} != ${b}`); }
for (const [name,m] of Object.entries(solids)) {
  const [n,e,f,p,q,area,volume,R,r,rho,delta] = expected[name];
  assert.equal(m.vertices.length,n); assert.equal(m.edges.length,e); assert.equal(m.faces.length,f);
  close(m.area,area,name+' area'); close(m.volume,volume,name+' volume');
  close(m.radius,R,name+' R'); close(m.inradius,r,name+' r'); close(m.midradius,rho,name+' rho');
  close(m.dihedral,delta*180/Math.PI,name+' dihedral');
  close(m.central,2*Math.asin(1/(2*R))*180/Math.PI,name+' central');
  close(m.radius**2-m.midradius**2,0.25,name+' right triangle');
  close(m.area*m.inradius/3,m.volume,name+' pyramid decomposition');
  assert.equal(n-e+f,2);
  for (const v of m.vertices) close(length(v),R,name+' sphere');
  for (const [a,b] of m.edges) {
    close(length(sub(m.vertices[a],m.vertices[b])),1,name+' edge');
    assert.equal(m.faces.filter(face=>face.vertices.includes(a)&&face.vertices.includes(b)).length,2);
  }
  for (let i=0;i<n;i++) assert.equal(m.edges.filter(edge=>edge.includes(i)).length,q);
  for (const face of m.faces) {
    assert.equal(face.vertices.length,p);
    close(length(face.center),r,name+' insphere');
    for (const v of face.vertices) close(dot(face.normal,m.vertices[v]),r,name+' face plane');
    assert(m.vertices.every(v=>dot(face.normal,v)<=r+1e-8),'Convex support plane');
  }
  const dual = convexFaces(m.faces.map(face=>face.center));
  assert.equal(dual.length,n,'Dual face count');
  assert(dual.every(face=>face.vertices.length===q),'Dual face degree');
  console.log(`PASS ${name}: coordinates, topology, convexity, dual, area, volume, radii and angles`);
}

// Parse the actual article formulas, including the exercises and derivations.
const { mathjax } = require('mathjax-full/js/mathjax.js');
const { TeX } = require('mathjax-full/js/input/tex.js');
const { SVG } = require('mathjax-full/js/output/svg.js');
const { liteAdaptor } = require('mathjax-full/js/adaptors/liteAdaptor.js');
const { RegisterHTMLHandler } = require('mathjax-full/js/handlers/html.js');
const { AllPackages } = require('mathjax-full/js/input/tex/AllPackages.js');
const adaptor = liteAdaptor(); RegisterHTMLHandler(adaptor);
const document = mathjax.document('', { InputJax: new TeX({ packages: AllPackages }), OutputJax: new SVG({ fontCache: 'none' }) });
let count = 0;
for (const entry of fs.readdirSync(base,{withFileTypes:true})) {
  if (!entry.isDirectory()) continue;
  const file = path.join(base,entry.name,entry.name+'.component.html');
  if (!fs.existsSync(file)) continue;
  for (const match of fs.readFileSync(file,'utf8').matchAll(/expression="([^"]*)"/g)) {
    const svg = adaptor.outerHTML(document.convert(match[1],{display:true}));
    assert(!svg.includes('data-mml-node="merror"'),entry.name+': '+match[1]);
    count++;
  }
}
console.log(`PASS ${count} article formulas rendered by local MathJax`);
