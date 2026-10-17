const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),ts=require('typescript');
const root=path.resolve('src/app/articles/geometry');
const angular={Component:()=>c=>c,CommonModule:{},FormsModule:{},RouterLink:{},FormulaComponent:{}};
function load(file){
 const exports={};
 const js=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,experimentalDecorators:true}}).outputText;
 vm.runInNewContext(js,{exports,Math,require:name=>name.endsWith('/geometry-lab')?math:angular});
 return exports;
}
const math=load(path.join(root,'foundations/geometry-lab.ts'));
const catalogue=fs.readFileSync(path.join(root,'foundations/geometry-foundations-articles.ts'),'utf8');
const entries=[...catalogue.matchAll(/import \{ (\w+) \} from '\.\.\/([^/]+)\//g)].map(m=>({cls:m[1],slug:m[2]}));
assert.equal(entries.length,17);
const models=Object.fromEntries(entries.map(({cls,slug})=>[slug,new (load(path.join(root,slug,slug+'-article.component.ts'))[cls])()]));
const close=(a,b)=>assert(Math.abs(a-b)<1e-8,a+' != '+b);
let c=models['schlafli-symbol'];
for(let i=0;i<5;i++){c.index=i;const s=c.solid;assert.equal(s.n-s.e+s.f,2);assert.equal(s.p*s.f,2*s.e);assert.equal(s.q*s.n,2*s.e);assert(c.defect>0);assert.equal(c.fan.length,s.q);}
c=models['polyhedral-duality'];
for(let n=3;n<=8;n++){c.sides=n;close(c.labValue,1/Math.cos(Math.PI/n));for(const v of c.dual){let contacts=0;for(const p of c.polygon){const dot=((p[0]-200)*(v[0]-200)+(p[1]-160)*(v[1]-160))/4900;assert(dot<=1+1e-8);if(Math.abs(dot-1)<1e-8)contacts++;}assert.equal(contacts,2);}}
c=models['vector-norm'];close(c.labValue,5);c.x=0;c.y=0;c.z=0;close(c.labValue,0);c.x=-2;c.y=1;c.z=2;close(c.labValue,3);
c=models['dot-product'];for(const [a,result]of[[0,6],[60,3],[90,0],[180,-6]]){c.angle=a;close(c.labValue,result);}
c=models['cross-product'];c.angle=90;close(c.z,6);c.reversed=true;close(c.z,-6);c.angle=0;close(c.z,0);
c=models['scalar-triple-product'];for(const h of[-2,0,3]){c.height=h;close(c.labValue,6*h);}
c=models['dihedral-angle'];c.angle=109.47122063449069;close(c.labValue,70.52877936550931);
c=models['complementary-supplementary-angles'];c.angle=72;close(c.labValue,18);c.setTotal(180);close(c.labValue,108);c.angle=150;c.setTotal(90);close(c.angle,90);close(c.labValue,0);
c=models.radians;c.angle=60;c.radius=3;close(c.radians,Math.PI/3);close(c.labValue,Math.PI);c.angle=360;close(c.labValue,6*Math.PI);assert(!math.arc(360).includes('NaN'));
c=models.steradians;c.angle=60;close(c.labValue,Math.PI);const omega=c.labValue;c.radius=3;close(c.labValue,omega);c.angle=90;close(c.labValue,2*Math.PI);
c=models.homothety;for(const k of[-1.5,0,0.5,2]){c.ratio=k;c.image.forEach((p,i)=>{close(p[0]-180,k*(c.original[i][0]-180));close(p[1]-180,k*(c.original[i][1]-180));});}
c=models['incircles-circumcircles'];
for(const x of[-1,0,2,4,5]){
 c.apex=x;const vertices=[[0,0],[4,0],[x,3]],O=c.circumcenter,I=c.incenter;
 for(const p of vertices)close(Math.hypot(p[0]-O[0],p[1]-O[1]),c.circumradius);
 for(let i=0;i<3;i++){const a=vertices[i],b=vertices[(i+1)%3];close(Math.abs((b[0]-a[0])*(I[1]-a[1])-(b[1]-a[1])*(I[0]-a[0]))/Math.hypot(b[0]-a[0],b[1]-a[1]),c.inradius);}
 close(c.labValue**2,c.circumradius*(c.circumradius-2*c.inradius));
}
c=models['inspheres-circumspheres'];c.edge=2;close(c.inradius,1);close(c.circumradius,Math.sqrt(3));c.edge=1;close(c.circumradius,Math.sqrt(3)/2);
c=models['plane-normal'];for(const tilt of[0,35,70]){c.tilt=tilt;close(math.norm3(c.normal),1);close(math.dot3(c.normal,c.direction),0);}
c=models['convex-hull'];c.position=1;assert.equal(c.hull.length,4);c.position=4;assert.equal(c.hull.length,5);
for(const x of[-2,0,1,3,4]){c.position=x;for(let i=0;i<c.hull.length;i++){const a=c.hull[i],b=c.hull[(i+1)%c.hull.length];for(const p of c.all)assert((b[0]-a[0])*(p[1]-a[1])-(b[1]-a[1])*(p[0]-a[0])>=-1e-8);}}
c=models.apothem;for(let n=3;n<=12;n++){c.sides=n;close(c.labValue**2+c.side**2/4,4);close(c.area,n*2*Math.sin(2*Math.PI/n));}
c=models.barycenter;c.mass=1;close(c.center[0],5/3);close(c.center[1],1);c.mass=2;close(c.center[0],1.5);close(c.center[1],1.5);
console.log('PASS 17 independent mathematical models, boundary cases, centers, normals, duality and scaling');

const {mathjax}=require('mathjax-full/js/mathjax.js'),{TeX}=require('mathjax-full/js/input/tex.js'),{SVG}=require('mathjax-full/js/output/svg.js'),{liteAdaptor}=require('mathjax-full/js/adaptors/liteAdaptor.js'),{RegisterHTMLHandler}=require('mathjax-full/js/handlers/html.js'),{AllPackages}=require('mathjax-full/js/input/tex/AllPackages.js');
const adaptor=liteAdaptor();RegisterHTMLHandler(adaptor);const doc=mathjax.document('',{InputJax:new TeX({packages:AllPackages}),OutputJax:new SVG({fontCache:'none'})});
const allFiles=[];function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,entry.name);entry.isDirectory()?walk(f):allFiles.push(f);}}walk('src/app/articles');
const routes=new Set();for(const f of allFiles.filter(f=>f.endsWith('.ts'))){for(const m of fs.readFileSync(f,'utf8').matchAll(/static (?:readonly )?route(?:\s*:\s*string)?\s*=\s*['"]([^'"]+)/g))routes.add(m[1]);}
let formulas=0,links=0;
for(const {slug}of entries){
 assert(routes.has(slug));
 const html=fs.readFileSync(path.join(root,slug,slug+'-article.component.html'),'utf8');
 assert(html.includes('<svg')&&html.includes('<details>'),'Diagram and exercise: '+slug);
 for(const m of html.matchAll(/expression="([^"]*)"/g)){const svg=adaptor.outerHTML(doc.convert(m[1].replace(/&amp;/g,'&'),{display:true}));assert(!svg.includes('data-mml-node="merror"'),slug+': '+m[1]);formulas++;}
 for(const m of html.matchAll(/routerLink="\/articles\/([^"#]+)"/g)){assert(routes.has(m[1]),'Unknown target '+m[1]+' in '+slug);links++;}
}
const incoming=Object.fromEntries(entries.map(e=>[e.slug,0]));let sourceArticles=0;
for(const f of allFiles.filter(f=>f.endsWith('.html')&&!entries.some(e=>f.includes(path.sep+e.slug+path.sep)))){
 const html=fs.readFileSync(f,'utf8');let has=false;
 for(const m of html.matchAll(/routerLink="\/articles\/([^"#]+)"/g))if(m[1]in incoming){incoming[m[1]]++;has=true;}
 if(has)sourceArticles++;
}
for(const [slug,n]of Object.entries(incoming))assert(n>0,'No incoming reference for '+slug);
for(const slug of['pell','continued-fractions','sum-of-two-squares']){const f=allFiles.find(f=>f.endsWith('.html')&&f.includes(path.sep+slug+path.sep));if(f)assert(!fs.readFileSync(f,'utf8').includes('routerLink="/articles/vector-norm"'),'Algebraic norm must not link to Euclidean norm');}
const ramsey=allFiles.find(f=>f.endsWith('.html')&&f.includes(path.sep+'ramsey-theorem'+path.sep));assert(!fs.readFileSync(ramsey,'utf8').includes('routerLink="/articles/complementary-supplementary-angles"'));
console.log('PASS '+formulas+' MathJax formulas, '+links+' new-article links, incoming references from '+sourceArticles+' existing articles');

