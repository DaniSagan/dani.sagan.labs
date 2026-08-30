import { Component } from '@angular/core';
import {
  FractalExplorerComponent,
  FractalRenderer,
  paint,
} from '../fractal-explorer/fractal-explorer.component';
import { drawLSystem } from '../shared/l-system-renderer';

@Component({
  selector: 'app-paperfolding-curve',
  standalone: true,
  imports: [FractalExplorerComponent],
  templateUrl: './paperfolding-curve.component.html',
  styleUrl: './paperfolding-curve.component.css',
})
export class PaperfoldingCurveComponent {
  static title = 'Curva de plegado de papel';
  static route = 'paperfolding-curve';

  readonly draw: FractalRenderer = (context, iterations, canvasSize) => {
    paint(context, 222);
    drawLSystem(context, {
      axiom: 'FX',
      rules: {
        X: 'X+YF+',
        Y: '-FX-Y',
      },
      angle: Math.PI / 2,
      iterations,
      canvasSize,
    });
  };
}
