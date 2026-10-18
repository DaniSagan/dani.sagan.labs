import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-symplectic-integration-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './symplectic-integration-article.component.html', styleUrls: ['../../shared/learning-article.css', './symplectic-integration-article.component.css'] })
export class SymplecticIntegrationArticleComponent {
  static readonly title = "Estructura hamiltoniana e integración simpléctica";
  static readonly route = 'symplectic-integration';
  n = 50;
  t = 0.1;
  result = this.calculate();
  // concept-links:start
  readonly conceptLinks: readonly TextLink[] = [{"term":"determinante","route":"/articles/matrix-determinant"}];
  // concept-links:end

  calculate(): { rows: [string, number | string][]; points: [number, number][]; note: string } {
    const n = this.n, t = this.t;
    const rows: [string, number | string][] = [];
    const points: [number, number][] = [];
    let note = '';
    let q=1,p=0,max=0;points.push([q,p]);for(let k=0;k<n;k++){p-=t*q/2;q+=t*p;p-=t*q/2;max=Math.max(max,Math.abs((q*q+p*p)/2-.5));points.push([q,p]);}rows.push(['Energía final',(q*q+p*p)/2],['Máxima desviación observada',max],['Determinante de cada paso',1]);note='Se muestra la trayectoria discreta en el plano (q,p). El paso se mantiene dentro de la región de estabilidad de este oscilador.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 50; this.t = 0.1; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Verlet en el plano de fases", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
