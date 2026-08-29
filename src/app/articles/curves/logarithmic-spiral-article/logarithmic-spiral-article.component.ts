import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MathjaxModule } from 'mathjax-angular';
import { ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';
import { CurveArticleBaseComponent } from '../curve-article-base/curve-article-base.component';

@Component({
  selector: 'app-logarithmic-spiral-article',
  standalone: true,
  imports: [CommonModule, FormsModule, MathjaxModule, ImplicitCurveGraphComponent],
  templateUrl: './logarithmic-spiral-article.component.html',
  styleUrls: ['./logarithmic-spiral-article.component.css']
})
export class LogarithmicSpiralArticleComponent extends CurveArticleBaseComponent {
  static title = 'Espiral logarítmica';
  static route = 'logarithmic-spiral';

  override title = LogarithmicSpiralArticleComponent.title;
  override description = 'La espiral logarítmica crece de manera geométrica con el ángulo, conservando su forma aunque se amplíe o reduzca su escala.';
  override history = 'La espiral logarítmica fue estudiada por Descartes y posteriormente por Jacob Bernoulli, quien quedó fascinado por su invarianza bajo escalado. La curva aparece en la naturaleza y en la historia del análisis matemático.';
  override practicalUses = 'Se observa en conchas marinas, galaxias espirales y patrones de crecimiento; además, en ingeniería y diseño sirve para modelar progresiones geométricas y trayectorias con expansión constante.';
  override bounds: [number, number, number, number] = [-12, 12, -12, 12];
  override paramDefinitions = [
    { key: 'a', label: 'a', min: 0.2, max: 2, step: 0.1, value: 0.8 },
    { key: 'b', label: 'b', min: 0.2, max: 1, step: 0.05, value: 0.35 }
  ];
  override kind: 'implicit' | 'parametric' = 'parametric';
  override buildEquation(params: Record<string, number>): string {
    return `$$ r = ${params.a.toFixed(1)}e^{${params.b.toFixed(2)}\theta} $$`;
  }
  protected override paramX = (t: number, params: Record<string, number>) => params.a * Math.exp(params.b * t) * Math.cos(t);
  protected override paramY = (t: number, params: Record<string, number>) => params.a * Math.exp(params.b * t) * Math.sin(t);
  protected override evaluateImplicit = (_x: number, _y: number, _params: Record<string, number>) => 0;
}
