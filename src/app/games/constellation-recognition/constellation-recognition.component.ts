import { Component } from '@angular/core';
import { CONSTELLATIONS } from './constellation-catalog';
import { Answer, Constellation, Difficulty, Hemisphere, Question, makeRound, points, pool, starRadius, validProgress } from './constellation.model';
@Component({selector: 'app-constellation-recognition', standalone: true, templateUrl: './constellation-recognition.component.html', styleUrls: ['./constellation-recognition.component.css', './constellation-sky.css', './constellation-question.css', './constellation-objects.css']})
export class ConstellationRecognitionComponent {
  readonly catalog = CONSTELLATIONS;
  readonly levels: {id: Difficulty; name: string; detail: string}[] = [{id:1,name:'Explorador',detail:'Nombres y líneas'},{id:2,name:'Navegante',detail:'Solo líneas'},{id:3,name:'Astrónomo',detail:'Solo estrellas'}];
  hemisphere: Hemisphere = 'north'; difficulty: Difficulty = 1; count = 10;
  mode: 'setup' | 'quiz' | 'results' | 'atlas' = 'setup'; questions: Question[] = []; answers: Answer[] = []; index = 0; hintCount = 0; pendingExit = false;
  practiceRound = false;
  deepSkyEnabled = true;
  readonly objectKinds = {galaxy:'Galaxia',nebula:'Nebulosa','planetary-nebula':'Nebulosa planetaria','open-cluster':'Cúmulo abierto','globular-cluster':'Cúmulo globular'};
  best: Record<string, number> = {}; mastered = new Set<string>(); atlasId = 'UMa'; zoom = 1; storageMessage = '';
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
  configureHemisphere(value: Hemisphere) {const complete=this.count===this.candidates.length;this.hemisphere=value;if(complete)this.count=this.candidates.length;this.atlasId=this.candidates[0].id;}
  start(targets?: readonly Constellation[]) {this.practiceRound=!!targets;this.questions=makeRound(this.candidates,this.count,Math.random,targets);this.answers=[];this.index=0;this.hintCount=0;this.pendingExit=false;this.zoom=1;this.mode='quiz';this.focus('.sky-panel');}
  choose(id: string) {
    if(this.mode!=='quiz'||this.answer||!this.question.options.some(c=>c.id===id))return;
    const correct=id===this.target.id;this.answers.push({id:this.target.id,selected:id,correct,hints:this.hintCount,points:points(this.difficulty,this.hintCount,correct)});
    if(correct&&!this.hintCount)this.mastered.add(`${id}-${this.difficulty}`);this.save();this.focus('.feedback');
  }
  hint() {if(this.mode==='quiz'&&!this.answer&&this.hintCount<this.maxHints)this.hintCount++;}
  next() {if(!this.answer || this.pendingExit)return;if(this.index+1>=this.questions.length){this.mode='results';if(!this.practiceRound && this.questions.length===this.count)this.best[this.roundKey]=Math.max(this.record,this.score);this.save();this.focus('.results');}else{this.index++;this.hintCount=0;this.zoom=1;this.focus('.sky-panel');}}
  retryMissed() {const targets=this.catalog.filter(c=>this.missed.some(a=>a.id===c.id));if(targets.length)this.start(targets);}
  atlas() {this.mode='atlas';this.atlasId=this.candidates[0].id;this.zoom=1;}
  inspect(id: string) {this.atlasId=id;this.zoom=1;}
  setup() {this.mode='setup';this.hintCount=0;this.pendingExit=false;this.zoom=1;this.focus('.configuration');}
  setZoom(delta: number) {this.zoom=Math.max(1,Math.min(2,this.zoom+delta));}
  private focus(selector: string) {if(typeof requestAnimationFrame!=='undefined')requestAnimationFrame(()=>document.querySelector<HTMLElement>(`app-constellation-recognition ${selector}`)?.focus({preventScroll:true}));}
  private save() {try{localStorage.setItem(this.storageKey,JSON.stringify({version:1,best:this.best,mastered:[...this.mastered]}));}catch{this.storageMessage='No se pudo guardar el progreso. Puedes seguir en esta pestaña.';}}
}
