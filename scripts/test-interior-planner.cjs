const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),ts=require('typescript');
global.crypto ||= require('node:crypto').webcrypto;
const base=path.resolve('src/app/tools/interior-planner'),cache=new Map();
function load(name){const file=path.resolve(base,name+'.ts');if(cache.has(file))return cache.get(file);const api={};cache.set(file,api);new Function('exports','require',ts.transpile(fs.readFileSync(file,'utf8'),{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}))(api,s=>load(s));return api;}
const m=load('cad-model'),g=load('cad-geometry'),d=load('cad-document'),ex=load('cad-export');
const {visibleViewport}=load('cad-viewport');
const {gridResolution}=load('cad-grid');
assert.deepEqual(gridResolution(100,0.49,true),{fine:false,step:100});
assert.deepEqual(gridResolution(100,0.5,true),{fine:true,step:10});
assert.deepEqual(gridResolution(100,2,false),{fine:false,step:100});
assert.deepEqual(gridResolution(10,2,true),{fine:false,step:10});
assert.deepEqual(g.snap({x:3217,y:74},[],gridResolution(100,1,true).step,0),{x:3220,y:70});
const viewportBox={x:100,y:200,width:400,height:200};
assert.deepEqual(visibleViewport(viewportBox,400,800),{x:100,y:-100,width:400,height:800});
assert.deepEqual(visibleViewport(viewportBox,800,200),{x:-100,y:200,width:800,height:200});
assert.deepEqual(visibleViewport(viewportBox,800,400),viewportBox);
assert.deepEqual(visibleViewport(viewportBox,0,0),viewportBox);
assert.deepEqual(viewportBox,{x:100,y:200,width:400,height:200},'Viewport expansion must not alter camera coordinates');
const close=(a,b)=>assert(Math.abs(a-b)<1e-5,`${a} != ${b}`);
const doc=m.newDocument(),r=doc.rooms[0];close(g.area(r.vertices),3270*2660);close(g.perimeter(r.vertices),11860);assert.deepEqual(g.centroid(r.vertices),{x:1635,y:1330});
for(const shape of ['rectangle','ellipse','polygon']){
 const small=m.definition('Small',shape,1600,1400);small.width=300;small.depth=200;d.validateDefinition(small);
}
for(const shape of ['l-shape','chaise']){
 const partial=m.definition('Partial',shape,1600,1400);partial.width=300;assert.throws(()=>d.validateDefinition(partial),/ancho del brazo/);
 partial.width=1600;partial.depth=200;assert.throws(()=>d.validateDefinition(partial),/fondo del cuerpo/);
 partial.depth=1400;d.validateDefinition(partial);
}
const L=[{x:0,y:0},{x:4000,y:0},{x:4000,y:2000},{x:2000,y:2000},{x:2000,y:4000},{x:0,y:4000}];g.validatePolygon(L);close(g.area(L),12e6);assert(g.inside({x:1000,y:3000},L));assert(!g.inside({x:3000,y:3000},L));
for(const p of [[],[{x:0,y:0},{x:1,y:0},{x:0,y:0}],[{x:0,y:0},{x:10,y:10},{x:0,y:10},{x:10,y:0}],[{x:0,y:0},{x:10,y:0},{x:5,y:0},{x:5,y:5}]])assert.throws(()=>g.validatePolygon(p));
assert(g.intersects({x:0,y:0},{x:10,y:0},{x:5,y:0},{x:20,y:0}));assert(g.onSegment({x:10,y:0},{x:0,y:0},{x:10,y:0}));
const rot=g.transform({x:100,y:0},{x:10,y:20},90);close(rot.x,10);close(rot.y,120);
const original=m.clone(r);g.setWall(r,0,4000,0);close(g.wallLength(r,0),4000);assert.equal(r.walls[0].id,original.walls[0].id);g.validatePolygon(r.vertices);
const snapshot=JSON.stringify(r);assert.throws(()=>g.setWall(r,0,0,0));assert.equal(JSON.stringify(r),snapshot);r.walls[1].locked=true;assert.throws(()=>g.setWall(r,0,4200,0));r.walls[1].locked=false;
for(const anchor of ['left','right','center','proportional']){const f={anchor,offset:anchor==='proportional'?.25:450,width:80};const before=g.fixtureOffset(f,3000),after=g.fixtureOffset(f,4000);close(after-before,anchor==='left'?0:anchor==='right'?1000:anchor==='center'?500:250);}
const f={id:m.uid(),roomId:r.id,wallId:r.walls[0].id,kind:'socket',name:'Enchufe',offset:450,z:300,width:80,height:80,anchor:'left',color:'#d49950'};doc.fixtures.push(f);assert.equal(g.fixturePlan(f,r).point.x,450);
for(const shape of ['rectangle','ellipse','l-shape','chaise','polygon']){const def=m.definition('Test',shape,2800,1600);d.validateDefinition(def);assert(g.furniturePath(def).endsWith('Z'));assert(g.outline(def).every(p=>p.x>=0&&p.x<=2800&&p.y>=0&&p.y<=1600));if(shape!=='ellipse')assert(g.furniturePath(def).includes('A'));def.mirrored=true;d.validateDefinition(def);}
const i={id:m.uid(),definitionId:doc.definitions[0].id,roomId:r.id,x:100,y:100,rotation:0,locked:false,hidden:false};doc.instances.push(i);assert(g.contained(g.worldOutline(doc.definitions[0],i),r.vertices));i.x=-500;assert(!g.contained(g.worldOutline(doc.definitions[0],i),r.vertices));i.x=100;
assert(!g.contained([{x:1500,y:3500},{x:3500,y:1500},{x:500,y:500}],L),'Segment crosses a concave notch');
const square=[{x:0,y:0},{x:100,y:0},{x:100,y:100},{x:0,y:100}];assert(g.overlaps(square,square.map(p=>({x:p.x+50,y:p.y+50}))));assert(!g.overlaps(square,square.map(p=>({x:p.x+200,y:p.y}))));
doc.annotations.push({id:m.uid(),roomId:r.id,x:100,y:200,text:'<&" Plano'});const json=JSON.stringify(doc);assert.deepEqual(d.parseDocument(JSON.parse(json)),doc);
for(const mutate of [x=>x.schemaVersion=2,x=>x.rooms[0].walls.pop(),x=>x.fixtures[0].wallId='missing',x=>x.instances[0].definitionId='missing',x=>x.rooms[0].vertices[0].x=NaN,x=>x.instances[0].x=Infinity,x=>x.definitions[0].color='red',x=>x.rooms[0].id=x.id,x=>x.precision=1.5,x=>x.definitions[0].width=-1,x=>x.definitions[0].shape='unknown']){const x=m.clone(doc);mutate(x);assert.throws(()=>d.parseDocument(x));}
const h=new d.DocumentHistory(),before=m.clone(doc);h.commit(doc);doc.instances[0].rotation=45;let now=h.undo(doc);assert.deepEqual(now,before);assert(h.canRedo);now=h.redo(now);assert.equal(now.instances[0].rotation,45);h.commit(now);assert(!h.canRedo);
const svg=ex.exportSvg(doc,r,null),elevation=ex.exportSvg(doc,r,0);assert(svg.includes('&lt;&amp;&quot;'));assert(elevation.includes('Enchufe'));assert(svg.includes('width="80"'));assert(!svg.includes('undefined'));assert(!svg.includes('NaN'));
const wallsApi=load('cad-walls');
const openingsApi=load('cad-openings');
const openingRoom=m.makeRoom(),door={...f,roomId:openingRoom.id,wallId:openingRoom.walls[0].id,kind:'door',offset:450,z:0,width:800,height:2100};
openingsApi.validateOpening(door,openingRoom);assert(openingsApi.openingSymbol(door,openingRoom).includes(' A 800 800 0 0 0'));
assert.equal(openingsApi.openingThickness(door,openingRoom),120);
assert(openingsApi.openingSymbol({...door,doorSwing:'outward'},openingRoom).includes('M 0 -60 V -860 A 800 800 0 0 1 800 -60'));
assert(openingsApi.openingSymbol({...door,doorHinge:'end'},openingRoom).includes('M 800 60 V 860 A 800 800 0 0 1 0 60'));
assert(openingsApi.openingSymbol({...door,doorSwing:'outward',doorHinge:'end'},openingRoom).includes('M 800 -60 V -860 A 800 800 0 0 0 0 -60'));
assert.throws(()=>openingsApi.validateOpening({...door,width:4000},openingRoom));
openingRoom.walls[0].endHeight=1000;assert.throws(()=>openingsApi.validateOpening({...door,offset:2400},openingRoom));
openingRoom.walls[0].endHeight=2500;openingRoom.walls[0].locked=true;assert.throws(()=>openingsApi.validateOpening(door,openingRoom));openingRoom.walls[0].locked=false;
const windowFixture={...door,id:m.uid(),kind:'window',z:900,height:1000,width:1200};assert(!openingsApi.openingSymbol(windowFixture,openingRoom).includes(' A '));
const openingDoc=m.newDocument();openingDoc.rooms=[openingRoom];openingDoc.fixtures=[door,windowFixture];
const openingSvg=ex.exportSvg(openingDoc,openingRoom,null);assert(openingSvg.includes('mask="url(#export-openings)"'));assert(openingSvg.includes('fill="black"'));assert(openingSvg.includes('A 800 800'));
const rectangular=m.makeRoom(),walls=wallsApi.wallDrawing(rectangular);
assert.deepEqual(walls.innerVertices,[{x:60,y:60},{x:3210,y:60},{x:3210,y:2600},{x:60,y:2600}]);
close(wallsApi.interiorWallLength(rectangular,0),3150);
const collapsedFrame=wallsApi.interiorWallFrame(m.makeRoom('Small',120,120),0);assert.equal(collapsedFrame.length,0);assert(Number.isFinite(collapsedFrame.ux)&&Number.isFinite(collapsedFrame.uy));
const measured=m.makeRoom();wallsApi.moveInteriorVertex(measured,0,{x:0,y:0});wallsApi.moveInteriorVertex(measured,1,{x:3200,y:0});
const measuredFrame=wallsApi.interiorWallFrame(measured,0);assert(g.distance(measuredFrame.start,{x:0,y:0})<1e-5);assert(g.distance(measuredFrame.end,{x:3200,y:0})<1e-5);close(wallsApi.interiorWallLength(measured,0),3200);
const measuredDoc=m.newDocument();measuredDoc.rooms=[measured];assert(ex.exportSvg(measuredDoc,measured,null).includes('320 cm'));assert(ex.exportSvg(measuredDoc,measured,0).includes('320 cm'));
wallsApi.setInteriorWall(measured,0,4000,0);close(wallsApi.interiorWallLength(measured,0),4000);assert(g.distance(wallsApi.interiorWallFrame(measured,0).start,{x:0,y:0})<1e-5);
const measuredBefore=JSON.stringify(measured);assert.throws(()=>wallsApi.setInteriorWall(measured,0,-10,0));assert.equal(JSON.stringify(measured),measuredBefore);
const unequal=m.makeRoom();unequal.walls[3].thickness=200;unequal.walls[0].thickness=300;
assert.deepEqual(wallsApi.wallDrawing(unequal).innerVertices[0],{x:100,y:150});
for(const shape of [m.makeRoom(),m.clone(unequal),{...m.makeRoom(),vertices:L,walls:L.map((_,i)=>m.makeWall(i))}]){
 for(const index of [0,1]){
  const room=m.clone(shape),visible=wallsApi.wallDrawing(room).innerVertices[index],target=index===0?{x:0,y:0}:{x:visible.x+130,y:visible.y+70},ids=room.walls.map(w=>w.id);
  wallsApi.moveInteriorVertex(room,index,target);assert(g.distance(wallsApi.wallDrawing(room).innerVertices[index],target)<1e-5);g.validatePolygon(room.vertices);assert.deepEqual(room.walls.map(w=>w.id),ids);
 }
}
const atomicRoom=m.makeRoom(),atomicBefore=JSON.stringify(atomicRoom);
assert.throws(()=>wallsApi.moveInteriorVertex(atomicRoom,1,{x:60,y:60}));assert.equal(JSON.stringify(atomicRoom),atomicBefore);
atomicRoom.walls[0].locked=true;assert.throws(()=>wallsApi.moveInteriorVertex(atomicRoom,0,{x:0,y:0}));
const reversedRoom=m.makeRoom();reversedRoom.vertices.reverse();assert.deepEqual(wallsApi.wallDrawing(reversedRoom).innerVertices[0],{x:60,y:2600});
for(let seed=1;seed<=12;seed++)for(let index=0;index<4;index++){
 const room=m.makeRoom();room.vertices[2].x-=seed*20;if(seed%2)room.vertices.reverse();room.walls.forEach((w,i)=>w.thickness=50+(seed+i)*11);
 const p=wallsApi.wallDrawing(room).innerVertices[index],target={x:p.x+30*Math.cos(seed+index),y:p.y+30*Math.sin(seed-index)};
 wallsApi.moveInteriorVertex(room,index,target);assert(g.distance(wallsApi.wallDrawing(room).innerVertices[index],target)<1e-5);
}
const obliqueRoom=m.makeRoom();obliqueRoom.vertices[2]={x:2500,y:2660};const obliquePoint=wallsApi.wallDrawing(obliqueRoom).innerVertices[1];
close(obliquePoint.y,60);close(g.cross(obliqueRoom.vertices[1],obliqueRoom.vertices[2],obliquePoint)/g.distance(obliqueRoom.vertices[1],obliqueRoom.vertices[2]),60);
assert.equal(walls.sections.length,4);assert(walls.outer.some(p=>p.x===-60&&p.y===-60));assert(walls.band.includes('M 60 60'));
for(const vertices of [L,[...L].reverse(),[{x:0,y:0},{x:4000,y:0},{x:2000,y:1}]]){
 const room=m.makeRoom();room.vertices=vertices;room.walls=vertices.map((_,i)=>m.makeWall(i));room.walls[0].thickness=200;
 const drawing=wallsApi.wallDrawing(room);assert.equal(drawing.sections.length,vertices.length);assert.equal(drawing.innerVertices.length,vertices.length);assert(!/NaN|Infinity/.test(JSON.stringify(drawing)));assert(drawing.outer.every((p,i)=>g.distance(p,vertices[Math.floor(i/2)])<=400.000001));
}
const splitRoom=m.makeRoom();splitRoom.vertices.splice(1,0,{x:1600,y:0});splitRoom.walls.splice(1,0,m.makeWall(4));assert(!/NaN|Infinity/.test(wallsApi.wallDrawing(splitRoom).band));
wallsApi.moveInteriorVertex(splitRoom,1,{x:1600,y:100});assert(g.distance(wallsApi.wallDrawing(splitRoom).innerVertices[1],{x:1600,y:100})<1e-5);
assert(svg.includes('export-wall-hatch'));assert(svg.includes('fill-rule="evenodd"'));assert(!svg.includes('stroke-width="120"'));
console.log('PASS architectural wall offsets, mitres, bevels, unequal thickness, both orientations, collinear splits and hatched SVG.');
console.log('PASS CAD geometry, concavity, degeneracy, transforms, walls, four anchors, furniture, collision envelopes, JSON integrity, history and vector exports.');
(async()=>{const {parseTemplate}=await import('@angular/compiler');const html=fs.readFileSync(path.join(base,'interior-planner.component.html'),'utf8');assert.equal(parseTemplate(html,'cad.html').errors,null);assert(!html.includes('\ufffd'));console.log('PASS Angular template.');})().catch(e=>{console.error(e);process.exitCode=1});
