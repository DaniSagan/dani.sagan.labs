import { Component } from '@angular/core';
import {
  FractalExplorerComponent,
  FractalRenderer,
  paint,
} from '../fractal-explorer/fractal-explorer.component';
import { drawLSystem } from '../shared/l-system-renderer';

@Component({
  selector: 'app-cesaro-fractal',
  standalone: true,
  imports: [FractalExplorerComponent],
  templateUrl: './cesaro-fractal.component.html',
  styleUrl: './cesaro-fractal.component.css',
})
export class CesaroFractalComponent {
  static title = 'Fractal de Cesàro';
  static route = 'cesaro-fractal';

  readonly draw: FractalRenderer = (context, iterations, canvasSize) => {
    paint(context, 42);
    drawLSystem(context, {
      axiom: 'F',
      rules: { F: 'F+F--F+F' },
      angle: Math.PI * 0.44,
      iterations,
      canvasSize,
    });
  };
}
