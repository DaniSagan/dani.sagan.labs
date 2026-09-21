import { Component, NgZone, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { binomialMasses, galtonPath, galtonRandom } from '../../shared/math/galton';

interface Ball { id: number; path: number[]; age: number; x: number; y: number; }
@Component({
  selector: 'app-galton-board', standalone: true, imports: [CommonModule, FormsModule],
  templateUrl: './galton-board.component.html', styleUrl: './galton-widgets.css'
})
export class GaltonBoardComponent implements OnDestroy {
  n = 12;
  p = 0.5;
  seed = 2026;
  seedInput: number | null = 2026;
  rate = 12;
  counts: number[] = [];
  masses: number[] = [];
  pegs: { x: number; y: number }[] = [];
  balls: Ball[] = [];
  total = 0;
  selected = 6;
  running = false;
  seedError = '';
  history: { total: number; distance: number }[] = [];
  readonly limit = 100000;
  private random = galtonRandom(this.seed);
  private frame = 0;
  private lastTime = 0;
  private spawnCredit = 0;
  private nextId = 0;
  constructor(private zone: NgZone) { this.reset(); }
  get mean(): number { return this.n * this.p; }
  get sigma(): number { return Math.sqrt(this.n * this.p * (1 - this.p)); }
  get sampleMean(): number { return this.total ? this.counts.reduce((sum, count, k) => sum + count * k, 0) / this.total : 0; }
  get distance(): number { return this.total ? this.masses.reduce((sum, mass, k) => sum + Math.abs(mass - this.counts[k] / this.total), 0) / 2 : 0; }
  get scale(): number { return Math.max(...this.masses, ...this.counts.map(count => this.total ? count / this.total : 0)) * 1.15; }
  get theoreticalPath(): string { return this.masses.map((m, k) => `${k ? 'L' : 'M'}${this.binX(k)},${this.histY(m)}`).join(' '); }
  get convergencePath(): string { return this.history.map((h, i) => `${i ? 'L' : 'M'}${45 + Math.log10(h.total) / 5 * 690},${165 - h.distance * 140}`).join(' '); }
  binX(k: number): number { return 45 + (k + 0.5) * 690 / (this.n + 1); }
  histY(mass: number): number { return 205 - mass / this.scale * 175; }
  x(row: number, k: number): number { return 390 + (k - row / 2) * 640 / (this.n + 1); }
  y(row: number): number { return 35 + row / this.n * 290; }
  trackBall(_index: number, ball: Ball): number { return ball.id; }

  reset(): void {
    this.pause();
    this.random = galtonRandom(this.seed);
    this.counts = Array(this.n + 1).fill(0);
    this.masses = binomialMasses(this.n, this.p);
    this.selected = Math.min(this.n, Math.round(this.mean));
    this.balls = [];
    this.total = 0;
    this.history = [];
    this.spawnCredit = 0;
    this.nextId = 0;
    this.pegs = Array.from({ length: this.n }, (_, row) => Array.from({ length: row + 1 }, (_, k) => ({ x: this.x(row, k), y: this.y(row) }))).flat();
  }
  applySeed(): void {
    if (this.seedInput === null || !Number.isInteger(this.seedInput) || this.seedInput < 0 || this.seedInput > 4294967295) {
      this.seedError = 'Introduce una semilla entera entre 0 y 4 294 967 295.';
      return;
    }
    this.seedError = '';
    this.seed = this.seedInput;
    this.reset();
  }
  toggle(): void {
    if (this.running) { this.pause(); return; }
    if (this.total >= this.limit) return;
    this.running = true;
    this.lastTime = 0;
    this.zone.runOutsideAngular(() => { this.frame = requestAnimationFrame(time => this.tick(time)); });
  }
  pause(): void { this.running = false; cancelAnimationFrame(this.frame); }
  private tick(time: number): void {
    if (!this.running) return;
    if (!this.lastTime) this.lastTime = time;
    const elapsed = time - this.lastTime;
    if (elapsed >= 32) {
      this.lastTime = time;
      this.zone.run(() => this.advance(Math.min(elapsed / 1000, 0.1)));
    }
    if (this.running) this.frame = requestAnimationFrame(t => this.tick(t));
  }
  private advance(dt: number): void {
    this.spawnCredit += dt * this.rate;
    while (this.spawnCredit >= 1 && this.total + this.balls.length < this.limit) {
      this.balls.push({ id: this.nextId++, path: galtonPath(this.n, this.p, this.random), age: 0, x: 390, y: 20 });
      this.spawnCredit--;
    }
    const remaining: Ball[] = [];
    for (const ball of this.balls) {
      ball.age += dt;
      const progress = ball.age / 2.4 * this.n;
      if (progress >= this.n) this.record(ball.path[this.n]);
      else {
        const row = Math.floor(progress);
        const t = progress - row;
        ball.x = this.x(row, ball.path[row]) * (1 - t) + this.x(row + 1, ball.path[row + 1]) * t;
        ball.y = this.y(row) * (1 - t) + this.y(row + 1) * t - Math.sin(Math.PI * t) * 4;
        remaining.push(ball);
      }
    }
    this.balls = remaining;
    if (this.total >= this.limit) this.pause();
  }
  private record(k: number): void {
    this.counts[k]++;
    this.total++;
    if (this.total <= 10 || this.total % Math.max(10, 10 ** Math.floor(Math.log10(this.total) - 1)) === 0) {
      this.history.push({ total: this.total, distance: this.distance });
    }
  }
  batch(amount: number): void {
    this.pause();
    // Settle already generated trajectories before drawing more random numbers.
    for (const ball of this.balls) this.record(ball.path[this.n]);
    this.balls = [];
    const count = Math.min(amount, this.limit - this.total);
    for (let i = 0; i < count; i++) this.record(galtonPath(this.n, this.p, this.random)[this.n]);
  }
  exportCsv(): void {
    const csv = ['seed,n,p,N,k,count,frequency,theoretical', ...this.counts.map((count, k) =>
      `${this.seed},${this.n},${this.p},${this.total},${k},${count},${this.total ? count / this.total : 0},${this.masses[k]}`)].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url; a.download = 'tablero-galton.csv'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  ngOnDestroy(): void { this.pause(); }
}
