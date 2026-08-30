import { Component } from '@angular/core';
import { Vec2 } from 'src/app/shared/math/vec2';
import {
  FractalExplorerComponent,
  FractalRenderer,
  paint,
} from '../fractal-explorer/fractal-explorer.component';

@Component({
  selector: 'app-menger-sponge',
  standalone: true,
  imports: [FractalExplorerComponent],
  templateUrl: './menger-sponge.component.html',
  styleUrl: './menger-sponge.component.css',
})
export class MengerSpongeComponent {
  static title = 'Esponja de Menger';
  static route = 'menger-sponge';

  readonly draw: FractalRenderer = (context, iterations, canvasSize) => {
    paint(context, 205);
    const drawProjection = (
      position: Vec2,
      squareSize: number,
      remainingIterations: number,
    ): void => {
      if (!remainingIterations) {
        context.fillRect(position.x, position.y, squareSize, squareSize);
        return;
      }

      const childSize = squareSize / 3;
      for (let row = 0; row < 3; row += 1) {
        for (let column = 0; column < 3; column += 1) {
          if (row === 1 && column === 1) continue;
          const childPosition = position.add(
            new Vec2(column, row).scale(childSize),
          );
          drawProjection(childPosition, childSize, remainingIterations - 1);
        }
      }
    };

    const margin = canvasSize * 0.06;
    drawProjection(
      new Vec2(margin, margin),
      canvasSize - margin * 2,
      iterations,
    );
  };
}
