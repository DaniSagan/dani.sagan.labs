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
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'danisagan-prime-decomposition-audit-'));
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
    } catch (error) {
      if (!['EBUSY', 'ENOENT'].includes(error.code)) throw error;
    }
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


  const component = "ng.getComponent(document.querySelector('app-prime-decomposition'))";
  await call('Page.navigate', {url: origin + '/tools/prime-decomposition'});
  const wait = async expression => { for(let i=0;i<200;i++){if(await evaluate(expression))return;await pause(100);}throw Error('Timed out '+expression); };
  await wait("!!document.querySelector('#factor-integer')");
  const click = async selector => {
    await evaluate('document.querySelector('+JSON.stringify(selector)+').scrollIntoView({block:"center",behavior:"instant"})');
    const p=await evaluate('(()=>{const r=document.querySelector('+JSON.stringify(selector)+').getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2}})()');
    await call('Input.dispatchMouseEvent',{type:'mousePressed',...p,button:'left',buttons:1,clickCount:1});
    await call('Input.dispatchMouseEvent',{type:'mouseReleased',...p,button:'left',buttons:0,clickCount:1});
  };
  const enter = async text => { await evaluate("document.querySelector('#factor-integer').focus();document.querySelector('#factor-integer').select()");await call('Input.insertText',{text}); };
  const run = async text => {await enter(text);await click('.primary');await wait('!'+component+'.working');};
  await run('9007199254740993');
  assert.equal(await evaluate(component+'.result.input'),'9007199254740993');
  assert((await evaluate("document.querySelector('.identity').textContent")).includes('28059810762433'));
  await run('170141183460469231731687303715884105727');
  assert(await evaluate(component+'.probable'));
  assert((await evaluate("document.querySelector('.certainty').textContent")).includes('32'));
  const selectProof = async enabled => {
    await evaluate("document.querySelector('#factor-proof').focus()");
    const key = enabled ? 'End' : 'Home', code = enabled ? 35 : 36;
    await call('Input.dispatchKeyEvent', { type: 'keyDown', key, code: key, windowsVirtualKeyCode: code });
    await call('Input.dispatchKeyEvent', { type: 'keyUp', key, code: key, windowsVirtualKeyCode: code });
    await wait(component + '.requireProof===' + enabled);
  };
  await selectProof(true);
  await run('170141183460469231731687303715884105727');
  assert.equal(await evaluate(component+'.result.factors[0].certainty'), 'prime');
  assert((await evaluate(component+'.result.factors[0].proof')).includes('Lucas'));
  await run('18446744073709551629');
  assert.equal(await evaluate(component+'.result.factors[0].certainty'), 'prime');
  assert((await evaluate(component+'.result.factors[0].proof')).includes('Pocklington'));
  assert((await evaluate("document.querySelector('.factor-card').textContent")).includes('Pocklington'));
  await selectProof(false);
  for(const invalid of ['0','12.5','1e30','123oops']){await run(invalid);assert(await evaluate('!!'+component+'.error'));assert.equal(await evaluate(component+'.result'),null);}
  await run('-360');assert.equal(await evaluate(component+'.result.factors.length'),3);
  for(const unit of ['1','-1']){await run(unit);assert((await evaluate("document.querySelector('.result-panel').textContent")).includes('unidades'));}
  const hard='1522605027922533360535618378132637429718068114961380688657908494580122963258952897654000350692006139';
  await evaluate("document.querySelector('#factor-time').focus()");
  await call('Input.dispatchKeyEvent', { type: 'keyDown', key: 'End', code: 'End', windowsVirtualKeyCode: 35 });
  await call('Input.dispatchKeyEvent', { type: 'keyUp', key: 'End', code: 'End', windowsVirtualKeyCode: 35 });
  await wait(component+'.seconds===null');
  await enter(hard);await click('.primary');await wait(component+'.working');
  assert(await evaluate("document.querySelector('.activity').getAttribute('aria-valuenow')===null"),'no invented percentage');
  await evaluate('window.heartbeat=0;window.beat=setInterval(()=>window.heartbeat++,20)');
  await pause(250);assert((await evaluate('window.heartbeat'))>=3,'UI responsive during worker computation');
  await click('.controls button[type=button]');await evaluate('clearInterval(window.beat)');
  assert(!(await evaluate(component+'.working')));assert(await evaluate(component+'.stopped'));
  await evaluate("document.querySelector('#factor-time').focus()");
  await call('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowUp', code: 'ArrowUp', windowsVirtualKeyCode: 38 });
  await call('Input.dispatchKeyEvent', { type: 'keyUp', key: 'ArrowUp', code: 'ArrowUp', windowsVirtualKeyCode: 38 });
  await wait(component+'.seconds===600');
  await run('360');await pause(250);assert.equal(await evaluate(component+'.result.input'),'360','stale worker cannot replace new result');
  await enter('360');await evaluate("document.querySelector('.primary').focus()");
  await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r'});
  await call('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
  await wait('!'+component+'.working');assert.equal(await evaluate(component+'.result.status'),'complete');
  await evaluate('(()=>{const c='+component+';c.seconds=5;ng.applyChanges(c)})()');
  await enter(hard);await click('.primary');await wait('!'+component+'.working');
  assert.equal(await evaluate(component+'.result.status'),'partial','time budget keeps unresolved cofactors');
  await run((2n**4096n).toString());assert.equal(await evaluate(component+'.result.factors[0].exponent'),4096);
  const shots=path.resolve('tmp/prime-decomposition-audit');fs.mkdirSync(shots,{recursive:true});
  for(const width of [1440,768,390,320]){
    await call('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width<500});await pause(250);
    assert(await evaluate("[...document.querySelectorAll('.input-panel,.result-panel,.identity,.factor-card')].every(e=>e.scrollWidth<=e.clientWidth+2)"),'content overflow '+width);
    if(width===1440||width===390){await evaluate("document.querySelector('.result-panel').scrollIntoView({block:'start',behavior:'instant'})");const shot=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(shots,'result-'+width+'.png'),Buffer.from(shot.data,'base64'));}
  }
  await call('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});
  await evaluate("document.querySelector('.examples button').scrollIntoView({block:'center',behavior:'instant'})");
  const p=await evaluate("(()=>{const r=document.querySelector('.examples button').getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2}})()");
  await call('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...p,id:1}]});await call('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await wait('!'+component+'.working');assert.equal(await evaluate(component+'.result.input'),'360');
  await enter(hard);await click('.primary');await evaluate('void(window.departingFactorizer='+component+')');
  await click('app-prime-decomposition-article > p a');await wait("!document.querySelector('app-prime-decomposition')");
  assert(await evaluate('!window.departingFactorizer.working'),'route destruction terminates worker');
  assert.equal(errors.length,0,errors.join('\n'));
  console.log('PASS real worker; exact large inputs; PRP labels; invalid inputs; signs/units; keyboard/touch; responsive UI; cancellation/restart/navigation; 5-second timeout; 1234 digits; no overflow at 1440/768/390/320px. Screenshots: tmp/prime-decomposition-audit');
}
main().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => {
  clearTimeout(watchdog);
  if (socket) socket.close();
  if (browser) { browser.kill(); await pause(500); }
  if (server) server.close();
  const resolved = path.resolve(profile), prefix = path.resolve(os.tmpdir(), 'danisagan-prime-decomposition-audit-');
  if (!resolved.startsWith(prefix)) throw Error('Unexpected browser profile path.');
  try { fs.rmSync(resolved, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 }); } catch { /* Chrome may retain a short-lived file lock. */ }
});


