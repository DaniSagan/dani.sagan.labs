const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),path=require('path');
const messages=[];
const context=vm.createContext({console,performance,Float64Array,Int8Array,Int32Array,Uint8Array,Map,Set,self:{postMessage(message){messages.push(message);}}});
context.importScripts=(...files)=>files.forEach(file=>vm.runInContext(fs.readFileSync(path.join('src/assets/game-of-life',file),'utf8'),context,{filename:file}));
vm.runInContext(fs.readFileSync('src/assets/game-of-life/life-worker.js','utf8'),context,{filename:'life-worker.js'});
let id=0;
function send(type,data={}){context.self.onmessage({data:{type,id:++id,...data}});const result=messages.at(-1);if(result.type==='error')throw Error(result.message);return result;}
const alive=()=>vm.runInContext('(()=>{const p=[];const size=2**universe.root.level;cells(universe.root,-size/2,-size/2,size,p);return p.sort((a,b)=>a[1]-b[1]||a[0]-b[0]);})()',context).map(p=>Array.from(p));
const signature=p=>p.map(c=>c.join(',')).sort().join(';');
const baseline=p=>{const set=new Set(p.map(c=>c.join(','))),counts=new Map();for(const [x,y]of p)for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(dx||dy){const k=(x+dx)+','+(y+dy);counts.set(k,(counts.get(k)||0)+1);}return[...counts].filter(([k,n])=>n===3||(n===2&&set.has(k))).map(([k])=>k.split(',').map(Number));};
send('load',{text:'x = 3, y = 1, rule = B3/S23\n3o!',centered:false});
const start=signature(alive());send('step',{exponent:0});assert.equal(signature(alive()),'1,-1;1,0;1,1');send('step',{exponent:0});assert.equal(signature(alive()),start);
send('load',{text:'x = 3, y = 3, rule = B3/S23\nbo$2bo$3o!',centered:false});const glider=alive();const jump=send('step',{exponent:20});assert.equal(jump.generation,1048576);assert.equal(signature(alive()),signature(glider.map(([x,y])=>[x+262144,y+262144])));
send('clear');send('edit',{cells:[[1e12,-1e12,true],[1e12+1,-1e12,true],[1e12,-1e12+1,true],[1e12+1,-1e12+1,true]]});send('step',{exponent:16});assert.equal(alive().length,4);assert.equal(send('view').bounds.left,1e12);
const rle=send('export',{format:'rle'}).text;const expected=signature(alive());send('load',{text:rle,centered:false});assert.equal(signature(alive()),expected);
const mc=send('export',{format:'mc'}).text;send('load',{text:mc,centered:false});assert.equal(signature(alive()),expected);send('step',{exponent:0});assert.equal(signature(alive()),expected);
let seed=42;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
let points=[];for(let y=-8;y<9;y++)for(let x=-8;x<9;x++)if(random()<.3)points.push([x,y]);send('clear');send('edit',{cells:points.map(([x,y])=>[x,y,true])});
for(let generation=1;generation<=100;generation++){points=baseline(points);send('step',{exponent:0});assert.equal(signature(alive()),signature(points),'Random reference generation '+generation);}
send('restore');assert.equal(send('view').generation,0);send('step',{exponent:0});
send('clear');
const edge=2**50;
send('edit',{cells:[[edge,0,true],[edge-1,0,true],[edge,1,true],[edge-1,1,true]]});
const edgeSignature=signature(alive());send('step',{exponent:10});assert.equal(signature(alive()),edgeSignature,'Exact coordinate boundary');
const edgeMc=send('export',{format:'mc'}).text;send('load',{text:edgeMc,centered:false});assert.equal(signature(alive()),edgeSignature,'Boundary macrocell round trip');
const io=require('../src/assets/game-of-life/life-io.js');
for(const text of ['x = 2, y = 1\n3o!','x = 2, y = 1\n2o','x = 1, y = 1, rule = B36/S23\no!','x = 1, y = 1\no!junk'])assert.throws(()=>io.parseRle(text));
assert.throws(()=>io.validateMacrocell('[M2]\n4 1 0 0 0'));
const catalog=JSON.parse(fs.readFileSync('src/assets/game-of-life/catalog.json','utf8'));const chunks=new Map();let checked=0;
for(const pattern of catalog.patterns){if(!chunks.has(pattern.file))chunks.set(pattern.file,JSON.parse(fs.readFileSync('src/assets/game-of-life/'+pattern.file,'utf8')));const data=io.parseRle(chunks.get(pattern.file)[pattern.id]);assert.equal(data.xs.length,pattern.population);checked++;}
console.log('PASS: blinker, million-generation glider jump, 10^12 coordinates, RLE/macrocell round trips, 100 random reference generations, rewind, malformed inputs, '+checked+' catalogue patterns.');
