// Real Chrome integration/visual audit; run after a development build.
const fs = require('node:fs'), path = require('node:path'), os = require('node:os'), http = require('node:http');
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict'), WebSocket = require('ws');
const dist = path.resolve('dist/dani.sagan.labs/browser');
const downloadDir = path.resolve('tmp/langton-downloads', String(Date.now()));
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'danisagan-langton-audit-'));
const pause = ms => new Promise(r => setTimeout(r, ms));
let server, browser, socket;
const watchdog = setTimeout(() => { console.error('Audit timeout'); process.exit(1); }, 600000);
async function main() {
  const mime = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.woff2': 'font/woff2', '.woff': 'font/woff', '.svg': 'image/svg+xml' };
  server = http.createServer((req, res) => { let f = path.resolve(dist, '.' + new URL(req.url, 'http://localhost').pathname); if (!f.startsWith(dist + path.sep) || !fs.existsSync(f) || !fs.statSync(f).isFile()) f = path.join(dist, 'index.html'); res.setHeader('Content-Type', mime[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(res); });
  await new Promise(r => server.listen(0, '127.0.0.1', r)); const origin = `http://127.0.0.1:${server.address().port}`;
  browser = spawn(process.env.CHROME_BIN || 'C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--no-sandbox', '--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--no-first-run', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
  let port; for (let i = 0; i < 120; i++) { const f = path.join(profile, 'DevToolsActivePort'); if (fs.existsSync(f)) { port = fs.readFileSync(f, 'utf8').split('\n')[0]; break; } await pause(100); }
  assert(port); const tabs = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  socket = new WebSocket(tabs.find(x => x.type === 'page').webSocketDebuggerUrl); await new Promise(r => socket.on('open', r));
  let id = 0; const pending = new Map(), errors = [];
  socket.on('message', raw => { const m = JSON.parse(raw); if (m.id) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.reject(Error(m.error.message)) : p.resolve(m.result); } else if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text) });
  const call = (method, params = {}) => new Promise((resolve, reject) => { const n = ++id; pending.set(n, { resolve, reject }); socket.send(JSON.stringify({ id: n, method, params })); });
  const evaluate = async expression => { const r = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (r.exceptionDetails) throw Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text); return r.result.value; };
  await call('Page.enable'); await call('Runtime.enable'); await call('Network.enable');
  // Serve the installed MathJax 3.2.2 files for the CDN requests in this audit.
  // The application configuration is unchanged; validation is network independent.
  const mathjaxRoot = path.resolve('node_modules/mathjax-full/es5');
  socket.on('message', async raw => {
    const m = JSON.parse(raw);
    if (m.method !== 'Fetch.requestPaused') return;
    try {
      const relative = new URL(m.params.request.url).pathname.split('/es5/')[1];
      const file = path.resolve(mathjaxRoot,relative || 'startup.js');
      if (!file.startsWith(mathjaxRoot+path.sep) || !fs.existsSync(file)) throw Error('Unexpected MathJax asset '+file);
      await call('Fetch.fulfillRequest',{requestId:m.params.requestId,responseCode:200,responseHeaders:[{name:'Content-Type',value:'application/javascript'}],body:fs.readFileSync(file).toString('base64')});
    } catch(error) { errors.push(error.message); await call('Fetch.failRequest',{requestId:m.params.requestId,errorReason:'Failed'}); }
  });
  await call('Fetch.enable',{patterns:[{urlPattern:'https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/*',requestStage:'Request'}]});

  await call('Emulation.setFocusEmulationEnabled',{enabled:true});
  fs.mkdirSync(downloadDir,{recursive:true});
  await call('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: downloadDir });



  const shots=path.resolve('tmp/langtons-ant-audit');fs.mkdirSync(shots,{recursive:true});
  await call('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  await call('Page.navigate',{url:origin+'/articles/langtons-ant'});
  for(let i=0;i<180;i++){if(await evaluate("!!document.querySelector('app-langtons-ant-lab canvas')"))break;await pause(100);}
  assert(await evaluate("!!document.querySelector('app-langtons-ant-lab canvas')"),'Article integrated');
  const component="ng.getComponent(document.querySelector('app-langtons-ant-lab'))";
  const run=code=>evaluate('(()=>{const c='+component+';const result=(()=>{'+code+'})();ng.applyChanges(c);return result;})()');
  const click=async text=>{assert(await evaluate('(()=>{const b=[...document.querySelectorAll("app-langtons-ant-lab button")].find(b=>b.textContent.trim()==='+JSON.stringify(text)+');if(!b)return false;b.click();return true})()'),'Button '+text);await pause(80)};
  await click('Avanzar un paso');assert.equal(await run('return c.engine.steps'),1);
  await click('Retroceder un paso');assert.equal(await run('return c.engine.steps'),0);
  await click('Iniciar');await pause(150);await click('Pausar');const paused=await run('return c.engine.steps');await pause(200);assert.equal(await run('return c.engine.steps'),paused);
  await click('Reiniciar');assert.equal(await run('return c.engine.steps'),0);
  await click('+10.000 pasos');for(let i=0;i<180;i++){if(await run('return !c.running'))break;await pause(100)}assert.equal(await run('return c.engine.steps'),10000);
  await click('+1.000 pasos');for(let i=0;i<90;i++){if(await run('return !c.running'))break;await pause(100)}assert.equal(await run('return c.engine.steps'),11000);
  await click('Analizar la autopista');assert(await run('return c.analysis.match'));assert.deepEqual(await run('return [c.analysis.dx,c.analysis.dy]'),[-2,-2]);
  await click('Ajustar regi\u00f3n');await evaluate("document.querySelector('app-langtons-ant-lab').scrollIntoView({block:'start',behavior:'instant'})");await pause(300);
  fs.writeFileSync(path.join(shots,'desktop.png'),Buffer.from((await call('Page.captureScreenshot',{format:'png'})).data,'base64'));
  // Stepwise preview must not commit until phase five.
  await click('Cl\u00e1sica desde cero');await evaluate("const i=[...document.querySelectorAll('app-langtons-ant-lab input[type=checkbox]')].find(i=>i.parentElement.textContent.includes('Entender'));i.click()");
  for(let i=0;i<4;i++)await click('Siguiente fase');assert.equal(await run('return c.engine.steps'),0);assert.equal(await run('return c.phase'),4);await click('Siguiente fase');assert.equal(await run('return c.engine.steps'),1);
  // Open panels through native summary controls.
  await evaluate("document.querySelectorAll('app-langtons-ant-lab details').forEach(d=>d.open=true)");
  await run("c.teaching=false;c.classic();c.editX=1;c.editY=0;c.paintCell();return true");assert.equal(await run('return c.engine.get(1,0)'),1);await click('Avanzar un paso');await click('Reiniciar');assert.equal(await run('return c.engine.get(1,0)'),1);
  await click('Cl\u00e1sica desde cero');await click('Iniciar comparaci\u00f3n');assert.equal(await evaluate("document.querySelectorAll('app-langtons-ant-lab canvas').length"),2);
  await click('+100 pasos');for(let i=0;i<90;i++){if(await run('return !c.running'))break;await pause(50)}assert.deepEqual(await run('return [c.engine.steps,c.comparison.steps]'),[100,100]);
  await click('Cerrar comparaci\u00f3n');await run("c.ruleInput='RX';c.applyRule();return true");assert(await run('return !!c.error'));assert.equal(await run('return c.engine.rule'),'RL');
  await run("c.ruleInput='LLRR';c.applyRule();return true");await click('+100 pasos');for(let i=0;i<90;i++){if(await run('return !c.running'))break;await pause(50)}assert.equal(await run('return c.engine.rule'),'LLRR');
  await click('Cuatro sim\u00e9tricas');assert.equal(await run('return c.engine.ants.length'),4);await click('Avanzar un paso');await click('Retroceder un paso');assert.equal(await run('return c.engine.steps'),0);
  await click('Cl\u00e1sica desde cero');await click('Ir al descubrimiento de la autopista');for(let i=0;i<180;i++){if(await run('return c.speed===80'))break;await pause(50)}await click('Pausar');assert(await run('return c.engine.steps>=9800&&c.engine.steps<11000'));
  await click('Exportar PNG');for(let i=0;i<50&&!fs.readdirSync(downloadDir).some(f=>f.endsWith('.png'));i++)await pause(100);assert(fs.readdirSync(downloadDir).some(f=>f.endsWith('.png')));
  // A million-step run must yield, remain pausable and retain a bounded history.
  await click('Cl\u00e1sica desde cero');await run('c.speed=100000;c.batch(1000000);return true');await pause(200);await click('Pausar');const stopped=await run('return c.engine.steps');assert(stopped>0&&stopped<1000000);await pause(100);assert.equal(await run('return c.engine.steps'),stopped);
  await run('c.batch(1000000-c.engine.steps);return true');
  for(let i=0;i<600;i++){if(await run('return !c.running'))break;await pause(100)}
  assert.equal(await run('return c.engine.steps'),1000000);assert.equal(await run('return c.engine.history.size'),100000);
  // Responsive rendering and real touch edits.
  for(const width of [390,320]){
    await call('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:true});
    await call('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});
    await run("c.classic();c.mode='paint';c.follow=false;return true");
    await evaluate("document.querySelectorAll('app-langtons-ant-lab details').forEach(d=>d.open=false);document.querySelector('app-langtons-ant-lab').scrollIntoView({block:'start',behavior:'instant'})");await pause(300);
    const r=await evaluate("(()=>{const r=document.querySelector('app-ant-canvas canvas').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2,w:r.width,h:r.height}})()");assert(r.w>200&&r.h>=240);
    const before=await run('return c.engine.cells.size');
    await call('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:r.x,y:r.y}]});await call('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:r.x+25,y:r.y}]});await call('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await pause(100);
    assert(await run('return c.engine.cells.size')>before,'Touch paints at '+width);
    assert(await evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'No horizontal overflow '+width);
    fs.writeFileSync(path.join(shots,'mobile-'+width+'.png'),Buffer.from((await call('Page.captureScreenshot',{format:'png'})).data,'base64'));
  }
  // Follow real article links and their incoming reference to the new article.
  for (const target of ['cellular-automata','life-patterns']) {
    await call('Page.navigate',{url:origin+'/articles/langtons-ant'});
    for(let i=0;i<150;i++){if(await evaluate("!!document.querySelector('app-langtons-ant-article')"))break;await pause(100);}
    await evaluate("document.querySelector('app-langtons-ant-article a[href=\"/articles/"+target+"\"]').click()");
    for(let i=0;i<150;i++){if(await evaluate("!!document.querySelector('.body-text a[href=\"/articles/langtons-ant\"]')"))break;await pause(100);}
    assert.equal(await evaluate('location.pathname'),'/articles/'+target);
    assert(await evaluate("!!document.querySelector('.body-text a[href=\"/articles/langtons-ant\"]')"));
    await evaluate("document.querySelector('.body-text a[href=\"/articles/langtons-ant\"]').click()");
    for(let i=0;i<100;i++){if(await evaluate('location.pathname')==='/articles/langtons-ant')break;await pause(100);}
    assert.equal(await evaluate('location.pathname'),'/articles/langtons-ant');
  }
  assert.deepEqual(errors,[],'No runtime exceptions');console.log('PASS real Chrome: controls, pause, reverse, 11000-step highway, teaching phases, edits, reset, comparator, rule validation, four ants, discovery, PNG, pausable million-step run and touch at 390/320px');
}
main().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{clearTimeout(watchdog);socket?.close();browser?.kill();await pause(500);server?.close();const resolved=path.resolve(profile);if(!resolved.startsWith(path.resolve(os.tmpdir(),'danisagan-langton-audit-')))throw Error('Unexpected profile path');try{fs.rmSync(resolved,{recursive:true,force:true,maxRetries:3})}catch{}});
