import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';

@Component({
  selector: 'app-airy-ai-curve-article',
  standalone: true,
  imports: [FormsModule, RouterLink, FormulaComponent, ImplicitCurveGraphComponent],
  templateUrl: './airy-ai-curve-article.component.html',
  styleUrls: ['./airy-ai-curve-article.component.css', '../curve-widget.css'],
})
export class AiryAiCurveArticleComponent implements AfterViewInit {
  static readonly title = "Curva de Airy Ai";
  static readonly route = "airy-ai-curve";
  readonly title = AiryAiCurveArticleComponent.title;
  readonly generalEquation = "x=t,\\quad y=p\\operatorname{Ai}(t),\\quad \\operatorname{Ai}''(t)=t\\operatorname{Ai}(t)";
  readonly parameterDefinition = {"label":"Escala (p)","min":0.5,"max":1.5,"step":0.05,"value":1};
  parameter = this.parameterDefinition.value;
  readonly bounds: [number, number, number, number] = [-8.5,4.5,-0.8,1];
  readonly ranges: [number, number][] = [[-8,4]];
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
    const n = Math.max(1, Math.ceil(Math.abs(t) / 0.008)), h = t / n; let x = 0, y = 0.3550280538878172, v = -0.2588194037928068; for (let i = 0; i < n; i++) { const k1y = v, k1v = x * y, k2y = v + h * k1v / 2, k2v = (x + h / 2) * (y + h * k1y / 2), k3y = v + h * k2v / 2, k3v = (x + h / 2) * (y + h * k2y / 2), k4y = v + h * k3v, k4v = (x + h) * (y + h * k3y); y += h * (k1y + 2 * k2y + 2 * k3y + k4y) / 6; v += h * (k1v + 2 * k2v + 2 * k3v + k4v) / 6; x += h; } return [t, p * y];
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
