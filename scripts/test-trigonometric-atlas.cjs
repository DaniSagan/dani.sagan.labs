const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),ts=require('typescript');
const base='src/app/articles/trigonometry/trigonometric-atlas/';
const compile=p=>ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,experimentalDecorators:true}}).outputText;
const model={};vm.runInNewContext(compile(base+'trigonometric-atlas.model.ts'),{exports:model});
const {TRIG_FUNCTIONS:all,evaluateTrig:ev,trigPlot}=model;
const f=id=>all.find(e=>e.id===id),v=(id,x)=>ev(f(id),x).value;
const close=(a,b,tol=1e-11)=>assert(Math.abs(a-b)<=tol*Math.max(1,Math.abs(b)),a+' != '+b);
assert.equal(all.length,52);assert.equal(new Set(all.map(e=>e.id)).size,52);
for(const e of all){assert.equal(ev(e,e.sample).status,'ok',e.id);assert(trigPlot(e).length>=801);assert.equal(ev(e,NaN).status,'domain');}
for(const x of [-1.2,-.3,.2,1.1]){
 close(v('sin',x)**2+v('cos',x)**2,1);close(v('cosh',x)**2-v('sinh',x)**2,1);
 close(v('vers',x)+v('vercos',x),2);close(v('covers',x)+v('covercos',x),2);
 for(const [half,whole] of [['hav','vers'],['havercos','vercos'],['hacovers','covers'],['hacovercos','covercos']])close(2*v(half,x),v(whole,x));
 close(v('sin',v('gd',x)),v('tanh',x));close(v('agd',v('gd',x)),x);
}
for(const [direct,inverse,x] of [['sin','asin',.5],['cos','acos',2],['tan','atan',-.7],['cot','acot',2],['sec','asec',2],['csc','acsc',-.6],['sinh','asinh',-2],['cosh','acosh',2],['tanh','atanh',-.8],['coth','acoth',-1],['sech','asech',2],['csch','acsch',-2],['vers','avers',2],['vercos','avercos',2],['covers','acovers',-.6],['covercos','acovercos',.6],['hav','ahav',2],['havercos','ahavercos',2],['hacovers','ahacovers',-.6],['hacovercos','ahacovercos',.6],['exsec','aexsec',2],['excsc','aexcsc',-.6]])close(v(inverse,v(direct,x)),x);
for(const [id,x] of [['tan',Math.PI/2],['cot',0],['csc',Math.PI],['asin',2],['asec',0],['acosh',0],['atanh',1],['coth',0],['acsch',0],['ahav',-1],['aexsec',-1],['agd',Math.PI/2]])assert.equal(ev(f(id),x).status,'domain',id);
assert(v('hav',1e-8)>0);assert.equal((1-Math.cos(1e-8))/2,0);close(v('hav',1e-8),2.5e-17,1e-30);
for(const id of ['sinc','sincpi','sinhc'])assert.equal(v(id,0),1);
assert.equal(ev(f('sinh'),1000).status,'overflow');
for(const id of ['tan','cot','sec','csc','exsec','excsc','coth','csch','acsch']){
 const e=f(id),points=trigPlot(e);let prev=null;
 for(const [x,y] of points){if(!Number.isFinite(y)){prev=null;continue;}if(prev){const p=e.poles;const pole=p.period===Infinity?p.offset:p.offset+(Math.floor((prev-p.offset)/p.period)+1)*p.period;assert(!(pole>prev&&pole<x),'line crossing pole: '+id);}prev=x;}
}
const component={};vm.runInNewContext(compile(base+'trigonometric-atlas.component.ts'),{exports:component,require:n=>n.includes('.model')?model:{Component:()=>x=>x},document:{getElementById:()=>null}});
const app=new component.TrigonometricAtlasComponent();close(app.evaluation.value,.25);app.setUnit('rad');close(app.value,Math.PI/3);close(app.evaluation.value,.25);app.select('asin');app.value=.5;app.setUnit('deg');assert(app.displayResult.includes('30'));app.select('sinh');app.value=1;close(app.rawArgument,1);app.tinyExample();close(app.evaluation.value,2.5e-17,1e-30);
(async()=>{const {parseTemplate}=await import('@angular/compiler');for(const file of fs.readdirSync(base).filter(n=>n.endsWith('.html'))){const r=parseTemplate(fs.readFileSync(base+file,'utf8'),file);assert(!r.errors,JSON.stringify(r.errors));}console.log('PASS 52 definitions, identities, 22 inverse round trips, domains/poles, stable tiny angles, plot gaps, units and Angular template.');})().catch(e=>{console.error(e);process.exitCode=1;});
