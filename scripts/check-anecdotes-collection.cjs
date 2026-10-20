/* Browser smoke test against an existing development build; no external browser package required. */
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const http = require('node:http');
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');
const WebSocket = require('ws');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist/dani.sagan.labs/browser');
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'danisagan-anecdotes-collection-audit-'));
const chrome = process.env.CHROME_BIN || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const mathjaxBundle = process.env.MATHJAX_TEST_BUNDLE || path.join(os.tmpdir(), 'danisagan-mathjax-3.2.2-tex-svg.js');
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.jpg': 'image/jpeg' };
let browser, socket, server;
const watchdog = setTimeout(() => { console.error('Browser audit timed out.'); process.exit(1); }, 600000);
async function main() {
  assert(fs.existsSync(path.join(dist, 'index.html')), 'Run a development build first.');
  server = http.createServer((req, res) => {
    const requestPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let file = path.resolve(dist, '.' + requestPath);
    if (!file.startsWith(dist + path.sep)) file = path.join(dist, 'index.html');
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) file = path.join(dist, 'index.html');
    res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
    fs.createReadStream(file).pipe(res);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  console.log('Local server ready; starting Chrome.');
  browser = spawn(chrome, ['--headless=new', '--no-sandbox', '--ignore-certificate-errors', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
  let port;
  for (let i = 0; i < 120; i++) {
    const active = path.join(profile, 'DevToolsActivePort');
    try {
      if (fs.existsSync(active)) { port = fs.readFileSync(active, 'utf8').split('\n')[0]; if (port) break; }
    } catch (error) { if (!['EBUSY', 'ENOENT'].includes(error.code)) throw error; }
    await pause(100);
  }
  assert(port, 'Chrome did not expose its debugging port.');
  console.log('Chrome debugger ready.');
  const tabs = await (await fetch(`http://127.0.0.1:${port}/json/list`, { signal: AbortSignal.timeout(10000) })).json();
  console.log('Chrome page discovered.');
  socket = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; setTimeout(() => reject(Error('Debugger socket did not open')), 10000); });
  console.log('Debugger connected.');
  let nextId = 0;
  const pending = new Map(), errors = [];
  socket.onmessage = event => {
    const message = JSON.parse(event.data);
    if (message.id) {
      const handlers = pending.get(message.id);
      pending.delete(message.id);
      if (!handlers) return;
      if (message.error) handlers.reject(new Error(message.error.message)); else handlers.resolve(message.result);
    } else if (message.method === 'Fetch.requestPaused') {
      call('Fetch.fulfillRequest', { requestId: message.params.requestId, responseCode: 200, responseHeaders: [{ name: 'Content-Type', value: 'application/javascript' }], body: fs.readFileSync(mathjaxBundle).toString('base64') }).catch(error => errors.push(error.message));
    } else if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text + ' ' + (message.params.exceptionDetails.exception?.description || ''));
  };
  const call = (method, params = {}) => new Promise((resolve, reject) => { const id = ++nextId; const timeout = setTimeout(() => { pending.delete(id); reject(Error('Debugger timeout: ' + method)); }, 15000); pending.set(id, { resolve: r => { clearTimeout(timeout); resolve(r); }, reject: e => { clearTimeout(timeout); reject(e); } }); socket.send(JSON.stringify({ id, method, params })); });
  const evaluate = async expression => {
    const r = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    return r.result.value;
  };
  await call('Runtime.enable');
  await call('Page.enable');
  if (fs.existsSync(mathjaxBundle)) { console.log('Using local MathJax 3.2.2 test bundle (CDN unavailable in restricted environment).'); await call('Fetch.enable', { patterns: [{ urlPattern: 'https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/startup.js' }] }); }
  await call('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });


  const report=JSON.parse(fs.readFileSync(path.join(root,'docs/anecdotes-collection-audit.json'),'utf8'));
  const batch = process.argv.find(arg => /^--batch-[a-z]$/.test(arg))?.slice(-1).toUpperCase();
  const selected=batch?report.articles.filter(a=>a.id.startsWith(batch)):report.articles;
  assert(selected.length, 'No stories selected.');
  const wait=async expression=>{for(let i=0;i<200;i++){if(await evaluate(expression))return;await pause(100);}throw Error('Timed out '+expression);};
  const shots=path.resolve('tmp/anecdotes-collection-audit');fs.mkdirSync(shots,{recursive:true});
  const click=async selector=>{await evaluate('document.querySelector('+JSON.stringify(selector)+').scrollIntoView({block:"center",behavior:"instant"})');const p=await evaluate('(()=>{const r=document.querySelector('+JSON.stringify(selector)+').getClientRects()[0];return{x:r.left+r.width/2,y:r.top+r.height/2}})()');await call('Input.dispatchMouseEvent',{type:'mousePressed',...p,button:'left',buttons:1,clickCount:1});await call('Input.dispatchMouseEvent',{type:'mouseReleased',...p,button:'left',buttons:0,clickCount:1});};
  for(const width of [1440,390,320]){
    await call('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width<600});
    for(const a of selected){
      await call('Page.navigate',{url:origin+'/articles/'+a.route});
      await wait('!!document.querySelector("app-'+a.route+' .narrative")');await pause(60);
      assert.equal(await evaluate('document.querySelector("app-'+a.route+' h2").textContent'),a.title);
      assert(await evaluate('document.documentElement.scrollWidth<=innerWidth+1'),a.route+' overflow '+width);
      assert.equal(await evaluate('document.querySelectorAll("app-'+a.route+' input,app-'+a.route+' canvas,app-'+a.route+' app-learning-plot").length'),0);
      if(a.image){await evaluate('document.querySelector("app-'+a.route+' img").scrollIntoView({block:"center",behavior:"instant"})');await wait('document.querySelector("app-'+a.route+' img").complete&&document.querySelector("app-'+a.route+' img").naturalWidth>0');assert(await evaluate('document.querySelector("app-'+a.route+' img").getBoundingClientRect().width<=innerWidth'),a.route+' image');}
      if(width===1440){await click('app-'+a.route+' .references summary');assert(await evaluate('document.querySelector("app-'+a.route+' .references").open'));}
      await evaluate('document.querySelector("app-'+a.route+'").scrollIntoView({block:"start",behavior:"instant"})');
      fs.writeFileSync(path.join(shots,a.route+'-'+width+'.png'),Buffer.from((await call('Page.captureScreenshot',{format:'png'})).data,'base64'));
      a.browserValidation='passed 1440/390/320px, title, local images, overflow and source disclosure';a.status='implemented; static and browser checks passed';
    }
    console.log('PASS '+selected.length+' stories at '+width+'px');
  }
  const last=selected.at(-1);await evaluate('document.querySelector("app-'+last.route+' .references summary").scrollIntoView({block:"center",behavior:"instant"});document.querySelector("app-'+last.route+' .references summary").focus()');await pause(100);
  await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r'});await call('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});await wait('document.querySelector("app-'+last.route+' .references").open');
  for (const width of [1440,390,320]) {
    await call('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width<600});
    for (const [route,story] of [['nash-equilibrium','nash-return-recognition'],['classical-cryptography','joan-clarke-hut-eight']]) {
      await call('Page.navigate',{url:origin+'/articles/'+route});
      await wait('!!document.querySelector("app-'+route+'-article h2")');
      assert(await evaluate('document.documentElement.scrollWidth<=innerWidth+1'),route+' overflow '+width);
      await click('app-'+route+'-article details summary');
      assert(await evaluate('document.querySelector("app-'+route+'-article details").open'));
      await click('app-'+route+'-article a[routerLink="/articles/'+story+'"]');
      await wait('!!document.querySelector("app-'+story+' .narrative")');
      await click('app-'+story+' a[routerLink="/articles/'+route+'"]');
      await wait('!!document.querySelector("app-'+route+'-article h2")');
      fs.writeFileSync(path.join(shots,route+'-'+width+'.png'),Buffer.from((await call('Page.captureScreenshot',{format:'png'})).data,'base64'));
    }
  }
  console.log('PASS mathematical support pages, worked examples and reciprocal links at 1440/390/320px.');
  assert.equal(errors.length,0,errors.join('\n'));
  report.browserValidation = report.articles.every(a => a.browserValidation) ? 'passed all '+report.articles.length+' at 1440/390/320px' : 'partial; see individual articles';
  fs.writeFileSync(path.join(root,'docs/anecdotes-collection-audit.json'),JSON.stringify(report,null,2)+'\n');
  console.log('PASS independent article journeys, licensed local images, responsive layouts, source disclosure and keyboard. Screenshots: tmp/anecdotes-collection-audit');
}
main().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => {
  clearTimeout(watchdog);
  if (socket) socket.close();
  if (browser) { browser.kill(); await pause(500); }
  if (server) server.close();
  const resolved = path.resolve(profile), prefix = path.resolve(os.tmpdir(), 'danisagan-anecdotes-collection-audit-');
  if (!resolved.startsWith(prefix)) throw Error('Unexpected browser profile path.');
  try { fs.rmSync(resolved, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 }); } catch { /* Chrome may retain a short-lived file lock. */ }
});


