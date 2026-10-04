import { RouterLink } from '@angular/router';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { curveEquation } from '../curve-equations';
import { ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';
import { CurveArticleBaseComponent } from '../curve-article-base/curve-article-base.component';

@Component({
  selector: 'app-cardioid-article',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, FormulaComponent, ImplicitCurveGraphComponent],
  templateUrl: './cardioid-article.component.html',
  styleUrls: ['./cardioid-article.component.css', '../curve-widget.css']
})
export class CardioidArticleComponent extends CurveArticleBaseComponent {
  static title = 'Cardioide';
  static route = 'cardioid';

  override title = CardioidArticleComponent.title;
  override generalEquation = curveEquation('cardioid');
  override bounds: [number, number, number, number] = [-4, 4, -3, 3];
  override paramDefinitions = [{ key: 'a', label: 'a', min: 0.5, max: 3, step: 0.1, value: 1 }];
  override kind: 'implicit' | 'parametric' = 'implicit';

  override buildEquation(params: Record<string, number>): string {
    return curveEquation('cardioid', params);
  }

  override evaluateImplicit(x: number, y: number, params: Record<string, number>): number {
    const r = Math.hypot(x, y);
    const theta = Math.atan2(y, x);
    return r - params.a * (1 + Math.cos(theta));
  }
}
