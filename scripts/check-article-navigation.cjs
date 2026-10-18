// Real Chrome integration/visual audit; run after a development build.
const fs = require('node:fs'), path = require('node:path'), os = require('node:os'), http = require('node:http');
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict'), WebSocket = require('ws');
const dist = path.resolve('dist/dani.sagan.labs/browser');
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'danisagan-article-navigation-audit-'));
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


  const {inventory}=require('./test-article-navigation.cjs');
  const expected=inventory();
  const recovered=['cantor-function','apollonian-sieve','stratified-sampling','causal-inference','bootstrap','statistical-power','proportion-intervals','student-chi-square','covariance','probability-inequalities','large-numbers-law'];
  const shots=path.resolve('tmp/article-navigation-audit');fs.mkdirSync(shots,{recursive:true});
  const waitFor=async(expression,label)=>{for(let i=0;i<180;i++){if(await evaluate(expression))return;await pause(100);}throw Error('Timed out '+label+' '+await evaluate('location.href'));};
  const navigate=async route=>{await call('Page.navigate',{url:origin+route});};
  const menu='.section-navigation';
  const linkFor=route=>menu+' a[href="/articles/'+route+'"]';
  const ready=async selector=>waitFor('!!document.querySelector('+JSON.stringify(selector)+')',selector);
  const search=async value=>{
    await evaluate('(()=>{const e=document.querySelector(".section-navigation input[type=search]");e.value='+JSON.stringify(value)+';e.dispatchEvent(new Event("input",{bubbles:true}));})()');
    await pause(150);
  };
  const expandFor=async selector=>{
    await evaluate('(()=>{const link=document.querySelector('+JSON.stringify(selector)+');const groups=[];let group=link.closest(".navigation-group");while(group){groups.unshift(group);group=group.parentElement.closest(".navigation-group");}for(const g of groups){const button=g.querySelector(":scope > button.subsection");if(button.getAttribute("aria-expanded")!=="true")button.click();}})()');
    await waitFor('document.querySelector('+JSON.stringify(selector)+').getClientRects().length>0','visible menu link');
  };
  const click=async selector=>evaluate('document.querySelector('+JSON.stringify(selector)+').click()');
  await call('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  await navigate('/articles');await ready(linkFor('covariance'));
  const actual=await evaluate('Array.from(document.querySelectorAll(".section-navigation a[href^=\\"/articles/\\"]")).map(a=>({href:a.getAttribute("href"),title:a.textContent.trim()}))');
  assert.equal(actual.length,expected.routed.length,'all article links rendered');
  assert.equal(new Set(actual.map(a=>a.href)).size,actual.length,'no duplicate links');
  for(const item of expected.links) {
    const link=actual.find(a=>a.href==='/articles/'+item.route);
    assert(link,'rendered route '+item.route);assert.equal(link.title,item.name,'catalogue title '+item.route);
  }
  assert((await evaluate('document.querySelector(".total-count").textContent')).includes(String(expected.routed.length)),'total count');
  // Open real groups and follow each previously missing article.
  for(const route of recovered) {
    await search('');await waitFor('document.querySelectorAll(".section-navigation a[href^=\\"/articles/\\"]").length==='+expected.routed.length,'reset menu');
    const selector=linkFor(route);await expandFor(selector);
    await evaluate('document.querySelector('+JSON.stringify(selector)+').scrollIntoView({block:"center",behavior:"instant"})');
    await click(selector);
    const file=expected.physical.find(a=>a.route===route).file;
    const component=fs.readFileSync(file,'utf8').match(/selector:\s*['"]([^'"]+)/)[1];
    await waitFor('location.pathname==='+JSON.stringify('/articles/'+route)+' && !!document.querySelector('+JSON.stringify(component)+')','menu route '+route);
    await waitFor('document.querySelector('+JSON.stringify(selector)+').getAttribute("aria-current")==="page"','active route '+route);
    assert(await evaluate('document.querySelector('+JSON.stringify(selector)+').classList.contains("active")'),'active class '+route);
  }
  await search('covarianza');
  await waitFor('document.querySelectorAll(".section-navigation a").length===1','covariance search');
  assert(await evaluate('document.querySelector('+JSON.stringify(linkFor('covariance'))+').getClientRects().length>0'),'search expands ancestors');
  assert((await evaluate('document.querySelector(".navigation-groups").textContent')).includes('Estadística descriptiva y dependencia'),'covariance thematic group');
  await click(linkFor('covariance'));
  await waitFor('!!document.querySelector("app-covariance-article")','covariance desktop');
  const desktop=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(shots,'covariance-desktop.png'),Buffer.from(desktop.data,'base64'));
  for(const width of[390,320]) {
    await call('Emulation.setDeviceMetricsOverride',{width,height:950,deviceScaleFactor:1,mobile:true});
    await navigate('/articles');await ready(linkFor('covariance'));
    await click('label.sidebar-toggle');await waitFor('document.querySelector("#sidebar-toggle-articles").checked','mobile menu opens');
    await search('covarianza');await waitFor('document.querySelectorAll(".section-navigation a").length===1','mobile search');
    await click(linkFor('covariance'));await waitFor('!!document.querySelector("app-covariance-article")','mobile covariance');
    assert.equal(await evaluate('document.querySelector("#sidebar-toggle-articles").checked'),false,'menu closes after navigation');
    await click('label.sidebar-toggle');await pause(650);
    const geometry=await evaluate('(()=>{const r=document.querySelector(".sidebar").getBoundingClientRect();return {left:r.left,right:r.right,width:innerWidth,scroll:document.documentElement.scrollWidth};})()');
    assert(geometry.left>=0&&geometry.right<=width,'menu fits '+width+': '+JSON.stringify(geometry));
    assert(geometry.scroll<=width,'page overflow '+width+': '+JSON.stringify(geometry));
    const shot=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(shots,'covariance-mobile-'+width+'.png'),Buffer.from(shot.data,'base64'));
    await search('');await waitFor('document.querySelectorAll(".section-navigation a").length==='+expected.routed.length,'mobile reset');
    await expandFor(linkFor('covariance'));
    assert(await evaluate('document.querySelector('+JSON.stringify(linkFor('covariance'))+').getClientRects().length>0'),'active group expanded');
  }
  assert.deepEqual(errors,[],'No runtime exceptions');
  console.log('PASS: '+actual.length+' rendered sidebar links match routing and catalogue titles; all 11 recovered articles reachable through their groups; covariance search, active link and mobile open/close at 390/320px; no overflow or runtime errors. Screenshots: tmp/article-navigation-audit');
}
main().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{clearTimeout(watchdog);socket?.close();browser?.kill();await pause(500);server?.close();const resolved=path.resolve(profile);if(!resolved.startsWith(path.resolve(os.tmpdir(),'danisagan-article-navigation-audit-')))throw Error('Unexpected profile path');try{fs.rmSync(resolved,{recursive:true,force:true,maxRetries:3})}catch{}});
