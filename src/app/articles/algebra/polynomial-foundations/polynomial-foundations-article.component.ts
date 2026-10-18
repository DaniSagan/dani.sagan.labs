import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';

@Component({
  selector: 'app-polynomial-foundations-article', standalone: true,
  imports: [...LEARNING_IMPORTS],
  templateUrl: './polynomial-foundations-article.component.html',
  styleUrls: ['../../shared/learning-article.css', './polynomial-foundations-article.component.css'],
})
export class PolynomialFoundationsArticleComponent {
  static readonly title = 'Polinomios desde cero: grado, coeficientes y raíces';
  static readonly route = 'polynomial-foundations';
  coefficients = [-6, 11, -6, 1]; // Increasing powers, including missing terms.
  r = 1;
  s = -1;
  multiplicity = 2;
  readonly powers = [0, 1, 2, 3];
  get degree(): number | null {
    for (let i = this.coefficients.length - 1; i >= 0; i--) if (this.coefficients[i] !== 0) return i;
    return null;
  }
  get leading(): number | null { return this.degree === null ? null : this.coefficients[this.degree]; }
  get monic(): boolean { return this.leading === 1; }
  get degreeText(): string { return this.degree === null ? 'Sin grado finito (polinomio cero)' : String(this.degree); }
  get expression(): string {
    const terms: string[] = [];
    for (let i = this.coefficients.length - 1; i >= 0; i--) {
      const a = this.coefficients[i];
      if (a === 0) continue;
      const coefficient = Math.abs(a) === 1 && i > 0 ? '' : String(Math.abs(a));
      const power = i === 0 ? '' : i === 1 ? 'x' : 'x^{' + i + '}';
      terms.push((a < 0 ? '-' : terms.length ? '+' : '') + coefficient + power);
    }
    return terms.join('') || '0';
  }
  evaluate(x: number): number { return this.coefficients.reduceRight((value, a) => value * x + a, 0); }
  factoredValue(x: number): number { return (x - this.r) ** this.multiplicity * (x - this.s); }
  get actualMultiplicity(): number { return this.multiplicity + (this.r === this.s ? 1 : 0); }
  get series(): PlotSeries[] {
    return [{ label: 'P(x)', points: Array.from({ length: 161 }, (_, i) => { const x = -4 + i / 20; return [x, this.evaluate(x)]; }) }];
  }
  get rootSeries(): PlotSeries[] {
    return [{ label: '(x − r)ᵐ(x − s)', points: Array.from({ length: 161 }, (_, i) => { const x = -4 + i / 20; return [x, this.factoredValue(x)]; }) }];
  }
  reset(): void { this.coefficients = [-6, 11, -6, 1]; this.r = 1; this.s = -1; this.multiplicity = 2; }
}
