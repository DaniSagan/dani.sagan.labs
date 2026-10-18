import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-generating-concentration-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './generating-concentration-article.component.html', styleUrls: ['../../shared/learning-article.css', './generating-concentration-article.component.css'] })
export class GeneratingConcentrationArticleComponent {
  static readonly title = "Funciones generadoras, características y cotas de concentración";
  static readonly route = 'generating-concentration';
  n = 50;
  t = 0.2;
  result = this.calculate();
  // concept-links:start
  readonly conceptLinks: readonly TextLink[] = [];
  // concept-links:end

  calculate(): { rows: [string, number | string][]; points: [number, number][]; note: string } {
    const n = this.n, t = this.t;
    const rows: [string, number | string][] = [];
    const points: [number, number][] = [];
    let note = '';
    const q=.5+t,D=q*Math.log(2*q)+(1-q)*Math.log(2*(1-q)),v=.25/n;rows.push(['Cantelli',v/(v+t*t)],['Hoeffding unilateral',Math.exp(-2*n*t*t)],['Chernoff optimizado',Math.exp(-n*D)]);for(let k=0;k<=120;k++){const e=.48*k/120;points.push([e,Math.exp(-2*n*e*e)]);}note='Las tres expresiones son cotas superiores para una desviación al menos ε de la media de Bernoulli(1/2). No se supone que alcancen la probabilidad exacta.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 50; this.t = 0.2; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Tres cotas para la misma cola Bernoulli", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
