import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MathjaxModule } from 'mathjax-angular';
import { ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';
import { CurveArticleBaseComponent } from '../curve-article-base/curve-article-base.component';

@Component({
  selector: 'app-lemniscate-article',
  standalone: true,
  imports: [CommonModule, FormsModule, MathjaxModule, ImplicitCurveGraphComponent],
  templateUrl: './lemniscate-article.component.html',
  styleUrls: ['./lemniscate-article.component.css']
})
export class LemniscateArticleComponent extends CurveArticleBaseComponent {
  static title = 'Lemniscata';
  static route = 'lemniscate';

  override title = LemniscateArticleComponent.title;
  override bounds: [number, number, number, number] = [-4, 4, -3, 3];
  override paramDefinitions = [{ key: 'a', label: 'a', min: 0.5, max: 3, step: 0.1, value: 1.5 }];
  override kind: 'implicit' | 'parametric' = 'implicit';

  override buildEquation(params: Record<string, number>): string {
    return `$$ (x^2 + y^2)^2 = 2${params.a.toFixed(1)}^2(x^2 - y^2) $$`;
  }

  override evaluateImplicit(x: number, y: number, params: Record<string, number>): number {
    return (x * x + y * y) ** 2 - 2 * params.a * params.a * (x * x - y * y);
  }
}
