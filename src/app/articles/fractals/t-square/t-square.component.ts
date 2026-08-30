import { Component } from '@angular/core';
import { Vec2 } from 'src/app/shared/math/vec2';
import {
  FractalExplorerComponent,
  FractalRenderer,
  paint,
} from '../fractal-explorer/fractal-explorer.component';
@Component({
  selector: 'app-t-square',
  standalone: true,
  imports: [FractalExplorerComponent],
  templateUrl: './t-square.component.html',
  styleUrl: './t-square.component.css',
})
export class TSquareComponent {
  static title = 'Fractal T-square';
  static route = 't-square';

  readonly center = new Vec2(240, 240);

  readonly draw: FractalRenderer = (context, iterations) => {
    paint(context, 330);
    const drawSquare = (
      center: Vec2,
      sideLength: number,
      remainingIterations: number,
    ): void => {
      context.strokeRect(
        center.x - sideLength / 2,
        center.y - sideLength / 2,
        sideLength,
        sideLength,
      );
      if (remainingIterations) {
        const halfSideLength = sideLength / 2;
        [
          new Vec2(center.x - halfSideLength, center.y - halfSideLength),
          new Vec2(center.x + halfSideLength, center.y - halfSideLength),
          new Vec2(center.x - halfSideLength, center.y + halfSideLength),
          new Vec2(center.x + halfSideLength, center.y + halfSideLength),
        ].forEach((childCenter) =>
          drawSquare(
            childCenter,
            halfSideLength,
            remainingIterations - 1,
          ),
        );
      }
    };
    drawSquare(this.center, 220, iterations);
  };
}
