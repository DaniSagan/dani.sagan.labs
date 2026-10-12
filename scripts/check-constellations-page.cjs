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
  const component="ng.getComponent(document.querySelector('app-constellation-recognition'))";
  const apply=async expression=>{await evaluate(component+'.'+expression);await evaluate('ng.applyChanges('+component+')');await pause(90);};
  const state=expression=>evaluate(component+'.'+expression);
  async function mount(){for(let i=0;i<100;i++){if(await evaluate("!!document.querySelector('app-constellation-recognition .sky')"))return;await pause(100);}throw Error('Game did not mount');}
  const presentation=async(lines,names)=>{assert.equal(await evaluate("!!document.querySelector('.constellation-lines')"),lines);assert.equal(await evaluate("!!document.querySelector('.star-labels')"),names);};
  await call('Page.navigate',{url:origin+'/games/constellations'});await mount();
  assert(await evaluate("!!document.querySelector('app-games-navbar a[href=\"/games/constellations\"]')"));
  await presentation(true,true);
  for(const hemisphere of ['north','south'])for(const difficulty of [1,2,3]){
    await apply('setup()');await apply(`configureHemisphere('${hemisphere}')`);await apply(`difficulty=${difficulty}`);await apply('count=17');await apply('start()');
    assert.equal(await state('questions.length'),17);
    await presentation(difficulty<=2,difficulty===1);
    if(difficulty===3){await apply('hint()');await presentation(true,false);await apply('hint()');await presentation(true,true);}
    // Select one deliberately incorrect answer through the rendered button.
    const wrong=await state(`question.options.findIndex(o=>o.id!==${component}.target.id)`);
    await evaluate(`document.querySelectorAll('.answer-options button')[${wrong}].click()`);await pause(100);await evaluate('ng.applyChanges('+component+')');
    assert.equal(await state('answer.correct'),false);await presentation(true,true);assert(await evaluate("!!document.querySelector('.incorrect')"));
    await apply('next()');
    for(let i=1;i<17;i++){
      await presentation(difficulty<=2,difficulty===1);
      await evaluate(`(()=>{const c=${component};const i=c.question.options.findIndex(o=>o.id===c.target.id);document.querySelectorAll('.answer-options button')[i].click();})()`);await pause(30);await apply('next()');
    }
    assert.equal(await state('mode'),'results');assert.equal(await state('correct'),16);assert(await evaluate("!!document.querySelector('.results')"));
    await apply('retryMissed()');assert.equal(await state('questions.length'),1);assert.equal(await state('practiceRound'),true);await apply(`choose(${component}.target.id)`);await apply('next()');
    assert.equal(await state('mode'),'results');await apply('setup()');
  }
  // Reload before native interaction: debug applyChanges creates views outside NgZone.
  await call('Page.reload');await mount();
  await evaluate("document.querySelectorAll('.difficulty-list button')[2].click()");await pause(150);
  await evaluate("document.querySelector('.configuration .primary').click()");await pause(150);
  assert.equal(await state('mode'),'quiz');await presentation(false,false);
  const wrongIndex=await state(`question.options.findIndex(o=>o.id!==${component}.target.id)`);
  await evaluate(`document.querySelectorAll('.answer-options button')[${wrongIndex}].scrollIntoView({behavior:'instant',block:'center'})`);await pause(100);
  const hit=await evaluate(`(()=>{const r=document.querySelectorAll('.answer-options button')[${wrongIndex}].getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}})()`);
  await call('Input.dispatchMouseEvent',{type:'mousePressed',x:hit.x,y:hit.y,button:'left',clickCount:1});
  await call('Input.dispatchMouseEvent',{type:'mouseReleased',x:hit.x,y:hit.y,button:'left',clickCount:1});
  let updated=false;for(let i=0;i<30;i++){updated=await evaluate("!!document.querySelector('.feedback') && !!document.querySelector('.incorrect') && !!document.querySelector('.star-labels')");if(updated)break;await pause(100);}if(!updated){console.log('Native debug',await evaluate(`JSON.stringify({mode:${component}.mode,index:${component}.index,answer:${component}.answer,pending:${component}.pendingExit})`),await evaluate(`document.elementFromPoint(${hit.x},${hit.y})?.outerHTML`),await evaluate("document.querySelector('.answer-options').outerHTML"));const shot=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(os.tmpdir(),'danisagan-constellations-debug.png'),Buffer.from(shot.data,'base64'));}assert(updated,'Native click did not update feedback');await apply('setup()');
  await apply('atlas()');
  for(const hemisphere of ['north','south']){await apply(`configureHemisphere('${hemisphere}')`);const ids=await state('candidates.map(c=>c.id)');for(const id of ids){await apply(`inspect('${id}')`);await presentation(true,true);const geometry=await evaluate("[...document.querySelectorAll('.sky circle,.sky text,.sky line')].every(el=>!el.outerHTML.includes('NaN')&&!el.outerHTML.includes('Infinity'))");assert(geometry,'Invalid geometry for '+id);}}
  await apply("configureHemisphere('north')");await apply("inspect('Cas')");
  for(const width of [1440,768,390,320]){await call('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width<500});await pause(100);assert(await evaluate('document.documentElement.scrollWidth<=innerWidth'),'Overflow at '+width);}
  await apply('setZoom(1)');assert.equal(await state('zoom'),2);assert(await evaluate("document.querySelector('.sky-scroll').scrollWidth>document.querySelector('.sky-scroll').clientWidth"));assert(await evaluate('document.documentElement.scrollWidth<=innerWidth'));await apply('setZoom(-1)');
  await apply('setup()');await apply('difficulty=3');await apply('start()');await presentation(false,false);await apply('pendingExit=true');await apply('setup()');await presentation(false,false);
  const mastery=await state('mastered.size');assert(mastery>0);await call('Page.reload');await mount();assert.equal(await state('mastered.size'),mastery);
  await apply('atlas()');await apply("inspect('Cas')");
  for(const [label,width,height] of [['desktop',1440,1000],['mobile',390,1000]]){await call('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<500});await pause(150);await evaluate("document.querySelector('.sky-panel').scrollIntoView({behavior:'instant',block:'start'})");await pause(150);const shot=await call('Page.captureScreenshot',{format:'png'});const file=path.join(os.tmpdir(),'danisagan-constellations-'+label+'.png');fs.writeFileSync(file,Buffer.from(shot.data,'base64'));console.log('Screenshot: '+file);}
  assert.equal(errors.length,0,errors.join('\n'));
  console.log('PASS: actual menu/route, six full rounds, all 33 figures, three strict rendering levels, hints, feedback, review, atlas, zoom, local progress; desktop/tablet/mobile/320px; no runtime exceptions.');
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


