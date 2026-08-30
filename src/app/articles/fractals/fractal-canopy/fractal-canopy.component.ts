import { Component } from '@angular/core';
import {
  FractalExplorerComponent,
  FractalRenderer,
  paint,
} from '../fractal-explorer/fractal-explorer.component';
import { drawLSystem } from '../shared/l-system-renderer';

@Component({
  selector: 'app-fractal-canopy',
  standalone: true,
  imports: [FractalExplorerComponent],
  templateUrl: './fractal-canopy.component.html',
  styleUrl: './fractal-canopy.component.css',
})
export class FractalCanopyComponent {
  static title = 'Dosel fractal';
  static route = 'fractal-canopy';

  readonly draw: FractalRenderer = (context, iterations, canvasSize) => {
    paint(context, 112);
    drawLSystem(context, {
      axiom: 'F',
      rules: { F: 'F[+F]F[-F]F' },
      angle: Math.PI / 7,
      startAngle: -Math.PI / 2,
      iterations,
      canvasSize,
    });
  };
}
