import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sandpile, SandpileRelaxation } from '../../shared/math/sandpile';
import { SAND_COLORS, SandpileGridComponent } from './sandpile-grid.component';

@Component({
  selector: 'app-sandpile-explorer', standalone: true, imports: [CommonModule, FormsModule, SandpileGridComponent],
  templateUrl: './sandpile-explorer.component.html', styleUrl: './sandpile-widgets.css'
})
export class SandpileExplorerComponent implements OnDestroy {
  readonly colors = SAND_COLORS;
  size = 65; grains = 4096; brush = 1; row = 32; column = 32;
  pile = new Sandpile(this.size); revision = 0; injected = 0;
  view: 'height' | 'odometer' = 'height';
  mode: 'slow' | 'fast' | null = null;
  private frame = 0;
  private job?: SandpileRelaxation;
  constructor() { this.reset('central'); }
  get selected(): number { return this.row * this.size + this.column; }
  get allowed(): boolean { return this.injected + this.brush <= 1000000; }
  reset(preset: 'empty' | 'central' | 'wave'): void {
    this.pause(); this.pile = new Sandpile(this.size);
    this.row = this.column = Math.floor(this.size / 2);
    if (preset === 'central') this.pile.add(this.selected, this.grains);
    if (preset === 'wave') { this.pile.heights.fill(3); this.pile.add(this.selected); }
    this.injected = this.pile.mass; this.revision++;
  }
  choose(index: number): void { this.row = Math.floor(index / this.size); this.column = index % this.size; }
  add(): void {
    if (!this.allowed) return;
    this.pause(); this.pile.add(this.selected, this.brush); this.injected += this.brush; this.revision++;
  }
  step(): void { this.pause(); this.pile.round(); this.revision++; }
  run(mode: 'slow' | 'fast'): void {
    this.pause();
    if (this.pile.stable) return;
    this.mode = mode;
    if (mode === 'fast') this.job = new SandpileRelaxation(this.pile);
    let last = 0;
    const tick = (time: number) => {
      if (mode === 'fast') this.job!.process(4000);
      else if (time - last >= 70) { this.pile.round(); last = time; }
      this.revision++;
      if (mode === 'fast' ? this.job!.done : this.pile.stable) { this.mode = null; this.job = undefined; }
      else this.frame = requestAnimationFrame(tick);
    };
    this.frame = requestAnimationFrame(tick);
  }
  pause(): void { cancelAnimationFrame(this.frame); this.mode = null; this.job = undefined; }
  ngOnDestroy(): void { this.pause(); }
}
