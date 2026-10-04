import { RouterLink } from '@angular/router';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { curveEquation } from '../curve-equations';
import { ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';
import { CurveArticleBaseComponent } from '../curve-article-base/curve-article-base.component';

@Component({
  selector: 'app-cassini-article',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, FormulaComponent, ImplicitCurveGraphComponent],
  templateUrl: './cassini-article.component.html',
  styleUrls: ['./cassini-article.component.css', '../curve-widget.css']
})
export class CassiniArticleComponent extends CurveArticleBaseComponent {
  static title = 'Óvalos de Cassini';
  static route = 'cassini';

  override title = CassiniArticleComponent.title;
  override generalEquation = curveEquation('cassini');
  override bounds: [number, number, number, number] = [-5, 5, -5, 5];
  override paramDefinitions = [
    { key: 'a', label: 'a', min: 0.5, max: 3, step: 0.1, value: 1.7 },
    { key: 'b', label: 'b', min: 0.5, max: 4, step: 0.1, value: 2.5 }
  ];
  override kind: 'implicit' | 'parametric' = 'implicit';

  override buildEquation(params: Record<string, number>): string {
    return curveEquation('cassini', params);
  }

  override evaluateImplicit(x: number, y: number, params: Record<string, number>): number {
    return Math.hypot(x - params.a, y) * Math.hypot(x + params.a, y) - params.b * params.b;
  }
}
