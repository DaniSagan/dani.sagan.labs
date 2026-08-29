import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MathjaxModule } from 'mathjax-angular';
import { ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';
import { CurveArticleBaseComponent } from '../curve-article-base/curve-article-base.component';

@Component({
  selector: 'app-rose-article',
  standalone: true,
  imports: [CommonModule, FormsModule, MathjaxModule, ImplicitCurveGraphComponent],
  templateUrl: './rose-article.component.html',
  styleUrls: ['./rose-article.component.css']
})
export class RoseArticleComponent extends CurveArticleBaseComponent {
  static title = 'Rosa polar';
  static route = 'rose';

  override title = RoseArticleComponent.title;
  override description = 'La rosa polar es una familia de curvas con pétalos simétricos cuya forma depende del factor angular k, y aparece como un modelo visual muy útil en geometría polar.';
  override history = 'Aunque la curva se conoce por tradición matemática moderna, ya aparece en la tradición geométrica del siglo XVIII y se asocia con los estudios sistemáticos de curvas polares. Su apariencia floral la hizo especialmente atractiva para la educación y la investigación visual.';
  override practicalUses = 'La rosa polar sirve para modelar simetrías, patrones de resonancia y formas periódicas en dibujo técnico, diseño y visualización de fenómenos con simetría angular. También ayuda a entender la relación entre ecuaciones polares y rotaciones.';
  override bounds: [number, number, number, number] = [-4, 4, -4, 4];
  override paramDefinitions = [
    { key: 'a', label: 'a', min: 0.5, max: 4, step: 0.1, value: 2 },
    { key: 'k', label: 'k', min: 1, max: 8, step: 1, value: 3 }
  ];
  override kind: 'implicit' | 'parametric' = 'implicit';

  override buildEquation(params: Record<string, number>): string {
    return `$$ r = ${params.a.toFixed(1)}\cos(${params.k}\theta) $$`;
  }

  override evaluateImplicit(x: number, y: number, params: Record<string, number>): number {
    const r = Math.hypot(x, y);
    const theta = Math.atan2(y, x);
    return r - params.a * Math.cos(params.k * theta);
  }
}
