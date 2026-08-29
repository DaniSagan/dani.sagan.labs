import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MathjaxModule } from 'mathjax-angular';
import { ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';
import { CurveArticleBaseComponent } from '../curve-article-base/curve-article-base.component';

@Component({
  selector: 'app-cycloid-article',
  standalone: true,
  imports: [CommonModule, FormsModule, MathjaxModule, ImplicitCurveGraphComponent],
  templateUrl: './cycloid-article.component.html',
  styleUrls: ['./cycloid-article.component.css']
})
export class CycloidArticleComponent extends CurveArticleBaseComponent {
  static title = 'Cicloide';
  static route = 'cycloid';

  override title = CycloidArticleComponent.title;
  override description = 'La cicloide es la trayectoria de un punto de una rueda en giro; su forma ondulada es uno de los ejemplos clásicos de curva de rodadura.';
  override history = 'La cicloide fue estudiada por Galileo y por varios matemáticos del siglo XVII. Se volvió famosa por su relación con problemas de optimización y por su papel en la historia del cálculo.';
  override practicalUses = 'Es un modelo clásico en ingeniería mecánica, especialmente en mecanismos de rotación y en la construcción de perfiles de ruedas. También aparece en problemas de óptica y dinámica por sus propiedades de rapidez y aceleración.';
  override bounds: [number, number, number, number] = [-8, 8, -3, 5];
  override paramDefinitions = [{ key: 'a', label: 'a', min: 0.5, max: 3, step: 0.1, value: 1.5 }];
  override kind: 'implicit' | 'parametric' = 'parametric';
  override buildEquation(params: Record<string, number>): string {
    return `$$ x = a(t - \sin t), \quad y = a(1 - \cos t) $$`;
  }
  protected override paramX = (t: number, params: Record<string, number>) => params.a * (t - Math.sin(t));
  protected override paramY = (t: number, params: Record<string, number>) => params.a * (1 - Math.cos(t));
  protected override evaluateImplicit = (_x: number, _y: number, _params: Record<string, number>) => 0;
}
