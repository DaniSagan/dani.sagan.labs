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
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'danisagan-2048-audit-'));
const chrome = process.env.CHROME_BIN || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const mathjaxBundle = process.env.MATHJAX_TEST_BUNDLE || path.join(os.tmpdir(), 'danisagan-mathjax-3.2.2-tex-svg.js');
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.ico': 'image/x-icon' };
let browser, socket, server;
const watchdog = setTimeout(() => { console.error('Browser audit timed out.'); process.exit(1); }, 180000);
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
  const component = "ng.getComponent(document.querySelector('app-game-2048'))";
  async function mount(){for(let i=0;i<120;i++){if(await evaluate("!!document.querySelector('app-game-2048 .board')"))return;await pause(100);}throw Error('2048 did not mount');}
  const action = async expression => {await evaluate(component+'.'+expression);await pause(230);await evaluate('ng.applyChanges('+component+')');};
  const state = async expression => evaluate(component+'.'+expression);
  const fixture = async values => {await evaluate(`(()=>{const c=${component};c.newGame();c.tiles=${JSON.stringify(values.map((value,i)=>({id:i+1,value,row:0,col:i})).filter(t=>t.value))};c.visual=c.tiles;c.message='';ng.applyChanges(c);})()`);};
  await call('Page.navigate',{url:origin+'/games/2048'});await mount();
  assert.equal(await state('tiles.length'),2);
  assert(await evaluate("!!document.querySelector('app-games-navbar a[href=\"/games/2048\"]')"),'Menu entry missing');
  await fixture([2,2,4,0]);await action("move('left')");assert.equal(await state('score'),4);assert.equal(await state('tiles.length'),3);assert.equal(await state('moves'),1);
  await action('undo()');assert.equal(await state('score'),0);assert.equal(await state('moves'),0);assert.deepEqual(await state('tiles.map(t=>t.value)'),[2,2,4]);assert.equal(await state('best'),4);
  await fixture([2,0,0,0]);await evaluate("document.querySelector('app-game-2048 .board').focus()");
  await call('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39});await pause(250);assert.equal(await state('moves'),1);assert.equal(await state('tiles.find(t=>t.id===1).col'),3);
  await fixture([1024,1024,0,0]);await action("move('left')");assert.equal(await state('won'),true);assert(await evaluate("!!document.querySelector('.victory')"));await action('continueGame()');assert.equal(await state('continued'),true);
  await call('Page.reload');await mount();assert.equal(await state('continued'),true);assert.equal(await state('score'),2048);
  await evaluate(`(()=>{const c=${component};c.newGame();c.tiles=Array.from({length:16},(_,i)=>({id:i+1,value:((Math.floor(i/4)+i%4)%2)?4:2,row:Math.floor(i/4),col:i%4}));c.visual=c.tiles;c.over=true;ng.applyChanges(c);})()`);
  assert(await evaluate("document.querySelector('.overlay').textContent.includes('Sin movimientos')"));
  // Actual pointer click on overlay confirms that board pointer capture does not steal buttons.
  await evaluate("document.querySelector('.overlay .primary').click()");await pause(100);assert.equal(await state('resetPending'),true);
  const click = async selector => {await evaluate(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({behavior:'instant',block:'center'})`);await pause(100);const r=await evaluate(`(()=>{const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}})()`);await call('Input.dispatchMouseEvent',{type:'mousePressed',x:r.x,y:r.y,button:'left',clickCount:1});await call('Input.dispatchMouseEvent',{type:'mouseReleased',x:r.x,y:r.y,button:'left',clickCount:1});await pause(250);};
  await click('.overlay .primary');assert.equal(await state('resetPending'),false);assert.equal(await state('moves'),0);
  await fixture([2,0,0,0]);
  const rect=await evaluate("(()=>{const r=document.querySelector('app-game-2048 .board').getBoundingClientRect();return{x:r.x,y:r.y}})()");
  await call('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:rect.x+50,y:rect.y+50}]});
  await call('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:rect.x+170,y:rect.y+50}]});
  await call('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await pause(250);assert.equal(await state('moves'),1);assert.equal(await state('tiles.find(t=>t.id===1).col'),3);
  for(const width of [1440,768,390,320]){await call('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width<500});await pause(150);assert(await evaluate('document.documentElement.scrollWidth<=innerWidth'),'Horizontal overflow at '+width);}
  // Build a representative mid-game palette for visual review.
  await evaluate(`(()=>{const c=${component};c.newGame();c.tiles=[2,4,8,16,32,64,128,256,512,1024,2,4].map((value,i)=>({id:i+1,value,row:Math.floor(i/4),col:i%4}));c.visual=c.tiles;c.score=3960;c.best=8120;c.moves=186;ng.applyChanges(c);})()`);
  for(const [label,width,height] of [['desktop',1440,1100],['mobile',390,1100]]){await call('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<500});await evaluate("document.querySelector('app-game-2048').scrollIntoView({behavior:'instant',block:'start'})");await pause(200);const s=await call('Page.captureScreenshot',{format:'png'});const file=path.join(os.tmpdir(),'danisagan-2048-'+label+'.png');fs.writeFileSync(file,Buffer.from(s.data,'base64'));console.log('Screenshot: '+file);}
  await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});assert.equal(await evaluate("getComputedStyle(document.querySelector('.tile')).transitionDuration"),'0s');
  assert.equal(errors.length,0,errors.join('\n'));
  console.log('PASS: routing/menu, merges, undo, keyboard, swipe, victory/continue, persistence, game over, reset confirmation, reduced motion; 1440/768/390/320px; no runtime exceptions.');
}
main().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => {
  clearTimeout(watchdog);
  if (socket) socket.close();
  if (browser) { browser.kill(); await pause(500); }
  if (server) server.close();
  const resolved = path.resolve(profile), prefix = path.resolve(os.tmpdir(), 'danisagan-2048-audit-');
  if (!resolved.startsWith(prefix)) throw Error('Unexpected browser profile path.');
  try { fs.rmSync(resolved, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 }); } catch { /* Chrome may retain a short-lived file lock. */ }
});

