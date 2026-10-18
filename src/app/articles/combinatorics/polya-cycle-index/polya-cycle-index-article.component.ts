import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-polya-cycle-index-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './polya-cycle-index-article.component.html', styleUrls: ['../../shared/learning-article.css', './polya-cycle-index-article.component.css'] })
export class PolyaCycleIndexArticleComponent {
  static readonly title = "Teorema de Pólya e índice de ciclos";
  static readonly route = 'polya-cycle-index';
  n = 4;
  t = 2;
  result = this.calculate();
  // concept-links:start
  readonly conceptLinks: readonly TextLink[] = [];
  // concept-links:end

  calculate(): { rows: [string, number | string][]; points: [number, number][]; note: string } {
    const n = this.n, t = this.t;
    const rows: [string, number | string][] = [];
    const points: [number, number][] = [];
    let note = '';
    const gcd=(a:number,b:number):number=>b?gcd(b,a%b):a;let sum=0;for(let k=0;k<n;k++){const cycles=gcd(n,k),fixed=t**cycles;sum+=fixed;rows.push(['Rotación '+k+': ciclos / fijas',cycles+' / '+fixed]);}rows.push(['Órbitas bajo rotación',sum/n]);note='Se usa que la rotación de k posiciones tiene mcd(n,k) ciclos. No se identifican reflejos en este modelo.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 4; this.t = 2; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Ciclos de cada rotación", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
