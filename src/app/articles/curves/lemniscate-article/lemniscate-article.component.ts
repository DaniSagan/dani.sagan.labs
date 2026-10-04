import { RouterLink } from '@angular/router';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { curveEquation } from '../curve-equations';
import { ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';
import { CurveArticleBaseComponent } from '../curve-article-base/curve-article-base.component';

@Component({
  selector: 'app-lemniscate-article',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, FormulaComponent, ImplicitCurveGraphComponent],
  templateUrl: './lemniscate-article.component.html',
  styleUrls: ['./lemniscate-article.component.css', '../curve-widget.css']
})
export class LemniscateArticleComponent extends CurveArticleBaseComponent {
  static title = 'Lemniscata';
  static route = 'lemniscate';

  override title = LemniscateArticleComponent.title;
  override generalEquation = curveEquation('lemniscate');
  override bounds: [number, number, number, number] = [-4, 4, -3, 3];
  override paramDefinitions = [{ key: 'a', label: 'a', min: 0.5, max: 3, step: 0.1, value: 1.5 }];
  override kind: 'implicit' | 'parametric' = 'implicit';

  override buildEquation(params: Record<string, number>): string {
    return curveEquation('lemniscate', params);
  }

  override evaluateImplicit(x: number, y: number, params: Record<string, number>): number {
    return (x * x + y * y) ** 2 - 2 * params.a * params.a * (x * x - y * y);
  }
}
