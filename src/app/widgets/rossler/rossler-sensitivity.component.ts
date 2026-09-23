import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ROSSLER_DEFAULTS, rosslerSeparation } from '../../shared/math/rossler';

@Component({
  selector: 'app-rossler-sensitivity',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rossler-sensitivity.component.html',
  styleUrl: './rossler-widgets.css',
})
export class RosslerSensitivityComponent implements OnChanges {
  @Input() c = 5.7;
  exponent = -6;
  h = 0.02;
  cursor = 90;
  values: { t: number; distance: number }[] = [];
  path = '';
  error = '';
  readonly ticks = [-12, -9, -6, -3, 0, 2];
  get epsilon(): number {
    return 10 ** this.exponent;
  }
  get current(): { t: number; distance: number } | undefined {
    return this.values[
      Math.min(this.values.length - 1, Math.round(this.cursor / (10 * this.h)))
    ];
  }
  tickY(exponent: number): number {
    return this.y(10 ** exponent);
  }
  get logGrowth(): number {
    return this.current && this.current.t > 0
      ? Math.log(Math.max(this.current.distance, 1e-300) / this.epsilon) /
          this.current.t
      : 0;
  }
  ngOnChanges(): void {
    this.compute();
  }
  y(distance: number): number {
    return (
      230 -
      ((Math.log10(Math.max(1e-12, Math.min(100, distance))) + 12) / 14) * 200
    );
  }
  compute(): void {
    this.error = '';
    try {
      this.values = rosslerSeparation(
        { ...ROSSLER_DEFAULTS, c: this.c },
        this.epsilon,
        180,
        this.h,
      );
      this.path = this.values
        .map(
          (p, i) =>
            `${i ? 'L' : 'M'}${60 + (p.t / 180) * 550},${this.y(p.distance)}`,
        )
        .join(' ');
    } catch (error) {
      this.values = [];
      this.path = '';
      this.error = (error as Error).message;
    }
  }
}
