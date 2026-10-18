import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-l-systems-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './l-systems-article.component.html', styleUrls: ['../../shared/learning-article.css', './l-systems-article.component.css'] })
export class LSystemsArticleComponent {
  static readonly title = "Sistemas-L y gramáticas de reescritura";
  static readonly route = 'l-systems';
  n = 2;
  t = 60;
  result = this.calculate();
  // concept-links:start
  readonly conceptLinks: readonly TextLink[] = [];
  // concept-links:end

  calculate(): { rows: [string, number | string][]; points: [number, number][]; note: string } {
    const n = this.n, t = this.t;
    const rows: [string, number | string][] = [];
    const points: [number, number][] = [];
    let note = '';
    let word='F';for(let k=0;k<n;k++)word=word.replace(/F/g,'F+F--F+F');let x=0,y=0,a=0,count=0;const step=3**(-n);points.push([x,y]);for(const c of word){if(c==='F'){x+=step*Math.cos(a);y+=step*Math.sin(a);points.push([x,y]);count++;}else a+=(c==='+'?1:-1)*t*Math.PI/180;}rows.push(['Símbolos en la palabra',word.length],['Segmentos',count],['Longitud poligonal',count*step]);note='Solo el ángulo 60° corresponde a la construcción clásica de Koch. El tamaño de generación se limita para mantener la interacción fluida.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 2; this.t = 60; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Reescribir y dibujar una palabra", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
