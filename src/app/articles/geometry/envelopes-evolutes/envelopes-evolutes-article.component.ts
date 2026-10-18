import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-envelopes-evolutes-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './envelopes-evolutes-article.component.html', styleUrls: ['../../shared/learning-article.css', './envelopes-evolutes-article.component.css'] })
export class EnvelopesEvolutesArticleComponent {
  static readonly title = "Envolventes, evolutas e involutas";
  static readonly route = 'envelopes-evolutes';
  n = 40;
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
    rows.push(['Abscisa de contacto',2*t],['Ordenada de contacto',t*t],['Pendiente de la recta',t],['Pendiente de la envolvente',t]);for(let k=0;k<=n;k++){const u=-2+4*k/n;points.push([2*u,u*u]);}note='La curva trazada es el lugar de contactos. El muestreo cambia su resolución; el contacto calculado se obtiene de ecuaciones exactas.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 40; this.t = 1; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Del parámetro al punto de contacto", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    const cx=(xmin+xmax)/2, cy=(ymin+ymax)/2, w=Math.max(xmax-xmin,(ymax-ymin)*624/284)*1.15,h=w*284/624; return {xmin:cx-w/2,xmax:cx+w/2,ymin:cy-h/2,ymax:cy+h/2};
  }
}
