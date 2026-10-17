const fs = require('fs'), vm = require('vm'), ts = require('typescript'), assert = require('node:assert/strict');
const filename = 'src/app/articles/dynamical-systems/langtons-ant/langtons-ant.model.ts';
const modelExports = {};
vm.runInNewContext(ts.transpileModule(fs.readFileSync(filename,'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText, {exports:modelExports, Map, Set, Math, Number, Error});
const {AntEngine,initialEngine,analyzeHighway}=modelExports;
const snapshot=e=>JSON.stringify({cells:[...e.cells].sort(),ants:e.ants,steps:e.steps,visits:[...e.visits].sort(),bounds:e.bounds});
let tests=0; const check=(name,fn)=>{fn();tests++;console.log('PASS',name)};
check('initial sequence: north, right on white, flip and advance',()=>{
 const e=new AntEngine(); const expected=[[1,0,1],[1,-1,2],[0,-1,3],[0,0,0],[-1,0,3]];
 for(const [x,y,d] of expected){e.step();assert.equal(JSON.stringify(e.ants[0]),JSON.stringify({x,y,d}));}
 assert.equal(e.get(0,0),0);assert.equal(e.get(1,0),1);
});
check('all headings, both turns and cyclic cell states',()=>{
 for(const rule of ['RL','LR','LLRR','RLLR'])for(let d=0;d<4;d++)for(let s=0;s<rule.length;s++){
  const e=new AntEngine(rule);e.ants[0].d=d;e.put(0,0,s);e.step();
  const nd=(d+(rule[s]==='R'?1:3))%4;assert.equal(e.ants[0].d,nd);assert.equal(e.get(0,0),(s+1)%rule.length);
  assert.equal(e.ants[0].x,[0,1,0,-1][nd]);assert.equal(e.ants[0].y,[1,0,-1,0][nd]);
 }
});
check('full reversal restores visits, region, ants, cells and step count',()=>{
 for(const rule of ['RL','RLLR'])for(const n of [1,2,4,10]){
 const e=initialEngine('random',123,rule,n),before=snapshot(e);e.run(1300);for(let i=0;i<1300;i++)assert(e.back());assert.equal(snapshot(e),before);assert(!e.back());}
});
check('same seed and rule reproduce exactly; different seeds differ',()=>{
 const a=initialEngine('random',12),b=initialEngine('random',12),c=initialEngine('random',13);a.run(5000);b.run(5000);c.run(5000);assert.equal(snapshot(a),snapshot(b));assert.notEqual(snapshot(a),snapshot(c));
});
check('multi-ant sequential write conflict is specified',()=>{
 const e=new AntEngine();e.ants=[{x:0,y:0,d:0},{x:0,y:0,d:0}];e.begin();e.step();e.step();assert.equal(e.ants[0].x,1);assert.equal(e.ants[1].x,-1);assert.equal(e.get(0,0),0);
});
check('highway operational patch and trace repeat with drift (-2,-2)',()=>{
 const e=new AntEngine();e.run(11000);let p=analyzeHighway(e);assert(p.match);assert.equal(p.dx,-2);assert.equal(p.dy,-2);
 const before=snapshot(e);analyzeHighway(e);assert.equal(snapshot(e),before);
 for(let i=0;i<100;i++){assert(analyzeHighway(e).match);e.run(104);}
 assert(!analyzeHighway(new AntEngine()).match);
});
check('visited region agrees with exact keys',()=>{
 const e=new AntEngine();e.run(11000);for(let i=0;i<100;i++)e.back();const coords=[...e.visits.keys()].map(k=>k.split(',').map(Number));
 assert.equal(JSON.stringify(e.bounds),JSON.stringify([Math.min(...coords.map(p=>p[0])),Math.max(...coords.map(p=>p[0])),Math.min(...coords.map(p=>p[1])),Math.max(...coords.map(p=>p[1]))]));
});
check('history cap and fresh experiment',()=>{
 const e=new AntEngine();e.run(100010);assert.equal(e.history.size,100000);for(let i=0;i<100000;i++)assert(e.back());assert.equal(e.steps,10);assert(!e.back());e.begin();assert.equal(e.steps,0);assert.equal(e.history.size,0);assert.equal(e.visits.size,1);
});
check('invalid rules and states rejected',()=>{for(const r of ['', 'R','RXL','RL RL','R'.repeat(13)])assert.throws(()=>new AntEngine(r));assert.throws(()=>new AntEngine().put(0,0,2));});
check('all presets and closed RR control',()=>{for(const p of ['white','single','square','line','symmetric','random']){const e=initialEngine(p);e.run(100);assert.equal(e.steps,100);}const e=new AntEngine('RR');const before=snapshot(e);e.run(8);assert.equal(e.cells.size,0);assert.equal(e.ants[0].x,0);assert.equal(e.ants[0].y,0);});
console.log(`${tests} model suites passed`);
