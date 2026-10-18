import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-dirichlet-abel-tests-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './dirichlet-abel-tests-article.component.html', styleUrls: ['../../shared/learning-article.css', './dirichlet-abel-tests-article.component.css'] })
export class DirichletAbelTestsArticleComponent {
  static readonly title = "Criterios de Dirichlet y Abel para series";
  static readonly route = 'dirichlet-abel-tests';
  n = 30;
  t = 1;
  result = this.calculate();
  // concept-links:start
  readonly conceptLinks: readonly TextLink[] = [{"term":"suma parcial","route":"/articles/telescoping-series"},{"term":"sumas parciales","route":"/articles/telescoping-series"}];
  // concept-links:end

  calculate(): { rows: [string, number | string][]; points: [number, number][]; note: string } {
    const n = this.n, t = this.t;
    const rows: [string, number | string][] = [];
    const points: [number, number][] = [];
    let note = '';
    let sum=0,A=0,max=0;for(let k=1;k<=n;k++){A+=Math.sin(k*t);max=Math.max(max,Math.abs(A));sum+=Math.sin(k*t)/k;points.push([k,sum]);}rows.push(['Suma ponderada',sum],['Máxima suma parcial observada de sen(kθ)',max],['Cota geométrica válida',1/Math.abs(Math.sin(t/2))]);note='θ está separado de los múltiplos de 2π. La cota teórica controla todas las sumas parciales, no solo las observadas.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 30; this.t = 1; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Cancelación antes de ponderar", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
