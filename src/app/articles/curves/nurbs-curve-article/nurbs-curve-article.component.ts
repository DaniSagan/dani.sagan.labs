import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';

@Component({
  selector: 'app-nurbs-curve-article',
  standalone: true,
  imports: [FormsModule, RouterLink, FormulaComponent, ImplicitCurveGraphComponent],
  templateUrl: './nurbs-curve-article.component.html',
  styleUrls: ['./nurbs-curve-article.component.css', '../curve-widget.css'],
})
export class NurbsCurveArticleComponent implements AfterViewInit {
  static readonly title = "Curva NURBS";
  static readonly route = "nurbs-curve";
  readonly title = NurbsCurveArticleComponent.title;
  readonly generalEquation = "C(t)=\\frac{\\sum_i w_iN_{i,2}(t)P_i}{\\sum_i w_iN_{i,2}(t)}";
  readonly parameterDefinition = {"label":"Peso del segundo control (p)","min":0.2,"max":3,"step":0.1,"value":1.5};
  parameter = this.parameterDefinition.value;
  readonly bounds: [number, number, number, number] = [-3,3,-2,3];
  readonly ranges: [number, number][] = [[0,1]];
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

  point(t: number): [number, number] {
    const p = this.parameter;
    if (t >= 1) return [2, 0]; const pts = [[-2, 0], [-1, 2], [1, -1], [2, 0]], weights = [1, p, 1, 1]; let x = 0, y = 0, d = 0; for (let i = 0; i < 4; i++) { const b = weights[i] * this.basis(i, 2, t); x += b * pts[i][0]; y += b * pts[i][1]; d += b; } return [x / d, y / d];
  }

  private basis(i: number, degree: number, t: number): number {
    const knots = [0, 0, 0, 0.5, 1, 1, 1];
    if (degree === 0) return knots[i] <= t && t < knots[i + 1] ? 1 : 0;
    const left = knots[i + degree] - knots[i], right = knots[i + degree + 1] - knots[i + 1];
    return (left ? (t - knots[i]) / left * this.basis(i, degree - 1, t) : 0) + (right ? (knots[i + degree + 1] - t) / right * this.basis(i + 1, degree - 1, t) : 0);
  }

  onDraw(): void {
    if (!this.curveGraph) return;
    this.curveGraph.setBounds(...this.bounds);
    this.curveGraph.clear();
    this.curveGraph.drawAxes();
    this.curveGraph.draw((ctx: CanvasRenderingContext2D) => {
      ctx.beginPath();
      ctx.strokeStyle = '#ef6b5b';
      ctx.lineWidth = 2;
      for (const [start, end] of this.ranges) {
        let previous: { x: number; y: number } | null = null;
        for (let i = 0; i <= 1600; i++) {
          const t = start + (end - start) * i / 1600;
          const [x, y] = this.point(t);
          if (!Number.isFinite(x) || !Number.isFinite(y)) { previous = null; continue; }
          const pixel = { x: this.curveGraph.xToPixel(x), y: this.curveGraph.yToPixel(y) };
          const limit = this.curveGraph.canvas.nativeElement.width;
          if (pixel.x < -limit || pixel.x > 2 * limit || pixel.y < -limit || pixel.y > 2 * limit) { previous = null; continue; }
          if (!previous || Math.hypot(pixel.x - previous.x, pixel.y - previous.y) > limit / 4) ctx.moveTo(pixel.x, pixel.y);
          else ctx.lineTo(pixel.x, pixel.y);
          previous = pixel;
        }
      }
      ctx.stroke();
    });
  }
}
