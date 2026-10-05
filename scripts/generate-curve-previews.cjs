const fs=require('node:fs'), path=require('node:path'),ts=require('typescript');
const base=path.resolve('src/app/tools/implicit-curve-graph-tool'),modules=new Map();
function load(file){file=path.resolve(file);if(modules.has(file))return modules.get(file);const exports={};modules.set(file,exports);const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;new Function('require','exports',code)(name=>load(path.resolve(path.dirname(file),name+'.ts')),exports);return exports;}
const {CURVE_EXAMPLES}=load(path.join(base,'curve-examples.ts'));
const {EXTRA_FUNCTIONS,EXTRA_CONSTANTS}=load(path.join(base,'math-catalog.ts'));
const {traceContours}=load('src/app/widgets/implicit-curve-graph/implicit-contours.ts');
const bindings={...Object.fromEntries(Object.getOwnPropertyNames(Math).map(name=>[name,Math[name]])),...Object.fromEntries(EXTRA_FUNCTIONS.map(e=>[e.name,e.fn])),...Object.fromEntries(EXTRA_CONSTANTS.map(e=>[e.name,e.value]))};
const names=Object.keys(bindings),values=Object.values(bindings),output=path.resolve('src/assets/implicit-curve-examples');fs.mkdirSync(output,{recursive:true});
const report=[];
for(const preset of CURVE_EXAMPLES){
const fn=new Function(...names,'return (x,y)=>('+preset.formula+');')(...values);
const segments=traceContours(fn,preset.bounds,96,96);if(segments.length<8)throw Error('Sparse example: '+preset.id);
const [xmin,xmax,ymin,ymax]=preset.bounds,scale=Math.min(144/(xmax-xmin),104/(ymax-ymin));
const point=p=>[80+(p.x-(xmin+xmax)/2)*scale,60-(p.y-(ymin+ymax)/2)*scale].map(v=>v.toFixed(2)).join(',');
const d=segments.map(([a,b])=>'M'+point(a)+'L'+point(b)).join(''),axes=[];
if(xmin<=0&&xmax>=0)axes.push('M'+point({x:0,y:ymin})+'L'+point({x:0,y:ymax}));
if(ymin<=0&&ymax>=0)axes.push('M'+point({x:xmin,y:0})+'L'+point({x:xmax,y:0}));
const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120"><path d="'+axes.join('')+'" fill="none" stroke="#2a2820" stroke-width="0.6"/><path d="'+d+'" fill="none" stroke="#e8643a" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round"/></svg>';
fs.writeFileSync(path.join(output,preset.id+'.svg'),svg);report.push({id:preset.id,segments:segments.length,bytes:svg.length});}
console.log('Generated '+report.length+' previews, '+new Set(CURVE_EXAMPLES.map(p=>p.category)).size+' categories, '+report.reduce((s,p)=>s+p.bytes,0)+' bytes.');
