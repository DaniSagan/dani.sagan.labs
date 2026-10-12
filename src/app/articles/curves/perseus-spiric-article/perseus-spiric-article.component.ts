import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { GraphableFunction, ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';

@Component({
  selector: 'app-perseus-spiric-article',
  standalone: true,
  imports: [FormsModule, RouterLink, FormulaComponent, ImplicitCurveGraphComponent],
  templateUrl: './perseus-spiric-article.component.html',
  styleUrls: ['./perseus-spiric-article.component.css', '../curve-widget.css'],
})
export class PerseusSpiricCurveArticleComponent implements AfterViewInit {
  static readonly title = "Secciones espíricas de Perseo";
  static readonly route = "perseus-spiric";
  readonly title = PerseusSpiricCurveArticleComponent.title;
  readonly generalEquation = "(u^2+v^2+3+c^2)^2=16(u^2+c^2),\\quad c=1.5\\quad u=x/p,\\ v=y/p,\\ p>0";
  readonly parameterDefinition = {"label":"Escala (p)","min":0.5,"max":1.5,"step":0.05,"value":1};
  parameter = this.parameterDefinition.value;
  readonly bounds: [number, number, number, number] = [-3.5,3.5,-2,2];
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
    return (u * u + v * v + 5.25) ** 2 - 16 * (u * u + 2.25);
  }

  onDraw(): void {
    if (!this.curveGraph) return;
    this.curveGraph.setBounds(...this.bounds);
    this.curveGraph.functions = [new GraphableFunction((x: number, y: number) => this.evaluateImplicit(x, y), '#ef6b5b')];
    this.curveGraph.drawGraph();
  }
}
