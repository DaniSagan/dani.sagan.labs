const fs=require('node:fs'),path=require('node:path'),ts=require('typescript'),vm=require('node:vm'),assert=require('node:assert/strict');
const cache=new Map();
class FakeWorker {
 static fail=false;
 constructor(){this.alive=true;}
 terminate(){this.alive=false;}
 postMessage(request){setTimeout(()=>{
  if(!this.alive)return;
  if(FakeWorker.fail){this.onmessage({data:{kind:'error',generation:request.generation,message:'test failure'}});return;}
  if(request.kind==='prepare')this.onmessage({data:{kind:'reference',generation:request.generation,reference:engine.createReference(request.settings)}});
  else if(request.kind==='initialize'){this.engine=new engine.MandelbrotEngine(request.settings,request.reference);this.onmessage({data:{kind:'ready',generation:request.generation}});}
  else this.onmessage({data:{kind:'tile',generation:request.generation,result:this.engine.renderTile(request.tile)}});
 },1);}
}
function load(file){file=path.resolve(file);if(cache.has(file))return cache.get(file);const exports={};cache.set(file,exports);vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText.replaceAll('import.meta.url', "'file:///mandelbrot-renderer.js'"),{exports,require:name=>load(path.resolve(path.dirname(file),name+'.ts')),console,Math,Number,Float32Array,Float64Array,Uint8ClampedArray,BigInt,URL,setTimeout,clearTimeout,Worker:FakeWorker,navigator:{hardwareConcurrency:4}});return exports;}
const base='src/app/articles/fractals/mandelbrot/';
const view=load(base+'mandelbrot-view.ts'),engine=load(base+'mandelbrot-engine.ts'),palette=load(base+'mandelbrot-palettes.ts');
const close=(actual,expected,tolerance=1e-6)=>assert(Math.abs(actual-expected)<tolerance,`${actual} differs from ${expected}`);
for(const zoom of [0,50,1100,4096]) {
 const original=view.initialView('-0.743643887037151','0.13182590420533',zoom);
 const anchor=view.pointAt(original,233,177,640,400);
 const next=view.transformView(original,233,177,241,169,640,400,2.25);
 const after=view.pointAt(next,241,169,640,400),shift=BigInt(next.bits-original.bits);
 assert((after[0]-(anchor[0]<<shift))<=1n&&(after[0]-(anchor[0]<<shift))>=-1n,'Real pointer anchor shifted');
 assert((after[1]-(anchor[1]<<shift))<=1n&&(after[1]-(anchor[1]<<shift))>=-1n,'Imaginary pointer anchor shifted');
 assert(next.zoom===zoom+2.25);assert(next.bits>=Math.ceil(next.zoom)+96);
 const saved=view.saveView(next),restored=view.restoreView(JSON.parse(JSON.stringify(saved)));
 assert(restored.real===next.real&&restored.imag===next.imag&&restored.zoom===next.zoom,'Position round trip lost digits');
}
const anisotropic=view.extendedFromFixed(1n<<400n,1n<<200n,400);assert(anisotropic.i!==0,'Reference orbit lost its small imaginary component');
const fine=view.initialView('-2','0',4096);const a=view.pointAt(fine,101,75,200,150),b=view.pointAt(fine,102,75,200,150);assert(a[0]!==b[0],'Coordinates collapse beyond Number underflow');
const sampleTests=[
 {real:'-0.5',imag:'0',zoom:0,iterations:512},
 {real:'-0.743643887037151',imag:'0.13182590420533',zoom:50,iterations:4096},
 {real:'-2',imag:'0',zoom:1100,iterations:2048},
 {real:'-2',imag:'0',zoom:4096,iterations:4096}
];
let skipped=0;
for(const test of sampleTests) {
 const camera=view.initialView(test.real,test.imag,test.zoom),settings={view:view.saveView(camera),width:64,height:40,iterations:test.iterations,antialias:'none'};
 const reference=engine.createReference(settings),renderer=new engine.MandelbrotEngine(settings,reference);
 for(const [x,y] of [[.5,.5],[7.5,12.5],[31.5,19.5],[32.5,20.5],[48.5,31.5],[63.5,39.5]]) {
  const point=view.pointAt(camera,x,y,64,40),expected=engine.exactEscape(...point,camera.bits,test.iterations),actual=renderer.sample(x,y);
  // Within a few Float32 field ULPs, far below an 8-bit color step.
  if(expected<0)assert.equal(actual,-1);else close(actual,expected,5e-4);
 }
 skipped+=renderer.skipped;
 console.log(`Oracle matched at zoom 2^${test.zoom}: ${renderer.mode}, ${renderer.skipped} skipped iterations, ${renderer.repaired} repaired samples.`);
}
const periodicCamera=view.initialView('-0.122561166876653','0.744861766619744');
const periodicRenderer=new engine.MandelbrotEngine({view:view.saveView(periodicCamera),width:64,height:40,iterations:8192,antialias:'none'},null);
assert.equal(periodicRenderer.sample(32,20),engine.exactEscape(periodicCamera.real,periodicCamera.imag,periodicCamera.bits,8192));
assert(skipped>10000,'BLA did not accelerate deep views');
for(const [real,imag,expected] of [['0','0',true],['-1','0',true],['-2','0',false],['1','0',false]]) {
 assert.equal(engine.interiorViewport(view.initialView(real,imag,1100),64,40),expected);
}
// A different exact reference deliberately creates cancellation at the first pixel step.
const critical=view.initialView('0','0',28),alternate=view.initialView('-1','0',28);
const alternateReference=engine.createReference({view:view.saveView(alternate),width:1,height:1000000000,iterations:128,antialias:'none'});
const repairEngine=new engine.MandelbrotEngine({view:view.saveView(critical),width:64,height:40,iterations:128,antialias:'none'},alternateReference);
assert.equal(repairEngine.sample(32.5,20.5),-1);assert.equal(repairEngine.repaired,1,'Cancellation was not repaired at full precision');
for(const p of palette.MANDELBROT_PALETTES){const c=new palette.MandelbrotColorizer(p.id,.37);const colors=c.paint(new Float32Array([-1,-1,-1,-1,4.2,4.2,4.2,4.2,1000,1000,1000,1000]));assert(colors.every(x=>x>=0&&x<=255));assert.equal(colors[3],255);assert.equal(colors[7],255);}
assert.throws(()=>view.restoreView({real:'NaN',imag:'0',bits:100,zoom:100}));
(async()=>{
 const {MandelbrotRenderer}=load(base+'mandelbrot-renderer.ts'),renderer=new MandelbrotRenderer();
 const settings={view:view.saveView(view.initialView()),width:128,height:64,iterations:128,antialias:'adaptive'};
 let delivered=0;const obsolete=renderer.render(settings,state=>{if(state.tile)delivered++;});renderer.cancel();assert.equal(await obsolete,null);assert.equal(delivered,0,'Canceled workers published tiles');
 const field=await renderer.render(settings,()=>{});assert.equal(field.samples.length,128*64*4);assert(field.samples.every(Number.isFinite));assert.equal(field.workers,3);
 FakeWorker.fail=true;await assert.rejects(renderer.render(settings,()=>{}),/test failure/);FakeWorker.fail=false;
 renderer.destroy();assert.equal(await renderer.render(settings,()=>{}),null);
 console.log('PASS: arbitrary-precision anchors and saved positions, exact BigInt oracles at 2^1100 / 2^4096, BLA, interior proofs, palettes, worker cancellation, failures and disposal.');
})().catch(error=>{console.error(error);process.exitCode=1;});
