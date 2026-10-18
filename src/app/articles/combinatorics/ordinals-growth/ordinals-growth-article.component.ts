import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-ordinals-growth-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './ordinals-growth-article.component.html', styleUrls: ['../../shared/learning-article.css', './ordinals-growth-article.component.css'] })
export class OrdinalsGrowthArticleComponent {
  static readonly title = "Ordinales y jerarquías de crecimiento";
  static readonly route = 'ordinals-growth';
  n = 5;
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
    const values=Array.from({length:n},(_,i)=>String(i));rows.push(['Fragmento dibujado',t===0?'★, '+values.join(', '):values.join(', ')+', ★'],['Orden infinito que se ilustra',t===0?'1+ω':'ω+1'],['¿Tiene máximo el orden infinito?',t===0?'No':'Sí: ★']);note='El prefijo finito siempre acaba, pero ω no. La propiedad del máximo se refiere al orden infinito definido, no al último número visible de la muestra.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 5; this.t = 1; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Un prefijo y un elemento distinguido", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
