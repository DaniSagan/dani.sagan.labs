import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { gamma } from '../../shared/math/gamma';

@Component({
  selector: 'app-gamma-explorer', standalone: true, imports: [CommonModule, FormsModule],
  templateUrl: './gamma-explorer.component.html', styleUrl: './gamma-explorer.component.css'
})
export class GammaExplorerComponent {
  input: number | null = 0.5; evaluated = 0.5; value: number | null = null; error = '';
  cursor = 0.5; cursorValue: number | null = null; cursorError = ''; logarithmic = false;
  paths: string[] = []; readonly poles = [-4, -3, -2, -1, 0];
  readonly xTicks = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6];
  readonly yTicks = [-1, -0.5, 0, 0.5, 1];
  readonly factorialPoints = [1, 2, 3, 4, 5, 6].map(x => ({ x, value: gamma(x) }));
  constructor() { this.calculate(); this.plot(); this.updateCursor(); }
  get bound(): number { return this.logarithmic ? 3 : 10; }
  x(value: number): number { return 65 + (value + 5) * 560 / 11; }
  transform(value: number): number { return this.logarithmic ? Math.sign(value) * Math.log10(1 + Math.abs(value)) : value; }
  y(value: number): number { return 180 - 135 * this.transform(value) / this.bound; }
  visible(value: number | null): boolean { return value !== null && Math.abs(this.transform(value)) <= this.bound; }
  format(value: number): string { return value.toPrecision(10); }
  calculate(): void {
    this.value = null; this.error = '';
    try {
      if (this.input === null) throw new Error('Introduce un valor de x.');
      this.value = gamma(this.input); this.evaluated = this.input;
    } catch (error) { this.error = (error as Error).message; }
  }
  example(x: number): void { this.input = x; this.calculate(); if (x >= -5 && x <= 6) { this.cursor = x; this.updateCursor(); } }
  updateCursor(): void {
    this.cursorValue = null; this.cursorError = '';
    try { this.cursorValue = gamma(this.cursor); } catch (error) { this.cursorError = (error as Error).message; }
  }
  plot(): void {
    this.paths = [];
    // Separate intervals at every pole; never connect the two sides of an asymptote.
    for (const [left, right] of [[-5, -4], [-4, -3], [-3, -2], [-2, -1], [-1, 0], [0, 6]]) {
      let path = '';
      for (let i = 1; i < 600; i++) {
        const x = left + (right - left) * i / 600;
        const value = gamma(x);
        if (!this.visible(value)) { if (path) this.paths.push(path); path = ''; continue; }
        path += `${path ? 'L' : 'M'}${this.x(x)},${this.y(value)} `;
      }
      if (path) this.paths.push(path);
    }
  }
}
