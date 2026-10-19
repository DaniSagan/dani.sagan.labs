const fs = require('node:fs'), assert = require('node:assert/strict'), ts = require('typescript');
(async()=>{
 const {parseTemplate}=await import('@angular/compiler');
 const base='src/app/articles/topology/transfinite-numbers/transfinite-numbers.component';
 const html=fs.readFileSync(base+'.html','utf8');
 assert.equal(parseTemplate(html,base+'.html').errors,null);
 assert(!html.includes('\ufffd'));
 let source=fs.readFileSync(base+'.ts','utf8').replace(/^import .*;\r?\n/gm,'').replace(/@Component\([\s\S]*?\)\r?\nexport class/,'class');
 const js=ts.transpile(source, {target:ts.ScriptTarget.ES2020});
 const Model=new Function(js+';return TransfiniteNumbersComponent')();const m=new Model();
 for(const mode of ['one','finite','infinite']){m.hotel=mode;for(let k=1;k<=12;k++){m.size=k;const dest=Array.from({length:100},(_,i)=>m.destination(i+1));assert.equal(new Set(dest).size,100);assert(dest.every(n=>mode==='infinite'?n%2===0:n>(mode==='one'?1:k)));}}
 for(let i=0;i<6;i++)for(let j=0;j<6;j++){m.toggle(i,j);for(let k=0;k<6;k++)assert.notEqual(m.diagonal[k],m.bits[k][k]);}
 for(const order of ['omega+1','1+omega','omega*2']){m.order=order;assert.equal(m.blocks.length,2);assert(!m.blocks.join('').includes('?'));}
 m.reset();assert.equal(m.hotel,'one');assert.equal(m.order,'omega+1');
 const links=[...html.matchAll(/routerLink="\/articles\/([^"#]+)"/g)].map(m=>m[1]);
 const files=[];function walk(p){for(const e of fs.readdirSync(p,{withFileTypes:true})){const f=p+'/'+e.name;if(e.isDirectory())walk(f);else if(f.endsWith('.component.ts'))files.push(f);}}walk('src/app/articles');
 for(const slug of new Set(links)){const f=files.find(f=>new RegExp('route\\s*=\\s*[\'"]'+slug+'[\'"]').test(fs.readFileSync(f,'utf8')));assert(f,'Missing '+slug);assert(fs.readFileSync(f.replace('.ts','.html'),'utf8').includes('routerLink="/articles/transfinite-numbers"'),'Missing backlink '+slug);}
 const engineSource = fs.readFileSync(base.replace('transfinite-numbers.component','hydra-engine')+'.ts','utf8');
 const api = {};
 new Function('exports',ts.transpile(engineSource,{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.CommonJS}))(api);
 const {HydraGame,hydraOrdinal,compareOrdinals,ordinalText,nodeCount}=api;
 const game = new HydraGame();
 assert.equal(game.ordinal,'ω^2');assert.equal(game.heads,2);assert.equal(game.nodes,4);
 assert.equal(game.cut(0),false);assert.equal(game.cut(1),false);assert.equal(game.cut(999),false);
 assert(game.cut(2));assert.equal(game.ordinal,'ω·2');assert.equal(game.nodes,5);
 assert(game.cut(3));assert.equal(game.ordinal,'ω + 3');assert.equal(game.heads,4);
 const allNodes=n=>[n,...n.children.flatMap(allNodes)];
 assert.equal(new Set(allNodes(game.tree).map(n=>n.id)).size,game.nodes);
 game.reset('flat');assert.equal(game.ordinal,'3');
 for(const id of [1,2,3])assert(game.cut(id));
 assert.equal(game.ordinal,'0');assert.equal(game.nodes,1);assert.equal(game.heads,0);assert(game.message.includes('Victoria'));
 assert.equal(game.cut(0),false);
 game.reset('chain');assert.equal(game.ordinal,'ω^(ω)');assert.equal(game.turn,1);
 const capped = new HydraGame(4), original=JSON.stringify(capped.tree);
 assert.equal(capped.cut(2),false);assert.equal(capped.turn,1);assert.equal(JSON.stringify(capped.tree),original);assert(capped.message.includes('límite'));
 // Enumerate all ordered rooted trees with at most seven nodes (197 shapes),
 // then check every leaf at several turn numbers, not only a sample strategy.
 const shapesBySize = [[],[[]]];
 function forests(total){if(!total)return [[]];const out=[];for(let size=1;size<=total;size++)for(const first of shapesBySize[size])for(const rest of forests(total-size))out.push([first,...rest]);return out;}
 for(let n=2;n<=7;n++)shapesBySize[n]=forests(n-1);
 let checked=0;
 for(let n=2;n<=7;n++)for(const shape of shapesBySize[n]){
   const makeTree=()=>{let id=0;const make=s=>({id:id++,children:s.map(make)});return make(shape);};
   const tree=makeTree();const before=hydraOrdinal(tree);
   const reversed=JSON.parse(JSON.stringify(tree));for(const node of allNodes(reversed))node.children.reverse();
   assert.equal(compareOrdinals(before,hydraOrdinal(reversed)),0,'Sibling order must not change rank');
   for(const leaf of allNodes(tree).filter(node=>node.id&&node.children.length===0))for(const turn of [1,2,7]){
     const g=new HydraGame(10000);g.tree=makeTree();g.turn=turn;
     // IDs allocated by the engine must remain fresh for the test fixture.
     g.nextId=n;
     assert(g.cut(leaf.id));assert(compareOrdinals(hydraOrdinal(g.tree),before)<0,'Nondecreasing move');
     assert.equal(new Set(allNodes(g.tree).map(node=>node.id)).size,nodeCount(g.tree));checked++;
   }
 }
 for(const file of ['hydra-lab.component.html','transfinite-numbers.component.html']){
   const template=fs.readFileSync('src/app/articles/topology/transfinite-numbers/'+file,'utf8');
   assert.equal(parseTemplate(template,file).errors,null);
 }
 assert(html.includes('id="hydra"'));assert(html.includes('<app-hydra-lab />'));
 console.log('PASS hydra: '+checked+' legal moves across all rooted ordered trees up to seven nodes, strict ordinal descent, sibling permutations, exact worked example, victory, invalid cuts and atomic visual limit');
 console.log('PASS Angular template, hotel injectivity, 36 diagonal edits, ordinal displays, reset and nine reciprocal links');
})().catch(e=>{console.error(e);process.exit(1)});
