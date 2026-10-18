import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-fourier-transform-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './fourier-transform-article.component.html', styleUrls: ['../../shared/learning-article.css', './fourier-transform-article.component.css'] })
export class FourierTransformArticleComponent {
  static readonly title = "Transformada de Fourier: de una señal a sus frecuencias";
  static readonly route = 'fourier-transform';
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
    rows.push(['Transformada en ω',2*n/(n*n+t*t)],['Valor en frecuencia cero',2/n],['Mitad del valor máximo: frecuencia',n]);for(let k=0;k<=160;k++){const w=-8+k/10;points.push([w,2*n/(n*n+w*w)]);}note='Se muestra la fórmula exacta del par e^(−a|t|), no una FFT. El eje horizontal es frecuencia angular.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 1; this.t = 1; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Un par de transformadas calculable", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
