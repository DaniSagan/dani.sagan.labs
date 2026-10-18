// Static authoring pass. Runtime consumers receive only their own explicit link lists.
const fs=require('node:fs'),path=require('node:path'),ts=require('typescript');
const {articles}=require('./generate-article-foundations.cjs');
const {inventory}=require('./test-article-navigation.cjs');
const {articleDestinations}=require('./link-problem-concepts.cjs');
const aliases=require('./article-concept-aliases.json');
const read=f=>fs.readFileSync(f,'utf8'),write=(f,s)=>{if(read(f)!==s)fs.writeFileSync(f,s);};
const quote=s=>s.replace(/[.*+?^$()|[\]\\]/g,'\\$&');
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const marker='article-concepts';
const removeSection=s=>s.replace(/\n?<!-- article-concepts:start -->[\s\S]*?<!-- article-concepts:end -->\s*/,'\n');
const info=inventory(),routeTitles=new Map(info.links.map(a=>['/articles/'+a.route,a.name]));
const destinations=articleDestinations(),owners=new Map();
for(const [route,file]of destinations){const key=path.normalize(file);if(!owners.has(key))owners.set(key,new Set());owners.get(key).add(route);}
const terms=new Map();
for(const entry of aliases) {
 if(!routeTitles.has(entry.route))throw Error('Unknown concept route '+entry.route);
 for(const term of entry.terms) {
  // A specific editorial entry wins over a catalogue title; all terms remain literal.
  terms.set(term.toLocaleLowerCase('es'),{term,route:entry.route,...(entry.fragment?{fragment:entry.fragment}:{})});
 }
}
const ordered=[...terms.values()].sort((a,b)=>b.term.length-a.term.length);
const expression=new RegExp('(?<![\\p{L}\\p{N}])(?:'+ordered.map(t=>quote(t.term)).join('|')+')(?![\\p{L}\\p{N}])','giu');
function matches(text,exclude=new Set()) {
 const result=new Map();expression.lastIndex=0;
 for(const m of text.matchAll(expression)){const entry=terms.get(m[0].toLocaleLowerCase('es'));if(!exclude.has(entry.route))result.set(entry.term.toLocaleLowerCase('es'),entry);}
 return [...result.values()];
}
const relations=new Map(),evidence=new Map();
function relate(file,links) {
 file=path.normalize(file);if(!relations.has(file))relations.set(file,new Map());
 for(const link of links)relations.get(file).set(link.route+'#'+(link.fragment||''),link);
}
function linkHTML(html,file) {
 html=removeSection(html).replace(/<a data-article-concept="[^"]+"[^>]*>([^<]*)<\/a>/g,'$1');
 const interpolations=[];html=html.replace(/\{\{[\s\S]*?\}\}/g,value=>'\uE000'+(interpolations.push(value)-1)+'\uE001');
 const excluded=owners.get(path.normalize(file))||new Set(),seen=new Set();
 const stack=[],blocked=new Set(['a','h1','h2','h3','h4','h5','h6','button','label','summary','select','option','code','pre','script','style','svg','math','app-formula','textarea']);
 const tokens=html.split(/(<!--[\s\S]*?-->|<(?:[^"'<>]|"[^"]*"|'[^']*')*>)/g);
 let count=0;
 const body=tokens.map(token=>{
  if(token.startsWith('<!--'))return token;
  if(token.startsWith('<')) {
   const close=token.match(/^<\/([\w-]+)/);
   if(close){const index=stack.map(e=>e.tag).lastIndexOf(close[1].toLowerCase());if(index>=0)stack.splice(index);}
   else {const open=token.match(/^<([\w-]+)/);if(open&&!/\/>$/.test(token)&&!['input','br','img','hr','meta','link','source','wbr'].includes(open[1].toLowerCase()))stack.push({tag:open[1].toLowerCase(),skip:blocked.has(open[1].toLowerCase())||/\bclass="[^"]*\breferences\b/.test(token)});}
   return token;
  }
  if(stack.some(e=>e.skip))return token;
  expression.lastIndex=0;
  return token.replace(expression,match=>{
   const entry=terms.get(match.toLocaleLowerCase('es')),key=entry.route+'#'+(entry.fragment||'');
   if(excluded.has(entry.route)||seen.has(key))return match;
   seen.add(key);relate(file,[entry]);count++;
   return '<a data-article-concept="'+entry.route.slice(10)+'" routerLink="'+entry.route+'"'+(entry.fragment?' fragment="'+entry.fragment+'"':'')+'>'+match+'</a>';
  });
 }).join('');
 return {html:body.replace(/\uE000(\d+)\uE001/g,(_,index)=>interpolations[Number(index)]),count};
}
function strings(node) {
 const result=[];
 function visit(n){if(ts.isPropertyAssignment(n)&&n.name.getText().replace(/['"]/g,'')==='conceptLinks')return;if(ts.isStringLiteralLike(n)||ts.isTemplateHead(n)||ts.isTemplateMiddle(n)||ts.isTemplateTail(n))result.push(n.text);ts.forEachChild(n,visit);}
 visit(node);return result.join(' ');
}
function setProperty(source,obj,name,value,edits) {
 const existing=obj.properties.find(p=>p.name?.getText().replace(/['"]/g,'')===name);
 if(existing)edits.push({start:existing.getStart(),end:existing.end,text:name+': '+JSON.stringify(value)});
 else {const last=obj.properties[obj.properties.length-1],comma=last&&!source.slice(last.end,obj.end-1).includes(',')?',':'';edits.push({start:obj.end-1,end:obj.end-1,text:comma+'\n    '+name+': '+JSON.stringify(value)+'\n'});}
}
function applyEdits(source,edits){for(const e of edits.sort((a,b)=>b.start-a.start))source=source.slice(0,e.start)+e.text+source.slice(e.end);return source;}
function dynamicLinks() {
 let total=0;
 const file='src/app/articles/calculus/integration/integration-content.ts',source=read(file),tree=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true),edits=[];
 function visit(node) {
  if(ts.isObjectLiteralExpression(node)&&node.properties.some(p=>p.name?.getText()==='idea')&&node.properties.some(p=>p.name?.getText()==='id')){
   const text=node.properties.filter(p=>['idea','example','caution'].includes(p.name?.getText())).map(p=>strings(p)).join(' ');
   const links=matches(text,new Set(['/articles/integration-classical','/articles/integration-advanced','/articles/integration-numerical']));
   setProperty(source,node,'conceptLinks',links,edits);total+=links.length;relate('src/app/articles/calculus/integration/integration-article.component.html',links);
  }ts.forEachChild(node,visit);
 }visit(tree);write(file,applyEdits(source,edits));
 const deep='src/app/articles/shared/deep-explorer-model.ts',ds=read(deep),dt=ts.createSourceFile(deep,ds,ts.ScriptTarget.Latest,true),byTopic=new Map(),changes=[];
 function cases(node){if(ts.isCaseClause(node)&&ts.isStringLiteral(node.expression)){const text=node.statements.flatMap(stmt=>{const values=[];function v(n){if(ts.isBinaryExpression(n)&&n.left.getText(dt)==='result.explanation')values.push(strings(n.right));ts.forEachChild(n,v);}v(stmt);return values;}).join(' ');byTopic.set(node.expression.text,matches(text,new Set(['/articles/'+node.expression.text])));}ts.forEachChild(node,cases);}cases(dt);
 function configs(node){if(ts.isVariableDeclaration(node)&&node.name.getText(dt)==='EXPLORER_CONFIGS'&&ts.isObjectLiteralExpression(node.initializer))for(const p of node.initializer.properties){if(ts.isPropertyAssignment(p)&&ts.isObjectLiteralExpression(p.initializer)){const key=p.name.getText(dt).replace(/['"]/g,''),links=byTopic.get(key)||[];setProperty(ds,p.initializer,'conceptLinks',links,changes);total+=links.length;}}ts.forEachChild(node,configs);}configs(dt);write(deep,applyEdits(ds,changes));
 for(const a of articles) {
  const f='src/app/articles/'+a.area+'/'+a.slug+'/'+a.slug+'-article.component.ts',s=read(f),tree=ts.createSourceFile(f,s,ts.ScriptTarget.Latest,true);
  let text='';function get(n){if(ts.isMethodDeclaration(n)&&n.name.getText(tree)==='calculate')text=strings(n);ts.forEachChild(n,get);}get(tree);
  const links=matches(text,new Set(['/articles/'+a.slug]));total+=links.length;
  write(f,s.replace(/\/\/ concept-links:start[\s\S]*?\/\/ concept-links:end/,'// concept-links:start\n  readonly conceptLinks: readonly TextLink[] = '+JSON.stringify(links)+';\n  // concept-links:end'));
  relate(f.replace(/\.ts$/,'.html'),links);
 }
 return total;
}
function oldEvidence() {
 const report=read('docs/missing-mathematical-concepts.md');
 const idToArticle=new Map(articles.flatMap(a=>a.ids.map(id=>[id,{route:'/articles/'+a.slug,term:a.title}])));idToArticle.set('M67',{route:'/articles/graph-foundations',term:'Grafos desde cero'});
 for(const row of report.split('\n').filter(r=>/^\| M\d+ \|/.test(r))) {
  const id=row.match(/^\| (M\d+)/)[1],destination=idToArticle.get(id);if(!destination)throw Error('Unresolved audited topic '+id);
  const files=[...row.matchAll(/\.\.\/(src\/[^)#]+)(?:#L(\d+))?/g)];
  for(const match of files){let f=match[1];if(!fs.existsSync(f))throw Error('Stale editorial evidence '+f);if(f.endsWith('integration-content.ts'))f='src/app/articles/calculus/integration/integration-article.component.html';if(f.endsWith('.ts')){const template=read(f).match(/templateUrl:\s*['"]([^'"]+)/)?.[1];if(template)f=path.join(path.dirname(f),template);}
   if(f.endsWith('.html'))relate(f,[destination]);
  }
  evidence.set(id,{...destination,sources:files.map(m=>m[1])});
 }
}
function run(){
 let inline=0; const pendingHTML=new Map();
 const files=[...new Set(destinations.values())];
 for(const file of files){const r=linkHTML(read(file),file);inline+=r.count;pendingHTML.set(file,r.html);}
 const dynamic=dynamicLinks();oldEvidence();
 const incoming=new Map();
 for(const [file,links]of relations)for(const link of links.values()) {
  if(!incoming.has(link.route))incoming.set(link.route,new Set());
  for(const owner of owners.get(file)||[])if(owner!==link.route)incoming.get(link.route).add(owner);
 }
 const fresh=new Set(articles.map(a=>'/articles/'+a.slug));
 for(const file of files) {
  const key=path.normalize(file),own=owners.get(key)||new Set();
  const related=[...(relations.get(key)||new Map()).values()].filter(l=>!own.has(l.route));
  let section='';
  if(related.length)section+='<section class="article-activities"><details><summary>Conceptos para repasar y ampliar</summary><ul>'+related.map(l=>'<li><a routerLink="'+l.route+'"'+(l.fragment?' fragment="'+l.fragment+'"':'')+'>'+esc(routeTitles.get(l.route))+'</a></li>').join('')+'</ul></details></section>\n';
  for(const route of own)if(fresh.has(route)&&incoming.get(route)?.size)section+='<section class="article-activities"><details><summary>Artículos que utilizan estos conceptos</summary><ul>'+[...incoming.get(route)].sort().map(r=>'<li><a routerLink="'+r+'">'+esc(routeTitles.get(r))+'</a></li>').join('')+'</ul></details></section>\n';
  const html=pendingHTML.get(file).trimEnd();
  write(file,html+(section?'\n<!-- article-concepts:start -->\n'+section+'<!-- article-concepts:end -->':'')+'\n');
 }
 const report={
  date:'2026-10-18',routedArticles:info.routed.length,newArticles:articles.length,templates:files.length,inlineLinks:inline,dynamicLinks:dynamic,
  editorialAliases:terms.size,coverage:[...evidence].map(([id,entry])=>({id,...entry})),
  articles:articles.map(a=>({route:a.slug,title:a.title,ids:a.ids,incoming:[...(incoming.get('/articles/'+a.slug)||[])].sort()}))
 };
 fs.writeFileSync('docs/article-concept-coverage.json',JSON.stringify(report,null,2)+'\n');
 const md='# Revisión de conceptos y enlaces entre artículos\n\nRevisión del 18 de octubre de 2026. Se recorren las '+report.routedArticles+' rutas de artículos y sus plantillas, incluidos los tres capítulos de integración y textos dinámicos de laboratorios.\n\n'+
 '**Resultado:** '+articles.length+' artículos nuevos e independientes, '+inline+' enlaces de conceptos en texto estático y '+dynamic+' asociaciones explícitas para texto dinámico. Se conserva el contenido matemático de los artículos anteriores y no se insertan enlaces dentro de fórmulas, encabezados, controles, código, bibliografías o enlaces existentes.\n\n'+
 'Los 94 temas de la auditoría anterior tienen un destino. Se agrupan conceptos estrechamente relacionados cuando comparten fundamentos; M67 reutiliza el artículo de grafos ya existente. Los términos ambiguos (por ejemplo Cauchy, Euler, grado, norma, anillo o nodo aislados) no se enlazan por coincidencia ciega. La selección es editorial: no presupone que cualquier palabra matemática necesite una página propia.\n\n'+
 '## Destinos de la auditoría anterior\n\n| Tema | Destino |\n| --- | --- |\n'+[...evidence].map(([id,e])=>'| '+id+' | ['+routeTitles.get(e.route)+']('+e.route+') |').join('\n')+
 '\n\n## Artículos incorporados\n\n| Artículo | Temas previos | Referencias entrantes |\n| --- | --- | --- |\n'+report.articles.map(a=>'| ['+a.title+'](/articles/'+a.route+') | '+a.ids.join(', ')+' | '+a.incoming.length+' |').join('\n')+
 '\n\n## Estructura y mantenimiento\n\nCada artículo nuevo posee componente, plantilla, estilos, estado y cálculo del laboratorio. Reutiliza infraestructura general de fórmulas y gráficas. La herramienta de autoría en scripts/article-foundations no es un registro de ejecución. El menú y las rutas usan los catálogos temáticos existentes.\n\nLos enlaces de texto dinámico usan un componente genérico que recibe texto y una lista explícita de destinos del consumidor; no interpreta HTML ni consulta un glosario global. Se conservan los modelos independientes de los artículos.\n\nValidación: npm run test:article-concepts, npm run test:article-navigation, compilación de desarrollo y npm run test:article-concepts:browser. El detalle legible por máquina está en article-concept-coverage.json.\n';
 fs.writeFileSync('docs/article-concepts-audit.md',md);
 console.log('Linked '+inline+' static mentions and '+dynamic+' dynamic associations across '+files.length+' templates. Covered '+evidence.size+' prior topics with '+articles.length+' new articles.');
 return report;
}
module.exports={run,matches,linkHTML};
if(require.main===module)run();
