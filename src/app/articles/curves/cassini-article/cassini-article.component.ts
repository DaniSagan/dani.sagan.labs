import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MathjaxModule } from 'mathjax-angular';
import { ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';
import { CurveArticleBaseComponent } from '../curve-article-base/curve-article-base.component';

@Component({
  selector: 'app-cassini-article',
  standalone: true,
  imports: [CommonModule, FormsModule, MathjaxModule, ImplicitCurveGraphComponent],
  templateUrl: './cassini-article.component.html',
  styleUrls: ['./cassini-article.component.css']
})
export class CassiniArticleComponent extends CurveArticleBaseComponent {
  static title = 'Óvalos de Cassini';
  static route = 'cassini';

  override title = CassiniArticleComponent.title;
  override description = 'Los óvalos de Cassini son una familia de curvas cuya propiedad fundamental es que el producto de las distancias a dos focos se mantiene constante.';
  override history = 'Su estudio se atribuye a Giovanni Domenico Cassini, astrónomo y matemático del siglo XVII, quien las investigó en relación con la órbita de los planetas y la geometría del espacio.';
  override practicalUses = 'Estas curvas aparecen en problemas de distancia focal, en óptica geométrica y en la modelización de órbitas y trayectorias con simetría bifocal. También sirven como ilustración de cómo una condición de producto constante genera formas muy distintas según los parámetros.';
  override bounds: [number, number, number, number] = [-5, 5, -5, 5];
  override paramDefinitions = [
    { key: 'a', label: 'a', min: 0.5, max: 3, step: 0.1, value: 1.7 },
    { key: 'b', label: 'b', min: 0.5, max: 4, step: 0.1, value: 2.5 }
  ];
  override kind: 'implicit' | 'parametric' = 'implicit';

  override buildEquation(params: Record<string, number>): string {
    return `$$ \sqrt{(x-a)^2+y^2}\sqrt{(x+a)^2+y^2} = ${params.b.toFixed(1)}^2 $$`;
  }

  override evaluateImplicit(x: number, y: number, params: Record<string, number>): number {
    return Math.hypot(x - params.a, y) * Math.hypot(x + params.a, y) - params.b * params.b;
  }
}
