import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { avalancheTail, SandpileExperiment } from '../../shared/math/sandpile';
import { SandpileGridComponent } from './sandpile-grid.component';

@Component({
  selector: 'app-sandpile-avalanches', standalone: true, imports: [CommonModule, FormsModule, SandpileGridComponent],
  templateUrl: './sandpile-avalanches.component.html', styleUrl: './sandpile-widgets.css'
})
export class SandpileAvalanchesComponent implements OnDestroy {
  size = 15; seed = 42; warmupFactor = 20; batch = 500;
  experiment = new SandpileExperiment(this.size, this.seed, this.warmupFactor * this.size * this.size);
  playing = false; target = 0; revision = 0;
  tail: { size: number; probability: number }[] = [];
  tailPath = ''; activityPath = ''; maxLog = 1;
  positive = 0; maximum = 0; meanSize = 0;
  readonly probabilityTicks = [0, -1, -2, -3, -4];
  private frame = 0;
  get samples() { return this.experiment.samples; }
  get last() { return this.samples[this.samples.length - 1]; }
  get recent() { return this.samples.slice(-10).reverse(); }
  get sizeTicks(): number[] { return Array.from({ length: Math.floor(this.maxLog) + 1 }, (_, i) => i); }
  reset(): void {
    this.pause(); this.experiment = new SandpileExperiment(this.size, this.seed, this.warmupFactor * this.size * this.size);
    this.target = 0; this.refresh();
  }
  start(): void {
    if (this.playing) return;
    if (this.samples.length >= this.target) this.target = Math.min(10000, this.samples.length + this.batch);
    if (this.samples.length >= this.target) return;
    this.playing = true;
    const tick = () => {
      this.experiment.advance(this.target, 1000); this.refresh();
      if (this.samples.length >= this.target) this.playing = false;
      else this.frame = requestAnimationFrame(tick);
    };
    this.frame = requestAnimationFrame(tick);
  }
  refresh(): void {
    this.revision++;
    this.tail = avalancheTail(this.samples);
    this.positive = this.samples.filter(s => s.size > 0).length;
    this.maximum = this.samples.reduce((max, s) => Math.max(max, s.size), 0);
    this.meanSize = this.samples.length ? this.samples.reduce((sum, s) => sum + s.size, 0) / this.samples.length : 0;
    this.maxLog = Math.max(1, Math.ceil(Math.log10(Math.max(1, this.maximum))));
    this.tailPath = this.tail.map((p, i) => `${i ? 'L' : 'M'}${60 + 680 * Math.log10(p.size) / this.maxLog},${35 - 60 * Math.log10(p.probability)}`).join(' ');
    const recent = this.samples.slice(-150), max = Math.max(1, ...recent.map(s => s.size));
    this.activityPath = recent.map((s, i) => `M${60 + 680 * i / Math.max(1, recent.length - 1)},170V${170 - 140 * s.size / max}`).join(' ');
  }
  pause(): void { cancelAnimationFrame(this.frame); this.playing = false; }
  exportCsv(): void {
    const csv = ['seed,side,warmup,addition,topplings,area,lost,density', ...this.samples.map(s => `${this.seed},${this.size},${this.experiment.warmup},${s.addition},${s.size},${s.area},${s.lost},${s.density}`)].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = 'avalanchas-pila-abeliana.csv'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  ngOnDestroy(): void { this.pause(); }
}
