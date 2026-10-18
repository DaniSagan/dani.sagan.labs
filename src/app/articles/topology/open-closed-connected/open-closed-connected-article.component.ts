import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-open-closed-connected-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './open-closed-connected-article.component.html', styleUrls: ['../../shared/learning-article.css', './open-closed-connected-article.component.css'] })
export class OpenClosedConnectedArticleComponent {
  static readonly title = "Abiertos, cerrados, acumulación y conexidad";
  static readonly route = 'open-closed-connected';
  n = 2;
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
    rows.push(['Primer intervalo','('+(-t)+', '+t+')'],['Segundo intervalo','('+(n-t)+', '+(n+t)+')'],['Componentes conexas',n<2*t?1:2],['¿Se tocan las clausuras?',n<=2*t?'Sí':'No'],['¿Es abierto en R?','Sí']);note='En d=2r los extremos de las clausuras coinciden, pero ese punto no pertenece a los intervalos abiertos: siguen existiendo dos componentes.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 2; this.t = 1; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Unir intervalos abiertos", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
