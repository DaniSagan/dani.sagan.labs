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
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'danisagan-pi-decimals-audit-'));
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


  const component="ng.getComponent(document.querySelector('app-pi-decimal'))";
  await call('Page.navigate',{url:origin+'/tools/pi-decimals'});
  const wait=async expression=>{for(let i=0;i<250;i++){if(await evaluate(expression))return;await pause(100);}throw Error('Timed out '+expression);};
  await wait("!!document.querySelector('#decimals')");
  const click=async selector=>{
    await evaluate('document.querySelector('+JSON.stringify(selector)+').scrollIntoView({block:"center",behavior:"instant"})');
    const p=await evaluate('(()=>{const r=document.querySelector('+JSON.stringify(selector)+').getClientRects()[0];return{x:r.left+r.width/2,y:r.top+r.height/2}})()');
    await call('Input.dispatchMouseEvent',{type:'mousePressed',...p,button:'left',buttons:1,clickCount:1});await call('Input.dispatchMouseEvent',{type:'mouseReleased',...p,button:'left',buttons:0,clickCount:1});
  };
  const enter=async(selector,text)=>{await evaluate('document.querySelector('+JSON.stringify(selector)+').focus();document.querySelector('+JSON.stringify(selector)+').select()');await call('Input.insertText',{text});};
  const run=async n=>{await enter('#decimals',String(n));await click('.primary');await wait('!'+component+'.calculating');assert.equal(await evaluate(component+'.result.digits'),n);};
  await run(100000);
  assert.equal(await evaluate(component+'.result.decimals.length'), 100000);
  assert.equal(await evaluate(component+'.result.decimals.slice(-20)'), '67420805655493624646');
  await run(2500);
  const decimals=await evaluate(component+'.result.decimals');
  assert.equal(decimals.length,2500);assert(decimals.startsWith('141592653589793238462643383279'));
  await evaluate('window.savedPiResult='+component+'.result.decimals');
  await enter('#pi-block-size','7');await wait(component+'.blocks[0].text.length===7');
  assert.equal(await evaluate(component+'.pageSize'),994);
  await click('.pagination button:last-child');assert.equal(await evaluate(component+'.firstDigit'),995);
  await enter('#pi-block-size','0');await wait(component+'.blocks.length===1');
  assert.equal(await evaluate(component+'.firstDigit'),1);assert.equal(await evaluate(component+'.blocks[0].text.length'),1000);
  assert(await evaluate(component+'.result.decimals===window.savedPiResult'),'format change preserves calculation');
  await enter('#pi-block-size','13');await wait(component+'.blocks[0].text.length===13');
  const shots=path.resolve('tmp/pi-decimals-audit');fs.mkdirSync(shots,{recursive:true});
  const download=async format=>{
    const dir=path.join(shots,format);fs.mkdirSync(dir,{recursive:true});
    const file=path.join(dir,'pi-2500-decimales.txt');if(fs.existsSync(file))fs.unlinkSync(file);
    await call('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:dir});
    await click('.download');
    for(let i=0;i<100&&!fs.existsSync(file);i++)await pause(100);
    assert(fs.existsSync(file),'TXT actually downloaded');return fs.readFileSync(file,'utf8');
  };
  const grouped=await download('grouped');assert.equal(grouped.replace(/\s/g,''),'3.'+decimals);
  assert.equal(grouped, ['3.', ...decimals.match(/.{1,13}/g)].join('\r\n') + '\r\n');
  await click('.checkbox input');
  const plain=await download('plain');assert.equal(plain,'3.'+decimals+'\n');
  await enter('#decimals','12');assert.equal(await evaluate(component+'.result.digits'),2500,'result count independent from draft input');
  await run(0);assert.equal(await evaluate(component+'.result.decimals'),'');
  await enter('#decimals','10');await evaluate("document.querySelector('.primary').focus()");
  await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r'});
  await call('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});await wait('!'+component+'.calculating');assert.equal(await evaluate(component+'.result.decimals'),'1415926535');
  await enter('#decimals','1000000');await click('.primary');await wait(component+'.calculating');
  await evaluate('window.piBeats=0;window.piTimer=setInterval(()=>window.piBeats++,20)');await pause(200);
  assert((await evaluate('window.piBeats'))>=3,'main thread remains responsive');
  await click('.actions button[type=button]');await evaluate('clearInterval(window.piTimer)');assert(!(await evaluate(component+'.calculating')));
  await run(100);await pause(250);assert.equal(await evaluate(component+'.result.digits'),100,'stale result ignored after cancellation');
  await run(2500);
  for(const width of [1440,768,390,320]){
    await call('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width<500});await pause(250);
    assert(await evaluate("[...document.querySelectorAll('.panel,.decimal-result,.digit-blocks')].every(e=>e.scrollWidth<=e.clientWidth+2)"),'content overflow '+width);
    if(width===1440||width===390){await evaluate("document.querySelector('.result-panel').scrollIntoView({block:'start',behavior:'instant'})");const shot=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(shots,'result-'+width+'.png'),Buffer.from(shot.data,'base64'));}
  }
  await call('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});
  await evaluate("document.querySelector('.pagination button:last-child').scrollIntoView({block:'center',behavior:'instant'})");
  const point=await evaluate("(()=>{const r=document.querySelector('.pagination button:last-child').getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2}})()");
  await call('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...point,id:1}]});await call('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await wait(component+'.page===1');
  await call('Emulation.setTouchEmulationEnabled',{enabled:false});
  await call('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  await enter('#decimals','1000000');await click('.primary');await wait(component+'.calculating');await evaluate('void(window.departingPi='+component+')');
  await evaluate("document.querySelector('.method').open=true");await click('.method a[routerlink]');await wait("!!document.querySelector('app-numeration-article')");
  assert(await evaluate('!window.departingPi.calculating'),'navigation cancels worker');
  assert.equal(errors.length,0,errors.join('\n'));
  console.log('PASS actual worker; 2500 digits; live grouping and pagination; complete grouped/plain TXT downloads; draft vs computed precision; zero digits; keyboard/touch; million-digit cancellation and responsive UI; stale results; navigation; 1440/768/390/320px. Screenshots: tmp/pi-decimals-audit');
}
main().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => {
  clearTimeout(watchdog);
  if (socket) socket.close();
  if (browser) { browser.kill(); await pause(500); }
  if (server) server.close();
  const resolved = path.resolve(profile), prefix = path.resolve(os.tmpdir(), 'danisagan-pi-decimals-audit-');
  if (!resolved.startsWith(prefix)) throw Error('Unexpected browser profile path.');
  try { fs.rmSync(resolved, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 }); } catch { /* Chrome may retain a short-lived file lock. */ }
});


