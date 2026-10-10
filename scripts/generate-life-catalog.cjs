const fs=require('fs'),zlib=require('zlib'),crypto=require('crypto');
const io=require('../src/assets/game-of-life/life-io.js');
function entries(zip){const b=fs.readFileSync(zip);let end=b.length-22;while(b.readUInt32LE(end)!==0x06054b50)end--;let p=b.readUInt32LE(end+16),out=[];for(let i=0;i<b.readUInt16LE(end+10);i++){const size=b.readUInt16LE(p+28),ex=b.readUInt16LE(p+30),comment=b.readUInt16LE(p+32),method=b.readUInt16LE(p+10),compressed=b.readUInt32LE(p+20),offset=b.readUInt32LE(p+42),name=b.subarray(p+46,p+46+size).toString();out.push({name,read(){const start=offset+30+b.readUInt16LE(offset+26)+b.readUInt16LE(offset+28);const data=b.subarray(start,start+compressed);return(method===8?zlib.inflateRawSync(data):data).toString('utf8');}});p+=46+size+ex+comment;}return out;}
const curated=new Map(fs.readFileSync('scripts/data/life-curated.tsv','utf8').replace(/^\uFEFF/,'').trim().split(/\r?\n/).map((line,index)=>{const[id,title,category,description,exponent]=line.split('|');return[id,{title,category,description,exponent:Number(exponent),order:index}];}));
const records=new Map(),skipped=[];
const zipEntries=entries('tmp/lifewiki-catalog.zip').filter(e=>e.name.includes('/lifewiki/')&&e.name.endsWith('.rle'));
const extras=entries('tmp/life-patterns.zip').filter(e=>e.name.includes('/examples/')&&e.name.endsWith('.rle'));
function categorize(id,comments){const t=(id+' '+comments).toLowerCase();if(/synth|reaction|collision/.test(t))return'Síntesis y reacciones';if(/gun|cañón/.test(t))return'Cañones';if(/breeder|growth|spacefiller|sawtooth|hotel/.test(t))return'Crecimiento';if(/rake|puffer|engine/.test(t))return'Rastrillos y locomotoras';if(/reflect|turing|logic|computer|snark|gate|adder/.test(t))return'Lógica y construcciones';if(/methuselah|lifespan|diehard/.test(t))return'Matusalenes';if(/spaceship|ship|c\//.test(t))return'Naves';if(/oscillat|period[- ]|\bp\d+\b/.test(t))return'Osciladores';if(/still.life/.test(t))return'Naturalezas muertas';return'Otras construcciones';}
for(const entry of [...zipEntries,...extras]){
 const id=entry.name.split('/').pop().slice(0,-4);if(records.has(id))continue;
 const text=entry.read().replace(/^\uFEFF/,'');
 try{
  const parsed=io.parseRle(text),c=curated.get(id);
  const comments=text.split(/\r?\n/).filter(l=>/^#[CD]\s/.test(l)).map(l=>l.slice(3).trim()).join(' ');
  const title=(/^#N\s+(.+)$/m.exec(text)||[])[1]||id;
  const author=(/^#O\s+(.+)$/m.exec(text)||[])[1]||'';
  records.set(id,{id,title:c?.title||title.trim(),category:c?.category||categorize(id,comments),description:c?.description||comments.slice(0,280)||'Explora este patrón del archivo de LifeWiki y observa su evolución.',author:author.trim(),width:parsed.width,height:parsed.height,population:parsed.xs.length,featured:!!c,exponent:c?.exponent||0,source:'https://conwaylife.com/patterns/'+id+'.rle',text,order:c?.order??10000});
 }catch(error){skipped.push({id,reason:error.message});}
}
const all=[...records.values()].sort((a,b)=>a.order-b.order||a.title.localeCompare(b.title));
const root='src/assets/game-of-life';fs.mkdirSync(root+'/patterns',{recursive:true});
const index=[];
for(let i=0;i<all.length;i+=80){const chunkName='patterns/'+String(i/80).padStart(3,'0')+'.json',chunk={};for(const record of all.slice(i,i+80)){chunk[record.id]=record.text;const{text,order,...meta}=record;index.push({...meta,file:chunkName});}fs.writeFileSync(root+'/'+chunkName,JSON.stringify(chunk));}
fs.writeFileSync(root+'/catalog.json',JSON.stringify({version:1,collection:'LifeWiki · copia archivada en 2023 y ejemplos de copy/life',source:'https://github.com/cobyj33/llcacodec-test-data',count:index.length,patterns:index}));
fs.writeFileSync(root+'/catalog-report.json',JSON.stringify({included:index.length,featured:index.filter(p=>p.featured).length,archiveRleFiles:zipEntries.length,excluded:skipped,missingFeatured:[...curated.keys()].filter(id=>!records.has(id)),sha256:crypto.createHash('sha256').update(fs.readFileSync('tmp/lifewiki-catalog.zip')).digest('hex')},null,2));
console.log(JSON.stringify({included:index.length,featured:index.filter(p=>p.featured).length,excluded:skipped.length,missingFeatured:[...curated.keys()].filter(id=>!records.has(id)),assetBytes:all.reduce((s,p)=>s+Buffer.byteLength(p.text),0)},null,2));
