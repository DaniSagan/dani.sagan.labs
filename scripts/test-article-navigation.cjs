// Evaluate real routing, catalogues and the provider without constructing article labs.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),ts=require('typescript'),assert=require('node:assert/strict');
const cache=new Map();
function load(file) {
 file=path.resolve(file);if(!file.endsWith('.ts'))file+='.ts';
 if(cache.has(file))return cache.get(file);
 const exports={};cache.set(file,exports);
 const source=fs.readFileSync(file,'utf8');
 const tree=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true);
 const resolve=name=>load(name.startsWith('src/')?name:path.resolve(path.dirname(file),name));
 const imported=new Map();
 for(const stmt of tree.statements)if(ts.isImportDeclaration(stmt)&&stmt.importClause?.namedBindings&&ts.isNamedImports(stmt.importClause.namedBindings))for(const item of stmt.importClause.namedBindings.elements)imported.set(item.name.text,{module:stmt.moduleSpecifier.text,name:item.propertyName?.text||item.name.text});
 if(file.endsWith('.component.ts')) {
  for(const node of tree.statements)if(ts.isClassDeclaration(node)&&node.name) {
   const metadata={};
   for(const member of node.members)if(ts.isPropertyDeclaration(member)&&member.modifiers?.some(m=>m.kind===ts.SyntaxKind.StaticKeyword)&&member.name&&['route','title'].includes(member.name.getText(tree))&&member.initializer) {
    const init=member.initializer;
    if(ts.isStringLiteralLike(init))metadata[member.name.getText(tree)]=init.text;
    else if(ts.isPropertyAccessExpression(init)&&ts.isIdentifier(init.expression)&&imported.has(init.expression.text)) {
     const imp=imported.get(init.expression.text);metadata[member.name.getText(tree)]=resolve(imp.module)[imp.name][init.name.text];
    } else throw Error('Unsupported static metadata '+file+': '+init.getText(tree));
   }
   exports[node.name.text]=metadata;
  }
  return exports;
 }
 const mocks={Injectable:()=>c=>c,NgModule:()=>c=>c,RouterModule:{forChild:routes=>({routes})}};
 let input=source;
 if(file.endsWith('articles-routing.module.ts'))input+='\nexport const AUDIT_ROUTES = routes;\n';
 const js=ts.transpileModule(input,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,experimentalDecorators:true}}).outputText;
 vm.runInNewContext(js,{exports,require:name=>name.startsWith('.')||name.startsWith('src/')?resolve(name):mocks,Map,Set,Math,String},{filename:file});
 return exports;
}
function flatten(sections,parents=[]) {
 return sections.flatMap(section=>[
  ...section.items.map(item=>({...item,groups:[...parents,section.name]})),
  ...flatten(section.subsections||[],[...parents,section.name]),
 ]);
}
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
function inventory() {
 const {ArticlesProviderServiceService}=load('src/app/shared/content/articles-provider-service.service.ts');
 const navbar=new ArticlesProviderServiceService().getNavbar();
 const links=flatten(navbar.subsections);
 const routed=load('src/app/articles/articles-routing.module.ts').AUDIT_ROUTES[0].children.filter(r=>r.path&&r.path!=='**'&&!r.redirectTo);
 const byRoute=new Map(links.map(link=>[link.route,link]));
 const routeSet=new Set(routed.map(r=>r.path));
 const missing=routed.filter(r=>!byRoute.has(r.path)).map(r=>({route:r.path,title:r.component?.title||r.path}));
 const stale=links.filter(link=>!routeSet.has(link.route));
 const duplicates=links.filter((link,index)=>links.findIndex(other=>other.route===link.route)!==index);
 const physical=walk('src/app/articles').filter(f=>f.endsWith('.component.ts')).flatMap(file=>Object.values(load(file)).filter(c=>c.route).map(c=>({route:c.route,title:c.title,file})));
 const unregistered=physical.filter(c=>!routeSet.has(c.route));
 return {navbar,links,routed,missing,stale,duplicates,physical,unregistered};
}
function check() {
 const data=inventory();
 assert.equal(data.missing.length,0,'Articles missing from navigation: '+JSON.stringify(data.missing));
 assert.equal(data.stale.length,0,'Navigation links without routes: '+JSON.stringify(data.stale));
 assert.equal(data.duplicates.length,0,'Duplicate menu entries: '+JSON.stringify(data.duplicates));
 assert.equal(data.links.length,data.routed.length,'exact routing/menu parity');
 assert.deepEqual(data.unregistered,[],'article components not registered in routing');
 assert.equal(data.physical.length,data.routed.length,'physical article/routing parity');
 const covariance=data.links.find(l=>l.route==='covariance');
 assert(covariance,'covariance reachable');
 assert.deepEqual(covariance.groups,['Probabilidad','Estadística descriptiva y dependencia']);
 for(const collection of ['probability','fractals','curves','regular-polygons','platonic-solids']) {
  const file='src/app/articles/'+collection+'/'+collection+'-articles.ts';
  const articles=load(file)[collection.replaceAll('-','_').toUpperCase()+'_ARTICLES'];
  for(const a of articles)assert(data.links.some(link=>link.route===a.route&&link.name===a.title),'catalogue title/route '+a.route);
 }
 console.log('PASS '+data.routed.length+' routed articles, '+data.links.length+' unique sidebar links; no missing, stale or duplicate entries; covariance in Probabilidad > Estadística descriptiva y dependencia.');
 return data;
}
module.exports={load,flatten,inventory,check};
if(require.main===module) {
 if(process.argv.includes('--inventory')) {const data=inventory();console.log(JSON.stringify({routed:data.routed.length,links:data.links.length,missing:data.missing,stale:data.stale,duplicates:data.duplicates},null,2));}
 else check();
}
