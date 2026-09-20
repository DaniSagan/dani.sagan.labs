import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { laplaceArea, laplaceKernel } from '../../shared/math/stirling';

@Component({
  selector: 'app-stirling-laplace', standalone: true, imports: [FormsModule],
  templateUrl: './stirling-laplace.component.html', styleUrl: './stirling-widgets.css'
})
export class StirlingLaplaceComponent {
  n = 5;
  exponent = Math.log10(5);
  readonly presets = [1, 5, 20, 100, 1000];
  readonly ticks = [-4, -2, 0, 2, 4, 6];
  readonly heights = [0, 0.5, 1];
  readonly gaussianArea = Math.sqrt(2 * Math.PI);
  readonly gaussianPath: string;
  kernelPath = '';
  constructor() { this.gaussianPath = this.path(u => Math.exp(-u * u / 2)); this.selectN(5); }
  get area(): number { return laplaceArea(this.n); }
  get boundary(): number { return -Math.sqrt(this.n); }
  x(u: number): number { return 66 + (u + 4) / 10 * 564; }
  y(v: number): number { return 270 - 230 * v; }
  selectN(n: number): void {
    if (!Number.isInteger(n) || n < 1 || n > 1000) return;
    this.n = n; this.exponent = Math.log10(n);
    this.kernelPath = this.path(u => laplaceKernel(n, u));
  }
  fromSlider(value: number): void { this.selectN(Math.round(10 ** Number(value))); }
  private path(fn: (u: number) => number): string {
    return Array.from({ length: 501 }, (_, i) => {
      const u = -4 + i / 50;
      return `${i ? 'L' : 'M'}${this.x(u)},${this.y(fn(u))}`;
    }).join(' ');
  }
}
