// Real Chrome integration/visual audit; run after a development build.
const fs = require('node:fs'), path = require('node:path'), os = require('node:os'), http = require('node:http');
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict'), WebSocket = require('ws');
const dist = path.resolve('dist/dani.sagan.labs/browser');
const downloadDir = path.resolve('tmp/latex-downloads', String(Date.now()));
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'danisagan-latex-audit-'));
const pause = ms => new Promise(r => setTimeout(r, ms));
let server, browser, socket;
const watchdog = setTimeout(() => { console.error('Audit timeout'); process.exit(1); }, 240000);
async function main() {
  const mime = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.woff2': 'font/woff2', '.woff': 'font/woff', '.svg': 'image/svg+xml' };
  server = http.createServer((req, res) => { let f = path.resolve(dist, '.' + new URL(req.url, 'http://localhost').pathname); if (!f.startsWith(dist + path.sep) || !fs.existsSync(f) || !fs.statSync(f).isFile()) f = path.join(dist, 'index.html'); res.setHeader('Content-Type', mime[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(res); });
  await new Promise(r => server.listen(0, '127.0.0.1', r)); const origin = `http://127.0.0.1:${server.address().port}`;
  browser = spawn(process.env.CHROME_BIN || 'C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--no-sandbox', '--disable-gpu', '--no-first-run', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
  let port; for (let i = 0; i < 120; i++) { const f = path.join(profile, 'DevToolsActivePort'); if (fs.existsSync(f)) { port = fs.readFileSync(f, 'utf8').split('\n')[0]; break; } await pause(100); }
  assert(port); const tabs = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  socket = new WebSocket(tabs.find(x => x.type === 'page').webSocketDebuggerUrl); await new Promise(r => socket.on('open', r));
  let id = 0; const pending = new Map(), errors = [], failedFonts = [];
  socket.on('message', raw => { const m = JSON.parse(raw); if (m.id) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.reject(Error(m.error.message)) : p.resolve(m.result); } else if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text); else if (m.method === 'Network.responseReceived' && /assets\/mathlive/.test(m.params.response.url) && m.params.response.status !== 200) failedFonts.push(m.params.response.url); });
  const call = (method, params = {}) => new Promise((resolve, reject) => { const n = ++id; pending.set(n, { resolve, reject }); socket.send(JSON.stringify({ id: n, method, params })); });
  const evaluate = async expression => { const r = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (r.exceptionDetails) throw Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text); return r.result.value; };
  await call('Page.enable'); await call('Runtime.enable'); await call('Network.enable');
  await call('Emulation.setFocusEmulationEnabled',{enabled:true});
  fs.mkdirSync(downloadDir,{recursive:true});
  await call('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: downloadDir });
  await call('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1100, deviceScaleFactor: 1, mobile: false });
  await call('Page.navigate', { url: origin + '/tools/latex-editor' });
  for (let i = 0; i < 180; i++) { if (await evaluate("!!document.querySelector('app-latex-editor math-field')?.shadowRoot")) break; await pause(100); }
  const component = "ng.getComponent(document.querySelector('app-latex-editor'))";
  const action = async s => { await evaluate(`(async()=>{const c=${component};${s};ng.applyChanges(c)})()`); await pause(80); };
  const state = s => evaluate(`(()=>{const c=${component};return ${s}})()`);
  assert(await state('c.count > 550')); assert(await state('c.field.lastOffset > 0'));
  const openDeletionFixture = async latex => action(`c.editCode(${JSON.stringify(latex)})`);
  const selectSource = async (start, end) => action(`c.codeRef.nativeElement.focus();c.codeRef.nativeElement.setSelectionRange(${start},${end});c.fromCode()`);
  for (const latex of [String.raw`\sqrt{x}`, String.raw`\frac{a}{b}`]) {
    await openDeletionFixture(latex);
    await selectSource(0, latex.length);
    await action("c.command('deleteBackward')");
    assert.equal(await state('c.latex'), '', 'Deleting a selected operator removes its structure');
    await action('c.undo(-1)');
    assert.equal(await state('c.latex'), latex, 'Operator deletion is undoable');
    await action('c.undo(1)');
    assert.equal(await state('c.latex'), '', 'Operator deletion is redoable');
    await openDeletionFixture(latex);
    await action("c.field.focus();c.field.executeCommand('selectAll');c.fromVisual();c.command('deleteBackward')");
    assert.equal(await state('c.latex'), '', 'Visual selection deletes the complete operator');
  }
  await openDeletionFixture(String.raw`1+\sqrt{x}+2`);
  await selectSource(8,9);
  await action("c.command('deleteBackward')");
  assert.equal(await state('c.latex'), String.raw`1+\sqrt{}+2`, 'Deleting the radicand preserves the root initially');
  await action("c.command('deleteBackward')");
  assert.equal(await state('c.latex'), '1++2', 'Deleting an empty root preserves surrounding terms');
  await openDeletionFixture(String.raw`\frac{a}{b}`);
  await selectSource(6,7);
  await action("c.command('deleteBackward');c.command('deleteBackward')");
  assert(await state("c.latex.includes('b')"), 'An occupied denominator is retained');
  for (const latex of [String.raw`\sqrt{}`, String.raw`\frac{}{}`, String.raw`\sqrt[3]{}`]) {
    await openDeletionFixture(latex);
    const caret = latex.indexOf('{}') + 1;
    await selectSource(caret, caret);
    await action("c.command('deleteBackward')");
    if (latex.includes('[3]')) assert(await state("c.latex.includes('3')"), 'A nonempty root index is retained');
    else assert.equal(await state('c.latex'), '', 'Deleting an empty operator removes its structure');
  }
  const repeatedFixtures=[
    {latex:'\\phi=1+\\frac{1}{1+\\frac{1}{1+\\frac{1}{1+\\frac{1}{1}}}}'},
    {latex:'\\phi = 1 + \\dfrac{ 1 }{ 1 + \\dfrac{ 1 }{ 1 + \\dfrac{ 1 }{ 1 } } }'},
    {latex:'\\frac{1}{1}+\\frac{1}{1}'},
    {latex:'x_{1}^{1}+\\sqrt[1]{1}',order:[1,0,3,2]},
    {latex:'\\begin{pmatrix}1&1\\\\1&1\\end{pmatrix}'},
  ];
  for(const fixture of repeatedFixtures){
    await action(`c.chooseExample(${JSON.stringify(fixture.latex)})`);
    const sourceOnes=[...fixture.latex.matchAll(/1/g)].map(m=>m.index);
    const visualOnes=await state("Array.from({length:c.field.lastOffset},(_,i)=>i+1).filter(i=>c.field.getElementInfo(i)?.latex==='1')");
    assert.equal(visualOnes.length,sourceOnes.length);
    for(let i=0;i<sourceOnes.length;i++){
      const offset=visualOnes[fixture.order?.[i]??i],start=sourceOnes[i];
      await action(`c.codeRef.nativeElement.focus();c.codeRef.nativeElement.setSelectionRange(${start},${start+1});c.fromCode()`);
      assert.equal(await state('c.field.selection.ranges[0][1]'),offset,`Repeated 1 at source ${start}: ${fixture.latex}`);
      assert(await state('c.visualSelectionBox?.width>0'));
      await action(`c.field.selection={ranges:[[${offset-1},${offset}]]};c.fromVisual()`);
      assert.equal(await state('c.selectionStart'),start,'Visual-to-source mapping retains the same occurrence');
    }
    await action('c.codeRef.nativeElement.blur()');
  }
  await action("c.chooseExample('A=\\\\begin{pmatrix}a&b\\\\\\\\c&d\\\\end{pmatrix}');c.group='Matrices';c.field.position=Array.from({length:c.field.lastOffset},(_,i)=>i+1).find(i=>c.field.getElementInfo(i)?.latex==='a');c.insert(c.filtered.find(k=>k.command==='addRowAfter'))");
  assert.equal(await state("c.latex.split(String.fromCharCode(92,92)).length"),3,'Matrix row insertion');
  await action("c.field.position=Array.from({length:c.field.lastOffset},(_,i)=>i+1).find(i=>c.field.getElementInfo(i)?.latex==='a');c.insert(c.filtered.find(k=>k.command==='removeRow'))");assert.equal(await state("c.latex.split(String.fromCharCode(92,92)).length"),2,'Matrix row deletion');
  await action("c.editCode('abcdefgh+xyz');c.codeRef.nativeElement.setSelectionRange(0,0);c.codeRef.nativeElement.scrollIntoView({block:'center',behavior:'instant'})");
  const drag=await evaluate("(()=>{const code=document.querySelector('#latex-source'),r=code.getBoundingClientRect(),style=getComputedStyle(code),canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');ctx.font=style.font;const step=ctx.measureText('a').width;return {x:r.x+parseFloat(style.paddingLeft)+2,y:r.y+parseFloat(style.paddingTop)+10,end:r.x+parseFloat(style.paddingLeft)+2+step*5}})()");
  await call('Input.dispatchMouseEvent',{type:'mousePressed',x:drag.x,y:drag.y,button:'left',clickCount:1});
  await call('Input.dispatchMouseEvent',{type:'mouseMoved',x:drag.end,y:drag.y,button:'left',buttons:1});await pause(120);
  console.log('Source drag',await state("({start:c.selectionStart,end:c.selectionEnd,nativeStart:c.codeRef.nativeElement.selectionStart,nativeEnd:c.codeRef.nativeElement.selectionEnd,focus:document.activeElement.tagName})"));
  assert(await state('c.selectionEnd>c.selectionStart'),'Selection updates while the mouse button remains held');
  assert.equal(await state('c.selected'),await evaluate("(()=>{const c=document.querySelector('#latex-source');return c.value.slice(c.selectionStart,c.selectionEnd)})()"));
  assert.notEqual(await evaluate("getComputedStyle(document.querySelector('#latex-source'),'::selection').backgroundColor"),'rgba(0, 0, 0, 0)','Native drag highlight is visible before mouse release');
  assert.equal(await state('c.field.getValue(c.field.selection)'),'abcde','Visual selection follows the source during dragging');
  assert(await evaluate("(()=>{const box=document.querySelector('.visual-selection-box');return !!box&&box.getBoundingClientRect().width>0&&getComputedStyle(box).borderTopWidth==='2px'})()"),'A bordered visual selection appears before mouse release');
  fs.mkdirSync('tmp/latex-audit',{recursive:true});const dragShot=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync('tmp/latex-audit/source-drag.png',Buffer.from(dragShot.data,'base64'));
  await call('Input.dispatchMouseEvent',{type:'mouseReleased',x:drag.end,y:drag.y,button:'left',clickCount:1});
  await action("c.chooseExample('\\\\frac{a+b}{c+d}+x')");
  await action("c.setSourceSelection(6,9,'Numerador');c.toVisual()");
  assert.equal(await state('c.field.getValue(c.field.selection)'), 'a+b');
  assert(await state('c.visualSelectionBox?.width>0'));
  const numeratorBox=await state('({...c.visualSelectionBox})');
  await action("c.navigate('parent')");
  assert.equal(await state('c.selected'), '\\frac{a+b}{c+d}');
  assert.equal(await evaluate("document.querySelector('.source-highlight mark.has-selection').textContent"),'\\frac{a+b}{c+d}');
  await evaluate("document.querySelector('.navigation button').focus()");
  assert.notEqual(await evaluate("getComputedStyle(document.querySelector('.source-highlight mark')).backgroundColor"),'rgba(0, 0, 0, 0)','Source highlight remains visible with focus on the arrows');
  fs.mkdirSync('tmp/latex-audit',{recursive:true});
  await evaluate("document.querySelector('app-latex-editor').scrollIntoView({block:'start',behavior:'instant'})");
  const highlightShot=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync('tmp/latex-audit/source-highlight.png',Buffer.from(highlightShot.data,'base64'));
  assert.equal(await state('c.field.getValue(c.field.selection)'), '\\frac{a+b}{c+d}');
  assert(await state(`c.visualSelectionBox.height>${numeratorBox.height}`),'Fraction outline expands to include the denominator');
  await action("c.navigate('right')"); assert.equal(await state('c.selected'), 'x');
  assert.equal(await evaluate("document.querySelector('.source-highlight mark.has-selection').textContent"),'x');
  await action("c.navigate('left')"); assert.equal(await state('c.selected'), '\\frac{a+b}{c+d}');
  await action("c.navigate('child')"); assert.equal(await state('c.selected'), 'a+b');
  await action("c.group='Esenciales';c.search='';c.page=0");
  // A real pointer click must preserve the visual selection before wrapping it.
  const click = async selector => { await evaluate(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:'center',behavior:'instant'})`); const r = await evaluate(`(()=>{const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`); await call('Input.dispatchMouseEvent', { type: 'mousePressed', ...r, button: 'left', clickCount: 1 }); await call('Input.dispatchMouseEvent', { type: 'mouseReleased', ...r, button: 'left', clickCount: 1 }); await pause(150); };
  await click('.formula-key[title^="raíz cuadrada"]');
  assert((await state('c.latex')).includes('\\sqrt{a+b}'));
  await action('c.undo(-1)'); assert.equal(await state('c.latex'), '\\frac{a+b}{c+d}+x');
  await action('c.undo(1)'); assert((await state('c.latex')).includes('\\sqrt{a+b}'));
  await action("c.editCode('x+x');c.setSourceSelection(2,3,'Segundo x');c.toVisual();c.fromVisual()");
  assert.equal(await state('c.selectionStart'), 2, 'Repeated symbols retain their occurrence');
  await action("c.codeRef.nativeElement.focus();c.codeRef.nativeElement.setSelectionRange(2,3);c.insert(c.keys.find(k=>k.name==='raíz cuadrada'))");
  assert.equal(await state('c.latex'), 'x+\\sqrt{x}', 'Source keyboard wraps the selected occurrence');
  await action("c.editCode('\\\\frac{a}{');c.persist()"); assert(await state('!!c.error')); assert.equal(await state('c.latex'), '\\frac{a}{');
  await action("c.editCode('e^{i\\\\pi}+1=0');c.doc.name='Auditoría Euler';c.persist()"); const savedId = await state('c.doc.id');
  await call('Page.reload'); await pause(1200); assert.equal(await state('c.doc.id'), savedId); assert.equal(await state('c.latex'), 'e^{i\\pi}+1=0');
  await action('c.newFormula()'); assert.equal(await state('c.latex'), '');
  await action(`c.open(${JSON.stringify(savedId)})`); assert.equal(await state('c.latex'), 'e^{i\\pi}+1=0');
  await action("c.search='subset';c.page=0"); assert(await state("c.filtered.some(k=>k.latex==='\\\\subset')"));
  await action("c.panel='export';await c.export('svg')"); assert.equal(await state('c.message'), 'Archivo SVG preparado.');
  await action("await c.export('png')"); assert.equal(await state('c.message'), 'Archivo PNG preparado.');
  await action("await c.export('json')");
  assert.equal(await state('c.message'), 'Archivo JSON preparado.');
  await pause(1000);
  const downloads = fs.readdirSync(downloadDir); assert(downloads.some(x => x.endsWith('.svg'))); assert(downloads.some(x => x.endsWith('.png'))); assert(downloads.some(x => x.endsWith('.json')));
  const svgFile = path.resolve(downloadDir, downloads.find(x => x.endsWith('.svg')));
  assert(fs.readFileSync(svgFile, 'utf8').includes('<path'), 'SVG contains portable glyph paths');
  await action("c.doc.name='Transparente';c.doc.transparent=true;c.doc.foreground='#ff0000';c.doc.fontSize=48;c.doc.scale=4;await c.export('svg');await c.export('png')");
  assert.equal(await state('c.message'),'Archivo PNG preparado.');await pause(300);
  const transparentSvg=fs.readFileSync(path.join(downloadDir,'Transparente.svg'),'utf8');
  assert(!transparentSvg.includes('<rect'));assert(transparentSvg.includes('color="#ff0000"'));
  const png=fs.readFileSync(path.join(downloadDir,'Transparente.png'));
  const size=transparentSvg.match(/width="(\d+)" height="(\d+)"/);
  assert.equal(png.readUInt32BE(16),Number(size[1])*4);assert.equal(png.readUInt32BE(20),Number(size[2])*4);
  await action("c.panel='keyboard';c.search='';c.group='Esenciales';c.page=0");
  const keyErrors = await state("(()=>{const original=c.latex,bad=[];for(const group of c.groups){c.group=group;for(const k of c.filtered){c.latex=k.latex.replace(/#0/g,'x').replace(/#\\?/g,'n');c.validate();if(c.error)bad.push(k.latex+': '+c.error)}}c.latex=original;c.group='Esenciales';c.validate();return bad})()");
  assert.deepEqual(keyErrors, [], 'Keyboard commands are supported by the visual renderer: '+JSON.stringify(keyErrors));
  await call('Browser.grantPermissions',{origin,permissions:['clipboardReadWrite','clipboardSanitizedWrite']});
  await call('Page.bringToFront');await call('Emulation.setFocusEmulationEnabled',{enabled:true});
  await action('await c.copy()'); assert.equal(await evaluate('navigator.clipboard.readText()'),await state('c.latex'));
  const json = fs.readFileSync(path.join(downloadDir,downloads.find(x=>x.endsWith('.json'))),'utf8');
  await action("c.panel='library'");
  await evaluate(`(()=>{const input=document.querySelector('.import-button input'),transfer=new DataTransfer();transfer.items.add(new File([${JSON.stringify(json)}],'formula.json',{type:'application/json'}));input.files=transfer.files;input.dispatchEvent(new Event('change',{bubbles:true}))})()`);await pause(200);
  assert.equal(await state('c.message'),'Fórmula importada.');assert.notEqual(await state('c.doc.id'),savedId);assert.equal(await state('c.latex'),'e^{i\\pi}+1=0');
  await action("const original=c.latex;c.latex='x'.repeat(4000);c.persist();c.latex=original;c.validate()");
  assert((await state('c.saveStatus')).includes('supera el tamaño'),'Oversized cookies are reported');
  await action("c.persist();c.panel='keyboard';c.search='';c.group='Esenciales';c.page=0");
  fs.mkdirSync('tmp/latex-audit', { recursive: true });
  for (const [label, width, height] of [['desktop',1440,1100], ['tablet',768,1024], ['mobile',390,844], ['small-mobile',320,740]]) {
    await call('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 500 });
    await evaluate("document.querySelector('app-latex-editor').scrollIntoView({block:'start',behavior:'instant'})"); await pause(200);
    assert(await evaluate('document.documentElement.scrollWidth<=innerWidth'), 'Overflow: ' + width);
    assert(await evaluate("Array.from(document.querySelectorAll('.formula-key')).every(b=>b.getBoundingClientRect().height>=44)"));
    const s = await call('Page.captureScreenshot', { format:'png', captureBeyondViewport: true }); fs.writeFileSync(`tmp/latex-audit/${label}.png`, Buffer.from(s.data, 'base64'));
    await action("c.group='Acentos y estilo';c.page=0");
    assert.equal(await evaluate("document.querySelectorAll('.accent-preview').length"),6);
    const accentClip=await evaluate("(()=>{const r=document.querySelector('.key-grid').getBoundingClientRect();return{x:r.x+scrollX,y:r.y+scrollY,width:r.width,height:r.height,scale:1}})()");
    const accents=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:accentClip});fs.writeFileSync(`tmp/latex-audit/accents-${label}.png`,Buffer.from(accents.data,'base64'));
    await action("c.group='Esenciales';c.page=0");
  }
  await action('await c.fullscreen()');
  assert(await state('c.expanded'));
  const layout = await evaluate("(()=>{const a=document.querySelector('.formula-stage').getBoundingClientRect(),b=document.querySelector('.keyboard-footer').getBoundingClientRect();return {a:a.top,b:b.bottom,height:innerHeight}})()");
  console.log('Fullscreen geometry',layout);
  const fullshot=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync('tmp/latex-audit/fullscreen-mobile.png',Buffer.from(fullshot.data,'base64'));
  assert(layout.a >= 0 && layout.b <= layout.height, 'Formula and keyboard fit small mobile fullscreen');
  await call('Emulation.setTouchEmulationEnabled',{enabled:true});
  const r = await evaluate("(()=>{const r=document.querySelector('math-field').getBoundingClientRect();return{x:r.x+30,y:r.y+r.height/2}})()");
  await call('Input.dispatchTouchEvent', { type:'touchStart', touchPoints:[r] }); await call('Input.dispatchTouchEvent', { type:'touchEnd', touchPoints:[] }); await pause(150);
  await action('await c.fullscreen()'); assert.equal(await state('c.expanded'),false);
  // Reload with touch capability present from startup, as on a real phone.
  await call('Page.reload');
  for (let i = 0; i < 180; i++) { if (await evaluate("!!document.querySelector('app-latex-editor math-field')?.shadowRoot")) break; await pause(100); }
  await evaluate("document.querySelector('math-field').scrollIntoView({block:'center',behavior:'instant'})");
  const touchField = await evaluate("(()=>{const r=document.querySelector('math-field').getBoundingClientRect();return{x:r.x+30,y:r.y+r.height/2}})()");
  await call('Input.dispatchTouchEvent', { type:'touchStart', touchPoints:[touchField] });
  await call('Input.dispatchTouchEvent', { type:'touchEnd', touchPoints:[] });
  await pause(400);
  assert(await evaluate('window.mathVirtualKeyboard.visible'), 'Touching the formula opens the math keyboard');
  const layouts = await evaluate('window.mathVirtualKeyboard.layouts');
  for (const name of ['numeric', 'alphabetic', 'symbols']) assert(layouts.includes(name), `Mobile keyboard includes ${name}`);
  assert.equal(failedFonts.length,0,failedFonts.join('\n')); assert.equal(errors.length,0,errors.join('\n'));
  console.log('PASS: structure, bidirectional selection, repeated symbols, real keyboard clicks, wrap/undo/redo, incomplete source, cookies/reload/new/library, search, SVG/PNG/JSON, desktop/tablet/mobile/320px, touch, fullscreen; no runtime exceptions.');
}
main().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{ clearTimeout(watchdog); socket?.close(); browser?.kill(); await pause(500); server?.close(); const resolved=path.resolve(profile); if(!resolved.startsWith(path.resolve(os.tmpdir(),'danisagan-latex-audit-')))throw Error('Unexpected profile path'); try{fs.rmSync(resolved,{recursive:true,force:true,maxRetries:3})}catch{} });
