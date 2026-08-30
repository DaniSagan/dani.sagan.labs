import { Component } from '@angular/core';
import {
  FractalExplorerComponent,
  FractalRenderer,
  paint,
} from '../fractal-explorer/fractal-explorer.component';
import { drawLSystem } from '../shared/l-system-renderer';

@Component({
  selector: 'app-fractal-plant',
  standalone: true,
  imports: [FractalExplorerComponent],
  templateUrl: './fractal-plant.component.html',
  styleUrl: './fractal-plant.component.css',
})
export class FractalPlantComponent {
  static title = 'Planta fractal';
  static route = 'fractal-plant';

  readonly draw: FractalRenderer = (context, iterations, canvasSize) => {
    paint(context, 126);
    drawLSystem(context, {
      axiom: 'X',
      rules: {
        X: 'F+[[X]-X]-F[-FX]+X',
        F: 'FF',
      },
      angle: (25 * Math.PI) / 180,
      startAngle: -Math.PI / 2,
      iterations,
      canvasSize,
    });
  };
}
