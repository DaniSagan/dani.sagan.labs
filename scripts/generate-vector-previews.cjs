const fs=require('node:fs'),path=require('node:path'),ts=require('typescript');
const modules=new Map();
function load(file){file=path.resolve(file);if(modules.has(file))return modules.get(file);const exports={};modules.set(file,exports);const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;new Function('require','exports',code)(name=>load(path.resolve(path.dirname(file),name+'.ts')),exports);return exports;}
const base='src/app/tools/vector-field';
const {VECTOR_EXAMPLES}=load(base+'/vector-examples.ts'),{compileField,integrate}=load(base+'/vector-math.ts');
const output=path.resolve('src/assets/vector-field-examples');fs.mkdirSync(output,{recursive:true});
for(const e of VECTOR_EXAMPLES){
 const fn=compileField(e.dx,e.dy,Object.fromEntries(e.parameters.map(p=>[p.name,p.value])));
 const [xmin,xmax,ymin,ymax]=e.bounds,point=p=>[((p[0]-xmin)/(xmax-xmin)*180).toFixed(2),((ymax-p[1])/(ymax-ymin)*110).toFixed(2)].join(',');
 const paths=[];let samples=0;
 for(let i=0;i<7;i++)for(let j=0;j<5;j++){
  const seed=[xmin+(i+.5)/7*(xmax-xmin),ymin+(j+.5)/5*(ymax-ymin)];
  const orbit=integrate(fn,seed,0,12,e.bounds,1,1e-5,600);samples+=orbit.points.length;
  paths.push('<path d="'+orbit.points.map((p,k)=>(k?'L':'M')+point(p)).join('')+'" stroke="hsl('+((i*36+j*19+175)%360)+',90%,65%)"/>');
 }
 if(samples<50)throw Error('Empty preview '+e.id);
 fs.writeFileSync(path.join(output,e.id+'.svg'),'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 110"><rect width="180" height="110" fill="#080e1b"/><g fill="none" stroke-width="0.7" opacity="0.8">'+paths.join('')+'</g></svg>');
}
console.log('Generated '+VECTOR_EXAMPLES.length+' vector field previews.');
