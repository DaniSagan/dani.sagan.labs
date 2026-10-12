import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { GraphableFunction, ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';

@Component({
  selector: 'app-cartesian-oval-article',
  standalone: true,
  imports: [FormsModule, RouterLink, FormulaComponent, ImplicitCurveGraphComponent],
  templateUrl: './cartesian-oval-article.component.html',
  styleUrls: ['./cartesian-oval-article.component.css', '../curve-widget.css'],
})
export class CartesianOvalCurveArticleComponent implements AfterViewInit {
  static readonly title = "Óvalo cartesiano de Descartes";
  static readonly route = "cartesian-oval";
  readonly title = CartesianOvalCurveArticleComponent.title;
  readonly generalEquation = "\\sqrt{(u+1)^2+v^2}+2\\sqrt{(u-1)^2+v^2}=4\\quad u=x/p,\\ v=y/p,\\ p>0";
  readonly parameterDefinition = {"label":"Escala (p)","min":0.5,"max":1.5,"step":0.05,"value":1};
  parameter = this.parameterDefinition.value;
  readonly bounds: [number, number, number, number] = [-2.5,2.5,-2.5,2.5];
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
    return Math.hypot(u + 1, v) + 2 * Math.hypot(u - 1, v) - 4;
  }

  onDraw(): void {
    if (!this.curveGraph) return;
    this.curveGraph.setBounds(...this.bounds);
    this.curveGraph.functions = [new GraphableFunction((x: number, y: number) => this.evaluateImplicit(x, y), '#ef6b5b')];
    this.curveGraph.drawGraph();
  }
}
