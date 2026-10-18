const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),ts=require('typescript'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {articles}=require('./generate-article-foundations.cjs');
const inventory=require('./test-article-navigation.cjs').check();
const {articleDestinations}=require('./link-problem-concepts.cjs');
const destinations=articleDestinations(),known=new Set(inventory.routed.map(r=>'/articles/'+r.path));
function load(file) {
 const exports={},js=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,experimentalDecorators:true}}).outputText;
 vm.runInNewContext(js,{exports,require:()=>({Component:()=>c=>c,Input:()=>()=>{},LEARNING_IMPORTS:[]}),Math,Number,String,Array,Map,Set});
 return exports;
}
const labs=new Map();
const close=(a,b,tol=1e-8)=>assert(Math.abs(a-b)<tol,a+' != '+b);
for(const a of articles) {
 const file='src/app/articles/'+a.area+'/'+a.slug+'/'+a.slug+'-article.component.ts';
 const name=fs.readFileSync(file,'utf8').match(/export class (\w+)/)[1],lab=new (load(file)[name])();
 labs.set(a.slug,lab);
 const initial=JSON.stringify(lab.result),n=a.n||['',1,20,1,5],t=a.t||['',0,1,.05,.5];
 for(const N of[n[1],n[4],n[2]])for(const T of[t[1],t[4],t[2]]) {
  lab.n=N;lab.t=T;lab.update();
  assert(lab.result.rows.length>0,a.slug+' has interpretable outputs');
  for(const [label,value]of lab.result.rows){assert(label.length>0);if(typeof value==='number')assert(Number.isFinite(value),a.slug+' finite row '+label);}
  for(const point of lab.result.points)assert(point.length===2&&point.every(Number.isFinite),a.slug+' finite points');
  for(const value of Object.values(lab.bounds))assert(Number.isFinite(value),a.slug+' finite bounds');
  assert(lab.bounds.xmin<lab.bounds.xmax&&lab.bounds.ymin<lab.bounds.ymax);
 }
 lab.reset();assert.equal(JSON.stringify(lab.result),initial,a.slug+' reset');
}
const set=(slug,n,t)=>{const lab=labs.get(slug);lab.n=n;lab.t=t;lab.update();return lab.result;};
const value=(r,key)=>r.rows.find(row=>row[0]===key)?.[1];
let r=set('metric-normed-spaces',10,1);close(value(r,'Norma L² de x^p'),1/Math.sqrt(3));
r=set('function-convergence',2,.5);close(value(r,'Supremo de x^n en [0,a]'),.25);
r=set('supremum-real-completeness',3,2);close(value(r,'Distancia al supremo'),2/3);
r=set('dirichlet-abel-tests',50,1);assert(value(r,'Máxima suma parcial observada de sen(kθ)')<=value(r,'Cota geométrica válida')+1e-8);
r=set('euler-maclaurin-asymptotics',20,3);assert(Math.abs(value(r,'Error observado'))<1e-8);
r=set('equivalence-quotients',5,7);assert.equal(value(r,'Representante canónico'),2);
r=set('total-derivative-gradient',90,.1);close(value(r,'Derivada unitaria'),4);close(value(r,'Error dividido por paso'),.2);
r=set('jacobian-change-variables',0,1);close(value(r,'Determinante'),0);
r=set('multiple-integrals',1,0);close(value(r,'Área'),Math.PI);close(value(r,'Integral de x²+y²'),Math.PI/2);
r=set('vector-calculus',0,1);close(value(r,'Circulación antihoraria'),2*Math.PI);close(value(r,'Flujo exterior: círculo unidad'),0);
r=set('holomorphic-continuation',5,.5);close(value(r,'Suma parcial'),1.96875);
for(const m of[1,2,4]){r=set('complex-residues',m,.7);close(value(r,'Parte real de la integral numérica'),0);close(value(r,'Parte imaginaria'),m===1?2*Math.PI:0);}
r=set('complex-logarithm-branches',1,1);close(value(r,'Argumento continuo'),1+2*Math.PI);
r=set('riemann-sphere',2,0);close(value(r,'X'),.8);close(value(r,'Z'),.6);close(value(r,'X²+Y²+Z²'),1);
r=set('fourier-transform',1,0);close(value(r,'Transformada en ω'),2);
r=set('singular-values-operator-norms',3,4);close(value(r,'Norma inducida 2'),4);close(value(r,'Norma de Frobenius'),5);
r=set('nonnormal-transient-growth',8,1);assert(value(r,'Norma del estado en t')>1);
r=set('ridge-regularization',2,4);close(value(r,'Ganancia ridge'),.25);
r=set('rings-finite-fields',5,2);assert.equal(value(r,'Inverso'),3);r=set('rings-finite-fields',6,2);assert.equal(value(r,'Inverso'),'No existe');
r=set('groups-cosets-lagrange',12,8);assert.equal(value(r,'Orden del elemento'),3);
r=set('pade-krylov-methods',2,1);close(value(r,'Padé [1/1]'),3);
r=set('golden-ratio',5,1);close(value(r,'Cociente F(n+1)/F(n)'),8/5);
r=set('algebraic-transcendental-numbers',10,0);assert.equal(value(r,'Fracción racional'),'14/10');
r=set('gaussian-quadratic-norms',3,2);close(value(r,'Norma gaussiana a²+b²'),13);close(value(r,'Norma en Z[√2]'),1);
r=set('infinite-descent',80,2);assert.equal(value(r,'Soluciones positivas dentro de la cota'),0);
r=set('sieve-primality',49,2);assert.equal(value(r,'¿N es primo? (criba exacta)'),'No');
for(let p=0;p<6;p++)for(let q=0;q<6;q++)if(p!==q){r=set('rsa-discrete-logarithm',p,q);assert.equal(value(r,'Mensaje'),value(r,'Recuperado'));}
r=set('dirichlet-convolution-series',6,2);assert.equal(value(r,'(1∗1)(n)'),4);assert.equal(value(r,'(id∗1)(n)'),12);
for(const n of[3,5,17])assert.equal(value(set('constructible-numbers',n,1),'Construible por Gauss–Wantzel'),'Sí');
for(const n of[7,9])assert.equal(value(set('constructible-numbers',n,1),'Construible por Gauss–Wantzel'),'No');
r=set('plane-tessellations',6,3);close(value(r,'Suma alrededor del vértice'),360);
r=set('projective-homogeneous-coordinates',1,1);assert.equal(value(r,'Intersección afín'),'Punto del infinito');
r=set('circle-inversion',1,2);close(value(r,'Distancia de la imagen'),.5);close(value(r,'Segunda inversión'),2);
r=set('curvature-frenet',1,1);close(value(r,'Curvatura'),.5);close(value(r,'Torsión'),.5);close(value(r,'Radio osculador'),2);
r=set('envelopes-evolutes',40,2);close(value(r,'Abscisa de contacto'),4);close(value(r,'Ordenada de contacto'),4);
r=set('curve-singularities',0,0);close(value(r,'Velocidad paramétrica'),0);
r=set('hyperbolic-functions',2,1);close(value(r,'cosh²−sinh²'),1);close(value(r,'arsinh(sinh(x))'),1);
r=set('orthogonal-polynomials',2,0);close(value(r,'P_n(x)'),-.5);close(value(r,'Norma² exacta'),.4);
r=set('bernstein-polynomials',10,.5);close(value(r,'Error exacto'),.025);
r=set('affine-transformations',1,2);let area=0;for(let k=1;k<r.points.length;k++)area+=r.points[k-1][0]*r.points[k][1]-r.points[k][0]*r.points[k-1][1];close(Math.abs(area)/2,1);
r=set('variations-noether',3,0);close(value(r,'Acción exacta'),.5);close(value(r,'Máximo residuo |q″|'),0);
r=set('picard-lipschitz',12,1);assert(value(r,'Error absoluto')<2e-10);
r=set('lyapunov-stability-chaos',500,2.8);assert(value(r,'Exponente estimado')<0);
r=set('lyapunov-stability-chaos',500,4);close(value(r,'Exponente estimado'),Math.log(2),.1);
r=set('return-maps-bifurcations',60,2.5);close(value(r,'Multiplicador'),-.5);
r=set('symplectic-integration',200,.5);assert(value(r,'Máxima desviación observada')<.04);
r=set('l-systems',3,60);assert.equal(value(r,'Segmentos'),64);close(value(r,'Longitud poligonal'),64/27);
r=set('iterated-function-systems',150,1/3);assert(r.points.every(([x,y])=>x>=0&&x<=1&&y===0));
r=set('pseudorandom-generators',120,7);assert(r.points.every(([,v])=>v>=0&&v<1));assert.equal(JSON.stringify(r),JSON.stringify(set('pseudorandom-generators',120,7)));
for(const n of[5,11,25])for(const grains of[1,30,80]){r=set('self-organized-criticality',n,grains);assert.equal(value(r,'Masa final')+value(r,'Granos perdidos'),grains);assert(r.points.every(([,h])=>h>=0&&h<2));}
r=set('pigeonhole-principle',16,5);assert.equal(value(r,'Máximo mínimo inevitable'),4);
r=set('trees-graph-coloring',5,1);assert.equal(value(r,'Número cromático exacto'),3);
r=set('trees-graph-coloring',6,1);assert.equal(value(r,'Número cromático exacto'),2);
r=set('polya-cycle-index',4,2);assert.equal(value(r,'Órbitas bajo rotación'),6);
r=set('route-optimization-complexity',6,10);assert.equal(value(r,'Tours orientados con origen fijo'),120);
r=set('ordinals-growth',5,1);assert.equal(value(r,'¿Tiene máximo el orden infinito?'),'Sí: ★');
r=set('computability-formal-languages',13,6);assert.equal(value(r,'Aceptada'),'No');
r=set('poisson-exponential-waiting',2,1);close(value(r,'P(cero eventos)=P(T>t)'),Math.exp(-2));close(r.points.reduce((s,p)=>s+p[1],0),1);
r=set('heterogeneous-binomial-mixtures',8,.5);close(r.points.reduce((s,p)=>s+p[1],0),1);close(r.points.reduce((s,p)=>s+p[0]*p[1],0),value(r,'Media Poisson-binomial'));
r=set('cauchy-heavy-tails',10,1);close(value(r,'Integral truncada de |x| f(x)'),Math.log(101)/Math.PI);
r=set('maximum-likelihood',10,.3);close(value(r,'Estimador k/n'),.3);
r=set('generating-concentration',50,.2);assert(value(r,'Chernoff optimizado')<=value(r,'Hoeffding unilateral'));
r=set('berry-esseen',100,.5);close(value(r,'Cota con C=1'),.1);
r=set('ergodicity-autocorrelation',100,.5);close(value(r,'Tamaño efectivo por igualdad de varianzas'),100);close(value(r,'Varianza exacta estacionaria de la media'),.0025);
r=set('homeomorphisms-homotopy',1,.6);close(value(r,'Radio durante la deformación'),1);
r=set('surfaces-genus-euler',1,0);assert.equal(value(r,'χ orientable con g asas'),0);assert.equal(value(r,'χ no orientable con k planos proyectivos'),1);
r=set('schoenflies-winding-number',2,0);close(value(r,'Índice numérico'),2);
r=set('schoenflies-winding-number',2,2);close(value(r,'Índice numérico'),0);
r=set('open-closed-connected',2,1);assert.equal(value(r,'Componentes conexas'),2);r=set('open-closed-connected',1,1);assert.equal(value(r,'Componentes conexas'),1);
const helper=load('src/app/shared/content/linked-text.component.ts').LinkedTextComponent;
let text=new helper();text.text='SVD y SVD; <img src=x>. Cauchy–Schwarz';text.links=[{term:'SVD',route:'/articles/singular-values-operator-norms'},{term:'Cauchy–Schwarz',route:'/articles/cauchy-schwarz'}];text.ngOnChanges();assert.equal(text.parts.map(p=>p.text).join(''),text.text);assert.equal(text.parts.filter(p=>p.route).length,3);
function walk(d){return fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);}

// Interpolated expressions are executable Angular syntax, even when they contain prose.
const linker=require('./link-article-concepts.cjs');
const interpolation="{{ active ? 'covarianza' : 'SVD' }}";
const fixture='<p>'+interpolation+' covarianza</p><button>SVD</button><a href="/existing">SVD</a><app-formula expression="SVD" />';
const linked=linker.linkHTML(fixture,'__linking_regression__.html').html;
assert(linked.includes(interpolation),'preserve interpolated string literals');
assert(linked.includes('<button>SVD</button>')&&linked.includes('<a href="/existing">SVD</a>'),'preserve controls and anchors');
assert.equal((linked.match(/data-article-concept=/g)||[]).length,1,'only prose becomes a link');

(async()=>{
 const {parseTemplate}=await import('@angular/compiler');
 const files=[...new Set(destinations.values())];
 let links=0;
 for(const f of files) {
  const html=fs.readFileSync(f,'utf8');assert.deepEqual(parseTemplate(html,f).errors,null,'Angular '+f);
  for(const m of html.matchAll(/routerLink="(\/articles\/[^"]+)"(?: fragment="([^"]+)")?/g)) {
   assert(known.has(m[1]),'unknown route '+f+' '+m[1]);links++;
   if(m[2]){const target=destinations.get(m[1]);if(!m[1].startsWith('/articles/integration-'))assert(new RegExp('id=["\\x27]'+m[2]+'["\\x27]').test(fs.readFileSync(target,'utf8')),'missing fragment '+m[1]+'#'+m[2]);}
  }
 }
 const {mathjax}=require('mathjax-full/js/mathjax.js'),{TeX}=require('mathjax-full/js/input/tex.js'),{SVG}=require('mathjax-full/js/output/svg.js'),{liteAdaptor}=require('mathjax-full/js/adaptors/liteAdaptor.js'),{RegisterHTMLHandler}=require('mathjax-full/js/handlers/html.js'),{AllPackages}=require('mathjax-full/js/input/tex/AllPackages.js');
 const adaptor=liteAdaptor();RegisterHTMLHandler(adaptor);const doc=mathjax.document('',{InputJax:new TeX({packages:AllPackages}),OutputJax:new SVG({fontCache:'none'})});
 let formulas=0;
 const decode=s=>s.replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&#123;/g,'{').replace(/&#125;/g,'}').replace(/&amp;/g,'&');
 for(const a of articles){const html=fs.readFileSync('src/app/articles/'+a.area+'/'+a.slug+'/'+a.slug+'-article.component.html','utf8');for(const m of html.matchAll(/ expression="([^"]+)"/g)){const svg=adaptor.outerHTML(doc.convert(decode(m[1]),{display:true}));assert(!/data-mml-node="merror"|<merror|data-mjx-error/.test(svg),a.slug+' '+decode(m[1]));formulas++;}}
 const report=JSON.parse(fs.readFileSync('docs/article-concept-coverage.json','utf8'));assert.equal(report.coverage.length,94);assert.equal(report.newArticles,65);for(const a of report.articles)assert(a.incoming.length>0,'incoming references '+a.route);
 const hash=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
 const tracked=walk('src/app/articles').filter(f=>/\.(ts|html)$/.test(f)).concat('docs/article-concept-coverage.json','docs/article-concepts-audit.md');
 const before=new Map(tracked.map(f=>[f,hash(f)]));require('./link-article-concepts.cjs').run();
 for(const [f,h]of before)assert.equal(hash(f),h,'idempotent crosslinking '+f);
 console.log('PASS 65 independent labs: controls, reset, finite results and mathematical identities; 94 previous topics resolved; '+files.length+' templates, '+links+' article links, '+formulas+' new TeX formulas; dynamic text roundtrip and idempotent linking.');
})().catch(e=>{console.error(e);process.exitCode=1});
