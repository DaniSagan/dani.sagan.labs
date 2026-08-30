import { Component } from '@angular/core';
import { Vec2 } from 'src/app/shared/math/vec2';
import {
  FractalExplorerComponent,
  FractalRenderer,
  paint,
} from '../fractal-explorer/fractal-explorer.component';

@Component({
  selector: 'app-binary-fractal-tree',
  standalone: true,
  imports: [FractalExplorerComponent],
  templateUrl: './binary-fractal-tree.component.html',
  styleUrl: './binary-fractal-tree.component.css',
})
export class BinaryFractalTreeComponent {
  static title = 'Árbol fractal binario';
  static route = 'binary-fractal-tree';

  readonly draw: FractalRenderer = (context, iterations, canvasSize) => {
    paint(context, 88);
    const drawBranch = (
      start: Vec2,
      branchLength: number,
      angle: number,
      remainingIterations: number,
    ): void => {
      const direction = new Vec2(Math.cos(angle), Math.sin(angle));
      const end = start.add(direction.scale(branchLength));

      context.beginPath();
      context.moveTo(start.x, start.y);
      context.lineTo(end.x, end.y);
      context.stroke();

      if (!remainingIterations) return;

      const childLength = branchLength * 0.72;
      drawBranch(end, childLength, angle - Math.PI / 5, remainingIterations - 1);
      drawBranch(end, childLength, angle + Math.PI / 5, remainingIterations - 1);
    };

    const root = new Vec2(canvasSize / 2, canvasSize - 24);
    drawBranch(root, canvasSize * 0.22, -Math.PI / 2, iterations);
  };
}
