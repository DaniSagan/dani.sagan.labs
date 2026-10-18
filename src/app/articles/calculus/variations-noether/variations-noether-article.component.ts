import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-variations-noether-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './variations-noether-article.component.html', styleUrls: ['../../shared/learning-article.css', './variations-noether-article.component.css'] })
export class VariationsNoetherArticleComponent {
  static readonly title = "Cálculo de variaciones, Euler–Lagrange y Noether";
  static readonly route = 'variations-noether';
  n = 1;
  t = 0.25;
  result = this.calculate();
  // concept-links:start
  readonly conceptLinks: readonly TextLink[] = [];
  // concept-links:end

  calculate(): { rows: [string, number | string][]; points: [number, number][]; note: string } {
    const n = this.n, t = this.t;
    const rows: [string, number | string][] = [];
    const points: [number, number][] = [];
    let note = '';
    rows.push(['Acción exacta',.5+t*t*n*n*Math.PI*Math.PI/4],['Acción de la recta',.5],['Máximo residuo |q″|',Math.abs(t)*n*n*Math.PI*Math.PI]);for(let k=0;k<=160;k++){const x=k/160;points.push([x,x+t*Math.sin(n*Math.PI*x)]);}note='Las curvas son trayectorias de ensayo. Solo ε=0 resuelve q″=0 y conserva el momento en este ejemplo.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 1; this.t = 0.25; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Variar una trayectoria con los extremos fijos", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
