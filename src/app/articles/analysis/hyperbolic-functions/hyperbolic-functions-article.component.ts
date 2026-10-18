import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-hyperbolic-functions-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './hyperbolic-functions-article.component.html', styleUrls: ['../../shared/learning-article.css', './hyperbolic-functions-article.component.css'] })
export class HyperbolicFunctionsArticleComponent {
  static readonly title = "Funciones hiperbólicas e inversas";
  static readonly route = 'hyperbolic-functions';
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
    rows.push(['sinh(x)',Math.sinh(t)],['cosh(x)',Math.cosh(t)],['cosh²−sinh²',Math.cosh(t)**2-Math.sinh(t)**2],['arsinh(sinh(x))',Math.asinh(Math.sinh(t))]);for(let k=0;k<=120;k++){const x=-n+2*n*k/120;points.push([x,Math.tanh(x)]);}note='La gráfica muestra tanh. La tabla contrasta la identidad algebraica y una composición con su inversa real.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 2; this.t = 1; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Identidad e inversión", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
