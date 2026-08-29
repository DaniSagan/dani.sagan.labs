import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MathjaxModule } from 'mathjax-angular';
import { ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';
import { CurveArticleBaseComponent } from '../curve-article-base/curve-article-base.component';

@Component({
  selector: 'app-hypocycloid-article',
  standalone: true,
  imports: [CommonModule, FormsModule, MathjaxModule, ImplicitCurveGraphComponent],
  templateUrl: './hypocycloid-article.component.html',
  styleUrls: ['./hypocycloid-article.component.css']
})
export class HypocycloidArticleComponent extends CurveArticleBaseComponent {
  static title = 'Hipocicloide';
  static route = 'hypocycloid';

  override title = HypocycloidArticleComponent.title;
  override description = 'La hipocicloide se obtiene al rodar una circunferencia dentro de otra, y produce curvas con múltiples puntas que dependen de la razón entre radios.';
  override history = 'Esta familia de curvas se estudió en geometría clásica como ejemplo de trayectorias producidas por movimiento de rodadura. Su interés reside en la conexión entre una construcción mecánica simple y una forma geométrica muy rica.';
  override practicalUses = 'Ejemplifica mecanismos de transmisión, diseño ornamental y construcción de perfiles con simetría radial. A menudo se usa para mostrar cómo una pequeña modifica el número de puntas de la curva.';
  override bounds: [number, number, number, number] = [-8, 8, -8, 8];
  override paramDefinitions = [
    { key: 'R', label: 'R', min: 2, max: 8, step: 0.5, value: 5 },
    { key: 'r', label: 'r', min: 0.5, max: 3, step: 0.1, value: 1.5 }
  ];
  override kind: 'implicit' | 'parametric' = 'parametric';
  override buildEquation(params: Record<string, number>): string {
    return `$$ x = (R-r)\cos t + r\cos\left(\frac{R-r}{r}t\right), \quad y = (R-r)\sin t - r\sin\left(\frac{R-r}{r}t\right) $$`;
  }
  protected override paramX = (t: number, params: Record<string, number>) => (params.R - params.r) * Math.cos(t) + params.r * Math.cos(((params.R - params.r) / params.r) * t);
  protected override paramY = (t: number, params: Record<string, number>) => (params.R - params.r) * Math.sin(t) - params.r * Math.sin(((params.R - params.r) / params.r) * t);
  protected override evaluateImplicit = (_x: number, _y: number, _params: Record<string, number>) => 0;
}
