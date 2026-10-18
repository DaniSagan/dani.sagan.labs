import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-lyapunov-stability-chaos-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './lyapunov-stability-chaos-article.component.html', styleUrls: ['../../shared/learning-article.css', './lyapunov-stability-chaos-article.component.css'] })
export class LyapunovStabilityChaosArticleComponent {
  static readonly title = "Estabilidad, funciones y exponentes de Lyapunov";
  static readonly route = 'lyapunov-stability-chaos';
  n = 100;
  t = 3.8;
  result = this.calculate();
  // concept-links:start
  readonly conceptLinks: readonly TextLink[] = [{"term":"logaritmo","route":"/articles/exponentials-logarithms"},{"term":"Derivadas","route":"/articles/derivative-foundations"}];
  // concept-links:end

  calculate(): { rows: [string, number | string][]; points: [number, number][]; note: string } {
    const n = this.n, t = this.t;
    const rows: [string, number | string][] = [];
    const points: [number, number][] = [];
    let note = '';
    let x=.231,sum=0;for(let k=0;k<800;k++)x=t*x*(1-x);for(let k=0;k<n;k++){sum+=Math.log(Math.max(1e-14,Math.abs(t*(1-2*x))));x=t*x*(1-x);points.push([k,x]);}rows.push(['Exponente estimado',sum/n],['Último estado',x],['Equilibrio positivo',1-1/t]);note='Se descartan 800 iteraciones y se limita el logaritmo cerca de derivadas nulas. Es un diagnóstico numérico finito, no una certificación de caos.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 100; this.t = 3.8; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Un exponente finito del mapa logístico", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
