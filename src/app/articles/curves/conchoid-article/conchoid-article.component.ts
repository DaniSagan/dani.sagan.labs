import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MathjaxModule } from 'mathjax-angular';
import { ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';
import { CurveArticleBaseComponent } from '../curve-article-base/curve-article-base.component';

@Component({
  selector: 'app-conchoid-article',
  standalone: true,
  imports: [CommonModule, FormsModule, MathjaxModule, ImplicitCurveGraphComponent],
  templateUrl: './conchoid-article.component.html',
  styleUrls: ['./conchoid-article.component.css']
})
export class ConchoidArticleComponent extends CurveArticleBaseComponent {
  static title = 'Concoide de Nicomedes';
  static route = 'conchoid';

  override title = ConchoidArticleComponent.title;
  override description = 'La concoide es una curva construida a partir de una recta fija y un punto externo, y se caracteriza por una “boca” o proyección que se aparta de la línea de referencia.';
  override history = 'Fue estudiada por Nicomedes en la geometría antigua como un ejemplo de lugar geométrico que permite resolver problemas clásicos con regla y compás. Su construcción refleja la idea de combinar una recta con un punto fijo para generar una curva útil.';
  override practicalUses = 'Sirve como ejemplo clásico de curva construida por un lugar geométrico y aparece en contextos de diseño geométrico, trazados auxiliares y formación matemática de conceptos de sección cónica y resolución de problemas.';
  override bounds: [number, number, number, number] = [-8, 8, -8, 8];
  override paramDefinitions = [
    { key: 'a', label: 'a', min: 0.5, max: 4, step: 0.1, value: 1.5 },
    { key: 'b', label: 'b', min: 0.5, max: 4, step: 0.1, value: 2 }
  ];
  override kind: 'implicit' | 'parametric' = 'implicit';
  override buildEquation(params: Record<string, number>): string {
    return `$$ (x^2+y^2)(x-a)^2 = b^2x^2 $$`;
  }
  override evaluateImplicit(x: number, y: number, params: Record<string, number>): number {
    return (x * x + y * y) * (x - params.a) * (x - params.a) - params.b * params.b * x * x;
  }
}
