const fs=require('node:fs'),assert=require('node:assert/strict'),ts=require('typescript'),path=require('node:path');
const dir='src/app/articles/topology/surreal-numbers/';
function evaluate(file,requireFn){const out={};new Function('exports','require',ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.CommonJS,experimentalDecorators:true}}).outputText)(out,requireFn||(()=>({})));return out;}
const e=evaluate(dir+'surreal-engine.ts');
const p=e.parse,t=e.text,eq=(a,b)=>assert.equal(t(a),t(b));
(async()=>{
 const {parseTemplate}=await import('@angular/compiler');
 for(const file of ['surreal-numbers.component.html','surreal-lab.component.html']){const h=fs.readFileSync(dir+file,'utf8');assert.equal(parseTemplate(h,file).errors,null);assert(!h.includes('\ufffd'));}
 for(let day=0;day<=6;day++){
  const nodes=e.generations(day);assert.equal(nodes.length,2**(day+1)-1);assert.equal(nodes.filter(n=>n.day===day).length,2**day);
  assert.equal(new Set(nodes.map(n=>t(n.value))).size,nodes.length);
  for(const n of nodes){const c=e.canonical(n.value);eq(e.finiteCut(c.left,c.right),n.value);
   const v=n.value,absolute=v.n<0n?-v.n:v.n;const k=v.d.toString(2).length-1;
   const birthday=v.d===1n?Number(absolute):Number((absolute+v.d-1n)/v.d)+k;assert.equal(n.day,birthday,t(v));
  }
 }
 for(const [l,r,v] of [['','','0'],['0','3','1'],['-1','1','0'],['0','1','1/2'],['1/2','3/4','5/8'],['1/3','2/3','1/2'],['-2','-1','-3/2'],['3','','4'],['','-3','-4']])eq(e.finiteCut(e.parseList(l),e.parseList(r)),p(v));
 for(const [l,r]of[['0','0'],['2','1'],['-1','-2']])assert.throws(()=>e.finiteCut(e.parseList(l),e.parseList(r)));
 for(const bad of ['1/0','NaN','ω','0.5','1/-2','1/2/3'])assert.throws(()=>p(bad));
 assert.throws(()=>e.canonical(p('1/3')));assert.throws(()=>e.fromSigns('x'));
 // Exhaustive finite rational intervals: validate both inequalities and earliest possible birthday.
 const nodes=e.generations(5),ordered=[...nodes].sort((a,b)=>e.compare(a.value,b.value));let intervals=0;
 for(let i=0;i<ordered.length;i++)for(let j=i+1;j<ordered.length;j++){
  const l=ordered[i].value,r=ordered[j].value,result=e.simplest(l,r);assert(e.compare(l,result)<0&&e.compare(result,r)<0);
  const witnesses=nodes.filter(n=>e.compare(l,n.value)<0&&e.compare(n.value,r)<0);
  if(witnesses.length){const first=witnesses.reduce((a,b)=>a.day<b.day?a:b);eq(result,first.value);}intervals++;
 }
 const operands=['-2','-1','-1/2','0','1/4','1/2','1','3/2','2'];let calculations=0;
 for(const a of operands)for(const b of operands)for(const op of ['+','*']){
  const x=p(a),y=p(b),trace=e.operation(x,y,op),expected=op==='+'?e.add(x,y):e.multiply(x,y);eq(trace.result,expected);
  assert(trace.left.every(v=>e.compare(v,trace.result)<0));assert(trace.right.every(v=>e.compare(trace.result,v)<0));calculations++;
 }
 let stalks=0;
 for(let length=0;length<=8;length++)for(let bits=0;bits<2**length;bits++){
  const signs=length?bits.toString(2).padStart(length,'0').replace(/0/g,'-').replace(/1/g,'+'):'';
  const value=e.stalkValue(signs);eq(value,e.fromSigns(signs));
  // Cross-check game search against the numeric outcome theorem for BOTH starting players.
  for(const turn of ['+','-'])assert.equal(e.winningPlayer(signs,turn),value.n>0n?'+':value.n<0n?'-':turn==='+'?'-':'+');stalks++;
 }
 const C=evaluate(dir+'surreal-lab.component.ts',name=>name==='./surreal-engine'?e:{Component:()=>c=>c,Input:()=>()=>{},CommonModule:{},FormsModule:{}}).SurrealLabComponent;
 const m=new C();m.presetCut('0','0');assert(m.cutError);m.presetCut('0','3');assert.equal(m.cutResult,'1');assert(!m.cutError);
 for(const target of ['third','root'])for(let precision=1;precision<=12;precision++){
  m.realTarget=target;m.precision=precision;const b=m.realBounds,l=p(b.left),r=p(b.right);assert.equal(t(e.add(r,e.negate(l))),'1/'+(2**precision));
  if(target==='third'){assert(e.compare(l,p('1/3'))<0&&e.compare(p('1/3'),r)<0);}else{assert(e.compare(e.multiply(l,l),p('2'))<0&&e.compare(p('2'),e.multiply(r,r))<0);}
 }
 m.loadStalk('+-+');m.turn='+';m.startGame();m.cutEdge(1);assert.equal(m.board,'+-+','Cannot cut rival colour');m.cutEdge(2);assert.equal(m.board,'+-');assert.equal(m.turn,'-');m.undo();assert.equal(m.board,'+-+');assert.equal(m.turn,'+');
 m.loadStalk('+');m.turn='-';m.startGame();assert(!m.started);assert(m.gameMessage.includes('Gana Azul'));assert.equal(m.board,'+','No-move loss may leave an edge on the board');
 m.reset();assert.equal(m.day,3);assert.equal(m.signValue,'3/4');assert.equal(m.started,false);assert.equal(m.question,0);
 for(let i=0;i<m.questions.length;i++){m.chooseAnswer(m.questions[m.question].correct);assert.equal(m.answer,m.questions[m.question].correct);m.nextQuestion();assert.equal(m.answer,null);}
 for(let i=0;i<m.scalePairs.length;i++){m.pair=i;assert.equal(m.scaleComparison,['>','>','>','>','<','='][i]);}
 const nav=require('./test-article-navigation.cjs').check();assert(nav.links.some(l=>l.route==='surreal-numbers'&&l.groups[0]==='Topología'));
 const html=fs.readFileSync(dir+'surreal-numbers.component.html','utf8');const linked=[...new Set([...html.matchAll(/routerLink="\/articles\/([^"#]+)"/g)].map(m=>m[1]))];
 for(const route of linked){const link=nav.links.find(l=>l.route===route);assert(link,'Missing article '+route);const candidate=nav.components?.find?.(c=>c.route===route);}
 const files=[];function walk(d){for(const f of fs.readdirSync(d,{withFileTypes:true})){const file=path.join(d,f.name);if(f.isDirectory())walk(file);else if(file.endsWith('.component.ts'))files.push(file);}}walk('src/app/articles');
 for(const route of linked){const file=files.find(file=>new RegExp('route\\s*=\\s*[\'"]'+route+'[\'"]').test(fs.readFileSync(file,'utf8')));assert(file);assert(fs.readFileSync(file.replace(/\.ts$/,'.html'),'utf8').includes('routerLink="/articles/surreal-numbers"'),'Missing reciprocal link '+route);}
 for(const id of ['fSmauDxTMeQ','elVQtF6T5Zk','mPn2AdMH7UQ','ZYj4NkeGPdM'])assert.equal(html.split('watch?v='+id).length-1,1);
 assert.equal((html.match(/<app-surreal-lab /g)||[]).length,8);
 console.log('PASS finite birthdays, '+intervals+' exact intervals, '+calculations+' recursive operations, '+stalks+' stalks with both starting players, real brackets, invalid inputs, undo/reset, quiz and symbolic scales.');
 console.log('PASS Angular templates, eight labs, four video references, catalogue integration and '+linked.length+' reciprocal article journeys.');
})().catch(err=>{console.error(err);process.exitCode=1;});
