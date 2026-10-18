import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-riemann-sphere-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './riemann-sphere-article.component.html', styleUrls: ['../../shared/learning-article.css', './riemann-sphere-article.component.css'] })
export class RiemannSphereArticleComponent {
  static readonly title = "Esfera de Riemann y proyección estereográfica";
  static readonly route = 'riemann-sphere';
  n = 2;
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
    const q=1+n*n+t*t,X=2*n/q,Y=2*t/q,Z=(n*n+t*t-1)/q;rows.push(['X',X],['Y',Y],['Z',Z],['X²+Y²+Z²',X*X+Y*Y+Z*Z]);for(let k=0;k<=100;k++){const x=-6+12*k/100;points.push([x,(x*x-1)/(1+x*x)]);}note='La gráfica muestra la altura sobre el meridiano real. El polo norte se aproxima al crecer el módulo, pero no se alcanza con coordenadas finitas.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 2; this.t = 0; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Comprobar la esfera con coordenadas", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
