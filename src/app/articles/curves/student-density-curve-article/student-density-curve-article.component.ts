import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';
import { gamma } from 'src/app/shared/math/gamma';

@Component({
  selector: 'app-student-density-curve-article',
  standalone: true,
  imports: [FormsModule, RouterLink, FormulaComponent, ImplicitCurveGraphComponent],
  templateUrl: './student-density-curve-article.component.html',
  styleUrls: ['./student-density-curve-article.component.css', '../curve-widget.css'],
})
export class StudentDensityCurveArticleComponent implements AfterViewInit {
  static readonly title = "Curva t de Student";
  static readonly route = "student-density-curve";
  readonly title = StudentDensityCurveArticleComponent.title;
  readonly generalEquation = "x=t,\\quad y=\\frac{\\Gamma((p+1)/2)}{\\sqrt{p\\pi}\\Gamma(p/2)}\\left(1+\\frac{t^2}{p}\\right)^{-(p+1)/2}";
  readonly parameterDefinition = {"label":"Grados de libertad (p)","min":1,"max":30,"step":1,"value":4};
  parameter = this.parameterDefinition.value;
  readonly bounds: [number, number, number, number] = [-6,6,-0.1,0.6];
  readonly ranges: [number, number][] = [[-5,5]];
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
    return [t, gamma((p + 1) / 2) / (Math.sqrt(p * Math.PI) * gamma(p / 2)) * (1 + t * t / p) ** (-(p + 1) / 2)];
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
