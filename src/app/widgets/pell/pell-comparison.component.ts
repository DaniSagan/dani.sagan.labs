import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { fundamental, sqrtExpansion } from './pell.math';

@Component({
  selector: 'app-pell-comparison',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './pell-comparison.component.html',
  styleUrls: ['../modular/modular-widgets.css'],
})
export class PellComparisonComponent {
  @Output() choose = new EventEmitter<number>();
  limit = 30;
  order: 'D' | 'period' | 'x' = 'D';
  rows: {
    D: number;
    period: number;
    x: bigint;
    y: bigint;
    digits: number;
    negative: boolean;
  }[] = [];
  constructor() {
    this.update();
  }
  update(): void {
    this.rows = [];
    for (let D = 2; D <= this.limit; D++) {
      const e = sqrtExpansion(BigInt(D));
      if (e.square) {
        continue;
      }
      const p = fundamental(e)!;
      this.rows.push({
        D,
        period: e.period.length,
        ...p,
        digits: p.x.toString().length,
        negative: e.period.length % 2 === 1,
      });
    }
    this.sort();
  }
  sort(): void {
    this.rows.sort((a, b) =>
      this.order === 'x'
        ? a.x < b.x
          ? -1
          : a.x > b.x
            ? 1
            : a.D - b.D
        : this.order === 'period'
          ? a.period - b.period || a.D - b.D
          : a.D - b.D,
    );
  }
}
