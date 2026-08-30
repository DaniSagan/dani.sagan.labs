import { Component } from '@angular/core';
import { Vec2 } from 'src/app/shared/math/vec2';
import {
  FractalExplorerComponent,
  FractalRenderer,
  paint,
} from '../fractal-explorer/fractal-explorer.component';

@Component({
  selector: 'app-jerusalem-cross',
  standalone: true,
  imports: [FractalExplorerComponent],
  templateUrl: './jerusalem-cross.component.html',
  styleUrl: './jerusalem-cross.component.css',
})
export class JerusalemCrossComponent {
  static title = 'Fractal de la cruz de Jerusalén';
  static route = 'jerusalem-cross';

  readonly draw: FractalRenderer = (context, iterations, canvasSize) => {
    paint(context, 15);
    const drawCross = (
      center: Vec2,
      armLength: number,
      remainingIterations: number,
    ): void => {
      const horizontalStart = center.add(new Vec2(-armLength, 0));
      const horizontalEnd = center.add(new Vec2(armLength, 0));
      const verticalStart = center.add(new Vec2(0, -armLength));
      const verticalEnd = center.add(new Vec2(0, armLength));

      context.beginPath();
      context.moveTo(horizontalStart.x, horizontalStart.y);
      context.lineTo(horizontalEnd.x, horizontalEnd.y);
      context.moveTo(verticalStart.x, verticalStart.y);
      context.lineTo(verticalEnd.x, verticalEnd.y);
      context.stroke();

      if (!remainingIterations) return;

      const childArmLength = armLength / 3;
      [horizontalStart, horizontalEnd, verticalStart, verticalEnd].forEach(
        (childCenter) =>
          drawCross(childCenter, childArmLength, remainingIterations - 1),
      );
    };

    drawCross(
      new Vec2(canvasSize / 2, canvasSize / 2),
      canvasSize * 0.32,
      iterations,
    );
  };
}
