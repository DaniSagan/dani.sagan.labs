import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-projective-homogeneous-coordinates-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './projective-homogeneous-coordinates-article.component.html', styleUrls: ['../../shared/learning-article.css', './projective-homogeneous-coordinates-article.component.css'] })
export class ProjectiveHomogeneousCoordinatesArticleComponent {
  static readonly title = "Geometría proyectiva y coordenadas homogéneas";
  static readonly route = 'projective-homogeneous-coordinates';
  n = 1;
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
    const z=n-t;rows.push(['Coordenadas homogéneas','[1 : '+n+' : '+z+']'],['Intersección afín',Math.abs(z)<1e-10?'Punto del infinito':'('+1/z+', '+n/z+')']);note='El objeto homogéneo permanece definido cuando desaparece la intersección afín. No se sustituye el infinito por un número grande.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 1; this.t = 0.5; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Una intersección que alcanza el infinito", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
