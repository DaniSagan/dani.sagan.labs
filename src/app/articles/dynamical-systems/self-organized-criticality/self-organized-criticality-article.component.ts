import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-self-organized-criticality-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './self-organized-criticality-article.component.html', styleUrls: ['../../shared/learning-article.css', './self-organized-criticality-article.component.css'] })
export class SelfOrganizedCriticalityArticleComponent {
  static readonly title = "Criticalidad autoorganizada y leyes de potencia";
  static readonly route = 'self-organized-criticality';
  n = 11;
  t = 30;
  result = this.calculate();
  // concept-links:start
  readonly conceptLinks: readonly TextLink[] = [];
  // concept-links:end

  calculate(): { rows: [string, number | string][]; points: [number, number][]; note: string } {
    const n = this.n, t = this.t;
    const rows: [string, number | string][] = [];
    const points: [number, number][] = [];
    let note = '';
    const h=Array(n).fill(0);let lost=0,total=0,last=0;for(let g=0;g<t;g++){h[Math.floor(n/2)]++;last=0;const q:number[]=[];for(let i=0;i<n;i++)if(h[i]>=2)q.push(i);while(q.length){const i=q.pop()!;if(h[i]<2)continue;h[i]-=2;last++;for(const j of[i-1,i+1])if(j<0||j>=n)lost++;else{h[j]++;if(h[j]>=2)q.push(j);}if(h[i]>=2)q.push(i);}total+=last;}for(let i=0;i<n;i++)points.push([i,h[i]]);rows.push(['Topamientos de la última avalancha',last],['Topamientos totales',total],['Granos perdidos',lost],['Masa final',h.reduce((a,b)=>a+b,0)]);note='El balance exacto es granos añadidos = masa final + granos perdidos. El perfil final muestra alturas estables, no tamaños de avalancha.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 11; this.t = 30; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Avalanchas en una cadena finita", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
