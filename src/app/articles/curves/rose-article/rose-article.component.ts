import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { curveEquation } from '../curve-equations';
import { ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';
import { CurveArticleBaseComponent } from '../curve-article-base/curve-article-base.component';

@Component({
  selector: 'app-rose-article',
  standalone: true,
  imports: [CommonModule, FormsModule, FormulaComponent, ImplicitCurveGraphComponent],
  templateUrl: './rose-article.component.html',
  styleUrls: ['./rose-article.component.css', '../curve-widget.css']
})
export class RoseArticleComponent extends CurveArticleBaseComponent {
  static title = 'Rosa polar';
  static route = 'rose';

  override title = RoseArticleComponent.title;
  override generalEquation = curveEquation('rose');
  override bounds: [number, number, number, number] = [-4, 4, -4, 4];
  override paramDefinitions = [
    { key: 'a', label: 'a', min: 0.5, max: 4, step: 0.1, value: 2 },
    { key: 'k', label: 'k', min: 1, max: 8, step: 1, value: 3 }
  ];
  override kind: 'implicit' | 'parametric' = 'implicit';

  override buildEquation(params: Record<string, number>): string {
    return curveEquation('rose', params);
  }

  override evaluateImplicit(x: number, y: number, params: Record<string, number>): number {
    const r = Math.hypot(x, y);
    const theta = Math.atan2(y, x);
    return r - params.a * Math.cos(params.k * theta);
  }
}
