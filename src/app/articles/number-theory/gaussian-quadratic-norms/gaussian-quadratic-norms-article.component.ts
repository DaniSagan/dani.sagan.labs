import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-gaussian-quadratic-norms-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './gaussian-quadratic-norms-article.component.html', styleUrls: ['../../shared/learning-article.css', './gaussian-quadratic-norms-article.component.css'] })
export class GaussianQuadraticNormsArticleComponent {
  static readonly title = "Enteros gaussianos, normas algebraicas y unidades cuadráticas";
  static readonly route = 'gaussian-quadratic-norms';
  n = 3;
  t = 2;
  result = this.calculate();
  // concept-links:start
  readonly conceptLinks: readonly TextLink[] = [];
  // concept-links:end

  calculate(): { rows: [string, number | string][]; points: [number, number][]; note: string } {
    const n = this.n, t = this.t;
    const rows: [string, number | string][] = [];
    const points: [number, number][] = [];
    let note = '';
    rows.push(['Norma gaussiana a²+b²',n*n+t*t],['Módulo euclídeo',Math.hypot(n,t)],['Norma en Z[√2]',n*n-2*t*t],['Unidad gaussiana',n*n+t*t===1?'Sí':'No'],['Solución de Pell D=2',n*n-2*t*t===1?'Sí':'No']);note='Se comparan dos anillos distintos usando los mismos coeficientes. Un resultado negativo solo puede aparecer en la norma cuadrática real.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 3; this.t = 2; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Dos productos de conjugados", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
