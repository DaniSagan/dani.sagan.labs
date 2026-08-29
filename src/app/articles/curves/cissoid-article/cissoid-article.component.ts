import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MathjaxModule } from 'mathjax-angular';
import { ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';
import { CurveArticleBaseComponent } from '../curve-article-base/curve-article-base.component';

@Component({
  selector: 'app-cissoid-article',
  standalone: true,
  imports: [CommonModule, FormsModule, MathjaxModule, ImplicitCurveGraphComponent],
  templateUrl: './cissoid-article.component.html',
  styleUrls: ['./cissoid-article.component.css']
})
export class CissoidArticleComponent extends CurveArticleBaseComponent {
  static title = 'Cisoide de Diocles';
  static route = 'cissoid';

  override title = CissoidArticleComponent.title;
  override bounds: [number, number, number, number] = [-6, 6, -6, 6];
  override paramDefinitions = [{ key: 'a', label: 'a', min: 0.5, max: 3, step: 0.1, value: 1.4 }];
  override kind: 'implicit' | 'parametric' = 'implicit';
  override buildEquation(params: Record<string, number>): string {
    return `$$ y^2 = \frac{x^3}{2a - x} $$`;
  }
  override evaluateImplicit(x: number, y: number, params: Record<string, number>): number {
    return y * y - (x * x * x / (2 * params.a - x));
  }
}
