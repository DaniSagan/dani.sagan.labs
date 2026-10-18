import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-pseudorandom-generators-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './pseudorandom-generators-article.component.html', styleUrls: ['../../shared/learning-article.css', './pseudorandom-generators-article.component.css'] })
export class PseudorandomGeneratorsArticleComponent {
  static readonly title = "Pseudoaleatoriedad, semillas y períodos";
  static readonly route = 'pseudorandom-generators';
  n = 50;
  t = 7;
  result = this.calculate();
  // concept-links:start
  readonly conceptLinks: readonly TextLink[] = [];
  // concept-links:end

  calculate(): { rows: [string, number | string][]; points: [number, number][]; note: string } {
    const n = this.n, t = this.t;
    const rows: [string, number | string][] = [];
    const points: [number, number][] = [];
    let note = '';
    let x=t;const seen=new Map<number,number>();let period=0;for(let k=0;k<n;k++){if(!seen.has(x))seen.set(x,k);else if(!period)period=k-seen.get(x)!;points.push([k,x/97]);x=(17*x+43)%97;}rows.push(['Estados distintos observados',seen.size],['Período detectado',period||'Aún no observado'],['Estado siguiente',x]);note='Se usa un generador pequeño para inspeccionar su estructura. No se presenta como un generador adecuado para simulaciones de producción ni para seguridad.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 50; this.t = 7; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Detectar repeticiones de estado", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
