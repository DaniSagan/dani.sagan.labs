import { Component } from '@angular/core';
import {
  FractalExplorerComponent,
  FractalRenderer,
  paint,
} from '../fractal-explorer/fractal-explorer.component';
import { drawLSystem } from '../shared/l-system-renderer';

@Component({
  selector: 'app-moore-curve',
  standalone: true,
  imports: [FractalExplorerComponent],
  templateUrl: './moore-curve.component.html',
  styleUrl: './moore-curve.component.css',
})
export class MooreCurveComponent {
  static title = 'Curva de Moore';
  static route = 'moore-curve';

  readonly draw: FractalRenderer = (context, iterations, canvasSize) => {
    paint(context, 165);
    drawLSystem(context, {
      axiom: 'LFL+F+LFL',
      rules: {
        L: '-RF+LFL+FR-',
        R: '+LF-RFR-FL+',
      },
      angle: Math.PI / 2,
      iterations,
      canvasSize,
    });
  };
}
