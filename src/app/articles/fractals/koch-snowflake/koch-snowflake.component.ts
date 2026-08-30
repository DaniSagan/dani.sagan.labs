import { Component } from '@angular/core';
import {
  FractalExplorerComponent,
  FractalRenderer,
  paint,
} from '../fractal-explorer/fractal-explorer.component';
import { Vec2 } from 'src/app/shared/math/vec2';

@Component({
  selector: 'app-koch-snowflake',
  standalone: true,
  imports: [FractalExplorerComponent],
  templateUrl: './koch-snowflake.component.html',
  styleUrl: './koch-snowflake.component.css',
})
export class KochSnowflakeComponent {
  static title = 'Copo de nieve de Koch';
  static route = 'koch-snowflake';

  readonly radius = 220;
  readonly center = new Vec2(240, 240);
  readonly angles = [-Math.PI / 2, -Math.PI / 2 - (2 * Math.PI) / 3, -Math.PI / 2 - (4 * Math.PI) / 3];
  readonly p0 = this.center.add(new Vec2(this.radius * Math.cos(this.angles[0]), this.radius * Math.sin(this.angles[0]))); // new Vec2(85, 485);
  readonly p1 = this.center.add(new Vec2(this.radius * Math.cos(this.angles[1]), this.radius * Math.sin(this.angles[1]))); // new Vec2(595, 485);
  readonly p2 = this.center.add(new Vec2(this.radius * Math.cos(this.angles[2]), this.radius * Math.sin(this.angles[2]))); // new Vec2(340, 45);

  readonly draw: FractalRenderer = (ctx, iterations) => {
    paint(ctx);
    const drawSide = (
      start: Vec2,
      end: Vec2,
      remainingIterations: number,
    ): void => {
      if (!remainingIterations) {
        ctx.lineTo(end.x, end.y);
        return;
      }

      const thirdDelta = new Vec2((end.x - start.x) / 3, (end.y - start.y) / 3);
      const firstThird = start.add(thirdDelta);
      const peak = firstThird.add(
        new Vec2(
          thirdDelta.x * Math.cos(Math.PI / 3) - thirdDelta.y * Math.sin(Math.PI / 3),
          thirdDelta.x * Math.sin(Math.PI / 3) + thirdDelta.y * Math.cos(Math.PI / 3),
        ),
      );
      const secondThird = start.add(thirdDelta.scale(2));

      drawSide(start, firstThird, remainingIterations - 1);
      drawSide(firstThird, peak, remainingIterations - 1);
      drawSide(peak, secondThird, remainingIterations - 1);
      drawSide(secondThird, end, remainingIterations - 1);
    };

    ctx.beginPath();
    ctx.moveTo(this.p0.x, this.p0.y);
    drawSide(this.p0, this.p1, iterations);
    drawSide(this.p1, this.p2, iterations);
    drawSide(this.p2, this.p0, iterations);
    ctx.stroke();
  };
}
