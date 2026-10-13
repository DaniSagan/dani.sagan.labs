const fs = require('node:fs'), ts = require('typescript'), vm = require('node:vm'), assert = require('node:assert/strict');
const angular = { Component: () => t => t, ViewChild: () => () => {}, Input: () => () => {}, CommonModule: {}, FormsModule: {} };
function load(file, extra = {}) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, experimentalDecorators: true } }).outputText,
    { exports, require: name => name.includes('fractal-palette') ? palette : angular, Math, ...extra });
  return exports;
}
const base='src/app/articles/fractals/';
const palette=load(base+'fractal-explorer/fractal-palette.ts');
for(let n=0;n<=2048;n++)assert(palette.escapeColor(n,2048).every(c=>Number.isInteger(c)&&c>=0&&c<=255));
assert.deepEqual(Array.from(palette.escapeColor(2048,2048)),[10,10,15]);
const {ApollonianSieveComponent}=load(base+'apollonian-sieve/apollonian-sieve.component.ts');
const close=(a,b)=>assert(Math.abs(a-b)<1e-6,`${a} != ${b}`);
for(const radii of [[200,150,100],[80,250,250],[250,80,80],[80,80,80]]) {
 const app=new ApollonianSieveComponent(),[a,b,c]=radii,d=a+b;
 const x=((a+c)**2+d*d-(b+c)**2)/(2*d);
 const circles=[{x:0,y:0,r:a},{x:d,y:0,r:b},{x,y:Math.sqrt((a+c)**2-x*x),r:c}];
 const inner=app.calculateInnerCircle(...circles), outer=app.descartes(circles,-1);
 assert(outer.r<0,'Enclosing circle requires negative curvature');
 for(const q of circles){close(Math.hypot(inner.x-q.x,inner.y-q.y),inner.r+q.r);close(Math.hypot(outer.x-q.x,outer.y-q.y),Math.abs(outer.r)-q.r);}
 let arcs=0;const ctx={fillRect(){},save(){},translate(){},scale(){},restore(){},beginPath(){},arc(x,y,r){assert(Number.isFinite(x)&&Number.isFinite(y)&&r>0);arcs++;},stroke(){}};
 app.canvas={nativeElement:{getContext:()=>ctx}};[app.radius1,app.radius2,app.radius3]=radii;app.maxDepth=7;app.update();assert(arcs>50&&arcs<10000);
}
const {MengerSpongeComponent}=load(base+'menger-sponge/menger-sponge.component.ts');
const sponge=new MengerSpongeComponent();
for(let n=0;n<=3;n++) {
 const cells=sponge.cubes(n);assert.equal(cells.length,20**n);
 for(const cell of cells)for(let digit=0;digit<n;digit++)assert(cell.filter(v=>Math.floor(v/3**digit)%3===1).length<=1);
}
const frames=new Map();let nextFrame=0;
const {FractalExplorerComponent}=load(base+'fractal-explorer/fractal-explorer.component.ts', {
  window:{devicePixelRatio:3},requestAnimationFrame:fn=>{frames.set(++nextFrame,fn);return nextFrame;},cancelAnimationFrame:id=>frames.delete(id)
});
const explorer=new FractalExplorerComponent();explorer.minIterations=2;explorer.maxIterations=6;
let draws=0,ratio=0;const context={scale:r=>ratio=r,fillRect(){},save(){},restore(){}};
const canvas={getContext:()=>context};explorer.canvas={nativeElement:canvas};explorer.draw=()=>draws++;
explorer.iterations=-10;explorer.update();assert.equal(explorer.iterations,2);
explorer.iterations=99;explorer.update();assert.equal(explorer.iterations,6);assert.equal(frames.size,1,'Slider events coalesce into one frame');
for(const frame of frames.values())frame();frames.clear();assert.equal(canvas.width,960);assert.equal(ratio,2);assert.equal(draws,1);
explorer.raster=true;explorer.iterations=NaN;explorer.update();assert.equal(explorer.iterations,4);
for(const frame of frames.values())frame();frames.clear();assert.equal(canvas.width,480);assert.equal(ratio,1);
explorer.update();explorer.ngOnDestroy();assert.equal(frames.size,0);
(async()=>{
 const {MandelbrotComponent}=load(base+'mandelbrot/mandelbrot.component.ts');
 const app=new MandelbrotComponent();app.width=20;app.height=20;
 let paints=0;const ctx={createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(){paints++;}};
 app.canvas={nativeElement:{getContext:()=>ctx}};
 const pending=[];app.sleep=()=>new Promise(resolve=>pending.push(resolve));
 const first=app.drawMandelbrot();app.centerX=.3;const second=app.drawMandelbrot();
 pending.shift()();await new Promise(resolve=>setImmediate(resolve));assert.equal(paints,0,'Obsolete render must never publish pixels');
 while(pending.length){pending.shift()();await new Promise(resolve=>setImmediate(resolve));}
 await Promise.all([first,second]);assert.equal(app.isDrawing,false);assert(paints>0);
 const third=app.drawMandelbrot();const previous=paints;app.ngOnDestroy();while(pending.length){pending.shift()();await new Promise(resolve=>setImmediate(resolve));}await third;assert.equal(paints,previous,'Destroyed render must not publish');
 console.log('PASS: palette bounds, four tangency fixtures, finite packed circles, stale rendering cancellation and component disposal.');
})().catch(e=>{console.error(e);process.exitCode=1;});
