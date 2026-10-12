import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';

@Component({
  selector: 'app-rational-bezier-curve-article',
  standalone: true,
  imports: [FormsModule, RouterLink, FormulaComponent, ImplicitCurveGraphComponent],
  templateUrl: './rational-bezier-curve-article.component.html',
  styleUrls: ['./rational-bezier-curve-article.component.css', '../curve-widget.css'],
})
export class RationalBezierCurveArticleComponent implements AfterViewInit {
  static readonly title = "Curva de Bézier racional";
  static readonly route = "rational-bezier-curve";
  readonly title = RationalBezierCurveArticleComponent.title;
  readonly generalEquation = "B(t)=\\frac{(1-t)^2P_0+2pt(1-t)P_1+t^2P_2}{(1-t)^2+2pt(1-t)+t^2}";
  readonly parameterDefinition = {"label":"Peso central (p)","min":0.2,"max":3,"step":0.1,"value":1};
  parameter = this.parameterDefinition.value;
  readonly bounds: [number, number, number, number] = [-1.8,1.8,-0.5,2.5];
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
    const s = 1 - t, d = s * s + 2 * p * t * s + t * t; return [(t * t - s * s) / d, 4 * p * t * s / d];
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
