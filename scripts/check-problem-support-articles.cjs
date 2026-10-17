// Real Chrome integration/visual audit; run after a development build.
const fs = require('node:fs'), path = require('node:path'), os = require('node:os'), http = require('node:http');
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict'), WebSocket = require('ws');
const dist = path.resolve('dist/dani.sagan.labs/browser');
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'danisagan-problem-support-articles-audit-'));
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


  const shots=path.resolve('tmp/problem-support-articles-audit');fs.mkdirSync(shots,{recursive:true});
  const entries=[['algebra','algebraic-identities-factorization'],['analysis','absolute-value-distance'],['number-theory','proof-strategies'],['probability','probability-trees'],['analysis','global-extrema-weierstrass'],['calculus','partial-derivatives-minimization'],['algebra','change-of-basis'],['combinatorics','graph-foundations'],['number-theory','factorials-legendre'],['probability','distribution-functions-tails']];
  const waitFor=async(expression,label)=>{for(let i=0;i<150;i++){if(await evaluate(expression))return;await pause(100);}throw Error('Timed out '+label);};
  const navigate=async route=>{await call('Page.navigate',{url:origin+route});};
  let formulas=0;
  for(const [area,slug]of entries){
    await call('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
    await navigate('/articles/'+slug);
    const selector='app-'+slug+'-article';
    await waitFor('!!document.querySelector('+JSON.stringify(selector+' .math-lab')+')',slug);
    const html=fs.readFileSync('src/app/articles/'+area+'/'+slug+'/'+slug+'-article.component.html','utf8');
    const count=[...html.matchAll(/<app-formula/g)].length;
    await waitFor('document.querySelectorAll('+JSON.stringify(selector+' app-formula mjx-container')+').length==='+count,slug+' formulas');
    assert.equal(await evaluate("document.querySelectorAll('mjx-merror,[data-mml-node=merror]').length"),0,slug+' TeX');formulas+=count;
    const state=await evaluate('document.querySelector('+JSON.stringify(selector+' .math-lab')+').textContent');
    await evaluate('(()=>{const c=document.querySelector('+JSON.stringify(selector+' .math-lab')+');const e=c.querySelector("input[type=range],select");if(e.tagName==="SELECT"){e.selectedIndex=e.options.length-1;e.dispatchEvent(new Event("change",{bubbles:true}));}else{e.value=e.max;e.dispatchEvent(new Event("input",{bubbles:true}));}})()');
    await pause(200);
    assert.notEqual(await evaluate('document.querySelector('+JSON.stringify(selector+' .math-lab')+').textContent'),state,slug+' control updates result');
    await evaluate('(()=>{const e=document.querySelector('+JSON.stringify(selector+' .math-lab input[type=range]')+');if(e){e.value=e.min;e.dispatchEvent(new Event("input",{bubbles:true}));}})()');await pause(100);
    assert(await evaluate('!Array.from(document.querySelectorAll('+JSON.stringify(selector+' svg *')+')).some(e=>e.getAttributeNames().some(n=>/NaN|Infinity|undefined/.test(e.getAttribute(n))))'),slug+' finite SVG at minimum');
    await evaluate('Array.from(document.querySelectorAll('+JSON.stringify(selector+' .math-lab button')+')).find(b=>b.textContent.includes("Restablecer")).click()');await pause(100);
    await evaluate('document.querySelector('+JSON.stringify(selector+' details.note')+').open=true');
    assert(await evaluate('document.querySelector('+JSON.stringify(selector+' details.note')+').open'));
    // Exercise important branches in the actual component, beyond the first control.
    const component='ng.getComponent(document.querySelector('+JSON.stringify(selector)+'))';
    if(slug==='change-of-basis'){
      await evaluate('(()=>{const c='+component+';c.parameter=1;ng.applyChanges(c);})()');
      assert(await evaluate('document.querySelector('+JSON.stringify(selector+' .math-lab')+').textContent.includes("dependientes")'));}
    if(slug==='partial-derivatives-minimization'){
      await evaluate('document.querySelector('+JSON.stringify(selector+' .math-lab button')+').click()');await pause(80);
      const loss=await evaluate(component+'.loss');assert(Math.abs(loss-1/6)<1e-8);}
    if(slug==='distribution-functions-tails'){
      await evaluate('(()=>{const c='+component+';c.family="triangular";c.x=.5;ng.applyChanges(c);})()');
      assert.equal(await evaluate(component+'.accumulated'),.25);}
    for(const width of[1440,390,320]){
      await call('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width<600});await pause(500);
      const geometry=await evaluate('({width:innerWidth,scroll:document.documentElement.scrollWidth})');assert(geometry.scroll<=width,slug+' overflow '+width+' '+JSON.stringify(geometry));
      await evaluate('document.querySelector('+JSON.stringify(selector+' .math-lab')+').scrollIntoView({block:"start",behavior:"instant"})');
      if(width!==320){const shot=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(shots,slug+'-'+width+'.png'),Buffer.from(shot.data,'base64'));}
    }
    const problem=await evaluate('document.querySelector('+JSON.stringify(selector+' .article-activities a[href^="/problems/"]')+').getAttribute("href")');
    await evaluate('document.querySelector('+JSON.stringify(selector+' .article-activities a[href^="/problems/"]')+').click()');
    const incomingSelector='.problem-detail .resources a[href="/articles/'+slug+'"]';
    await waitFor('!!document.querySelector('+JSON.stringify(incomingSelector)+')',slug+' incoming problem link');
    await evaluate('document.querySelector('+JSON.stringify(incomingSelector)+').click()');
    await waitFor('!!document.querySelector('+JSON.stringify(selector+' .math-lab')+')',slug+' return journey');
    assert(await evaluate('!!document.querySelector('+JSON.stringify('app-articles-navbar a[href="/articles/'+slug+'"]')+')'),slug+' sidebar');
    console.log('PASS '+slug+': formulas, controls, exercise, links, 1440/390/320px');
  }
  assert.deepEqual(errors,[],'No runtime exceptions');
  console.log('PASS 10 independent article pages, '+formulas+' rendered formulas, 10 reciprocal problem journeys, desktop/mobile. Screenshots: tmp/problem-support-articles-audit');
}
main().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{clearTimeout(watchdog);socket?.close();browser?.kill();await pause(500);server?.close();const resolved=path.resolve(profile);if(!resolved.startsWith(path.resolve(os.tmpdir(),'danisagan-problem-support-articles-audit-')))throw Error('Unexpected profile path');try{fs.rmSync(resolved,{recursive:true,force:true,maxRetries:3})}catch{}});
