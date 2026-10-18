const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),ts=require('typescript');
const base='src/app/articles/topology/homeomorphisms-homotopy/homeomorphisms-homotopy-article.component';
const source=fs.readFileSync(base+'.ts','utf8'),html=fs.readFileSync(base+'.html','utf8'),exportsObject={};
const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,experimentalDecorators:true}}).outputText;
vm.runInNewContext(js,{exports:exportsObject,require:()=>({Component:()=>c=>c,LEARNING_IMPORTS:[]})});
const c=new exportsObject.HomeomorphismsHomotopyArticleComponent(),close=(a,b)=>assert(Math.abs(a-b)<1e-10,a+' != '+b);
const initialBounds=JSON.stringify(c.bounds);
for(let ni=0;ni<=10;ni++)for(let ti=0;ti<=20;ti++){
 c.n=1+ni/10;c.t=ti/20;c.update();const radius=1+(1-c.t)*(c.n-1);
 assert(radius>=1&&radius<=2);assert.equal(c.result.points.length,121);
 for(const [x,y]of c.result.points)close(Math.hypot(x,y),radius);
 close(c.result.points[0][0],c.result.points.at(-1)[0]);close(c.result.points[0][1],c.result.points.at(-1)[1]);
 if(c.t===0)close(radius,c.n);if(c.t===1||c.n===1)close(radius,1);
 assert.equal(JSON.stringify(c.bounds),initialBounds,'plot must not zoom during contraction');
 assert.equal(c.series.length,4);for(const [i,r]of [[0,2],[1,1],[2,c.n],[3,radius]])for(const [x,y]of c.series[i].points)close(Math.hypot(x,y),r);
 close((c.bounds.xmax-c.bounds.xmin)/(c.bounds.ymax-c.bounds.ymin),624/284);
}
c.reset();close(c.n,1.5);close(c.t,.5);close(c.result.rows[1][1],1.25);
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);
for(const m of html.matchAll(/fragment="([^"]+)"/g))assert(ids.includes(m[1]),m[1]);
assert.equal((html.match(/<summary>[1-6]\./g)||[]).length,6);
const {mathjax}=require('mathjax-full/js/mathjax.js'),{TeX}=require('mathjax-full/js/input/tex.js'),{SVG}=require('mathjax-full/js/output/svg.js'),{liteAdaptor}=require('mathjax-full/js/adaptors/liteAdaptor.js'),{RegisterHTMLHandler}=require('mathjax-full/js/handlers/html.js'),{AllPackages}=require('mathjax-full/js/input/tex/AllPackages.js');
const adaptor=liteAdaptor();RegisterHTMLHandler(adaptor);const doc=mathjax.document('',{InputJax:new TeX({packages:AllPackages}),OutputJax:new SVG({fontCache:'none'})});
for(const m of html.matchAll(/ expression="([^"]+)"/g)){const tex=m[1].replace(/&#123;/g,'{').replace(/&#125;/g,'}');const svg=adaptor.outerHTML(doc.convert(tex,{display:true}));assert(!/data-mml-node="merror"|data-mjx-error/.test(svg));}
import('@angular/compiler').then(({parseTemplate})=>{const result=parseTemplate(html,base+'.html',{enableBlockSyntax:true});assert(!result.errors?.length,result.errors?.join('\n'));console.log('PASS 231 annulus states, endpoints, fixed inner boundary, continuous radial images, fixed scale, reference curves, reset, six exercises, navigation anchors, TeX and Angular template.');}).catch(e=>{console.error(e);process.exitCode=1;});
