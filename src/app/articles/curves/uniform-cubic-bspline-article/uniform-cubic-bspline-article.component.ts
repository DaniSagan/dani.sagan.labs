import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';

@Component({
  selector: 'app-uniform-cubic-bspline-article',
  standalone: true,
  imports: [FormsModule, RouterLink, FormulaComponent, ImplicitCurveGraphComponent],
  templateUrl: './uniform-cubic-bspline-article.component.html',
  styleUrls: ['./uniform-cubic-bspline-article.component.css', '../curve-widget.css'],
})
export class UniformCubicBsplineCurveArticleComponent implements AfterViewInit {
  static readonly title = "B-spline cúbico uniforme";
  static readonly route = "uniform-cubic-bspline";
  readonly title = UniformCubicBsplineCurveArticleComponent.title;
  readonly generalEquation = "B(t)=\\tfrac16[(1-t)^3P_0+(3t^3-6t^2+4)P_1+(-3t^3+3t^2+3t+1)P_2+t^3P_3]";
  readonly parameterDefinition = {"label":"Altura de control (p)","min":0.2,"max":3,"step":0.1,"value":1.5};
  parameter = this.parameterDefinition.value;
  readonly bounds: [number, number, number, number] = [-2,2,-2,2];
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
    const pts = [[-3, 0], [-1, p], [1, -p], [3, 0]], w = [(1 - t) ** 3, 3 * t ** 3 - 6 * t * t + 4, -3 * t ** 3 + 3 * t * t + 3 * t + 1, t ** 3]; return [0, 1].map(k => w.reduce((sum, value, i) => sum + value * pts[i][k] / 6, 0)) as [number, number];
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
