import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MandelbrotRenderer, MandelbrotField, RenderProgress } from './mandelbrot-renderer';
import { RenderSettings } from './mandelbrot-engine';
import { MANDELBROT_PALETTES, MandelbrotColorizer } from './mandelbrot-palettes';
import { MandelbrotView, SavedView, initialView, saveView, restoreView, transformView, decimalCoordinate, extendedFromFixed, extendedNumber, spanFixed } from './mandelbrot-view';
interface Pointer { x: number; y: number; }
interface Gesture extends Pointer { distance: number; }
@Component({ host: { class: 'fractal-page' }, selector: 'app-mandelbrot', standalone: true,
  imports: [CommonModule, FormsModule], templateUrl: './mandelbrot.component.html', styleUrls: ['./mandelbrot.component.css'] })
export class MandelbrotComponent implements AfterViewInit, OnDestroy {
  static title = 'Conjunto de Mandelbrot'; static route = 'mandelbrot-set';
  @ViewChild('canvas', {static:true}) canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('stage', {static:true}) stage!: ElementRef<HTMLDivElement>;
  @ViewChild('studio', {static:true}) studio!: ElementRef<HTMLDivElement>;
  readonly palettes=MANDELBROT_PALETTES;
  readonly presets=[
    {name:'Vista completa',real:'-0.5',imag:'0',zoom:0},
    {name:'Valle de los caballitos',real:'-0.743643887037151',imag:'0.13182590420533',zoom:14},
    {name:'Espirales de la costa',real:'-0.7453',imag:'0.1127',zoom:11},
    {name:'Cúspide del cardioide',real:'0.25',imag:'0',zoom:8},
    {name:'Punta −2 · profundidad extrema',real:'-2',imag:'0',zoom:1100}
  ];
  view: MandelbrotView=initialView();
  palette='labs';phase=0;quality='balanced';iterationBudget=0;customIterations=4096;preset=0;
  width=800;height=440;isDrawing=true;progress=0;renderMilliseconds=0;threadCount=0;skippedIterations=0;repairedPixels=0;
  error='';notice='';dragging=false;
  private renderer=new MandelbrotRenderer();
  private observer?: ResizeObserver;
  private resizeFrame=0;private previewFrame=0;private colorFrame=0;private renderTimer?: ReturnType<typeof setTimeout>;
  private token=0;private dead=false;private colorizer=new MandelbrotColorizer('labs',0);
  private field?: MandelbrotField;private coarse?: MandelbrotField;private current?: MandelbrotField;
  private displayedView?: MandelbrotView;private previewView?: MandelbrotView;private snapshot?: HTMLCanvasElement;
  private pointers=new Map<number,Pointer>();private gesture?: Gesture;private interaction=false;
  private history: SavedView[]=[];private lastUi=0;private home=true;
  private wheelListener=(event: WheelEvent)=>this.onWheel(event);
  constructor(private zone: NgZone) {}
  get maxIterations(): number {
    if(this.iterationBudget===-1)return this.customIterations;
    if(this.iterationBudget>0)return this.iterationBudget;
    const zoom=Math.max(0,this.view.zoom);
    return Math.ceil(((zoom<28?1024:4096)+32*Math.sqrt(zoom)+1.5*zoom)/256)*256;
  }
  get canUndo(): boolean { return this.history.length>0; }
  get zoomLabel(): string { return `10^${(this.view.zoom*Math.LOG10E*Math.LN2).toFixed(2)}`; }
  get algorithmLabel(): string { return this.view.zoom<28?'Cálculo directo paralelo':this.view.zoom>900?'Perturbación BLA · rango extendido':'Perturbación BLA'; }
  get centerLabel(): string { return `${decimalCoordinate(this.view.real,this.view.bits,18)} ${this.view.imag<0n?'−':'+'} ${decimalCoordinate(this.view.imag<0n?-this.view.imag:this.view.imag,this.view.bits,18)} i`; }
  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(()=>{
      this.canvas.nativeElement.addEventListener('wheel',this.wheelListener,{passive:false});
      this.observer=new ResizeObserver(()=>{
        cancelAnimationFrame(this.resizeFrame);
        this.resizeFrame=requestAnimationFrame(()=>this.measure());
      });
      this.observer.observe(this.stage.nativeElement);
      this.resizeFrame=requestAnimationFrame(()=>this.measure());
    });
  }
  ngOnDestroy(): void {
    this.dead=true;this.token++;this.renderer.destroy();this.observer?.disconnect();
    this.canvas.nativeElement.removeEventListener('wheel',this.wheelListener);
    if(this.renderTimer)clearTimeout(this.renderTimer);
    [this.resizeFrame,this.previewFrame,this.colorFrame].forEach(id=>cancelAnimationFrame(id));
  }
  private measure(): void {
    if(this.dead)return;
    const rect=this.stage.nativeElement.getBoundingClientRect();
    const dpr=this.quality==='fast'?1:Math.min(2,window.devicePixelRatio||1);
    const width=Math.max(160,Math.round(rect.width*dpr)),height=Math.max(100,Math.round(rect.height*dpr));
    if(width!==this.width||height!==this.height||!this.displayedView) {
      this.width=width;this.height=height;
      if(this.home)this.view=this.fittedHome();
      this.canvas.nativeElement.width=width;this.canvas.nativeElement.height=height;
      this.snapshot=undefined;this.scheduleRender(0);
    }
  }
  private settings(width: number,height: number,preview=false): RenderSettings {
    return {view:saveView(this.view),width,height,iterations:this.maxIterations,
      antialias:preview||this.quality==='fast'?'none':this.quality==='ultra'?'full':'adaptive'};
  }
  private scheduleRender(delay=130): void {
    if(this.dead)return;
    this.token++;this.renderer.cancel();if(this.renderTimer)clearTimeout(this.renderTimer);
    if(!Number.isSafeInteger(this.maxIterations)||this.maxIterations<16){this.isDrawing=false;this.error='Introduce al menos 16 iteraciones y un número entero válido.';return;}
    this.isDrawing=true;this.progress=0;this.error='';
    const token=this.token;
    this.renderTimer=setTimeout(()=>{this.renderTimer=undefined;this.interaction=false;void this.compute(token);},delay);
    this.zone.run(()=>{});
  }
  private async compute(token: number): Promise<void> {
    if(this.dead||token!==this.token)return;
    const start=performance.now(),view={...this.view};
    try {
      const width=Math.max(80,Math.round(this.width/4)),height=Math.max(50,Math.round(this.height/4));
      const coarse=await this.renderer.render(this.settings(width,height,true),state=>this.updateProgress(state,0,15,token,false));
      if(!coarse||token!==this.token||this.dead)return;
      this.coarse=coarse;this.field=undefined;this.current=undefined;this.paintField(coarse,true);this.displayedView=view;
      const field=await this.renderer.render(this.settings(this.width,this.height),state=>this.updateProgress(state,15,85,token,true));
      if(!field||token!==this.token||this.dead)return;
      this.field=field;this.current=field;this.paintField(field);this.displayedView=view;this.snapshot=undefined;
      this.zone.run(()=>{this.isDrawing=false;this.progress=100;this.renderMilliseconds=performance.now()-start;this.threadCount=field.workers;this.skippedIterations=field.skipped;this.repairedPixels=field.repaired;});
    } catch(error) {
      if(this.dead||token!==this.token)return;
      this.zone.run(()=>{this.isDrawing=false;this.error='No se ha podido completar esta vista. Puedes reintentar o reducir la calidad y las iteraciones.';});
      console.warn('Mandelbrot renderer:',error);
    }
  }
  private updateProgress(state: RenderProgress,base: number,range: number,token: number,paint: boolean): void {
    if(this.dead||token!==this.token)return;
    this.progress=Math.round(base+range*state.completed/state.total);
    if(paint) {
      this.current=state.field;
      if(state.tile) {
        const tile=state.tile,data=this.colorizer.paint(tile.samples);
        this.canvas.nativeElement.getContext('2d')?.putImageData(new ImageData(data,tile.width,tile.height),tile.x,tile.y);
      }
    }
    const now=performance.now();if(now-this.lastUi>70){this.lastUi=now;this.zone.run(()=>{});}
  }
  private paintField(field: MandelbrotField,stretch=false): void {
    const ctx=this.canvas.nativeElement.getContext('2d');if(!ctx)return;
    const data=new ImageData(this.colorizer.paint(field.samples),field.width,field.height);
    if(stretch) {
      const buffer=document.createElement('canvas');buffer.width=field.width;buffer.height=field.height;
      buffer.getContext('2d')!.putImageData(data,0,0);ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(buffer,0,0,this.width,this.height);
    } else ctx.putImageData(data,0,0);
  }
  recolor(): void {
    this.colorizer=new MandelbrotColorizer(this.palette,this.phase);
    cancelAnimationFrame(this.colorFrame);this.colorFrame=requestAnimationFrame(()=>{
      if(this.dead||this.interaction)return;
      if(this.field&&!this.isDrawing)this.paintField(this.field);
      else {
        if(this.coarse)this.paintField(this.coarse,true);
        if(this.current) {
          const ctx=this.canvas.nativeElement.getContext('2d'),image=new ImageData(this.colorizer.paint(this.current.samples),this.current.width,this.current.height);
          if(ctx){const buffer=document.createElement('canvas');buffer.width=image.width;buffer.height=image.height;buffer.getContext('2d')!.putImageData(image,0,0);ctx.drawImage(buffer,0,0);}
        }
      }
    });
  }
  changeSettings(): void {
    if(!Number.isSafeInteger(this.maxIterations)||this.maxIterations<16){this.error='Introduce al menos 16 iteraciones y un número entero válido.';return;}
    this.snapshot=undefined;this.measure();this.scheduleRender(0);
  }
  private beginInteraction(): void {
    if(this.interaction)return;
    this.interaction=true;this.history.push(saveView(this.view));if(this.history.length>32)this.history.shift();
    this.renderer.cancel();this.token++;this.field=undefined;this.current=undefined;this.coarse=undefined;
    const source=this.canvas.nativeElement;
    this.snapshot=document.createElement('canvas');this.snapshot.width=source.width;this.snapshot.height=source.height;
    this.snapshot.getContext('2d')?.drawImage(source,0,0);this.previewView={...(this.displayedView||this.view)};
  }
  private camera(from: Pointer,to: Pointer,delta: number): void {
    const rect=this.canvas.nativeElement.getBoundingClientRect();if(!rect.width||!rect.height)return;
    this.beginInteraction();this.home=false;
    this.view=transformView(this.view,from.x,from.y,to.x,to.y,rect.width,rect.height,delta);
    cancelAnimationFrame(this.previewFrame);this.previewFrame=requestAnimationFrame(()=>this.paintPreview());
    this.scheduleRender(this.pointers.size?220:130);
  }
  private paintPreview(): void {
    if(!this.snapshot||!this.previewView||this.dead)return;
    const ctx=this.canvas.nativeElement.getContext('2d');if(!ctx)return;
    const old=this.previewView,shift=BigInt(this.view.bits-old.bits);
    const real=shift>=0?old.real<<shift:old.real>>-shift,imag=shift>=0?old.imag<<shift:old.imag>>-shift;
    const delta=extendedFromFixed(real-this.view.real,imag-this.view.imag,this.view.bits),span=extendedFromFixed(spanFixed(this.view),0n,this.view.bits);
    const factor=delta.r||delta.i?2**(delta.e-span.e)/span.r:0,k=2**(this.view.zoom-old.zoom);
    ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#08080e';ctx.fillRect(0,0,this.width,this.height);
    if(Number.isFinite(k)&&Number.isFinite(factor)) {
      ctx.setTransform(k,0,0,k,this.width/2*(1-k)+delta.r*factor*this.width,this.height/2*(1-k)-delta.i*factor*this.width);
      ctx.drawImage(this.snapshot,0,0,this.width,this.height);ctx.setTransform(1,0,0,1,0,0);
    }
    this.displayedView={...this.view};
  }
  onWheel(event: WheelEvent): void {
    event.preventDefault();if(!Number.isFinite(event.deltaY))return;
    const rect=this.canvas.nativeElement.getBoundingClientRect(),point={x:event.clientX-rect.left,y:event.clientY-rect.top};
    const pixels=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?rect.height:1);
    this.camera(point,point,-Math.max(-480,Math.min(480,pixels))/240);
  }
  pointerDown(event: PointerEvent): void {
    if(event.pointerType==='mouse'&&event.button!==0)return;
    event.preventDefault();this.canvas.nativeElement.focus({preventScroll:true});this.canvas.nativeElement.setPointerCapture(event.pointerId);
    this.pointers.set(event.pointerId,this.pointer(event));this.gesture=this.currentGesture();this.dragging=true;this.beginInteraction();
  }
  pointerMove(event: PointerEvent): void {
    if(!this.pointers.has(event.pointerId))return;event.preventDefault();
    this.pointers.set(event.pointerId,this.pointer(event));const next=this.currentGesture(),previous=this.gesture;
    if(next&&previous)this.camera(previous,next,next.distance&&previous.distance?Math.log2(next.distance/previous.distance):0);
    this.gesture=next;
  }
  pointerUp(event: PointerEvent): void {
    if(!this.pointers.has(event.pointerId))return;
    this.pointers.delete(event.pointerId);if(this.canvas.nativeElement.hasPointerCapture(event.pointerId))this.canvas.nativeElement.releasePointerCapture(event.pointerId);
    this.gesture=this.currentGesture();this.dragging=this.pointers.size>0;
    if(!this.pointers.size)this.scheduleRender(0);
  }
  private pointer(event: PointerEvent): Pointer {const rect=this.canvas.nativeElement.getBoundingClientRect();return {x:event.clientX-rect.left,y:event.clientY-rect.top};}
  private currentGesture(): Gesture | undefined {
    const points=[...this.pointers.values()];if(!points.length)return undefined;if(points.length===1)return {...points[0],distance:0};
    return {x:(points[0].x+points[1].x)/2,y:(points[0].y+points[1].y)/2,distance:Math.hypot(points[0].x-points[1].x,points[0].y-points[1].y)};
  }
  zoomIn(): void {this.zoom(1);}
  zoomOut(): void {this.zoom(-1);}
  private zoom(delta: number): void {const r=this.canvas.nativeElement.getBoundingClientRect(),p={x:r.width/2,y:r.height/2};this.camera(p,p,delta);}
  onKey(event: KeyboardEvent): void {
    const rect=this.canvas.nativeElement.getBoundingClientRect(),center={x:rect.width/2,y:rect.height/2};
    const movement: Record<string,Pointer>={ArrowLeft:{x:40,y:0},ArrowRight:{x:-40,y:0},ArrowUp:{x:0,y:40},ArrowDown:{x:0,y:-40}};
    if(movement[event.key]){event.preventDefault();const d=movement[event.key];this.camera(center,{x:center.x+d.x,y:center.y+d.y},0);}
    else if(['+','=','-','Home'].includes(event.key)){event.preventDefault();if(event.key==='Home')this.resetView();else this.zoom(event.key==='-'?-1:1);}
  }
  private fittedHome(): MandelbrotView {return initialView('-0.5','0',Math.min(0,-Math.log2(.7*this.width/this.height)));}
  choosePreset(): void {const p=this.presets[this.preset];this.openView(this.preset===0?this.fittedHome():initialView(p.real,p.imag,p.zoom),true,this.preset===0);this.revealView();}
  private revealView(): void {
    this.studio.nativeElement.querySelector('details')?.removeAttribute('open');
    this.canvas.nativeElement.focus({preventScroll:true});this.stage.nativeElement.scrollIntoView({block:'start',behavior:'instant'});
  }
  resetView(): void {this.preset=0;this.openView(this.fittedHome(),true,true);}
  private openView(view: MandelbrotView,remember=true,home=false): void {
    if(remember){this.history.push(saveView(this.view));if(this.history.length>32)this.history.shift();}
    this.home=home;this.view=view;this.interaction=false;this.snapshot=undefined;this.field=undefined;this.coarse=undefined;this.current=undefined;
    const ctx=this.canvas.nativeElement.getContext('2d');if(ctx){ctx.fillStyle='#08080e';ctx.fillRect(0,0,this.width,this.height);}
    this.scheduleRender(0);
  }
  undo(): void {const saved=this.history.pop();if(saved)this.openView(restoreView(saved),false);}
  retry(): void {this.scheduleRender(0);}
  savePng(): void {
    const link=document.createElement('a');link.download=`mandelbrot-${this.palette}-${this.view.zoom.toFixed(2)}.png`;
    link.href=this.canvas.nativeElement.toDataURL('image/png');link.click();
  }
  savePosition(): void {
    const blob=new Blob([JSON.stringify({version:1,view:saveView(this.view),palette:this.palette,phase:this.phase})],{type:'application/json'});
    const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='mandelbrot-vista.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  async loadPosition(event: Event): Promise<void> {
    const input=event.target as HTMLInputElement,file=input.files?.[0];if(!file)return;
    try {const saved=JSON.parse(await file.text());if(saved.version!==1)throw new Error('Version');const view=restoreView(saved.view);if(this.palettes.some(p=>p.id===saved.palette))this.palette=saved.palette;this.phase=Number.isFinite(saved.phase)?((saved.phase%1)+1)%1:0;this.colorizer=new MandelbrotColorizer(this.palette,this.phase);this.openView(view);this.revealView();}
    catch{this.error='El archivo no contiene una vista de Mandelbrot válida.';}finally{input.value='';}
  }
  async fullscreen(): Promise<void> {
    try {if(document.fullscreenElement)await document.exitFullscreen();else if(this.studio.nativeElement.requestFullscreen)await this.studio.nativeElement.requestFullscreen();}
    catch{this.notice='El navegador no ha permitido abrir la pantalla completa.';}
  }
}
