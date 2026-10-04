import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { curveEquation } from '../curve-equations';
import { ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';
import { CurveArticleBaseComponent } from '../curve-article-base/curve-article-base.component';
import { A11yModule } from '@angular/cdk/a11y';

@Component({
  selector: 'app-cissoid-article',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FormulaComponent,
    ImplicitCurveGraphComponent,
    A11yModule
],
  templateUrl: './cissoid-article.component.html',
  styleUrls: ['./cissoid-article.component.css', '../curve-widget.css'],
})
export class CissoidArticleComponent extends CurveArticleBaseComponent {
  static title = 'Cisoide de Diocles';
  static route = 'cissoid';

  override title = CissoidArticleComponent.title;
  override generalEquation = curveEquation('cissoid');
  override bounds: [number, number, number, number] = [-6, 6, -6, 6];
  override paramDefinitions = [
    { key: 'a', label: 'a', min: 0.5, max: 3, step: 0.1, value: 1.4 },
  ];
  override kind: 'implicit' | 'parametric' = 'implicit';
  override buildEquation(params: Record<string, number>): string {
    return curveEquation('cissoid', params);
  }
  override evaluateImplicit(
    x: number,
    y: number,
    params: Record<string, number>,
  ): number {
    return y * y - (x * x * x) / (2 * params.a - x);
  }
}
