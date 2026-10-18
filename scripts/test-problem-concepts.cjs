const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto'),ts=require('typescript');
const {concepts,problems:assignments}=require('./problem-concepts.json');
const {synchronize,articleDestinations}=require('./link-problem-concepts.cjs');
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
const read=f=>fs.readFileSync(f,'utf8');
function load(file) {
 const exports={};const js=ts.transpileModule(read(file),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,experimentalDecorators:true}}).outputText;
 vm.runInNewContext(js,{exports,Math,Number,Array,Map,Set,require:name=>name.endsWith('learning-math')?load('src/app/articles/shared/learning-math.ts'):{Component:()=>c=>c,LEARNING_IMPORTS:[]}});
 return exports;
}
const component=(area,slug)=>{const file='src/app/articles/'+area+'/'+slug+'/'+slug+'-article.component.ts',exports=load(file);return new exports[read(file).match(/export class (\w+)/)[1]]();};
const close=(a,b)=>assert(Math.abs(a-b)<1e-8, a+' != '+b);
const p=component('algebra','polynomial-foundations');
for(const coefficients of [[0,0,0,0],[1,0,0,0],[-2,0,0,0],[7,-3,0,0],[5,0,1,0],[-6,11,-6,1]]) {
 p.coefficients=coefficients;
 const nonzero=coefficients.map((a,i)=>a!==0?i:-1).filter(i=>i>=0),degree=nonzero.length?Math.max(...nonzero):null;
 assert.equal(p.degree,degree);assert.equal(p.monic,degree!==null&&coefficients[degree]===1);
 for(const x of[-2,-1,0,.5,1,3])close(p.evaluate(x),coefficients.map((a,i)=>a*x**i).reduce((a,b)=>a+b));
 for(const s of p.series)for(const point of s.points)assert(point.every(Number.isFinite));
}
for(const r of[-2,0,2])for(const s of[-2,0,2])for(const m of[1,2,3]) {
 p.r=r;p.s=s;p.multiplicity=m;assert.equal(p.actualMultiplicity,m+(r===s?1:0));
 close(p.factoredValue(r),0);close(p.factoredValue(s),0);
 const left=p.factoredValue(r-.001),right=p.factoredValue(r+.001);
 assert.equal(Math.sign(left*right),p.actualMultiplicity%2===0?1:-1);
}
p.reset();assert.equal(p.degree,3);assert.equal(p.actualMultiplicity,2);
const e=component('algebra','equation-equivalence');
for(const [k,count] of[[-4,0],[-1,0],[-.25,1],[-.24,2],[-.1,2],[0,2],[.25,1],[2,1],[4,1]]) {
 e.k=k;assert.equal(e.candidates.filter(x=>e.valid(x)).length,count,'valid roots for k='+k);
 for(const x of e.candidates)close(x*x-x-k,0);
 for(const s of e.series)for(const point of s.points)assert(point.every(Number.isFinite));
}
e.k=2;assert(!e.valid(-1));assert(e.valid(2));e.reset();assert.equal(e.k,2);
const r=component('algebra','polynomial-division');
for(let choice=0;choice<3;choice++)for(let root=-2;root<=3;root+=.25) {
 r.choice=choice;r.root=root;r.update();
 const rows=r.syntheticRows;assert.equal(rows.length,r.dividend.length);
 close(r.syntheticRemainder,r.dividend.map((a,i)=>a*root**i).reduce((a,b)=>a+b));
 for(const x of[-2,-1,0,1,2]) {
  const original=r.dividend.map((a,i)=>a*x**i).reduce((a,b)=>a+b);
  const q=r.syntheticQuotient.map((a,i)=>a*x**i).reduce((a,b)=>a+b);
  close(original,(x-root)*q+r.syntheticRemainder);
 }
}
r.choice=2;r.root=1;assert.deepEqual(Array.from(r.syntheticRows,row=>row.sum),[1,-5,6,0]);
r.choice=0;assert.equal(r.syntheticRows[1].coefficient,0);r.reset();assert.equal(r.choice,0);
const destinations=articleDestinations();
const practical=new Set();
for(const [prefix,file]of[['tools','src/app/tools/tools-routing.module.ts'],['games','src/app/games/games-routing.module.ts']])for(const m of read(file).matchAll(/path:\s*['"]([^'"]+)/g))practical.add('/'+prefix+'/'+m[1]);
const metadata=walk('src/app/problems').filter(f=>f.endsWith('problem.component.ts')).map(file=>({file,problem:JSON.parse(read(file).match(/problem: PracticeProblem = ([\s\S]*?);\s*}/)[1])}));
assert.equal(metadata.length,200);assert.equal(Object.keys(assignments).length,200);
let inlineCount=0,conceptLinks=0;
const allTemplates=new Set();
for(const {file,problem:p}of metadata) {
 const html=read(file.replace(/\.ts$/,'.html'));allTemplates.add(file.replace(/\.ts$/,'.html'));
 assert(html.includes('<!-- problem-prerequisites:start -->'),p.id+' prerequisite panel');
 for(const id of assignments[p.number]) {
  const c=concepts[id];assert(c,p.id+' known concept '+id);conceptLinks++;
  assert(html.includes('routerLink="'+c.route+'"'),p.id+' rendered '+id);
  assert(p.resources.some(r=>r.route===c.route),p.id+' metadata '+id);
  if(c.route.startsWith('/articles/')) {
   const dest=destinations.get(c.route);assert(dest,'article exists '+c.route);allTemplates.add(dest);
   assert(read(dest).includes('routerLink="/problems/'+p.route+'"'),p.id+' reciprocal '+id);
   if(c.fragment) {
    if(c.route.startsWith('/articles/integration-')) {
     const content=read('src/app/articles/calculus/integration/integration-content.ts');
     const block=c.route.endsWith('classical')?content.split('export const ADVANCED_INTEGRATION')[0]:content;
     assert(block.includes("id: '"+c.fragment+"'"),'integration anchor '+id);
    } else assert(new RegExp('id=["\\x27]'+c.fragment+'["\\x27]').test(read(dest)),'anchor '+id);
   }
  } else assert(practical.has(c.route),'registered practical resource '+c.route);
 }
 for(const m of html.matchAll(/<a data-prerequisite="([^"]+)"([^>]*)>([^<]+)<\/a>/g)) {
  assert(assignments[p.number].includes(m[1]),p.id+' contextual match '+m[1]);
  assert(m[2].includes('routerLink="'+concepts[m[1]].route+'"'));inlineCount++;
 }
 // Validate anchor nesting independently of Angular's parser.
 let anchor=false;for(const m of html.matchAll(/<\/?a(?:\s[^>]*|)>/g)) {
  if(m[0].startsWith('</')){assert(anchor,'closing anchor '+file);anchor=false;}
  else {assert(!anchor,'nested anchor '+file);anchor=true;}
 }
 assert(!anchor,'unclosed anchor '+file);
}
for(const slug of['polynomial-foundations','equation-equivalence']) {
 const source=read('src/app/articles/algebra/algebra-articles.ts');
 const cls=read('src/app/articles/algebra/'+slug+'/'+slug+'-article.component.ts').match(/export class (\w+)/)[1];
 assert(source.includes(cls+','),'registered '+slug);
}
for(const f of ['src/app/articles/algebra/polynomial-foundations/polynomial-foundations-article.component.html','src/app/articles/algebra/equation-equivalence/equation-equivalence-article.component.html'])allTemplates.add(f);
(async()=>{
 const {parseTemplate}=await import('@angular/compiler');
 for(const file of allTemplates)assert.deepEqual(parseTemplate(read(file),file).errors,null,'Angular template '+file);
 const {mathjax}=require('mathjax-full/js/mathjax.js'),{TeX}=require('mathjax-full/js/input/tex.js'),{SVG}=require('mathjax-full/js/output/svg.js'),{liteAdaptor}=require('mathjax-full/js/adaptors/liteAdaptor.js'),{RegisterHTMLHandler}=require('mathjax-full/js/handlers/html.js'),{AllPackages}=require('mathjax-full/js/input/tex/AllPackages.js');
 const adaptor=liteAdaptor();RegisterHTMLHandler(adaptor);const doc=mathjax.document('',{InputJax:new TeX({packages:AllPackages}),OutputJax:new SVG({fontCache:'none'})});
 let formulas=0;
 for(const file of [...allTemplates].filter(f=>f.includes('polynomial-foundations')||f.includes('equation-equivalence')||f.includes('polynomial-division')))for(const m of read(file).matchAll(/ expression="([^"]+)"/g)) {
  const tex=m[1].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&').replace(/&#x27;/g,"'");
  const svg=adaptor.outerHTML(doc.convert(tex,{display:true}));assert(!/data-mml-node="merror"|<merror|data-mjx-error/.test(svg),tex);formulas++;
 }
 const files=[...walk('src/app/problems'),...walk('src/app/articles')].filter(f=>/\.(ts|html)$/.test(f)).concat('docs/problem-concepts-audit.md');
 const hash=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
 const before=new Map(files.map(f=>[f,hash(f)]));synchronize();
 for(const [file,original]of before)assert.equal(hash(file),original,'idempotent authoring '+file);
 console.log('PASS: 200 curated problem reviews, '+conceptLinks+' concept/resource associations, '+inlineCount+' contextual links, '+allTemplates.size+' templates; registered routes, anchors, reciprocal links, '+formulas+' TeX formulas; zero/constant polynomials, multiplicities, extraneous roots, Ruffini identities; idempotent synchronization.');
})().catch(error=>{console.error(error);process.exitCode=1});
