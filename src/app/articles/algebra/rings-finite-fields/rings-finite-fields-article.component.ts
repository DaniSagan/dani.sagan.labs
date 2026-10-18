import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-rings-finite-fields-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './rings-finite-fields-article.component.html', styleUrls: ['../../shared/learning-article.css', './rings-finite-fields-article.component.css'] })
export class RingsFiniteFieldsArticleComponent {
  static readonly title = "Anillos, cuerpos, irreducibilidad y cuerpos finitos";
  static readonly route = 'rings-finite-fields';
  n = 5;
  t = 2;
  result = this.calculate();
  // concept-links:start
  readonly conceptLinks: readonly TextLink[] = [];
  // concept-links:end

  calculate(): { rows: [string, number | string][]; points: [number, number][]; note: string } {
    const n = this.n, t = this.t;
    const rows: [string, number | string][] = [];
    const points: [number, number][] = [];
    let note = '';
    const a=t%n;let inverse=-1;const zeros:number[]=[];for(let b=1;b<n;b++){if((a*b)%n===1)inverse=b;if(a!==0&&(a*b)%n===0)zeros.push(b);}rows.push(['Representante',a],['Inverso',inverse<0?'No existe':inverse],['Factores no nulos que anulan a',zeros.length?zeros.join(', '):'Ninguno']);note='Se comprueban todos los candidatos en un anillo finito pequeño. La multiplicación es modular, no multiplicación real ordinaria.';
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 5; this.t = 2; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Unidades y divisores de cero", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
