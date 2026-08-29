import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MathjaxModule } from 'mathjax-angular';
import { ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';
import { CurveArticleBaseComponent } from '../curve-article-base/curve-article-base.component';

@Component({
  selector: 'app-epicycloid-article',
  standalone: true,
  imports: [CommonModule, FormsModule, MathjaxModule, ImplicitCurveGraphComponent],
  templateUrl: './epicycloid-article.component.html',
  styleUrls: ['./epicycloid-article.component.css']
})
export class EpicycloidArticleComponent extends CurveArticleBaseComponent {
  static title = 'Epicicloide';
  static route = 'epicycloid';

  override title = EpicycloidArticleComponent.title;
  override description = 'La epicicloide se genera por la rodadura de una circunferencia alrededor de otra y produce una curva con dientes o puntas periódicas.';
  override history = 'La epicicloide se estudió como parte del análisis de movimientos de rodadura y envolventes en la geometría clásica. Tiene una conexión directa con los mecanismos de engranajes, donde el movimiento circular se transforma en trayectoria compleja.';
  override practicalUses = 'Es muy útil en el diseño de mecanismos, engranajes, trenes de transmisión y simulaciones de movimiento circular. También ayuda a ilustrar cómo las pequeñas variaciones de radios alteran drásticamente la forma final de la curva.';
  override bounds: [number, number, number, number] = [-8, 8, -8, 8];
  override paramDefinitions = [
    { key: 'R', label: 'R', min: 1, max: 6, step: 0.5, value: 3 },
    { key: 'r', label: 'r', min: 0.5, max: 4, step: 0.1, value: 1.2 }
  ];
  override kind: 'implicit' | 'parametric' = 'parametric';
  override buildEquation(params: Record<string, number>): string {
    return `$$ x = (R+r)\cos t - r\cos\left(\frac{R+r}{r}t\right), \quad y = (R+r)\sin t - r\sin\left(\frac{R+r}{r}t\right) $$`;
  }
  protected override paramX = (t: number, params: Record<string, number>) => (params.R + params.r) * Math.cos(t) - params.r * Math.cos(((params.R + params.r) / params.r) * t);
  protected override paramY = (t: number, params: Record<string, number>) => (params.R + params.r) * Math.sin(t) - params.r * Math.sin(((params.R + params.r) / params.r) * t);
  protected override evaluateImplicit = (_x: number, _y: number, _params: Record<string, number>) => 0;
}
