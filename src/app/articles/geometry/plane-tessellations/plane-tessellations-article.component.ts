import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-plane-tessellations-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './plane-tessellations-article.component.html', styleUrls: ['../../shared/learning-article.css', './plane-tessellations-article.component.css'] })
export class PlaneTessellationsArticleComponent {
  static readonly title = "Teselaciones del plano y polígonos regulares";
  static readonly route = 'plane-tessellations';
  n = 6;
  t = 3;
  result = this.calculate();
  // concept-links:start
  readonly conceptLinks: readonly TextLink[] = [];
  // concept-links:end

  calculate(): { rows: [string, number | string][]; points: [number, number][]; note: string } {
    const n = this.n, t = this.t;
    const rows: [string, number | string][] = [];
    const points: [number, number][] = [];
    let note = '';
    const angle=180*(n-2)/n,total=t*angle;rows.push(['Ángulo de cada pieza',angle],['Suma alrededor del vértice',total],['Hueco positivo / solape negativo',360-total],['Cierre local',Math.abs(total-360)<1e-9?'Exacto':'No cierra']);note='La tabla prueba una condición angular local para polígonos regulares euclídeos. No clasifica todos los mosaicos posibles.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 6; this.t = 3; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Cerrar una vuelta con ángulos", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
