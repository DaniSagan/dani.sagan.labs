import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-dirichlet-convolution-series-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './dirichlet-convolution-series-article.component.html', styleUrls: ['../../shared/learning-article.css', './dirichlet-convolution-series-article.component.css'] })
export class DirichletConvolutionSeriesArticleComponent {
  static readonly title = "Funciones aritméticas, convolución y series de Dirichlet";
  static readonly route = 'dirichlet-convolution-series';
  n = 12;
  t = 2;
  result = this.calculate();
  // concept-links:start
  readonly conceptLinks: readonly TextLink[] = [{"term":"suma parcial","route":"/articles/telescoping-series"}];
  // concept-links:end

  calculate(): { rows: [string, number | string][]; points: [number, number][]; note: string } {
    const n = this.n, t = this.t;
    const rows: [string, number | string][] = [];
    const points: [number, number][] = [];
    let note = '';
    const ds:number[]=[];for(let d=1;d<=n;d++)if(n%d===0)ds.push(d);let sum=0;for(let k=1;k<=n;k++){sum+=k**(-t);points.push([k,sum]);}rows.push(['Divisores',ds.join(', ')],['(1∗1)(n)',ds.length],['(id∗1)(n)',ds.reduce((a,b)=>a+b,0)],['Suma parcial de ζ(s)',sum],['Cota integral de la cola',n**(1-t)/(t-1)]);note='La cota de cola usa s>1 y la comparación con la integral desde n hasta infinito. La suma parcial no es la función zeta exacta.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 12; this.t = 2; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Convoluciones exactas y una suma truncada", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
