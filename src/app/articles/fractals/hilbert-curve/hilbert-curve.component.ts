import { Component } from '@angular/core';
import {
  FractalExplorerComponent,
  FractalRenderer,
  paint,
} from '../fractal-explorer/fractal-explorer.component';
@Component({
  selector: 'app-hilbert-curve',
  standalone: true,
  imports: [FractalExplorerComponent],
  templateUrl: './hilbert-curve.component.html',
  styleUrl: './hilbert-curve.component.css',
})
export class HilbertCurveComponent {
  static title = 'Curva de Hilbert';
  static route = 'hilbert-curve';
  readonly draw: FractalRenderer = (ctx, iterations) => {
    const grid = 2 ** iterations,
      step = 440 / (grid - 1);
    paint(ctx, 205);
    ctx.beginPath();
    for (let d = 0; d < grid * grid; d++) {
      let x = 0,
        y = 0,
        t = d;
      for (let s = 1; s < grid; s *= 2) {
        const rx = 1 & (t >> 1),
          ry = 1 & (t ^ rx);
        if (!ry) {
          if (rx) {
            x = s - 1 - x;
            y = s - 1 - y;
          }
          [x, y] = [y, x];
        }
        x += s * rx;
        y += s * ry;
        t >>= 2;
      }
      const px = 20 + x * step,
        py = 20 + y * step;
      d ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    }
    ctx.stroke();
  };
}
