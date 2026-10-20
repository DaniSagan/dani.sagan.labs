const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {audit,inventoryContent}=require('./audit-content-connections.cjs');
const read=f=>fs.readFileSync(f,'utf8');
(async()=>{
 const {parseTemplate}=await import('@angular/compiler');
 const pages=inventoryContent(),report=JSON.parse(read('docs/content-connections-audit.json'));
 assert.deepEqual(report.scope,Object.fromEntries([['articles','article'],['problems','problem'],['games','game']].map(([key,kind])=>[key,[...pages.values()].filter(p=>p.kind===kind).length])));
 assert.deepEqual(report.connectivity.withoutIncomingAfter,['/articles/test-article']);
 const templates=new Set([...pages.values()].map(p=>p.html));
 for(const f of templates)assert.deepEqual(parseTemplate(read(f),f).errors,null,f);
 const sourceFor=r=>{const p=pages.get(r);return read(p.html)+'\n'+read(p.file);};
 const has=(from,to)=>sourceFor(from).includes('"'+to+'"')||sourceFor(from).includes("'"+to+"'");
 let links=0;
 for(const p of report.pages){
  assert(pages.has(p.route));
  const seen=new Set();for(const l of p.added){assert(pages.has(l.route),'registered target '+l.route);assert.notEqual(p.route,l.route);assert(!seen.has(l.route));seen.add(l.route);assert(!p.existing.includes(l.route),'already linked '+p.route+' '+l.route);assert(l.reason.length>25);assert(!l.reason.includes('?'),'encoding '+l.reason);assert(has(p.route,l.route),'materialized '+p.route+' '+l.route);links++;}
  for(const r of p.existing)assert(pages.has(r),'existing literal destination '+r);
 }
 assert.equal(links,report.newDirectedLinks);
 for(const pair of report.pairs){assert(has(pair.a,pair.b),'forward '+pair.a);assert(has(pair.b,pair.a),'backward '+pair.b);}
 for(const p of pages.values())if(p.kind==='game'){const s=read(p.file);assert(/imports:\s*\[[^\]]*ContentConnectionsComponent/.test(s),'standalone import '+p.route);assert(s.includes('readonly learningConnections ='));assert(read(p.html).includes('app-content-connections'));}
 const files=[...new Set([...pages.values()].flatMap(p=>[p.html,p.file]))].concat(['docs/content-connections-audit.json','docs/content-connections-audit.md']);
 const hash=f=>crypto.createHash('sha256').update(read(f)).digest('hex'),before=new Map(files.map(f=>[f,hash(f)]));audit(true);
 for(const[f,h]of before)assert.equal(hash(f),h,'idempotent '+f);
 const shared=read('src/app/shared/content/content-connections/content-connections.component.ts');const inline=shared.match(/template: `([^]*?)`,/)[1];assert.deepEqual(parseTemplate(inline,'content-connections').errors,null);
 console.log('PASS '+pages.size+' registered pages, '+templates.size+' Angular templates, '+links+' new links, '+report.pairs.length+' reciprocal pairs, all existing literal destinations, standalone game imports and idempotent authoring.');
})().catch(e=>{console.error(e);process.exitCode=1});
