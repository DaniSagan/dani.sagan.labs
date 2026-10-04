import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { curveEquation } from '../curve-equations';
import { ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';
import { CurveArticleBaseComponent } from '../curve-article-base/curve-article-base.component';

@Component({
  selector: 'app-conchoid-article',
  standalone: true,
  imports: [CommonModule, FormsModule, FormulaComponent, ImplicitCurveGraphComponent],
  templateUrl: './conchoid-article.component.html',
  styleUrls: ['./conchoid-article.component.css', '../curve-widget.css']
})
export class ConchoidArticleComponent extends CurveArticleBaseComponent {
  static title = 'Concoide de Nicomedes';
  static route = 'conchoid';

  override title = ConchoidArticleComponent.title;
  override generalEquation = curveEquation('conchoid');
  override bounds: [number, number, number, number] = [-8, 8, -8, 8];
  override paramDefinitions = [
    { key: 'a', label: 'a', min: 0.5, max: 4, step: 0.1, value: 1.5 },
    { key: 'b', label: 'b', min: 0.5, max: 4, step: 0.1, value: 2 }
  ];
  override kind: 'implicit' | 'parametric' = 'implicit';
  override buildEquation(params: Record<string, number>): string {
    return curveEquation('conchoid', params);
  }
  override evaluateImplicit(x: number, y: number, params: Record<string, number>): number {
    return (x * x + y * y) * (x - params.a) * (x - params.a) - params.b * params.b * x * x;
  }
}
