import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-maximum-likelihood-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './maximum-likelihood-article.component.html', styleUrls: ['../../shared/learning-article.css', './maximum-likelihood-article.component.css'] })
export class MaximumLikelihoodArticleComponent {
  static readonly title = "Verosimilitud y estimación de máxima verosimilitud";
  static readonly route = 'maximum-likelihood';
  n = 10;
  t = 0.3;
  result = this.calculate();
  // concept-links:start
  readonly conceptLinks: readonly TextLink[] = [];
  // concept-links:end

  calculate(): { rows: [string, number | string][]; points: [number, number][]; note: string } {
    const n = this.n, t = this.t;
    const rows: [string, number | string][] = [];
    const points: [number, number][] = [];
    let note = '';
    const k=Math.round(n*t),hat=k/n,max=hat**k*(1-hat)**(n-k);for(let j=0;j<=120;j++){const p=j/120;points.push([p,p**k*(1-p)**(n-k)/max]);}rows.push(['Éxitos enteros k',k],['Estimador k/n',hat],['Localización',k===0||k===n?'Frontera':'Interior']);note='La verosimilitud se divide por su máximo para visualizarla. Ese escalado no la convierte en una densidad del parámetro.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 10; this.t = 0.3; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "El máximo puede estar en la frontera", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
