import { Component } from '@angular/core';
import { Vec2 } from 'src/app/shared/math/vec2';
import {
  FractalExplorerComponent,
  FractalRenderer,
} from '../fractal-explorer/fractal-explorer.component';
@Component({
  selector: 'app-pythagoras-tree',
  standalone: true,
  imports: [FractalExplorerComponent],
  templateUrl: './pythagoras-tree.component.html',
  styleUrl: './pythagoras-tree.component.css',
})
export class PythagorasTreeComponent {
  static title = 'Árbol de Pitágoras';
  static route = 'pythagoras-tree';
  readonly draw: FractalRenderer = (context, iterations) => {
    const drawBranch = (
      start: Vec2,
      branchLength: number,
      angle: number,
      remainingIterations: number,
    ): void => {
      const direction = new Vec2(Math.cos(angle), Math.sin(angle));
      const end = start.add(direction.scale(branchLength));

      context.strokeStyle = `hsl(${100 + remainingIterations * 18},75%,62%)`;
      context.beginPath();
      context.moveTo(start.x, start.y);
      context.lineTo(end.x, end.y);
      context.stroke();

      if (!remainingIterations) return;

      const childBranchLength = branchLength * 0.72;
      const childIterations = remainingIterations - 1;
      drawBranch(end, childBranchLength, angle - 0.72, childIterations);
      drawBranch(end, childBranchLength, angle + 0.72, childIterations);
    };
    drawBranch(
      new Vec2(240, 440),
      100,
      -Math.PI / 2,
      iterations + 1,
    );
  };
}
