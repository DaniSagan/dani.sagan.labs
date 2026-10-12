import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';

@Component({
  selector: 'app-gear-profile-curve-article',
  standalone: true,
  imports: [FormsModule, RouterLink, FormulaComponent, ImplicitCurveGraphComponent],
  templateUrl: './gear-profile-curve-article.component.html',
  styleUrls: ['./gear-profile-curve-article.component.css', '../curve-widget.css'],
})
export class GearProfileCurveArticleComponent implements AfterViewInit {
  static readonly title = "Curva de perfil de engranaje";
  static readonly route = "gear-profile-curve";
  readonly title = GearProfileCurveArticleComponent.title;
  readonly generalEquation = "r=1+\\frac{\\tanh(6\\sin(pt))}{6},\\quad x=r\\cos t,\\ y=r\\sin t";
  readonly parameterDefinition = {"label":"Número entero de dientes (p)","min":3,"max":20,"step":1,"value":12};
  parameter = this.parameterDefinition.value;
  readonly bounds: [number, number, number, number] = [-1.6,1.6,-1.6,1.6];
  readonly ranges: [number, number][] = [[0,6.283185307179586]];
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
    const r = 1 + Math.tanh(6 * Math.sin(p * t)) / 6; return [r * Math.cos(t), r * Math.sin(t)];
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
