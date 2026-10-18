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
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'danisagan-constellations-audit-'));
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

  const component="ng.getComponent(document.querySelector('app-constellation-recognition'))";
  const mount=async()=>{for(let i=0;i<100;i++){if(await evaluate("!!document.querySelector('.sky-scroll')"))return;await pause(100);}throw Error('mount');};
  const position=()=>evaluate("(()=>{const e=document.querySelector('.sky-scroll'),r=e.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2,left:e.scrollLeft,top:e.scrollTop,width:e.clientWidth,height:e.clientHeight,sky:document.querySelector('.sky').getBoundingClientRect().width}})()");
  const zoom=()=>evaluate(component+'.zoom');
  const center=async()=>{await evaluate("document.querySelector('.sky-scroll').scrollIntoView({block:'center',behavior:'instant'})");await pause(150);return position();};
  await call('Page.navigate',{url:origin+'/games/constellations'});await mount();let p=await center();
  const wheel=async(deltaY)=>{await call('Input.dispatchMouseEvent',{type:'mouseWheel',x:p.x,y:p.y,deltaX:0,deltaY});await pause(150);};
  const initial=await position();p.x-=initial.width*.15;p.y-=initial.height*.1;await wheel(-200);const enlarged=await position();assert(await zoom()>1);assert(enlarged.sky>initial.sky);assert(Math.abs((enlarged.left+enlarged.width*.35)/enlarged.sky-.35)<.01,'wheel anchors the cursor');
  await call('Input.dispatchMouseEvent',{type:'mousePressed',x:p.x,y:p.y,button:'left',buttons:1,clickCount:1});
  await call('Input.dispatchMouseEvent',{type:'mouseMoved',x:p.x-45,y:p.y-30,button:'left',buttons:1});
  await call('Input.dispatchMouseEvent',{type:'mouseReleased',x:p.x-45,y:p.y-30,button:'left',buttons:0,clickCount:1});await pause(100);
  const dragged=await position();assert(Math.abs(dragged.left-enlarged.left-45)<2,'mouse drag X');assert(Math.abs(dragged.top-enlarged.top-30)<2,'mouse drag Y');assert.equal(await evaluate(component+'.dragging'),false);
  await wheel(-10000);await wheel(-10000);assert.equal(await zoom(),2);await wheel(10000);await wheel(10000);await wheel(10000);assert.equal(await zoom(),1);assert.equal((await position()).left,0);
  console.log('PASS native wheel: anchored zoom and limits; captured mouse drag on both axes');
  await call('Emulation.setDeviceMetricsOverride',{width:390,height:1000,deviceScaleFactor:1,mobile:true});await call('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:5});await call('Page.reload');await mount();p=await center();
  const point=(id,x,y)=>({id,x,y,radiusX:2,radiusY:2,force:1});
  await call('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point(1,p.x-30,p.y),point(2,p.x+30,p.y)]});
  await call('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[point(1,p.x-55,p.y),point(2,p.x+55,p.y)]});await pause(100);
  assert(await zoom()>1.7,'native pinch enlarges the chart');
  await call('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await pause(100);assert.equal(await evaluate(component+'.dragging'),false);
  const before=await position();await call('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point(3,p.x,p.y)]});await call('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[point(3,p.x-30,p.y-20)]});await call('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await pause(100);
  const after=await position();assert(Math.abs(after.left-before.left-30)<2,'finger drag X');assert(Math.abs(after.top-before.top-20)<2,'finger drag Y');
  await call('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point(4,p.x,p.y)]});await call('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});await pause(100);assert.equal(await evaluate(component+'.dragging'),false,'cancel releases gesture');
  await evaluate(component+'.atlas();ng.applyChanges('+component+')');await pause(100);assert.equal(await zoom(),1);assert.equal((await position()).left,0);assert.equal((await position()).top,0);
  for(const width of [390,320]){await call('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:true});await pause(600);assert(await evaluate('document.documentElement.scrollWidth<=innerWidth'),'page overflow '+width);}
  assert.equal(errors.length,0,errors.join('\n'));
  console.log('PASS native mobile pinch, one-finger pan, cancellation, reset, 390/320px and no runtime errors');
}
main().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => {
  clearTimeout(watchdog);
  if (socket) socket.close();
  if (browser) { browser.kill(); await pause(500); }
  if (server) server.close();
  const resolved = path.resolve(profile), prefix = path.resolve(os.tmpdir(), 'danisagan-constellations-audit-');
  if (!resolved.startsWith(prefix)) throw Error('Unexpected browser profile path.');
  try { fs.rmSync(resolved, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 }); } catch { /* Chrome may retain a short-lived file lock. */ }
});


