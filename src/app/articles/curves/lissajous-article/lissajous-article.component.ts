import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MathjaxModule } from 'mathjax-angular';
import { ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';
import { CurveArticleBaseComponent } from '../curve-article-base/curve-article-base.component';

@Component({
  selector: 'app-lissajous-article',
  standalone: true,
  imports: [CommonModule, FormsModule, MathjaxModule, ImplicitCurveGraphComponent],
  templateUrl: './lissajous-article.component.html',
  styleUrls: ['./lissajous-article.component.css']
})
export class LissajousArticleComponent extends CurveArticleBaseComponent {
  static title = 'Curva de Lissajous';
  static route = 'lissajous';

  override title = LissajousArticleComponent.title;
  override bounds: [number, number, number, number] = [-3, 3, -3, 3];
  override paramDefinitions = [
    { key: 'a', label: 'a', min: 1, max: 3, step: 0.2, value: 2 },
    { key: 'b', label: 'b', min: 1, max: 5, step: 0.2, value: 3 },
    { key: 'd', label: 'd', min: 0, max: 2, step: 0.1, value: 0.5 }
  ];
  override kind: 'implicit' | 'parametric' = 'parametric';
  override buildEquation(params: Record<string, number>): string {
    return `$$ x = \sin(${params.a.toFixed(1)}t + ${params.d.toFixed(1)}), \quad y = \sin(${params.b.toFixed(1)}t) $$`;
  }
  protected override paramX = (t: number, params: Record<string, number>) => Math.sin(params.a * t + params.d);
  protected override paramY = (t: number, params: Record<string, number>) => Math.sin(params.b * t);
  protected override evaluateImplicit = (_x: number, _y: number, _params: Record<string, number>) => 0;
}
