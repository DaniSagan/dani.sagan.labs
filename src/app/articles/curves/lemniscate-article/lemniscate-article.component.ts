import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MathjaxModule } from 'mathjax-angular';
import { ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';
import { CurveArticleBaseComponent } from '../curve-article-base/curve-article-base.component';

@Component({
  selector: 'app-lemniscate-article',
  standalone: true,
  imports: [CommonModule, FormsModule, MathjaxModule, ImplicitCurveGraphComponent],
  templateUrl: './lemniscate-article.component.html',
  styleUrls: ['./lemniscate-article.component.css']
})
export class LemniscateArticleComponent extends CurveArticleBaseComponent {
  static title = 'Lemniscata';
  static route = 'lemniscate';

  override title = LemniscateArticleComponent.title;
  override description = 'La lemniscata es la curva en forma de ocho que se obtiene como lugar geométrico con propiedades de simetría y equilibrio muy marcadas.';
  override history = 'La lemniscata es famosa por su relación con Bernoulli, quien la estudió en profundidad como una curva con dos lóbulos simétricos. Su nombre procede del latín lemniscus, que significa “lazo” o “cinta”, y refleja la forma que se asemeja a un lazo infinito.';
  override practicalUses = 'Se usa en geometría algebraica como ejemplo paradigmático de curva con simetría bilateral, y aparece en visualizaciones de familias de curvas, teoremas de cónicas y análisis de flujo de energía.';
  override bounds: [number, number, number, number] = [-4, 4, -3, 3];
  override paramDefinitions = [{ key: 'a', label: 'a', min: 0.5, max: 3, step: 0.1, value: 1.5 }];
  override kind: 'implicit' | 'parametric' = 'implicit';

  override buildEquation(params: Record<string, number>): string {
    return `$$ (x^2 + y^2)^2 = 2${params.a.toFixed(1)}^2(x^2 - y^2) $$`;
  }

  override evaluateImplicit(x: number, y: number, params: Record<string, number>): number {
    return (x * x + y * y) ** 2 - 2 * params.a * params.a * (x * x - y * y);
  }
}
