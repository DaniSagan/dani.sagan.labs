import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-heterogeneous-binomial-mixtures-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './heterogeneous-binomial-mixtures-article.component.html', styleUrls: ['../../shared/learning-article.css', './heterogeneous-binomial-mixtures-article.component.css'] })
export class HeterogeneousBinomialMixturesArticleComponent {
  static readonly title = "Poisson-binomial y beta-binomial: heterogeneidad y mezcla";
  static readonly route = 'heterogeneous-binomial-mixtures';
  n = 8;
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
    const ps=Array.from({length:n},(_,i)=>t+(i%2?1:-1)*.5*t*(1-t));let pmf=[1];for(const p of ps){const next=Array(pmf.length+1).fill(0);for(let k=0;k<pmf.length;k++){next[k]+=pmf[k]*(1-p);next[k+1]+=pmf[k]*p;}pmf=next;}for(let k=0;k<pmf.length;k++)points.push([k,pmf[k]]);rows.push(['Media Poisson-binomial',ps.reduce((a,b)=>a+b,0)],['Varianza Poisson-binomial',ps.reduce((s,p)=>s+p*(1-p),0)],['Varianza binomial de referencia',n*t*(1-t)],['Varianza beta-binomial, α+β=4',n*t*(1-t)*(1+(n-1)/5)]);note='La curva representa solo Poisson-binomial. La tabla compara además una beta-binomial de media np; con n impar, la media del primer modelo puede diferir ligeramente de np.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 8; this.t = 0.5; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Comparar dos mecanismos de variabilidad", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
