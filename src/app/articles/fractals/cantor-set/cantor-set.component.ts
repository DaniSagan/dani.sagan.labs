import { Component } from '@angular/core';
import {
  FractalExplorerComponent,
  FractalRenderer,
  paint,
} from '../fractal-explorer/fractal-explorer.component';
@Component({
  selector: 'app-cantor-set',
  standalone: true,
  imports: [FractalExplorerComponent],
  templateUrl: './cantor-set.component.html',
  styleUrl: './cantor-set.component.css',
})
export class CantorSetComponent {
  static title = 'Conjunto de Cantor';
  static route = 'cantor-set';
  readonly draw: FractalRenderer = (ctx, iterations) => {
    paint(ctx, 42);
    const rec = (x: number, y: number, w: number, n: number): void => {
      ctx.fillRect(x, y, w, 7);
      if (n) {
        rec(x, y + 42, w / 3, n - 1);
        rec(x + (2 * w) / 3, y + 42, w / 3, n - 1);
      }
    };
    rec(20, 20, 440, iterations);
  };
}
