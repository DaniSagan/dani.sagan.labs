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
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'danisagan-anecdotes-math-support-audit-'));
const chrome = process.env.CHROME_BIN || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const mathjaxBundle = process.env.MATHJAX_TEST_BUNDLE || path.join(os.tmpdir(), 'danisagan-mathjax-3.2.2-tex-svg.js');
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.ico': 'image/x-icon' };
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



  const wait=async expression=>{for(let i=0;i<200;i++){if(await evaluate(expression))return;await pause(100);}throw Error('Timed out '+expression+'; hydra: '+await evaluate('document.querySelector("#hydra-status")?.textContent')+'; focus: '+await evaluate('document.activeElement.outerHTML')); };
  const click=async selector=>{await evaluate('document.querySelector('+JSON.stringify(selector)+').scrollIntoView({block:"center",behavior:"instant"})');await pause(400);const p=await evaluate('(()=>{const r=document.querySelector('+JSON.stringify(selector)+').getClientRects()[0];return{x:r.left+r.width/2,y:r.top+r.height/2}})()');if(await evaluate('innerWidth<600')){await call('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...p,radiusX:1,radiusY:1}]});await call('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await pause(400);}else{await call('Input.dispatchMouseEvent',{type:'mousePressed',...p,button:'left',buttons:1,clickCount:1});await call('Input.dispatchMouseEvent',{type:'mouseReleased',...p,button:'left',buttons:0,clickCount:1});}};
  const key=async(key,code,vk)=>{await call('Input.dispatchKeyEvent',{type:'keyDown',key,code,windowsVirtualKeyCode:vk,...(key==='Enter'?{text:'\r'}:key===' '?{text:' '}:{} )});await call('Input.dispatchKeyEvent',{type:'keyUp',key,code,windowsVirtualKeyCode:vk});await pause(100);};
  const shots=path.resolve('tmp/transfinite-audit');fs.mkdirSync(shots,{recursive:true});
  for(const width of [1440,768,390,320]){
    await call('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width<600});
    await call('Emulation.setTouchEmulationEnabled',{enabled:width<600});
    await call('Page.navigate',{url:origin+'/articles/transfinite-numbers'});
    await wait('document.querySelectorAll(".bit-grid button").length===36');
    await wait('document.querySelectorAll("app-transfinite-numbers mjx-container").length>=5');
    assert.equal(await evaluate('document.querySelectorAll("app-transfinite-numbers [data-mml-node=merror],app-transfinite-numbers [data-mjx-error]").length'),0);
    assert(await evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'Overflow '+width);
    await wait('document.querySelectorAll("app-transfinite-numbers mjx-container").length>=15');
    assert.equal(await evaluate('document.querySelectorAll("app-transfinite-numbers [data-mml-node=merror],app-transfinite-numbers [data-mjx-error]").length'),0);
    const videoIds=['oBOZ2WroiVY','uWwUpEY4c8o','SrU9YDoXE88','prURA1i8Qj4'];
    for(const id of videoIds) assert.equal(await evaluate('document.querySelectorAll('+JSON.stringify('#references a[href="https://www.youtube.com/watch?v='+id+'"]')+').length'),1,'Video missing or duplicated '+id);
    assert.deepEqual(await evaluate('[...document.querySelectorAll("app-transfinite-numbers .table-scroll tbody tr")].map(row=>Number(row.cells[1].textContent))'),[4,26,41,60]);
    await evaluate('document.querySelector("app-transfinite-numbers .table-scroll").scrollIntoView({block:"center",behavior:"instant"})');await pause(400);
    assert(await evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'Goodstein table overflow '+width);
    fs.writeFileSync(path.join(shots,'goodstein-'+width+'.png'),Buffer.from((await call('Page.captureScreenshot',{format:'png'})).data,'base64'));

    const before=await evaluate('document.querySelector(".new-sequence").textContent');
    await click('.bit-grid button');
    assert.notEqual(await evaluate('document.querySelector(".new-sequence").textContent'),before);
    await evaluate('document.querySelector("#hotel-mode").focus()');await key('End','End',35);
    assert((await evaluate('document.querySelector(".mapping").textContent')).includes('6 → 12'));
    await evaluate('document.querySelector("#hotel-mode").focus()');await key('Home','Home',36);await key('ArrowDown','ArrowDown',40);
    await wait('!!document.querySelector("#hotel-size")');
    await evaluate('document.querySelector("#hotel-size").focus()');await key('End','End',35);
    assert((await evaluate('document.querySelector(".mapping").textContent')).includes('1 → 13'));
    await evaluate('document.querySelector("#ordinal-mode").focus()');await key('End','End',35);
    assert((await evaluate('document.querySelector(".order-blocks").textContent')).includes('0′'));
    await evaluate('document.querySelector("#transfinite-reset").scrollIntoView({block:"center",behavior:"instant"})');await pause(500);
    fs.writeFileSync(path.join(shots,'reset-'+width+'.png'),Buffer.from((await call('Page.captureScreenshot',{format:'png'})).data,'base64'));
    await click('#transfinite-reset');
    assert.equal(await evaluate('document.querySelector(".new-sequence").textContent'),before);
    assert.equal(await evaluate('document.querySelector("#hotel-mode").value'),'one');
    await evaluate('document.querySelector("#diagonal-lab").scrollIntoView({block:"start"})');
    fs.writeFileSync(path.join(shots,width+'.png'),Buffer.from((await call('Page.captureScreenshot',{format:'png'})).data,'base64'));
    assert(await evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'Overflow after interaction '+width);
    await wait('document.querySelectorAll(".hydra-head").length===2');
    assert.equal(await evaluate('document.querySelector("#hydra-ordinal").textContent'),'ω^2');
    await click('.hydra-head');
    await wait('document.querySelector("#hydra-ordinal").textContent==="ω·2"');
    await wait('document.activeElement.classList.contains("hydra-head")');
    await key('Enter','Enter',13);
    await wait('document.querySelector("#hydra-ordinal").textContent==="ω + 3"');
    assert.equal(await evaluate('document.querySelector("#hydra-heads").textContent'),'4');
    await evaluate('document.querySelector("app-hydra-lab").scrollIntoView({block:"start",behavior:"instant"})');await pause(400);
    fs.writeFileSync(path.join(shots,'hydra-'+width+'.png'),Buffer.from((await call('Page.captureScreenshot',{format:'png'})).data,'base64'));
    await evaluate('document.querySelector("#hydra-preset").focus()');await key('End','End',35);
    await wait('document.querySelector("#hydra-ordinal").textContent==="3"');
    await click('.hydra-head');
    await wait('document.querySelector("#hydra-ordinal").textContent==="2"');
    await key(' ','Space',32);
    await wait('document.querySelector("#hydra-ordinal").textContent==="1"');
    await click('.hydra-head');
    await wait('document.querySelector("#hydra-ordinal").textContent==="0"');
    assert((await evaluate('document.querySelector("#hydra-status").textContent')).includes('Victoria'));
    await wait('document.activeElement.id==="hydra-reset"');
    await key('Enter','Enter',13);
    await wait('document.querySelectorAll(".hydra-head").length===3');
    await evaluate('document.querySelector("#hydra-preset").focus()');await key('Home','Home',36);await key('ArrowDown','ArrowDown',40);
    await wait('document.querySelector("#hydra-ordinal").textContent==="ω^(ω)"');
    await click('.hydra-head');
    await wait('document.querySelector("#hydra-ordinal").textContent==="ω^2"');
    assert(await evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'Hydra overflow '+width);
    console.log('PASS '+width+'px: formulas, keyboard, '+(width<600?'touch':'mouse') + ', hotel, diagonal, ordinals, hydra regrowth, keyboard focus, victory and reset');
  }
  for(const slug of ['cardinality-diagonal','ordinals-growth','hilbert-hotel','cantor-infinity-dispute','cantor-set','cantor-function','algebraic-transcendental-numbers','mathematical-induction','googology']){
    await call('Page.navigate',{url:origin+'/articles/transfinite-numbers'});await wait('!!document.querySelector(".bit-grid")');
    await click('app-transfinite-numbers a[routerlink="/articles/'+slug+'"]');
    await wait(`!!document.querySelector('a[routerlink="/articles/transfinite-numbers"]')`);
    await click('a[routerlink="/articles/transfinite-numbers"]');await wait('!!document.querySelector(".bit-grid")');
  }
  assert.equal(errors.length,0,errors.join('\n'));
  console.log('PASS transfinite browser audit: nine reciprocal journeys. Screenshots: tmp/transfinite-audit');

}
main().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => {
  clearTimeout(watchdog);
  if (socket) socket.close();
  if (browser) { browser.kill(); await pause(500); }
  if (server) server.close();
  const resolved = path.resolve(profile), prefix = path.resolve(os.tmpdir(), 'danisagan-anecdotes-math-support-audit-');
  if (!resolved.startsWith(prefix)) throw Error('Unexpected browser profile path.');
  try { fs.rmSync(resolved, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 }); } catch { /* Chrome may retain a short-lived file lock. */ }
});


