import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-picard-lipschitz-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './picard-lipschitz-article.component.html', styleUrls: ['../../shared/learning-article.css', './picard-lipschitz-article.component.css'] })
export class PicardLipschitzArticleComponent {
  static readonly title = "Existencia y unicidad: Picard y la condición de Lipschitz";
  static readonly route = 'picard-lipschitz';
  n = 3;
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
    const poly=(x:number)=>{let sum=1,a=1;for(let k=1;k<=n;k++){a*=x/k;sum+=a;}return sum;};rows.push(['Iteración en t',poly(t)],['Solución eᵗ',Math.exp(t)],['Error absoluto',Math.abs(poly(t)-Math.exp(t))]);for(let k=0;k<=120;k++){const x=-1+2*k/120;points.push([x,poly(x)]);}note='Este problema permite obtener cada iteración exactamente como un polinomio. En otras EDO integrar numéricamente añade otra fuente de error.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 3; this.t = 0.5; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Construir eᵗ mediante iteraciones", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
