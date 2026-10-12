import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';

@Component({
  selector: 'app-catmull-rom-curve-article',
  standalone: true,
  imports: [FormsModule, RouterLink, FormulaComponent, ImplicitCurveGraphComponent],
  templateUrl: './catmull-rom-curve-article.component.html',
  styleUrls: ['./catmull-rom-curve-article.component.css', '../curve-widget.css'],
})
export class CatmullRomCurveArticleComponent implements AfterViewInit {
  static readonly title = "Spline de Catmull–Rom";
  static readonly route = "catmull-rom-curve";
  readonly title = CatmullRomCurveArticleComponent.title;
  readonly generalEquation = "C(t)=\\tfrac12[2P_1+(-P_0+P_2)t+(2P_0-5P_1+4P_2-P_3)t^2+(-P_0+3P_1-3P_2+P_3)t^3]";
  readonly parameterDefinition = {"label":"Altura de control (p)","min":0.2,"max":3,"step":0.1,"value":1.5};
  parameter = this.parameterDefinition.value;
  readonly bounds: [number, number, number, number] = [-2,2,-2.5,2.5];
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
    const pts = [[-3, 0], [-1, p], [1, -p], [3, 0]]; return [0, 1].map(k => 0.5 * (2 * pts[1][k] + (-pts[0][k] + pts[2][k]) * t + (2 * pts[0][k] - 5 * pts[1][k] + 4 * pts[2][k] - pts[3][k]) * t * t + (-pts[0][k] + 3 * pts[1][k] - 3 * pts[2][k] + pts[3][k]) * t ** 3)) as [number, number];
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
