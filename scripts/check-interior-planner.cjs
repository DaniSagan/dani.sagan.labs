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
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'danisagan-interior-audit-'));
const chrome = process.env.CHROME_BIN || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const mathjaxBundle = process.env.MATHJAX_TEST_BUNDLE || path.join(os.tmpdir(), 'danisagan-mathjax-3.2.2-tex-svg.js');
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.ico': 'image/x-icon' };
let browser, socket, server;
const watchdog = setTimeout(() => { console.error('Browser audit timed out.'); process.exit(1); }, 240000);
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
  const wait=async expression=>{for(let i=0;i<200;i++){if(await evaluate(expression))return;await pause(100);}throw Error('Timed out: '+expression);};
  const model='ng.getComponent(document.querySelector("app-interior-planner"))';
  const click=async selector=>{
    await evaluate(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:'center',behavior:'instant'})`);await pause(150);
    const p=await evaluate(`(()=>{const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2}})()`);
    await call('Input.dispatchMouseEvent',{type:'mousePressed',...p,button:'left',buttons:1,clickCount:1});await call('Input.dispatchMouseEvent',{type:'mouseReleased',...p,button:'left',buttons:0,clickCount:1});await pause(100);
  };
  const button=async(text,scope='app-interior-planner')=>{const selector=await evaluate(`(()=>{const a=[...document.querySelectorAll(${JSON.stringify(scope+' button')})].find(e=>e.textContent.trim()===${JSON.stringify(text)});if(!a)throw Error('Missing button '+${JSON.stringify(text)});a.id='cad-test-action';return '#cad-test-action'})()`);await click(selector);await evaluate(`document.querySelector('#cad-test-action')?.removeAttribute('id')`);};
  const field=async(label,value)=>{await evaluate(`(()=>{const l=[...document.querySelectorAll('app-interior-planner label')].find(e=>e.firstChild?.textContent.trim()===${JSON.stringify(label)});if(!l)throw Error('Missing label '+${JSON.stringify(label)});const input=l.querySelector('input,select,textarea');input.value=${JSON.stringify(String(value))};input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));input.dispatchEvent(new Event('blur',{bubbles:true}));})()`);await pause(100);};
  const zoomToFine=async selector=>{
    await evaluate(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:'center',behavior:'instant'})`);await pause(200);
    const p=await evaluate(`(()=>{const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2}})()`);
    for(let i=0;i<32&&!await evaluate(`${model}.fineGridVisible`);i++){await call('Input.dispatchMouseEvent',{type:'mouseWheel',...p,deltaX:0,deltaY:-120});await pause(40);}
    await wait(`${model}.fineGridVisible && !!document.querySelector('.cad-fine-grid')`);
    assert.equal(await evaluate(`${model}.effectiveGrid`),10);
    fs.mkdirSync(path.resolve('tmp/interior-planner-audit'),{recursive:true});
    fs.writeFileSync(path.resolve('tmp/interior-planner-audit/fine-grid.png'),Buffer.from((await call('Page.captureScreenshot',{format:'png'})).data,'base64'));
  };
  await call('Emulation.setDeviceMetricsOverride',{width:1440,height:1100,deviceScaleFactor:1,mobile:false});
  await call('Page.navigate',{url:origin+'/tools/interior-planner'});
  await wait(`document.querySelector('app-interior-planner') && ${model}.ready`);
  assert.equal(await evaluate(`${model}.surface`),8.6982);
  assert.equal(await evaluate(`${model}.fineGridVisible`),false);
  assert.equal(await evaluate(`document.querySelector('#cad-grid-meter').getAttribute('width')`),'1000');
  assert(await evaluate(`document.querySelector('.drawing').lastElementChild.classList.contains('cad-grid-overlay')`),'Grid must be drawn above objects and controls');
  assert.equal(await evaluate(`getComputedStyle(document.querySelector('.cad-grid-overlay')).pointerEvents`),'none');
  await zoomToFine('.vertex[data-vertex-index="1"]');
  const centimetreDrag=await evaluate(`(()=>{const m=document.querySelector('.drawing').getScreenCTM(),a=new DOMPoint(3210,60).matrixTransform(m),b=new DOMPoint(3220,70).matrixTransform(m);return{a:{x:a.x,y:a.y},b:{x:b.x,y:b.y}}})()`);
  await call('Input.dispatchMouseEvent',{type:'mousePressed',...centimetreDrag.a,button:'left',buttons:1,clickCount:1});await call('Input.dispatchMouseEvent',{type:'mouseMoved',...centimetreDrag.b,buttons:1});await call('Input.dispatchMouseEvent',{type:'mouseReleased',...centimetreDrag.b,button:'left',buttons:0,clickCount:1});
  assert(await evaluate(`Math.hypot(${model}.wallsDrawing.innerVertices[1].x-3220,${model}.wallsDrawing.innerVertices[1].y-70)<1e-5`),'Fine grid must snap vertices to 1 cm rather than 10 cm');
  await button('↶');await button('Encuadrar');
  assert.equal(await evaluate(`${model}.fineGridVisible`),false);
  const canvasCovered=()=>evaluate(`(()=>{const s=document.querySelector('.drawing').getBoundingClientRect();return ['.cad-canvas-background','.cad-canvas-grid'].every(selector=>{const r=document.querySelector(selector).getBoundingClientRect();return r.left<=s.left+1&&r.top<=s.top+1&&r.right>=s.right-1&&r.bottom>=s.bottom-1})})()`);
  // Force substantial SVG letterboxing, then pan a wall into the formerly blank top strip.
  const geometryBeforePan=await evaluate(`JSON.stringify(${model}.room.vertices)`);
  await evaluate(`document.querySelector('.drawing').style.height='760px'`);await pause(300);
  assert(await canvasCovered(),'Background and grid must cover the whole tall viewport');
  await button('Desplazar');await evaluate(`document.querySelector('.drawing').scrollIntoView({block:'center',behavior:'instant'})`);await pause(200);
  const viewportPan=await evaluate(`(()=>{const m=${model},svg=document.querySelector('.drawing'),r=svg.getBoundingClientRect(),p=new DOMPoint(1090,0).matrixTransform(svg.getScreenCTM()),a={x:r.right-20,y:r.bottom-20};return {a,b:{x:a.x,y:a.y+(r.top+30-p.y)}}})()`);
  await call('Input.dispatchMouseEvent',{type:'mousePressed',...viewportPan.a,button:'left',buttons:1,clickCount:1});await call('Input.dispatchMouseEvent',{type:'mouseMoved',...viewportPan.b,buttons:1});await call('Input.dispatchMouseEvent',{type:'mouseReleased',...viewportPan.b,button:'left',buttons:0,clickCount:1});
  assert(await evaluate(`(()=>{const svg=document.querySelector('.drawing'),p=new DOMPoint(1090,0).matrixTransform(svg.getScreenCTM());return !!document.elementFromPoint(p.x,p.y)?.closest('.wall')})()`),'Wall masks must expose walls in the top strip');
  assert(await evaluate(`(()=>{const svg=document.querySelector('.drawing'),r=svg.getBoundingClientRect(),inverse=svg.getScreenCTM().inverse(),a=new DOMPoint(r.left,r.top).matrixTransform(inverse),b=new DOMPoint(r.right,r.bottom).matrixTransform(inverse),m=document.querySelector('#cad-openings'),x=+m.getAttribute('x'),y=+m.getAttribute('y');return x<=a.x+1&&y<=a.y+1&&x+(+m.getAttribute('width'))>=b.x-1&&y+(+m.getAttribute('height'))>=b.y-1})()`),'The wall mask must cover the same full viewport as the grid');
  fs.mkdirSync(path.resolve('tmp/interior-planner-audit'),{recursive:true});
  fs.writeFileSync(path.resolve('tmp/interior-planner-audit/viewport-top-strip.png'),Buffer.from((await call('Page.captureScreenshot',{format:'png'})).data,'base64'));
  assert.equal(await evaluate(`JSON.stringify(${model}.room.vertices)`),geometryBeforePan,'Panning must not alter real dimensions');
  await evaluate(`document.querySelector('.drawing').style.height=''`);await pause(300);await button('Encuadrar');await button('Seleccionar');
  await click('.vertex[data-vertex-index="1"]');
  assert.deepEqual(await evaluate(`(()=>{const t=document.querySelector('.vertex[data-vertex-index="1"]').transform.baseVal.consolidate().matrix;return{x:t.e,y:t.f}})()`),{x:3210,y:60},'Vertex control must sit on the inner wall corner');
  assert.equal(await evaluate(`${model}.selectedVertex`),1);
  assert.equal(await evaluate(`document.querySelector('.vertex[data-vertex-index="1"]').getAttribute('aria-pressed')`),'true');
  const vertexField=async(axis,value)=>{await evaluate(`(()=>{const label=[...document.querySelectorAll('#cad-vertex-properties label')].find(l=>l.firstChild.textContent.trim()===${JSON.stringify(axis+' (cm)')});const input=label.querySelector('input');input.value=${JSON.stringify(String(value))};input.dispatchEvent(new Event('input',{bubbles:true}));})()`);await pause(100);};
  await vertexField('X','');await pause(350);
  assert.deepEqual(await evaluate(`${model}.room.vertices[1]`),{x:3270,y:0},'Clearing a coordinate must not move the vertex to zero');
  await vertexField('X',340);await vertexField('Y',20);
  await wait(`Math.hypot(${model}.wallsDrawing.innerVertices[1].x-3400,${model}.wallsDrawing.innerVertices[1].y-200)<1e-5`);
  assert(await evaluate(`Math.hypot(${model}.wallsDrawing.innerVertices[1].x-3400,${model}.wallsDrawing.innerVertices[1].y-200)<1e-5`));
  assert.notEqual(await evaluate(`${model}.surface`),8.6982);
  const visibleBeforeInvalid=await evaluate(`JSON.stringify(${model}.wallsDrawing.innerVertices)`),otherCorner=await evaluate(`${model}.wallsDrawing.innerVertices[0]`);
  await vertexField('X',otherCorner.x/10);await vertexField('Y',otherCorner.y/10);await button('Aplicar coordenadas');
  assert.equal(await evaluate(`JSON.stringify(${model}.wallsDrawing.innerVertices)`),visibleBeforeInvalid,'Coincident vertices must be rejected atomically');
  await button('Descartar coordenadas');await button('↶');
  assert.deepEqual(await evaluate(`${model}.room.vertices[1]`),{x:3270,y:0});
  await click('.vertex[data-vertex-index="0"]');await vertexField('X',0);await vertexField('Y',0);
  await evaluate(`document.querySelectorAll('#cad-vertex-properties input')[1].focus()`);
  await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});await call('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
  assert(await evaluate(`(()=>{const p=${model}.wallsDrawing.innerVertices[0],m=document.querySelector('.vertex[data-vertex-index="0"]').transform.baseVal.consolidate().matrix;return Math.hypot(p.x,p.y)<1e-5&&Math.hypot(m.e,m.f)<1e-5})()`),'Entering 0,0 must put the visible corner at the origin');
  await click('.vertex[data-vertex-index="1"]');await vertexField('X',320);await vertexField('Y',0);
  await wait(`Math.hypot(${model}.wallsDrawing.innerVertices[1].x-3200,${model}.wallsDrawing.innerVertices[1].y)<1e-5`);
  assert(await evaluate(`Math.hypot(${model}.wallsDrawing.innerVertices[0].x,${model}.wallsDrawing.innerVertices[0].y)<1e-5`),'Editing the endpoint must preserve the starting visible vertex');
  assert(Math.abs((await evaluate(`${model}.length(0)`))-3200)<1e-5,'0,0 to 320,0 cm must measure exactly 320 cm');
  assert(await evaluate(`document.querySelector('.drawing .dimension').textContent.includes('320 cm')`));
  await button('↶');
  await button('↶');
  await evaluate(`document.querySelector('.drawing').scrollIntoView({block:'center',behavior:'instant'})`);await pause(200);
  const cornerDrag=await evaluate(`(()=>{const matrix=document.querySelector('.drawing').getScreenCTM(),a=new DOMPoint(60,60).matrixTransform(matrix),b=new DOMPoint(0,0).matrixTransform(matrix);return{a:{x:a.x,y:a.y},b:{x:b.x,y:b.y}}})()`);
  await call('Input.dispatchMouseEvent',{type:'mousePressed',...cornerDrag.a,button:'left',buttons:1,clickCount:1});await call('Input.dispatchMouseEvent',{type:'mouseMoved',...cornerDrag.b,buttons:1});await call('Input.dispatchMouseEvent',{type:'mouseReleased',...cornerDrag.b,button:'left',buttons:0,clickCount:1});
  assert(await evaluate(`Math.hypot(${model}.wallsDrawing.innerVertices[0].x,${model}.wallsDrawing.innerVertices[0].y)<1e-5`),'Dragging to the grid origin must move the visible corner to 0,0');
  await button('↶');
  await evaluate(`document.querySelector('.vertex[data-vertex-index="2"]').focus()`);
  await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});await call('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
  assert.equal(await evaluate(`${model}.selectedVertex`),2);
  assert.equal(await evaluate(`document.querySelectorAll('.wall-midpoint').length`),4);
  await click('.wall-midpoint[data-wall-index="1"]');
  assert.equal(await evaluate(`${model}.room.walls.length`),5);
  assert.deepEqual(await evaluate(`${model}.room.vertices[2]`),{x:3270,y:1330});
  assert.equal(await evaluate(`${model}.length(0)`),3150);
  await button('↶');
  await evaluate(`document.querySelector('.wall-midpoint[data-wall-index="0"]').focus()`);
  await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
  await call('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
  await wait(`${model}.room.walls.length===5`);
  assert.deepEqual(await evaluate(`${model}.room.vertices[1]`),{x:1635,y:0});
  await button('↶');assert.equal(await evaluate(`${model}.room.walls.length`),4);
  await button('Añadir puerta');await button('Añadir ventana');
  assert.deepEqual(await evaluate(`${model}.openings.map(f=>f.kind)`),['door','window']);
  assert(await evaluate(`(()=>{const [a,b]=${model}.openings;return a.offset+a.width<=b.offset||b.offset+b.width<=a.offset})()`));
  assert.equal(await evaluate(`document.querySelectorAll('#cad-openings rect[fill=black]').length`),2);
  const fixtureField=async(label,value)=>{await evaluate(`(()=>{const l=[...document.querySelectorAll('#cad-fixture-properties label')].find(e=>e.firstChild?.textContent.trim()===${JSON.stringify(label)});if(!l)throw Error('Missing fixture field '+${JSON.stringify(label)});const input=l.querySelector('input,select');input.value=${JSON.stringify(String(value))};input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));})()`);await pause(100);};
  const windowId=await evaluate(`${model}.selectedFixture.id`);
  const doorId=await evaluate(`${model}.openings.find(f=>f.kind==='door').id`);
  await evaluate(`${model}.selectFixture(${JSON.stringify(doorId)});ng.applyChanges(${model})`);await pause(100);
  const originalDoorPath=await evaluate(`document.querySelector('.fixture[data-fixture-id="'+${JSON.stringify(doorId)}+'"]').innerHTML`);
  await fixtureField('Sentido de apertura','outward');await fixtureField('Lado de las bisagras','end');
  assert.equal(await evaluate(`${model}.selectedFixture.doorSwing`),undefined);
  await button('Aplicar cambios');
  assert.deepEqual(await evaluate(`[${model}.selectedFixture.doorSwing,${model}.selectedFixture.doorHinge]`),['outward','end']);
  assert.notEqual(await evaluate(`document.querySelector('.fixture[data-fixture-id="'+${JSON.stringify(doorId)}+'"]').innerHTML`),originalDoorPath);
  await button('↶');
  assert.equal(await evaluate(`${model}.doc.fixtures.find(f=>f.id===${JSON.stringify(doorId)}).doorSwing`),undefined);
  await button('↷');
  assert.equal(await evaluate(`${model}.doc.fixtures.find(f=>f.id===${JSON.stringify(doorId)}).doorSwing`),'outward');
  await button('↶');
  await click('.fixture[data-fixture-id="'+windowId+'"]');
  const originalWindow=await evaluate(`JSON.stringify(${model}.selectedFixture)`);
  await fixtureField('Anchura (cm)',9999);await button('Aplicar cambios');
  assert.equal(await evaluate(`JSON.stringify(${model}.selectedFixture)`),originalWindow,'Invalid dimensions must leave the document intact');
  await fixtureField('Anchura (cm)',90);await fixtureField('Altura (cm)',80);await fixtureField('Posición (cm)',20);await fixtureField('Altura al suelo (cm)',100);
  assert.equal(await evaluate(`JSON.stringify(${model}.selectedFixture)`),originalWindow,'Draft fields must wait for Apply');
  await button('Aplicar cambios');
  assert.deepEqual(await evaluate(`(()=>{const f=${model}.selectedFixture;return [f.offset,f.width,f.height,f.z]})()`),[200,900,800,1000]);
  await zoomToFine('.fixture[data-fixture-id="'+windowId+'"]');
  const fixtureFineDrag=await evaluate(`(()=>{const f=${model}.selectedFixture,m=document.querySelector('.fixture[data-fixture-id="'+f.id+'"]').getScreenCTM(),a=new DOMPoint(f.width/2,0).matrixTransform(m),b=new DOMPoint(f.width/2+10,0).matrixTransform(m);return{a:{x:a.x,y:a.y},b:{x:b.x,y:b.y}}})()`);
  await call('Input.dispatchMouseEvent',{type:'mousePressed',...fixtureFineDrag.a,button:'left',buttons:1,clickCount:1});await call('Input.dispatchMouseEvent',{type:'mouseMoved',...fixtureFineDrag.b,buttons:1});await call('Input.dispatchMouseEvent',{type:'mouseReleased',...fixtureFineDrag.b,button:'left',buttons:0,clickCount:1});
  assert.equal(await evaluate(`${model}.doc.fixtures.find(f=>f.id===${JSON.stringify(windowId)}).offset`),210,'Fine grid must move wall elements in 1 cm steps');
  await button('↶');await button('Encuadrar');await click('.fixture[data-fixture-id="'+windowId+'"]');
  await evaluate(`document.querySelector('.drawing').scrollIntoView({block:'center',behavior:'instant'})`);await pause(200);
  const fixtureDrag=await evaluate(`(()=>{const m=${model},f=m.selectedFixture,svg=document.querySelector('.fixture[data-fixture-id="'+f.id+'"]'),ctm=svg.getScreenCTM();const a=new DOMPoint(f.width/2,0).matrixTransform(ctm),b=new DOMPoint(f.width/2+200,0).matrixTransform(ctm);return {a:{x:a.x,y:a.y},b:{x:b.x,y:b.y}}})()`);
  await call('Input.dispatchMouseEvent',{type:'mousePressed',...fixtureDrag.a,button:'left',buttons:1,clickCount:1});await call('Input.dispatchMouseEvent',{type:'mouseMoved',...fixtureDrag.b,buttons:1});await call('Input.dispatchMouseEvent',{type:'mouseReleased',...fixtureDrag.b,button:'left',buttons:0,clickCount:1});
  assert.equal(await evaluate(`${model}.doc.fixtures.find(f=>f.id===${JSON.stringify(windowId)}).offset`),400,'Dragging moves a window along its wall');
  await button('Abrir alzado vinculado');
  await evaluate(`document.querySelector('.drawing').scrollIntoView({block:'center',behavior:'instant'})`);await pause(200);
  const elevationDrag=await evaluate(`(()=>{const m=${model},f=m.selectedFixture,ctm=document.querySelector('.drawing').getScreenCTM();const a=new DOMPoint(m.fx(f)+f.width/2,-f.z-f.height/2).matrixTransform(ctm),b=new DOMPoint(m.fx(f)+f.width/2+100,-f.z-f.height/2-100).matrixTransform(ctm);return{a:{x:a.x,y:a.y},b:{x:b.x,y:b.y}}})()`);
  await call('Input.dispatchMouseEvent',{type:'mousePressed',...elevationDrag.a,button:'left',buttons:1,clickCount:1});await call('Input.dispatchMouseEvent',{type:'mouseMoved',...elevationDrag.b,buttons:1});await call('Input.dispatchMouseEvent',{type:'mouseReleased',...elevationDrag.b,button:'left',buttons:0,clickCount:1});
  assert.deepEqual(await evaluate(`(()=>{const f=${model}.doc.fixtures.find(f=>f.id===${JSON.stringify(windowId)});return [f.offset,f.z]})()`),[500,1100]);
  await button('↶');await button('Volver a planta');
  await button('↶');await button('↶');
  assert.equal(await evaluate(`JSON.stringify(${model}.doc.fixtures.find(f=>f.id===${JSON.stringify(windowId)}))`),originalWindow);
  await button('Abrir alzado vinculado');assert.equal(await evaluate(`${model}.fixtures.length`),2);
  await button('Volver a planta');await button('↶');await button('↶');
  assert.equal(await evaluate(`${model}.doc.fixtures.length`),0);
  await click('.furniture-card');await click('.furniture-card:nth-child(2)');
  assert.equal(await evaluate(`${model}.doc.instances.length`),2);
  await field('X (cm)',240);await field('Y (cm)',180);
  const deskBeforeFine=await evaluate(`({x:${model}.doc.instances[0].x,y:${model}.doc.instances[0].y})`);
  await zoomToFine('.object');
  const deskFineDrag=await evaluate(`(()=>{const m=document.querySelector('.object').getScreenCTM(),a=new DOMPoint(240,120).matrixTransform(m),b=new DOMPoint(255,130).matrixTransform(m);return{a:{x:a.x,y:a.y},b:{x:b.x,y:b.y}}})()`);
  await call('Input.dispatchMouseEvent',{type:'mousePressed',...deskFineDrag.a,button:'left',buttons:1,clickCount:1});await call('Input.dispatchMouseEvent',{type:'mouseMoved',...deskFineDrag.b,buttons:1});await call('Input.dispatchMouseEvent',{type:'mouseReleased',...deskFineDrag.b,button:'left',buttons:0,clickCount:1});
  assert.deepEqual(await evaluate(`({x:${model}.doc.instances[0].x,y:${model}.doc.instances[0].y})`),{x:Math.round((deskBeforeFine.x+15)/10)*10,y:Math.round((deskBeforeFine.y+10)/10)*10});
  await button('↶');await button('Encuadrar');
  // Real pointer drag in world coordinates, independent of viewport size.
  await evaluate(`document.querySelector('.drawing').scrollIntoView({block:'center',behavior:'instant'})`);await pause(200);
  const dragPoints=await evaluate(`(()=>{const m=${model},i=m.doc.instances[0],d=m.def(i),svg=document.querySelector('.drawing'),ctm=svg.getScreenCTM();const a=new DOMPoint(i.x+d.width*.2,i.y+d.depth*.2).matrixTransform(ctm),b=new DOMPoint(i.x+d.width*.2+300,i.y+d.depth*.2+200).matrixTransform(ctm);return {a:{x:a.x,y:a.y},b:{x:b.x,y:b.y},old:i.x}})()`);
  await call('Input.dispatchMouseEvent',{type:'mousePressed',...dragPoints.a,button:'left',buttons:1,clickCount:1});await call('Input.dispatchMouseEvent',{type:'mouseMoved',...dragPoints.b,buttons:1});await call('Input.dispatchMouseEvent',{type:'mouseReleased',...dragPoints.b,button:'left',buttons:0,clickCount:1});
  assert.notEqual(await evaluate(`${model}.doc.instances[0].x`),dragPoints.old,'Pointer drag did not move furniture');
  await button('Guardar');await wait(`document.querySelector('.save-state').textContent.includes('Guardado')`);
  const saved=await evaluate(`JSON.stringify(${model}.doc)`);
  await call('Page.reload');await wait(`document.querySelector('app-interior-planner') && ${model}.ready`);
  assert.equal(await evaluate(`JSON.stringify(${model}.doc)`),saved,'Reload must restore exact document');
  // Edit wall dimensions through real form events and inspect linked elevation.
  await field('Longitud (cm)',400);await field('Altura inicial (cm)',250);await field('Altura final (cm)',180);await button('Aplicar pared');await button('Abrir alzado vinculado');
  assert.equal(await evaluate(`${model}.view`),'elevation');assert.equal(await evaluate(`${model}.wall.height`),2500);assert.equal(await evaluate(`${model}.wall.endHeight`),1800);assert(Math.abs((await evaluate(`${model}.length(0)`))-4000)<1e-5);
  await click('.library details:last-child summary');await button('Añadir a esta pared');await button('Añadir a esta pared');
  assert.equal(await evaluate(`${model}.doc.fixtures.length`),2);
  assert.equal(await evaluate(`${model}.doc.fixtures[0].width`),80);
  await fixtureField('Posición (cm)',75);await fixtureField('Altura al suelo (cm)',45);await fixtureField('Anchura (cm)',9);await fixtureField('Altura (cm)',9);await button('Aplicar cambios');
  assert.deepEqual(await evaluate(`(()=>{const f=${model}.selectedFixture;return[f.offset,f.z,f.width,f.height]})()`),[750,450,90,90]);
  await field('Tipo','switch');await button('Añadir a esta pared');await field('Tipo','rj45');await button('Añadir a esta pared');await field('Tipo','door');await button('Añadir a esta pared');
  await field('Longitud (cm)',420);await button('Aplicar pared');
  assert.equal(await evaluate(`${model}.doc.fixtures[0].offset`),450);
  await button('Volver a planta');assert.equal(await evaluate(`${model}.fixtures.length`),5);
  // JSON import through a real file input, after export serialization and a new project.
  const fixtureDoc=await evaluate(`JSON.stringify(${model}.doc)`);
  await button('Nuevo');await wait(`${model}.doc.fixtures.length===0`);
  await evaluate(`(()=>{const input=document.querySelector('.inspector input[type=file]'),dt=new DataTransfer();dt.items.add(new File([${JSON.stringify(fixtureDoc)}],'roundtrip.json',{type:'application/json'}));input.files=dt.files;input.dispatchEvent(new Event('change',{bubbles:true}));})()`);
  await wait(`${model}.doc.fixtures.length===5`);
  assert.deepEqual(await evaluate(`(()=>{const f=${model}.doc.fixtures[1];return[f.offset,f.z,f.width,f.height]})()`),[750,450,90,90]);
  assert.equal(await evaluate(`${model}.doc.instances.length`),2);
  // Atomic history, invalid geometry/import, and conservative collision warning recovery.
  await button('Seleccionar');await click('.object');const originalX=await evaluate(`${model}.selected.x`);
  await field('X (cm)',-50);assert((await evaluate(`${model}.warnings.length`))>0);
  await button('↶');assert.equal(await evaluate(`${model}.doc.instances[0].x`),originalX);
  await button('↷');assert.equal(await evaluate(`${model}.doc.instances[0].x`),-500);
  await evaluate(`document.querySelector('.drawing').focus()`);
  await call('Input.dispatchKeyEvent',{type:'keyDown',key:'z',code:'KeyZ',windowsVirtualKeyCode:90,modifiers:2});
  await call('Input.dispatchKeyEvent',{type:'keyUp',key:'z',code:'KeyZ',windowsVirtualKeyCode:90,modifiers:2});
  await wait(`${model}.doc.instances[0].x===${originalX}`);
  const beforeInvalid=await evaluate(`JSON.stringify(${model}.doc)`);
  await evaluate(`(()=>{const input=document.querySelector('.inspector input[type=file]'),dt=new DataTransfer();dt.items.add(new File(['{"schemaVersion":999}'],'invalid.json'));input.files=dt.files;input.dispatchEvent(new Event('change',{bubbles:true}));})()`);await pause(100);
  assert.equal(await evaluate(`JSON.stringify(${model}.doc)`),beforeInvalid);
  assert((await evaluate(`${model}.message`)).includes('Versión'));
  // Personal furniture survives a switch to another project.
  await click('.library details:nth-child(3) summary');
  await field('Nombre','Mueble pequeño');await field('Contorno','rectangle');await field('Anchura (mm)',300);await field('Fondo (mm)',200);await button('Guardar definición en mi biblioteca');await wait(`${model}.personal.length===1`);
  assert.equal(await evaluate(`${model}.personal[0].width`),300);assert.equal(await evaluate(`${model}.personal[0].depth`),200);
  assert(await evaluate(`${model}.personal[0].bodyDepth>${model}.personal[0].depth`),'Unused hidden partial dimensions must not prevent saving a rectangle');
  await field('Nombre','Escritorio L de prueba');await field('Contorno','l-shape');await field('Anchura (mm)',1600);await field('Fondo (mm)',1400);await button('Guardar definición en mi biblioteca');await wait(`${model}.personal.length===2`);
  await button('Nuevo');await button('Escritorio L de prueba · colocar');assert.equal(await evaluate(`${model}.instances.length`),1);
  await button('Pentagonal');await button('Escritorio L de prueba · colocar');
  assert.equal(await evaluate(`${model}.room.vertices.length`),5);
  assert.equal(await evaluate(`new Set(${model}.doc.instances.map(i=>i.roomId)).size`),2);
  await field('Longitud (cm)',250);await field('Ángulo (°)',10);await button('Aplicar pared');assert.equal(await evaluate(`Math.round(${model}.length(0))`),2500);
  await field('Nombre','Sofá de prueba');await field('Contorno','chaise');await field('Anchura (mm)',2800);await field('Fondo (mm)',1600);await field('Ancho del brazo (mm)',900);await field('Fondo del cuerpo (mm)',950);
  await click('.library details:nth-child(3) input[type=checkbox]');await button('Guardar definición en mi biblioteca');await wait(`${model}.personal.length===3`);
  await button('Sofá de prueba · colocar');await field('Rotación (°)',35);assert.equal(await evaluate(`${model}.selected.rotation`),35);assert.equal(await evaluate(`${model}.def(${model}.selected).mirrored`),true);
  await button('Alinear con pared');assert(Math.abs((await evaluate(`${model}.selected.rotation`))-10)<1e-5);
  // File exports are real downloads; PNG width is checked in the binary header.
  const exportsDir=fs.mkdtempSync(path.resolve('tmp/interior-planner-exports-'));
  await call('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:exportsDir});
  await click('.inspector details:last-child summary');
  await button('Proyecto JSON');await button('Plano SVG');await button('Imagen PNG');
  for(let k=0;k<100&&!fs.existsSync(path.join(exportsDir,'plano.png'));k++)await pause(100);
  assert(fs.existsSync(path.join(exportsDir,'interiores.json')));assert(fs.readFileSync(path.join(exportsDir,'plano.svg'),'utf8').startsWith('<svg'));
  const png=fs.readFileSync(path.join(exportsDir,'plano.png'));assert.equal(png.subarray(1,4).toString(),'PNG');assert.equal(png.readUInt32BE(16),2400);
  assert.equal(JSON.parse(fs.readFileSync(path.join(exportsDir,'interiores.json'),'utf8')).rooms.length,2);
  // Storage failures must never be reported as saved.
  await evaluate(`window.cadSaveOriginal=${model}.storage.save;${model}.storage.save=async()=>{throw Error('Cuota simulada')}`);
  await button('Guardar');await wait(`document.querySelector('.save-state').textContent.includes('Error de almacenamiento')`);
  await evaluate(`${model}.storage.save=window.cadSaveOriginal`);await button('Guardar');await wait(`document.querySelector('.save-state').textContent.includes('Guardado')`);
  // Room deletion: cancellation, dependent records, undo/redo and last-room guard.
  const beforeRoomDelete=await evaluate(`JSON.stringify(${model}.doc)`);
  const deletedRoomId=await evaluate(`${model}.roomId`);
  await evaluate(`window.cadConfirmOriginal=window.confirm;window.confirm=()=>false`);
  await button('Eliminar habitación activa');
  assert.equal(await evaluate(`JSON.stringify(${model}.doc)`),beforeRoomDelete);
  await evaluate(`window.confirm=()=>true`);
  await button('Eliminar habitación activa');
  assert.equal(await evaluate(`${model}.doc.rooms.length`),1);
  assert(await evaluate(`!${model}.doc.rooms.some(r=>r.id===${JSON.stringify(deletedRoomId)})&&['instances','fixtures','annotations'].every(k=>!${model}.doc[k].some(e=>e.roomId===${JSON.stringify(deletedRoomId)}))`));
  assert(await evaluate(`[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Eliminar habitación activa').disabled`));
  await evaluate(`${model}.deleteRoom()`);
  assert.equal(await evaluate(`${model}.doc.rooms.length`),1);
  await evaluate(`${model}.undo()`);
  const restoredRoomDoc=JSON.parse(await evaluate(`JSON.stringify(${model}.doc)`));
  const originalRoomDoc=JSON.parse(beforeRoomDelete);
  delete restoredRoomDoc.updated;delete originalRoomDoc.updated;
  assert.deepEqual(restoredRoomDoc,originalRoomDoc);
  await evaluate(`${model}.redo()`);assert.equal(await evaluate(`${model}.doc.rooms.length`),1);
  await evaluate(`${model}.undo();window.confirm=window.cadConfirmOriginal`);
  // Touch selection and pan, keyboard operation, responsive bounds.
  const shots=path.resolve('tmp/interior-planner-audit');fs.mkdirSync(shots,{recursive:true});
  for(const width of [1440,768,390,320]){
    await call('Emulation.setDeviceMetricsOverride',{width,height:1100,deviceScaleFactor:1,mobile:width<600});
    await evaluate(`document.querySelector('.drawing').scrollIntoView({block:'center',behavior:'instant'})`);await pause(300);
    assert(await evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'Page overflow at '+width);
    assert(await evaluate(`document.querySelector('.cad').scrollWidth<=document.querySelector('.cad').clientWidth+1`),'Editor overflow at '+width);
    assert(await canvasCovered(),'Incomplete canvas background/grid at '+width);
    fs.writeFileSync(path.join(shots,width+'.png'),Buffer.from((await call('Page.captureScreenshot',{format:'png'})).data,'base64'));
    if(width===390){
      await button('Desplazar');await evaluate(`document.querySelector('.drawing').scrollIntoView({block:'center',behavior:'instant'})`);await pause(200);
      await call('Emulation.setTouchEmulationEnabled',{enabled:true});const p=await evaluate(`(()=>{const r=document.querySelector('.drawing').getBoundingClientRect();return{x:r.left+r.width*.5,y:r.top+r.height*.5}})()`);const before=await evaluate(`${model}.box.x`);
      await call('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...p,radiusX:1,radiusY:1}]});await call('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:p.x+25,y:p.y+25,radiusX:1,radiusY:1}]});await call('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await pause(200);assert.notEqual(await evaluate(`${model}.box.x`),before);await call('Emulation.setTouchEmulationEnabled',{enabled:false});
    }
  }
  assert.deepEqual(errors,[],'Uncaught browser exceptions');
  console.log('PASS browser: furniture drag, exact reload, sloped elevation, fixtures, linked wall edits, file import, keyboard history, personal library across rooms, pentagon, mirrored chaise, real JSON/SVG/PNG downloads, storage errors, touch pan and 1440/768/390/320 px layouts.');
}
main().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{clearTimeout(watchdog);if(socket)socket.close();if(browser)browser.kill();if(server)await new Promise(r=>server.close(r));});
