import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MathjaxModule } from 'mathjax-angular';
import { ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';
import { CurveArticleBaseComponent } from '../curve-article-base/curve-article-base.component';

@Component({
  selector: 'app-trifolium-article',
  standalone: true,
  imports: [CommonModule, FormsModule, MathjaxModule, ImplicitCurveGraphComponent],
  templateUrl: './trifolium-article.component.html',
  styleUrls: ['./trifolium-article.component.css']
})
export class TrifoliumArticleComponent extends CurveArticleBaseComponent {
  static title = 'Trifolio';
  static route = 'trifolium';

  override title = TrifoliumArticleComponent.title;
  override description = 'El trifolio es una curva de tres pétalos con simetría triangular y una visualización muy clara en coordenadas polares.';
  override history = 'Su estudio se encuadra dentro de las curvas polares clásicas, donde la relación entre radio y ángulo genera patrones con divisiones angularmente regulares. Tiene un atractivo visual muy notable y aparece con frecuencia en geometría visual y en la ilustración de simetrías discretas.';
  override practicalUses = 'Se usa de manera didáctica para explicar la influencia del factor angular en la simetría polar y aparece en diseño gráfico, ornamentación matemática y exploración de familias de curvas con varios lóbulos.';
  override bounds: [number, number, number, number] = [-3, 3, -3, 3];
  override paramDefinitions = [{ key: 'a', label: 'a', min: 0.5, max: 3, step: 0.1, value: 1.5 }];
  override kind: 'implicit' | 'parametric' = 'implicit';
  override buildEquation(params: Record<string, number>): string {
    return `$$ r = ${params.a.toFixed(1)}\cos(3\theta) $$`;
  }
  override evaluateImplicit(x: number, y: number, params: Record<string, number>): number {
    const r = Math.hypot(x, y);
    const theta = Math.atan2(y, x);
    return r - params.a * Math.cos(3 * theta);
  }
}
