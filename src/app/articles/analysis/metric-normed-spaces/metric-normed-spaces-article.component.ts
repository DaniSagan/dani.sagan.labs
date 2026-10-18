import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-metric-normed-spaces-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './metric-normed-spaces-article.component.html', styleUrls: ['../../shared/learning-article.css', './metric-normed-spaces-article.component.css'] })
export class MetricNormedSpacesArticleComponent {
  static readonly title = "Espacios métricos, normas y completitud";
  static readonly route = 'metric-normed-spaces';
  n = 5;
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
    const m=2*n; rows.push(['Distancia entre 1/(N+1) y 1/(2N+1)',Math.abs(1/(n+1)-1/(m+1))],['Cota del diámetro de la cola',1/(n+1)],['Norma uniforme de x^p en [0,1]',1],['Norma L² de x^p',1/Math.sqrt(2*t+1)]);for(let i=0;i<=100;i++){const x=i/100;points.push([x,x**t]);} note='La tabla calcula una distancia concreta y una cota válida para toda la cola; muestrear términos por sí solo no demuestra la condición de Cauchy.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 5; this.t = 2; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Colas de una sucesión y normas de funciones", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
