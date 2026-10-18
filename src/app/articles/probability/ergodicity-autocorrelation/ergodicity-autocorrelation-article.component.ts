import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-ergodicity-autocorrelation-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './ergodicity-autocorrelation-article.component.html', styleUrls: ['../../shared/learning-article.css', './ergodicity-autocorrelation-article.component.css'] })
export class ErgodicityAutocorrelationArticleComponent {
  static readonly title = "Ergodicidad, autocorrelación y promedios temporales";
  static readonly route = 'ergodicity-autocorrelation';
  n = 100;
  t = 0.1;
  result = this.calculate();
  // concept-links:start
  readonly conceptLinks: readonly TextLink[] = [{"term":"correlación","route":"/articles/covariance"}];
  // concept-links:end

  calculate(): { rows: [string, number | string][]; points: [number, number][]; note: string } {
    const n = this.n, t = this.t;
    const rows: [string, number | string][] = [];
    const points: [number, number][] = [];
    let note = '';
    const rho=1-2*t;let factor=1;for(let k=1;k<n;k++)factor+=2*(1-k/n)*rho**k;rows.push(['Correlación a un paso',rho],['Varianza exacta estacionaria de la media',.25*factor/n],['Tamaño efectivo por igualdad de varianzas',n/factor]);for(let k=0;k<=30;k++)points.push([k,rho**k]);note='Se emplea la distribución estacionaria y una fórmula exacta para esta cadena finita. La curva es autocorrelación, no una trayectoria aleatoria.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 100; this.t = 0.1; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Precisión de un promedio correlacionado", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
