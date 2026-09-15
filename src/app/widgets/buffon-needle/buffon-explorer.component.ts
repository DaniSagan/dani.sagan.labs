import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { estimatePi, needleCrosses, sampleNeedle } from './buffon.math';

@Component({
  selector: 'app-buffon-explorer', standalone: true,
  imports: [CommonModule, FormsModule], templateUrl: './buffon-explorer.component.html',
  styleUrls: ['./buffon-explorer.component.css']
})
export class BuffonExplorerComponent {
  ratio = 1;
  count = 0;
  crosses = 0;
  readonly limit = 1000000;
  readonly lines = [0, 1, 2, 3, 4, 5, 6];
  needles: ReturnType<typeof sampleNeedle>[] = [];
  history: { count: number; frequency: number }[] = [];
  angle = 30;
  distance = 0.2;
  get probability() { return 2 * this.ratio / Math.PI; }
  get estimate() { return estimatePi(this.ratio, this.count, this.crosses); }
  get frequency() { return this.count ? this.crosses / this.count : 0; }
  get sine() { return Math.sin(this.angle * Math.PI / 180); }
  get cosine() { return Math.cos(this.angle * Math.PI / 180); }
  get reaches() { return needleCrosses(this.distance, this.ratio, this.sine); }
  get curve() { return this.history.map((h, i) => `${i ? 'L' : 'M'}${50 + h.count / this.count * 490},${180 - h.frequency * 140}`).join(' '); }
  launch(batch: number) {
    const size = Math.min(batch, this.limit - this.count);
    for (let i = 0; i < size; i++) {
      const needle = sampleNeedle(this.ratio);
      this.count++; if (needle.crosses) { this.crosses++; }
      if (i >= size - 120) { this.needles.push(needle); }
    }
    this.needles = this.needles.slice(-120);
    if (size > 0) { this.history = [...this.history, { count: this.count, frequency: this.frequency }].slice(-100); }
  }
  reset() { this.count = 0; this.crosses = 0; this.needles = []; this.history = []; }
}
