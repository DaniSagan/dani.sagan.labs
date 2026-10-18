import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-schoenflies-winding-number-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './schoenflies-winding-number-article.component.html', styleUrls: ['../../shared/learning-article.css', './schoenflies-winding-number-article.component.css'] })
export class SchoenfliesWindingNumberArticleComponent {
  static readonly title = "Schönflies y número de vueltas de una curva";
  static readonly route = 'schoenflies-winding-number';
  n = 1;
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
    if(Math.abs(t-1)<1e-9){rows.push(['Índice','No definido: a pertenece a la curva']);}else{let sum=0;const N=480;for(let k=0;k<N;k++){const a=2*Math.PI*n*k/N,b=2*Math.PI*n*(k+1)/N,x=Math.cos(a)-t,y=Math.sin(a),u=Math.cos(b)-t,v=Math.sin(b);sum+=Math.atan2(x*v-y*u,x*u+y*v);}rows.push(['Índice numérico',sum/(2*Math.PI)],['Índice exacto',t<1?n:0],['¿Parametrización simple?',Math.abs(n)===1?'Sí':'No']);}for(let k=0;k<=240;k++){const a=2*Math.PI*n*k/240;points.push([Math.cos(a),Math.sin(a)]);}note='El punto de referencia está en el eje real. La curva dibujada no permite distinguir cuántas veces se recorre; esa información aparece en el índice.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 1; this.t = 0; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Acumular el argumento alrededor de un punto", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    const cx=(xmin+xmax)/2, cy=(ymin+ymax)/2, w=Math.max(xmax-xmin,(ymax-ymin)*624/284)*1.15,h=w*284/624; return {xmin:cx-w/2,xmax:cx+w/2,ymin:cy-h/2,ymax:cy+h/2};
  }
}
