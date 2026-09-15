import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { lambertW, LAMBERT_BRANCH_POINT } from '../../shared/math/lambert-w';

@Component({
  selector: 'app-lambert-w-explorer', standalone: true, imports: [CommonModule, FormsModule],
  templateUrl: './lambert-w-explorer.component.html', styleUrl: './lambert-w-widgets.css'
})
export class LambertWExplorerComponent {
  input: number | null = -0.2; branch: 0 | -1 = 0; value: number | null = null; evaluated = -0.2; error = '';
  readonly branchPoint = LAMBERT_BRANCH_POINT;
  readonly ticks = [-6, -4, -2, 0, 2];
  readonly xTicks = [-0.25, 0, 0.5, 1, 1.5, 2];
  paths: string[] = [];
  constructor() {
    for (const branch of [0, -1] as const) {
      const points: string[] = [];
      for (let i = 0; i <= 500; i++) {
        const w = branch === 0 ? -1 + 2 * i / 500 : -1 - 5 * i / 500;
        const z = w * Math.exp(w);
        if (z <= 2) points.push(`${points.length ? 'L' : 'M'}${this.x(z)},${this.y(w)}`);
      }
      this.paths.push(points.join(' '));
    }
    this.calculate();
  }
  x(z: number): number { return 60 + (z + 0.4) * 580 / 2.4; }
  y(w: number): number { return 310 - (w + 6) * 35; }
  get visible(): boolean { return this.value !== null && this.evaluated >= -0.4 && this.evaluated <= 2 && this.value >= -6 && this.value <= 2; }
  get check(): number | null { return this.value === null ? null : this.value * Math.exp(this.value); }
  example(z: number): void { this.input = z; this.calculate(); }
  calculate(): void {
    this.error = ''; this.value = null;
    try {
      if (this.input === null) throw new Error('Introduce z.');
      this.value = lambertW(this.input, this.branch); this.evaluated = this.input;
    } catch (error) { this.error = (error as Error).message; }
  }
}
