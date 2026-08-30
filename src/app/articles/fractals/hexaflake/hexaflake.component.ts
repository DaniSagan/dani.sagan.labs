import { Component } from '@angular/core';
import { Vec2 } from 'src/app/shared/math/vec2';
import {
  FractalExplorerComponent,
  FractalRenderer,
  paint,
} from '../fractal-explorer/fractal-explorer.component';

@Component({
  selector: 'app-hexaflake',
  standalone: true,
  imports: [FractalExplorerComponent],
  templateUrl: './hexaflake.component.html',
  styleUrl: './hexaflake.component.css',
})
export class HexaflakeComponent {
  static title = 'Hexaflake';
  static route = 'hexaflake';

  readonly draw: FractalRenderer = (context, iterations, canvasSize) => {
    paint(context, 198);
    const drawHexagon = (center: Vec2, radius: number): void => {
      context.beginPath();
      for (let vertexIndex = 0; vertexIndex < 6; vertexIndex += 1) {
        const angle = (vertexIndex * Math.PI) / 3;
        const vertex = center.add(
          new Vec2(Math.cos(angle), Math.sin(angle)).scale(radius),
        );
        if (vertexIndex === 0) context.moveTo(vertex.x, vertex.y);
        else context.lineTo(vertex.x, vertex.y);
      }
      context.closePath();
      context.stroke();
    };
    const drawFlake = (
      center: Vec2,
      radius: number,
      remainingIterations: number,
    ): void => {
      if (!remainingIterations) {
        drawHexagon(center, radius);
        return;
      }

      const childRadius = radius / 3;
      drawFlake(center, childRadius, remainingIterations - 1);
      for (let childIndex = 0; childIndex < 6; childIndex += 1) {
        const angle = (childIndex * Math.PI) / 3;
        const childCenter = center.add(
          new Vec2(Math.cos(angle), Math.sin(angle)).scale(childRadius * 2),
        );
        drawFlake(childCenter, childRadius, remainingIterations - 1);
      }
    };

    drawFlake(new Vec2(canvasSize / 2, canvasSize / 2), canvasSize * 0.44, iterations);
  };
}
