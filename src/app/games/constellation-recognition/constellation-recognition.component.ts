import { ContentConnectionsComponent } from '../../shared/content/content-connections/content-connections.component';
﻿import { Component, ElementRef, ViewChild } from '@angular/core';
import { CONSTELLATIONS } from './constellation-catalog';
import { Answer, Constellation, Difficulty, Hemisphere, Question, makeRound, points, pool, starRadius, validProgress } from './constellation.model';
@Component({selector: 'app-constellation-recognition', standalone: true, imports: [ContentConnectionsComponent], templateUrl: './constellation-recognition.component.html', styleUrls: ['./constellation-recognition.component.css', './constellation-sky.css', './constellation-question.css', './constellation-objects.css']})
export class ConstellationRecognitionComponent {
  // content-connections:start
  readonly learningConnections = [{"route":"/articles/dot-product","label":"Producto escalar","reason":"Relaciona el ángulo entre direcciones con su producto escalar."},{"route":"/articles/radians","label":"Radianes","reason":"Repasa la conversión entre medidas angulares."},{"route":"/articles/spherical-trigonometry","label":"Trigonometría esférica y coordenadas celestes","reason":"Interpreta posiciones y separaciones angulares en la esfera celeste."}];
  // content-connections:end
  readonly catalog = CONSTELLATIONS;
  readonly levels: {id: Difficulty; name: string; detail: string}[] = [{id:1,name:'Explorador',detail:'Nombres y líneas'},{id:2,name:'Navegante',detail:'Solo líneas'},{id:3,name:'Astrónomo',detail:'Solo estrellas'}];
  hemisphere: Hemisphere = 'north'; difficulty: Difficulty = 1; count = 10;
  mode: 'setup' | 'quiz' | 'results' | 'atlas' = 'setup'; questions: Question[] = []; answers: Answer[] = []; index = 0; hintCount = 0; pendingExit = false;
  practiceRound = false;
  deepSkyEnabled = true;
  readonly objectKinds = {galaxy:'Galaxia',nebula:'Nebulosa','planetary-nebula':'Nebulosa planetaria','open-cluster':'Cúmulo abierto','globular-cluster':'Cúmulo globular'};
  best: Record<string, number> = {}; mastered = new Set<string>(); atlasId = 'UMa'; zoom = 1; storageMessage = '';
  @ViewChild('skyViewport') private skyViewport?: ElementRef<HTMLDivElement>;
  private readonly pointers = new Map<number, { x: number; y: number }>();
  get dragging() { return this.pointers.size > 0; }
  private readonly storageKey = 'danisagan-constellations-v1';
  constructor() {try {const raw = localStorage.getItem(this.storageKey); if(raw){const data=JSON.parse(raw);if(validProgress(data,this.catalog.map(c=>c.id))){this.best=data.best;this.mastered=new Set(data.mastered);}}}catch {this.storageMessage='El progreso local no está disponible; puedes seguir jugando.';}}
  get candidates() {return pool(this.catalog,this.hemisphere);}
  readonly northCount = pool(this.catalog,'north').length;
  readonly southCount = pool(this.catalog,'south').length;
  get question() {return this.questions[this.index];}
  get target(): Constellation {return this.mode === 'atlas' ? this.candidates.find(c=>c.id===this.atlasId) || this.candidates[0] : this.mode === 'setup' ? this.candidates[0] : this.question?.target || this.candidates[0];}
  get answer() {return this.answers[this.index];}
  get showLines() {return this.mode === 'atlas' || (this.mode === 'quiz' && !!this.answer) || this.difficulty <= 2 || this.hintCount >= 1;}
  get showNames() {return this.mode === 'atlas' || (this.mode === 'quiz' && !!this.answer) || this.difficulty === 1 || this.hintCount >= (this.difficulty === 3 ? 2 : 1);}
  get showDeepSky() {return this.deepSkyEnabled && this.showNames && this.target.objects.length > 0;}
  get maxHints() {return this.difficulty - 1;}
  get score() {return this.answers.reduce((sum,a)=>sum+a.points,0);}
  get correct() {return this.answers.filter(a=>a.correct).length;}
  get missed() {return this.answers.filter(a=>!a.correct);}
  get roundKey() {return `${this.hemisphere}-${this.difficulty}-${this.count}`;}
  get record() {return this.best[this.roundKey] || 0;}
  get masteryCount() {return this.candidates.filter(c=>this.mastered.has(`${c.id}-${this.difficulty}`)).length;}
  get progress() {return this.questions.length ? this.answers.length / this.questions.length * 100 : 0;}
  radius(mag: number) {return starRadius(mag);}
  configureHemisphere(value: Hemisphere) {const complete=this.count===this.candidates.length;this.hemisphere=value;if(complete)this.count=this.candidates.length;this.atlasId=this.candidates[0].id;this.resetView();}
  start(targets?: readonly Constellation[]) {this.practiceRound=!!targets;this.questions=makeRound(this.candidates,this.count,Math.random,targets);this.answers=[];this.index=0;this.hintCount=0;this.pendingExit=false;this.resetView();this.mode='quiz';this.focus('.sky-panel');}
  choose(id: string) {
    if(this.mode!=='quiz'||this.answer||!this.question.options.some(c=>c.id===id))return;
    const correct=id===this.target.id;this.answers.push({id:this.target.id,selected:id,correct,hints:this.hintCount,points:points(this.difficulty,this.hintCount,correct)});
    if(correct&&!this.hintCount)this.mastered.add(`${id}-${this.difficulty}`);this.save();this.focus('.feedback');
  }
  hint() {if(this.mode==='quiz'&&!this.answer&&this.hintCount<this.maxHints)this.hintCount++;}
  next() {if(!this.answer || this.pendingExit)return;if(this.index+1>=this.questions.length){this.mode='results';if(!this.practiceRound && this.questions.length===this.count)this.best[this.roundKey]=Math.max(this.record,this.score);this.save();this.focus('.results');}else{this.index++;this.hintCount=0;this.resetView();this.focus('.sky-panel');}}
  retryMissed() {const targets=this.catalog.filter(c=>this.missed.some(a=>a.id===c.id));if(targets.length)this.start(targets);}
  atlas() {this.mode='atlas';this.atlasId=this.candidates[0].id;this.resetView();}
  inspect(id: string) {this.atlasId=id;this.resetView();}
  setup() {this.mode='setup';this.hintCount=0;this.pendingExit=false;this.resetView();this.focus('.configuration');}
  setZoom(delta: number) { this.scaleSky(this.zoom + delta); }
  private scaleSky(value: number, clientX?: number, clientY?: number): void {
    const viewport = this.skyViewport?.nativeElement;
    const next = Math.max(1, Math.min(2, value));
    if (!viewport) { this.zoom = next; return; }
    const rect = viewport.getBoundingClientRect();
    const x = clientX === undefined ? viewport.clientWidth / 2 : clientX - rect.left;
    const y = clientY === undefined ? viewport.clientHeight / 2 : clientY - rect.top;
    const ratio = next / this.zoom;
    const left = (viewport.scrollLeft + x) * ratio - x;
    const top = (viewport.scrollTop + y) * ratio - y;
    this.zoom = next;
    // Update dimensions before scrolling so the browser clamps to the new bounds.
    const sky = viewport.querySelector<SVGSVGElement>('.sky');
    if (sky) sky.style.width = (next * 100) + '%';
    viewport.scrollLeft = left;
    viewport.scrollTop = top;
  }
  wheelSky(event: WheelEvent): void {
    event.preventDefault();
    const pixels = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? (this.skyViewport?.nativeElement.clientHeight || 460) : 1);
    this.scaleSky(this.zoom * Math.exp(-Math.max(-300, Math.min(300, pixels)) * .002), event.clientX, event.clientY);
  }
  pointerStart(event: PointerEvent): void {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const viewport = this.skyViewport?.nativeElement;
    if (!viewport) return;
    event.preventDefault();
    viewport.setPointerCapture(event.pointerId);
    this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  }
  pointerMove(event: PointerEvent): void {
    if (!this.pointers.has(event.pointerId)) return;
    const viewport = this.skyViewport?.nativeElement;
    if (!viewport) return;
    event.preventDefault();
    const before = [...this.pointers.values()];
    this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const after = [...this.pointers.values()];
    if (before.length === 1) {
      viewport.scrollLeft -= after[0].x - before[0].x;
      viewport.scrollTop -= after[0].y - before[0].y;
    } else {
      const center = (points: { x: number; y: number }[]) => ({ x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2 });
      const distance = (points: { x: number; y: number }[]) => Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
      const oldCenter = center(before), newCenter = center(after), oldDistance = distance(before);
      if (oldDistance > 0) this.scaleSky(this.zoom * distance(after) / oldDistance, oldCenter.x, oldCenter.y);
      viewport.scrollLeft -= newCenter.x - oldCenter.x;
      viewport.scrollTop -= newCenter.y - oldCenter.y;
    }
  }
  pointerEnd(event: PointerEvent): void {
    this.pointers.delete(event.pointerId);
    const viewport = this.skyViewport?.nativeElement;
    if (viewport?.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
  }
  private resetView(): void {
    const viewport = this.skyViewport?.nativeElement;
    for (const id of this.pointers.keys()) if (viewport?.hasPointerCapture(id)) viewport.releasePointerCapture(id);
    this.pointers.clear();
    this.zoom = 1;
    if (viewport) { const sky = viewport.querySelector<SVGSVGElement>('.sky'); if (sky) sky.style.width = '100%'; viewport.scrollLeft = 0; viewport.scrollTop = 0; }
  }
  private focus(selector: string) {if(typeof requestAnimationFrame!=='undefined')requestAnimationFrame(()=>document.querySelector<HTMLElement>(`app-constellation-recognition ${selector}`)?.focus({preventScroll:true}));}
  private save() {try{localStorage.setItem(this.storageKey,JSON.stringify({version:1,best:this.best,mastered:[...this.mastered]}));}catch{this.storageMessage='No se pudo guardar el progreso. Puedes seguir en esta pestaña.';}}
}
