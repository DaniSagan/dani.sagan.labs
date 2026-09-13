import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { fibonacciSequence, MAX_FIBONACCI_INDEX } from '../../shared/math/fibonacci';

@Component({
  selector: 'app-fibonacci-explorer', standalone: true, imports: [CommonModule, FormsModule],
  templateUrl: './fibonacci-explorer.component.html', styleUrl: './fibonacci-widgets.css'
})
export class FibonacciExplorerComponent {
  input: number | null = 12;
  readonly maximum = MAX_FIBONACCI_INDEX;
  readonly phi = (1 + Math.sqrt(5)) / 2;
  n = 12; result = ''; previous = ''; beforePrevious = ''; error = '';
  rows: { index: number; value: string }[] = [];
  points: { index: number; ratio: number; x: number; y: number }[] = [];
  path = '';
  constructor() { this.calculate(); }
  example(n: number): void { this.input = n; this.calculate(); }
  calculate(): void {
    this.error = ''; this.result = ''; this.rows = []; this.points = []; this.path = '';
    try {
      if (this.input === null) throw new Error('Introduce el índice n.');
      const sequence = fibonacciSequence(this.input);
      this.n = this.input; this.result = sequence[this.n].toString();
      this.previous = this.n >= 1 ? sequence[this.n - 1].toString() : '';
      this.beforePrevious = this.n >= 2 ? sequence[this.n - 2].toString() : '';
      this.rows = sequence.map((value, index) => ({ index, value: value.toString() }));
      const end = Math.min(this.n, 30);
      for (let k = 2; k <= end; k++) {
        const ratio = Number(sequence[k]) / Number(sequence[k - 1]);
        this.points.push({ index: k, ratio, x: 55 + (k - 2) * 590 / Math.max(1, end - 2), y: 250 - (ratio - 1) * 200 });
      }
      this.path = this.points.map((p, i) => `${i ? 'L' : 'M'}${p.x},${p.y}`).join(' ');
    } catch (error) { this.error = (error as Error).message; }
  }
}
