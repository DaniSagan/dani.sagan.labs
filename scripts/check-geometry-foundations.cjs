// Real Chrome integration/visual audit; run after a development build.
const fs = require('node:fs'), path = require('node:path'), os = require('node:os'), http = require('node:http');
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict'), WebSocket = require('ws');
const dist = path.resolve('dist/dani.sagan.labs/browser');
const downloadDir = path.resolve('tmp/foundations-downloads', String(Date.now()));
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'danisagan-foundations-audit-'));
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


  const shots=path.resolve('tmp/geometry-foundations-audit');fs.mkdirSync(shots,{recursive:true});
  const base='src/app/articles/geometry';
  const catalogue=fs.readFileSync(path.join(base,'foundations/geometry-foundations-articles.ts'),'utf8');
  const routes=[...catalogue.matchAll(/import \{ \w+ \} from '\.\.\/([^/]+)\//g)].map(m=>m[1]);
  let slug;
  const component=()=> "ng.getComponent(document.querySelector('app-"+slug+"-article'))";
  const state=s=>evaluate('(()=>{const c='+component()+';return '+s+'})()');
  const action=async s=>{await evaluate('(()=>{const c='+component()+';'+s+';ng.applyChanges(c)})()');await pause(100);};
  const navigate=async route=>{
    await call('Page.navigate',{url:origin+'/articles/'+route});
    for(let i=0;i<160;i++){if(await evaluate("!!document.querySelector('app-"+route+"-article .concept-lab svg')"))break;await pause(100);}
    assert(await evaluate("!!document.querySelector('app-"+route+"-article .concept-lab svg')"),route+' diagram');
  };
  const svgValid=()=>evaluate("!Array.from(document.querySelectorAll('.concept-lab svg *')).some(e=>e.getAttributeNames().some(n=>/NaN|Infinity|undefined/.test(e.getAttribute(n))))");
  for(slug of routes){
    await call('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
    await navigate(slug);
    const html=fs.readFileSync(path.join(base,slug,slug+'-article.component.html'),'utf8');
    const formulaCount=[...html.matchAll(/<app-formula/g)].length;
    for(let i=0;i<120;i++){if(await evaluate("document.querySelectorAll('app-formula mjx-container').length")==formulaCount)break;await pause(100);}
    assert.equal(await evaluate("document.querySelectorAll('app-formula mjx-container').length"),formulaCount,slug+' MathJax count');
    assert.equal(await evaluate("document.querySelectorAll('mjx-merror,[data-mml-node=merror]').length"),0,slug+' MathJax errors');
    assert(await svgValid(),slug+' initial SVG');
    const initial=await state("Object.fromEntries(Object.entries(c).filter(([k,v])=>!k.startsWith('__')&&['number','boolean','string'].includes(typeof v)))");
    const before=await state('c.labValue');
    await evaluate("(()=>{const e=document.querySelector('.concept-lab input[type=range],.concept-lab select');if(e.tagName==='SELECT'){e.selectedIndex=e.options.length-1;e.dispatchEvent(new Event('change',{bubbles:true}));}else{e.value=e.max;e.dispatchEvent(new Event('input',{bubbles:true}));}})()");
    await pause(150);
    assert.notEqual(await state('c.labValue'),before,slug+' control changes mathematical result');
    assert(await svgValid(),slug+' updated SVG');
    await evaluate("(()=>{const e=document.querySelector('.concept-lab input[type=range]');if(e){e.value=e.min;e.dispatchEvent(new Event('input',{bubbles:true}));}})()");
    await pause(100);
    assert(await state('Number.isFinite(c.labValue)'),slug+' minimum control is finite');
    assert(await svgValid(),slug+' minimum SVG');
    if(slug==='vector-norm'){await action('c.x=0;c.y=0;c.z=0');assert.equal(await state('c.labValue'),0);}
    if(slug==='cross-product'){await action('c.angle=90;c.reversed=false');assert.equal(await state('c.labValue'),6);await evaluate("document.querySelector('.concept-lab button').click()");await pause(80);assert.equal(await state('c.labValue'),-6);}
    if(slug==='complementary-supplementary-angles'){await action('c.angle=150;c.setTotal(180);c.setTotal(90)');assert.equal(await state('c.angle'),90);}
    if(slug==='homothety'){await action('c.ratio=0');assert(await svgValid());await action('c.ratio=-1');}
    await action('Object.assign(c,'+JSON.stringify(initial)+')');
    await evaluate("document.querySelector('.exercise details').open=true");
    assert(await evaluate("document.querySelector('.exercise details').open"));
    await evaluate("document.querySelector('.concept-lab').scrollIntoView({block:'center',behavior:'instant'})");
    let shot=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(shots,slug+'-desktop.png'),Buffer.from(shot.data,'base64'));
    for(const width of[390,320]){
      await call('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:true});
      await pause(180);
      await evaluate("document.querySelector('.concept-lab').scrollIntoView({block:'start',behavior:'instant'})");
      const geometry=await evaluate("({width:innerWidth,scroll:document.documentElement.scrollWidth})");
      assert(geometry.scroll<=geometry.width,slug+' overflow '+width+': '+JSON.stringify(geometry));
      if(width===390){shot=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(shots,slug+'-mobile.png'),Buffer.from(shot.data,'base64'));}
    }
    const link=await evaluate("(()=>{const e=Array.from(document.querySelectorAll('.definition a[href],.related a[href]')).find(a=>new URL(a.href).pathname!==location.pathname&&a.getAttribute('href').startsWith('/articles/'));if(!e)return null;const target=new URL(e.href).pathname;e.click();return target;})()");
    if(link){for(let i=0;i<100;i++){if(await evaluate('location.pathname')===link)break;await pause(100);}assert.equal(await evaluate('location.pathname'),link);}
    console.log('PASS '+slug+': formulas '+formulaCount+', real controls, SVG, exercise, links, 1440/390/320px');
  }
  const samples=[
    ['tetrahedron-viewer','schlafli-symbol'],['hexahedron-viewer','polyhedral-duality'],['octahedron-viewer','dihedral-angle'],['dodecahedron-viewer','apothem'],['icosahedron-viewer','steradians'],
    ['matrix-determinant','scalar-triple-product'],['pentagon','incircles-circumcircles'],['brianchon-theorem','polyhedral-duality'],['cauchy-schwarz','dot-product']
  ];
  for(const [from,to]of samples){
    await call('Page.navigate',{url:origin+'/articles/'+from});
    for(let i=0;i<140;i++){if(await evaluate("!!document.querySelector('.body-text p a[href^=\"/articles/"+to+"\"]')"))break;await pause(100);}
    assert(await evaluate("!!document.querySelector('.body-text p a[href^=\"/articles/"+to+"\"]')"),from+' inline link to '+to);
    await evaluate("document.querySelector('.body-text p a[href^=\"/articles/"+to+"\"]').click()");
    for(let i=0;i<100;i++){if(await evaluate('location.pathname')==='/articles/'+to)break;await pause(100);}
    assert.equal(await evaluate('location.pathname'),'/articles/'+to);
    if(from==='brianchon-theorem')assert.equal(await evaluate('location.hash'),'#projective');
  }
  assert.deepEqual(errors,[],'No runtime exceptions');
  console.log('PASS 17 new articles, 9 existing-article link journeys and responsive diagrams. Screenshots: tmp/geometry-foundations-audit');
}

main().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{ clearTimeout(watchdog); socket?.close(); browser?.kill(); await pause(500); server?.close(); const resolved=path.resolve(profile); if(!resolved.startsWith(path.resolve(os.tmpdir(),'danisagan-foundations-audit-')))throw Error('Unexpected profile path'); try{fs.rmSync(resolved,{recursive:true,force:true,maxRetries:3})}catch{} });
