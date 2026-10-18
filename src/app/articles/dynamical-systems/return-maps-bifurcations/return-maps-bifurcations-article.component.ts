import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-return-maps-bifurcations-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './return-maps-bifurcations-article.component.html', styleUrls: ['../../shared/learning-article.css', './return-maps-bifurcations-article.component.css'] })
export class ReturnMapsBifurcationsArticleComponent {
  static readonly title = "Mapas de retorno, bifurcaciones y universalidad";
  static readonly route = 'return-maps-bifurcations';
  n = 60;
  t = 3.2;
  result = this.calculate();
  // concept-links:start
  readonly conceptLinks: readonly TextLink[] = [{"term":"punto fijo","route":"/articles/recurrent-sequences"}];
  // concept-links:end

  calculate(): { rows: [string, number | string][]; points: [number, number][]; note: string } {
    const n = this.n, t = this.t;
    const rows: [string, number | string][] = [];
    const points: [number, number][] = [];
    let note = '';
    let x=.271;for(let k=0;k<600;k++)x=t*x*(1-x);for(let k=0;k<n;k++){x=t*x*(1-x);points.push([k,x]);}rows.push(['Punto fijo positivo',1-1/t],['Multiplicador',2-t],['Criterio lineal',Math.abs(2-t)<1?'Atractivo':Math.abs(2-t)===1?'Neutro':'Inestable']);note='La órbita puede acercarse a un ciclo o seguir una dinámica más compleja cuando el punto fijo deja de ser atractivo. No se infiere un período exacto a partir de redondear la gráfica.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 60; this.t = 3.2; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "El multiplicador y una órbita", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
