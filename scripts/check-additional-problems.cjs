const problemRoutes = require('./problem-routes.cjs');
// Real Chrome integration/visual audit; run after a development build.
const fs = require('node:fs'), path = require('node:path'), os = require('node:os'), http = require('node:http');
const { spawn } = require('node:child_process');
const { problemNames } = require('./problem-names.cjs');
const problemSlugs = require('./additional-problems.cjs').flatMap(group => group.entries).map(entry => problemNames(entry.title).slug);
const assert = require('node:assert/strict'), WebSocket = require('ws');
const dist = path.resolve('dist/dani.sagan.labs/browser');
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'danisagan-additional-problems-audit-'));
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


  const shots=path.resolve('tmp/additional-problems-audit');fs.mkdirSync(shots,{recursive:true});
  const waitFor=async(expression,label)=>{for(let i=0;i<150;i++){if(await evaluate(expression))return;await pause(100);}throw Error('Timed out: '+label+' '+JSON.stringify(await evaluate("({path:location.pathname,cards:document.querySelectorAll('.problem-card').length,query:document.querySelector('input[type=search]')?.value,errors:document.querySelector('.result-count')?.textContent})")));};
  const navigate=async route=>{await call('Page.navigate',{url:origin+route});};
  await call('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  await navigate('/problems');
  await waitFor("document.querySelectorAll('.problem-card').length===200",'200 problem cards');
  await pause(500);
  await evaluate("(()=>{const e=document.querySelector('app-problems-intro input[type=search]');e.value='ortonormales';e.dispatchEvent(new Event('input',{bubbles:true}));})()");
  await waitFor("document.querySelectorAll('.problem-card').length===1",'search new problem');
  assert(await evaluate("document.querySelector('.problem-card').textContent.includes('ortonormales')"));
  await evaluate("document.querySelector('.filters button').click()");
  await waitFor("document.querySelectorAll('.problem-card').length===200",'reset search');
  const numbers=process.env.PROBLEM_NUMBERS?process.env.PROBLEM_NUMBERS.split(',').map(Number):Array.from({length:100},(_,i)=>101+i);
  for(const n of numbers){
    await navigate(n===173 ? '/problems/problema-173' : '/problems/'+problemRoutes[n-1]);
    await waitFor("!!document.querySelector('app-"+problemSlugs[n-101]+"-problem .solution')",'page '+n);
    await waitFor("document.querySelectorAll('.problem-detail app-formula mjx-container').length===1",'formula '+n);
    assert.equal(await evaluate("document.querySelectorAll('mjx-merror,[data-mml-node=merror]').length"),0,'MathJax '+n);
    assert((await evaluate("document.querySelectorAll('.solution ol li').length"))>=4,'steps '+n);
    assert(await evaluate("!!document.querySelector('.resources a[href^=\"/articles/\"]')"),'resource '+n);
    assert.equal(await evaluate('location.pathname'), '/problems/'+problemRoutes[n-1], 'canonical route '+n);
    const next=await evaluate("Array.from(document.querySelectorAll('.adjacent a')).map(e=>e.getAttribute('href'))");
    if(n<200)assert(next.includes('/problems/'+problemRoutes[n]),'next '+n);
    assert(next.includes('/problems/'+problemRoutes[n-2]),'previous '+n);
    for(const width of(n%10===1?[1440,390,320]:[390])){
      await call('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<600});await pause(450);
      const geometry=await evaluate("({width:innerWidth,scroll:document.documentElement.scrollWidth})");
      if(geometry.scroll>width)console.log(await evaluate("Array.from(document.querySelectorAll('body *')).map(e=>({tag:e.tagName,cls:e.className,left:e.getBoundingClientRect().left,right:e.getBoundingClientRect().right,width:e.getBoundingClientRect().width})).filter(e=>e.right>"+width+"&&e.width>100).slice(-25)"));
      assert(geometry.scroll<=width,'overflow '+n+' '+width+': '+JSON.stringify(geometry));
      if([118,137,179,190,200].includes(n)){
        await evaluate("document.querySelector('.solution').scrollIntoView({block:'start',behavior:'instant'})");
        const shot=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(shots,n+'-'+width+'.png'),Buffer.from(shot.data,'base64'));
      }
    }
    if(n%10===0)console.log('PASS problems '+(n-9)+'?'+n+': rendering, formulas, steps, resources, consecutive navigation, mobile');
  }
  // Follow actual Angular links in both directions, including the shared integration chapter.
  for(const [number,route]of[[118,'gram-schmidt'],[163,'integration-classical'],[198,'life-patterns']]){
    await navigate('/articles/'+route);
    const selector='a[href="/problems/'+problemRoutes[number-1]+'"]';
    await waitFor('!!document.querySelector('+JSON.stringify(selector)+')','incoming '+route);
    await evaluate('document.querySelector('+JSON.stringify(selector)+').click()');
    await waitFor("!!document.querySelector('app-"+problemSlugs[number-101]+"-problem .solution')",'article to problem');
    await evaluate("document.querySelector('.resources a').click()");
    await waitFor('location.pathname==='+JSON.stringify('/articles/'+route)+' && !document.querySelector(".problem-detail")','problem to article');
  }
  assert.deepEqual(errors,[],'No runtime exceptions');
  console.log('PASS '+numbers.length+' pages and formulas, catalogue search/reset, three reciprocal journeys, desktop/mobile. Screenshots: tmp/additional-problems-audit');
}
main().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{clearTimeout(watchdog);socket?.close();browser?.kill();await pause(500);server?.close();const resolved=path.resolve(profile);if(!resolved.startsWith(path.resolve(os.tmpdir(),'danisagan-additional-problems-audit-')))throw Error('Unexpected profile path');try{fs.rmSync(resolved,{recursive:true,force:true,maxRetries:3})}catch{}});
