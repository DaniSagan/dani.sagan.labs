const fs=require('fs'),path=require('path'),os=require('os');const source=process.argv[2] || path.join(os.tmpdir(),'danisagan-constellation-source');
const lines=JSON.parse(fs.readFileSync(path.join(source,'lines.json'))).features, stars=JSON.parse(fs.readFileSync(path.join(source,'stars.json'))).features,names=JSON.parse(fs.readFileSync(path.join(source,'names.json')));
const boundaries=JSON.parse(fs.readFileSync(path.join(source,'boundaries.json'))).features;
const officialNames=JSON.parse(fs.readFileSync(path.join(source,'constellations.json'))).features;
const curated=new Map(fs.readFileSync('scripts/constellation-curation.txt','utf8').replace(/^\uFEFF/,'').trim().split(/\r?\n/).map(row=>{const [id,name,latin,hemisphere,tip]=row.split('|');return[id,{name,latin,tip}];}));
const extraTips=JSON.parse(fs.readFileSync('scripts/constellation-extra-tips.json','utf8'));
const selectedObjects=JSON.parse(fs.readFileSync('scripts/constellation-deep-sky.json','utf8'));
const deepSky=JSON.parse(fs.readFileSync(path.join(source,'dsos-all.json'))).features;
const messier=JSON.parse(fs.readFileSync(path.join(source,'messier.json'))).features;
const deepSkyNames=JSON.parse(fs.readFileSync(path.join(source,'dsonames.json')));
function insideRegion(ra,dec,id){return boundaries.filter(f=>f.id===id).some(f=>f.geometry.coordinates.some(ring=>{const p=ring.map(([a,d])=>[ ((a-ra+540)%360)-180,d]);let inside=false;for(let i=0,j=p.length-1;i<p.length;j=i++){const[a,y]=p[i],[b,z]=p[j];if((y>dec)!==(z>dec)&&0<(b-a)*(dec-y)/(z-y)+a)inside=!inside;}return inside;}));}
const rad=Math.PI/180, catalog=[];
for(const id of [...new Set(officialNames.map(f=>f.id))]){
 const existing=curated.get(id), official=officialNames.find(f=>f.id===id).properties;
 const name=existing?.name||(extraTips[id]?.name)||official.es.replace(/\s+/g,' '), latin=existing?.latin||extraTips[id]?.latin||(id==='Ser'?'Serpens':official.name), tip=existing?.tip||extraTips[id]?.tip;
 if(!tip)throw Error('Missing curated tip '+id);
 // Serpens has two disconnected regions but is one official constellation.
 const feature={geometry:{coordinates:lines.filter(f=>f.id===id).flatMap(f=>f.geometry.coordinates)}};if(!feature.geometry.coordinates.length)throw Error(id);
 const boundaryPoints=boundaries.filter(f=>f.id===id).flatMap(f=>f.geometry.coordinates.flat());
 const declinationMin=Math.min(...boundaryPoints.map(p=>p[1])),declinationMax=Math.max(...boundaryPoints.map(p=>p[1]));
 if(!Number.isFinite(declinationMin)||!Number.isFinite(declinationMax))throw Error('Missing boundaries '+id);
 const hemisphere=declinationMin<0&&declinationMax>0?'both':declinationMax<=0?'south':'north';
 const points=[...new Map(feature.geometry.coordinates.flat().map(p=>[p.join(','),p])).values()];
 const vectors=points.map(([a,d])=>[Math.cos(d*rad)*Math.cos(a*rad),Math.cos(d*rad)*Math.sin(a*rad),Math.sin(d*rad)]),sum=[0,1,2].map(i=>vectors.reduce((a,v)=>a+v[i],0));const ra=Math.atan2(sum[1],sum[0]),dec=Math.atan2(sum[2],Math.hypot(sum[0],sum[1]));
 function project([a,d]){a*=rad;d*=rad;const delta=a-ra;const den=Math.sin(dec)*Math.sin(d)+Math.cos(dec)*Math.cos(d)*Math.cos(delta);if(den<=.15)return null;return [-Math.cos(d)*Math.sin(delta)/den,-(Math.cos(dec)*Math.sin(d)-Math.sin(dec)*Math.cos(d)*Math.cos(delta))/den];}
 const objectFeatures=(selectedObjects[id]||[]).map(objectId=>{
   const f=(/^M\d+$/.test(objectId)?messier:deepSky).find(f=>f.id===objectId);if(!f)throw Error('Missing deep-sky object '+objectId);
   const [a,d]=f.geometry.coordinates;if(!insideRegion(a,d,id))throw Error('Object outside region '+id+' '+objectId);
   const projected=project([a,d]);if(!projected)throw Error('Object outside projection '+id+' '+objectId);return{f,projected};
 });
 const projected=points.map(project);if(projected.some(x=>!x))throw Error('Field too wide '+id);const framing=[...projected,...objectFeatures.map(o=>o.projected)],xs=framing.map(p=>p[0]),ys=framing.map(p=>p[1]);const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);const scale=Math.min(420/(maxX-minX),290/(maxY-minY));
 const transform=p=>({x:+(300+(p[0]-(minX+maxX)/2)*scale).toFixed(2),y:+(230+(p[1]-(minY+maxY)/2)*scale).toFixed(2)});
 const used=new Set();const main=points.map((point,i)=>{const nearest=stars.reduce((best,s)=>{const p=s.geometry.coordinates;const dra=((p[0]-point[0]+540)%360)-180;const distance=Math.hypot(dra*Math.cos(point[1]*rad),p[1]-point[1]);return distance<best.distance?{s,distance}:best;},{distance:Infinity});if(nearest.distance>.03)throw Error('Missing star '+id+' '+nearest.distance);const s=nearest.s,n=names[s.id]||{};used.add(s.id);return{...transform(projected[i]),hip:s.id,ra:point[0],dec:point[1],mag:s.properties.mag,label:n.name||n.bayer||n.flam||n.desig||'HIP '+s.id};});
 const segments=[];for(const chain of feature.geometry.coordinates)for(let i=1;i<chain.length;i++)segments.push([points.findIndex(p=>p.join(',')===chain[i-1].join(',')),points.findIndex(p=>p.join(',')===chain[i].join(','))]);
 const context=stars.filter(s=>!used.has(s.id)).flatMap(s=>{const p=project(s.geometry.coordinates);if(!p)return[];const xy=transform(p);return xy.x>18&&xy.x<582&&xy.y>28&&xy.y<432?[{...xy,mag:s.properties.mag}]:[]}).sort((a,b)=>a.mag-b.mag).slice(0,80);
 const objects=objectFeatures.map(({f,projected})=>{const alias=messier.includes(f)?f.properties.desig:f.id, n=deepSkyNames[alias]||deepSkyNames[f.id]||{}, type=f.properties.type;
   const kind=['g','s','s0','sd','e','i'].includes(type)?'galaxy':type==='oc'?'open-cluster':type==='gc'?'globular-cluster':type==='pn'?'planetary-nebula':'nebula';
   const magnitude=Number(f.properties.mag);
   return{...transform(projected),id:f.id,name:(n.es||n.name||f.properties.alt||f.id).replace(/\s+/g,' '),kind,ra:f.geometry.coordinates[0],dec:f.geometry.coordinates[1],mag:f.properties.mag===''||!Number.isFinite(magnitude)||magnitude>=90?null:magnitude,label:f.id};
 });
 // Label objects first, then stars; short catalogue IDs keep dense maps readable.
 const occupied=[],marks=[...main,...objects];for(const s of [...objects,...[...main].sort((a,b)=>a.mag-b.mag)]){const width=s.label.length*(s.kind?7:6)+6;let selected;for(const [dx,dy,anchor] of [[14,-12,'start'],[14,24,'start'],[-14,-12,'end'],[-14,24,'end'],[0,-24,'middle'],[0,36,'middle'],[14,-40,'start'],[-14,48,'end']]){const x=s.x+dx,y=s.y+dy,left=anchor==='end'?x-width:anchor==='middle'?x-width/2:x;const box={left,top:y-12,right:left+width,bottom:y+3};if(box.left<7||box.right>593||box.top<8||box.bottom>452)continue;const collision=occupied.some(b=>box.left<b.right+3&&box.right>b.left-3&&box.top<b.bottom+3&&box.bottom>b.top-3)||marks.some(t=>t!==s&&t.x>box.left-10&&t.x<box.right+10&&t.y>box.top-10&&t.y<box.bottom+10);if(!collision){selected={x,y,anchor,box};break;}if(!selected)selected={x,y,anchor,box};}if(!selected)throw Error('Label '+id);s.labelX=+selected.x.toFixed(2);s.labelY=+selected.y.toFixed(2);s.anchor=selected.anchor;occupied.push(selected.box);}
 catalog.push({id,name,latin,hemisphere,declinationMin,declinationMax,tip,stars:main,segments,context,objects});
}
if(catalog.length!==88)throw Error('Expected all 88 IAU constellations');
fs.writeFileSync('src/app/games/constellation-recognition/constellation-catalog.ts','// Curated coordinate/line extract from d3-celestial (Olaf Frohn, BSD-3-Clause).\n// Source and full license: src/assets/licenses/d3-celestial.txt. No runtime dependency.\nimport { Constellation } from "./constellation.model";\nexport const CONSTELLATIONS: readonly Constellation[] = '+JSON.stringify(catalog,null,2)+';\n');
fs.mkdirSync('src/assets/licenses',{recursive:true});fs.copyFileSync(path.join(source,'LICENSE'),'src/assets/licenses/d3-celestial.txt');console.log('Catalog:',catalog.length,'constellations;',catalog.reduce((n,c)=>n+c.stars.length,0),'real named stars');
