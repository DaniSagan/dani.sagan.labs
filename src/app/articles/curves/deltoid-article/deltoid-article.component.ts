import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MathjaxModule } from 'mathjax-angular';
import { ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';
import { CurveArticleBaseComponent } from '../curve-article-base/curve-article-base.component';

@Component({
  selector: 'app-deltoid-article',
  standalone: true,
  imports: [CommonModule, FormsModule, MathjaxModule, ImplicitCurveGraphComponent],
  templateUrl: './deltoid-article.component.html',
  styleUrls: ['./deltoid-article.component.css']
})
export class DeltoidArticleComponent extends CurveArticleBaseComponent {
  static title = 'Deltoide';
  static route = 'deltoid';

  override title = DeltoidArticleComponent.title;
  override description = 'La deltoide es una curva con tres puntas y simetría triangular, muy elegante y con una estructura claramente relacionada con la geometría de las hipocicloides.';
  override history = 'La deltoide forma parte de la familia de las hipocicloides y fue estudiada en geometría clásica como ejemplo de curva generada por rodadura de circunferencias. Su nombre alude a la forma de un triángulo alargado, “deltoide” en referencia a la letra griega delta.';
  override practicalUses = 'Los trazados de la deltoide aparecen en diseño ornamental, mecanismos de transmisión y análisis de envolventes. También resulta útil para comprender cómo trayectorias generadas por rotación producen formas con simetría discreta.';
  override bounds: [number, number, number, number] = [-4, 4, -4, 4];
  override paramDefinitions = [{ key: 'a', label: 'a', min: 0.5, max: 3, step: 0.1, value: 1.4 }];
  override kind: 'implicit' | 'parametric' = 'parametric';
  override buildEquation(params: Record<string, number>): string {
    return `$$ x = 2a\cos t + a\cos 2t, \quad y = 2a\sin t - a\sin 2t $$`;
  }
  protected override paramX = (t: number, params: Record<string, number>) => 2 * params.a * Math.cos(t) + params.a * Math.cos(2 * t);
  protected override paramY = (t: number, params: Record<string, number>) => 2 * params.a * Math.sin(t) - params.a * Math.sin(2 * t);
  protected override evaluateImplicit = (_x: number, _y: number, _params: Record<string, number>) => 0;
}
