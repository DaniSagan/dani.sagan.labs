const assert = require('node:assert/strict');
const fs = require('node:fs'), ts = require('typescript'), vm = require('node:vm');
const source = fs.readFileSync('src/app/games/game-2048/game-2048.model.ts','utf8');
const moduleFile = {exports:{}};
vm.runInNewContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,{exports:moduleFile.exports,module:moduleFile, Set, Math});
const {moveBoard, spawnTile, canMove, validSave} = moduleFile.exports;
const board = rows => rows.flatMap((row,r) => row.flatMap((value,c) => value ? [{id:r*4+c+1,value,row:r,col:c}] : []));
const rowValues = tiles => Array.from({length:16},(_,i)=>tiles.find(t=>t.row*4+t.col===i)?.value || 0);
const cases = [ [[2,2,2,2],[4,4,0,0],8], [[2,2,4,0],[4,4,0,0],4], [[4,0,4,4],[8,4,0,0],8], [[2,4,8,16],[2,4,8,16],0], [[0,0,0,2],[2,0,0,0],0], [[4,4,8,8],[8,16,0,0],24] ];
for(const [input,output,gain] of cases){
 const tiles=board([input]); const before=JSON.stringify(tiles), r=moveBoard(tiles,'left');
 assert.deepEqual(Array.from(rowValues(r.tiles).slice(0,4)),output);assert.equal(r.gain,gain);assert.equal(JSON.stringify(tiles),before);
 const right=moveBoard(board([[...input].reverse()]),'right');assert.deepEqual(Array.from(rowValues(right.tiles).slice(0,4)),[...output].reverse());
 for(const d of ['up','down']){const column=board((d==='up'?input:[...input].reverse()).map(x=>[x,0,0,0]));const result=moveBoard(column,d);assert.deepEqual(Array.from([0,4,8,12].map(i=>rowValues(result.tiles)[i])),d==='up'?output:[...output].reverse());assert.equal(result.gain,gain);}
}
assert.equal(moveBoard(board([[2,0,0,0]]),'left').changed,false);
assert.equal(canMove(board([[2,4,2,4],[4,2,4,2],[2,4,2,4],[4,2,4,2]])),false);
assert.equal(canMove(board([[2,2,2,4],[4,2,4,2],[2,4,2,4],[4,2,4,2]])),true);
assert.equal(canMove([]),true);
for(const r of [0,.899,.9,.999]){const spawned=spawnTile([],()=>r);assert.equal(spawned.length,1);assert.equal(spawned[0].value,r<.9?2:4);}
let tiles=spawnTile(spawnTile([],()=>0),()=>0);const save={tiles,score:0,best:0,moves:0,won:false,continued:false};assert(validSave(save));
for(const patch of [{score:-1},{tiles:[tiles[0],tiles[0]]},{won:true},{continued:true},{tiles:[]},{tiles:[{...tiles[0],value:3},tiles[1]]}])assert.equal(validSave({...save,...patch}),false);
// Exhaustive four-cell lines, no double merge, conservation, valid positions and stable IDs.
for(let n=0;n<625;n++){let v=n;const input=Array.from({length:4},()=>{const a=[0,2,4,8,16][v%5];v=Math.floor(v/5);return a;});for(const d of ['left','right','up','down']){const original=board([input]),r=moveBoard(original,d);assert.equal(r.tiles.reduce((s,t)=>s+t.value,0),input.reduce((s,x)=>s+x,0));assert.equal(new Set(r.tiles.map(t=>t.id)).size,r.tiles.length);assert.equal(new Set(r.tiles.map(t=>t.row*4+t.col)).size,r.tiles.length);assert(r.tiles.every(t=>t.row>=0&&t.row<4&&t.col>=0&&t.col<4));}}
// Deterministic complete games exercise spawning, scores and terminal boards.
for(let seed=1;seed<=30;seed++){let x=seed;const random=()=>{x=(Math.imul(x,1664525)+1013904223)>>>0;return x/4294967296;};let t=spawnTile(spawnTile([],random),random),score=0;for(let step=0;step<2000&&canMove(t);step++){const d=['up','right','down','left'][Math.floor(random()*4)],r=moveBoard(t,d);if(!r.changed)continue;const sum=t.reduce((s,a)=>s+a.value,0);t=spawnTile(r.tiles,random);score+=r.gain;assert([2,4].includes(t.reduce((s,a)=>s+a.value,0)-sum));assert(validSave({tiles:t,score,best:score,moves:step,won:t.some(a=>a.value>=2048),continued:false}));}}
console.log('PASS: four directions, single merges, 2500 line cases, 30 seeded games, spawning, terminal states and saved-game validation.');
