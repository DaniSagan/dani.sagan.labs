import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-sieve-primality-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './sieve-primality-article.component.html', styleUrls: ['../../shared/learning-article.css', './sieve-primality-article.component.css'] })
export class SievePrimalityArticleComponent {
  static readonly title = "Criba de Eratóstenes y pruebas de primalidad";
  static readonly route = 'sieve-primality';
  n = 50;
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
    const prime=Array(n+1).fill(true);prime[0]=prime[1]=false;for(let p=2;p*p<=n;p++)if(prime[p])for(let k=p*p;k<=n;k+=p)prime[k]=false;const ps:number[]=[];for(let k=2;k<=n;k++)if(prime[k])ps.push(k);let value=1;for(let k=0;k<n-1;k++)value=value*t%n;rows.push(['Primos hasta N',ps.join(', ')],['¿N es primo? (criba exacta)',prime[n]?'Sí':'No'],['Base^(N−1) módulo N',value]);note='La clasificación de N procede de la criba. Un resto uno en la prueba de Fermat no convierte por sí solo un compuesto en primo.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 50; this.t = 2; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Primos exactos y restos modulares", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
