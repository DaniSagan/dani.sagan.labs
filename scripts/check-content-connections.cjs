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
  const call = (method, params = {}) => new Promise((resolve, reject) => { const id = ++nextId; const timeout = setTimeout(() => { pending.delete(id); reject(Error('Debugger timeout: ' + method)); }, 60000); pending.set(id, { resolve: r => { clearTimeout(timeout); resolve(r); }, reject: e => { clearTimeout(timeout); reject(e); } }); socket.send(JSON.stringify({ id, method, params })); });
  const evaluate = async expression => {
    const r = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    return r.result.value;
  };
  await call('Runtime.enable');
  await call('Page.enable');
  if (fs.existsSync(mathjaxBundle)) { console.log('Using local MathJax 3.2.2 test bundle (CDN unavailable in restricted environment).'); await call('Fetch.enable', { patterns: [{ urlPattern: 'https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/startup.js' }] }); }
  await call('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });


  const wait=async expr=>{for(let i=0;i<200;i++){if(await evaluate(expr))return;await pause(100);}throw Error('Timed out '+expr);};
  const report=JSON.parse(fs.readFileSync('docs/content-connections-audit.json','utf8'));
  const changed=report.pages.filter(p=>p.added.length);
  const start=process.env.CONTENT_CONNECTIONS_FROM?changed.findIndex(p=>p.route===process.env.CONTENT_CONNECTIONS_FROM):0;
  assert(start>=0,'Unknown resume route');
  const audited=changed.slice(start);
  const selector=p=>p.kind==='game'?'app-content-connections':'section[aria-label="Conexiones relacionadas"]';
  const focus=async selector=>{await evaluate('document.querySelector('+JSON.stringify(selector)+').scrollIntoView({block:"center",behavior:"instant"});document.querySelector('+JSON.stringify(selector)+').focus()');await pause(100);};
  const enter=async()=>{await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r'});await call('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});await pause(150);};
  let checked=0;
  for(const p of audited){
    await call('Page.navigate',{url:origin+p.route});
    const sel=selector(p);
    await wait('document.querySelectorAll('+JSON.stringify(sel+' a')+').length==='+p.added.length);
    const links=await evaluate('Array.from(document.querySelectorAll('+JSON.stringify(sel+' a')+'),a=>({href:a.href?new URL(a.href).pathname:null,label:a.textContent.trim()}))');
    assert.deepEqual(links.map(l=>l.href).sort(),p.added.map(l=>l.route).sort(),p.route);
    assert(links.every(l=>l.label.length>2));checked+=links.length;
    console.log('PASS '+p.route+' ('+links.length+' links)');
  }
  const screenshots=path.resolve('tmp/connections-browser');fs.mkdirSync(screenshots,{recursive:true});
  const samples=[...changed.filter(p=>p.kind==='game'),changed.find(p=>p.kind==='article'),changed.find(p=>p.kind==='problem')];
  for(const width of [1440,390,320]){
    await call('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width<600});
    for(const p of samples){
      await call('Page.navigate',{url:origin+p.route});const sel=selector(p);
      await wait('!!document.querySelector('+JSON.stringify(sel+' summary')+')');
      await focus(sel+' summary');await enter();
      assert(await evaluate('document.querySelector('+JSON.stringify(sel+' details')+').open'),'keyboard disclosure '+p.route);
      const result=await evaluate('(()=>{const r=document.querySelector('+JSON.stringify(sel)+').getBoundingClientRect();return {left:r.left,right:r.right,width:innerWidth,scroll:document.querySelector('+JSON.stringify(sel)+').scrollWidth,client:document.querySelector('+JSON.stringify(sel)+').clientWidth}})()');
      assert(result.left>=-1&&result.right<=result.width+1&&result.scroll<=result.client+1,'Connection panel overflow '+width+' '+p.route+' '+JSON.stringify(result));
      const link=p.added[0];await focus(sel+' a');await enter();
      await wait('location.pathname==='+JSON.stringify(link.route));
      await wait('!!document.querySelector(".body-text h2,app-problem-navigation,.game-shell,app-content-connections")');
      if(p.route==='/games/tic-tac-toe'){
        await call('Page.navigate',{url:origin+p.route});await wait('!!document.querySelector("app-content-connections summary")');await focus('app-content-connections summary');await enter();
        fs.writeFileSync(path.join(screenshots,'connections-'+width+'.png'),Buffer.from((await call('Page.captureScreenshot',{format:'png'})).data,'base64'));
      }
    }
    console.log('PASS keyboard disclosure/navigation and responsive panels: '+width+'px, '+samples.length+' pages.');
  }
  assert.equal(errors.length,0,errors.join('\n'));
  fs.writeFileSync('tmp/connections-browser-result.json',JSON.stringify({pages:audited.length,from:audited[0].route,links:checked,widths:[1440,390,320],responsivePages:samples.length,errors},null,2));
  console.log('PASS all new rendered links, responsive panels, keyboard journeys and zero runtime errors.');
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



