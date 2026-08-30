import { Component } from '@angular/core';
import {
  FractalExplorerComponent,
  FractalRenderer,
  paint,
} from '../fractal-explorer/fractal-explorer.component';
import { drawLSystem } from '../shared/l-system-renderer';

@Component({
  selector: 'app-cross-fractal',
  standalone: true,
  imports: [FractalExplorerComponent],
  templateUrl: './cross-fractal.component.html',
  styleUrl: './cross-fractal.component.css',
})
export class CrossFractalComponent {
  static title = 'Curva fractal de cruz';
  static route = 'cross-fractal';

  readonly draw: FractalRenderer = (context, iterations, canvasSize) => {
    paint(context, 345);
    drawLSystem(context, {
      axiom: 'F+F+F+F',
      rules: { F: 'F+FF++F+F' },
      angle: Math.PI / 2,
      iterations,
      canvasSize,
    });
  };
}
