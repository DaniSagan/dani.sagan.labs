// Real Chrome integration/visual audit; run after a development build.
const fs = require('node:fs'), path = require('node:path'), os = require('node:os'), http = require('node:http');
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict'), WebSocket = require('ws');
const dist = path.resolve('dist/dani.sagan.labs/browser');
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'danisagan-article-concepts-audit-'));
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



  const {articles:allArticles}=require('./generate-article-foundations.cjs');
  const selected=(process.env.ARTICLE_CONCEPT_ROUTES||'').split(',').filter(Boolean);
  const articles=selected.length?allArticles.filter(a=>selected.includes(a.slug)):allArticles;
  assert(articles.length>0,'article selection');
  const report=JSON.parse(fs.readFileSync('docs/article-concept-coverage.json','utf8'));
  const shots=path.resolve('tmp/article-concepts-audit');fs.mkdirSync(shots,{recursive:true});
  const waitFor=async(expression,label)=>{for(let i=0;i<150;i++){if(await evaluate(expression))return;await pause(100);}throw Error('Timed out '+label);};
  const navigate=async route=>{await call('Page.navigate',{url:origin+route});};
  let formulas=0;
  for(const [index,a] of articles.entries()) {
    const slug=a.slug,selector='app-'+slug+'-article',q=JSON.stringify;
    await call('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
    await navigate('/articles/'+slug);
    await waitFor('!!document.querySelector('+q(selector+' .math-lab')+')',slug);
    await waitFor('document.querySelectorAll('+q(selector+' app-formula mjx-container')+').length===1',slug+' formula');formulas++;
    assert.equal(await evaluate("document.querySelectorAll('mjx-merror,[data-mml-node=merror]').length"),0,slug+' TeX');
    const state=await evaluate('document.querySelector('+q(selector+' .math-lab')+').textContent');
    for(const end of ['min','max']) {
      await evaluate('(()=>{for(const e of document.querySelectorAll('+q(selector+' input[type=range]')+')){e.value=e.'+end+';e.dispatchEvent(new Event("input",{bubbles:true}));}})()');await pause(60);
      assert(await evaluate('!Array.from(document.querySelectorAll('+q(selector+' svg *')+')).some(e=>e.getAttributeNames().some(n=>/NaN|Infinity|undefined/.test(e.getAttribute(n))))'),slug+' finite '+end);
    }
    await evaluate('document.querySelector('+q(selector+' .math-lab button')+').click()');await pause(60);
    assert.equal(await evaluate('document.querySelector('+q(selector+' .math-lab')+').textContent'),state,slug+' reset');
    await evaluate('document.querySelector('+q(selector+' details.note')+').open=true');assert(await evaluate('document.querySelector('+q(selector+' details.note')+').open'));
    for(const width of[1440,390,320]) {
      await call('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:true});await pause(550);
      const geometry=await evaluate('({width:innerWidth,scroll:document.documentElement.scrollWidth})');assert(geometry.scroll<=width,slug+' overflow '+width+' '+JSON.stringify(geometry));
      if(width===390&&index%10===0){await evaluate('document.querySelector('+q(selector+' .math-lab')+').scrollIntoView({block:"start",behavior:"instant"})');const shot=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(shots,slug+'-390.png'),Buffer.from(shot.data,'base64'));}
    }
    assert(await evaluate('!!document.querySelector('+q('app-articles-navbar a[href="/articles/'+slug+'"]')+')'),slug+' sidebar');
    // Navigate a real incoming concept link and return through the reciprocal article link.
    if(index%10===0){const source=report.articles.find(r=>r.route===slug).incoming[0];await navigate(source);const anchor='a[href="/articles/'+slug+'"]';await waitFor('!!document.querySelector('+q(anchor)+')',slug+' source link');await evaluate('document.querySelector('+q(anchor)+').click()');await waitFor('!!document.querySelector('+q(selector+' .math-lab')+')',slug+' concept journey');const back=selector+' a[href="'+source+'"]';assert(await evaluate('!!document.querySelector('+q(back)+')'),slug+' reciprocal source');}
    console.log('PASS '+slug+': formula, both controls at extremes, reset, exercise, sidebar, 1440/390/320px');
  }
  await navigate('/articles/integration-classical');await waitFor("!!document.querySelector('app-linked-text a')",'integration linked dynamic text');
  assert.deepEqual(errors,[],'No runtime exceptions');
  console.log('PASS '+articles.length+' articles, '+formulas+' rendered formulas, reciprocal journeys and dynamic text; screenshots in tmp/article-concepts-audit');
}
main().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{clearTimeout(watchdog);socket?.close();browser?.kill();await pause(500);server?.close();const resolved=path.resolve(profile);if(!resolved.startsWith(path.resolve(os.tmpdir(),'danisagan-article-concepts-audit-')))throw Error('Unexpected profile path');try{fs.rmSync(resolved,{recursive:true,force:true,maxRetries:3})}catch{}});
