const fs=require('node:fs'),path=require('node:path'),ts=require('typescript');
const {inventory}=require('./test-article-navigation.cjs');
const {articleDestinations}=require('./link-problem-concepts.cjs');
const config=require('./content-connections.json');
const read=f=>fs.readFileSync(f,'utf8');
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
const marker=/\n?<!-- content-connections:start -->[^]*?<!-- content-connections:end -->\n?/g;
const clean=s=>s.replace(marker,'\n');
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
function inventoryContent(){
 const info=inventory(),destinations=articleDestinations(),pages=new Map();
 for(const a of info.physical){const route='/articles/'+a.route,html=destinations.get(route);if(!html)throw Error('No template '+route);pages.set(route,{route,title:a.title,file:a.file,html,kind:'article'});}
 for(const file of walk('src/app/problems').filter(f=>f.endsWith('problem.component.ts'))){const p=JSON.parse(read(file).match(/problem: PracticeProblem = ([^]*?);\s*}/)[1]);const route='/problems/'+p.route;pages.set(route,{route,title:p.title,file,html:file.replace(/\.ts$/,'.html'),kind:'problem',number:p.number,problem:p});}
 const gameRouting=read('src/app/games/games-routing.module.ts');
 for(const [slug,g]of Object.entries(config.games)){
  if(!gameRouting.includes("path: '"+slug+"'"))throw Error('Unrouted game '+slug);
  const folder=slug==='2048'?'game-2048':slug==='constellations'?'constellation-recognition':slug==='four-in-a-row'?'four-in-arow':slug;
  const files=walk('src/app/games/'+folder).filter(f=>f.endsWith('.component.ts'));
  if(files.length!==1)throw Error('Ambiguous game component '+slug);
  const file=files[0],template=read(file).match(/templateUrl:\s*['"]([^'"]+)/)[1];
  const route='/games/'+slug;pages.set(route,{route,title:g.title,file,html:path.join(path.dirname(file),template),kind:'game'});
 }
 const actual=[...gameRouting.matchAll(/path:\s*'([^']+)'/g)].map(m=>m[1]).filter(Boolean);
 if(actual.length!==Object.keys(config.games).length||actual.some(s=>!config.games[s]))throw Error('Unreviewed game route');
 return pages;
}
function existingFor(p){
 const source=clean(read(p.html))+'\n'+read(p.file).replace(/\/\/ content-connections:start[^]*?\/\/ content-connections:end/g,'');
 return new Set([...source.matchAll(/["'`](\/(?:articles|problems|games)\/[a-z0-9-]+)(?:#[^"'`]*)?["'`]/g)].map(m=>m[1]));
}
function propose(pages){
 const pairs=new Map();
 function pair(a,b,reason,evidence){if(a===b)throw Error('Self link');for(const r of[a,b])if(!pages.has(r))throw Error('Unknown destination '+r);const key=[a,b].sort().join('|');if(!pairs.has(key))pairs.set(key,{a,b,reason,evidence});}
 for(const[a,b,reason]of config.articlePairs)pair('/articles/'+a,'/articles/'+b,reason,'editorial comparison');
 for(const[slug,g]of Object.entries(config.games))for(const[a,reason]of g.articles)pair('/games/'+slug,'/articles/'+a,reason,'game mechanics and article scope');
 for(const[a,b,reason]of config.gamePairs||[])pair('/games/'+a,'/games/'+b,reason,'board mechanics comparison');
 for(const[number,a,reason]of config.problemPairs){const p=[...pages.values()].find(p=>p.number===number);if(!p)throw Error('Missing problem '+number);pair(p.route,'/articles/'+a,reason,'worked problem '+number);}
 // Each existing problem-to-game resource is an explicit editorial assignment, not a keyword guess.
 for(const p of pages.values())if(p.kind==='problem')for(const resource of p.problem.resources.filter(r=>r.route.startsWith('/games/')))pair(p.route,resource.route,'Relaciona la práctica interactiva con el problema '+p.number+': '+p.title+'.','existing problem resource '+p.number);
 const additions=new Map(),existing=new Map([...pages].map(([r,p])=>[r,existingFor(p)]));
 for(const pair of pairs.values())for(const[from,to]of[[pair.a,pair.b],[pair.b,pair.a]])if(!existing.get(from).has(to)){
  if(!additions.has(from))additions.set(from,[]);additions.get(from).push({route:to,label:(pages.get(to).kind==='problem'?'Problema '+pages.get(to).number+': ':'')+pages.get(to).title,reason:pair.reason,evidence:pair.evidence});
 }
 for(const list of additions.values())list.sort((a,b)=>a.route.localeCompare(b.route));
 return {pairs:[...pairs.values()],additions,existing};
}
function materialize(pages,additions){
 // Shared integration template belongs to three real routes; merge its destinations once.
 const byTemplate=new Map();
 for(const[r,links]of additions){const p=pages.get(r);if(!byTemplate.has(p.html))byTemplate.set(p.html,{p,links:new Map()});for(const l of links)byTemplate.get(p.html).links.set(l.route,l);}
 for(const{p,links:map}of byTemplate.values()){
  const links=[...map.values()];let section;
  if(p.kind==='game'){
   section='<app-content-connections [links]="learningConnections" />';
   let source=read(p.file).replace(/\n[ \t]*\/\/ content-connections:start[^]*?\/\/ content-connections:end\n?/g,'');
   if(!source.includes("import { ContentConnectionsComponent }"))source="import { ContentConnectionsComponent } from '../../shared/content/content-connections/content-connections.component';\n"+source;
   if(!/imports:\s*\[[^\]]*ContentConnectionsComponent/.test(source)){
    const at=source.indexOf('@Component('),tail=source.slice(at);const match=tail.match(/imports:\s*\[/);
    if(match){const i=at+match.index+match[0].length;source=source.slice(0,i)+'ContentConnectionsComponent, '+source.slice(i);}
    else source=source.replace(/standalone:\s*true\s*,/,'standalone: true, imports: [ContentConnectionsComponent],');
   }
   source=source.replace(/(export class \w+[^\{]*\{)\s*/,'$1\n  // content-connections:start\n  readonly learningConnections = '+JSON.stringify(links.map(({route,label,reason})=>({route,label,reason})))+';\n  // content-connections:end\n  ');
   fs.writeFileSync(p.file,source);
  }else{
   // Legacy standalone visualizers did not need RouterLink until they gained related readings.
   let source=read(p.file);
   if(!/RouterLink|RouterModule|LEARNING_IMPORTS/.test(source)){
    source="import { RouterLink } from '@angular/router';\n"+source;
    const at=source.indexOf('@Component('),match=source.slice(at).match(/imports:\s*\[/);
    if(match){const i=at+match.index+match[0].length;source=source.slice(0,i)+'RouterLink, '+source.slice(i);}
    else source=source.replace(/standalone:\s*true\s*,/,'standalone: true, imports: [RouterLink],');
    if(!/imports:\s*\[[^\]]*RouterLink/.test(source))throw Error('RouterLink scope '+p.file);
    fs.writeFileSync(p.file,source);
   }
   const summary=p.kind==='problem'?'Otras conexiones para resolver y ampliar':'Conexiones para seguir aprendiendo';
   section='<section class="'+(p.kind==='problem'?'resources':'article-activities')+'" aria-label="Conexiones relacionadas"><details><summary>'+summary+'</summary><ul>'+links.map(l=>'<li><a routerLink="'+l.route+'">'+esc(l.label)+'</a>. '+esc(l.reason)+'</li>').join('')+'</ul></details></section>';
  }
  let html=clean(read(p.html));const block='\n<!-- content-connections:start -->\n'+section+'\n<!-- content-connections:end -->\n';
  if(p.kind==='problem')html=html.replace(/\s*(<app-problem-navigation)/,block+'  $1');else html=html.trimEnd()+block;
  fs.writeFileSync(p.html,html);
 }
}
function audit(write=false){
 const pages=inventoryContent(),{pairs,additions,existing}=propose(pages);
 if(write)materialize(pages,additions);
 const incomingBefore=new Map([...pages.keys()].map(r=>[r,0])),incomingAfter=new Map(incomingBefore);
 for(const [from,targets]of existing){for(const to of targets)if(to!==from&&pages.has(to))incomingBefore.set(to,incomingBefore.get(to)+1);for(const to of new Set([...targets,...(additions.get(from)||[]).map(l=>l.route)]))if(to!==from&&pages.has(to))incomingAfter.set(to,incomingAfter.get(to)+1);}
 const withoutIncoming=map=>[...map].filter(([,n])=>!n).map(([r])=>r);
 const connectivity={withoutIncomingBefore:withoutIncoming(incomingBefore),withoutIncomingAfter:withoutIncoming(incomingAfter)};
 const counts=kind=>[...pages.values()].filter(p=>p.kind===kind).length;
 const report={date:'2026-10-20',connectivity,scope:{articles:counts('article'),problems:counts('problem'),games:counts('game')},reviewedPairs:pairs.length,newDirectedLinks:[...additions.values()].reduce((s,l)=>s+l.length,0),changedPages:additions.size,pages:[...pages.values()].map(p=>({route:p.route,title:p.title,kind:p.kind,file:p.html.replaceAll('\\','/'),existing:[...existing.get(p.route)].sort(),added:additions.get(p.route)||[]})),pairs};
 if(write){fs.writeFileSync('docs/content-connections-audit.json',JSON.stringify(report,null,2)+'\n');const md='# Revisión transversal de enlaces\n\nFecha: '+report.date+'. Se inventariaron las '+counts('article')+' rutas de artículos, '+counts('problem')+' problemas y '+counts('game')+' juegos registrados. Las tres rutas de integración comparten plantilla y se auditan individualmente.\n\nSe añadieron **'+report.newDirectedLinks+' enlaces dirigidos en '+report.changedPages+' páginas**, a partir de '+pairs.length+' relaciones revisadas con conexión de ida y vuelta. Se omiten destinos ya enlazados y enlaces a la propia página. No se cambian las soluciones ni las reglas de los juegos.\n\n## Cobertura del grafo\n\nAntes había '+connectivity.withoutIncomingBefore.length+' páginas sin enlaces entrantes desde los demás contenidos en este inventario literal. Después queda '+connectivity.withoutIncomingAfter.length+': '+connectivity.withoutIncomingAfter.join(', ')+'. La página técnica Artículo Test se conserva sin recomendaciones editoriales. Esto no cuenta los enlaces del menú como referencias entre contenidos.\n\n## Criterio editorial\n\nSe revisaron las rutas, plantillas, metadatos y recursos explícitos. Se buscaron menciones de conceptos y se contrastó el contexto antes de añadirlas. La coincidencia de palabras no basta: se descartaron, por ejemplo, «puntos interiores» como indicio del teorema de Pick, «criterio de Euler» en recorridos de grafos como enlace al criterio de residuos cuadráticos, y «rama principal» de arcoseno real como enlace a ramas logarítmicas complejas. Tampoco se confunden las simulaciones numéricas con la teoría exacta.\n\nLos juegos reciben lecturas sobre sus mecanismos y enlaces de vuelta a los problemas que ya los recomendaban. Cada conexión añadida explica qué se puede aprender al seguirla. Los artículos y problemas conservan su contenido y muestran las conexiones adicionales en un desplegable. Los juegos reutilizan un componente pequeño con listas explícitas propias. No se genera una lista de recomendaciones en tiempo de ejecución ni se añaden enlaces dentro de fórmulas o controles.\n\nEsta es una revisión de oportunidades concretas; no afirma que todo par de páginas matemáticamente relacionado deba enlazarse. El inventario de enlaces literales es conservador: los enlaces resueltos mediante expresiones dinámicas y componentes hijos pueden no aparecer en el recuento previo.\n\n## Conexiones añadidas\n\n| Origen | Destino | Motivo |\n| --- | --- | --- |\n'+[...additions].flatMap(([from,list])=>list.map(l=>'| ['+pages.get(from).title+']('+from+') | ['+l.label+']('+l.route+') | '+l.reason+' |')).join('\n')+'\n\n## Reproducción\n\n`node scripts/audit-content-connections.cjs` revisa sin escribir. `--write` materializa únicamente las conexiones editoriales de `scripts/content-connections.json` y las devoluciones de recursos de juego explícitos. Los bloques propios se identifican con marcadores; el proceso es idempotente. El detalle por cada ruta está en `content-connections-audit.json`.\n\n## Comprobaciones\n\n- `npm run test:content-connections`: rutas, plantillas Angular, materialización, ausencia de duplicados y enlaces a la propia página, relaciones recíprocas y regeneración idempotente.\n- `npm run test:content-connections:browser`: todos los enlaces nuevos renderizados; paneles y navegación por teclado a 1440, 390 y 320 px en los nueve juegos y ejemplos de artículos y problemas.\n- `npx ng build --configuration development` y `npm run test:budgets`: compilación y presupuestos de producción sin elevar sus límites.\n\nLa comprobación en navegador detectó nueve visualizadores antiguos que precisaban importar RouterLink para activar los enlaces nuevos. Se incorporaron esas importaciones; no se modifican sus cálculos. MathJax se sirve desde una copia local de la misma versión durante la prueba por las restricciones de red.\n';fs.writeFileSync('docs/content-connections-audit.md',md);}
 console.log(JSON.stringify({scope:report.scope,reviewedPairs:pairs.length,newDirectedLinks:report.newDirectedLinks,changedPages:report.changedPages},null,2));return {pages,report,additions};
}
module.exports={audit,inventoryContent,propose,clean};
if(require.main===module)audit(process.argv.includes('--write'));
