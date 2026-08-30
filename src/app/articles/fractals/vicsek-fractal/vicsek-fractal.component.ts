import { Component } from '@angular/core';
import {
  FractalExplorerComponent,
  FractalRenderer,
  paint,
} from '../fractal-explorer/fractal-explorer.component';
@Component({
  selector: 'app-vicsek-fractal',
  standalone: true,
  imports: [FractalExplorerComponent],
  templateUrl: './vicsek-fractal.component.html',
  styleUrl: './vicsek-fractal.component.css',
})
export class VicsekFractalComponent {
  static title = 'Fractal de Vicsek';
  static route = 'vicsek-fractal';
  readonly draw: FractalRenderer = (ctx, iterations) => {
    paint(ctx, 135);
    const rec = (x: number, y: number, s: number, n: number): void => {
      if (!n) {
        ctx.fillRect(x, y, s, s);
        return;
      }
      const t = s / 3;
      [
        [0, 0],
        [2, 0],
        [1, 1],
        [0, 2],
        [2, 2],
      ].forEach(([a, b]) => rec(x + a * t, y + b * t, t, n - 1));
    };
    rec(20, 20, 440, iterations);
  };
}
