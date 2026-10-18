import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-function-convergence-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './function-convergence-article.component.html', styleUrls: ['../../shared/learning-article.css', './function-convergence-article.component.css'] })
export class FunctionConvergenceArticleComponent {
  static readonly title = "Convergencia de funciones: puntual, uniforme y dominada";
  static readonly route = 'function-convergence';
  n = 5;
  t = 1;
  result = this.calculate();
  // concept-links:start
  readonly conceptLinks: readonly TextLink[] = [{"term":"supremo","route":"/articles/supremum-real-completeness"}];
  // concept-links:end

  calculate(): { rows: [string, number | string][]; points: [number, number][]; note: string } {
    const n = this.n, t = this.t;
    const rows: [string, number | string][] = [];
    const points: [number, number][] = [];
    let note = '';
    rows.push(['Supremo de x^n en [0,a]',t**n],['Integral en [0,a]',t**(n+1)/(n+1)],['Integral del pico n·1_(0,1/n)',1]);for(let i=0;i<=150;i++){const x=t*i/150;points.push([x,x**n]);} note='El laboratorio compara con cero. Para a=1, el límite puntual toma valor 1 en el extremo y no coincide con la función cero en todo el dominio.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 5; this.t = 1; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "El error máximo y la integral", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
