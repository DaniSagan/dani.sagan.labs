const assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript'),vm=require('node:vm');
const mod={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/app/games/towers-of-hanoi/hanoi.model.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,{exports:mod.exports,module:mod,Int16Array});
const {encode,decode,legalMove,goalDistances,nextMove}=mod.exports;
for(let n=1;n<=8;n++){
 const distances=goalDistances(n);assert.equal(distances[0],2**n-1);assert.equal(distances[3**n-1],0);
 for(let code=0;code<3**n;code++){
  const state=decode(code,n);assert.equal(encode(state),code);assert(distances[code]>=0);
  const move=nextMove(state,distances);
  if(!distances[code]){assert.equal(move,null);continue;}
  assert(legalMove(state,move.from,move.to));const next=[...state];next[move.disk]=move.to;assert.equal(distances[encode(next)],distances[code]-1);
  for(let from=0;from<3;from++)for(let to=0;to<3;to++)if(legalMove(state,from,to)){const adjacent=[...state];adjacent[state.indexOf(from)]=to;assert(Math.abs(distances[encode(adjacent)]-distances[code])<=1);}
 }
 let state=Array(n).fill(0),steps=0;while(nextMove(state,distances)){const m=nextMove(state,distances);state[m.disk]=m.to;steps++;}assert.equal(steps,2**n-1);assert(state.every(p=>p===2));
}
assert(!legalMove([2,0,0],0,2));assert(!legalMove([0,0],1,2));assert(!legalMove([0],0,0));
console.log('PASS: all 9840 states for 1-8 disks, shortest paths, legal transitions, optimal complete solutions.');
