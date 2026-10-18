import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-computability-formal-languages-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './computability-formal-languages-article.component.html', styleUrls: ['../../shared/learning-article.css', './computability-formal-languages-article.component.css'] })
export class ComputabilityFormalLanguagesArticleComponent {
  static readonly title = "Computabilidad, lenguajes formales y problema de la parada";
  static readonly route = 'computability-formal-languages';
  n = 13;
  t = 6;
  result = this.calculate();
  // concept-links:start
  readonly conceptLinks: readonly TextLink[] = [];
  // concept-links:end

  calculate(): { rows: [string, number | string][]; points: [number, number][]; note: string } {
    const n = this.n, t = this.t;
    const rows: [string, number | string][] = [];
    const points: [number, number][] = [];
    let note = '';
    const word=n.toString(2).padStart(t,'0');let parity=0;rows.push(['Palabra',word]);for(let k=0;k<word.length;k++){if(word[k]==='1')parity=1-parity;rows.push(['Tras el prefijo '+word.slice(0,k+1),parity?'Impar':'Par']);}rows.push(['Aceptada',parity===0?'Sí':'No']);note='Este autómata decide un lenguaje regular y siempre termina. Su existencia no resuelve el problema universal de la parada.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 13; this.t = 6; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Un decisor finito verificable", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
