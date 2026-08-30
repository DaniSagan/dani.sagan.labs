import { Component } from '@angular/core';
import {
  FractalExplorerComponent,
  FractalRenderer,
  paint,
} from '../fractal-explorer/fractal-explorer.component';
import { drawLSystem } from '../shared/l-system-renderer';

@Component({
  selector: 'app-koch-curve',
  standalone: true,
  imports: [FractalExplorerComponent],
  templateUrl: './koch-curve.component.html',
  styleUrl: './koch-curve.component.css',
})
export class KochCurveComponent {
  static title = 'Curva de Koch';
  static route = 'koch-curve';

  readonly draw: FractalRenderer = (context, iterations, canvasSize) => {
    paint(context, 190);
    drawLSystem(context, {
      axiom: 'F',
      rules: { F: 'F+F--F+F' },
      angle: Math.PI / 3,
      iterations,
      canvasSize,
    });
  };
}
