import { Component } from '@angular/core';
import {
  FractalExplorerComponent,
  FractalRenderer,
  paint,
} from '../fractal-explorer/fractal-explorer.component';
import { drawLSystem } from '../shared/l-system-renderer';

@Component({
  selector: 'app-quadratic-koch-island',
  standalone: true,
  imports: [FractalExplorerComponent],
  templateUrl: './quadratic-koch-island.component.html',
  styleUrl: './quadratic-koch-island.component.css',
})
export class QuadraticKochIslandComponent {
  static title = 'Isla cuadrática de Koch';
  static route = 'quadratic-koch-island';

  readonly draw: FractalRenderer = (context, iterations, canvasSize) => {
    paint(context, 205);
    drawLSystem(context, {
      axiom: 'F+F+F+F',
      rules: { F: 'F+F-F-FF+F+F-F' },
      angle: Math.PI / 2,
      iterations,
      canvasSize,
    });
  };
}
