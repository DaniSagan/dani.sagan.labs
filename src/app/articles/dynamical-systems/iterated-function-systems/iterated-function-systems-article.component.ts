import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-iterated-function-systems-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './iterated-function-systems-article.component.html', styleUrls: ['../../shared/learning-article.css', './iterated-function-systems-article.component.css'] })
export class IteratedFunctionSystemsArticleComponent {
  static readonly title = "Sistemas de funciones iteradas y juego del caos";
  static readonly route = 'iterated-function-systems';
  n = 150;
  t = 0.33;
  result = this.calculate();
  // concept-links:start
  readonly conceptLinks: readonly TextLink[] = [];
  // concept-links:end

  calculate(): { rows: [string, number | string][]; points: [number, number][]; note: string } {
    const n = this.n, t = this.t;
    const rows: [string, number | string][] = [];
    const points: [number, number][] = [];
    let note = '';
    let state=7,x=.5;for(let k=0;k<n+30;k++){state=(Math.imul(1664525,state)+1013904223)>>>0;x=t*x+((state>>>16)%2?1-t:0);if(k>=30)points.push([x,0]);}rows.push(['Razón de contracción',t],['Puntos muestreados',n],['Hueco entre imágenes de [0,1]',Math.max(0,1-2*t)]);note='La semilla es fija y hace reproducible la muestra. Los puntos se dibujan en el eje real; las líneas que los unen solo indican el orden de muestreo.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 150; this.t = 0.33; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Una órbita reproducible de contracciones", points: this.result.points, kind: 'scatter' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
