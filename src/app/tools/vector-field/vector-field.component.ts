import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VECTOR_EXAMPLES, VectorExample } from './vector-examples';
import { adaptiveStep, Bounds, compileField, equilibria, Equilibrium, Field, integrate, jacobian, Orbit, parameterNames, Point } from './vector-math';
import { CurveParameter } from '../implicit-curve-graph-tool/curve-parameters';
import { traceContours, axisTicks, niceStep } from '../../widgets/implicit-curve-graph/implicit-contours';

interface Seed { point: Point; t: number; color: string; }
interface Particle { point: Point; t: number; age: number; }
@Component({
  selector: 'app-vector-field', standalone: true, imports: [CommonModule, FormsModule],
  templateUrl: './vector-field.component.html', styleUrls: ['./vector-field.component.css']
})
export class VectorFieldComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', {static:true}) canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('series', {static:true}) series!: ElementRef<HTMLCanvasElement>;
  @ViewChild('result', {static:true}) result!: ElementRef<HTMLElement>;
  readonly examples = VECTOR_EXAMPLES;
  readonly categories = ['Todos',...new Set(VECTOR_EXAMPLES.map(e => e.category))];
  search = ''; category = 'Todos'; page = 0;
  selected = VECTOR_EXAMPLES.find(e => e.id === 'hopf')!;
  dx = this.selected.dx; dy = this.selected.dy;
  parameters: CurveParameter[] = this.selected.parameters.map(p => ({...p,error:''}));
  bounds: Bounds = [...this.selected.bounds];
  duration = 30; tolerance = 0.000001; speed = 1; time = 0; launchTime = 0;
  density = 23; particleCount = 300; glow = true; showParticles = true;
  seedX = 1; seedY = 0; showStrobe = false; strobePeriod = 2*Math.PI;
  showArrows = true; showNullclines = false; showEquilibria = true; showGrid = true;
  backwards = true; colorMode = 'speed'; mode = 'seed'; wheelEnabled = false;
  running = true; error = ''; notice = ''; coordinates = ''; status = '';
  fixedPoints: Equilibrium[] = []; seeds: Seed[] = []; orbits: {seed:Seed; forward:Orbit; backward?:Orbit}[] = [];
  private field: Field = () => [0,0];
  private background!: HTMLCanvasElement; private trails!: HTMLCanvasElement;
  private particles: Particle[] = []; private frame = 0; private last = 0; private lastField = 0;
  private timer?: ReturnType<typeof setTimeout>; private observer?: ResizeObserver;
  private pointers = new Map<number,Point>();
  private gesture?: {point:Point; bounds:Bounds; distance:number; moved:boolean};
  private dead = false;
  private sharedSeeds?: Seed[];
  constructor(private readonly zone: NgZone, private readonly changeDetector: ChangeDetectorRef) {}
  get timeDependent(): boolean { return /\bt\b/.test(this.dx+' '+this.dy); }
  get filtered(): VectorExample[] {
    const normal = (s:string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    const words = normal(this.search).trim().split(/\s+/).filter(Boolean);
    return this.examples.filter(e => (this.category==='Todos'||e.category===this.category)&&
      words.every(w => normal(`${e.name} ${e.description} ${e.category}`).includes(w)));
  }
  get pages(): number { return Math.max(1,Math.ceil(this.filtered.length/12)); }
  get visibleExamples(): VectorExample[] { return this.filtered.slice(Math.min(this.page,this.pages-1)*12,(Math.min(this.page,this.pages-1)+1)*12); }
  ngAfterViewInit(): void {
    this.background = document.createElement('canvas'); this.trails = document.createElement('canvas');
    this.running = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.restoreLink(); this.resize(); this.apply(true);
    if (this.sharedSeeds) { this.seeds = this.sharedSeeds; this.rebuild(); }
    this.observer = new ResizeObserver(() => this.resize()); this.observer.observe(this.canvas.nativeElement);
    this.zone.runOutsideAngular(() => { this.frame = requestAnimationFrame(t => this.animate(t)); });
    this.changeDetector.detectChanges();
  }
  ngOnDestroy(): void { this.dead = true; cancelAnimationFrame(this.frame); clearTimeout(this.timer); this.observer?.disconnect(); }
  private resize(): void {
    if (!this.background) return;
    const width = Math.round(Math.min(1500,Math.max(320,this.canvas.nativeElement.getBoundingClientRect().width))*Math.min(devicePixelRatio||1,2));
    const height = Math.round(width*0.68);
    for (const c of [this.canvas.nativeElement,this.background,this.trails]) { c.width = width; c.height = height; }
    this.paintBackground(); this.paint(); this.paintSeries();
  }
  syncParameters(): void {
    const old = new Map(this.parameters.map(p => [p.name,p]));
    this.parameters = parameterNames(this.dx,this.dy).map(name => old.get(name)??{name,value:1,min:-5,max:5,step:0.1,error:''});
  }
  choose(example: VectorExample): void {
    this.selected = example; this.dx = example.dx; this.dy = example.dy;
    this.parameters = example.parameters.map(p => ({...p,error:''})); this.bounds = [...example.bounds];
    this.time = 0; this.launchTime = 0; this.seeds = []; this.apply(true);
    this.result.nativeElement.focus({preventScroll:true}); this.result.nativeElement.scrollIntoView({block:'start',behavior:'smooth'});
  }
  changeParameter(p: CurveParameter, range = false): void {
    if (range && Number.isFinite(p.value)&&p.min<p.max) p.value = Math.max(p.min,Math.min(p.max,p.value));
    p.error = ![p.value,p.min,p.max,p.step].every(Number.isFinite) || p.min>=p.max || p.step<=0 ? 'Intervalo o paso inválido.'
      : p.value<p.min||p.value>p.max ? 'Valor fuera del intervalo.'
      : p.integer && ![p.value,p.min,p.max,p.step].every(Number.isInteger) ? 'Usa valores y pasos enteros.' : '';
    if (!p.error) { clearTimeout(this.timer); this.timer = setTimeout(() => this.apply(),80); }
  }
  apply(resetSeeds = false): void {
    this.error = ''; this.syncParameters();
    try {
      if (this.parameters.some(p => p.error || !Number.isFinite(p.value))) throw Error('Revisa los parámetros.');
      if (!this.bounds.every(Number.isFinite)||this.bounds[0]>=this.bounds[1]||this.bounds[2]>=this.bounds[3]||Math.max(this.bounds[1]-this.bounds[0],this.bounds[3]-this.bounds[2])>1e6) throw Error('Introduce un encuadre finito y ordenado (amplitud máxima 10⁶).');
      if (!Number.isFinite(this.duration)||this.duration<0.1||this.duration>200||![1e-4,1e-6,1e-8].includes(+this.tolerance)||!Number.isFinite(this.launchTime)) throw Error('Duración entre 0,1 y 200; tiempo inicial finito.');
      const fn = compileField(this.dx,this.dy,Object.fromEntries(this.parameters.map(p => [p.name,p.value])));
      this.field = (x,y,t) => { try { return fn(x,y,t); } catch { return [NaN,NaN]; } };
      if (resetSeeds) this.seeds = this.selected.seeds.map((point,i) => ({point:[...point],t:this.launchTime,color:this.palette(i)}));
      this.rebuild();
    } catch (e) { this.error = e instanceof Error ? e.message : String(e); }
  }
  rebuild(): void {
    if (!this.background) return;
    this.orbits = this.seeds.map(seed => ({seed,forward:integrate(this.field,seed.point,seed.t,this.duration,this.bounds,1,+this.tolerance),
      backward:this.backwards ? integrate(this.field,seed.point,seed.t,this.duration,this.bounds,-1,+this.tolerance) : undefined}));
    this.fixedPoints = this.showEquilibria&&!this.timeDependent ? equilibria(this.field,this.bounds) : [];
    this.status = `${this.seeds.length} trayectorias · ${this.orbits.reduce((s,o)=>s+o.forward.points.length+(o.backward?.points.length??0),0)} muestras`;
    this.resetParticles(); this.paintBackground(); this.paint(); this.paintSeries();
  }
  scheduleView(): void { clearTimeout(this.timer); this.timer = setTimeout(() => this.apply(),80); }
  private palette(i:number): string { return `hsl(${(i*137.508+185)%360},95%,68%)`; }
  private screen(p:Point, canvas = this.background): Point {
    return [(p[0]-this.bounds[0])/(this.bounds[1]-this.bounds[0])*canvas.width,(this.bounds[3]-p[1])/(this.bounds[3]-this.bounds[2])*canvas.height];
  }
  private world(p:Point): Point {
    const r = this.canvas.nativeElement.getBoundingClientRect();
    return [this.bounds[0]+p[0]/r.width*(this.bounds[1]-this.bounds[0]),this.bounds[3]-p[1]/r.height*(this.bounds[3]-this.bounds[2])];
  }
  private color(x:number,y:number,t:number): string {
    const [u,v] = this.field(x,y,t);
    if (this.colorMode==='direction') return `hsl(${180+Math.atan2(v,u)*180/Math.PI},90%,65%)`;
    if (this.colorMode==='divergence'||this.colorMode==='curl') {
      const [a,b,c,d] = jacobian(this.field,x,y,t), value = this.colorMode==='curl' ? c-b : a+d;
      return `hsl(${value<0?210:20},90%,${45+20*Math.tanh(Math.abs(value))}%)`;
    }
    return `hsl(${245-210*(2/Math.PI)*Math.atan(Math.hypot(u,v))},95%,65%)`;
  }
  private line(ctx:CanvasRenderingContext2D,a:Point,b:Point):void { ctx.moveTo(...a);ctx.lineTo(...b); }
  paintBackground(): void {
    if (!this.background) return;
    const c = this.background, ctx = c.getContext('2d')!; ctx.clearRect(0,0,c.width,c.height);
    const gradient = ctx.createRadialGradient(c.width/2,c.height/2,0,c.width/2,c.height/2,c.width*0.75);
    gradient.addColorStop(0,'#101a30'); gradient.addColorStop(1,'#070910'); ctx.fillStyle = gradient; ctx.fillRect(0,0,c.width,c.height);
    const scale = c.width/900;
    if (this.showGrid) {
      ctx.font = `${11*scale}px monospace`; ctx.lineWidth = scale;
      for (const axis of [0,1]) {
        const lo = this.bounds[axis*2], hi = this.bounds[axis*2+1];
        for (const n of axisTicks(lo,hi,niceStep(hi-lo))) {
          ctx.strokeStyle = n===0 ? '#67718888' : '#a0adc515';ctx.beginPath();
          if(axis===0) { const x = this.screen([n,0])[0];this.line(ctx,[x,0],[x,c.height]);ctx.fillStyle='#a0adc5';ctx.fillText(n.toPrecision(3).replace(/\.0+$/,''),x+3,c.height-8*scale); }
          else { const y = this.screen([0,n])[1];this.line(ctx,[0,y],[c.width,y]);ctx.fillStyle='#a0adc5';ctx.fillText(n.toPrecision(3).replace(/\.0+$/,''),5*scale,y-4*scale); }
          ctx.stroke();
        }
      }
    }
    if(this.showArrows) {
      const nx = Math.max(8,Math.min(40,this.density)), ny = Math.round(nx*0.68);
      const length = c.width/nx*0.33;
      ctx.lineWidth = 1.05*scale;
      for(let i=0;i<nx;i++)for(let j=0;j<ny;j++) {
        const x=this.bounds[0]+(i+0.5)/nx*(this.bounds[1]-this.bounds[0]), y=this.bounds[2]+(j+0.5)/ny*(this.bounds[3]-this.bounds[2]);
        const [u,v]=this.field(x,y,this.time); if(![u,v].every(Number.isFinite)||Math.hypot(u,v)<1e-10)continue;
        const angle=Math.atan2(-v/(this.bounds[3]-this.bounds[2])*c.height,u/(this.bounds[1]-this.bounds[0])*c.width), [sx,sy]=this.screen([x,y]);
        const ex=sx+length*Math.cos(angle),ey=sy+length*Math.sin(angle);
        ctx.strokeStyle=this.color(x,y,this.time);ctx.globalAlpha=0.45;ctx.beginPath();
        this.line(ctx,[sx-length*Math.cos(angle)*0.5,sy-length*Math.sin(angle)*0.5],[ex,ey]);
        this.line(ctx,[ex,ey],[ex-length*0.4*Math.cos(angle-0.55),ey-length*0.4*Math.sin(angle-0.55)]);
        this.line(ctx,[ex,ey],[ex-length*0.4*Math.cos(angle+0.55),ey-length*0.4*Math.sin(angle+0.55)]);ctx.stroke();
      }
      ctx.globalAlpha=1;
    }
    if(this.showNullclines) for(const d of [0,1]) {
      ctx.strokeStyle=d===0?'#ff6c9b':'#7bffc6';ctx.lineWidth=1.4*scale;ctx.setLineDash([5*scale,4*scale]);ctx.beginPath();
      for(const [a,b] of traceContours((x,y)=>this.field(x,y,this.time)[d],this.bounds,70,50))this.line(ctx,this.screen([a.x,a.y]),this.screen([b.x,b.y]));
      ctx.stroke();ctx.setLineDash([]);
    }
    for(const orbit of this.orbits) {
      ctx.strokeStyle=orbit.seed.color;ctx.lineWidth=1.6*scale;
      for(const path of [orbit.backward,orbit.forward]) {
        if(!path)continue;ctx.globalAlpha=path===orbit.backward?0.32:0.88;
        ctx.setLineDash(path===orbit.backward?[3*scale,4*scale]:[]);ctx.beginPath();
        path.points.forEach((p,i)=>{const q=this.screen(p);i?ctx.lineTo(...q):ctx.moveTo(...q);});
        if(this.glow){ctx.shadowColor=orbit.seed.color;ctx.shadowBlur=7*scale;}ctx.stroke();ctx.shadowBlur=0;
      }
      ctx.globalAlpha=1;ctx.setLineDash([]);const [x,y]=this.screen(orbit.seed.point);ctx.fillStyle=orbit.seed.color;ctx.beginPath();ctx.arc(x,y,3*scale,0,2*Math.PI);ctx.fill();
    }
    for(const e of this.fixedPoints) {
      const [x,y]=this.screen(e.point);ctx.strokeStyle=e.kind==='Silla'?'#ffb35c':e.kind.includes('estable')&&!e.kind.includes('inestable')?'#8affa8':'#ffa0dc';
      ctx.lineWidth=2*scale;ctx.beginPath();ctx.arc(x,y,6*scale,0,2*Math.PI);ctx.stroke();
    }
  }
  private spawn(): Particle {
    return {point:[this.bounds[0]+Math.random()*(this.bounds[1]-this.bounds[0]),this.bounds[2]+Math.random()*(this.bounds[3]-this.bounds[2])],t:this.time,age:Math.random()*6};
  }
  resetParticles(): void {
    this.particles=Array.from({length:Math.max(0,Math.min(1000,this.particleCount))},()=>this.spawn());
    this.trails?.getContext('2d')?.clearRect(0,0,this.trails.width,this.trails.height);
  }
  private animate(timestamp:number): void {
    if(this.dead)return;
    const dt=Math.min(0.05,(timestamp-(this.last||timestamp))/1000);this.last=timestamp;
    if(this.running&&!document.hidden&&!this.error) {
      const end=this.time+dt*this.speed;
      if(this.showParticles) {
        const ctx=this.trails.getContext('2d')!,scale=this.trails.width/900;
        ctx.globalCompositeOperation='destination-out';ctx.fillStyle=`rgba(0,0,0,${1-Math.exp(-dt*2)})`;ctx.fillRect(0,0,this.trails.width,this.trails.height);ctx.globalCompositeOperation='source-over';
        ctx.lineWidth=1.2*scale;
        for(let i=0;i<this.particles.length;i++) {
          let p=this.particles[i];const previous=p.point;
          p.age+=dt;let valid=true;
          for(let k=0;k<12&&p.t<end-1e-9;k++) {
            const step=adaptiveStep(this.field,p.point,p.t,Math.min(0.03,end-p.t),1e-4);
            if(!step){valid=false;break;}p.point=step.point;p.t=step.t;
          }
          const [x,y]=p.point;
          if(!valid||p.t<end-1e-8||p.age>8||x<this.bounds[0]||x>this.bounds[1]||y<this.bounds[2]||y>this.bounds[3]) {this.particles[i]=this.spawn();continue;}
          ctx.strokeStyle=this.color(x,y,p.t);ctx.beginPath();this.line(ctx,this.screen(previous,this.trails),this.screen(p.point,this.trails));ctx.stroke();
        }
      }
      this.time=end;
      if(this.timeDependent&&timestamp-this.lastField>300) {this.paintBackground();this.lastField=timestamp;}
    }
    this.paint();
    if(timestamp-this.lastField>300&&!this.timeDependent) this.lastField=timestamp;
    if(Math.floor(timestamp/200)!==Math.floor((timestamp-dt*1000)/200))this.zone.run(()=>{});
    this.frame=requestAnimationFrame(t=>this.animate(t));
  }
  private paint(): void {
    if(!this.background)return;const ctx=this.canvas.nativeElement.getContext('2d')!;
    ctx.drawImage(this.background,0,0);
    if(this.showParticles){if(this.glow){ctx.shadowColor='#78caff';ctx.shadowBlur=5;}ctx.drawImage(this.trails,0,0);ctx.shadowBlur=0;}
    if (this.running) for (const o of this.orbits) {
      const path = o.forward, elapsed = this.time-o.seed.t;
      if (elapsed < 0 || !path.times.length || elapsed > path.times[path.times.length-1]-o.seed.t) continue;
      const i = path.times.findIndex(t => t >= this.time);
      if (i < 0) continue;
      const p = this.screen(path.points[i]);ctx.fillStyle=o.seed.color;ctx.shadowColor=o.seed.color;ctx.shadowBlur=10;
      ctx.beginPath();ctx.arc(...p,3*this.background.width/900,0,2*Math.PI);ctx.fill();ctx.shadowBlur=0;
    }
    if (this.showStrobe && Number.isFinite(this.strobePeriod) && this.strobePeriod > 0) {
      for (const o of this.orbits) {
        const path=o.forward;let k=1;
        ctx.fillStyle='#fff3bd';
        for (let i=1;i<path.times.length && k<500;i++) {
          while (path.times[i]>=o.seed.t+k*this.strobePeriod && k<500) {
            const target=o.seed.t+k*this.strobePeriod,f=(target-path.times[i-1])/(path.times[i]-path.times[i-1]);
            if(f>=0 && f<=1){const a=path.points[i-1],b=path.points[i],p=this.screen([a[0]+f*(b[0]-a[0]),a[1]+f*(b[1]-a[1])]);ctx.beginPath();ctx.arc(...p,2.5*this.background.width/900,0,2*Math.PI);ctx.fill();}
            k++;
          }
        }
      }
    }
  }
  toggleRun(): void { this.running=!this.running; }
  restart(): void {
    if (!Number.isFinite(this.launchTime)) { this.notice='Introduce un tiempo de lanzamiento finito.'; return; }
    this.time=this.launchTime;this.resetParticles();this.paintBackground();this.paint();
  }
  addSeed(point: Point): void {
    if (!point.every(Number.isFinite)||point[0]<this.bounds[0]||point[0]>this.bounds[1]||point[1]<this.bounds[2]||point[1]>this.bounds[3]) {this.notice='El punto inicial debe estar dentro del encuadre.';return;}
    if(this.seeds.length>=32){this.notice='Máximo de 32 trayectorias. Borra alguna para añadir otra.';return;}
    this.seeds.push({point,t:this.timeDependent?this.time:this.launchTime,color:this.palette(this.seeds.length)});this.rebuild();
  }
  seedGrid(): void {
    this.seeds=[];
    for(let i=0;i<5;i++)for(let j=0;j<5;j++)this.seeds.push({point:[this.bounds[0]+(i+0.5)/5*(this.bounds[1]-this.bounds[0]),this.bounds[2]+(j+0.5)/5*(this.bounds[3]-this.bounds[2])],t:this.timeDependent?this.time:this.launchTime,color:this.palette(i*5+j)});
    this.rebuild();
  }
  clear(): void {this.seeds=[];this.orbits=[];this.notice='';this.rebuild();}
  undo(): void {this.seeds.pop();this.rebuild();}
  zoom(factor:number,center?:Point): void {
    const p=center??[(this.bounds[0]+this.bounds[1])/2,(this.bounds[2]+this.bounds[3])/2];
    const b:Bounds=[p[0]+(this.bounds[0]-p[0])*factor,p[0]+(this.bounds[1]-p[0])*factor,p[1]+(this.bounds[2]-p[1])*factor,p[1]+(this.bounds[3]-p[1])*factor];
    if(Math.min(b[1]-b[0],b[3]-b[2])<1e-6||Math.max(b[1]-b[0],b[3]-b[2])>1e6)return;
    this.bounds=b;this.scheduleView();
  }
  resetView(): void {this.bounds=[...this.selected.bounds];this.apply();}
  wheel(event:WheelEvent):void {if(!this.wheelEnabled&&!event.ctrlKey)return;event.preventDefault();this.zoom(Math.exp(Math.max(-200,Math.min(200,event.deltaY))*0.0015),this.world(this.local(event)));}
  private local(event:PointerEvent|WheelEvent):Point {const r=this.canvas.nativeElement.getBoundingClientRect();return[event.clientX-r.left,event.clientY-r.top];}
  pointerDown(event:PointerEvent):void {
    if(event.button!==0)return;
    this.canvas.nativeElement.setPointerCapture(event.pointerId);this.pointers.set(event.pointerId,this.local(event));
    const points=[...this.pointers.values()];
    this.gesture={point:points.length>1?[(points[0][0]+points[1][0])/2,(points[0][1]+points[1][1])/2]:points[0],bounds:[...this.bounds],distance:points.length>1?Math.hypot(points[0][0]-points[1][0],points[0][1]-points[1][1]):0,moved:points.length>1};
  }
  pointerMove(event:PointerEvent):void {
    const point=this.local(event),world=this.world(point);this.coordinates=`x ${world[0].toFixed(3)} · y ${world[1].toFixed(3)}`;
    if(!this.pointers.has(event.pointerId)||!this.gesture)return;
    this.pointers.set(event.pointerId,point);const points=[...this.pointers.values()],g=this.gesture;
    if(points.length===2&&g.distance>0) {
      const r=this.canvas.nativeElement.getBoundingClientRect(),distance=Math.hypot(points[0][0]-points[1][0],points[0][1]-points[1][1]);
      if(distance<10)return;const factor=Math.max(0.2,Math.min(5,g.distance/distance));
      const center:Point=[(points[0][0]+points[1][0])/2,(points[0][1]+points[1][1])/2];
      const anchor:Point=[g.bounds[0]+g.point[0]/r.width*(g.bounds[1]-g.bounds[0]),g.bounds[3]-g.point[1]/r.height*(g.bounds[3]-g.bounds[2])];
      const w=(g.bounds[1]-g.bounds[0])*factor,h=(g.bounds[3]-g.bounds[2])*factor;
      if(w<1e-6||h<1e-6||w>1e6||h>1e6)return;
      this.bounds=[anchor[0]-center[0]/r.width*w,anchor[0]+(1-center[0]/r.width)*w,anchor[1]-(1-center[1]/r.height)*h,anchor[1]+center[1]/r.height*h];
      g.moved=true;this.scheduleView();
    } else if(this.mode==='pan') {
      const r=this.canvas.nativeElement.getBoundingClientRect(),dx=(point[0]-g.point[0])/r.width*(g.bounds[1]-g.bounds[0]),dy=(point[1]-g.point[1])/r.height*(g.bounds[3]-g.bounds[2]);
      this.bounds=[g.bounds[0]-dx,g.bounds[1]-dx,g.bounds[2]+dy,g.bounds[3]+dy];g.moved=true;this.scheduleView();
    } else if(Math.hypot(point[0]-g.point[0],point[1]-g.point[1])>8)g.moved=true;
  }
  pointerUp(event:PointerEvent,cancel=false):void {
    if(!cancel&&this.pointers.size===1&&!this.gesture?.moved&&this.mode==='seed')this.addSeed(this.world(this.local(event)));
    this.pointers.delete(event.pointerId);
    if(this.pointers.size===0)this.gesture=undefined;
    else if(this.gesture)this.gesture.moved=true;
  }
  paintSeries():void {
    const ctx=this.series.nativeElement.getContext('2d')!,c=this.series.nativeElement;c.width=900;c.height=190;
    ctx.fillStyle='#0b101c';ctx.fillRect(0,0,c.width,c.height);
    const orbit=this.orbits[this.orbits.length-1]?.forward;if(!orbit||orbit.points.length<2)return;
    const all=orbit.points.flat(),min=Math.min(...all),max=Math.max(...all),span=Math.max(0.001,max-min);
    const start=orbit.times[0],end=orbit.times[orbit.times.length-1];
    for(const d of [0,1]){ctx.strokeStyle=d?'#ff7ca8':'#61d8ff';ctx.lineWidth=2;ctx.beginPath();orbit.points.forEach((p,i)=>{const x=35+(orbit.times[i]-start)/Math.max(1e-9,end-start)*840,y=165-(p[d]-min)/span*135;i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.stroke();}
    ctx.font='12px monospace';ctx.fillStyle='#a0adc5';ctx.fillText(`${min.toPrecision(3)} … ${max.toPrecision(3)}`,8,15);ctx.fillText(`t ${start.toFixed(2)} → ${end.toFixed(2)}`,650,185);
  }
  exportPng():void {this.paint();this.canvas.nativeElement.toBlob(blob=>{if(blob)this.download(blob,'campo-vectorial.png');});}
  exportCsv():void {
    const rows=['trajectory,direction,t,x,y'];
    this.orbits.forEach((o,i)=>{for(const [direction,path] of [['forward',o.forward],['backward',o.backward]] as const)path?.points.forEach((p,j)=>rows.push(`${i+1},${direction},${path.times[j]},${p[0]},${p[1]}`));});
    this.download(new Blob([rows.join('\n')],{type:'text/csv;charset=utf-8'}),'trayectorias.csv');
  }
  private download(blob:Blob,name:string):void {const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  async share():Promise<void> {
    const state={dx:this.dx,dy:this.dy,bounds:this.bounds,parameters:this.parameters,duration:this.duration,t:this.launchTime,seeds:this.seeds};
    const url=new URL(location.href);url.searchParams.set('field',JSON.stringify(state));
    try{await navigator.clipboard.writeText(url.toString());this.notice='Enlace copiado con ecuaciones, parámetros y puntos iniciales.';}catch{this.notice='No se pudo acceder al portapapeles. Prueba desde HTTPS.';}
  }
  private restoreLink():void {
    const raw=new URL(location.href).searchParams.get('field');if(!raw)return;
    try{
      if(raw.length>15000)throw Error();const s=JSON.parse(raw);
      if(typeof s.dx!=='string'||typeof s.dy!=='string'||s.dx.length+s.dy.length>4000||!Array.isArray(s.bounds)||s.bounds.length!==4||!s.bounds.every(Number.isFinite)||!Array.isArray(s.parameters)||s.parameters.length>30)throw Error();
      const names=parameterNames(s.dx,s.dy);
      if(s.parameters.some((p:CurveParameter)=>!names.includes(p.name)||![p.value,p.min,p.max,p.step].every(Number.isFinite)))throw Error();
      this.dx=s.dx;this.dy=s.dy;this.bounds=s.bounds;this.duration=s.duration;this.launchTime=s.t;this.time=s.t;
      this.parameters=s.parameters.map((p:CurveParameter)=>({...p,error:''}));
      this.selected={...this.selected,name:'Sistema compartido',description:'Ecuaciones y puntos iniciales recuperados del enlace.',dx:s.dx,dy:s.dy,bounds:[s.bounds[0],s.bounds[1],s.bounds[2],s.bounds[3]],source:undefined,seeds:[]};
      if(Array.isArray(s.seeds))this.selected.seeds=s.seeds.slice(0,32).filter((v:Seed)=>Array.isArray(v.point)&&v.point.length===2&&v.point.every(Number.isFinite)).map((v:Seed)=>v.point);
      if(Array.isArray(s.seeds))this.sharedSeeds=s.seeds.slice(0,32).filter((v:Seed)=>Array.isArray(v.point)&&v.point.length===2&&v.point.every(Number.isFinite)&&Number.isFinite(v.t)).map((v:Seed,i:number)=>({point:v.point,t:v.t,color:this.palette(i)}));
    }catch{this.notice='El enlace no contiene una configuración válida.';}
  }
}
