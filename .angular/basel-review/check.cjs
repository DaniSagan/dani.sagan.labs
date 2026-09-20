const {spawn} = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const WebSocket = require('ws');
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'basel-review-'));
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--remote-debugging-port=9237','--user-data-dir='+profile,'about:blank'], {windowsHide:true, stdio:'ignore'});
const pause = ms => new Promise(r => setTimeout(r,ms));
(async()=> {
 let socket;
 try {
  let tabs;
  for(let i=0;i<60;i++){try{tabs=await (await fetch('http://127.0.0.1:9237/json')).json();break;}catch{await pause(250)}}
  if(!tabs) throw Error('Chrome debugging endpoint unavailable');
  socket=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);
  await new Promise(r=>socket.once('open',r));
  let id=0;const pending=new Map();const errors=[];
  socket.on('message',raw=>{const msg=JSON.parse(raw);if(msg.id){const p=pending.get(msg.id);pending.delete(msg.id);msg.error?p.reject(msg.error):p.resolve(msg.result)}else if(msg.method==='Runtime.exceptionThrown') errors.push(msg.params.exceptionDetails.text)});
  const send=(method,params={})=>new Promise((resolve,reject)=>{const key=++id;pending.set(key,{resolve,reject});socket.send(JSON.stringify({id:key,method,params}))});
  const evaluate=async expression=>{const result=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(result.exceptionDetails)throw Error(JSON.stringify(result.exceptionDetails));return result.result.value;};
  await send('Runtime.enable');await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1100,deviceScaleFactor:1,mobile:false});
  await send('Page.navigate',{url:'http://127.0.0.1:4207/articles/basel'});
  let ready=false;
  for(let i=0;i<90;i++){if(await evaluate("!!document.querySelector('app-basel-fourier .chart')")){ready=true;break;}await pause(500)}
  if(!ready)throw Error('Article did not load');
  await pause(1500);
  console.log('Desktop:',await evaluate("JSON.stringify({article:document.querySelector('app-basel-article h2').textContent,widgets:document.querySelectorAll('app-basel-article .basel-lab').length,overflow:document.documentElement.scrollWidth>innerWidth})"));
  await evaluate("document.querySelector('app-basel-convergence').scrollIntoView({block:'start',behavior:'instant'})");
  await pause(300);
  fs.writeFileSync('.angular/basel-review/desktop.png',Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));
  await evaluate("document.querySelectorAll('app-basel-convergence .switch button')[1].click(); document.querySelectorAll('app-basel-convergence .presets button')[4].click()");
  await pause(200);
  console.log('Interaction:',await evaluate("JSON.stringify({n:document.querySelector('app-basel-convergence output').textContent,bounds:!!document.querySelector('app-basel-convergence .upper-line')})"));
  await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await evaluate("document.querySelector('app-basel-fourier').scrollIntoView({block:'start',behavior:'instant'})");
  await pause(300);
  console.log('Mobile:',await evaluate("JSON.stringify({viewport:innerWidth,width:document.documentElement.scrollWidth,widgetWidth:document.querySelector('app-basel-fourier').getBoundingClientRect().width})"));
  fs.writeFileSync('.angular/basel-review/mobile.png',Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));
  if(errors.length)throw Error('Runtime errors: '+errors.join(';'));
  console.log('No runtime exceptions. Screenshots saved.');
  await send('Browser.close');
 } finally {if(socket)socket.close();chrome.kill();}
})().catch(e=>{console.error(e);process.exitCode=1});
