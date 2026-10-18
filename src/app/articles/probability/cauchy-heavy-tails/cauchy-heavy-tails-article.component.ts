import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-cauchy-heavy-tails-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './cauchy-heavy-tails-article.component.html', styleUrls: ['../../shared/learning-article.css', './cauchy-heavy-tails-article.component.css'] })
export class CauchyHeavyTailsArticleComponent {
  static readonly title = "Distribución de Cauchy, colas pesadas y esperanza inexistente";
  static readonly route = 'cauchy-heavy-tails';
  n = 10;
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
    rows.push(['Integral simétrica de x f(x)',0],['Integral truncada de |x| f(x)',t/Math.PI*Math.log1p(n*n/(t*t))],['Probabilidad dentro del corte',2/Math.PI*Math.atan(n/t)]);for(let k=0;k<=120;k++){const x=-10+20*k/120;points.push([x,t/(Math.PI*(x*x+t*t))]);}note='La integral truncada crece aunque la integral con signo siga siendo cero. Ese cero no es la esperanza de Cauchy.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 10; this.t = 1; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Lo que oculta una cancelación simétrica", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
