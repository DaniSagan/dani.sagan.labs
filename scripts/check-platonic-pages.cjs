// Real Chrome integration/visual audit; run after a development build.
const fs = require('node:fs'), path = require('node:path'), os = require('node:os'), http = require('node:http');
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict'), WebSocket = require('ws');
const dist = path.resolve('dist/dani.sagan.labs/browser');
const downloadDir = path.resolve('tmp/platonic-downloads', String(Date.now()));
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'danisagan-platonic-audit-'));
const pause = ms => new Promise(r => setTimeout(r, ms));
let server, browser, socket;
const watchdog = setTimeout(() => { console.error('Audit timeout'); process.exit(1); }, 240000);
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

  const shots = path.resolve('tmp/platonic-audit'); fs.mkdirSync(shots,{recursive:true});
  const component = "ng.getComponent(document.querySelector('app-polyhedron-lab'))";
  const state = s => evaluate(`(()=>{const c=${component};return ${s}})()`);
  const action = async s => { await evaluate(`(()=>{const c=${component};${s};ng.applyChanges(c)})()`); await pause(150); };
  const routes = ['tetrahedron','hexahedron','octahedron','dodecahedron','icosahedron'];
  for (const slug of routes) {
    await call('Emulation.setDeviceMetricsOverride',{width:1440,height:1100,deviceScaleFactor:1,mobile:false});
    await call('Page.navigate',{url:origin+'/articles/'+slug+'-viewer'});
    for (let i=0;i<150;i++) { if (await evaluate("!!document.querySelector('app-polyhedron-lab canvas')")) break; await pause(100); }
    assert(await evaluate("!!document.querySelector('app-polyhedron-lab canvas')"),slug+' WebGL canvas');
    assert.equal(await state('c.failed'),false);
    await evaluate("document.querySelector('app-polyhedron-lab').scrollIntoView({block:'center',behavior:'instant'})");
    await pause(450);
    assert(await state('c.renderer.info.render.triangles>0'),slug+' renders geometry');
    const initialShot=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(shots,slug+'-initial.png'),Buffer.from(initialShot.data,'base64'));
    assert(await evaluate("document.querySelectorAll('app-formula').length>=12"),slug+' mathematical derivation');
    assert(await evaluate("document.querySelectorAll('.article-block').length>=7"));
    const colors = await state('c.faceMeshes.map(mesh=>mesh.material.color.getHex())');
    assert.equal(new Set(colors).size,await state('c.model.faces.length'),'Each face has a unique color');
    const original = await state('c.model.volume');
    await action('c.edge=2');
    assert(await evaluate("document.querySelector('.measurements').innerText.includes('u')"));
    assert.equal(await state('c.model.volume * c.edge**3'),original*8);
    await action('c.face=c.model.faces.length-1;c.angle=true;c.radii=true;c.labels=true;c.update()');
    assert(await state('c.angleGroup.visible && c.angleGroup.children.length===3'));
    assert(await state('c.radiusGroup.children.length===3'));
    assert.deepEqual(await state('c.faceMeshes.map(mesh=>mesh.material.color.getHex())'),colors,'Selection preserves face colors');
    assert(await state("document.querySelector('.angle-label').innerText.includes(c.number(c.model.dihedral))"));
    await action("c.sphere='outer';c.dual=true;c.update()");
    assert(await state('c.sphereMesh.visible && c.dualGroup.visible'));
    await action('c.exploded=0.5;c.update()');
    assert(await state('c.faceMeshes.some(m=>m.position.length()>0.1)'));
    assert.equal(await state('c.vertexGroup.visible'),false);
    assert.equal(await state('c.angleGroup.visible'),false);
    await action("c.exploded=0;c.dual=false;c.sphere='none';c.edge=1;c.update();c.project('xy')");
    assert.equal(await state('c.camera.position.x'),0);
    await action('c.reset()');
    // Real pointer selection and orbit, including pixel output after interaction.
    const rect = await evaluate("(()=>{const r=document.querySelector('app-polyhedron-lab canvas').getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}})()");
    await call('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...rect});
    await call('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...rect});
    assert(await state('c.face>=0 && c.face<c.model.faces.length'));
    const before = await state('c.camera.position.toArray()');
    await call('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...rect});
    await call('Input.dispatchMouseEvent',{type:'mouseMoved',buttons:1,x:rect.x+60,y:rect.y+30});
    await call('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',x:rect.x+60,y:rect.y+30});
    await pause(300);
    assert.notDeepEqual(await state('c.camera.position.toArray()'),before,'Orbit responds to dragging');
    await action('c.reset()');
    const shot = await call('Page.captureScreenshot',{format:'png'});
    fs.writeFileSync(path.join(shots,slug+'-desktop.png'),Buffer.from(shot.data,'base64'));
    await action('c.download()');
    for (const width of [768,390,320]) {
      await call('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<500});
      await pause(250);
      await evaluate("document.querySelector('app-polyhedron-lab').scrollIntoView({block:'start',behavior:'instant'})");
      assert(await evaluate('document.documentElement.scrollWidth<=innerWidth'),slug+' overflow '+width);
      assert(await evaluate("document.querySelector('app-polyhedron-lab canvas').getBoundingClientRect().width<=innerWidth"));
      await action('c.face=0;c.angle=true;c.update()');
      if (width===390) { const image=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(shots,slug+'-mobile.png'),Buffer.from(image.data,'base64')); }
    }
    await evaluate("document.querySelector('app-polyhedron-lab details').open=true");
    assert.equal(await evaluate("document.querySelectorAll('app-polyhedron-lab tbody tr').length"),await state('c.model.vertices.length'));
    // Anchor navigation must retain the article route even with a base href.
    await evaluate("document.querySelectorAll('.article-nav a')[1].click()");
    await pause(150);
    assert((await evaluate('location.pathname')).includes(slug+'-viewer'));
    assert.equal(await evaluate('location.hash'),'#coordenadas');
    for (let i=0;i<100;i++) { if(await evaluate("document.querySelectorAll('app-formula mjx-container').length>=12")) break; await pause(100); }
    const math = await evaluate("({rendered:document.querySelectorAll('app-formula mjx-container').length,errors:document.querySelectorAll('mjx-merror,[data-mml-node=merror]').length})");
    assert.equal(math.errors,0,'No MathJax errors');
    assert(math.rendered>=12,slug+' MathJax rendering');
    console.log('PASS '+slug+': geometry, layers, dihedral, measures, orbit, coordinates, PNG, responsive; MathJax '+math.rendered);
  }
  // A real SPA route change must release the old WebGL renderer and canvas.
  await evaluate(`window.__oldLab=${component};window.__oldCanvas=window.__oldLab.renderer.domElement;document.querySelector('.related a[href$="-viewer"]').click()`);
  for(let i=0;i<100;i++){if(await evaluate(`!!document.querySelector('app-polyhedron-lab') && ${component}!==window.__oldLab`))break;await pause(100);}
  assert(await evaluate('!window.__oldCanvas.isConnected && window.__oldLab.renderer===undefined'),'Renderer disposed on route change');
  await pause(500);
  assert(fs.readdirSync(downloadDir).filter(f=>f.endsWith('.png')).length>=5,'Five exported PNGs');
  assert.deepEqual(errors,[],'No runtime exceptions');
  console.log('PASS: all five Platonic articles and interactive laboratories. Screenshots: tmp/platonic-audit');
}
main().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{ clearTimeout(watchdog); socket?.close(); browser?.kill(); await pause(500); server?.close(); const resolved=path.resolve(profile); if(!resolved.startsWith(path.resolve(os.tmpdir(),'danisagan-platonic-audit-')))throw Error('Unexpected profile path'); try{fs.rmSync(resolved,{recursive:true,force:true,maxRetries:3})}catch{} });
