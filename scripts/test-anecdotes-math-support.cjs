const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),ts=require('typescript');
const specs=[['complex-numbers','quaternions-rotations','QuaternionsRotationsComponent'],['algebra','galois-solvability','GaloisSolvabilityComponent'],['number-theory','fermat-wiles-theorem','FermatWilesTheoremComponent'],['geometry','archimedes-sphere-cylinder','ArchimedesSphereCylinderComponent'],['topology','banach-tarski-paradox','BanachTarskiParadoxComponent']];
const models=[],templates=[],close=(a,b)=>assert(Math.abs(a-b)<1e-9,a+' != '+b);
const data=require('./test-article-navigation.cjs').check();
for(const[category,slug,name]of specs){const base='src/app/articles/'+category+'/'+slug+'/'+slug+'.component',source=fs.readFileSync(base+'.ts','utf8'),html=fs.readFileSync(base+'.html','utf8'),out={};
const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,experimentalDecorators:true}}).outputText;
vm.runInNewContext(js,{exports:out,require:()=>({Component:()=>c=>c,LEARNING_IMPORTS:[]})});models.push(new out[name]());templates.push([base,html]);assert(data.links.some(l=>l.route===slug));
for(const m of html.matchAll(/routerLink="\/articles\/([^"]+)"/g))assert(data.links.some(l=>l.route===m[1]),slug+' '+m[1]);
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);
}
const [q,g,f,s,b]=models;
const i=[0,1,0,0],j=[0,0,1,0],k=[0,0,0,1],same=(a,b)=>a.forEach((x,n)=>close(x,b[n]));
same(q.multiply(i,j),k);same(q.multiply(j,i),[0,0,0,-1]);same(q.multiply(i,i),[-1,0,0,0]);same(q.rotate(i,'z',90),j);
for(const axis of ['x','y','z'])for(let angle=-360;angle<=360;angle+=5){const rotated=q.rotate([0,2,-3,5],axis,angle);close(q.norm(rotated),Math.sqrt(38));close(rotated[0],0);close(q.norm(q.quaternion(axis,angle)),1);same(q.rotate(rotated,axis,-angle),[0,2,-3,5]);}
assert.notEqual(JSON.stringify(q.composed),JSON.stringify(q.reversed));
for(const d of [2,3,5,7])for(let a=-3;a<=3;a++)for(let c=-3;c<=3;c++){g.d=d;g.a=a;g.b=c;g.swap=true;close(g.value*g.image,g.norm);close(g.value+g.image,2*a);assert.equal(g.imageB,-c);g.swap=false;close(g.value,g.image);}
for(let n=2;n<=8;n++)for(const bound of [5,10,20,40]){f.exponent=n;f.bound=bound;f.search();const expected=[];for(let x=1;x<=bound;x++)for(let y=x;y<=bound;y++)for(let z=y;z<=bound;z++)if(BigInt(x)**BigInt(n)+BigInt(y)**BigInt(n)===BigInt(z)**BigInt(n))expected.push([x,y,z]);assert.equal(JSON.stringify(f.results),JSON.stringify(expected));if(n>2)assert.equal(f.results.length,0);}
f.exponent=2;f.bound=5;f.search();assert(f.results.some(r=>r.join(',')==='3,4,5'));f.bound=1000;f.search();assert.equal(f.results.length,0);
for(let radius=.5;radius<=3;radius+=.5)for(let level=-20;level<=20;level++){s.radius=radius;s.level=level/20;close(s.sphereSection+s.coneSection,s.cylinderSection);close(s.sphereVolume/s.cylinderVolume,2/3);assert(s.halfWidth>=0&&s.halfWidth<=110);if(Math.abs(level)===20)close(s.sphereSection,0);}
let words=[''];for(let depth=0;depth<=5;depth++){for(const w of words){const reduced=b.reduce(w);assert.equal(b.reduce(reduced),reduced);const inverse=w.split('').reverse().map(c=>b.inverse(c)).join('');assert.equal(b.reduce(w+inverse),'');}const distinct=new Set(words.map(w=>b.reduce(w)));assert.equal(distinct.size,depth?4*3**(depth-1)+[...distinct].filter(w=>w.length<depth).length:1);if(depth<5)words=words.flatMap(w=>b.letters.map(c=>w+c));}
assert.notEqual(b.reduce('ab'),b.reduce('ba'));assert.equal(b.reduce('abBA'),'');assert.equal(b.reduce('abAB'),'abAB');for(let n=0;n<=5;n++){let count=1;for(let k=1;k<=n;k++)count+=4*3**(k-1);assert.equal(b.ballSize(n),count);}for(let n=0;n<30;n++)b.append('a');assert.equal(b.word.length,24);assert.throws(()=>b.reduce('x'));
const {mathjax}=require('mathjax-full/js/mathjax.js'),{TeX}=require('mathjax-full/js/input/tex.js'),{SVG}=require('mathjax-full/js/output/svg.js'),{liteAdaptor}=require('mathjax-full/js/adaptors/liteAdaptor.js'),{RegisterHTMLHandler}=require('mathjax-full/js/handlers/html.js'),{AllPackages}=require('mathjax-full/js/input/tex/AllPackages.js');
const adaptor=liteAdaptor();RegisterHTMLHandler(adaptor);const doc=mathjax.document('',{InputJax:new TeX({packages:AllPackages}),OutputJax:new SVG({fontCache:'none'})});
for(const c of models)for(const tex of Object.values(c.math)){const svg=adaptor.outerHTML(doc.convert(tex,{display:true}));assert(!/data-mml-node="merror"|data-mjx-error/.test(svg),tex);}
import('@angular/compiler').then(({parseTemplate})=>{for(const[base,html]of templates){const result=parseTemplate(html,base+'.html',{enableBlockSyntax:true});assert(!result.errors?.length,result.errors?.join('\n'));}console.log('PASS five support articles: quaternion rotations/inverses/norms, quadratic conjugation, exact finite Fermat search, sphere sections and volumes, free-group reduction/growth; routes, links, TeX and Angular templates.');}).catch(e=>{console.error(e);process.exitCode=1;});
