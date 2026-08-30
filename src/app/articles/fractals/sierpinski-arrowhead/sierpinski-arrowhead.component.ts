import { Component } from '@angular/core';
import {
  FractalExplorerComponent,
  FractalRenderer,
  paint,
} from '../fractal-explorer/fractal-explorer.component';
import { drawLSystem } from '../shared/l-system-renderer';

@Component({
  selector: 'app-sierpinski-arrowhead',
  standalone: true,
  imports: [FractalExplorerComponent],
  templateUrl: './sierpinski-arrowhead.component.html',
  styleUrl: './sierpinski-arrowhead.component.css',
})
export class SierpinskiArrowheadComponent {
  static title = 'Punta de flecha de Sierpiński';
  static route = 'sierpinski-arrowhead';

  readonly draw: FractalRenderer = (context, iterations, canvasSize) => {
    paint(context, 325);
    drawLSystem(context, {
      axiom: 'A',
      rules: {
        A: 'B-A-B',
        B: 'A+B+A',
      },
      angle: Math.PI / 3,
      iterations,
      canvasSize,
    });
  };
}
