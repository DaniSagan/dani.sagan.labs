import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { baselFourier, baselPartialSum } from '../../shared/math/basel';

@Component({
  selector: 'app-basel-fourier',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './basel-fourier.component.html',
  styleUrl: './basel-widgets.css'
})
export class BaselFourierComponent {
  n = 5;
  position = 1;
  readonly presets = [1, 5, 20, 80];
  readonly ticks = [{ x: -1, label: '−π' }, { x: -0.5, label: '−π/2' }, { x: 0, label: '0' }, { x: 0.5, label: 'π/2' }, { x: 1, label: 'π' }];
  readonly yTicks = [0, 2, 4, 6, 8, 10];
  readonly targetPath: string;
  approximationPath = '';

  constructor() {
    this.targetPath = this.makePath(x => x * x);
    this.updateHarmonics(this.n);
  }

  get probeX(): number { return this.position * Math.PI; }
  get target(): number { return this.probeX ** 2; }
  get approximation(): number { return baselFourier(this.probeX, this.n); }
  get error(): number { return Math.abs(this.target - this.approximation); }
  get partial(): number { return baselPartialSum(this.n); }
  x(value: number): number { return 62 + (value + Math.PI) / (2 * Math.PI) * 572; }
  y(value: number): number { return 263 - value / 10 * 224; }

  updateHarmonics(value: number): void {
    const n = Number(value);
    if (!Number.isInteger(n) || n < 1 || n > 80) return;
    this.n = n;
    this.approximationPath = this.makePath(x => baselFourier(x, this.n));
  }

  selectPosition(value: number): void {
    if (Number.isFinite(Number(value))) this.position = Math.max(-1, Math.min(1, Number(value)));
  }

  selectFromChart(event: PointerEvent): void {
    const matrix = (event.currentTarget as SVGSVGElement).getScreenCTM();
    if (!matrix) return;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    this.selectPosition((point.x - 62) / 286 - 1);
  }

  private makePath(fn: (x: number) => number): string {
    return Array.from({ length: 641 }, (_, i) => {
      const x = -Math.PI + i / 640 * 2 * Math.PI;
      return `${i ? 'L' : 'M'}${this.x(x)},${this.y(fn(x))}`;
    }).join(' ');
  }
}
