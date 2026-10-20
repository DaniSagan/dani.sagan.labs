const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const report=JSON.parse(fs.readFileSync('docs/anecdotes-collection-audit.json','utf8')),data=require('./test-article-navigation.cjs').check();
const images=JSON.parse(fs.readFileSync('src/assets/images/anecdotes/SOURCES.json','utf8'));
async function main(){const {parseTemplate}=await import('@angular/compiler');const titles=new Set(),routes=new Set();
for(const a of report.articles){
 const base='src/app/articles/anecdotes/'+a.route+'/'+a.route+'.component',html=fs.readFileSync(base+'.html','utf8'),ts=fs.readFileSync(base+'.ts','utf8'),css=fs.readFileSync(base+'.css','utf8');
 assert(!titles.has(a.title)&&!routes.has(a.route));titles.add(a.title);routes.add(a.route);
 const story=html.match(/<div class="narrative">([\s\S]*?)<\/div>/)?.[1];assert(story,a.id+' narrative');
 const words=story.replace(/<[^>]*>/g,' ').trim().split(/\s+/).length;assert(words>=200&&words<=400,a.id+' '+words);assert.equal(words,a.words);
 assert(!/app-formula|math-lab|input|canvas|<svg|<table|ngModel|app-learning-plot/.test(story));
 assert(!/extends |service|from '\.\./.test(ts.replace(/styleUrls:[\s\S]*?\]/,'')),a.id+' independence');
 const imports=[...ts.matchAll(/from '([^']+)'/g)].map(m=>m[1]);assert(imports.every(i=>i.startsWith('@angular/')));
 assert(css.length<6000);const parsed=parseTemplate(html,base+'.html',{enableBlockSyntax:true});assert(!parsed.errors?.length,parsed.errors?.join('\n'));
 assert(data.links.some(l=>l.route===a.route&&l.groups[0]==='An\u00e9cdotas matem\u00e1ticas'));
 for(const m of html.matchAll(/routerLink="\/articles\/([^"]+)"/g))assert(data.links.some(l=>l.route===m[1]),a.id+' '+m[1]);
 assert(a.sources.length>0);
 for(const img of html.matchAll(/<img ([^>]+)>/g)){const attrs=img[1],src=attrs.match(/src="([^"]+)"/)?.[1];assert(src&&fs.existsSync('src/'+src));assert(/alt="[^"]+"/.test(attrs));assert(/width="\d+"/.test(attrs)&&/height="\d+"/.test(attrs));assert(attrs.includes('loading="lazy"'));assert(fs.statSync('src/'+src).size<=450000);const record=images[a.image];assert(record?.visualReview&&record.license&&record.author&&record.source);}
 a.staticValidation='passed';a.status=a.browserValidation?'implemented; static and browser checks passed':'implemented; static checks passed; browser pending';
}
const allStories=require('./test-article-navigation.cjs').load('src/app/articles/anecdotes/anecdotes-articles.ts').ANECDOTES_ARTICLES;
assert.equal(allStories.length,60,'Expected 60 anecdotes');
assert.equal(report.articles.filter(a=>a.id.startsWith('C')).length,20,'Expected 20 new independent stories');
for(const [category,route] of [['combinatorics','nash-equilibrium'],['number-theory','classical-cryptography']]) {
 const file='src/app/articles/'+category+'/'+route+'/'+route+'-article.component.html';
 const html=fs.readFileSync(file,'utf8');
 assert(!parseTemplate(html,file,{enableBlockSyntax:true}).errors?.length,file+' Angular template');
 for(const m of html.matchAll(/routerLink="\/articles\/([^"]+)"/g))assert(data.links.some(l=>l.route===m[1]),file+' '+m[1]);
 assert(html.includes('<details')&&html.includes('Solución razonada'),file+' worked exercise');
 assert(html.includes('class="references"'),file+' references');
}
assert(data.links.some(l=>l.route==='nash-equilibrium'&&l.groups.includes('Teoría de juegos')));
assert(data.links.some(l=>l.route==='classical-cryptography'&&l.groups.includes('Métodos aritméticos y criptografía')));
assert(data.links.some(l=>l.route==='nash-equilibrium'&&l.groups.includes('Teoría de juegos')));
assert(data.links.some(l=>l.route==='classical-cryptography'&&l.groups.includes('Métodos aritméticos y criptografía')));
console.log('PASS 60 catalogue entries, 20 new stories and both mathematical support pages.');
fs.writeFileSync('docs/anecdotes-collection-audit.json',JSON.stringify(report,null,2)+'\n');
console.log('PASS '+report.articles.length+' independent anecdotes: 200-400 narrative words, no widgets, unique metadata, sources, valid links, Angular templates, licensed local images and complete catalogue parity.');
}
main().catch(e=>{console.error(e);process.exitCode=1;});
