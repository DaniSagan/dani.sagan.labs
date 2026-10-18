import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-curve-singularities-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './curve-singularities-article.component.html', styleUrls: ['../../shared/learning-article.css', './curve-singularities-article.component.css'] })
export class CurveSingularitiesArticleComponent {
  static readonly title = "Puntos singulares, cúspides y nodos de curvas";
  static readonly route = 'curve-singularities';
  n = 0;
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
    const x=n===0?t*t:t*t-1,y=n===0?t**3:t*(t*t-1);rows.push(['x(u)',x],['y(u)',y],['Velocidad paramétrica',n===0?Math.hypot(2*t,3*t*t):Math.hypot(2*t,3*t*t-1)]);for(let k=0;k<=160;k++){const u=-1.5+3*k/160;points.push(n===0?[u*u,u**3]:[u*u-1,u*(u*u-1)]);}note='En el nodo el mismo punto puede corresponder a dos parámetros distintos. En la cúspide, la parametrización usada se detiene en u=0.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 0; this.t = 0; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Una parametrización y sus ramas", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    const cx=(xmin+xmax)/2, cy=(ymin+ymax)/2, w=Math.max(xmax-xmin,(ymax-ymin)*624/284)*1.15,h=w*284/624; return {xmin:cx-w/2,xmax:cx+w/2,ymin:cy-h/2,ymax:cy+h/2};
  }
}
