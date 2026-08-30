import { Component } from '@angular/core';
import {
  FractalExplorerComponent,
  FractalRenderer,
  paint,
} from '../fractal-explorer/fractal-explorer.component';
import { drawLSystem } from '../shared/l-system-renderer';

@Component({
  selector: 'app-terdragon',
  standalone: true,
  imports: [FractalExplorerComponent],
  templateUrl: './terdragon.component.html',
  styleUrl: './terdragon.component.css',
})
export class TerdragonComponent {
  static title = 'Curva terdragón';
  static route = 'terdragon';

  readonly draw: FractalRenderer = (context, iterations, canvasSize) => {
    paint(context, 8);
    drawLSystem(context, {
      axiom: 'F',
      rules: { F: 'F+F-F' },
      angle: (2 * Math.PI) / 3,
      iterations,
      canvasSize,
    });
  };
}
