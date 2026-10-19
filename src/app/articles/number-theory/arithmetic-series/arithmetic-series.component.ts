import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';

@Component({
  selector: 'app-arithmetic-series', standalone: true, imports: [...LEARNING_IMPORTS],
  templateUrl: './arithmetic-series.component.html',
  styleUrls: ['../../shared/learning-article.css', './arithmetic-series.component.css'],
})
export class ArithmeticSeriesComponent {
  static readonly title = 'Sumas de progresiones aritméticas: parejas y números triangulares';
  static readonly route = 'arithmetic-series';
  n: number | null = 100;
  pair = 1;
  readonly triangle = Array.from({ length: 30 }, (_, i) => ({ row: Math.floor(i / 6), col: i % 6 }));
  readonly math = {
    hundred: String.raw`S=1+2+\cdots+99+100=50\cdot101=5050`,
    doubled: String.raw`\begin{aligned}S&=1+2+\cdots+(n-1)+n\\S&=n+(n-1)+\cdots+2+1\\2S&=(n+1)+(n+1)+\cdots+(n+1)=n(n+1)\end{aligned}`,
    formula: String.raw`1+2+\cdots+n=\frac{n(n+1)}2\qquad(n\geq1)`,
    progression: String.raw`a_k=a_1+(k-1)d,\qquad S_n=\frac{n(a_1+a_n)}2`,
  };
  get valid(): boolean { return this.n !== null && Number.isInteger(this.n) && this.n >= 1 && this.n <= 200; }
  get count(): number { return this.valid ? this.n! : 0; }
  get pairs(): number { return Math.floor(this.count / 2); }
  get middle(): number | null { return this.count % 2 ? (this.count + 1) / 2 : null; }
  get partner(): number { return this.count + 1 - this.pair; }
  get sum(): number { return this.count * (this.count + 1) / 2; }
  update(): void { this.pair = Math.max(1, Math.min(this.pair, this.pairs || 1)); }
  reset(): void { this.n = 100; this.pair = 1; }
}
