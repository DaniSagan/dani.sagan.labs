import { Component } from '@angular/core';
import {
  FractalExplorerComponent,
  FractalRenderer,
  paint,
} from '../fractal-explorer/fractal-explorer.component';
import { drawLSystem } from '../shared/l-system-renderer';

@Component({
  selector: 'app-twindragon',
  standalone: true,
  imports: [FractalExplorerComponent],
  templateUrl: './twindragon.component.html',
  styleUrl: './twindragon.component.css',
})
export class TwindragonComponent {
  static title = 'Twindragon';
  static route = 'twindragon';

  readonly draw: FractalRenderer = (context, iterations, canvasSize) => {
    paint(context, 292);
    drawLSystem(context, {
      axiom: 'FX+FX+',
      rules: {
        X: 'X+YF',
        Y: 'FX-Y',
      },
      angle: Math.PI / 2,
      iterations,
      canvasSize,
    });
  };
}
