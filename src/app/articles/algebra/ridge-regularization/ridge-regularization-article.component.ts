import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-ridge-regularization-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './ridge-regularization-article.component.html', styleUrls: ['../../shared/learning-article.css', './ridge-regularization-article.component.css'] })
export class RidgeRegularizationArticleComponent {
  static readonly title = "Regularización de Tikhonov y regresión ridge";
  static readonly route = 'ridge-regularization';
  n = 0.2;
  t = 0.1;
  result = this.calculate();
  // concept-links:start
  readonly conceptLinks: readonly TextLink[] = [{"term":"valor singular","route":"/articles/singular-values-operator-norms"}];
  // concept-links:end

  calculate(): { rows: [string, number | string][]; points: [number, number][]; note: string } {
    const n = this.n, t = this.t;
    const rows: [string, number | string][] = [];
    const points: [number, number][] = [];
    let note = '';
    rows.push(['Ganancia sin regularizar',1/n],['Ganancia ridge',n/(n*n+t)],['Fracción de señal conservada',n*n/(n*n+t)]);for(let k=1;k<=120;k++){const s=2*k/120;points.push([s,s/(s*s+t)]);}note='La curva muestra el filtro como función del valor singular. No selecciona automáticamente un parámetro óptimo ni estima el ruido.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 0.2; this.t = 0.1; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Filtrar una dirección mal condicionada", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
