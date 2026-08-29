import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MathjaxModule } from 'mathjax-angular';
import { ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';
import { CurveArticleBaseComponent } from '../curve-article-base/curve-article-base.component';

@Component({
  selector: 'app-parabola-like-article',
  standalone: true,
  imports: [CommonModule, FormsModule, MathjaxModule, ImplicitCurveGraphComponent],
  templateUrl: './parabola-like-article.component.html',
  styleUrls: ['./parabola-like-article.component.css']
})
export class ParabolaLikeArticleComponent extends CurveArticleBaseComponent {
  static title = 'Curva parabólica general';
  static route = 'parabola-like';

  override title = ParabolaLikeArticleComponent.title;
  override bounds: [number, number, number, number] = [-4, 4, -3, 3];
  override paramDefinitions = [
    { key: 'a', label: 'a', min: 0.5, max: 3, step: 0.1, value: 1.5 },
    { key: 'b', label: 'b', min: 0.5, max: 3, step: 0.1, value: 1.2 }
  ];
  override kind: 'implicit' | 'parametric' = 'implicit';
  override buildEquation(params: Record<string, number>): string {
    return `$$ \frac{x^2}{a^2} + \frac{y^2}{b^2} = 1 + x^2 $$`;
  }
  override evaluateImplicit(x: number, y: number, params: Record<string, number>): number {
    return (x * x / (params.a * params.a)) + (y * y / (params.b * params.b)) - 1 - x * x;
  }
}
