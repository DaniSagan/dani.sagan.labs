import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MathjaxModule } from 'mathjax-angular';
import { ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';
import { CurveArticleBaseComponent } from '../curve-article-base/curve-article-base.component';

@Component({
  selector: 'app-archimedean-spiral-article',
  standalone: true,
  imports: [CommonModule, FormsModule, MathjaxModule, ImplicitCurveGraphComponent],
  templateUrl: './archimedean-spiral-article.component.html',
  styleUrls: ['./archimedean-spiral-article.component.css']
})
export class ArchimedeanSpiralArticleComponent extends CurveArticleBaseComponent {
  static title = 'Espiral de Arquímedes';
  static route = 'archimedean-spiral';

  override title = ArchimedeanSpiralArticleComponent.title;
  override description = 'La espiral de Arquímedes es una curva polar en la que la distancia al origen crece linealmente con el ángulo, produciendo un giro regular y uniforme.';
  override history = 'Debe su nombre a Arquímedes, quien la estudió en la antigüedad y la usó como ejemplo de un crecimiento continuo con el ángulo. Fue una de las primeras curvas de la geometría polar en ser analizadas de forma sistemática.';
  override practicalUses = 'Se emplea en engranajes, sistemas de diseño de espiras, antenas, mecanismos de escaneo y modelos de crecimiento radial. En física y meteorología también sirve como primera aproximación a patrones de expansión con simetría angular.';
  override bounds: [number, number, number, number] = [-8, 8, -8, 8];
  override paramDefinitions = [
    { key: 'a', label: 'a', min: 0.2, max: 3, step: 0.1, value: 0.6 },
    { key: 'b', label: 'b', min: 0.2, max: 2, step: 0.1, value: 0.7 }
  ];
  override kind: 'implicit' | 'parametric' = 'parametric';
  override buildEquation(params: Record<string, number>): string {
    return `$$ r = ${params.a.toFixed(1)} + ${params.b.toFixed(1)}\theta $$`;
  }
  protected override paramX = (t: number, params: Record<string, number>) => (params.a + params.b * t) * Math.cos(t);
  protected override paramY = (t: number, params: Record<string, number>) => (params.a + params.b * t) * Math.sin(t);
  protected override evaluateImplicit = (_x: number, _y: number, _params: Record<string, number>) => 0;
}
