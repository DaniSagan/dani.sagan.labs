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
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'danisagan-mandelbrot-audit-'));
const chrome = process.env.CHROME_BIN || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
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
    } else if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') errors.push(message.params.args.map(a=>a.description||a.value||'').join(' '));
    else if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text + ' ' + (message.params.exceptionDetails.exception?.description || ''));
  };
  const call = (method, params = {}) => new Promise((resolve, reject) => { const id = ++nextId; const timeout = setTimeout(() => { pending.delete(id); reject(Error('Debugger timeout: ' + method)); }, 15000); pending.set(id, { resolve: r => { clearTimeout(timeout); resolve(r); }, reject: e => { clearTimeout(timeout); reject(e); } }); socket.send(JSON.stringify({ id, method, params })); });
  const evaluate = async expression => {
    const r = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    return r.result.value;
  };
  await call('Runtime.enable');
  await call('Page.enable');
﻿  const ts=require('typescript'),vm=require('node:vm');
  const cameraModel={};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(root,'src/app/articles/fractals/mandelbrot/mandelbrot-view.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports:cameraModel,Math,Number,BigInt});
  const report=[];fs.mkdirSync(path.join(root,'tmp/mandelbrot-audit'),{recursive:true});
  const camera=async()=>cameraModel.restoreView(await evaluate("(() => {const v=ng.getComponent(document.querySelector('app-mandelbrot')).view;return {real:v.real.toString(),imag:v.imag.toString(),bits:v.bits,zoom:v.zoom};})()"));
  const waitReady=async()=>{
    let ready=false;
    for(let i=0;i<1200;i++){const state=await evaluate("(() => {const a=document.querySelector('app-mandelbrot');if(!a)return null;const c=ng.getComponent(a);return {drawing:c.isDrawing,error:c.error};})()");if(state?.error)throw Error(state.error);if(state&&!state.drawing){ready=true;break;}await pause(100);}
    assert(ready,'Rendering did not finish');await pause(50);
  };
  const layout=async()=>evaluate(`(() => {
    const a=document.querySelector('app-mandelbrot'),stage=a.querySelector('.mb-stage').getBoundingClientRect(),console=a.querySelector('.mb-console').getBoundingClientRect();
    const clipping=[...a.querySelectorAll('.mb-console button,.mb-console input,.mb-console select')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&(r.left<0||r.right>innerWidth+1);}).length;
    const canvas=a.querySelector('canvas'),data=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;let painted=0,hash=0;const colors=new Set();
    for(let n=0;n<data.length;n+=124){if(data[n]>30||data[n+1]>30||data[n+2]>30)painted++;hash=(Math.imul(hash,31)+data[n]+data[n+1]*7+data[n+2]*13)|0;colors.add(data[n]+','+data[n+1]+','+data[n+2]);}
    const c=ng.getComponent(a);
    return {width:innerWidth,height:innerHeight,stage:{left:stage.left,top:stage.top,width:stage.width,height:stage.height},console:{left:console.left,top:console.top,width:console.width,height:console.height},groupHeight:console.bottom-stage.top,below:console.top>=stage.bottom-1,clipping,overflow:document.documentElement.scrollWidth>innerWidth+2,painted,hash,colors:colors.size,zoom:c.view.zoom,bits:c.view.bits,threads:c.threadCount,milliseconds:c.renderMilliseconds,skipped:c.skippedIterations};
  })()`);
  const shot=async name=>{const clip=await evaluate("(() => {const r=document.querySelector('.mandelbrot-studio').getBoundingClientRect();return {x:Math.max(0,r.left+scrollX),y:Math.max(0,r.top+scrollY),width:r.width,height:r.height,scale:1};})()");const data=await call('Page.captureScreenshot',{format:'png',clip,captureBeyondViewport:true});fs.writeFileSync(path.join(root,'tmp/mandelbrot-audit',name+'.png'),Buffer.from(data.data,'base64'));};
  await call('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  await call('Page.navigate',{url:origin+'/articles/mandelbrot-set'});await waitReady();
  await evaluate("document.querySelector('.mb-stage').scrollIntoView({block:'center',behavior:'instant'})");
  let state=await layout();assert(state.below&&!state.clipping&&!state.overflow&&state.painted>100);report.push({name:'desktop',state});await shot('desktop');
  const before=await camera(),pivot={x:state.stage.width*.73,y:state.stage.height*.31};
  const scrollBefore=await evaluate('scrollY');
  await evaluate("document.querySelector('canvas').addEventListener('wheel',e=>{const r=e.currentTarget.getBoundingClientRect();window.mandelWheel={x:e.clientX-r.left,y:e.clientY-r.top,width:r.width,height:r.height,delta:e.deltaY};},{capture:true,once:true})");
  await call('Input.dispatchMouseEvent',{type:'mouseWheel',x:state.stage.left+pivot.x,y:state.stage.top+pivot.y,deltaX:0,deltaY:-240});
  await pause(30);const zoomed=await camera();assert(zoomed.zoom>before.zoom);
  const actualWheel=await evaluate('window.mandelWheel');assert(actualWheel,'Wheel did not reach the canvas');
  const anchor=cameraModel.pointAt(before,actualWheel.x,actualWheel.y,actualWheel.width,actualWheel.height),nextAnchor=cameraModel.pointAt(zoomed,actualWheel.x,actualWheel.y,actualWheel.width,actualWheel.height),shift=BigInt(zoomed.bits-before.bits);
  assert(nextAnchor[0]-(anchor[0]<<shift)<=2n&&nextAnchor[0]-(anchor[0]<<shift)>=-2n&&nextAnchor[1]-(anchor[1]<<shift)<=2n&&nextAnchor[1]-(anchor[1]<<shift)>=-2n,'Wheel does not preserve cursor anchor');
  assert.equal(await evaluate('scrollY'),scrollBefore,'Wheel scrolls the article instead of zooming');await waitReady();
  state=await layout();const beforeDrag=await camera(),start={x:state.stage.left+state.stage.width*.4,y:state.stage.top+state.stage.height*.5};
  await call('Input.dispatchMouseEvent',{type:'mousePressed',x:start.x,y:start.y,button:'left',buttons:1,clickCount:1});
  await call('Input.dispatchMouseEvent',{type:'mouseMoved',x:start.x+54,y:start.y+29,button:'left',buttons:1});
  await call('Input.dispatchMouseEvent',{type:'mouseReleased',x:start.x+54,y:start.y+29,button:'left',buttons:0,clickCount:1});
  const dragged=await camera();assert(dragged.real!==beforeDrag.real&&dragged.imag!==beforeDrag.imag,'Mouse drag did not move the camera');await waitReady();
  const oldHash=(await layout()).hash;await evaluate("(() => {window.mandelbrotField=ng.getComponent(document.querySelector('app-mandelbrot')).field;const select=document.querySelector('select[name=palette]');select.value='fire';select.dispatchEvent(new Event('change',{bubbles:true}));})()");await pause(100);
  assert.equal(await evaluate("ng.getComponent(document.querySelector('app-mandelbrot')).field===window.mandelbrotField"),true,'Palette recomputes orbits');assert.notEqual((await layout()).hash,oldHash,'Palette selector does not recolor');const fireHash=(await layout()).hash;
  await evaluate("(() => {const input=document.querySelector('input[name=phase]');input.value='.231';input.dispatchEvent(new Event('input',{bubbles:true}));})()");await pause(80);assert.notEqual((await layout()).hash,fireHash);await shot('desktop-fire');
  await evaluate("document.querySelector('canvas').focus()");await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Home',code:'Home'});await call('Input.dispatchKeyEvent',{type:'keyUp',key:'Home',code:'Home'});await waitReady();assert((await camera()).zoom<=0,'Home did not fit the whole set');
  for(const device of [{width:390,height:844},{width:320,height:568},{width:844,height:390}]) {
    await call('Emulation.setDeviceMetricsOverride',{...device,deviceScaleFactor:2,mobile:true});await pause(200);await waitReady();
    await evaluate("document.querySelector('.mb-stage').scrollIntoView({block:'start',behavior:'instant'})");
    state=await layout();assert(state.below&&!state.clipping&&!state.overflow,'Controls layout failed '+device.width);assert(state.groupHeight<device.height-24,'Controls and image require scrolling '+device.width+' '+state.groupHeight);report.push({name:device.width+'x'+device.height,state});await shot('mobile-'+device.width);
    if(device.width===390) {
      await call('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:2});
      await evaluate("document.querySelector('.mb-stage').scrollIntoView({block:'center',behavior:'instant'});document.querySelector('canvas').focus({preventScroll:true})");await pause(100);state=await layout();
      const before=await camera(),x=state.stage.left+state.stage.width/2,y=state.stage.top+state.stage.height/2;
      assert.equal(await evaluate(`document.elementFromPoint(${x},${y})?.tagName`),'CANVAS','Touch points miss the visible canvas');
      const originalAnchor=cameraModel.pointAt(before,state.stage.width/2,state.stage.height/2,state.stage.width,state.stage.height);
      await call('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{id:1,x:x-45,y,force:1,radiusX:3,radiusY:3},{id:2,x:x+45,y,force:1,radiusX:3,radiusY:3}]});
      await pause(80);
      await call('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{id:1,x:x-67.5+12,y:y+8,force:1,radiusX:3,radiusY:3},{id:2,x:x+67.5+12,y:y+8,force:1,radiusX:3,radiusY:3}]});
      await pause(80);
      await call('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
      await pause(80);const after=await camera();assert(Math.abs(after.zoom-before.zoom-Math.log2(1.5))<.02,'Pinch zoom ratio is wrong');
      const actualAnchor=cameraModel.pointAt(after,state.stage.width/2+12,state.stage.height/2+8,state.stage.width,state.stage.height),shift=BigInt(after.bits-before.bits),tolerance=cameraModel.spanFixed(after)/100000000n;
      assert(actualAnchor[0]-(originalAnchor[0]<<shift)<tolerance&&actualAnchor[0]-(originalAnchor[0]<<shift)>-tolerance,'Pinch real anchor moved');assert(actualAnchor[1]-(originalAnchor[1]<<shift)<tolerance&&actualAnchor[1]-(originalAnchor[1]<<shift)>-tolerance,'Pinch imaginary anchor moved');await waitReady();
      assert.equal(await evaluate("ng.getComponent(document.querySelector('app-mandelbrot')).dragging"),false);
      const beforePan=await camera();
      await call('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{id:5,x,y,force:1,radiusX:3,radiusY:3}]});await pause(60);
      await call('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{id:5,x:x+24,y:y+20,force:1,radiusX:3,radiusY:3}]});await pause(60);
      await call('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await pause(60);
      const afterPan=await camera();assert(afterPan.real!==beforePan.real&&afterPan.imag!==beforePan.imag,'One-finger drag failed');assert.equal(afterPan.zoom,beforePan.zoom,'One-finger drag changes zoom');await waitReady();
      await call('Emulation.setTouchEmulationEnabled',{enabled:false});
    }
  }
  // Choose an exact endpoint reference through the UI, beyond binary64 exponent range.
  await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await pause(150);await waitReady();
  await evaluate("(() => {document.querySelector('.mb-details').open=true;const select=document.querySelector('select[name=preset]');select.selectedIndex=4;select.dispatchEvent(new Event('change',{bubbles:true}));})()");await waitReady();
  state=await layout();assert(state.groupHeight<820,'Deep preset leaves controls off screen');assert.equal(state.zoom,1100);assert(state.bits>=1196&&state.skipped>10000&&state.colors>8,'Extended deep zoom did not produce a detailed image');report.push({name:'deep-1100',state});await shot('deep-1100');
  await evaluate("(() => {const bits=4192;const view={real:(-2n<<BigInt(bits)).toString(),imag:'0',bits,zoom:4096};const dt=new DataTransfer();dt.items.add(new File([JSON.stringify({version:1,view,palette:'labs',phase:0})],'deep.json',{type:'application/json'}));const input=document.querySelector('input[type=file]');input.files=dt.files;input.dispatchEvent(new Event('change',{bubbles:true}));})()");await pause(80);await waitReady();
  state=await layout();assert(state.groupHeight<820,'Saved view leaves controls off screen');assert.equal(state.zoom,4096);assert(state.bits>=4192&&state.skipped>10000&&state.colors>8,'Imported arbitrary precision view failed');report.push({name:'deep-4096',state});await shot('deep-4096');
  fs.writeFileSync(path.join(root,'tmp/mandelbrot-audit/report.json'),JSON.stringify(report,null,2));
  assert.equal(errors.length,0,errors.join('\n'));
  console.log('PASS: native cursor-anchored wheel, mouse drag, two-finger pinch/pan, instant palettes, keyboard, four layouts, workers, BLA and visible zooms beyond 10^1233.');

}

main().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => {
  clearTimeout(watchdog);
  if (socket) socket.close();
  if (browser) { browser.kill(); await pause(500); }
  if (server) server.close();
  const resolved = path.resolve(profile), prefix = path.resolve(os.tmpdir(), 'danisagan-mandelbrot-audit-');
  if (!resolved.startsWith(prefix)) throw Error('Unexpected browser profile path.');
  try { fs.rmSync(resolved, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 }); } catch { /* Chrome may retain a short-lived file lock. */ }
});
