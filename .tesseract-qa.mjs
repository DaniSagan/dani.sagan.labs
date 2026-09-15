import fs from 'node:fs';
import os from 'node:os';
const tabs = await (await fetch('http://127.0.0.1:9225/json/list')).json();
const tab = tabs.find(t => t.type === 'page');
const ws = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise(resolve => ws.addEventListener('open', resolve, { once: true }));
let id = 0;
const pending = new Map();
const errors = [];
ws.addEventListener('message', event => {
  const message = JSON.parse(event.data);
  if (message.id) { const p = pending.get(message.id); pending.delete(message.id); message.error ? p.reject(message.error) : p.resolve(message.result); }
  if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails);
});
const send = (method, params = {}) => new Promise((resolve, reject) => { const n = ++id; pending.set(n, { resolve, reject }); ws.send(JSON.stringify({ id: n, method, params })); });
const evaluate = async expression => {
  const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
};
await send('Runtime.enable');
await send('Page.enable');
const mode = process.argv[2] || 'initial';
if (mode === 'close') { await send('Browser.close'); process.exit(0); }
await send('Emulation.setDeviceMetricsOverride', { width: mode === 'mobile' ? 390 : 1440, height: 1000, deviceScaleFactor: 1, mobile: mode === 'mobile' });
if (mode === 'initial') {
  await send('Page.navigate', { url: 'http://127.0.0.1:4200/articles/tesseract' });
  await new Promise(resolve => setTimeout(resolve, 9000));
}
console.log('Page', await evaluate('document.title + " | " + document.body.innerText.slice(0,400)'));
console.log('Viewer', await evaluate('!!document.querySelector("app-tesseract-viewer")'));
await evaluate(`(() => { const e = document.querySelector('app-tesseract-viewer'); e.scrollIntoView(); const c = ng.getComponent(e); c.preset('${mode === 'slice' ? 'slice' : 'classic'}'); ng.applyChanges(c); return true; })()`);
await new Promise(resolve => setTimeout(resolve, 1000));
console.log('State', await evaluate(`(() => { const c=ng.getComponent(document.querySelector('app-tesseract-viewer')); return {error:c.error, count:c.sliceCount, kind:c.sliceKind, canvas:[c.renderer.domElement.width,c.renderer.domElement.height], overflow:document.documentElement.scrollWidth>innerWidth, formulas:document.querySelectorAll('mjx-merror').length}; })()`));
const clip = await evaluate(`(() => { const r=document.querySelector('app-tesseract-viewer').getBoundingClientRect(); return {x:r.x+scrollX,y:r.y+scrollY,width:r.width,height:r.height,scale:1}; })()`);
const shot = await send('Page.captureScreenshot', { format: 'png', clip, captureBeyondViewport: true });
const path = os.tmpdir() + '/tesseract-' + mode + '.png';
fs.writeFileSync(path, Buffer.from(shot.data, 'base64'));
console.log('Screenshot', path, 'Errors', errors);
ws.close();
