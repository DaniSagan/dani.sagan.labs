import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { GraphableFunction, ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';

@Component({
  selector: 'app-gutschoven-kappa-article',
  standalone: true,
  imports: [FormsModule, RouterLink, FormulaComponent, ImplicitCurveGraphComponent],
  templateUrl: './gutschoven-kappa-article.component.html',
  styleUrls: ['./gutschoven-kappa-article.component.css', '../curve-widget.css'],
})
export class GutschovenKappaCurveArticleComponent implements AfterViewInit {
  static readonly title = "Curva kappa de Gutschoven";
  static readonly route = "gutschoven-kappa";
  readonly title = GutschovenKappaCurveArticleComponent.title;
  readonly generalEquation = "v^2(u^2+v^2)=u^2\\quad u=x/p,\\ v=y/p,\\ p>0";
  readonly parameterDefinition = {"label":"Escala (p)","min":0.5,"max":1.5,"step":0.05,"value":1};
  parameter = this.parameterDefinition.value;
  readonly bounds: [number, number, number, number] = [-4,4,-1.5,1.5];
  @ViewChild('curveGraph', { static: true }) curveGraph!: ImplicitCurveGraphComponent;

  ngAfterViewInit(): void { this.onDraw(); }

  onParameterChanged(value: number): void {
    if (value === null || !Number.isFinite(value)) return;
    const { min, max, step } = this.parameterDefinition;
    const bounded = Math.max(min, Math.min(max, value));
    this.parameter = Number((min + Math.round((bounded - min) / step) * step).toPrecision(12));
    this.onDraw();
  }

  reset(): void { this.parameter = this.parameterDefinition.value; this.onDraw(); }

  getEquation(): string { return this.generalEquation + '\\quad p=' + this.parameter; }

  evaluateImplicit(x: number, y: number): number {
    const p = this.parameter, u = x / p, v = y / p;
    return v * v * (u * u + v * v) - u * u;
  }

  onDraw(): void {
    if (!this.curveGraph) return;
    this.curveGraph.setBounds(...this.bounds);
    this.curveGraph.functions = [new GraphableFunction((x: number, y: number) => this.evaluateImplicit(x, y), '#ef6b5b')];
    this.curveGraph.drawGraph();
  }
}
