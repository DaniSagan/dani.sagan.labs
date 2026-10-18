import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-orthogonal-polynomials-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './orthogonal-polynomials-article.component.html', styleUrls: ['../../shared/learning-article.css', './orthogonal-polynomials-article.component.css'] })
export class OrthogonalPolynomialsArticleComponent {
  static readonly title = "Polinomios ortogonales y funciones de peso";
  static readonly route = 'orthogonal-polynomials';
  n = 2;
  t = 0.5;
  result = this.calculate();
  // concept-links:start
  readonly conceptLinks: readonly TextLink[] = [{"term":"recurrencia","route":"/articles/recurrent-sequences"}];
  // concept-links:end

  calculate(): { rows: [string, number | string][]; points: [number, number][]; note: string } {
    const n = this.n, t = this.t;
    const rows: [string, number | string][] = [];
    const points: [number, number][] = [];
    let note = '';
    const P=(x:number)=>{if(n===0)return 1;let a=1,b=x;for(let k=1;k<n;k++){const c=((2*k+1)*x*b-k*a)/(k+1);a=b;b=c;}return b;};rows.push(['P_n(x)',P(t)],['Norma² exacta',2/(2*n+1)]);for(let k=0;k<=160;k++){const x=-1+2*k/160;points.push([x,P(x)]);}note='La recurrencia calcula Legendre con peso uno. No se aplica sin cambios a otras familias ni a otros productos internos.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 2; this.t = 0.5; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Recurrencia de Legendre", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
