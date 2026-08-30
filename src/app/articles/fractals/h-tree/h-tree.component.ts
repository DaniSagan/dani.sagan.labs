import { Component } from '@angular/core';
import { Vec2 } from 'src/app/shared/math/vec2';
import {
  FractalExplorerComponent,
  FractalRenderer,
  paint,
} from '../fractal-explorer/fractal-explorer.component';
@Component({
  selector: 'app-h-tree',
  standalone: true,
  imports: [FractalExplorerComponent],
  templateUrl: './h-tree.component.html',
  styleUrl: './h-tree.component.css',
})
export class HTreeComponent {
  static title = 'Árbol H';
  static route = 'h-tree';
  readonly draw: FractalRenderer = (context, iterations) => {
    paint(context, 100);
    const drawLine = (start: Vec2, end: Vec2): void => {
      context.moveTo(start.x, start.y);
      context.lineTo(end.x, end.y);
    };
    const drawTree = (
      center: Vec2,
      branchLength: number,
      remainingIterations: number,
    ): void => {
      const halfBranchLength = branchLength / 2;
      const topLeft = new Vec2(
        center.x - halfBranchLength,
        center.y - halfBranchLength,
      );
      const bottomLeft = new Vec2(
        center.x - halfBranchLength,
        center.y + halfBranchLength,
      );
      const topRight = new Vec2(
        center.x + halfBranchLength,
        center.y - halfBranchLength,
      );
      const bottomRight = new Vec2(
        center.x + halfBranchLength,
        center.y + halfBranchLength,
      );
      const leftCenter = new Vec2(center.x - halfBranchLength, center.y);
      const rightCenter = new Vec2(center.x + halfBranchLength, center.y);

      context.beginPath();
      drawLine(topLeft, bottomLeft);
      drawLine(topRight, bottomRight);
      drawLine(leftCenter, rightCenter);
      context.stroke();

      if (remainingIterations) {
        [topLeft, bottomLeft, topRight, bottomRight].forEach((childCenter) =>
          drawTree(
            childCenter,
            halfBranchLength,
            remainingIterations - 1,
          ),
        );
      }
    };
    drawTree(new Vec2(240, 240), 200, iterations);
  };
}
