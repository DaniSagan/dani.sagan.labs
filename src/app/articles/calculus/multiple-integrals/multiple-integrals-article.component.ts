import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-multiple-integrals-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './multiple-integrals-article.component.html', styleUrls: ['../../shared/learning-article.css', './multiple-integrals-article.component.css'] })
export class MultipleIntegralsArticleComponent {
  static readonly title = "Integrales múltiples y coordenadas polares";
  static readonly route = 'multiple-integrals';
  n = 2;
  t = 0;
  result = this.calculate();
  // concept-links:start
  readonly conceptLinks: readonly TextLink[] = [{"term":"valor medio","route":"/articles/mean-value-theorems"}];
  // concept-links:end

  calculate(): { rows: [string, number | string][]; points: [number, number][]; note: string } {
    const n = this.n, t = this.t;
    const rows: [string, number | string][] = [];
    const points: [number, number][] = [];
    let note = '';
    const a=n*t,area=Math.PI*(n*n-a*a),moment=Math.PI*(n**4-a**4)/2;rows.push(['Radio interior',a],['Área',area],['Integral de x²+y²',moment],['Valor medio',moment/area]);for(let i=0;i<=100;i++){const r=a+(n-a)*i/100;points.push([r,2*Math.PI*r**3]);}note='La curva es la contribución radial tras integrar el ángulo. Su integral entre los dos radios coincide con el momento mostrado.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 2; this.t = 0; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Área y momento de un anillo", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
