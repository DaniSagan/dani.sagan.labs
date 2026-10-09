import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { seededRandom } from '../../shared/math/central-limit';
import { bayes } from '../../shared/math/bayes';
import { GaltonBoardComponent } from '../../widgets/galton/galton-board.component';
import { MontyHallComponent } from '../../widgets/monty-hall/monty-hall.component';
import { BirthdayExplorerComponent } from '../../widgets/birthday-explorer/birthday-explorer.component';
import { BayesExplorerComponent } from '../../widgets/bayes-explorer/bayes-explorer.component';
import { BuffonExplorerComponent } from '../../widgets/buffon-needle/buffon-explorer.component';
import { CentralLimitLabComponent } from '../../widgets/central-limit/central-limit-lab.component';
import { axisTicks, niceStep } from '../../widgets/implicit-curve-graph/implicit-contours';
import { DISTRIBUTIONS, Law, makeLaw, Parameter } from './distributions';
import { bootstrap, confidenceInterval, Datum, histogram, kde, mean, parseData, permutationDifference, quantile, regression, summarize, syntheticData } from './statistics';
import { benchmark, experiment, Trial } from './experiments';
import { Mode, PROBABILITY_EXAMPLES, ProbabilityExample, PROBABILITY_SOURCES } from './probability-examples';

@Component({selector:'app-probability-lab',standalone:true,imports:[CommonModule,FormsModule,RouterModule,GaltonBoardComponent,MontyHallComponent,BirthdayExplorerComponent,BayesExplorerComponent,BuffonExplorerComponent,CentralLimitLabComponent],templateUrl:'./probability-lab.component.html',styleUrls:['../vector-field/vector-field.component.css','./probability-lab.component.css']})
export class ProbabilityLabComponent implements AfterViewInit,OnDestroy {
  @ViewChild('canvas',{static:true}) canvas!:ElementRef<HTMLCanvasElement>;
  @ViewChild('series',{static:true}) series!:ElementRef<HTMLCanvasElement>;
  readonly examples=PROBABILITY_EXAMPLES;readonly sources=PROBABILITY_SOURCES;readonly distributions=DISTRIBUTIONS;
  readonly categories=['Destacados','Todos',...new Set(PROBABILITY_EXAMPLES.map(e=>e.category))];
  readonly modes:{id:Mode;label:string}[]=[{id:'distribution',label:'Distribuciones'},{id:'experiment',label:'Experimentos'},{id:'bayes',label:'Bayes'},{id:'data',label:'Datos y regresión'},{id:'inference',label:'Muestreo e inferencia'},{id:'widget',label:'Visualizadores'}];
  selected=PROBABILITY_EXAMPLES.find(e=>e.id==='mixture-separated')!;mode:Mode='distribution';model='mixture';law=makeLaw('mixture',{a:5,s:0.6});comparison?:Law;
  parameters:Parameter[]=[];search='';category='Destacados';page=0;seed=2026;private random=seededRandom(this.seed);
  samples:number[]=[];trials:Trial[]=[];history:{n:number;estimate:number}[]=[];intervals:{lo:number;hi:number;contains:boolean}[]=[];running=false;progress=0;private timer?:ReturnType<typeof setTimeout>;private observer?:ResizeObserver;private destroyed=false;
  error='';notice='';practice=false;reveal=false;showCDF=false;showKDE=false;showTheory=true;showMean=true;compareId='';bins=30;
  lower=0;upper=1;q=0.95;xMin=-7;xMax=7;plotMode='scatter';seriesMode='convergence';bandwidth=0.6;densityLog=false;sampleSize=30;confidence=0.95;knownSigma=false;statistic:'mean'|'median'='mean';
  data:Datum[]=syntheticData('linear',this.random);dataText='';private originalData:Datum[]=[];private datasets=new Map<string,Datum[]>();private dataReady?:Promise<void>;loadingData=false;
  private dragIndex?:number;private eventAnchor?:number;private dataBounds:[number,number,number,number]=[-5,5,-5,5];private previewCache=new Map<string,string>();
  constructor(private detector:ChangeDetectorRef){this.choose(this.selected);}
  get filtered():readonly ProbabilityExample[]{const normal=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase(),words=normal(this.search).trim().split(/\s+/).filter(Boolean);return this.examples.filter(e=>(this.category==='Todos'||(this.category==='Destacados'?e.featured:e.category===this.category))&&words.every(w=>normal(`${e.name} ${e.category} ${e.description} ${e.challenge}`).includes(w)));}
  get pages():number{return Math.max(1,Math.ceil(this.filtered.length/12));}
  get visible():readonly ProbabilityExample[]{const p=Math.min(this.page,this.pages-1);return this.filtered.slice(p*12,p*12+12);}
  get values():Record<string,number>{return Object.fromEntries(this.parameters.map(p=>[p.key,p.value]));}
  get sampleStats(){return summarize(this.samples);}
  get dataStats(){return summarize(this.data.map(p=>p.y));}
  get fit(){return regression(this.data);}
  get groups(){return [...new Set(this.data.map(p=>p.group))].map(group=>({group,n:this.data.filter(p=>p.group===group).length,fit:regression(this.data.filter(p=>p.group===group))}));}
  get probability():number{const lo=this.law.spec.discrete?Math.ceil(this.lower)-1:this.lower;return Math.max(0,this.law.cdf(this.upper)-this.law.cdf(lo));}
  get empiricalProbability():number|null{return this.samples.length?this.samples.filter(x=>x>=this.lower&&x<=this.upper).length/this.samples.length:null;}
  resultBayes=bayes(0.01,0.95,0.05);
  posteriorLaw=makeLaw('beta');
  get selectedQuantile():number|null{return Number.isFinite(this.q)&&this.q>0&&this.q<1?this.law.quantile(this.q):null;}
  get benchmark(){return benchmark(this.model,this.values['n']||100,this.values['p']||0.5);}
  get coverage():number|null{if(this.law.mean===null||!this.intervals.length)return null;return this.intervals.filter(i=>i.contains).length/this.intervals.length;}
  get bootstrapInterval():number[]{return this.samples.length?[quantile(this.samples,(1-this.confidence)/2),quantile(this.samples,(1+this.confidence)/2)]:[];}
  get observedDifference():number {return mean(this.data.filter(p=>p.group===0).map(p=>p.y))-mean(this.data.filter(p=>p.group===1).map(p=>p.y));}
  get pValue():number|null{return this.samples.length?(1+this.samples.filter(v=>Math.abs(v)>=Math.abs(this.observedDifference)).length)/(this.samples.length+1):null;}
  get canReveal():boolean{return !this.practice||this.reveal;}
  fmt(x:number|null):string{return x===null?'No existe / no definido':!Number.isFinite(x)?x===Infinity?'∞':x===-Infinity?'−∞':'No definido':Number(x.toPrecision(6)).toLocaleString('es-ES',{maximumSignificantDigits:6});}
  percent(x:number|null):string{return x===null?'No definida / sin ensayos':`${this.fmt(100*x)} %`;}
  ngAfterViewInit():void{
    this.dataReady=this.loadDatasets();
    const raw=new URL(location.href).searchParams.get('probability');if(raw){try{if(raw.length>90000)throw Error();const state=JSON.parse(raw),e=this.examples.find(e=>e.id===state.example);if(!e||!Number.isInteger(state.seed)||!state.values||typeof state.values!=='object')throw Error();this.seed=state.seed;this.choose(e);this.parameters.forEach(p=>{if(state.values[p.key]!==undefined)p.value=state.values[p.key];});if(state.data!==undefined){if(typeof state.data!=='string')throw Error();this.data=parseData(state.data);this.originalData=this.data.map(p=>({...p}));this.syncDataText();this.selected={...this.selected};this.loadingData=false;}this.apply();}catch{this.error='El enlace compartido no contiene una configuración válida.';}}
    this.observer=new ResizeObserver(()=>this.paint());this.observer.observe(this.canvas.nativeElement);this.paint();this.detector.detectChanges();
  }
  ngOnDestroy():void{this.destroyed=true;this.stop();this.observer?.disconnect();}
  private async loadDatasets():Promise<void>{
    try{const response=await fetch(new URL('assets/probability-lab/datasaurus.csv',document.baseURI));if(!response.ok)throw Error();const text=await response.text();for(const row of text.trim().split(/\r?\n/).slice(1)){const [id,x,y]=row.split(',');if(!id||![+x,+y].every(Number.isFinite))throw Error();const points=this.datasets.get(id)||[];points.push({x:+x,y:+y,group:0});this.datasets.set(id,points);}this.previewCache.clear();}
    catch{this.notice='No se pudo cargar Datasaurus. Los demás ejemplos siguen disponibles.';}
  }
  choose(e:ProbabilityExample):void{
    this.stop();this.selected=e;this.mode=e.mode;this.model=e.model;this.error='';this.loadingData=false;this.knownSigma=false;this.q=0.95;this.reveal=false;this.compareId='';this.comparison=undefined;this.showCDF=false;this.plotMode='scatter';this.samples=[];this.trials=[];this.history=[];this.intervals=[];this.sampleSize=e.mode==='inference'?e.values['n']||30:30;
    if(e.mode==='distribution'||e.mode==='inference'&&!['bootstrap','permutation'].includes(e.model)){const spec=DISTRIBUTIONS.find(s=>s.id===e.model)!;this.parameters=spec.parameters.map(p=>({...p,value:e.values[p.key]??p.value}));}
    else if(e.mode==='experiment')this.parameters=[{key:'n',label:'Tamaño n / pasos',value:e.values['n']||100,min:2,max:e.model==='ruin'?100:500,step:1},{key:'p',label:'Probabilidad / fracción p',value:e.values['p']||0.5,min:0.05,max:0.95,step:0.01}];
    else if(e.mode==='bayes')this.parameters=(e.model==='test'?[['prior','Probabilidad previa',0.01,0,1,0.001],['sens','Sensibilidad',0.95,0,1,0.01],['fp','Falsos positivos',0.05,0,1,0.001]]:[['a','Previa α',1,0.2,30,0.1],['b','Previa β',1,0.2,30,0.1],['successes','Éxitos observados',8,0,1000,1],['failures','Fracasos observados',2,0,1000,1]]).map(([key,label,value,min,max,step])=>({key:key as string,label:label as string,value:e.values[key as string]??value as number,min:min as number,max:max as number,step:step as number}));
    else this.parameters=[];
    if(e.mode==='data'){
      if(e.model.startsWith('datasaurus-')){this.loadingData=true;void (this.dataReady||this.loadDatasets()).then(()=>{if(this.destroyed||this.selected!==e)return;const data=this.datasets.get(e.model.slice(11));this.loadingData=false;if(!data){this.error='No se pudo cargar este conjunto.';return;}this.data=data.map(p=>({...p}));this.originalData=this.data.map(p=>({...p}));this.syncDataText();this.paint();});}
      else {this.data=syntheticData(e.model,seededRandom(this.seed));this.originalData=this.data.map(p=>({...p}));this.syncDataText();}
    }
    if(e.mode==='inference'&&e.model==='permutation'){this.data=Array.from({length:40},(_,i)=>({x:i+1,y:(i<20?0:0.7)+makeLaw('normal').sample(seededRandom(this.seed+i*97)),group:i<20?0:1}));this.syncDataText();}
    if(e.mode==='inference'&&e.model==='bootstrap'){this.data=syntheticData('linear',seededRandom(this.seed)).slice(0,30);this.syncDataText();}
    this.apply();
  }
  switchMode(mode:Mode):void{this.choose(this.examples.find(e=>e.mode===mode)!);}
  changeLaw():void{this.choose(this.examples.find(e=>e.mode==='distribution'&&e.model===this.model)!);}
  apply():void{
    this.stop();try{
      if(!Number.isInteger(this.seed)||this.seed<0||this.seed>4294967295)throw Error('Semilla entera de 0 a 4294967295.');
      for(const p of this.parameters)if(!Number.isFinite(p.value)||p.value<p.min||p.value>p.max||(p.step===1&&!Number.isInteger(p.value)))throw Error(`Revisa ${p.label}.`);
      if(this.mode==='distribution'||this.mode==='inference'&&!['bootstrap','permutation'].includes(this.model)){
        const law=makeLaw(this.model,this.values);this.law=law;[this.xMin,this.xMax]=law.bounds;this.lower=law.quantile(0.25);this.upper=law.quantile(0.75);
      }
      if(this.mode==='bayes'&&this.model==='beta'){const p=this.values;const prior=makeLaw('beta',{a:p['a'],b:p['b']}),post=makeLaw('beta',{a:p['a']+p['successes'],b:p['b']+p['failures']});this.law=prior;this.posteriorLaw=post;this.xMin=0;this.xMax=1;}
      if(this.mode==='bayes'&&this.model==='test'){const p=this.values;this.resultBayes=bayes(p['prior'],p['sens'],p['fp']);}
      this.reset();this.error='';this.paint();
    }catch(e){this.error=(e as Error).message;}
  }
  reset():void{this.stop();this.random=seededRandom(this.seed);this.samples=[];this.trials=[];this.history=[];this.intervals=[];this.progress=0;this.paint();}
  stop():void{clearTimeout(this.timer);this.running=false;}
  compare():void{try{this.comparison=this.compareId?makeLaw(this.compareId):undefined;this.error='';this.paint();}catch(e){this.error=(e as Error).message;}}
  redraw():void{if(![this.xMin,this.xMax,this.lower,this.upper,this.q,this.bandwidth,this.bins].every(Number.isFinite)||this.xMin>=this.xMax||this.lower>this.upper||this.q<=0||this.q>=1||this.bandwidth<=0||!Number.isInteger(this.bins)||this.bins<5||this.bins>100){this.error='Revisa encuadre, intervalo, cuantil, ancho de banda y número de barras (5–100).';return;}this.error='';this.paint();}
  run(count:number):void {
    if(this.running||this.loadingData)return;try{for(const p of this.parameters)if(!Number.isFinite(p.value)||p.value<p.min||p.value>p.max||(p.step===1&&!Number.isInteger(p.value)))throw Error(p.label);if(!Number.isInteger(this.seed)||this.seed<0||this.seed>4294967295)throw Error('Semilla fuera de rango.');if(!Number.isInteger(this.bins)||this.bins<5||this.bins>100)throw Error('Revisa las barras del histograma.');if(this.mode==='distribution'&&(![this.lower,this.upper,this.xMin,this.xMax,this.q].every(Number.isFinite)||this.lower>this.upper||this.xMin>=this.xMax||this.q<=0||this.q>=1))throw Error('Revisa el intervalo y el cuantil.');if(!Number.isInteger(this.sampleSize)||this.sampleSize<2||this.sampleSize>500||!Number.isFinite(this.confidence)||this.confidence<0.5||this.confidence>0.999)throw Error('Muestra: 2–500 observaciones; confianza de 0,5 a 0,999.');if(this.mode==='inference'&&this.model==='permutation'&&(!this.data.some(p=>p.group===0)||!this.data.some(p=>p.group===1)))throw Error('La permutación necesita observaciones en los grupos 0 y 1.');if(this.knownSigma&&this.mode==='inference'&&this.law.variance===null)throw Error('Esta población no tiene varianza finita.');}
    catch(e){this.error=(e as Error).message;return;}
    const target=Math.min(10000,this.samples.length+count);if(this.samples.length>=target)return;
    this.running=true;this.error='';const start=this.samples.length;const work=()=>{
      if(!this.running||this.destroyed)return;
      try{const batch=this.mode==='inference'?Math.max(1,Math.floor(1500/(['bootstrap','permutation'].includes(this.model)?this.data.length:this.sampleSize))):this.mode==='experiment'?10:100;
        for(let i=0;i<batch&&this.samples.length<target;i++){
          this.drawSample();
          const n=this.samples.length,previous=this.history[this.history.length-1]?.estimate??0;
          this.history.push({n,estimate:previous+(this.samples[n-1]-previous)/n});
        }
        this.progress=(this.samples.length-start)/(target-start);this.paint();
        if(this.samples.length<target)this.timer=setTimeout(work,24);else this.running=false;
      }catch(e){this.error=(e as Error).message;this.stop();}
    };work();
  }
  private drawSample():void{
    if(this.mode==='experiment'){const trial=experiment(this.model,this.values['n'],this.values['p'],this.random);this.samples.push(trial.value);this.trials.push(trial);if(this.trials.length>(['pi','benford','uniform-digits'].includes(this.model)?10000:60))this.trials.shift();return;}
    if(this.mode==='inference'){
      if(this.model==='bootstrap'){this.samples.push(bootstrap(this.data.map(p=>p.y),this.random,this.statistic));return;}
      if(this.model==='permutation'){this.samples.push(permutationDifference(this.data.filter(p=>p.group===0).map(p=>p.y),this.data.filter(p=>p.group===1).map(p=>p.y),this.random));return;}
      const values=Array.from({length:this.sampleSize},()=>this.law.sample(this.random)),interval=confidenceInterval(values,this.confidence,this.knownSigma&&this.law.variance!==null?Math.sqrt(this.law.variance):null);
      this.samples.push(mean(values));this.intervals.push({lo:interval[0],hi:interval[1],contains:this.law.mean!==null&&interval[0]<=this.law.mean&&interval[1]>=this.law.mean});return;
    }
    this.samples.push(this.law.sample(this.random));
  }
  applyData():void{try{const data=parseData(this.dataText);this.data=data;this.originalData=data.map(p=>({...p}));this.reset();this.error='';this.paint();}catch(e){this.error=(e as Error).message;}}
  restoreData():void{this.data=this.originalData.map(p=>({...p}));this.syncDataText();this.reset();}
  private syncDataText():void{this.dataText=this.data.map(p=>`${p.x} ${p.y} ${p.group}`).join('\n');}
  private map(x:number,y:number,w:number,h:number,x0:number,x1:number,y0:number,y1:number):[number,number]{return [55+(x-x0)/(x1-x0)*(w-75),h-38-(y-y0)/(y1-y0)*(h-58)];}
  private path(ctx:CanvasRenderingContext2D,points:number[][],color:string,width=1.5):void{ctx.beginPath();let started=false;for(const p of points){if(!p.every(Number.isFinite)){started=false;continue;}if(started)ctx.lineTo(p[0],p[1]);else{ctx.moveTo(p[0],p[1]);started=true;}}ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();}
  private dot(ctx:CanvasRenderingContext2D,p:number[],color:string,r=3):void{if(!p.every(Number.isFinite))return;ctx.beginPath();ctx.arc(p[0],p[1],r,0,2*Math.PI);ctx.fillStyle=color;ctx.fill();}
  private axes(ctx:CanvasRenderingContext2D,w:number,h:number,bounds:[number,number,number,number]):void{
    const [a,b,c,d]=bounds;ctx.font='11px monospace';ctx.fillStyle='#9aa9c0';
    for(const x of axisTicks(a,b,niceStep(b-a,8))){const p=this.map(x,c,w,h,a,b,c,d);this.path(ctx,[[p[0],20],[p[0],h-38]],'#1b2940',1);ctx.fillText(this.fmt(x),p[0]-8,h-15);}
    for(const y of axisTicks(c,d,niceStep(d-c,5))){const p=this.map(a,y,w,h,a,b,c,d);this.path(ctx,[[55,p[1]],[w-20,p[1]]],'#1b2940',1);ctx.fillText(this.fmt(y),4,p[1]+3);}
  }
  paint():void {
    if(!this.canvas||!this.series||!Number.isInteger(this.bins)||this.bins<5||this.bins>100)return;for(const element of [this.canvas,this.series]){const c=element.nativeElement;c.width=Math.max(320,Math.min(1200,c.getBoundingClientRect().width||700));c.height=c===this.canvas.nativeElement?Math.round(c.width*0.62):220;const ctx=c.getContext('2d');if(!ctx)continue;ctx.fillStyle='#070d17';ctx.fillRect(0,0,c.width,c.height);if(c===this.series.nativeElement)this.paintSeries(ctx,c.width,c.height);else switch(this.mode){case 'distribution':this.paintDistribution(ctx,c.width,c.height);break;case 'data':this.paintData(ctx,c.width,c.height);break;case 'experiment':this.paintExperiment(ctx,c.width,c.height);break;case 'bayes':this.paintBayes(ctx,c.width,c.height);break;case 'inference':this.paintInference(ctx,c.width,c.height);break;}}
  }
  private paintDistribution(ctx:CanvasRenderingContext2D,w:number,h:number):void{
    if(![this.xMin,this.xMax].every(Number.isFinite)||this.xMin>=this.xMax)return;
    const law=this.law,a=this.xMin,b=this.xMax,xs=law.spec.discrete?Array.from({length:Math.min(2000,Math.ceil(b)-Math.floor(a)+1)},(_,i)=>Math.floor(a)+i):Array.from({length:401},(_,i)=>a+(b-a)*(i+0.5)/401);
    const f=(x:number,l=law)=>this.showCDF?l.cdf(x):l.pdf(x),density=xs.map(x=>f(x)),counts=histogram(this.samples,a,b,this.bins),binWidth=(b-a)/this.bins;
    const integerCounts=new Map<number,number>();if(law.spec.discrete)this.samples.forEach(x=>integerCounts.set(x,(integerCounts.get(x)||0)+1));
    const frequencies=law.spec.discrete?xs.map(x=>this.samples.length?(integerCounts.get(x)||0)/this.samples.length:0):counts.map(n=>this.samples.length?n/(this.samples.length*binWidth):0);
    const ymax=this.showCDF?1.05:Math.max(0.01,...density.filter(Number.isFinite),...frequencies,...(this.comparison?xs.map(x=>f(x,this.comparison)).filter(Number.isFinite):[]))*1.12;
    const convert=(y:number)=>this.densityLog&&!this.showCDF?Math.log1p(y):y,y1=convert(ymax),map=(x:number,y:number)=>this.map(x,convert(y),w,h,a,b,0,y1);
    this.axes(ctx,w,h,[a,b,0,y1]);ctx.save();ctx.beginPath();ctx.rect(55,20,w-75,h-58);ctx.clip();
    if(this.canReveal&&this.samples.length&&!this.showCDF){ctx.fillStyle='#ff7ca850';frequencies.forEach((frequency,i)=>{const x=law.spec.discrete?xs[i]-0.35:a+i*binWidth,p=map(x,frequency),zero=map(x,0);ctx.fillRect(p[0],p[1],law.spec.discrete?0.7*(w-75)/(b-a):(w-75)/this.bins,zero[1]-p[1]);});}
    if(this.canReveal&&this.showTheory){if(law.spec.discrete&&!this.showCDF){for(const x of xs){const p=map(x,f(x)),z=map(x,0);this.path(ctx,[z,p],x>=this.lower&&x<=this.upper?'#ffcf70':'#61d8ff',3);this.dot(ctx,p,'#61d8ff',2);}}
      else{const event=xs.filter(x=>x>=this.lower&&x<=this.upper);if(event.length&&!this.showCDF){ctx.beginPath();const z=map(event[0],0);ctx.moveTo(z[0],z[1]);event.forEach(x=>ctx.lineTo(...map(x,f(x))));ctx.lineTo(...map(event[event.length-1],0));ctx.closePath();ctx.fillStyle='#ffcf7030';ctx.fill();}this.path(ctx,law.spec.discrete&&this.showCDF?xs.flatMap(x=>[map(x,law.cdf(x-1)),map(x,law.cdf(x)),map(x+1,law.cdf(x))]):xs.map(x=>map(x,f(x))),'#61d8ff',2.5);}
      if(this.comparison)this.path(ctx,xs.map(x=>map(x,f(x,this.comparison))),'#ad91ff',2);
      if(this.showMean&&law.mean!==null&&Number.isFinite(law.mean)){ctx.setLineDash([5,5]);this.path(ctx,[map(law.mean,0),map(law.mean,ymax)],'#7bffc6');ctx.setLineDash([]);}
    }
    if(this.canReveal&&this.samples.length&&this.showCDF){const sorted=[...this.samples].sort((x,y)=>x-y),points:number[][]=[];sorted.forEach((x,i)=>{if(x>=a&&x<=b){points.push(map(x,i/sorted.length),map(x,(i+1)/sorted.length));}});this.path(ctx,points,'#ff7ca8');}
    if(this.canReveal&&this.showKDE&&this.samples.length&&!this.showCDF&&!law.spec.discrete)this.path(ctx,xs.map(x=>map(x,kde(this.samples.slice(0,2000),x,this.bandwidth))),'#ff7ca8');
    for(const x of [this.lower,this.upper])this.path(ctx,[map(x,0),map(x,ymax)],'#ffcf7070');ctx.restore();
  }
  private paintData(ctx:CanvasRenderingContext2D,w:number,h:number):void{
    if(!this.data.length)return;const xs=this.data.map(p=>p.x),ys=this.data.map(p=>p.y),fit=this.fit;
    if(this.plotMode==='histogram'||this.plotMode==='box'){this.paintHistogram(ctx,w,h,ys,this.plotMode==='box');return;}
    if(this.plotMode==='qq'){const sorted=[...ys].sort((a,b)=>a-b),stats=summarize(ys),normal=makeLaw('normal'),points=sorted.map((y,i)=>({x:normal.quantile((i+0.5)/sorted.length),y:stats.sd?(y-stats.mean)/stats.sd:0,group:0}));this.scatter(ctx,w,h,points,true);return;}
    if(this.plotMode==='residual'){this.scatter(ctx,w,h,this.data.map((p,i)=>({...p,y:fit.residuals[i]})).filter(p=>Number.isFinite(p.y)),false);return;}
    this.scatter(ctx,w,h,this.data,false);
  }
  private scatter(ctx:CanvasRenderingContext2D,w:number,h:number,data:Datum[],qq:boolean):void{
    if(!data.length)return;const xs=data.map(p=>p.x),ys=data.map(p=>p.y),margin=(a:number[])=>Math.max(0.5,(Math.max(...a)-Math.min(...a))*0.12),dx=margin(xs),dy=margin(ys),bounds:[number,number,number,number]=[Math.min(...xs)-dx,Math.max(...xs)+dx,Math.min(...ys)-dy,Math.max(...ys)+dy];if(this.dragIndex!==undefined)bounds.splice(0,4,...this.dataBounds);else this.dataBounds=bounds;this.axes(ctx,w,h,bounds);
    const map=(x:number,y:number)=>this.map(x,y,w,h,...bounds);ctx.save();ctx.beginPath();ctx.rect(55,20,w-75,h-58);ctx.clip();
    const colors=['#61d8ff','#ff7ca8','#7bffc6','#ffcf70'];data.forEach(p=>this.dot(ctx,map(p.x,p.y),colors[p.group%4],3));
    if(this.canReveal){if(qq)this.path(ctx,[map(bounds[0],bounds[0]),map(bounds[1],bounds[1])],'#7bffc6');else if(this.plotMode==='scatter'){const fits=[{group:-1,fit:this.fit},...(this.groups.length>1?this.groups:[])];for(const g of fits){if(g.fit.slope!==null&&g.fit.intercept!==null)this.path(ctx,[map(bounds[0],g.fit.intercept+g.fit.slope*bounds[0]),map(bounds[1],g.fit.intercept+g.fit.slope*bounds[1])],g.group<0?'#ffcf70':colors[g.group%4],g.group<0?2:1);}}}
    ctx.restore();
  }
  private paintHistogram(ctx:CanvasRenderingContext2D,w:number,h:number,values:number[],box=false):void{
    if(!values.length){ctx.fillStyle='#8797b0';ctx.fillText('Genera muestras para ver su distribución.',55,h/2);return;}
    const a=Math.min(...values),b=Math.max(...values),span=Math.max(1,b-a),lo=a-span*0.05,hi=b+span*0.05,counts=histogram(values,lo,hi,this.bins),max=Math.max(1,...counts);this.axes(ctx,w,h,[lo,hi,0,max*1.15]);
    if(box){const stats=summarize(values),map=(x:number)=>this.map(x,0,w,h,lo,hi,0,1)[0];const left=map(stats.q1),right=map(stats.q3);ctx.strokeStyle='#61d8ff';ctx.strokeRect(left,h/2-25,right-left,50);this.path(ctx,[[map(stats.min),h/2],[left,h/2]],'#61d8ff');this.path(ctx,[[right,h/2],[map(stats.max),h/2]],'#61d8ff');this.path(ctx,[[map(stats.median),h/2-25],[map(stats.median),h/2+25]],'#ff7ca8',3);ctx.fillStyle='#8797b0';ctx.fillText('Caja Q₁–Q₃ · mediana rosa · bigotes mínimo–máximo',55,35);return;}
    ctx.fillStyle='#61d8ff99';counts.forEach((count,i)=>{const p=this.map(lo+i*(hi-lo)/this.bins,count,w,h,lo,hi,0,max*1.15);ctx.fillRect(p[0],p[1],(w-75)/this.bins-1,h-38-p[1]);});
  }
  private paintExperiment(ctx:CanvasRenderingContext2D,w:number,h:number):void{
    if(this.model.startsWith('bertrand')||this.model==='pi'){
      const r=Math.min(w-60,h-50)/2,map=(p:number[])=>[w/2+r*p[0],h/2-r*p[1]];ctx.strokeStyle='#75849c';ctx.beginPath();ctx.arc(w/2,h/2,r,0,Math.PI*2);ctx.stroke();
      if(this.model.startsWith('bertrand')){this.path(ctx,Array.from({length:4},(_,i)=>map([Math.cos(2*Math.PI*i/3),Math.sin(2*Math.PI*i/3)])),'#ffcf70');this.trials.forEach(t=>this.path(ctx,t.points.map(map),t.success?'#7bffc680':'#ff7ca850'));}
      else {this.path(ctx,[[-1,-1],[1,-1],[1,1],[-1,1],[-1,-1]].map(map),'#75849c');this.trials.forEach(t=>t.points.forEach(p=>this.dot(ctx,map(p),t.success?'#7bffc6':'#ff7ca8',2)));}
      return;
    }
    if(['benford','uniform-digits'].includes(this.model)){
      const counts=Array(9).fill(0) as number[];this.trials.forEach(t=>counts[t.points[0][0]-1]++);const n=this.trials.length,bounds:[number,number,number,number]=[0.5,9.5,0,0.4];this.axes(ctx,w,h,bounds);for(let d=1;d<=9;d++){const p=this.map(d-0.35,n?counts[d-1]/n:0,w,h,...bounds);ctx.fillStyle='#ff7ca8';ctx.fillRect(p[0],p[1],0.7*(w-75)/9,h-38-p[1]);if(this.canReveal){const expected=this.model==='benford'?Math.log10(1+1/d):1/9;this.path(ctx,[this.map(d-0.35,expected,w,h,...bounds),this.map(d+0.35,expected,w,h,...bounds)],'#61d8ff',3);}}return;
    }
    if(['matching','monty','birthday'].includes(this.model)){this.paintHistogram(ctx,w,h,this.samples);return;}
    const trails=this.trials.slice(-35),points=trails.flatMap(t=>t.points);if(!points.length)return;
    const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]),bounds:[number,number,number,number]=[0,Math.max(1,...xs),Math.min(0,...ys),Math.max(1,...ys)];this.axes(ctx,w,h,bounds);trails.forEach((t,i)=>this.path(ctx,t.points.map(p=>this.map(p[0],p[1],w,h,...bounds)),`hsla(${i*137.5%360},85%,70%,0.6)`));
  }
  private paintBayes(ctx:CanvasRenderingContext2D,w:number,h:number):void{
    if(!this.canReveal)return;
    if(this.model==='beta'){const prior=this.law,post=this.posteriorLaw,xs=Array.from({length:300},(_,i)=>(i+0.5)/300),max=Math.max(...xs.map(x=>Math.max(prior.pdf(x),post.pdf(x))))*1.1;this.axes(ctx,w,h,[0,1,0,max]);for(const [law,color] of [[prior,'#ad91ff'],[post,'#61d8ff']] as [Law,string][])this.path(ctx,xs.map(x=>this.map(x,law.pdf(x),w,h,0,1,0,max)),color,2.5);return;}
    const r=this.resultBayes,rows=[r.truePositive,r.falseAlarm,r.missed,r.correctNegative],colors=['#61d8ff','#ff7ca8','#ad91ff','#7bffc6'];
    for(let i=0;i<10000;i++){const u=(i+0.5)/10000;let sum=0,index=3;for(let j=0;j<4;j++){sum+=rows[j];if(u<sum){index=j;break;}}ctx.fillStyle=colors[index];ctx.fillRect(25+(i%100)*(w-50)/100,20+Math.floor(i/100)*(h-45)/100,(w-50)/100-0.5,(h-45)/100-0.5);}
  }
  private paintInference(ctx:CanvasRenderingContext2D,w:number,h:number):void{
    if(!this.canReveal)return;
    if(['bootstrap','permutation'].includes(this.model)){this.paintHistogram(ctx,w,h,this.samples);return;}
    const intervals=this.intervals.slice(-80);if(!intervals.length)return;
    const values=intervals.flatMap(i=>[i.lo,i.hi]).filter(Number.isFinite);if(!values.length)return;const lo=Math.min(...values),hi=Math.max(...values),map=(x:number,row:number)=>this.map(x,row,w,h,lo-0.1,hi+0.1,0,intervals.length+1);
    this.axes(ctx,w,h,[lo-0.1,hi+0.1,0,intervals.length+1]);intervals.forEach((interval,i)=>this.path(ctx,[map(interval.lo,i+1),map(interval.hi,i+1)],this.law.mean===null?'#ad91ff':interval.contains?'#7bffc6':'#ff7ca8',2));if(this.law.mean!==null)this.path(ctx,[map(this.law.mean,0),map(this.law.mean,intervals.length+1)],'#ffcf70',2);
  }
  private paintSeries(ctx:CanvasRenderingContext2D,w:number,h:number):void{
    if(!this.canReveal)return;
    if(this.mode==='experiment'&&this.seriesMode==='histogram'){this.paintHistogram(ctx,w,h,this.samples);return;}
    if(this.mode==='data'){this.paintHistogram(ctx,w,h,this.data.map(p=>p.y));return;}
    if(this.mode==='inference'){this.paintHistogram(ctx,w,h,this.samples);return;}
    if(!this.history.length){ctx.font='13px sans-serif';ctx.fillStyle='#9aa9c0';ctx.fillText('Pulsa \u00abUn ensayo\u00bb o \u00abSimular 1000\u00bb',20,55);ctx.fillText('para ver la convergencia del promedio.',20,77);return;}
    const estimates=this.history.map(p=>p.estimate),theory=this.mode==='experiment'?this.benchmark.value:this.law.mean;
    const finite=[...estimates,...(theory!==null&&Number.isFinite(theory)?[theory]:[])],min=Math.min(...finite),max=Math.max(...finite),margin=Math.max(0.05,(max-min)*0.15);
    const bounds:[number,number,number,number]=[0,Math.max(2,this.samples.length),min-margin,max+margin];
    this.axes(ctx,w,h,bounds);
    if(theory!==null&&Number.isFinite(theory))this.path(ctx,[this.map(0,theory,w,h,...bounds),this.map(bounds[1],theory,w,h,...bounds)],'#7bffc6');
    this.path(ctx,this.history.map(p=>this.map(p.n,p.estimate,w,h,...bounds)),'#ff7ca8',2);
    const last=this.history[this.history.length-1];this.dot(ctx,this.map(last.n,last.estimate,w,h,...bounds),'#ff7ca8',4);
    ctx.fillStyle='#ff7ca8';ctx.font='12px sans-serif';ctx.fillText('Promedio observado',55,14);
    if(theory!==null&&Number.isFinite(theory)){ctx.fillStyle='#7bffc6';ctx.fillText('Valor teórico',205,14);}
  }
  pointerDown(e:PointerEvent):void{
    const c=this.canvas.nativeElement,r=c.getBoundingClientRect(),x=(e.clientX-r.left)*c.width/r.width,y=(e.clientY-r.top)*c.height/r.height;
    if(this.mode==='data'&&this.plotMode==='scatter'){const near=this.data.map((p,i)=>({i,d:Math.hypot(...this.map(p.x,p.y,c.width,c.height,...this.dataBounds).map((v,j)=>v-[x,y][j]))})).sort((a,b)=>a.d-b.d)[0];if(near&&near.d<15){this.dragIndex=near.i;c.setPointerCapture(e.pointerId);}}
    else if(this.mode==='distribution'){this.eventAnchor=this.xMin+(x-55)/(c.width-75)*(this.xMax-this.xMin);c.setPointerCapture(e.pointerId);}
  }
  pointerMove(e:PointerEvent):void{
    const c=this.canvas.nativeElement,r=c.getBoundingClientRect(),x=(e.clientX-r.left)*c.width/r.width,y=(e.clientY-r.top)*c.height/r.height;
    if(this.dragIndex!==undefined){const [a,b,d,f]=this.dataBounds;this.data[this.dragIndex]={...this.data[this.dragIndex],x:a+(x-55)/(c.width-75)*(b-a),y:d+(c.height-38-y)/(c.height-58)*(f-d)};this.syncDataText();this.samples=[];this.paint();}
    else if(this.eventAnchor!==undefined){const end=this.xMin+(x-55)/(c.width-75)*(this.xMax-this.xMin);this.lower=Math.min(this.eventAnchor,end);this.upper=Math.max(this.eventAnchor,end);this.paint();}
  }
  pointerUp():void{this.dragIndex=undefined;this.eventAnchor=undefined;this.paint();}
  preview(e:ProbabilityExample):string{
    const cached=this.previewCache.get(e.id);if(cached)return cached;let points:number[][]=[];
    try{if(e.mode==='distribution'||e.mode==='bayes'&&e.model==='beta'){const law=makeLaw(e.mode==='bayes'?'beta':e.model,e.values),[a,b]=law.bounds,xs=Array.from({length:70},(_,i)=>a+(b-a)*(i+0.5)/70),ys=xs.map(x=>law.spec.discrete?law.pdf(Math.round(x)):law.pdf(x)),max=Math.max(...ys.filter(Number.isFinite));points=xs.map((x,i)=>[8+144*(x-a)/(b-a),92-80*ys[i]/max]);}
      else if(e.mode==='data'){const data=e.model.startsWith('datasaurus-')?this.datasets.get(e.model.slice(11))||[]:syntheticData(e.model,seededRandom(2026));if(data.length){const xs=data.map(p=>p.x),ys=data.map(p=>p.y),a=Math.min(...xs),b=Math.max(...xs),c=Math.min(...ys),d=Math.max(...ys);points=data.slice(0,160).map(p=>[8+144*(p.x-a)/Math.max(1,b-a),92-80*(p.y-c)/Math.max(1,d-c)]);}}
      else if(e.mode==='experiment'&&e.model.startsWith('bertrand')){const rng=seededRandom(2026);for(let i=0;i<8;i++)points.push(...experiment(e.model,20,0.5,rng).points.map(p=>[80+42*p[0],50-42*p[1]]));}
      else points=Array.from({length:65},(_,i)=>[8+i*144/64,85-55*Math.exp(-(((i-32)/13)**2))]);
    }catch{/* Invalid preview never blocks editing. */}
    const path=points.map((p,i)=>`${e.mode==='data'||i===0?'M':'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}${e.mode==='data'?'h1':''}`).join(' ');if(path)this.previewCache.set(e.id,path);return path;
  }
  download(kind:'png'|'csv'):void{const a=document.createElement('a');a.download=`probabilidad-${this.model}.${kind}`;let url:string;if(kind==='png')url=this.canvas.nativeElement.toDataURL();else{const text=this.mode==='data'||this.mode==='inference'&&['bootstrap','permutation'].includes(this.model)?'x,y,grupo\n'+this.data.map(p=>`${p.x},${p.y},${p.group}`).join('\n'):'observacion\n'+this.samples.join('\n');url=URL.createObjectURL(new Blob([text],{type:'text/csv;charset=utf-8'}));}a.href=url;a.click();if(kind==='csv')URL.revokeObjectURL(url);}
  async share():Promise<void>{const url=new URL(location.href);url.searchParams.set('probability',JSON.stringify({example:this.selected.id,seed:this.seed,values:this.values,...(this.mode==='data'||this.model==='bootstrap'||this.model==='permutation'?{data:this.dataText}:{})}));try{await navigator.clipboard.writeText(url.href);this.notice='Enlace copiado.';}catch{this.notice=url.href;}}
}
