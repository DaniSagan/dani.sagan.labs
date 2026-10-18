import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-complex-logarithm-branches-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './complex-logarithm-branches-article.component.html', styleUrls: ['../../shared/learning-article.css', './complex-logarithm-branches-article.component.css'] })
export class ComplexLogarithmBranchesArticleComponent {
  static readonly title = "Logaritmo complejo, ramas y cortes";
  static readonly route = 'complex-logarithm-branches';
  n = 0;
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
    rows.push(['Argumento continuo',t+2*Math.PI*n],['Valor principal del argumento',Math.atan2(Math.sin(t),Math.cos(t))],['Factor exp(i·argumento): parte real',Math.cos(t)],['Parte imaginaria',Math.sin(t)]);for(let i=0;i<=100;i++){const a=2*Math.PI*i/100;points.push([a,t+a]);}note='La altura de la recta es un argumento continuo a lo largo de un camino. Tras una vuelta, el punto complejo se repite y el argumento ha aumentado 2π.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 0; this.t = 1; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Seguir el argumento sin plegarlo", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
