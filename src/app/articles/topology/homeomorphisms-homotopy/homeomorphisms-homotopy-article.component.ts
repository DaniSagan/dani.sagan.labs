import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-homeomorphisms-homotopy-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './homeomorphisms-homotopy-article.component.html', styleUrls: ['../../shared/learning-article.css', './homeomorphisms-homotopy-article.component.css'] })
export class HomeomorphismsHomotopyArticleComponent {
  static readonly title = "Homeomorfismos, homotopía y retracciones";
  static readonly route = 'homeomorphisms-homotopy';
  n = 1.5;
  t = 0.5;
  result = this.calculate();
  // concept-links:start
  readonly conceptLinks: readonly TextLink[] = [];
  // concept-links:end

  calculate(): { rows: [string, number | string][]; points: [number, number][]; note: string } {
    const radius = (1 - this.t) * this.n + this.t;
    return {
      rows: [
        ['Radio inicial', this.n],
        ['Radio durante la deformación', radius],
        ['Radio final', 1],
        ['Puntos de la circunferencia unidad', 'Permanecen fijos'],
      ],
      points: this.circle(radius),
      note: 'Se muestra la imagen de una circunferencia de radio elegido dentro del anillo. La deformación completa actúa simultáneamente sobre todos los radios de [1, 2].',
    };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 1.5; this.t = 0.5; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  private circle(radius: number): [number, number][] {
    return Array.from({ length: 121 }, (_, k) => {
      const angle = 2 * Math.PI * k / 120;
      return [radius * Math.cos(angle), radius * Math.sin(angle)];
    });
  }
  get series(): PlotSeries[] {
    return [
      { label: 'Borde exterior de referencia (radio 2)', points: this.circle(2), color: 'var(--ink-dim)', dashed: true },
      { label: 'Destino fijo (radio 1)', points: this.circle(1), color: 'var(--gold)' },
      { label: 'Posición inicial elegida', points: this.circle(this.n), color: 'var(--accent2)', dashed: true },
      { label: 'Imagen en el tiempo s', points: this.result.points, color: 'var(--accent)' },
    ];
  }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    // Match the plot's 624 x 284 drawing area, with a fixed scale at every time.
    const halfHeight = 2.25, halfWidth = halfHeight * 624 / 284;
    return { xmin: -halfWidth, xmax: halfWidth, ymin: -halfHeight, ymax: halfHeight };
  }
}
