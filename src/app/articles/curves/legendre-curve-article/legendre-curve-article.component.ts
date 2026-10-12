import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';

@Component({
  selector: 'app-legendre-curve-article',
  standalone: true,
  imports: [FormsModule, RouterLink, FormulaComponent, ImplicitCurveGraphComponent],
  templateUrl: './legendre-curve-article.component.html',
  styleUrls: ['./legendre-curve-article.component.css', '../curve-widget.css'],
})
export class LegendreCurveArticleComponent implements AfterViewInit {
  static readonly title = "Curva de Legendre";
  static readonly route = "legendre-curve";
  readonly title = LegendreCurveArticleComponent.title;
  readonly generalEquation = "x=t,\\quad y=P_p(t),\\quad (n+1)P_{n+1}=(2n+1)tP_n-nP_{n-1}";
  readonly parameterDefinition = {"label":"Grado entero (p)","min":1,"max":10,"step":1,"value":5};
  parameter = this.parameterDefinition.value;
  readonly bounds: [number, number, number, number] = [-1.3,1.3,-1.5,1.5];
  readonly ranges: [number, number][] = [[-1,1]];
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
    let previous = 1, current = t; for (let n = 1; n < p; n++) { const next = ((2 * n + 1) * t * current - n * previous) / (n + 1); previous = current; current = next; } return [t, current];
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
