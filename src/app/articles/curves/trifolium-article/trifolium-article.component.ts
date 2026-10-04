import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { curveEquation } from '../curve-equations';
import { ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';
import { CurveArticleBaseComponent } from '../curve-article-base/curve-article-base.component';

@Component({
  selector: 'app-trifolium-article',
  standalone: true,
  imports: [CommonModule, FormsModule, FormulaComponent, ImplicitCurveGraphComponent],
  templateUrl: './trifolium-article.component.html',
  styleUrls: ['./trifolium-article.component.css', '../curve-widget.css']
})
export class TrifoliumArticleComponent extends CurveArticleBaseComponent {
  static title = 'Trifolio';
  static route = 'trifolium';

  override title = TrifoliumArticleComponent.title;
  override generalEquation = curveEquation('trifolium');
  override bounds: [number, number, number, number] = [-3, 3, -3, 3];
  override paramDefinitions = [{ key: 'a', label: 'a', min: 0.5, max: 3, step: 0.1, value: 1.5 }];
  override kind: 'implicit' | 'parametric' = 'implicit';
  override buildEquation(params: Record<string, number>): string {
    return curveEquation('trifolium', params);
  }
  override evaluateImplicit(x: number, y: number, params: Record<string, number>): number {
    const r = Math.hypot(x, y);
    const theta = Math.atan2(y, x);
    return r - params.a * Math.cos(3 * theta);
  }
}
