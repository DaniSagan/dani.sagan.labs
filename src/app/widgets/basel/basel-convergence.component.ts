import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BASEL_SUM, baselBounds, baselPartialSum, MAX_BASEL_N } from '../../shared/math/basel';

@Component({
  selector: 'app-basel-convergence',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './basel-convergence.component.html',
  styleUrl: './basel-widgets.css'
})
export class BaselConvergenceComponent {
  readonly limit = BASEL_SUM;
  readonly presets = [1, 10, 100, 1000, MAX_BASEL_N];
  readonly xTicks = [1, 10, 100, 1000, MAX_BASEL_N];
  readonly sumTicks = [0, 0.5, 1, 1.5];
  readonly errorTicks = [
    { value: 1, label: '1' },
    { value: 0.1, label: '10⁻¹' },
    { value: 0.01, label: '10⁻²' },
    { value: 0.001, label: '10⁻³' },
    { value: 0.0001, label: '10⁻⁴' },
  ];
  n = 10;
  inputN: number | null = 10;
  exponent = 1;
  mode: 'sum' | 'error' = 'sum';
  error = '';
  readonly sumPath: string;
  readonly errorPath: string;
  readonly lowerPath: string;
  readonly upperPath: string;

  constructor() {
    const samples = [...new Set(Array.from({ length: 241 }, (_, i) => Math.round(10 ** (i / 60))))];
    const path = (value: (n: number) => number, y: (v: number) => number) =>
      samples.map((n, i) => `${i ? 'L' : 'M'}${this.x(n)},${y(value(n))}`).join(' ');
    this.sumPath = path(baselPartialSum, v => this.sumY(v));
    this.errorPath = path(n => BASEL_SUM - baselPartialSum(n), v => this.errorY(v));
    this.lowerPath = path(n => 1 / (n + 1), v => this.errorY(v));
    this.upperPath = path(n => 1 / n, v => this.errorY(v));
  }

  get partial(): number { return baselPartialSum(this.n); }
  get remainder(): number { return this.limit - this.partial; }
  get bounds(): { lower: number; upper: number } { return baselBounds(this.n); }
  get percentage(): string { return (100 * this.partial / this.limit).toFixed(4); }
  x(n: number): number { return 62 + 143 * Math.log10(n); }
  sumY(value: number): number { return 272 - value / 1.8 * 238; }
  errorY(value: number): number { return 34 - Math.log10(value) / 4.1 * 238; }
  scientific(value: number): string { return value.toExponential(3); }

  selectN(n: number): void {
    if (!Number.isInteger(n) || n < 1 || n > MAX_BASEL_N) return;
    this.n = this.inputN = n;
    this.exponent = Math.log10(n);
    this.error = '';
  }

  fromSlider(value: number): void { this.selectN(Math.round(10 ** Number(value))); }

  fromInput(): void {
    if (this.inputN === null || !Number.isInteger(this.inputN) || this.inputN < 1 || this.inputN > MAX_BASEL_N) {
      this.error = 'Introduce un entero entre 1 y 10 000. Se conserva el último cálculo válido.';
      return;
    }
    this.selectN(this.inputN);
  }

  selectFromChart(event: PointerEvent): void {
    const svg = event.currentTarget as SVGSVGElement;
    const matrix = svg.getScreenCTM();
    if (!matrix) return;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    this.selectN(Math.round(10 ** Math.max(0, Math.min(4, (point.x - 62) / 143))));
  }
}
