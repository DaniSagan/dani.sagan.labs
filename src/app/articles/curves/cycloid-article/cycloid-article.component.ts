import { RouterLink } from '@angular/router';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { curveEquation } from '../curve-equations';
import { ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';
import { CurveArticleBaseComponent } from '../curve-article-base/curve-article-base.component';

@Component({
  selector: 'app-cycloid-article',
  standalone: true,
  imports: [RouterLink,
    CommonModule,
    FormsModule,
    FormulaComponent,
    ImplicitCurveGraphComponent,
  ],
  templateUrl: './cycloid-article.component.html',
  styleUrls: ['./cycloid-article.component.css', '../curve-widget.css'],
})
export class CycloidArticleComponent extends CurveArticleBaseComponent {
  static title = 'Cicloide';
  static route = 'cycloid';

  override title = CycloidArticleComponent.title;
  override generalEquation = curveEquation('cycloid');
  override bounds: [number, number, number, number] = [-8, 8, -3, 5];
  override paramDefinitions = [
    { key: 'a', label: 'a', min: 0.5, max: 3, step: 0.1, value: 1.5 },
  ];
  override kind: 'implicit' | 'parametric' = 'parametric';
  override buildEquation(params: Record<string, number>): string {
    return curveEquation('cycloid', params);
  }
  protected override paramX = (t: number, params: Record<string, number>) =>
    params.a * (t - Math.sin(t));
  protected override paramY = (t: number, params: Record<string, number>) =>
    params.a * (1 - Math.cos(t));
  protected override evaluateImplicit = (
    _x: number,
    _y: number,
    _params: Record<string, number>,
  ) => 0;

  parametricMinValue = -4.0 * Math.PI;
  parametricMaxValue = 4.0 * Math.PI;
}
