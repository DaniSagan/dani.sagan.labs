import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MathjaxModule } from 'mathjax-angular';
import { ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';
import { CurveArticleBaseComponent } from '../curve-article-base/curve-article-base.component';

@Component({
  selector: 'app-astroid-article',
  standalone: true,
  imports: [CommonModule, FormsModule, MathjaxModule, ImplicitCurveGraphComponent],
  templateUrl: './astroid-article.component.html',
  styleUrls: ['./astroid-article.component.css']
})
export class AstroidArticleComponent extends CurveArticleBaseComponent {
  static title = 'Astroide';
  static route = 'astroid';

  override title = AstroidArticleComponent.title;
  override bounds: [number, number, number, number] = [-3, 3, -3, 3];
  override paramDefinitions = [{ key: 'a', label: 'a', min: 0.5, max: 3, step: 0.1, value: 1.8 }];
  override kind: 'implicit' | 'parametric' = 'implicit';
  override buildEquation(params: Record<string, number>): string {
    return `$$ x^{2/3} + y^{2/3} = ${params.a.toFixed(1)}^{2/3} $$`;
  }
  override evaluateImplicit(x: number, y: number, params: Record<string, number>): number {
    return Math.pow(Math.abs(x), 2 / 3) + Math.pow(Math.abs(y), 2 / 3) - Math.pow(params.a, 2 / 3);
  }
}
