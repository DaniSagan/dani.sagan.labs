import { Component } from '@angular/core';
import {
  FractalExplorerComponent,
  FractalRenderer,
  paint,
} from '../fractal-explorer/fractal-explorer.component';
import { drawLSystem } from '../shared/l-system-renderer';

@Component({
  selector: 'app-sierpinski-curve',
  standalone: true,
  imports: [FractalExplorerComponent],
  templateUrl: './sierpinski-curve.component.html',
  styleUrl: './sierpinski-curve.component.css',
})
export class SierpinskiCurveComponent {
  static title = 'Curva de Sierpiński';
  static route = 'sierpinski-curve';

  readonly draw: FractalRenderer = (context, iterations, canvasSize) => {
    paint(context, 275);
    drawLSystem(context, {
      axiom: 'F+G+G+F',
      rules: {
        F: 'F+G-F-G+F',
        G: 'GG',
      },
      angle: Math.PI / 2,
      iterations,
      canvasSize,
    });
  };
}
