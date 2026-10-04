import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { curveEquation } from '../curve-equations';
import { ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';
import { CurveArticleBaseComponent } from '../curve-article-base/curve-article-base.component';

@Component({
  selector: 'app-archimedean-spiral-article',
  standalone: true,
  imports: [CommonModule, FormsModule, FormulaComponent, ImplicitCurveGraphComponent],
  templateUrl: './archimedean-spiral-article.component.html',
  styleUrls: ['./archimedean-spiral-article.component.css', '../curve-widget.css']
})
export class ArchimedeanSpiralArticleComponent extends CurveArticleBaseComponent {
  static title = 'Espiral de Arquímedes';
  static route = 'archimedean-spiral';

  override title = ArchimedeanSpiralArticleComponent.title;
  override generalEquation = curveEquation('archimedean-spiral');
  override bounds: [number, number, number, number] = [-8, 8, -8, 8];
  override paramDefinitions = [
    { key: 'a', label: 'a', min: 0.2, max: 3, step: 0.1, value: 0.6 },
    { key: 'b', label: 'b', min: 0.2, max: 2, step: 0.1, value: 0.7 }
  ];
  override kind: 'implicit' | 'parametric' = 'parametric';
  override buildEquation(params: Record<string, number>): string {
    return curveEquation('archimedean-spiral', params);
  }
  protected override paramX = (t: number, params: Record<string, number>) => (params.a + params.b * t) * Math.cos(t);
  protected override paramY = (t: number, params: Record<string, number>) => (params.a + params.b * t) * Math.sin(t);
  protected override evaluateImplicit = (_x: number, _y: number, _params: Record<string, number>) => 0;
}
