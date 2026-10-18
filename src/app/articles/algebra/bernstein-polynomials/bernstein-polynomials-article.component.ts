import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-bernstein-polynomials-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './bernstein-polynomials-article.component.html', styleUrls: ['../../shared/learning-article.css', './bernstein-polynomials-article.component.css'] })
export class BernsteinPolynomialsArticleComponent {
  static readonly title = "Polinomios de Bernstein y aproximación";
  static readonly route = 'bernstein-polynomials';
  n = 5;
  t = 0.5;
  result = this.calculate();
  // concept-links:start
  readonly conceptLinks: readonly TextLink[] = [];
  // concept-links:end

  calculate(): { rows: [string, number | string][]; points: [number, number][]; note: string } {
    const n = this.n, t = this.t;
    const rows: [string, number | string][] = [];
    const points: [number, number][] = [];
    let note = '';
    rows.push(['f(t)=t²',t*t],['Bernstein de t²',t*t+t*(1-t)/n],['Error exacto',t*(1-t)/n],['Cota uniforme',1/(4*n)]);for(let k=0;k<=100;k++){const x=k/100;points.push([x,x*(1-x)/n]);}note='La gráfica muestra el error de aproximar t², calculado con su identidad exacta. El máximo aparece en t=1/2.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 5; this.t = 0.5; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Un error de aproximación exacto", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
