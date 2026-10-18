import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-vector-calculus-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './vector-calculus-article.component.html', styleUrls: ['../../shared/learning-article.css', './vector-calculus-article.component.css'] })
export class VectorCalculusArticleComponent {
  static readonly title = "Flujo, divergencia y rotacional de un campo";
  static readonly route = 'vector-calculus';
  n = 1;
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
    rows.push(['Divergencia',2*n],['Rotacional plano',2*t],['Flujo exterior: círculo unidad',2*Math.PI*n],['Circulación antihoraria',2*Math.PI*t]);for(let i=0;i<=100;i++){const a=2*Math.PI*i/100,x=Math.cos(a),y=Math.sin(a);points.push([n*x-t*y,t*x+n*y]);}note='La gráfica recorre los valores del campo sobre el círculo unidad; no es una trayectoria de partículas ni un diagrama de flechas.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 1; this.t = 1; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Separar expansión y circulación", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
