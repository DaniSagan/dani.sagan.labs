import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { evaluateTaylor, functionValue, taylorCoefficients, TaylorFunction } from './taylor.math';

@Component({
  selector: 'app-taylor-explorer', standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './taylor-explorer.component.html', styleUrls: ['./taylor-widgets.css']
})
export class TaylorExplorerComponent {
  kind: TaylorFunction = 'sin';
  center = 0;
  order = 3;
  x = 1;
  readonly xTicks = [-3, -2, -1, 0, 1, 2, 3];
  get coefficients() { return taylorCoefficients(this.kind, this.center, this.order); }
  get actual() { return functionValue(this.kind, this.x); }
  get approximation() { return evaluateTaylor(this.coefficients, this.x - this.center); }
  get error() { return Math.abs(this.actual - this.approximation); }
  readonly yMin = -2;
  get yMax() { return this.kind === 'exp' ? 22 : 2; }
  get yTicks() { return this.kind === 'exp' ? [0, 5, 10, 15, 20] : [-2, -1, 0, 1, 2]; }
  px(x: number) { return (x + 3) * 90; }
  py(y: number) { return 260 * (this.yMax - y) / (this.yMax - this.yMin); }
  path(polynomial: boolean) {
    const coefficients = this.coefficients;
    return Array.from({ length: 361 }, (_, i) => {
      const x = -3 + i / 60;
      const y = polynomial ? evaluateTaylor(coefficients, x - this.center) : functionValue(this.kind, x);
      return `${i === 0 ? 'M' : 'L'}${this.px(x)},${Math.max(-1000000, Math.min(1000000, this.py(y)))}`;
    }).join(' ');
  }
}
