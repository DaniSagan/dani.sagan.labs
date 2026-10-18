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
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'danisagan-koch-antisnowflake-audit-'));
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



  const explorer="ng.getComponent(document.querySelector('app-koch-antisnowflake app-fractal-explorer'))";
  await call('Page.navigate',{url:origin+'/articles/koch-antisnowflake'});
  const wait=async expression=>{for(let i=0;i<200;i++){if(await evaluate(expression))return;await pause(100);}throw Error('Timed out '+expression);};
  await wait("!!document.querySelector('app-koch-antisnowflake canvas')");
  await evaluate(`(()=>{
    const c=${explorer},draw=c.draw;
    c.draw=(ctx,n,size)=>{
      const points=[],move=ctx.moveTo,line=ctx.lineTo;
      ctx.moveTo=function(x,y){points.push([x,y]);return move.call(this,x,y)};
      ctx.lineTo=function(x,y){points.push([x,y]);return line.call(this,x,y)};
      try{draw(ctx,n,size)}finally{ctx.moveTo=move;ctx.lineTo=line}
      const stride=4**n,triangle=[points[0],points[stride],points[2*stride],points[0]];
      const area=p=>p.slice(0,-1).reduce((a,q,i)=>a+q[0]*p[i+1][1]-q[1]*p[i+1][0],0)/2;
      const sign=Math.sign(area(triangle));
      const inside=points.every(p=>triangle.slice(0,3).every((a,i)=>{const b=triangle[i+1];return sign*((b[0]-a[0])*(p[1]-a[1])-(b[1]-a[1])*(p[0]-a[0]))>=-1e-6}));
      window.antiRecord={n,count:points.length,ratio:area(points)/area(triangle),inside};
    };
    c.update();
  })()`);
  const click=async selector=>{
    await evaluate('document.querySelector('+JSON.stringify(selector)+').scrollIntoView({block:"center",behavior:"instant"})');
    const p=await evaluate('(()=>{const r=document.querySelector('+JSON.stringify(selector)+').getClientRects()[0];return{x:r.left+r.width/2,y:r.top+r.height/2}})()');
    await call('Input.dispatchMouseEvent',{type:'mousePressed',...p,button:'left',buttons:1,clickCount:1});await call('Input.dispatchMouseEvent',{type:'mouseReleased',...p,button:'left',buttons:0,clickCount:1});
  };
  const key=async(name,code)=>{await call('Input.dispatchKeyEvent',{type:'keyDown',key:name,code:name,windowsVirtualKeyCode:code});await call('Input.dispatchKeyEvent',{type:'keyUp',key:name,code:name,windowsVirtualKeyCode:code});};
  const shots=path.resolve('tmp/koch-antisnowflake-audit');fs.mkdirSync(shots,{recursive:true});
  await wait('window.antiRecord?.n===4');
  await evaluate("document.querySelector('app-fractal-explorer input[type=range]').focus()");
  await key('Home',36);await wait('window.antiRecord.n===0');
  for(let n=0;n<=6;n++){
    if(n){await key('ArrowRight',39);await wait('window.antiRecord.n==='+n);}
    const r=await evaluate('window.antiRecord');assert.equal(r.count,3*4**n+1);assert(r.inside,'inward at stage '+n);assert(Math.abs(r.ratio-(2/5+3/5*(4/9)**n))<1e-7,'area stage '+n);
    if(n===0||n===1||n===4){
      await evaluate("document.querySelector('.fractal-workspace').scrollIntoView({block:'center',behavior:'instant'})");
      const shot=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(shots,'stage-'+n+'-1440.png'),Buffer.from(shot.data,'base64'));
    }
    if(n===1){
      const file=path.join(shots,'anticopo-de-koch-1.png');if(fs.existsSync(file))fs.unlinkSync(file);
      await call('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:shots});
      await click('.save-button');for(let i=0;i<80&&!fs.existsSync(file);i++)await pause(100);
      assert(fs.existsSync(file),'PNG downloaded');assert.equal(fs.readFileSync(file).subarray(1,4).toString(),'PNG');
      await evaluate("document.querySelector('app-fractal-explorer input[type=range]').focus()");
    }
  }
  assert(await evaluate("document.querySelector('.step-controls button:last-child').disabled"),'upper iteration bound');
  await click('.step-controls button:nth-child(2)');await wait('window.antiRecord.n===4');
  for(const device of [{width:1440,height:1000,mobile:false},{width:390,height:844,mobile:true},{width:320,height:568,mobile:true},{width:844,height:390,mobile:true}]){
    await call('Emulation.setDeviceMetricsOverride',{...device,deviceScaleFactor:2});await pause(200);
    await evaluate("document.querySelector('.fractal-workspace').scrollIntoView({block:'center',behavior:'instant'})");
    assert(await evaluate("(()=>{const r=document.querySelector('.fractal-workspace').getBoundingClientRect();return r.top>=-1&&r.bottom<=innerHeight+1})()"),'controls plus canvas visible '+device.width);
    assert(await evaluate("[...document.querySelectorAll('.fractal-studio,.fractal-workspace')].every(e=>e.scrollWidth<=e.clientWidth+2)"),'no overflow '+device.width);
    if(device.width===390){const shot=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(shots,'stage-4-390.png'),Buffer.from(shot.data,'base64'));}
  }
  await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,mobile:true,deviceScaleFactor:2});
  await call('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});
  await evaluate("document.querySelector('.step-controls button:first-child').scrollIntoView({block:'center',behavior:'instant'})");
  await pause(250);
  const p=await evaluate("(()=>{const r=document.querySelector('.step-controls button:first-child').getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2}})()");
  await call('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...p,id:1}]});await call('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await pause(500);await wait(explorer+'.iterations===3');
  assert.equal(errors.length,0,errors.join('\n'));
  console.log('PASS actual Canvas geometry through stages 0–6; inward containment and area; native keyboard and touch controls; reset/bounds; PNG download; controls with canvas at 1440/390/320/844px. Screenshots: tmp/koch-antisnowflake-audit');
}
main().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => {
  clearTimeout(watchdog);
  if (socket) socket.close();
  if (browser) { browser.kill(); await pause(500); }
  if (server) server.close();
  const resolved = path.resolve(profile), prefix = path.resolve(os.tmpdir(), 'danisagan-koch-antisnowflake-audit-');
  if (!resolved.startsWith(prefix)) throw Error('Unexpected browser profile path.');
  try { fs.rmSync(resolved, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 }); } catch { /* Chrome may retain a short-lived file lock. */ }
});


