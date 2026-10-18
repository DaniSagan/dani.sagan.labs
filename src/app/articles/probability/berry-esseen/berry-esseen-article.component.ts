import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-berry-esseen-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './berry-esseen-article.component.html', styleUrls: ['../../shared/learning-article.css', './berry-esseen-article.component.css'] })
export class BerryEsseenArticleComponent {
  static readonly title = "Berry–Esseen y el error de la aproximación normal";
  static readonly route = 'berry-esseen';
  n = 100;
  t = 0.5;
  result = this.calculate();
  // concept-links:start
  readonly conceptLinks: readonly TextLink[] = [{"term":"aproximación normal","route":"/articles/proportion-intervals"}];
  // concept-links:end

  calculate(): { rows: [string, number | string][]; points: [number, number][]; note: string } {
    const n = this.n, t = this.t;
    const rows: [string, number | string][] = [];
    const points: [number, number][] = [];
    let note = '';
    const ratio=((1-t)**2+t*t)/Math.sqrt(t*(1-t));rows.push(['Tercer momento estandarizado',ratio],['Cota con C=1',Math.min(1,ratio/Math.sqrt(n))],['n suficiente para cota ≤0,1',Math.ceil(100*ratio*ratio)]);for(let k=1;k<=n;k++)points.push([k,Math.min(1,ratio/Math.sqrt(k))]);note='La curva muestra una cota teórica, no el error real medido de una aproximación normal. Se supone muestreo independiente e idéntico.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 100; this.t = 0.5; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Cómo la distribución afecta a una garantía", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
