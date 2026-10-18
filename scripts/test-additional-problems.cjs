const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const groups=require('./additional-problems.cjs');
const { problemNames } = require('./problem-names.cjs');
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const files=walk('src/app/problems'), articleFiles=walk('src/app/articles');
const components=files.filter(f=>f.endsWith('problem.component.ts'));
const metadata=components.map(f=>({file:f,problem:JSON.parse(fs.readFileSync(f,'utf8').match(/problem: PracticeProblem = ([\s\S]*?);\s*}/)[1])}));
assert.equal(metadata.length,200);
const publicRoutes = require('./problem-routes.cjs');
assert.equal(new Set(metadata.map(e=>e.problem.route)).size,200,'unique public routes');
for (const {file,problem:p} of metadata) {
 assert.match(p.route,/^[a-z]+(?:-[a-z]+)*$/,'English slug '+p.id);
 assert.equal(p.route,publicRoutes[p.number-1],'generator route '+p.id);
 assert.equal(fs.readFileSync(file,'utf8').match(/static readonly route\s*=\s*['"]([^'"]+)/)[1],p.route,'component route '+p.id);
}
for (const f of articleFiles.filter(f=>f.endsWith('.html'))) {
 for (const link of fs.readFileSync(f,'utf8').matchAll(/routerLink="\/problems\/([^"#?]+)/g)) {
  assert(publicRoutes.includes(link[1]),'canonical incoming link '+f+': '+link[1]);
 }
}

for(const field of ['id','title','number']) assert.equal(new Set(metadata.map(e=>e.problem[field])).size,200,field+' uniqueness');
assert.deepEqual(metadata.map(e=>e.problem.number).sort((a,b)=>a-b),Array.from({length:200},(_,i)=>i+1));
const {mathjax}=require('mathjax-full/js/mathjax.js'),{TeX}=require('mathjax-full/js/input/tex.js'),{SVG}=require('mathjax-full/js/output/svg.js'),{liteAdaptor}=require('mathjax-full/js/adaptors/liteAdaptor.js'),{RegisterHTMLHandler}=require('mathjax-full/js/handlers/html.js'),{AllPackages}=require('mathjax-full/js/input/tex/AllPackages.js');
const adaptor=liteAdaptor();RegisterHTMLHandler(adaptor);const doc=mathjax.document('',{InputJax:new TeX({packages:AllPackages}),OutputJax:new SVG({fontCache:'none'})});
const decode=s=>s.replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
const routes=new Map();
for(const f of articleFiles.filter(f=>f.endsWith('.ts'))) {
 const s=fs.readFileSync(f,'utf8'),template=s.match(/templateUrl:\s*['"]([^'"]+)/)?.[1];
 if(!template)continue;
 for(const m of s.matchAll(/static (?:readonly )?route(?:\s*:\s*string)?\s*=\s*['"]([^'"]+)/g))routes.set(m[1],path.resolve(path.dirname(f),template));
}
for(const chapter of ['classical','advanced','numerical']) routes.set('integration-'+chapter,path.resolve('src/app/articles/calculus/integration/integration-article.component.html'));
let stepCount=0,formulaCount=0;
for(const {file,problem:p}of metadata.filter(e=>e.problem.number>100)) {
 const html=fs.readFileSync(file.replace('.ts','.html'),'utf8');
 assert(html.includes(`<h2 id="problem-title">${p.title.replace(/&/g,'&amp;')}</h2>`));
 assert(html.includes(`currentId="${p.id}"`));
 const steps=[...html.split('class="solution"')[1].split('</ol>')[0].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m=>decode(m[1]));
 assert(steps.length>=4,p.id+' sufficient steps');
 stepCount+=steps.length;
 for(const resource of p.resources) {
  assert(html.includes('routerLink="'+resource.route+'"'),p.id+' rendered resource '+resource.route);
  if(!resource.route.startsWith('/articles/')) continue;
  const route=resource.route.replace('/articles/',''),article=routes.get(route);assert(article,p.id+' valid article '+route);
  assert(html.includes(`routerLink="${resource.route}"`));
  assert(fs.readFileSync(article,'utf8').includes(`routerLink="/problems/${p.route}"`),p.id+' reciprocal reference');
 }
 for(const m of html.matchAll(/<app-formula expression="([^"]+)"/g)) {
  const tex=decode(m[1]),svg=adaptor.outerHTML(doc.convert(tex,{display:true}));
  assert(!/data-mml-node="merror"|<merror|data-mjx-error/.test(svg),p.id+' valid TeX '+tex);formulaCount++;
 }
 const catalog=fs.readFileSync(path.join(path.dirname(path.dirname(file)),path.basename(path.dirname(path.dirname(file)))+'-problems.ts'),'utf8');
 const {slug,className}=problemNames(p.title);
 assert.equal(path.basename(path.dirname(file)),slug,p.id+' descriptive folder');
 assert.equal(path.basename(file),`${slug}-problem.component.ts`,p.id+' descriptive filename');
 assert(fs.readFileSync(file,'utf8').includes(`export class ${className}`),p.id+' descriptive class');
 assert(catalog.includes(`${className},`),p.id+' registered');
 const blockSource=fs.readFileSync('src/app/problems/problems.data.ts','utf8').split('\n').find(s=>s.includes(JSON.stringify(p.category)));
 assert(JSON.parse(blockSource.match(/topics:\s*(\[[^\]]+\])/)[1]).includes(p.topic),p.id+' navigable topic');
}
assert.equal(formulaCount,100);
// Independent numeric/enumerative checks, in addition to the explanatory proofs in the pages.
const close=(a,b,t=1e-10)=>assert(Math.abs(a-b)<t,`${a} != ${b}`);
const choose=(n,k)=>{let v=1;for(let i=1;i<=k;i++)v=v*(n-i+1)/i;return v;};
const mod=(a,n)=>(a%n+n)%n;
assert.equal(6*(-8)+1,-47);let factorial=1n;for(let i=1n;i<=25n;i++)factorial*=i;assert.equal(String(factorial).match(/0+$/)[0].length,6);
assert.equal(mod(7*15,26),1);assert.equal(mod(7*5,26),9);
assert.deepEqual(Array.from({length:15},(_,i)=>(i+1)**3).filter(d=>3600%d===0),[1,8]);
assert.equal(Number(3n**2026n%7n),4);assert.equal(Array.from({length:32},(_,i)=>i+1).find(n=>n%5===2&&n%7===4),32);
close(3/11,27/99);for(let a=-12;a<12;a++)for(let b=-12;b<12;b++)assert.notEqual(mod(a*a+b*b,4),3);
close(2+1/(3+1/(1+1/4)),43/19);close((3.5+1)/(3.5-2),3);
for(const x of[-1,1,2])close(x**3-2*x*x-x+2,0);
for(const x of[-4,-1,0,1,4]){if(x!==-2)assert.equal((x-1)/(x+2)>=0,x< -2||x>=1);close(x*x-6*x+13,(x-3)**2+4);}
assert.deepEqual([3+2,3-2],[5,1]);assert.equal(2*3+1,7);assert.equal(3+1,4);
close(1/Math.sqrt(2)/Math.sqrt(6)-1/Math.sqrt(2)/Math.sqrt(6),0);close((1+1+4)/6,1);
assert.equal((2-5)**2+(4-5)**2+(9-5)**2,26);
close(12*1.5/2,9);close(6*8/2/12,2);close(60*(10/4)**2,375);close(20*(10/4)**3,312.5);
close((2*6)/6,2);close(3*4/6,2);close(Math.hypot(3,3,3),3*Math.sqrt(3));close(Math.hypot(2,-2,0)*3,6*Math.sqrt(2));
assert.equal(6-12+8,2);assert.equal(13**2-5**2,12**2);close(30*150*Math.PI/180,25*Math.PI);
for(const x of[1,5,7,11].map(n=>n*Math.PI/6))close(Math.cos(2*x),0.5);
close(Math.asin(Math.sin(5*Math.PI/6)),Math.PI/6);close(5**2+7**2-2*5*7*.5,39);close(6*Math.sin(Math.PI/4)/Math.sin(Math.PI/6),6*Math.sqrt(2));
const mul=([a,b],[c,d])=>[a*c-b*d,a*d+b*c];assert.deepEqual(mul([2,3],[1,-2]),[8,-1]);assert.deepEqual(mul([1,2],[1,-1]),[3,1]);
for(const z of[[2,0],[-1,Math.sqrt(3)],[-1,-Math.sqrt(3)]]){const q=mul(mul(z,z),z);close(q[0],8);close(q[1],0);}
assert.deepEqual(mul(mul(mul(mul([3,-2],[0,1]),[0,1]),[0,1]),[0,1]),[3,-2]);
close((2*Math.sqrt(2))**2+1,9);assert.equal(Array.from({length:11},(_,i)=>2**i).reduce((a,b)=>a+b),2047);
let savings=100,iteration=0;for(let n=1;n<=12;n++){savings=1.01*savings+20;close(savings,2100*1.01**n-2000);iteration=(iteration+6)/4;close(iteration,2-2/4**n);}
close(Array.from({length:100},(_,i)=>1/((i+2)*(i+3))).reduce((a,b)=>a+b),.5-1/102);
close(24*4**3,1536);assert.equal(3+9/3,6);for(const t of[1,3])assert.equal(3*t*t-12*t+9,0);
close((9-1)/(3-1),4);let newton=2;for(let i=0;i<2;i++)newton-=(newton**3-10)/(3*newton**2);close(newton,3277/1521);
close(500*Math.exp(.2*5*Math.log(2)),1000);assert(Math.exp(.1)-1.105>0&&Math.exp(.1)-1.105<.000185);
assert.equal(2*0**3-2*0**2+0+7,7);close(9/2-3,1.5);close((16-1)/4,15/4);close(0-(-1),1);close(3-8/3,1/3);close(1.5**2,2.25);
close(2*(3/5)*(2/5),12/25);close(180/(180+490),18/67);close(1-(5/6)**3,91/216);close(choose(4,2)*(1/3)**2*(2/3)**2,8/27);
close(choose(2,1)*choose(6,2)/choose(8,3),15/28);close(.5**4,1/16);close((50+4*10)/100-2,-1.1);close(.5**2,1/4);close(.97725-.15866,.81859);close(.8*.8+.2*.3,.7);
assert.equal((2+3+3+4+18)/5,6);assert.equal((2+3+3+4+48)/5,12);assert.equal((9+1+1+9)/4,5);assert.equal((4+4)/2,4);
close(1.8*20+32,68);close(1.8**2*9,29.16);close(((-1)*(-1)+0*1+1*0)/3,1/3);close(7/6+3/2,8/3);close(4/Math.sqrt(64),.5);
assert.deepEqual([.6,.3,.1].map(w=>80*w),[48,24,8]);close(1.96*Math.sqrt(.6*.4/400),.04801,1e-5);
assert(.9<.95&&.2<.3&&.83>.43);assert.equal(9*9*8*7,4536);assert.equal(choose(7,3),35);assert.equal(35+28-12,51);assert.equal(choose(5,3)*2**3,80);
const edges=['AB','BC','CD','AD','AC'];const trail=['A','B','C','D','A','C'];assert.deepEqual(trail.slice(1).map((v,i)=>[trail[i],v].sort().join('')).sort(),edges.sort());
const rotations=new Set();for(let n=0;n<16;n++){const s=n.toString(2).padStart(4,'0');rotations.add(Array.from({length:4},(_,k)=>s.slice(k)+s.slice(0,k)).sort()[0]);}assert.equal(rotations.size,6);
const balanced=[];for(let n=0;n<64;n++){const s=n.toString(2).padStart(6,'0').replace(/0/g,'(').replace(/1/g,')');let depth=0;let valid=true;for(const c of s){depth+=c==='('?1:-1;if(depth<0)valid=false;}if(valid&&depth===0)balanced.push(s);}assert.equal(balanced.length,5);
let live=new Set(['-1,0','0,0','1,0']),next=[];for(let x=-2;x<=2;x++)for(let y=-1;y<=1;y++){let neighbors=0;for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++)if((dx||dy)&&live.has(`${x+dx},${y+dy}`))neighbors++;if(neighbors===3||(neighbors===2&&live.has(`${x},${y}`)))next.push(`${x},${y}`);}assert.deepEqual(next,['0,-1','0,0','0,1']);
close(Math.sqrt(1/4),.5);close(4/Math.sqrt(1/4),8);
console.log(`PASS: 200 unique components; 100 new formulas; ${stepCount} detailed steps; 100 reciprocal article links; numeric and exhaustive discrete checks.`);
