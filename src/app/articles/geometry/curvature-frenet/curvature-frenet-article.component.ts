import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-curvature-frenet-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './curvature-frenet-article.component.html', styleUrls: ['../../shared/learning-article.css', './curvature-frenet-article.component.css'] })
export class CurvatureFrenetArticleComponent {
  static readonly title = "Curvatura, círculo osculador y triedro de Frenet";
  static readonly route = 'curvature-frenet';
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
    const q=n*n+t*t;rows.push(['Curvatura',n/q],['Torsión',t/q],['Radio osculador',q/n],['Velocidad para el parámetro u',Math.sqrt(q)]);for(let k=0;k<=120;k++){const u=2*Math.PI*k/120;points.push([n*Math.cos(u),n*Math.sin(u)]);}note='La gráfica es solo la proyección horizontal de la hélice. La tabla incorpora el ascenso espacial, que esa proyección no puede mostrar.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 1; this.t = 1; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Cambiar la geometría de una hélice", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    const cx=(xmin+xmax)/2, cy=(ymin+ymax)/2, w=Math.max(xmax-xmin,(ymax-ymin)*624/284)*1.15,h=w*284/624; return {xmin:cx-w/2,xmax:cx+w/2,ymin:cy-h/2,ymax:cy+h/2};
  }
}
