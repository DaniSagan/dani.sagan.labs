import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  monochromaticTriangles,
  RamseyTriangle,
  ramseyTriples,
} from '../../shared/math/ramsey';
import { RamseyGraphComponent } from './ramsey-graph.component';

@Component({
  selector: 'app-ramsey-census',
  standalone: true,
  imports: [CommonModule, FormsModule, RamseyGraphComponent],
  templateUrl: './ramsey-census.component.html',
  styleUrl: './ramsey-widgets.css',
})
export class RamseyCensusComponent implements OnDestroy {
  n = 6;
  processed = 0;
  running = false;
  counts = Array(21).fill(0) as number[];
  examples: (number | undefined)[] = Array(21).fill(undefined);
  selected = -1;
  selectedMask = 0;
  bins: {
    count: number;
    frequency: number;
    x: number;
    y: number;
    height: number;
  }[] = [];
  private triples = ramseyTriples(6);
  private timer?: ReturnType<typeof setTimeout>;
  get total(): number {
    return 2 ** ((this.n * (this.n - 1)) / 2);
  }
  get complete(): boolean {
    return this.processed === this.total;
  }
  get maximum(): number {
    return Math.max(1, ...this.counts);
  }
  get minimum(): number {
    return this.counts.findIndex((c) => c > 0);
  }
  get mean(): number {
    return this.processed
      ? this.counts.reduce((sum, c, i) => sum + c * i, 0) / this.processed
      : 0;
  }
  get selectedTriangles() {
    return monochromaticTriangles(this.n, this.selectedMask);
  }
  get firstTriangle(): RamseyTriangle | undefined {
    return this.selectedTriangles[0];
  }
  reset(): void {
    this.pause();
    this.processed = 0;
    this.selected = -1;
    this.selectedMask = 0;
    this.triples = ramseyTriples(this.n);
    this.counts = Array(this.triples.length + 1).fill(0);
    this.examples = Array(this.counts.length).fill(undefined);
    this.bins = [];
  }
  start(): void {
    if (this.running || this.complete) return;
    this.running = true;
    this.schedule();
  }
  private schedule(): void {
    this.timer = setTimeout(() => this.batch(), 0);
  }
  private batch(): void {
    const end = Math.min(this.processed + 512, this.total);
    for (; this.processed < end; this.processed++) {
      let count = 0;
      for (const t of this.triples) {
        const bits = this.processed & t.bits;
        if (bits === 0 || bits === t.bits) count++;
      }
      this.counts[count]++;
      if (this.examples[count] === undefined)
        this.examples[count] = this.processed;
    }
    const width = 560 / this.counts.length;
    this.bins = this.counts.map((frequency, count) => ({
      count,
      frequency,
      x: 60 + count * width,
      y: 230 - (190 * frequency) / this.maximum,
      height: (190 * frequency) / this.maximum,
    }));
    if (this.complete) {
      this.running = false;
      this.select(this.minimum);
    } else if (this.running) this.schedule();
  }
  pause(): void {
    clearTimeout(this.timer);
    this.running = false;
  }
  select(count: number): void {
    const mask = this.examples[count];
    if (mask === undefined) return;
    this.selected = count;
    this.selectedMask = mask;
  }
  ngOnDestroy(): void {
    this.pause();
  }
}
