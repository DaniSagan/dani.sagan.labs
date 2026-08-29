import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MathjaxModule } from 'mathjax-angular';
import { ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';
import { CurveArticleBaseComponent } from '../curve-article-base/curve-article-base.component';

@Component({
  selector: 'app-deltoid-article',
  standalone: true,
  imports: [CommonModule, FormsModule, MathjaxModule, ImplicitCurveGraphComponent],
  templateUrl: './deltoid-article.component.html',
  styleUrls: ['./deltoid-article.component.css']
})
export class DeltoidArticleComponent extends CurveArticleBaseComponent {
  static title = 'Deltoide';
  static route = 'deltoid';

  override title = DeltoidArticleComponent.title;
  override bounds: [number, number, number, number] = [-4, 4, -4, 4];
  override paramDefinitions = [{ key: 'a', label: 'a', min: 0.5, max: 3, step: 0.1, value: 1.4 }];
  override kind: 'implicit' | 'parametric' = 'parametric';
  override buildEquation(params: Record<string, number>): string {
    return `$$ x = 2a\cos t + a\cos 2t, \quad y = 2a\sin t - a\sin 2t $$`;
  }
  protected override paramX = (t: number, params: Record<string, number>) => 2 * params.a * Math.cos(t) + params.a * Math.cos(2 * t);
  protected override paramY = (t: number, params: Record<string, number>) => 2 * params.a * Math.sin(t) - params.a * Math.sin(2 * t);
  protected override evaluateImplicit = (_x: number, _y: number, _params: Record<string, number>) => 0;
}
