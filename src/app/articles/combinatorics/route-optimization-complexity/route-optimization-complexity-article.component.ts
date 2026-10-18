import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-route-optimization-complexity-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './route-optimization-complexity-article.component.html', styleUrls: ['../../shared/learning-article.css', './route-optimization-complexity-article.component.css'] })
export class RouteOptimizationComplexityArticleComponent {
  static readonly title = "Viajante, cartero chino y complejidad computacional";
  static readonly route = 'route-optimization-complexity';
  n = 6;
  t = 10;
  result = this.calculate();
  // concept-links:start
  readonly conceptLinks: readonly TextLink[] = [];
  // concept-links:end

  calculate(): { rows: [string, number | string][]; points: [number, number][]; note: string } {
    const n = this.n, t = this.t;
    const rows: [string, number | string][] = [];
    const points: [number, number][] = [];
    let note = '';
    let factorial=1;for(let k=1;k<n;k++)factorial*=k;rows.push(['Tours orientados con origen fijo',factorial],['Tours sin distinguir inversos',factorial/2],['Segundos a la tasa elegida',factorial/t]);for(let k=3;k<=n;k++){let f=1;for(let j=1;j<k;j++)f*=j;points.push([k,f]);}note='Es el coste de una enumeración ingenua, no una cota inferior para cualquier algoritmo ni una prueba de P≠NP.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 6; this.t = 10; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "El crecimiento de enumerar tours", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
