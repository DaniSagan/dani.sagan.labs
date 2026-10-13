/* Browser smoke test against an existing development build; no external browser package required. */
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const http = require('node:http');
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');
const WebSocket = require('ws');
const articles = fs.readdirSync(path.join(__dirname,'../src/app/articles/fractals'), {withFileTypes:true}).filter(d=>d.isDirectory()&&d.name!=='fractal-explorer').map(d=>{ const base=path.join(__dirname,'../src/app/articles/fractals',d.name); const file=fs.readdirSync(base).find(f=>f.endsWith('.component.ts')); if(!file)return null; const src=fs.readFileSync(path.join(base,file),'utf8'); return {slug:src.match(/static (?:readonly )?route(?:\s*:\s*string)?\s*=\s*['"]([^'"]+)/)[1]}; }).filter(Boolean);
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist/dani.sagan.labs/browser');
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'danisagan-fractal-audit-'));
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
﻿  const reports=process.env.FRACTAL_COMPACT_ONLY ? JSON.parse(fs.readFileSync(path.join(root,'tmp/fractal-audit/report.json'),'utf8')).filter(r=>(r.device.width===1440||r.device.width===390)&&!['phoenix-set-fractal','menger-sponge'].includes(r.slug)) : [];
  fs.mkdirSync(path.join(root,'tmp/fractal-audit'),{recursive:true});
  for(const device of [{width:1440,height:1000,mobile:false},{width:390,height:844,mobile:true},{width:320,height:568,mobile:true},{width:844,height:390,mobile:true}]) {
    await call('Emulation.setDeviceMetricsOverride',{...device,deviceScaleFactor:2});
    const subset=device.width===1440||device.width===390?(process.env.FRACTAL_COMPACT_ONLY?articles.filter(a=>['phoenix-set-fractal','menger-sponge'].includes(a.slug)):articles):articles.filter(a=>['mandelbrot-set','newton-set-fractal','phoenix-set-fractal','apollonian-sieve','dragon-curve','julia-set','multibrot','koch-snowflake','menger-sponge','bifurcation-diagram','cantor-function','zero-measure-dimension','fractal-measure-dimension','feigenbaum'].includes(a.slug));
    for(const a of subset) {
      await call('Page.navigate',{url:origin+'/articles/'+a.slug});
      let ready=false;
      for(let i=0;i<100;i++){if(await evaluate("!!document.querySelector('.fractal-page canvas,.fractal-page app-learning-plot svg')")){ready=true;break;}await pause(100);}
      assert(ready,'Missing visualization: '+a.slug);
      await pause(180);
      for(let i=0;i<120;i++){if(await evaluate("(() => {const a=document.querySelector('.fractal-page');const c=ng.getComponent(a);return !c?.isDrawing;})()"))break;await pause(100);}
      const state=await evaluate(`(() => {
        const article=document.querySelector('.fractal-page');
        const workspace=article.querySelector('.fractal-workspace,.legacy-workspace');
        const visual=article.querySelector('canvas,app-learning-plot svg');
        const r=(workspace||visual).getBoundingClientRect();
        let painted=true;
        if(visual.tagName==='CANVAS'){const data=visual.getContext('2d').getImageData(0,0,visual.width,visual.height).data;let count=0;for(let i=0;i<data.length;i+=4)if(data[i+3]&&Math.max(data[i],data[i+1],data[i+2])>70)count++;painted=count>10;}
        const narrow=[...article.querySelectorAll('input[type=range]')].filter(e=>e.getBoundingClientRect().width<80).length;
        const clipped=[...article.querySelectorAll('input,select,button')].filter(e=>{const r=e.getBoundingClientRect();return r.width&& (r.left < -1 || r.right > innerWidth+1);}).map(e=>e.outerHTML.slice(0,120));
        return {path:location.pathname,painted,width:r.width,height:r.height,viewport:innerHeight,overflow:document.documentElement.scrollWidth>innerWidth+2,clipped,narrow,workspace:!!workspace};
      })()`);
      reports.push({slug:a.slug,device,state});
      fs.writeFileSync(path.join(root,'tmp/fractal-audit/report.json'),JSON.stringify(reports,null,2));
      assert(state.painted,'Empty visual: '+a.slug);
      assert.equal(state.narrow,0,'Slider too narrow: '+a.slug+' '+device.width);
      assert(!state.overflow,'Horizontal overflow: '+a.slug+' '+device.width);
      assert(!state.clipped.length,'Clipped controls: '+a.slug+' '+device.width+JSON.stringify(state.clipped));
      if(device.mobile&&state.workspace) assert(state.height<=device.height-60,'Controls and drawing exceed viewport: '+a.slug+' '+device.width+' '+state.height);
      const iterationResult=await evaluate("(() => {const a=document.querySelector('.fractal-page');const b=[...a.querySelectorAll('button')].find(b=>b.textContent.includes('+ Iteraciones'));if(!b)return true;const c=ng.getComponent(a);const before=c.maxIterations??c.iterations;b.click();return (c.maxIterations??c.iterations)>before;})()");
      assert(iterationResult,'Iteration button failed: '+a.slug);
      await evaluate("document.querySelectorAll('.fractal-page .navigation-controls button').forEach(b=>b.click())");
      const controlCount=await evaluate("[...document.querySelector('.fractal-page').querySelectorAll('input,select')].filter(e=>e.getBoundingClientRect().width&&e.type!=='search').length");
      for(let controlIndex=0;controlIndex<controlCount;controlIndex++) {
        await evaluate(`(() => {const a=document.querySelector('.fractal-page');const controls=[...a.querySelectorAll('input,select')].filter(e=>e.getBoundingClientRect().width&&e.type!=='search');const input=controls[${controlIndex}];if(input.tagName==='SELECT'){input.selectedIndex=(input.selectedIndex+1)%input.options.length;input.dispatchEvent(new Event('change',{bubbles:true}));}else{const step=Number(input.step)||1;const old=Number(input.value);input.value=Number.isFinite(old)?old+(input.max&&old+step>Number(input.max)?-step:step):0;input.dispatchEvent(new Event('input',{bubbles:true}));}const form=input.closest('form');if(form)form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));return true;})()`);
        await pause(60);
      }
      for(let i=0;i<120;i++){if(await evaluate("!ng.getComponent(document.querySelector('.fractal-page'))?.isDrawing"))break;await pause(100);}
      await pause(60);
      if(['koch-snowflake','menger-sponge','mandelbrot-set','phoenix-set-fractal','apollonian-sieve','julia-set','feigenbaum'].includes(a.slug)&&device.width!==844){
        await evaluate("document.querySelector('.fractal-page .widget-container,.fractal-page .lab,.fractal-page .math-lab,.fractal-page .explorer')?.scrollIntoView({block:'start',behavior:'instant'})");
        await pause(100);const clip=await evaluate("(() => {const el=document.querySelector('.fractal-page .widget-container,.fractal-page .lab,.fractal-page .math-lab,.fractal-page .explorer');const r=el.getBoundingClientRect();return {x:Math.max(0,r.left+scrollX),y:Math.max(0,r.top+scrollY),width:r.width,height:Math.min(r.height,innerHeight),scale:1};})()");const shot=await call('Page.captureScreenshot',{format:'png',clip,captureBeyondViewport:true});fs.writeFileSync(path.join(root,'tmp/fractal-audit',a.slug+'-'+device.width+'.png'),Buffer.from(shot.data,'base64'));
      }
    }
    console.log('Checked '+subset.length+' articles at '+device.width+'x'+device.height);
  }
  assert.equal(errors.length,0,errors.join('\n'));
  console.log('PASS: all fractal articles render, controls fit, drawings are nonempty and no runtime exceptions.');

}
main().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => {
  clearTimeout(watchdog);
  if (socket) socket.close();
  if (browser) { browser.kill(); await pause(500); }
  if (server) server.close();
  const resolved = path.resolve(profile), prefix = path.resolve(os.tmpdir(), 'danisagan-fractal-audit-');
  if (!resolved.startsWith(prefix)) throw Error('Unexpected browser profile path.');
  try { fs.rmSync(resolved, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 }); } catch { /* Chrome may retain a short-lived file lock. */ }
});
