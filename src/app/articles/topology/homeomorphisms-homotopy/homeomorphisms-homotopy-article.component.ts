import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-homeomorphisms-homotopy-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './homeomorphisms-homotopy-article.component.html', styleUrls: ['../../shared/learning-article.css', './homeomorphisms-homotopy-article.component.css'] })
export class HomeomorphismsHomotopyArticleComponent {
  static readonly title = "Homeomorfismos, homotopía y retracciones";
  static readonly route = 'homeomorphisms-homotopy';
  n = 1.5;
  t = 0.5;
  result = this.calculate();
  // concept-links:start
  readonly conceptLinks: readonly TextLink[] = [];
  // concept-links:end

  calculate(): { rows: [string, number | string][]; points: [number, number][]; note: string } {
    const n = this.n, t = this.t;
    const rows: [string, number | string][] = [];
    const points: [number, number][] = [];
    let note = '';
    const r=(1-t)*n+t;rows.push(['Radio inicial',n],['Radio durante la deformación',r],['Radio final',1],['Puntos del círculo unidad','Permanecen fijos']);for(let k=0;k<=120;k++){const a=2*Math.PI*k/120;points.push([r*Math.cos(a),r*Math.sin(a)]);}note='Se muestra la imagen de un círculo de radio elegido dentro del anillo. La deformación completa actúa simultáneamente sobre todos los radios de [1,2].';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 1.5; this.t = 0.5; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Contraer radialmente un anillo", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    const cx=(xmin+xmax)/2, cy=(ymin+ymax)/2, w=Math.max(xmax-xmin,(ymax-ymin)*624/284)*1.15,h=w*284/624; return {xmin:cx-w/2,xmax:cx+w/2,ymin:cy-h/2,ymax:cy+h/2};
  }
}
