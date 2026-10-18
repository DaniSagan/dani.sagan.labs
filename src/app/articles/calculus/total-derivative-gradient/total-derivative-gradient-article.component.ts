import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-total-derivative-gradient-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './total-derivative-gradient-article.component.html', styleUrls: ['../../shared/learning-article.css', './total-derivative-gradient-article.component.css'] })
export class TotalDerivativeGradientArticleComponent {
  static readonly title = "Diferenciabilidad total, derivadas direccionales y gradiente";
  static readonly route = 'total-derivative-gradient';
  n = 45;
  t = 0.2;
  result = this.calculate();
  // concept-links:start
  readonly conceptLinks: readonly TextLink[] = [];
  // concept-links:end

  calculate(): { rows: [string, number | string][]; points: [number, number][]; note: string } {
    const n = this.n, t = this.t;
    const rows: [string, number | string][] = [];
    const points: [number, number][] = [];
    let note = '';
    const a=n*Math.PI/180,u=Math.cos(a),v=Math.sin(a),linear=t*(2*u+4*v),exact=(1+t*u)**2+2*(1+t*v)**2-3;rows.push(['Derivada unitaria',2*u+4*v],['Incremento exacto',exact],['Predicción lineal',linear],['Error dividido por paso',(exact-linear)/t]);for(let i=0;i<=100;i++){const h=i/100;points.push([h,h*h*(u*u+2*v*v)]);}note='La curva representa el error cuadrático. Reducir el paso a la mitad reduce este error por un factor cuatro.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 45; this.t = 0.2; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "La predicción lineal y su error", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
