import { AfterViewInit, Component, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AntCanvasComponent } from './ant-canvas.component';
import { analyzeHighway, AntEngine, DIRECTIONS, initialEngine } from './langtons-ant.model';

@Component({ selector: 'app-langtons-ant-lab', standalone: true, imports: [CommonModule, FormsModule, AntCanvasComponent],
  templateUrl: './langtons-ant-lab.component.html', styleUrl: './langtons-ant-lab.component.css' })
export class LangtonsAntLabComponent implements AfterViewInit, OnDestroy {
  @ViewChild('board') board!: AntCanvasComponent;
  @ViewChild('other') other?: AntCanvasComponent;
  engine = new AntEngine(); baseline = this.engine.clone(); comparison?: AntEngine;
  revision = 0; running = false; speed = 1000; teaching = false; grid = true; follow = true; mode = 'pan';
  preset = 'white'; seed = 42; ruleInput = 'RL'; error = ''; message = ''; target: number | null = null;
  colors = ['#ffffff', '#17171c', '#e8643a', '#4a9eff', '#a8e6a0', '#d4a843', '#9863c4', '#ff8cb5', '#359b8c', '#8c6839', '#d65464', '#57704b'];
  directions = DIRECTIONS; comparisonPreset = 'single'; differences = false; count = 2; selectedAnt = 0;
  editX = 0; editY = 0; editD = 0; paintValue = 1;
  analysis: ReturnType<typeof analyzeHighway> = null;
  phase = 0; private phaseTime = 0; private teachingState?: AntEngine;
  private frame = 0; private last = 0; private credit = 0; private lastPublish = 0;
  private discovery = false;
  private paintState = 1;
  constructor(private zone: NgZone) {}
  ngAfterViewInit(): void { this.zone.runOutsideAngular(() => { this.frame = requestAnimationFrame(t => this.tick(t)); }); }
  ngOnDestroy(): void { cancelAnimationFrame(this.frame); }
  get ant() { return this.engine.ants[this.selectedAnt] || this.engine.ants[0]; }
  get activeAnt() { return this.engine.ants[this.engine.steps % this.engine.ants.length]; }
  get instruction(): string {
    const e = this.teachingState || this.engine, a = e.ants[e.steps % e.ants.length], s = e.get(a.x, a.y);
    const name = e.rule === 'RL' ? s === 0 ? 'Blanca' : 'Negra' : `Estado ${s}`;
    const next = e.rule === 'RL' ? s === 0 ? 'negra' : 'blanca' : `estado ${(s + 1) % e.rule.length}`;
    return `${name} → ${e.rule[s] === 'R' ? 'derecha' : 'izquierda'} → ${next} → avanzar`;
  }
  get dimensions(): string { const b = this.engine.bounds; return `${b[1] - b[0] + 1} × ${b[3] - b[2] + 1}`; }
  get distance(): number { return Math.hypot(this.engine.ants[0].x, this.engine.ants[0].y); }
  get blackCount(): number { let n = 0; for (const s of this.engine.cells.values()) if (s === 1) n++; return n; }
  private publish(): void { this.zone.run(() => { this.revision++; }); }
  private tick(t: number): void {
    const dt = Math.min(100, this.last ? t - this.last : 0); this.last = t;
    if (this.running) {
      if (this.teaching) {
        if (t - this.phaseTime >= 500) { this.phaseTime = t; this.zone.run(() => this.teachStep()); }
      } else {
        this.credit += dt * this.speed / 1000;
        const deadline = performance.now() + 7; let processed = 0;
        while (this.credit >= 1 && performance.now() < deadline && processed < 6000) {
          if (this.target !== null && this.engine.steps >= this.target) {
            this.zone.run(() => {
              if (this.discovery) { this.discovery = false; this.target = null; this.speed = 80; this.message = 'Paso 9.800: observa ahora la transición. La velocidad ha bajado a 80 pasos/s.'; }
              else this.pause();
            }); break;
          }
          this.engine.step(); this.comparison?.step(); this.credit--; processed++;
        }
      }
      if (t - this.lastPublish > 45) { this.lastPublish = t; this.publish(); }
    }
    this.frame = requestAnimationFrame(now => this.tick(now));
  }
  toggle(): void { if (this.running) this.pause(); else { this.running = true; this.credit = 0; this.phaseTime = performance.now(); } }
  pause(): void { this.running = false; this.target = null; this.discovery = false; this.credit = 0; this.revision++; }
  advance(): void { this.pause(); this.analysis = null; if (this.teaching) this.teachStep(); else { this.engine.step(); this.comparison?.step(); this.revision++; } }
  back(): void { this.pause(); this.phase = 0; this.teachingState = undefined; this.analysis = null; if (this.engine.back()) this.comparison?.back(); this.revision++; }
  batch(n: number): void { this.pause(); this.teaching = false; this.phase = 0; this.teachingState = undefined; this.analysis = null; this.target = this.engine.steps + n; this.speed = Math.max(20000, this.speed); this.running = true; }
  reset(): void { this.pause(); this.engine = this.baseline.clone(); this.engine.begin(); this.comparison = undefined; this.phase = 0; this.teachingState = undefined; this.analysis = null; this.selectedAnt = 0; this.revision++; }
  load(preset = this.preset): void {
    this.pause(); this.engine = initialEngine(preset, this.seed, this.engine.rule); this.baseline = this.engine.clone();
    this.preset = preset; this.comparison = undefined; this.selectedAnt = 0; this.analysis = null; this.phase = 0; this.teachingState = undefined; this.message = 'Nuevo experimento, contador e historial en cero.'; this.revision++; this.board?.center();
  }
  classic(): void { this.ruleInput = 'RL'; this.engine = new AntEngine(); this.load('white'); }
  discover(): void { this.classic(); this.teaching = false; this.follow = false; this.board.follow = false; this.board.zoom = 5; this.board.cx = 0; this.board.cy = 0; this.batch(9800); this.discovery = true; this.message = 'Calculando los primeros 9.800 pasos; después continuaremos despacio.'; }
  setTeaching(): void { this.pause(); this.phase = 0; this.teachingState = undefined; }
  teachStep(): void {
    if (this.phase === 0) this.teachingState = this.engine.clone();
    this.phase++;
    if (this.phase === 5) { this.engine.step(); this.comparison?.step(); this.phase = 0; this.teachingState = undefined; }
    this.revision++;
  }
  private edited(): void {
    this.pause(); this.engine.begin(); this.baseline = this.engine.clone(); this.comparison = undefined; this.analysis = null;
    this.phase = 0; this.teachingState = undefined; this.revision++; this.message = 'Edición aplicada como condición inicial: pasos, visitas e historial reiniciados.';
  }
  edit(p: { x: number; y: number; first: boolean }): void {
    if (this.mode === 'ant') { this.ant.x = p.x; this.ant.y = p.y; }
    else if (this.mode === 'paint') { if (p.first) this.paintState = this.engine.get(p.x, p.y) === this.paintValue ? 0 : this.paintValue; this.engine.put(p.x, p.y, this.paintState); }
    else return;
    this.edited();
  }
  place(): void {
    if (![this.editX, this.editY, this.editD].every(Number.isSafeInteger) || Math.abs(this.editX) > 1000000 || Math.abs(this.editY) > 1000000 || this.editD < 0 || this.editD > 3) { this.message = 'Coordenadas enteras entre −1.000.000 y 1.000.000.'; return; }
    this.ant.x = this.editX; this.ant.y = this.editY; this.ant.d = this.editD; this.edited(); this.board.center();
  }
  paintCell(): void {
    if (![this.editX, this.editY].every(Number.isSafeInteger) || Math.abs(this.editX) > 1000000 || Math.abs(this.editY) > 1000000) return;
    this.engine.put(this.editX, this.editY, this.engine.get(this.editX, this.editY) === this.paintValue ? 0 : this.paintValue); this.edited();
  }
  applyRule(): void {
    const rule = this.ruleInput.trim().toUpperCase();
    if (!/^[RL]{2,12}$/.test(rule)) { this.error = 'Introduce entre 2 y 12 letras R o L, sin espacios interiores.'; return; }
    this.error = ''; this.ruleInput = rule; this.engine = new AntEngine(rule); this.paintValue = 1; this.load('white');
  }
  changeTurn(index: number, turn: string): void { this.ruleInput = this.engine.rule.slice(0, index) + turn + this.engine.rule.slice(index + 1); this.applyRule(); }
  compare(): void {
    this.pause(); this.engine = this.baseline.clone(); this.engine.begin(); this.comparison = initialEngine(this.comparisonPreset, this.seed, this.engine.rule);
    this.analysis = null; this.phase = 0; this.teachingState = undefined; this.revision++; this.message = 'A: tu condición inicial. B: preset independiente. Ambos avanzan un movimiento por paso.';
  }
  multi(preset: string): void {
    this.classic(); this.engine = initialEngine(preset === 'random' ? 'random' : 'white', this.seed, 'RL', preset === 'four' ? 4 : this.count);
    if (preset === 'opposite') this.engine.ants.forEach((a, i) => a.d = i % 2 ? 2 : 0);
    if (preset === 'four') this.engine.ants = [{ x: -6, y: 0, d: 1 }, { x: 6, y: 0, d: 3 }, { x: 0, y: -6, d: 0 }, { x: 0, y: 6, d: 2 }];
    this.edited(); this.board.fit();
  }
  analyze(): void { this.pause(); this.phase = 0; this.teachingState = undefined; this.analysis = analyzeHighway(this.engine); this.message = this.analysis ? '' : 'El análisis de 104 pasos se aplica a una sola hormiga con regla RL.'; }
  get patchView(): string {
    if (!this.analysis) return '0 0 1 1'; const ps = this.analysis.patches;
    const xs = ps.map(p => p.x), ys = ps.map(p => -p.y);
    return `${Math.min(...xs) - 1} ${Math.min(...ys) - 1} ${Math.max(...xs) - Math.min(...xs) + 3} ${Math.max(...ys) - Math.min(...ys) + 3}`;
  }
  prediction(): void {
    this.pause(); const e = this.engine.clone(), positions: string[] = [];
    for (let i = 0; i < 5; i++) { e.step(); positions.push(`(${e.ants[0].x}, ${e.ants[0].y})`); }
    this.message = `Próximas cinco posiciones de la hormiga 1: ${positions.join(' → ')}`;
  }
}
