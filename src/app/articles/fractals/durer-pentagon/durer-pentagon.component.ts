import { Component } from '@angular/core';
import { Vec2 } from 'src/app/shared/math/vec2';
import {
  FractalExplorerComponent,
  FractalRenderer,
  paint,
} from '../fractal-explorer/fractal-explorer.component';

@Component({
  selector: 'app-durer-pentagon',
  standalone: true,
  imports: [FractalExplorerComponent],
  templateUrl: './durer-pentagon.component.html',
  styleUrl: './durer-pentagon.component.css',
})
export class DurerPentagonComponent {
  static title = 'Pentágono de Durero';
  static route = 'durer-pentagon';

  readonly draw: FractalRenderer = (context, iterations, canvasSize) => {
    paint(context, 34);
    const drawPentagons = (
      center: Vec2,
      radius: number,
      remainingIterations: number,
    ): void => {
      if (!remainingIterations) {
        context.beginPath();
        for (let vertexIndex = 0; vertexIndex < 5; vertexIndex += 1) {
          const angle = -Math.PI / 2 + (vertexIndex * 2 * Math.PI) / 5;
          const vertex = center.add(
            new Vec2(Math.cos(angle), Math.sin(angle)).scale(radius),
          );
          if (vertexIndex === 0) context.moveTo(vertex.x, vertex.y);
          else context.lineTo(vertex.x, vertex.y);
        }
        context.closePath();
        context.stroke();
        return;
      }

      const childRadius = radius * 0.382;
      const orbitRadius = radius * 0.618;
      for (let childIndex = 0; childIndex < 5; childIndex += 1) {
        const angle = -Math.PI / 2 + (childIndex * 2 * Math.PI) / 5;
        const childCenter = center.add(
          new Vec2(Math.cos(angle), Math.sin(angle)).scale(orbitRadius),
        );
        drawPentagons(childCenter, childRadius, remainingIterations - 1);
      }
    };

    drawPentagons(
      new Vec2(canvasSize / 2, canvasSize / 2),
      canvasSize * 0.45,
      iterations,
    );
  };
}
