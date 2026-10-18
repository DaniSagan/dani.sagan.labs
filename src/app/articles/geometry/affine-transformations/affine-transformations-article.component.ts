import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-affine-transformations-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './affine-transformations-article.component.html', styleUrls: ['../../shared/learning-article.css', './affine-transformations-article.component.css'] })
export class AffineTransformationsArticleComponent {
  static readonly title = "Transformaciones afines: parte lineal y traslación";
  static readonly route = 'affine-transformations';
  n = 1;
  t = 0;
  result = this.calculate();
  // concept-links:start
  readonly conceptLinks: readonly TextLink[] = [{"term":"determinante","route":"/articles/matrix-determinant"},{"term":"Cuadrado","route":"/articles/square"}];
  // concept-links:end

  calculate(): { rows: [string, number | string][]; points: [number, number][]; note: string } {
    const n = this.n, t = this.t;
    const rows: [string, number | string][] = [];
    const points: [number, number][] = [];
    let note = '';
    for(const [x,y]of[[0,0],[1,0],[1,1],[0,1],[0,0]])points.push([x+n*y+t,y]);rows.push(['Determinante',1],['Área de la imagen',1],['Longitud de la arista oblicua',Math.hypot(n,1)]);note='Se representa la imagen del cuadrado unidad. La traslación desplaza la figura; la cizalla modifica sus ángulos.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 1; this.t = 0; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Cambiar ángulos sin cambiar el área", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    const cx=(xmin+xmax)/2, cy=(ymin+ymax)/2, w=Math.max(xmax-xmin,(ymax-ymin)*624/284)*1.15,h=w*284/624; return {xmin:cx-w/2,xmax:cx+w/2,ymin:cy-h/2,ymax:cy+h/2};
  }
}
