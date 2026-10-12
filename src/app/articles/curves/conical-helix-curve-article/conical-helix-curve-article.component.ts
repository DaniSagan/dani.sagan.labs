import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';

@Component({
  selector: 'app-conical-helix-curve-article',
  standalone: true,
  imports: [FormsModule, RouterLink, FormulaComponent, ImplicitCurveGraphComponent],
  templateUrl: './conical-helix-curve-article.component.html',
  styleUrls: ['./conical-helix-curve-article.component.css', '../curve-widget.css'],
})
export class ConicalHelixCurveArticleComponent implements AfterViewInit {
  static readonly title = "Hélice cónica";
  static readonly route = "conical-helix-curve";
  readonly title = ConicalHelixCurveArticleComponent.title;
  readonly generalEquation = "x=t\\cos t,\\quad y=t\\sin t,\\quad z=pt,\\quad t\\ge0";
  readonly parameterDefinition = {"label":"Relación altura/radio (p)","min":0.2,"max":1,"step":0.05,"value":0.5};
  parameter = this.parameterDefinition.value;
  readonly bounds: [number, number, number, number] = [-14,14,-10,14];
  readonly ranges: [number, number][] = [[0,12.566370614359172]];
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
    const [x, y, z] = this.spacePoint(t); return [(x - y) / Math.sqrt(2), Math.sqrt(2 / 3) * z - (x + y) / Math.sqrt(6)];
  }

  spacePoint(t: number): [number, number, number] { return [t * Math.cos(t), t * Math.sin(t), this.parameter * t]; }

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
