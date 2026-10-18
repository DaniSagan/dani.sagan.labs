import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-complex-residues-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './complex-residues-article.component.html', styleUrls: ['../../shared/learning-article.css', './complex-residues-article.component.css'] })
export class ComplexResiduesArticleComponent {
  static readonly title = "Singularidades, polos y residuos";
  static readonly route = 'complex-residues';
  n = 1;
  t = 1;
  result = this.calculate();
  // concept-links:start
  readonly conceptLinks: readonly TextLink[] = [];
  // concept-links:end

  calculate(): { rows: [string, number | string][]; points: [number, number][]; note: string } {
    const n = this.n, t = this.t;
    const rows: [string, number | string][] = [];
    const points: [number, number][] = [];
    let note = '';
    let re=0,im=0;const N=512;for(let k=0;k<N;k++){const a=2*Math.PI*(k+.5)/N,scale=t**(1-n)*2*Math.PI/N;re+=-scale*Math.sin((1-n)*a);im+=scale*Math.cos((1-n)*a);}rows.push(['Parte real de la integral numérica',re],['Parte imaginaria',im],['Residuo exacto',n===1?1:0],['Integral exacta / i',n===1?2*Math.PI:0]);note='Se integra z^(−m) por puntos medios. Para m=1 la integral es 2πi para cualquier radio positivo; para los demás órdenes es cero.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 1; this.t = 1; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Integrar potencias en un círculo", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
