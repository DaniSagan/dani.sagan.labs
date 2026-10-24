import { ContentConnectionsComponent } from '../../shared/content/content-connections/content-connections.component';
import { Component, ElementRef, inject, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { encode, goalDistances, HanoiMove, legalMove, nextMove, topDisk } from './hanoi.model';

@Component({
  selector: 'app-towers-of-hanoi', standalone: true, imports: [RouterLink, ContentConnectionsComponent],
  templateUrl: './towers-of-hanoi.component.html', styleUrl: './towers-of-hanoi.component.css'
})
export class TowersOfHanoiComponent implements OnDestroy {
  readonly learningConnections = [{route: '/articles/towers-of-hanoi', label: 'Torres de Hanoi: el poder de la recursión', reason: 'Comprende el algoritmo y demuestra por qué el número de movimientos es mínimo.'}];
  private readonly zone = inject(NgZone);
  @ViewChild('stage') private stage?: ElementRef<HTMLElement>;
  animationsEnabled = true;
  animating = false;
  private animation?: Animation;
  count = 4;
  state = [0, 0, 0, 0];
  readonly pegs = ['A', 'B', 'C'];
  readonly counts = [1, 2, 3, 4, 5, 6, 7, 8];
  distances = goalDistances(4);
  history: HanoiMove[] = [];
  selected: number | null = null;
  hint: HanoiMove | null = null;
  running = false;
  speed = 700;
  message = 'Lleva todos los discos de A a C. Selecciona un origen y después un destino.';
  private timer?: ReturnType<typeof setTimeout>;
  get minimum(): number { return 2 ** this.count - 1; }
  get remaining(): number { return this.distances[encode(this.state)]; }
  get won(): boolean { return this.remaining === 0; }
  get progress(): number { return 100 * this.state.filter(p => p === 2).length / this.count; }
  level(disk: number): number { return this.state.slice(disk + 1).filter(p => p === this.state[disk]).length; }
  pegLabel(peg: number): string {
    const disks = this.state.map((p, d) => p === peg ? d + 1 : 0).filter(Boolean);
    return `Torre ${this.pegs[peg]}${peg === 2 ? ', destino' : ''}. Discos de arriba abajo: ${disks.join(', ') || 'ninguno'}. ${this.selected === peg ? 'Seleccionada.' : ''}`;
  }
  choose(peg: number): void {
    if (this.running || this.animating || this.won) return;
    this.hint = null;
    if (this.selected === peg) { this.selected = null; this.message = 'Selección cancelada.'; return; }
    if (this.selected === null) {
      if (topDisk(this.state, peg) < 0) { this.message = 'Esta torre está vacía. Elige una torre con discos.'; return; }
      this.selected = peg; this.message = `Origen ${this.pegs[peg]}. Elige el destino.`; return;
    }
    if (!legalMove(this.state, this.selected, peg)) { this.message = 'Movimiento no permitido: un disco grande no puede descansar sobre uno pequeño. Elige otro destino.'; return; }
    this.move({from: this.selected, to: peg, disk: topDisk(this.state, this.selected)});
  }
  private animateMove(move: HanoiMove): void {
    const stage = this.stage?.nativeElement;
    const disk = stage?.querySelectorAll<HTMLElement>('.disk')[move.disk];
    const rod = stage?.querySelector<HTMLElement>('.rod');
    if (!this.animationsEnabled || !stage || !disk || !rod || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (this.running) this.timer = setTimeout(() => this.step(), this.speed);
      return;
    }
    const fromBottom = 85 + this.level(move.disk) * 25;
    const toBottom = 85 + this.state.filter((peg, d) => peg === move.to && d > move.disk).length * 25;
    // The entire lower face clears the tallest rod before horizontal travel.
    const clearance = stage.getBoundingClientRect().bottom - rod.getBoundingClientRect().top + 12;
    const fromLeft = `${(move.from + .5) * 100 / 3}%`;
    const toLeft = `${(move.to + .5) * 100 / 3}%`;
    this.animating = true;
    this.animation = disk.animate([
      { left: fromLeft, bottom: `${fromBottom}px`, offset: 0 },
      { left: fromLeft, bottom: `${clearance}px`, offset: .32 },
      { left: toLeft, bottom: `${clearance}px`, offset: .68 },
      { left: toLeft, bottom: `${toBottom}px`, offset: 1 }
    ], { duration: this.speed, easing: 'linear' });
    this.animation.onfinish = () => this.zone.run(() => {
      this.animation = undefined;
      this.animating = false;
      if (this.running) this.timer = setTimeout(() => this.step(), 100);
    });
  }
  setAnimations(enabled: boolean): void {
    this.animationsEnabled = enabled;
    if (!enabled && this.animating) {
      this.cancelAnimation();
      if (this.running) this.timer = setTimeout(() => this.step(), this.speed);
    }
  }
  private cancelAnimation(): void {
    if (this.animation) { this.animation.onfinish = null; this.animation.cancel(); }
    this.animation = undefined;
    this.animating = false;
  }
  private move(move: HanoiMove): void {
    this.animateMove(move);
    this.state = this.state.map((peg, disk) => disk === move.disk ? move.to : peg);
    this.history.push(move); this.selected = null; this.hint = null;
    this.message = this.won ? `¡Torre completada en ${this.history.length} movimientos! ${this.history.length === this.minimum ? 'Has logrado el mínimo posible.' : `El mínimo desde el inicio era ${this.minimum}. Prueba otra vez para mejorarlo.`}` : `Disco ${move.disk + 1}: ${this.pegs[move.from]} → ${this.pegs[move.to]}.`;
  }
  showHint(): void {
    if (this.animating) return;
    this.selected = null; this.hint = nextMove(this.state, this.distances);
    if (this.hint) this.message = `Pista: mueve el disco ${this.hint.disk + 1} de ${this.pegs[this.hint.from]} a ${this.pegs[this.hint.to]}. Quedan ${this.remaining} movimientos por el camino más corto desde aquí.`;
  }
  undo(): void {
    if (this.animating) return;
    this.pause(); const move = this.history.pop(); if (!move) return;
    this.animateMove({from: move.to, to: move.from, disk: move.disk});
    this.state = this.state.map((peg, disk) => disk === move.disk ? move.from : peg);
    this.selected = null; this.hint = null; this.message = 'último movimiento deshecho.';
  }
  reset(value = this.count): void {
    this.pause(); this.cancelAnimation(); this.count = value; this.state = Array(value).fill(0); this.distances = goalDistances(value);
    this.history = []; this.selected = null; this.hint = null;
    this.message = 'Nueva partida. Lleva la torre de A a C.';
  }
  toggleAuto(): void { if (this.running) this.pause(); else if (!this.animating && !this.won) { this.running = true; this.selected = null; this.step(); } }
  private step(): void {
    const move = nextMove(this.state, this.distances);
    if (!move) { this.pause(); return; }
    this.move(move);
    if (this.won) this.pause();
  }
  pause(): void { clearTimeout(this.timer); this.running = false; }
  ngOnDestroy(): void { this.pause(); this.cancelAnimation(); }
}
