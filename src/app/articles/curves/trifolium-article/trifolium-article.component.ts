import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MathjaxModule } from 'mathjax-angular';
import { ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';
import { CurveArticleBaseComponent } from '../curve-article-base/curve-article-base.component';

@Component({
  selector: 'app-trifolium-article',
  standalone: true,
  imports: [CommonModule, FormsModule, MathjaxModule, ImplicitCurveGraphComponent],
  templateUrl: './trifolium-article.component.html',
  styleUrls: ['./trifolium-article.component.css']
})
export class TrifoliumArticleComponent extends CurveArticleBaseComponent {
  static title = 'Trifolio';
  static route = 'trifolium';

  override title = TrifoliumArticleComponent.title;
  override bounds: [number, number, number, number] = [-3, 3, -3, 3];
  override paramDefinitions = [{ key: 'a', label: 'a', min: 0.5, max: 3, step: 0.1, value: 1.5 }];
  override kind: 'implicit' | 'parametric' = 'implicit';
  override buildEquation(params: Record<string, number>): string {
    return `$$ r = ${params.a.toFixed(1)}\cos(3\theta) $$`;
  }
  override evaluateImplicit(x: number, y: number, params: Record<string, number>): number {
    const r = Math.hypot(x, y);
    const theta = Math.atan2(y, x);
    return r - params.a * Math.cos(3 * theta);
  }
}
