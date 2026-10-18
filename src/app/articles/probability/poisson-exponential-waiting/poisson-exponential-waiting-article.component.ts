import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-poisson-exponential-waiting-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './poisson-exponential-waiting-article.component.html', styleUrls: ['../../shared/learning-article.css', './poisson-exponential-waiting-article.component.css'] })
export class PoissonExponentialWaitingArticleComponent {
  static readonly title = "Poisson, espera exponencial y binomial negativa";
  static readonly route = 'poisson-exponential-waiting';
  n = 2;
  t = 1;
  result = this.calculate();
  // concept-links:start
  readonly conceptLinks: readonly TextLink[] = [];
  // concept-links:end

  calculate(): { rows: [string, number | string][]; points: [number, number][]; note: string } {
    const n = this.n, t = this.t;
    const rows: [string, number | string][] = [];
    const points: [number, number][] = [];
    let note = '';
    const mu=n*t;let pk=Math.exp(-mu),mass=0;for(let k=0;k<=45;k++){if(k)pk*=mu/k;mass+=pk;points.push([k,pk]);}rows.push(['Media del conteo λt',mu],['P(cero eventos)=P(T>t)',Math.exp(-mu)],['Espera media',1/n],['Masa de Poisson representada',mass]);note='La gráfica muestra la masa de Poisson del conteo, no la densidad de la espera. Su cola puede quedar fuera del truncamiento a 45 eventos.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 2; this.t = 1; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Un conteo y su primera espera", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
