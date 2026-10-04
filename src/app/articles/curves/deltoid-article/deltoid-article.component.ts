import { RouterLink } from '@angular/router';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { curveEquation } from '../curve-equations';
import { ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';
import { CurveArticleBaseComponent } from '../curve-article-base/curve-article-base.component';

@Component({
  selector: 'app-deltoid-article',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, FormulaComponent, ImplicitCurveGraphComponent],
  templateUrl: './deltoid-article.component.html',
  styleUrls: ['./deltoid-article.component.css', '../curve-widget.css']
})
export class DeltoidArticleComponent extends CurveArticleBaseComponent {
  static title = 'Deltoide';
  static route = 'deltoid';

  override title = DeltoidArticleComponent.title;
  override generalEquation = curveEquation('deltoid');
  override bounds: [number, number, number, number] = [-4, 4, -4, 4];
  override paramDefinitions = [{ key: 'a', label: 'a', min: 0.5, max: 3, step: 0.1, value: 1.4 }];
  override kind: 'implicit' | 'parametric' = 'parametric';
  override buildEquation(params: Record<string, number>): string {
    return curveEquation('deltoid', params);
  }
  protected override paramX = (t: number, params: Record<string, number>) => 2 * params.a * Math.cos(t) + params.a * Math.cos(2 * t);
  protected override paramY = (t: number, params: Record<string, number>) => 2 * params.a * Math.sin(t) - params.a * Math.sin(2 * t);
  protected override evaluateImplicit = (_x: number, _y: number, _params: Record<string, number>) => 0;
}
