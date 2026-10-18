import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';

@Component({
  selector: 'app-equation-equivalence-article', standalone: true,
  imports: [...LEARNING_IMPORTS],
  templateUrl: './equation-equivalence-article.component.html',
  styleUrls: ['../../shared/learning-article.css'],
})
export class EquationEquivalenceArticleComponent {
  static readonly title = 'Ecuaciones equivalentes: dominio y soluciones extrañas';
  static readonly route = 'equation-equivalence';
  k = 2;
  get candidates(): number[] {
    const delta = 1 + 4 * this.k;
    if (delta < 0) return [];
    return delta === 0 ? [0.5] : [(1 - Math.sqrt(delta)) / 2, (1 + Math.sqrt(delta)) / 2];
  }
  valid(x: number): boolean {
    return x >= 0 && x + this.k >= 0 && Math.abs(Math.sqrt(x + this.k) - x) < 1e-9;
  }
  get series(): PlotSeries[] {
    return [
      { label: '√(x + k)', points: Array.from({ length: 181 }, (_, i) => { const x = -this.k + i * (6 + this.k) / 180; return [x, Math.sqrt(Math.max(0, x + this.k))]; }) },
      { label: 'x', points: [[-4, -4], [6, 6]] },
    ];
  }
  reset(): void { this.k = 2; }
}
