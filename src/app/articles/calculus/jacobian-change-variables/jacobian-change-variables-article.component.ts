import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-jacobian-change-variables-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './jacobian-change-variables-article.component.html', styleUrls: ['../../shared/learning-article.css', './jacobian-change-variables-article.component.css'] })
export class JacobianChangeVariablesArticleComponent {
  static readonly title = "Matriz jacobiana y cambios de variables";
  static readonly route = 'jacobian-change-variables';
  n = 2;
  t = 0.5;
  result = this.calculate();
  // concept-links:start
  readonly conceptLinks: readonly TextLink[] = [{"term":"determinante","route":"/articles/matrix-determinant"}];
  // concept-links:end

  calculate(): { rows: [string, number | string][]; points: [number, number][]; note: string } {
    const n = this.n, t = this.t;
    const rows: [string, number | string][] = [];
    const points: [number, number][] = [];
    let note = '';
    const c=Math.cos(t),s=Math.sin(t);rows.push(['∂x/∂r',c],['∂x/∂θ',-n*s],['∂y/∂r',s],['∂y/∂θ',n*c],['Determinante',n]);for(let i=0;i<=100;i++){const a=2*Math.PI*i/100;points.push([n*Math.cos(a),n*Math.sin(a)]);}note='La gráfica muestra el círculo de radio r. En r=0 colapsa a un punto y el determinante se anula.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 2; this.t = 0.5; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "La base local de coordenadas polares", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
