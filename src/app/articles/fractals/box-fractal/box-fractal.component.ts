import { Component } from '@angular/core';
import {
  FractalExplorerComponent,
  FractalRenderer,
  paint,
} from '../fractal-explorer/fractal-explorer.component';
import { drawLSystem } from '../shared/l-system-renderer';

@Component({
  selector: 'app-box-fractal',
  standalone: true,
  imports: [FractalExplorerComponent],
  templateUrl: './box-fractal.component.html',
  styleUrl: './box-fractal.component.css',
})
export class BoxFractalComponent {
  static title = 'Fractal de caja';
  static route = 'box-fractal';

  readonly draw: FractalRenderer = (context, iterations, canvasSize) => {
    paint(context, 52);
    drawLSystem(context, {
      axiom: 'F+F+F+F',
      rules: { F: 'F+F-F-F+F' },
      angle: Math.PI / 2,
      iterations,
      canvasSize,
    });
  };
}
