import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-pade-krylov-methods-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './pade-krylov-methods-article.component.html', styleUrls: ['../../shared/learning-article.css', './pade-krylov-methods-article.component.css'] })
export class PadeKrylovMethodsArticleComponent {
  static readonly title = "Aproximantes de Padé y subespacios de Krylov";
  static readonly route = 'pade-krylov-methods';
  n = 2;
  t = 0.5;
  result = this.calculate();
  // concept-links:start
  readonly conceptLinks: readonly TextLink[] = [];
  // concept-links:end

  calculate(): { rows: [string, number | string][]; points: [number, number][]; note: string } {
    const n = this.n, t = this.t;
    const rows: [string, number | string][] = [];
    const points: [number, number][] = [];
    let note = '';
    let s=1,a=1;for(let k=1;k<=n;k++){a*=t/k;s+=a;}rows.push(['Exponencial exacta numérica',Math.exp(t)],['Taylor de orden n',s],['Padé [1/1]',(1+t/2)/(1-t/2)]);for(let k=0;k<=100;k++){const x=-1.5+3*k/100;points.push([x,(1+x/2)/(1-x/2)-Math.exp(x)]);}note='La gráfica muestra el error de Padé en un intervalo que evita su polo. El control de orden afecta a Taylor, no al aproximante racional fijo.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 2; this.t = 0.5; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Comparar un polinomio y un cociente", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
