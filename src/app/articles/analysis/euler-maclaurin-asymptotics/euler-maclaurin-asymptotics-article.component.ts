import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-euler-maclaurin-asymptotics-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './euler-maclaurin-asymptotics-article.component.html', styleUrls: ['../../shared/learning-article.css', './euler-maclaurin-asymptotics-article.component.css'] })
export class EulerMaclaurinAsymptoticsArticleComponent {
  static readonly title = "Euler–Maclaurin y truncamiento de desarrollos asintóticos";
  static readonly route = 'euler-maclaurin-asymptotics';
  n = 10;
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
    let H=0;for(let k=1;k<=n;k++){H+=1/k;let v=H-Math.log(k);if(t>=1)v-=1/(2*k);if(t>=2)v+=1/(12*k*k);if(t>=3)v-=1/(120*k**4);points.push([k,v]);}rows.push(['Aproximación',points[points.length-1][1]],['Referencia γ',0.5772156649015329],['Error observado',points[points.length-1][1]-0.5772156649015329]);note='El error mostrado compara con una referencia numérica. No debe confundirse con una cota certificada del resto.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 10; this.t = 2; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Aproximar γ con correcciones sucesivas", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
