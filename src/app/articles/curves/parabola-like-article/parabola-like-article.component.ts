import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MathjaxModule } from 'mathjax-angular';
import { ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';
import { CurveArticleBaseComponent } from '../curve-article-base/curve-article-base.component';

@Component({
  selector: 'app-parabola-like-article',
  standalone: true,
  imports: [CommonModule, FormsModule, MathjaxModule, ImplicitCurveGraphComponent],
  templateUrl: './parabola-like-article.component.html',
  styleUrls: ['./parabola-like-article.component.css']
})
export class ParabolaLikeArticleComponent extends CurveArticleBaseComponent {
  static title = 'Curva parabólica general';
  static route = 'parabola-like';

  override title = ParabolaLikeArticleComponent.title;
  override description = 'Este trazado combina la estructura de la parábola con una familia de curvas cerradas y suaves para estudiar cómo pequeñas variaciones en los parámetros cambian la forma total.';
  override history = 'La idea de perturbar una parábola con términos adicionales es una extensión básica del estudio clásico de las cónicas, y refleja la evolución natural del análisis algebraico hacia familias de curvas más generales.';
  override practicalUses = 'Se usa como herramienta pedagógica para explorar aproximaciones y deformaciones de curvas básicas, y es muy útil en modelado matemático donde una forma inicial se convierte en una familia paramétrica.';
  override bounds: [number, number, number, number] = [-4, 4, -3, 3];
  override paramDefinitions = [
    { key: 'a', label: 'a', min: 0.5, max: 3, step: 0.1, value: 1.5 },
    { key: 'b', label: 'b', min: 0.5, max: 3, step: 0.1, value: 1.2 }
  ];
  override kind: 'implicit' | 'parametric' = 'implicit';
  override buildEquation(params: Record<string, number>): string {
    return `$$ \frac{x^2}{a^2} + \frac{y^2}{b^2} = 1 + x^2 $$`;
  }
  override evaluateImplicit(x: number, y: number, params: Record<string, number>): number {
    return (x * x / (params.a * params.a)) + (y * y / (params.b * params.b)) - 1 - x * x;
  }
}
