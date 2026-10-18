import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-supremum-real-completeness-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './supremum-real-completeness-article.component.html', styleUrls: ['../../shared/learning-article.css', './supremum-real-completeness-article.component.css'] })
export class SupremumRealCompletenessArticleComponent {
  static readonly title = "Supremo, ínfimo y completitud de los reales";
  static readonly route = 'supremum-real-completeness';
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
    rows.push(['Máximo de los N primeros',t*(1-1/n)],['Supremo de toda la sucesión',t],['Distancia al supremo',t/n]);for(let i=1;i<=n;i++)points.push([i,t*(1-1/i)]);note='Ninguna muestra finita alcanza la cota t, aunque sus máximos se aproximen a ella.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 10; this.t = 1; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Máximos finitos que aproximan un supremo", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
