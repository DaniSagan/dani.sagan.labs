/* Browser smoke test against an existing development build; no external browser package required. */
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const http = require('node:http');
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');
const WebSocket = require('ws');
const { curves } = require('./generate-additional-curve-articles.cjs');
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist/dani.sagan.labs/browser');
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'danisagan-curve-audit-'));
const chrome = process.env.CHROME_BIN || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
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
  browser = spawn(chrome, ['--headless=new', '--no-sandbox', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
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
  await call('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await call('Page.navigate', { url: origin + '/articles' });
  for (let i = 0; i < 100; i++) { if (await evaluate("!!document.querySelector('app-articles-navbar input[type=search]')")) break; await pause(100); }
  for (let i = 0; i < curves.length; i++) {
    const c = curves[i];
    const selector = 'app-' + c.slug + '-article';
    const clicked = await evaluate(`(() => { const input = document.querySelector('app-articles-navbar input[type=search]'); input.value = ${JSON.stringify(c.title)}; input.dispatchEvent(new Event('input', { bubbles: true })); return true; })()`);
    assert(clicked);
    await pause(50);
    assert(await evaluate(`(() => { const link = [...document.querySelectorAll('app-articles-navbar a')].find(a => new URL(a.href).pathname === '/articles/${c.slug}'); if (!link) return false; link.click(); return true; })()`), 'Missing menu link: ' + c.slug);
    let ready = false;
    for (let retry = 0; retry < 100; retry++) {
      ready = await evaluate(`!!document.querySelector('${selector} canvas')`);
      if (ready) break;
      await pause(50);
    }
    assert(ready, 'Article failed to mount: ' + c.slug);
    await pause(80);
    const state = await evaluate(`(() => { const article = document.querySelector('${selector}'); const canvas = article.querySelector('canvas'); const pixels = canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data; let red = 0; for (let i=0;i<pixels.length;i+=4) if(pixels[i]>180 && pixels[i+1]<160 && pixels[i+2]<140) red++; return { path: location.pathname, title: article.querySelector('h2').textContent, red, links: [...article.querySelectorAll('a[routerlink]')].map(a=>new URL(a.href).pathname), width: canvas.width }; })()`);
    assert.equal(state.path, '/articles/' + c.slug);
    assert.equal(state.title, c.title);
    assert(state.red > 5, c.slug + ': empty drawing');
    assert(state.width >= 200, c.slug + ': canvas not sized');
    assert(state.links.length >= 2, c.slug + ': missing learning links');
    const changed = await evaluate(`(() => { const article = document.querySelector('${selector}'); const component = ng.getComponent(article); const input = article.querySelector('input[type=number]'); input.value = ${JSON.stringify(String(c.parameter.max))}; input.dispatchEvent(new Event('input', {bubbles:true})); return true; })()`);
    assert(changed);
    await pause(30);
    assert.equal(await evaluate(`ng.getComponent(document.querySelector('${selector}')).parameter`), c.parameter.max);
    await evaluate(`document.querySelector('${selector} .curve-reset').click()`);
    await pause(20);
    assert.equal(await evaluate(`ng.getComponent(document.querySelector('${selector}')).parameter`), c.parameter.value);
    if ((i + 1) % 20 === 0) console.log(`Visited ${i + 1}/100 articles through menu links; drawings and controls verified.`);
  }
  await call('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await evaluate("document.querySelector('app-articles-navbar input[type=search]').value = ''");
  await pause(100);
  const overflow = await evaluate('document.documentElement.scrollWidth > innerWidth + 2');
  assert(!overflow, 'Mobile page has horizontal overflow.');
  assert.equal(errors.length, 0, errors.join('\n'));
  console.log('PASS: 100 menu destinations, article headings, nonempty drawings, controls and resets; mobile width; no JavaScript exceptions.');
}
main().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => {
  clearTimeout(watchdog);
  if (socket) socket.close();
  if (browser) { browser.kill(); await pause(500); }
  if (server) server.close();
  const resolved = path.resolve(profile), prefix = path.resolve(os.tmpdir(), 'danisagan-curve-audit-');
  if (!resolved.startsWith(prefix)) throw Error('Unexpected browser profile path.');
  try { fs.rmSync(resolved, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 }); } catch { /* Chrome may retain a short-lived file lock. */ }
});
