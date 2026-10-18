import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-circle-inversion-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './circle-inversion-article.component.html', styleUrls: ['../../shared/learning-article.css', './circle-inversion-article.component.css'] })
export class CircleInversionArticleComponent {
  static readonly title = "Inversión respecto de una circunferencia";
  static readonly route = 'circle-inversion';
  n = 1;
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
    const q=n*n/t;rows.push(['Distancia de la imagen',q],['Producto de distancias',t*q],['R²',n*n],['Segunda inversión',n*n/q]);for(let k=1;k<=100;k++){const r=.05*k;points.push([r,n*n/r]);}note='La gráfica relaciona las distancias al centro; no representa un punto imagen en coordenadas cartesianas. El centro no tiene imagen finita.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 1; this.t = 2; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Distancias recíprocas", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
