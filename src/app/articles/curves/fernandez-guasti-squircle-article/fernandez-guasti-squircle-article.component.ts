import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { GraphableFunction, ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';

@Component({
  selector: 'app-fernandez-guasti-squircle-article',
  standalone: true,
  imports: [FormsModule, RouterLink, FormulaComponent, ImplicitCurveGraphComponent],
  templateUrl: './fernandez-guasti-squircle-article.component.html',
  styleUrls: ['./fernandez-guasti-squircle-article.component.css', '../curve-widget.css'],
})
export class FernandezGuastiSquircleCurveArticleComponent implements AfterViewInit {
  static readonly title = "Squircle de Fernández-Guasti";
  static readonly route = "fernandez-guasti-squircle";
  readonly title = FernandezGuastiSquircleCurveArticleComponent.title;
  readonly generalEquation = "u^2+v^2-0.8u^2v^2=1,\\quad |u|,|v|\\le1\\quad u=x/p,\\ v=y/p,\\ p>0";
  readonly parameterDefinition = {"label":"Escala (p)","min":0.5,"max":1.5,"step":0.05,"value":1};
  parameter = this.parameterDefinition.value;
  readonly bounds: [number, number, number, number] = [-1.5,1.5,-1.5,1.5];
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
    if (Math.abs(u) > 1 || Math.abs(v) > 1) return NaN; return u * u + v * v - 0.8 * u * u * v * v - 1;
  }

  onDraw(): void {
    if (!this.curveGraph) return;
    this.curveGraph.setBounds(...this.bounds);
    this.curveGraph.functions = [new GraphableFunction((x: number, y: number) => this.evaluateImplicit(x, y), '#ef6b5b')];
    this.curveGraph.drawGraph();
  }
}
