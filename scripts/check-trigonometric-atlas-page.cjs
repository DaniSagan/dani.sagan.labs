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
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'danisagan-trig-atlas-audit-'));
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


  const component="ng.getComponent(document.querySelector('app-trigonometric-atlas'))";
  await call('Page.navigate',{url:origin+'/articles/trigonometric-functions-atlas'});
  const wait=async expression=>{for(let i=0;i<250;i++){if(await evaluate(expression))return;await pause(100);}throw Error('Timed out '+expression);};
  await wait("document.querySelectorAll('td button').length===52");
  const change=async(selector,value)=>{await evaluate('(()=>{const e=document.querySelector('+JSON.stringify(selector)+');const v='+JSON.stringify(value)+';e.value=Array.from(e.options).find(o=>o.value===v||o.value.endsWith(": "+v)).value;e.dispatchEvent(new Event("change",{bubbles:true}));})()');await pause(80);};
  const click=async selector=>{await evaluate('document.querySelector('+JSON.stringify(selector)+').scrollIntoView({block:"center",behavior:"instant"})');const p=await evaluate('(()=>{const r=document.querySelector('+JSON.stringify(selector)+').getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2}})()');await call('Input.dispatchMouseEvent',{type:'mousePressed',...p,button:'left',buttons:1,clickCount:1});await call('Input.dispatchMouseEvent',{type:'mouseReleased',...p,button:'left',buttons:0,clickCount:1});};
  assert(Math.abs(await evaluate(component+'.evaluation.value')-.25)<1e-12);
  await change('#trig-unit','rad');assert(Math.abs(await evaluate(component+'.value')-Math.PI/3)<1e-12);
  await change('#trig-family','inverse');await change('#trig-function','asin');
  await evaluate('(()=>{const e=document.querySelector("#trig-value");e.value="2";e.dispatchEvent(new Event("input",{bubbles:true}));})()');await pause(100);assert.equal(await evaluate(component+'.evaluation.status'),'domain');assert(await evaluate('document.querySelector(".atlas-readout").textContent.includes("dominio")'));
  await change('#trig-family','historical');await change('#trig-function','hav');await click('#atlas-lab .plot-note button');assert.equal(await evaluate(component+'.value'),1e-8);assert(await evaluate(component+'.evaluation.value>0'));assert.equal(await evaluate(component+'.naiveHaversine'),'0');
  const results=await evaluate('(()=>{const c='+component+';return c.functions.map(f=>{c.select(f.id);return {id:f.id,status:c.evaluation.status,series:c.series.length}});})()');assert.equal(results.length,52);assert(results.every(r=>r.status==='ok'&&r.series===1));
  await evaluate(component+'.select("hav");'+component+'.rebuild()');await pause(100);
  await evaluate('document.querySelector("#trig-slider").focus()');const before=await evaluate(component+'.value');await call('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39});await call('Input.dispatchKeyEvent',{type:'keyUp',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39});assert.notEqual(await evaluate(component+'.value'),before);
  await wait('document.querySelectorAll("mjx-container").length>5');assert.equal(await evaluate('document.querySelectorAll("mjx-merror").length'),0);
  const shots=path.resolve('tmp/trigonometric-atlas-audit');fs.mkdirSync(shots,{recursive:true});
  for(const width of [1440,768,390,320]){
    await call('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width<600});await pause(150);
    assert(await evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'page overflow at '+width);
    assert(await evaluate('Array.from(document.querySelectorAll("#atlas-lab input,#atlas-lab select")).every(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth+1})'),'control overflow at '+width);
    await evaluate('document.querySelector("#atlas-lab").scrollIntoView({block:"start",behavior:"instant"})');await pause(100);
    fs.writeFileSync(path.join(shots,width+'.png'),Buffer.from((await call('Page.captureScreenshot',{format:'png'})).data,'base64'));
  }
  await call('Emulation.setTouchEmulationEnabled',{enabled:true});await evaluate('document.querySelector("#atlas-lab .plot-note button").scrollIntoView({block:"center",behavior:"instant"})');const point=await evaluate('(()=>{const r=document.querySelector("#atlas-lab .plot-note button").getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2}})()');await call('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point]});await call('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await pause(100);assert.equal(await evaluate(component+'.value'),1e-8);
  assert.equal(errors.length,0,errors.join('\n'));
  console.log('PASS route, 52 functions, native controls, units, domain errors, tiny angles, MathJax, keyboard/touch and 1440/768/390/320px layouts. Screenshots: tmp/trigonometric-atlas-audit');
}
main().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => {
  clearTimeout(watchdog);
  if (socket) socket.close();
  if (browser) { browser.kill(); await pause(500); }
  if (server) server.close();
  const resolved = path.resolve(profile), prefix = path.resolve(os.tmpdir(), 'danisagan-trig-atlas-audit-');
  if (!resolved.startsWith(prefix)) throw Error('Unexpected browser profile path.');
  try { fs.rmSync(resolved, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 }); } catch { /* Chrome may retain a short-lived file lock. */ }
});


