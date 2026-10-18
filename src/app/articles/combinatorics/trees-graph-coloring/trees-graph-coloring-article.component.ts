import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-trees-graph-coloring-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './trees-graph-coloring-article.component.html', styleUrls: ['../../shared/learning-article.css', './trees-graph-coloring-article.component.css'] })
export class TreesGraphColoringArticleComponent {
  static readonly title = "Árboles, árboles generadores y coloración de grafos";
  static readonly route = 'trees-graph-coloring';
  n = 5;
  t = 0;
  result = this.calculate();
  // concept-links:start
  readonly conceptLinks: readonly TextLink[] = [];
  // concept-links:end

  calculate(): { rows: [string, number | string][]; points: [number, number][]; note: string } {
    const n = this.n, t = this.t;
    const rows: [string, number | string][] = [];
    const points: [number, number][] = [];
    let note = '';
    const edges=t===0?n-1:t===1?n:n*(n-1)/2,chi=t===0?2:t===1?(n%2?3:2):n;rows.push(['Aristas',edges],['Número cromático exacto',chi],['¿Es árbol?',t===0?'Sí':'No'],['Aristas de cualquier árbol generador',n-1]);note='Son tres familias con fórmulas conocidas, no un algoritmo general de coloración óptima. Todas son conexas para los tamaños del control.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 5; this.t = 0; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Comparar familias y colores necesarios", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
