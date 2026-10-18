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
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'danisagan-tic-tac-toe-audit-'));
const chrome = process.env.CHROME_BIN || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const mathjaxBundle = process.env.MATHJAX_TEST_BUNDLE || path.join(os.tmpdir(), 'danisagan-mathjax-3.2.2-tex-svg.js');
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.ico': 'image/x-icon' };
let browser, socket, server;
const watchdog = setTimeout(() => { console.error('Browser audit timed out.'); process.exit(1); }, 300000);
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
    if (fs.existsSync(active)) { port = fs.readFileSync(active, 'utf8').split('\n')[0]; break; }
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

  const component="ng.getComponent(document.querySelector('app-tic-tac-toe'))";
  await call('Page.navigate',{url:origin+'/games/tic-tac-toe'});
  for(let i=0;i<100;i++){if(await evaluate("document.querySelectorAll('app-tic-tac-toe .cell').length===9"))break;await pause(100);}
  assert.equal(await evaluate("document.querySelectorAll('.cell').length"),9);
  const click=async selector=>{await evaluate('document.querySelector('+JSON.stringify(selector)+').scrollIntoView({block:"center",behavior:"instant"})');await pause(80);const p=await evaluate('(()=>{const r=document.querySelector('+JSON.stringify(selector)+').getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2}})()');await call('Input.dispatchMouseEvent',{type:'mousePressed',...p,button:'left',buttons:1,clickCount:1});await call('Input.dispatchMouseEvent',{type:'mouseReleased',...p,button:'left',buttons:0,clickCount:1});};
  const cell=i=>'.cell:nth-child('+(i+1)+')';
  const cellSizes=()=>evaluate("[...document.querySelectorAll('.cell')].map(e=>{const r=e.getBoundingClientRect();return[r.width,r.height]})");
  const emptySizes=await cellSizes();
  const assertStable=async()=>{const marked=await cellSizes();for(let i=0;i<9;i++){assert(Math.abs(marked[i][0]-emptySizes[i][0])<1 && Math.abs(marked[i][1]-emptySizes[i][1])<1,'cell '+i+' retains empty-board dimensions');}};
  await click(cell(0));await assertStable();assert.equal(await evaluate(component+'.moves'),1);assert(await evaluate(component+'.thinking'));await click(cell(1));assert.equal(await evaluate(component+'.moves'),1);await pause(500);assert.equal(await evaluate(component+'.moves'),2);await assertStable();
  await click('.new-game');await click(cell(0));await click('.new-game');await pause(500);assert.equal(await evaluate(component+'.moves'),0,'reset cancels pending machine');
  await evaluate("document.querySelector('.cell').focus()");await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r',unmodifiedText:'\r'});await call('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});await pause(550);assert.equal(await evaluate(component+'.moves'),2,'keyboard play');
  await click('.new-game');
  for(const i of [0,1,3]){await click(cell(i));await pause(550);}
  assert.equal(await evaluate(component+'.winner'),'O');assert.equal(await evaluate("document.querySelectorAll('.cell.winning').length"),3);assert((await evaluate("document.querySelector('.game-status').textContent")).includes('máquina'));await click(cell(8));assert.equal(await evaluate(component+'.moves'),6);
  const shots=path.resolve('tmp/tic-tac-toe-audit');fs.mkdirSync(shots,{recursive:true});
  for(const width of [1440,768,390,320]){await call('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width<500});await pause(600);assert(await evaluate('document.documentElement.scrollWidth<=innerWidth'),'overflow '+width);const sizes=await evaluate("[...document.querySelectorAll('.cell')].map(e=>{const r=e.getBoundingClientRect();return[r.width,r.height]})");assert(sizes.every(([w,h])=>w>=44&&h>=44&&Math.abs(w-h)<2),'square touch targets '+width);if(width===1440||width===390){await evaluate("document.querySelector('.game-shell').scrollIntoView({block:'start',behavior:'instant'})");const shot=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(shots,'result-'+width+'.png'),Buffer.from(shot.data,'base64'));}}
  await call('Emulation.setDeviceMetricsOverride',{width:390,height:1000,deviceScaleFactor:1,mobile:true});await call('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});await click('.new-game');await evaluate("document.querySelector('.board').scrollIntoView({block:'center',behavior:'instant'})");await pause(100);const p=await evaluate("(()=>{const r=document.querySelector('.cell').getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2}})()");await call('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...p,id:1}]});await call('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await pause(550);assert.equal(await evaluate(component+'.moves'),2,'native touch play');
  await click('.new-game');
  for(let i=0;i<5;i++){const index=await evaluate('(()=>{const c='+component+';const m=c.minimax(c.board,"X").move;return m.row*3+m.col})()');await click(cell(index));await pause(550);}
  assert(await evaluate(component+'.gameOver'));assert.equal(await evaluate(component+'.winner'),'');assert.equal(await evaluate(component+'.moves'),9);assert((await evaluate("document.querySelector('.game-status').textContent")).includes('Empate'));
  assert.equal(errors.length,0,errors.join('\n'));
  console.log('PASS native mouse, keyboard and touch; AI lock and reset cancellation; winning highlights and optimal draw; 1440/768/390/320px; no runtime errors. Screenshots: tmp/tic-tac-toe-audit');
}
main().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => {
  clearTimeout(watchdog);
  if (socket) socket.close();
  if (browser) { browser.kill(); await pause(500); }
  if (server) server.close();
  const resolved = path.resolve(profile), prefix = path.resolve(os.tmpdir(), 'danisagan-tic-tac-toe-audit-');
  if (!resolved.startsWith(prefix)) throw Error('Unexpected browser profile path.');
  try { fs.rmSync(resolved, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 }); } catch { /* Chrome may retain a short-lived file lock. */ }
});


