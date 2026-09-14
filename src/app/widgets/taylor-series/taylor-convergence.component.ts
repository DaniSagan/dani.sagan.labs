import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { geometricSums } from './taylor.math';

@Component({
  selector: 'app-taylor-convergence', standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './taylor-convergence.component.html', styleUrls: ['./taylor-widgets.css']
})
export class TaylorConvergenceComponent {
  x = 0.5;
  order = 10;
  get sums() { return geometricSums(this.x, this.order); }
  get target() { return this.x === 1 ? null : 1 / (1 - this.x); }
  get last() { return this.sums[this.order]; }
  get error() { return this.target === null ? null : Math.abs(this.target - this.last); }
  get status() {
    return Math.abs(this.x) < 1 ? 'Converge a 1/(1 − x).' : this.x === 1
      ? 'Diverge: las sumas son n + 1 y la función no está definida.' : this.x === -1
      ? 'Diverge: las sumas alternan entre 1 y 0.' : 'Diverge: los términos no tienden a cero.';
  }
  get scale() { return Math.max(1, Math.abs(this.target ?? 0), ...this.sums.map(Math.abs)); }
  py(value: number) { return 135 - 110 * value / this.scale; }
  px(n: number) { return 65 + 490 * n / Math.max(1, this.order); }
  get points() { return this.sums.map((value, n) => `${this.px(n)},${this.py(value)}`).join(' '); }
}
