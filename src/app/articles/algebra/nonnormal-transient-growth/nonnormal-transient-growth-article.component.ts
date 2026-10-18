import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-nonnormal-transient-growth-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './nonnormal-transient-growth-article.component.html', styleUrls: ['../../shared/learning-article.css', './nonnormal-transient-growth-article.component.css'] })
export class NonnormalTransientGrowthArticleComponent {
  static readonly title = "Matrices normales y crecimiento transitorio";
  static readonly route = 'nonnormal-transient-growth';
  n = 8;
  t = 1;
  result = this.calculate();
  // concept-links:start
  readonly conceptLinks: readonly TextLink[] = [{"term":"autovalores","route":"/articles/matrix-diagonalization"}];
  // concept-links:end

  calculate(): { rows: [string, number | string][]; points: [number, number][]; note: string } {
    const n = this.n, t = this.t;
    const rows: [string, number | string][] = [];
    const points: [number, number][] = [];
    let note = '';
    rows.push(['Norma del estado en t',Math.exp(-t)*Math.hypot(n*t,1)],['Norma inicial',1],['Autovalores','−1, −1']);for(let k=0;k<=150;k++){const x=6*k/150;points.push([x,Math.exp(-x)*Math.hypot(n*x,1)]);}note='Se sigue el estado inicial (0,1), no la norma máxima sobre todos los estados iniciales. Una curva por encima de uno demuestra amplificación transitoria para ese estado.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 8; this.t = 1; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Amplificación con autovalores fijos", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
