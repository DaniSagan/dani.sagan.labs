import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { curveEquation } from '../curve-equations';
import { ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';
import { CurveArticleBaseComponent } from '../curve-article-base/curve-article-base.component';

@Component({
  selector: 'app-logarithmic-spiral-article',
  standalone: true,
  imports: [CommonModule, FormsModule, FormulaComponent, ImplicitCurveGraphComponent],
  templateUrl: './logarithmic-spiral-article.component.html',
  styleUrls: ['./logarithmic-spiral-article.component.css', '../curve-widget.css']
})
export class LogarithmicSpiralArticleComponent extends CurveArticleBaseComponent {
  static title = 'Espiral logarítmica';
  static route = 'logarithmic-spiral';

  override title = LogarithmicSpiralArticleComponent.title;
  override generalEquation = curveEquation('logarithmic-spiral');
  override bounds: [number, number, number, number] = [-12, 12, -12, 12];
  override paramDefinitions = [
    { key: 'a', label: 'a', min: 0.2, max: 2, step: 0.1, value: 0.8 },
    { key: 'b', label: 'b', min: 0.2, max: 1, step: 0.05, value: 0.35 }
  ];
  override kind: 'implicit' | 'parametric' = 'parametric';
  override buildEquation(params: Record<string, number>): string {
    return curveEquation('logarithmic-spiral', params);
  }
  protected override paramX = (t: number, params: Record<string, number>) => params.a * Math.exp(params.b * t) * Math.cos(t);
  protected override paramY = (t: number, params: Record<string, number>) => params.a * Math.exp(params.b * t) * Math.sin(t);
  protected override evaluateImplicit = (_x: number, _y: number, _params: Record<string, number>) => 0;
}
