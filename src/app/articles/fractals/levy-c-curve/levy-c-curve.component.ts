import { Component } from '@angular/core';
import {
  FractalExplorerComponent,
  FractalRenderer,
  paint,
} from '../fractal-explorer/fractal-explorer.component';
import { Vec2 } from 'src/app/shared/math/vec2';
@Component({
  selector: 'app-levy-c-curve',
  standalone: true,
  imports: [FractalExplorerComponent],
  templateUrl: './levy-c-curve.component.html',
  styleUrl: './levy-c-curve.component.css',
})
export class LevyCCurveComponent {
  static title = 'Curva C de Lévy';
  static route = 'levy-c-curve';
  readonly size = 480;
  readonly margin = 140;
  readonly p0 = new Vec2(this.margin, 160);
  readonly p1 = new Vec2(this.size - this.margin, 160);
  readonly draw: FractalRenderer = (ctx, iterations) => {
    paint(ctx, 290);
    const drawCurveSegment = (
      startX: number,
      startY: number,
      endX: number,
      endY: number,
      remainingIterations: number,
    ): void => {
      if (!remainingIterations) {
        ctx.lineTo(endX, endY);
        return;
      }
      const cornerX = (startX + endX) / 2 - (endY - startY) / 2,
        cornerY = (startY + endY) / 2 + (endX - startX) / 2;
      drawCurveSegment(
        startX,
        startY,
        cornerX,
        cornerY,
        remainingIterations - 1,
      );
      drawCurveSegment(
        cornerX,
        cornerY,
        endX,
        endY,
        remainingIterations - 1,
      );
    };
    ctx.beginPath();
    ctx.moveTo(this.p0.x, this.p0.y);
    drawCurveSegment(this.p0.x, this.p0.y, this.p1.x, this.p1.y, iterations + 2);
    ctx.stroke();
  };
}
