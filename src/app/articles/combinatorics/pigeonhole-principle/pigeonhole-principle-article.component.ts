import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-pigeonhole-principle-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './pigeonhole-principle-article.component.html', styleUrls: ['../../shared/learning-article.css', './pigeonhole-principle-article.component.css'] })
export class PigeonholePrincipleArticleComponent {
  static readonly title = "Principio del palomar y argumentos de existencia";
  static readonly route = 'pigeonhole-principle';
  n = 13;
  t = 12;
  result = this.calculate();
  // concept-links:start
  readonly conceptLinks: readonly TextLink[] = [];
  // concept-links:end

  calculate(): { rows: [string, number | string][]; points: [number, number][]; note: string } {
    const n = this.n, t = this.t;
    const rows: [string, number | string][] = [];
    const points: [number, number][] = [];
    let note = '';
    const base=Math.floor(n/t),rest=n%t;for(let k=0;k<t;k++)points.push([k+1,base+(k<rest?1:0)]);rows.push(['Máximo mínimo inevitable',Math.ceil(n/t)],['Cajas con un objeto adicional',rest]);note='Este reparto alcanza la cota del principio. Otros repartos pueden concentrar muchos más objetos en una caja.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 13; this.t = 12; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Un reparto lo más equilibrado posible", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
