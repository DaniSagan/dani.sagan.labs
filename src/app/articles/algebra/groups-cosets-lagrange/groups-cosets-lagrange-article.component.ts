import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-groups-cosets-lagrange-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './groups-cosets-lagrange-article.component.html', styleUrls: ['../../shared/learning-article.css', './groups-cosets-lagrange-article.component.css'] })
export class GroupsCosetsLagrangeArticleComponent {
  static readonly title = "Subgrupos, clases laterales y teorema de Lagrange";
  static readonly route = 'groups-cosets-lagrange';
  n = 12;
  t = 4;
  result = this.calculate();
  // concept-links:start
  readonly conceptLinks: readonly TextLink[] = [];
  // concept-links:end

  calculate(): { rows: [string, number | string][]; points: [number, number][]; note: string } {
    const n = this.n, t = this.t;
    const rows: [string, number | string][] = [];
    const points: [number, number][] = [];
    let note = '';
    const a=t%n,seen=new Set<number>();let x=0;while(!seen.has(x)){seen.add(x);x=(x+a)%n;}rows.push(['Subgrupo generado',Array.from(seen).join(', ')],['Orden del elemento',seen.size],['Número de clases',n/seen.size]);for(let k=0;k<=n;k++)points.push([k,(k*a)%n]);note='La operación de este grupo es sumar módulo m. El orden aditivo no debe confundirse con un orden multiplicativo.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 12; this.t = 4; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Construir un subgrupo cíclico", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
