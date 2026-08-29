import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MathjaxModule } from 'mathjax-angular';
import { ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';
import { CurveArticleBaseComponent } from '../curve-article-base/curve-article-base.component';

@Component({
  selector: 'app-cardioid-article',
  standalone: true,
  imports: [CommonModule, FormsModule, MathjaxModule, ImplicitCurveGraphComponent],
  templateUrl: './cardioid-article.component.html',
  styleUrls: ['./cardioid-article.component.css']
})
export class CardioidArticleComponent extends CurveArticleBaseComponent {
  static title = 'Cardioide';
  static route = 'cardioid';

  override title = CardioidArticleComponent.title;
  override description = 'La cardioide es una curva polar con forma de corazón que aparece como caso límite de familias de curvas en óptica, mecánica y geometría clásica.';
  override history = 'La cardioide fue estudiada por matemáticos del siglo XVII, y su nombre procede del griego kardioeidēs, que significa “parecido a un corazón”. Se convirtió en un ejemplo clásico de curva polar por su belleza geométrica y su fácil construcción con un punto fijo sobre una circunferencia.';
  override practicalUses = 'En óptica y acústica aparece en la reflexión de rayos y en la modelización de señales con simetría circular; además, se usa como ejemplo de envolvente y curva de diseño en geometría aplicada y arte.';
  override bounds: [number, number, number, number] = [-4, 4, -3, 3];
  override paramDefinitions = [{ key: 'a', label: 'a', min: 0.5, max: 3, step: 0.1, value: 1 }];
  override kind: 'implicit' | 'parametric' = 'implicit';

  override buildEquation(params: Record<string, number>): string {
    return `$$ r = ${params.a.toFixed(1)}(1 + \cos\theta) $$`;
  }

  override evaluateImplicit(x: number, y: number, params: Record<string, number>): number {
    const r = Math.hypot(x, y);
    const theta = Math.atan2(y, x);
    return r - params.a * (1 + Math.cos(theta));
  }
}
