import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-constructible-numbers-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './constructible-numbers-article.component.html', styleUrls: ['../../shared/learning-article.css', './constructible-numbers-article.component.css'] })
export class ConstructibleNumbersArticleComponent {
  static readonly title = "Regla, compás y números construibles";
  static readonly route = 'constructible-numbers';
  n = 7;
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
    let m=n;while(m%2===0)m/=2;let ok=true;for(const p of[3,5,17,257,65537])if(m%p===0){m/=p;if(m%p===0)ok=false;}ok=ok&&m===1;rows.push(['Construible por Gauss–Wantzel',ok?'Sí':'No'],['Longitud numérica del lado',2*t*Math.sin(Math.PI/n)]);for(let k=0;k<=n;k++)points.push([t*Math.cos(2*Math.PI*k/n),t*Math.sin(2*Math.PI*k/n)]);note='El trazado numérico existe incluso cuando el polígono no es construible exactamente con regla y compás. Son tareas diferentes.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 7; this.t = 1; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Polígonos regulares: exactitud y representación", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    const cx=(xmin+xmax)/2, cy=(ymin+ymax)/2, w=Math.max(xmax-xmin,(ymax-ymin)*624/284)*1.15,h=w*284/624; return {xmin:cx-w/2,xmax:cx+w/2,ymin:cy-h/2,ymax:cy+h/2};
  }
}
