import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  bisectionSequence,
  newtonIterate,
} from '../../shared/math/newton-raphson';

interface MethodSeries {
  name: string;
  color: string;
  dash: string;
  values: number[];
  path: string;
}
@Component({
  selector: 'app-newton-convergence',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './newton-convergence.component.html',
  styleUrl: './newton-widgets.css',
})
export class NewtonConvergenceComponent {
  multiple = false;
  seed = 3;
  count = 20;
  inspect = 4;
  readonly root = Math.SQRT2;
  readonly ticks = [0, -4, -8, -12, -16];
  readonly abs = Math.abs;
  series: MethodSeries[] = [];
  constructor() {
    this.update();
  }
  update(): void {
    const f = this.multiple
      ? (x: number) => (x - this.root) ** 3
      : (x: number) => x * x - 2;
    const df = this.multiple
      ? (x: number) => 3 * (x - this.root) ** 2
      : (x: number) => 2 * x;
    this.series = [
      this.build(
        'Newton',
        '#82e3cc',
        '',
        newtonIterate(f, df, this.seed, this.count, 0).rows.map((r) => r.x),
      ),
      this.build(
        'Bisección',
        '#f6cc80',
        '8 5',
        bisectionSequence(f, 0, 2, this.count + 1),
      ),
    ];
    if (this.multiple)
      this.series.push(
        this.build(
          'Newton × 3',
          '#c5a6ff',
          '2 4',
          newtonIterate(f, df, this.seed, this.count, 0, 3).rows.map(
            (r) => r.x,
          ),
        ),
      );
    this.inspect = Math.min(this.inspect, this.count);
  }
  build(
    name: string,
    color: string,
    dash: string,
    values: number[],
  ): MethodSeries {
    return {
      name,
      color,
      dash,
      values,
      path: values
        .map(
          (x, n) =>
            `${n ? 'L' : 'M'}${this.sx(n)},${this.sy(Math.abs(x - this.root))}`,
        )
        .join(' '),
    };
  }
  sx(n: number): number {
    return 60 + (680 * n) / this.count;
  }
  sy(error: number): number {
    return 35 + (1 - Math.log10(Math.max(1e-16, error))) * 16;
  }
  value(series: MethodSeries): number {
    return series.values[Math.min(this.inspect, series.values.length - 1)];
  }
  error(series: MethodSeries): string {
    const error = Math.abs(this.value(series) - this.root);
    return error === 0 ? '0 (redondeado)' : error.toExponential(3);
  }
  residual(series: MethodSeries): string {
    const x = this.value(series);
    return Math.abs(
      this.multiple ? (x - this.root) ** 3 : x * x - 2,
    ).toExponential(3);
  }
}
