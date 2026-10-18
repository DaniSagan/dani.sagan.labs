import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-surfaces-genus-euler-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './surfaces-genus-euler-article.component.html', styleUrls: ['../../shared/learning-article.css', './surfaces-genus-euler-article.component.css'] })
export class SurfacesGenusEulerArticleComponent {
  static readonly title = "Superficies, orientabilidad, género y característica de Euler";
  static readonly route = 'surfaces-genus-euler';
  n = 1;
  t = 0;
  result = this.calculate();
  // concept-links:start
  readonly conceptLinks: readonly TextLink[] = [];
  // concept-links:end

  calculate(): { rows: [string, number | string][]; points: [number, number][]; note: string } {
    const n = this.n, t = this.t;
    const rows: [string, number | string][] = [];
    const points: [number, number][] = [];
    let note = '';
    rows.push(['χ orientable con g asas',2-2*n-t],['χ no orientable con k planos proyectivos',2-n-t],['Componentes de borde',t],['χ de la esfera cerrada',2]);note='El primer control se interpreta como g en la primera fila y k en la segunda. Son dos familias diferentes, no dos fórmulas para una misma superficie.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 1; this.t = 0; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Distinguir dos familias de superficies", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
