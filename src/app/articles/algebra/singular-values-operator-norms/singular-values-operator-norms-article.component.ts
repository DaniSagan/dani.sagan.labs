import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-singular-values-operator-norms-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './singular-values-operator-norms-article.component.html', styleUrls: ['../../shared/learning-article.css', './singular-values-operator-norms-article.component.css'] })
export class SingularValuesOperatorNormsArticleComponent {
  static readonly title = "Valores singulares, SVD y normas de operadores";
  static readonly route = 'singular-values-operator-norms';
  n = 3;
  t = 1;
  result = this.calculate();
  // concept-links:start
  readonly conceptLinks: readonly TextLink[] = [{"term":"invertible","route":"/articles/matrix-determinant"}];
  // concept-links:end

  calculate(): { rows: [string, number | string][]; points: [number, number][]; note: string } {
    const n = this.n, t = this.t;
    const rows: [string, number | string][] = [];
    const points: [number, number][] = [];
    let note = '';
    rows.push(['Norma inducida 2',Math.max(n,t)],['Norma de Frobenius',Math.hypot(n,t)],['Rango',(n>0?1:0)+(t>0?1:0)],['Condición',Math.min(n,t)===0?'No invertible':Math.max(n,t)/Math.min(n,t)]);for(let k=0;k<=120;k++){const a=2*Math.PI*k/120;points.push([n*Math.cos(a),t*Math.sin(a)]);}note='Este ejemplo es diagonal: permite leer exactamente las escalas singulares. Para una matriz general, las direcciones se obtienen de AᵀA.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 3; this.t = 1; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "La imagen de la circunferencia unidad", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const cx=(xmin+xmax)/2, cy=(ymin+ymax)/2, w=Math.max(xmax-xmin,(ymax-ymin)*624/284)*1.15,h=w*284/624;
    return {xmin:cx-w/2,xmax:cx+w/2,ymin:cy-h/2,ymax:cy+h/2};
  }
}
