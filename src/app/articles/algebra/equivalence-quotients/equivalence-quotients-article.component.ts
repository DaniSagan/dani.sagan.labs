import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-equivalence-quotients-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './equivalence-quotients-article.component.html', styleUrls: ['../../shared/learning-article.css', './equivalence-quotients-article.component.css'] })
export class EquivalenceQuotientsArticleComponent {
  static readonly title = "Relaciones de equivalencia y conjuntos cociente";
  static readonly route = 'equivalence-quotients';
  n = 5;
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
    const r=((t%n)+n)%n;rows.push(['Clase de x','['+r+']'],['Representante canónico',r],['Representante alternativo',r+n]);for(let k=0;k<=30;k++)points.push([k,k%n]);note='El diente de sierra muestra representantes, no distancias entre clases. x y x+m designan el mismo elemento del cociente.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 5; this.t = 7; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Representantes y clases modulares", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
