import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-infinite-descent-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './infinite-descent-article.component.html', styleUrls: ['../../shared/learning-article.css', './infinite-descent-article.component.css'] })
export class InfiniteDescentArticleComponent {
  static readonly title = "Descenso infinito y principio del buen orden";
  static readonly route = 'infinite-descent';
  n = 20;
  t = 2;
  result = this.calculate();
  // concept-links:start
  readonly conceptLinks: readonly TextLink[] = [{"term":"Cuadrado","route":"/articles/square"}];
  // concept-links:end

  calculate(): { rows: [string, number | string][]; points: [number, number][]; note: string } {
    const n = this.n, t = this.t;
    const rows: [string, number | string][] = [];
    const points: [number, number][] = [];
    let note = '';
    let count=0;for(let b=1;b<=n;b++){const a=Math.round(Math.sqrt(t)*b);if(a*a===t*b*b)count++;points.push([b,Math.abs(a*a-t*b*b)]);}rows.push(['Soluciones positivas dentro de la cota',count],['D cuadrado perfecto',Number.isInteger(Math.sqrt(t))?'Sí':'No']);note='No hallar soluciones hasta una cota no prueba imposibilidad. Para D no cuadrado, el argumento general debe usar una demostración aritmética, no esta búsqueda.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 20; this.t = 2; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "La búsqueda finita no sustituye al descenso", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
