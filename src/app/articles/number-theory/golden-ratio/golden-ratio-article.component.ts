import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-golden-ratio-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './golden-ratio-article.component.html', styleUrls: ['../../shared/learning-article.css', './golden-ratio-article.component.css'] })
export class GoldenRatioArticleComponent {
  static readonly title = "El número áureo: álgebra, geometría y Fibonacci";
  static readonly route = 'golden-ratio';
  n = 8;
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
    let a=0,b=1;for(let k=1;k<=n;k++){const c=a+b;a=b;b=c;if(a)points.push([k,b/a]);}const phi=(1+Math.sqrt(5))/2;rows.push(['Cociente F(n+1)/F(n)',b/a],['φ',phi],['Parte mayor',t*phi],['Longitud total',t*(1+phi)]);note='La escala cambia las longitudes, pero no sus razones. Los primeros cocientes pueden oscilar alrededor de φ.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 8; this.t = 1; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Cocientes y particiones áureas", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
