import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';

@Component({
  selector: 'app-lagrange-interpolation-curve-article',
  standalone: true,
  imports: [FormsModule, RouterLink, FormulaComponent, ImplicitCurveGraphComponent],
  templateUrl: './lagrange-interpolation-curve-article.component.html',
  styleUrls: ['./lagrange-interpolation-curve-article.component.css', '../curve-widget.css'],
})
export class LagrangeInterpolationCurveArticleComponent implements AfterViewInit {
  static readonly title = "Curva interpoladora de Lagrange";
  static readonly route = "lagrange-interpolation-curve";
  readonly title = LagrangeInterpolationCurveArticleComponent.title;
  readonly generalEquation = "y=\\sum_{i=0}^4 y_i\\prod_{j\\ne i}\\frac{x-x_j}{x_i-x_j},\\quad (x_i,y_i)=(-2,0),(-1,p),(0,0),(1,-1),(2,1)";
  readonly parameterDefinition = {"label":"Altura de control (p)","min":0.2,"max":3,"step":0.1,"value":1.5};
  parameter = this.parameterDefinition.value;
  readonly bounds: [number, number, number, number] = [-2.5,2.5,-3,4];
  readonly ranges: [number, number][] = [[-2,2]];
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
    const xs = [-2, -1, 0, 1, 2], ys = [0, p, 0, -1, 1]; let y = 0; for (let i = 0; i < 5; i++) { let b = 1; for (let j = 0; j < 5; j++) if (i !== j) b *= (t - xs[j]) / (xs[i] - xs[j]); y += ys[i] * b; } return [t, y];
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
