// Real Chrome integration/visual audit; run after a development build.
const fs = require('node:fs'), path = require('node:path'), os = require('node:os'), http = require('node:http');
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict'), WebSocket = require('ws');
const dist = path.resolve('dist/dani.sagan.labs/browser');
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'danisagan-problem-concepts-audit-'));
const pause = ms => new Promise(r => setTimeout(r, ms));
let server, browser, socket;
const watchdog = setTimeout(() => { console.error('Audit timeout'); process.exit(1); }, 600000);
async function main() {
  const mime = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.woff2': 'font/woff2', '.woff': 'font/woff', '.svg': 'image/svg+xml' };
  server = http.createServer((req, res) => { let f = path.resolve(dist, '.' + new URL(req.url, 'http://localhost').pathname); if (!f.startsWith(dist + path.sep) || !fs.existsSync(f) || !fs.statSync(f).isFile()) f = path.join(dist, 'index.html'); res.setHeader('Content-Type', mime[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(res); });
  await new Promise(r => server.listen(0, '127.0.0.1', r)); const origin = `http://127.0.0.1:${server.address().port}`;
  browser = spawn(process.env.CHROME_BIN || 'C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--no-sandbox', '--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--no-first-run', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
  let port; for (let i = 0; i < 120; i++) { const f = path.join(profile, 'DevToolsActivePort'); if (fs.existsSync(f)) { port = fs.readFileSync(f, 'utf8').split('\n')[0]; break; } await pause(100); }
  assert(port); const tabs = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  socket = new WebSocket(tabs.find(x => x.type === 'page').webSocketDebuggerUrl); await new Promise(r => socket.on('open', r));
  let id = 0; const pending = new Map(), errors = [];
  socket.on('message', raw => { const m = JSON.parse(raw); if (m.id) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.reject(Error(m.error.message)) : p.resolve(m.result); } else if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text) });
  const call = (method, params = {}) => new Promise((resolve, reject) => { const n = ++id; pending.set(n, { resolve, reject }); socket.send(JSON.stringify({ id: n, method, params })); });
  const evaluate = async expression => { const r = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (r.exceptionDetails) throw Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text); return r.result.value; };
  await call('Page.enable'); await call('Runtime.enable'); await call('Network.enable');
  // Serve the installed MathJax 3.2.2 files for the CDN requests in this audit.
  // The application configuration is unchanged; validation is network independent.
  const mathjaxRoot = path.resolve('node_modules/mathjax-full/es5');
  socket.on('message', async raw => {
    const m = JSON.parse(raw);
    if (m.method !== 'Fetch.requestPaused') return;
    try {
      const relative = new URL(m.params.request.url).pathname.split('/es5/')[1];
      const file = path.resolve(mathjaxRoot,relative || 'startup.js');
      if (!file.startsWith(mathjaxRoot+path.sep) || !fs.existsSync(file)) throw Error('Unexpected MathJax asset '+file);
      await call('Fetch.fulfillRequest',{requestId:m.params.requestId,responseCode:200,responseHeaders:[{name:'Content-Type',value:'application/javascript'}],body:fs.readFileSync(file).toString('base64')});
    } catch(error) { errors.push(error.message); await call('Fetch.failRequest',{requestId:m.params.requestId,errorReason:'Failed'}); }
  });
  await call('Fetch.enable',{patterns:[{urlPattern:'https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/*',requestStage:'Request'}]});


  const {concepts,problems:assignments}=require('./problem-concepts.json');
  const routes=require('./problem-routes.cjs');
  const shots=path.resolve('tmp/problem-concepts-audit');fs.mkdirSync(shots,{recursive:true});
  const waitFor=async(expression,label)=>{for(let i=0;i<150;i++){if(await evaluate(expression))return;await pause(100);}throw Error('Timed out '+label+' '+await evaluate('location.href'));};
  const navigate=async route=>{await call('Page.navigate',{url:origin+route});};
  const ready=async selector=>waitFor('!!document.querySelector('+JSON.stringify(selector)+')',selector);
  const setRange=async(selector,value)=>{await evaluate('(()=>{const e=document.querySelector('+JSON.stringify(selector)+');e.value='+JSON.stringify(String(value))+';e.dispatchEvent(new Event("input",{bubbles:true}));})()');await pause(120);};
  const setSelect=async(selector,index)=>{await evaluate('(()=>{const e=document.querySelector('+JSON.stringify(selector)+');e.value=e.options['+index+'].value;e.dispatchEvent(new Event("change",{bubbles:true}));})()');await pause(150);};
  const checkPage=async(label,width)=>{
    await call('Emulation.setDeviceMetricsOverride',{width,height:950,deviceScaleFactor:1,mobile:width<600});await pause(600);
    const state=await evaluate('({width:innerWidth,scroll:document.documentElement.scrollWidth,mathErrors:document.querySelectorAll("mjx-merror,[data-mml-node=merror]").length})');
    if(state.scroll>width){console.log(await evaluate('Array.from(document.querySelectorAll("body *")).map(e=>({tag:e.tagName,cls:e.className,text:e.textContent.slice(0,70),right:e.getBoundingClientRect().right,width:e.getBoundingClientRect().width,scroll:e.scrollWidth,client:e.clientWidth})).filter(e=>e.right>'+width+'&&e.width>50).slice(-18)'));const shot=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(shots,'overflow.png'),Buffer.from(shot.data,'base64'));}
    assert(state.scroll<=width,'overflow '+label+' '+width+': '+JSON.stringify(state));assert.equal(state.mathErrors,0,'TeX '+label);
  };
  await call('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  await navigate('/problems');await waitFor('document.querySelectorAll(".problem-card").length===200','catalogue');
  const cardLinks=await evaluate('Array.from(document.querySelectorAll(".problem-card")).map(e=>e.getAttribute("href"))');
  for(const route of routes)assert(cardLinks.includes('/problems/'+route),'canonical catalogue '+route);
  const numbers=process.env.PROBLEM_NUMBERS?process.env.PROBLEM_NUMBERS.split(",").map(Number):[1,11,12,13,14,15,20,41,45,60,73,83,91,95,100,118,124,129,133,146,153,163,169,173,179,186,190,196,198,199,200];
  for(const n of numbers) {
    await navigate('/problems/'+routes[n-1]);await ready('.solution');
    await ready('.prerequisites details summary');
    await evaluate('document.querySelector(".prerequisites summary").click()');
    assert(await evaluate('document.querySelector(".prerequisites details").open'),'open prerequisites '+n);
    const links=await evaluate('Array.from(document.querySelectorAll(".prerequisites a")).map(a=>a.getAttribute("href"))');
    for(const key of assignments[n].filter(k=>concepts[k].route.startsWith('/articles/'))) {
      const c=concepts[key];assert(links.includes(c.route+(c.fragment?'#'+c.fragment:'')),'prerequisite href '+n+' '+key);
    }
    await checkPage('problem '+n,390);
    if([11,12,73,118,173,198].includes(n))await checkPage('problem '+n,320);
  }
  // Follow ordinary user links to their precise sections, then return via the article's practice links.
  for(const [n,key]of[[11,'factor'],[11,'monic'],[11,'ruffini'],[12,'discriminant'],[12,'vieta'],[13,'poly-division'],[14,'cauchy'],[73,'bayes']]) {
    const c=concepts[key];await navigate('/problems/'+routes[n-1]);await ready('.solution');
    const selector='a[data-prerequisite="'+key+'"]';await ready(selector);
    await evaluate('document.querySelector('+JSON.stringify(selector)+').click()');
    await waitFor('location.pathname==='+JSON.stringify(c.route)+' && location.hash==='+JSON.stringify(c.fragment?'#'+c.fragment:''),'concept '+key);
    if(c.fragment)await ready('#'+c.fragment);
    await ready('.prerequisite-problems summary');
    await evaluate('document.querySelector(".prerequisite-problems summary").click()');
    const back='.prerequisite-problems a[href="/problems/'+routes[n-1]+'"]';await ready(back);
    await evaluate('document.querySelector('+JSON.stringify(back)+').click()');await ready('.solution');
    assert.equal(await evaluate('location.pathname'),'/problems/'+routes[n-1]);
  }
  // Real input from the initial state; no direct mutation of Angular component instances.
  await navigate('/articles/polynomial-foundations');await ready('#coefficient-lab');
  await waitFor('document.querySelectorAll("app-formula mjx-container").length>=3','polynomial formulas');
  for(let i=1;i<=4;i++)await setRange('[aria-labelledby="coefficient-lab"] .controls label:nth-child('+i+') input',0);
  assert((await evaluate('document.querySelector("[aria-labelledby=coefficient-lab] .readouts").textContent')).includes('Sin grado finito'));
  await setRange('[aria-labelledby="coefficient-lab"] .controls label:first-child input',1);
  const constant=await evaluate('document.querySelector("[aria-labelledby=coefficient-lab] .readouts").textContent');
  assert(constant.includes('Grado0')&&constant.includes('mónico?Sí'),'constant one');
  await setRange('[aria-labelledby="multiplicity-lab"] .controls label:nth-child(2) input',1);
  assert((await evaluate('document.querySelector("[aria-labelledby=multiplicity-lab] .readouts").textContent')).includes('Cruza'),'merged roots');
  await setSelect('[aria-labelledby="multiplicity-lab"] select',2);
  assert((await evaluate('document.querySelector("[aria-labelledby=multiplicity-lab] .readouts").textContent')).includes('Toca'),'merged roots even');
  await evaluate('document.querySelector("[aria-labelledby=coefficient-lab] button").click()');
  assert((await evaluate('document.querySelector("[aria-labelledby=coefficient-lab] .readouts").textContent')).includes('Grado3'),'polynomial reset');
  for(const width of[1440,390,320]) {
    await checkPage('polynomial foundations',width);
    await evaluate('document.querySelector("#coefficient-lab").scrollIntoView({block:"start",behavior:"instant"})');
    const shot=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(shots,'polynomial-'+width+'.png'),Buffer.from(shot.data,'base64'));
  }
  await navigate('/articles/equation-equivalence');await ready('#equivalence-lab');
  const table='[aria-labelledby="equivalence-lab"] tbody';
  assert((await evaluate('document.querySelector('+JSON.stringify(table)+').textContent')).includes('extraña'),'initial extraneous root');
  await setRange('[aria-labelledby="equivalence-lab"] input',0);
  assert.equal(await evaluate('document.querySelectorAll('+JSON.stringify(table+' tr')+').length'),2,'zero includes two solutions');
  await setRange('[aria-labelledby="equivalence-lab"] input',-.25);
  assert.equal(await evaluate('document.querySelectorAll('+JSON.stringify(table+' tr')+').length'),1,'double root once');
  await setRange('[aria-labelledby="equivalence-lab"] input',-1);
  assert((await evaluate('document.querySelector('+JSON.stringify(table)+').textContent')).includes('No hay candidatos'),'negative discriminant');
  await evaluate('document.querySelector("[aria-labelledby=equivalence-lab] button").click()');
  assert((await evaluate('document.querySelector('+JSON.stringify(table)+').textContent')).includes('extraña'),'equivalence reset');
  for(const width of[1440,390,320])await checkPage('equivalence',width);
  await navigate('/articles/polynomial-division#ruffini');await ready('#ruffini-lab');
  await setSelect('[aria-labelledby="ruffini-lab"] select',2);
  await setRange('[aria-labelledby="ruffini-lab"] input',1);
  const sums=await evaluate('Array.from(document.querySelectorAll("[aria-labelledby=ruffini-lab] tbody tr")).map(row=>Number(row.lastElementChild.textContent))');
  assert.deepEqual(sums,[1,-5,6,0],'actual Ruffini table');
  await setRange('[aria-labelledby="ruffini-lab"] input',3);
  assert((await evaluate('document.querySelector("[aria-labelledby=ruffini-lab] .readouts").textContent')).includes('Resto P(r)0'),'third root');
  await setRange('[aria-labelledby="ruffini-lab"] input',0);
  assert((await evaluate('document.querySelector("[aria-labelledby=ruffini-lab] .readouts").textContent')).includes('No'),'non-root');
  await evaluate('document.querySelector("[aria-labelledby=ruffini-lab] button").click()');
  assert((await evaluate('document.querySelector("[aria-labelledby=ruffini-lab] .readouts").textContent')).includes('Resto P(r)1'),'Ruffini reset');
  for(const width of[1440,390,320])await checkPage('Ruffini',width);
  // Native disclosure controls expose solved exercises to keyboard and touch users.
  for(const slug of['polynomial-foundations','equation-equivalence']) {
    await navigate('/articles/'+slug);await ready('details.note summary');
    await evaluate('document.querySelector("details.note summary").click()');
    assert(await evaluate('document.querySelector("details.note").open'),'exercise opens '+slug);
  }
  assert.deepEqual(errors,[],'No runtime exceptions');
  console.log('PASS: catalogue with 200 canonical links; '+numbers.length+' selected problem pages; eight reciprocal concept journeys; polynomial zero/constant and merging roots, squared-equation edge cases, Ruffini controls/reset; solved exercises; desktop/390/320px; no runtime or MathJax errors. Screenshots: tmp/problem-concepts-audit');
}
main().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{clearTimeout(watchdog);socket?.close();browser?.kill();await pause(500);server?.close();const resolved=path.resolve(profile);if(!resolved.startsWith(path.resolve(os.tmpdir(),'danisagan-problem-concepts-audit-')))throw Error('Unexpected profile path');try{fs.rmSync(resolved,{recursive:true,force:true,maxRetries:3})}catch{}});
