import { Component } from '@angular/core';
import { Vec2 } from 'src/app/shared/math/vec2';
import {
  FractalExplorerComponent,
  FractalRenderer,
  paint,
} from '../fractal-explorer/fractal-explorer.component';
@Component({
  selector: 'app-cantor-dust',
  standalone: true,
  imports: [FractalExplorerComponent],
  templateUrl: './cantor-dust.component.html',
  styleUrl: './cantor-dust.component.css',
})
export class CantorDustComponent {
  static title = 'Polvo de Cantor';
  static route = 'cantor-dust';
  readonly draw: FractalRenderer = (context, iterations) => {
    paint(context, 50);
    const drawCantorDust = (
      position: Vec2,
      squareSize: number,
      remainingIterations: number,
    ): void => {
      if (!remainingIterations) {
        context.fillRect(position.x, position.y, squareSize, squareSize);
        return;
      }
      const childSquareSize = squareSize / 3;
      const childOffsets = [
        new Vec2(0, 0),
        new Vec2(0, 2),
        new Vec2(2, 0),
        new Vec2(2, 2),
      ];
      childOffsets.forEach((offset) =>
        drawCantorDust(
          position.add(offset.scale(childSquareSize)),
          childSquareSize,
          remainingIterations - 1,
        ),
      );
    };
    drawCantorDust(new Vec2(20, 20), 440, iterations);
  };
}
