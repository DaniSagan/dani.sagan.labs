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


  const wait=async expression=>{for(let i=0;i<200;i++){if(await evaluate(expression))return;await pause(100);}throw Error('Timed out '+expression);};
  const sel=kind=>'app-surreal-lab[kind="'+kind+'"]';
  const nodeText=selector=>evaluate('document.querySelector('+JSON.stringify(selector)+').textContent');
  const focus=async selector=>{await evaluate('document.querySelector('+JSON.stringify(selector)+').scrollIntoView({block:"center",behavior:"instant"});document.querySelector('+JSON.stringify(selector)+').focus()');await pause(70);};
  const key=async (key,code=key,modifiers=0)=>{await call('Input.dispatchKeyEvent',{type:'keyDown',key,code,modifiers,text:key==='Enter'?'\r':undefined,windowsVirtualKeyCode:({Enter:13,Tab:9,End:35,Home:36}[key]||0)});await call('Input.dispatchKeyEvent',{type:'keyUp',key,code,modifiers,windowsVirtualKeyCode:({Enter:13,Tab:9,End:35,Home:36}[key]||0)});await pause(80);};
  const point=async selector=>{await evaluate('document.querySelector('+JSON.stringify(selector)+').scrollIntoView({block:"center",behavior:"instant"})');await pause(80);return evaluate('(()=>{const r=document.querySelector('+JSON.stringify(selector)+').getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2}})()');};
  const click=async selector=>{const p=await point(selector);await call('Input.dispatchMouseEvent',{type:'mousePressed',...p,button:'left',buttons:1,clickCount:1});await call('Input.dispatchMouseEvent',{type:'mouseReleased',...p,button:'left',buttons:0,clickCount:1});await pause(100);};
  const touch=async selector=>{const p=await point(selector);await call('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...p,id:1,radiusX:5,radiusY:5,force:1}]});await call('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await pause(100);};
  const type=async (selector,value)=>{await focus(selector);await evaluate('document.querySelector('+JSON.stringify(selector)+').select()');await call('Input.insertText',{text:value});await pause(100);};
  const choose=async(selector,last)=>{await focus(selector);await key(last?'End':'Home');await key('Tab');};
  const shots=path.resolve('tmp/surreal-browser');fs.mkdirSync(shots,{recursive:true});
  let formulas=0;
  for(const width of (process.env.SURREAL_JOURNEYS_ONLY?[]:[1440,768,390,320])){
    await call('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width<600});
    await call('Emulation.setTouchEmulationEnabled',{enabled:width<600});
    await call('Page.navigate',{url:origin+'/articles/surreal-numbers'});
    await wait('!!document.querySelector("app-surreal-numbers app-surreal-lab")');
    await wait('document.querySelectorAll("app-surreal-numbers mjx-container").length>=13');
    formulas=await evaluate('document.querySelectorAll("app-surreal-numbers mjx-container").length');
    assert.equal(await evaluate('document.querySelectorAll("app-surreal-lab").length'),8);
    assert(await evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'Page overflow at '+width);
    assert.equal(await evaluate('document.querySelectorAll("app-surreal-numbers mjx-merror,app-surreal-numbers [data-mjx-error]").length'),0);
    await focus('#surreal-day');await key('End');assert.equal(await evaluate('document.querySelectorAll("app-surreal-lab[kind=tree] .number-tree g").length'),63);
    await click(sel('tree')+' .view-switch button:last-child');assert(await evaluate('!!document.querySelector(".number-line")'));
    await choose(sel('tree')+' select',true);assert.equal(await nodeText(sel('tree')+' .result strong'),'5');
    await click(sel('tree')+' .reset');assert.equal(await nodeText(sel('tree')+' .result strong'),'1/2');
    await type('#surreal-left','1/2');await type('#surreal-right','3/4');await click('#surreal-evaluate');assert.equal(await nodeText(sel('cut')+' .result strong'),'5/8');
    await click(sel('cut')+' .presets button:nth-child(3)');assert((await nodeText(sel('cut')+' [role=alert]')).includes('menor'));
    await click(sel('cut')+' .reset');assert.equal(await nodeText(sel('cut')+' .result strong'),'1');
    await choose('#surreal-op',true);assert.equal((await nodeText(sel('arithmetic')+' .equation')).trim(),'1/2 × 1/2 = 1/4');
    await choose('#surreal-a',false);assert((await nodeText(sel('arithmetic')+' .equation')).includes('= -1'));
    await click(sel('arithmetic')+' .reset');assert((await nodeText(sel('arithmetic')+' .equation')).includes('= 1'));
    const activate=width<600?touch:click;
    await activate('#surreal-plus');assert.equal(await nodeText(sel('signs')+' .result strong'),'7/8');
    await click(sel('signs')+' .reset');assert.equal(await nodeText(sel('signs')+' .result strong'),'3/4');
    await focus('#surreal-precision');await key('End');assert((await nodeText(sel('reals'))).includes('1/4096'));
    await choose('#surreal-real',true);assert((await nodeText(sel('reals')+' .bracket')).includes('√2'));
    await focus('#surreal-probe');await key('End');assert((await nodeText(sel('infinity')+' .result')).includes('1/128'));
    await choose('#surreal-scale-pair',true);assert((await nodeText(sel('infinity')+' .equation')).includes('='));
    await click('#surreal-start');await click(sel('hackenbush')+' .stalk g.red');assert.equal(await evaluate('document.querySelectorAll(".stalk g").length'),3);
    await activate(sel('hackenbush')+' .edge-actions button:first-child');assert((await nodeText('#surreal-game-status')).includes('Gana Azul'));
    await click(sel('hackenbush')+' .controls button:last-child');assert.equal(await evaluate('document.querySelectorAll(".stalk g").length'),3);
    await click(sel('hackenbush')+' .reset');assert((await nodeText('#surreal-game-status')).includes('preparado'));
    await click(sel('quiz')+' .quiz-answers button:nth-child(2)');assert((await nodeText(sel('quiz')+' [role=status]')).includes('Revisa'));
    await focus(sel('quiz')+' .quiz-answers button:first-child');await key('Enter');assert((await nodeText(sel('quiz')+' [role=status]')).includes('Exacto'));
    await click(sel('quiz')+' .reset');assert.equal(await evaluate('document.querySelector("app-surreal-lab[kind=quiz] [role=status]")'),null);
    await evaluate('document.querySelector(".historical-portraits").scrollIntoView({block:"center",behavior:"instant"})');
    await wait('Array.from(document.querySelectorAll("app-surreal-numbers img")).every(i=>i.complete&&i.naturalWidth>0)');
    await evaluate('document.querySelector("#days").scrollIntoView({block:"start",behavior:"instant"})');
    fs.writeFileSync(path.join(shots,'tree-'+width+'.png'),Buffer.from((await call('Page.captureScreenshot',{format:'png'})).data,'base64'));
    await evaluate('document.querySelector("app-surreal-lab[kind=hackenbush]").scrollIntoView({block:"start",behavior:"instant"})');
    fs.writeFileSync(path.join(shots,'hackenbush-'+width+'.png'),Buffer.from((await call('Page.captureScreenshot',{format:'png'})).data,'base64'));
    assert(await evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'Overflow after interactions at '+width);
    console.log('PASS all eight labs at '+width+'px: native keyboard, '+(width<600?'physical touch':'mouse')+', exact results, invalid cut, game legality/win/undo, quiz, resets, images and '+formulas+' formulas.');
  }
  const links=[...new Set(fs.readFileSync('src/app/articles/topology/surreal-numbers/surreal-numbers.component.html','utf8').matchAll(/routerLink="\/articles\/([^"#]+)"/g))].map(m=>m[1]);
  for(const route of new Set(links)){
    console.log('Checking reciprocal journey: '+route);
    await call('Page.navigate',{url:origin+'/articles/'+route});await wait('!!document.querySelector('+JSON.stringify('.body-text a[routerLink="/articles/surreal-numbers"]')+')');
    await focus('.body-text a[routerLink="/articles/surreal-numbers"]');await key('Enter');await wait('!!document.querySelector("app-surreal-numbers h2")');
  }
  assert.equal(errors.length,0,errors.join('\n'));
  fs.writeFileSync('tmp/surreal-browser-result.json',JSON.stringify({widths:process.env.SURREAL_JOURNEYS_ONLY?[]:[1440,768,390,320],labs:8,formulas,reciprocalJourneys:new Set(links).size,errors},null,2));
  console.log('PASS all reciprocal journeys and no runtime errors. Screenshots: tmp/surreal-browser.');
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



