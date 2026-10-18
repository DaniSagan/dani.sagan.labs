import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-holomorphic-continuation-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './holomorphic-continuation-article.component.html', styleUrls: ['../../shared/learning-article.css', './holomorphic-continuation-article.component.css'] })
export class HolomorphicContinuationArticleComponent {
  static readonly title = "Funciones holomorfas y continuación analítica";
  static readonly route = 'holomorphic-continuation';
  n = 5;
  t = 0.5;
  result = this.calculate();
  // concept-links:start
  readonly conceptLinks: readonly TextLink[] = [{"term":"suma parcial","route":"/articles/telescoping-series"},{"term":"serie geométrica","route":"/articles/geometric-series"}];
  // concept-links:end

  calculate(): { rows: [string, number | string][]; points: [number, number][]; note: string } {
    const n = this.n, t = this.t;
    const rows: [string, number | string][] = [];
    const points: [number, number][] = [];
    let note = '';
    let sum=0;for(let k=0;k<=n;k++)sum+=t**k;rows.push(['Suma parcial',sum],['Función racional',Math.abs(t-1)<1e-10?'Polo':1/(1-t)],['Condición de convergencia',t<1?'Dentro del disco':'Fuera del disco abierto']);for(let i=0;i<=100;i++){const x=.95*i/100;let y=0;for(let k=0;k<=n;k++)y+=x**k;points.push([x,y]);}note='La gráfica se limita a [0,0,95], sin unir artificialmente los lados del polo. El valor racional existe para x>1, pero la serie geométrica diverge allí.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 5; this.t = 0.5; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Una función y el disco de su serie", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
