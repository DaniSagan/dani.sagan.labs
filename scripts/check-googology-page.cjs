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
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'danisagan-googology-audit-'));
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
  await call('Page.navigate', { url: origin + '/articles/googology' });
  let ready = false;
  for (let i = 0; i < 150; i++) {
    ready = await evaluate("!!document.querySelector('app-googology-article #factory-base')");
    if (ready) break; await pause(100);
  }
  assert(ready, 'Article did not mount.');
  const component = "ng.getComponent(document.querySelector('app-googology-article'))";
  const change = async (selector, value) => {
    await evaluate(`(() => { const input = document.querySelector(${JSON.stringify(selector)}); input.value = ${JSON.stringify(String(value))}; input.dispatchEvent(new Event('input', { bubbles: true })); })()`);
    await pause(60);
  };
  const select = async (selector, index) => {
    await evaluate(`(() => { const input = document.querySelector(${JSON.stringify(selector)}); input.selectedIndex = ${index}; input.dispatchEvent(new Event('change', { bubbles: true })); })()`);
    await pause(100);
  };
  const state = async expression => evaluate(component + '.' + expression);
  const open = async key => {
    await evaluate(`(() => { const panel = [...document.querySelectorAll('app-googology-article details')].find(d => d.getAttribute('data-panel') === '${key}'); panel.open = true; })()`);
    await pause(200);
  };
  assert.equal(await state('factoryResult.value.toString()'), '27');
  await select('#factory-operation', 3);
  assert.equal(await state('factoryResult.value.toString()'), '7625597484987');
  await select('#factory-operation', 5); await change('#factory-base', 10); await change('#factory-operand', 6); await change('#factory-iterations', 6);
  assert.equal(await state('factoryResult.status'), 'Simbólico');
  await change('#factory-base', ''); assert(await state('factoryError.length') > 0);
  await evaluate(component + '.resetFactory()');
  for (let i = 0; i < 10; i++) {
    await evaluate(`document.querySelectorAll('app-googology-article .milestones button')[${i}].click()`);
    await pause(60);
    assert.equal(await state('selectedMilestone'), i);
  }
  await open('writing');
  await evaluate(component + ".writingPreset('googolplex')"); await pause(60);
  assert.equal(await state('writingError'), '');
  assert.equal(await state('writingDigits.length'), 101);
  await change('#writing-digits', ''); assert(await state('writingError.length') > 0);
  await evaluate(component + ".writingPreset('googol')");
  await open('towers'); await change('#tower-height', 12);
  assert.equal(await state('towerResult.status'), 'Simbólico');
  await open('growth');
  await evaluate(component + ".toggleFunction('tower')"); await change('#growth-n', 12);
  await select('#growth-scale', 0);
  assert.equal(await evaluate("document.querySelectorAll('app-googology-article .growth-chart polyline').length"), 6);
  assert(await state("growthPaths.every(p => !/Infinity|NaN/.test(p.points))"));
  await select('#growth-scale', 1);
  await open('trees');
  for (let i = 0; i < 4; i++) {
    await select('#tree-example', i);
    assert.equal(await state('treeMap !== null'), [true,false,false,true][i]);
  }
  await evaluate(component + '.addNode(' + component + '.sourceTree)'); await pause(100);
  assert.equal(await state('sourceTree.parents.length'), 3);
  await evaluate(component + '.sequenceRepeated = true'); assert.equal(await state('sequenceValid'), false);
  await open('machine'); await select('#machine-select', 2);
  await evaluate("document.querySelector('#machine-run').click()"); await pause(100);
  assert.equal(await state('machineState.steps'), 21); assert.equal(await state('machineState.status'), 'Detenida');
  await select('#machine-select', 3);
  for(let i=0;i<8;i++) await evaluate("document.querySelector('#machine-run').click()");
  assert.equal(await state('machineState.status'), 'Límite alcanzado');
  await open('modular'); await change('#modular-base', 10); await change('#modular-exponent', 0);
  assert.equal(await state('modularResult'), '000001');
  await change('#modular-base', 0); assert(await state('modularError.length') > 0);
  await change('#modular-base', 7); await change('#modular-exponent', 1000);
  await select('#challenge-select', 2);
  await evaluate("[...document.querySelectorAll('app-googology-article button')].find(b => b.textContent.trim() === 'La izquierda').click()");
  assert.equal(await state('answers[2]'), 'left');
  let typeset = 0;
  for(let i=0;i<80;i++) { typeset = await evaluate("document.querySelectorAll('app-googology-article mjx-container').length"); if(typeset > 10) break; await pause(100); }
  console.log('MathJax audit:', await evaluate("JSON.stringify({ containers: document.querySelectorAll('app-googology-article mjx-container').length, ready: window.MathJax?.isReady, typeset: typeof window.MathJax?.typesetPromise, scripts: [...document.scripts].map(s=>s.src).filter(s=>s.includes('mathjax')) })"));
  assert(typeset > 10, 'MathJax did not render the formulas.');
  assert.equal(await evaluate("document.querySelectorAll('app-googology-article [data-mjx-error], app-googology-article mjx-merror').length"), 0);
  for (const width of [1440, 768, 390]) {
    await call('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: width < 700 });
    await pause(150);
    assert(!await evaluate('document.documentElement.scrollWidth > innerWidth + 2'), 'Overflow at ' + width);
  }
  await call('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await evaluate("(() => { const page = ng.getComponent(document.querySelector('app-googology-article')); page.selectedMilestone = 2; document.documentElement.style.scrollBehavior = 'auto'; })()");
  await pause(200);
  await evaluate("document.querySelector('app-googology-article .explorer').scrollIntoView({ behavior: 'instant', block: 'start' })");
  await pause(100);
  const screenshot = await call('Page.captureScreenshot', { format: 'png' });
  const desktop = path.join(os.tmpdir(), 'danisagan-googology-desktop.png');
  fs.writeFileSync(desktop, Buffer.from(screenshot.data, 'base64')); console.log('Screenshot: ' + desktop);
  await call('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await evaluate("document.querySelector('app-googology-article .explorer').scrollIntoView({ behavior: 'instant', block: 'start' })"); await pause(100);
  const mobileShot = await call('Page.captureScreenshot', { format: 'png' });
  const mobile = path.join(os.tmpdir(), 'danisagan-googology-mobile.png');
  fs.writeFileSync(mobile, Buffer.from(mobileShot.data, 'base64')); console.log('Screenshot: ' + mobile);
  const links = await evaluate("[...document.querySelectorAll('app-googology-article a[href]')].map(a => new URL(a.href).pathname).filter(p => p.startsWith('/articles/') && p !== '/articles/googology')");
  for (const destination of [...new Set(links)]) {
    await call('Page.navigate', { url: origin + destination });
    let mounted = false;
    for (let i=0;i<80;i++) { mounted = await evaluate("!!document.querySelector('router-outlet + * h2')"); if(mounted) break; await pause(100); }
    assert(mounted, 'Learning destination failed: ' + destination);
  }
  await call('Page.navigate', { url: origin + '/articles/googology' });
  for (let i=0;i<100;i++) { if (await evaluate("!!document.querySelector('app-articles-navbar input[type=search]')")) break; await pause(100); }
  await change('app-articles-navbar input[type=search]', 'Goog');
  assert(await evaluate("!!document.querySelector('app-articles-navbar a[href=\"/articles/googology\"]')"), 'Article missing from actual menu');
  assert.equal(errors.length, 0, errors.join('\n'));
  console.log('PASS: all ten milestones, factory, towers, writing, growth scales, trees, Turing, modular calculator, quiz; MathJax formulas; desktop/tablet/mobile; actual learning routes and menu; no JavaScript exceptions.');
}
main().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => {
  clearTimeout(watchdog);
  if (socket) socket.close();
  if (browser) { browser.kill(); await pause(500); }
  if (server) server.close();
  const resolved = path.resolve(profile), prefix = path.resolve(os.tmpdir(), 'danisagan-googology-audit-');
  if (!resolved.startsWith(prefix)) throw Error('Unexpected browser profile path.');
  try { fs.rmSync(resolved, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 }); } catch { /* Chrome may retain a short-lived file lock. */ }
});
