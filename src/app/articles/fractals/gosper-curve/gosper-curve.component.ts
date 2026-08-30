import { Component } from '@angular/core';
import {
  FractalExplorerComponent,
  FractalRenderer,
  paint,
} from '../fractal-explorer/fractal-explorer.component';
import { Vec2 } from 'src/app/shared/math/vec2';
@Component({
  selector: 'app-gosper-curve',
  standalone: true,
  imports: [FractalExplorerComponent],
  templateUrl: './gosper-curve.component.html',
  styleUrl: './gosper-curve.component.css',
})
export class GosperCurveComponent {
  static title = 'Curva de Gosper';
  static route = 'gosper-curve';
  readonly draw: FractalRenderer = (ctx, iterations) => {
    let s = 'A';
    const rules: Record<string, string> = {
      A: 'A-B--B+A++AA+B-',
      B: '+A-BB--B-A++A+B',
    };
    for (let i = 0; i < iterations; i++)
      s = [...s].map((x) => rules[x] || x).join('');
    const scale = 500 / (3 ** iterations);
    let a = 0,
      p = new Vec2(240, 460);
    paint(ctx, 260);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    for (const c of s) {
      if (c === '+' || c === '-') a += ((c === '+' ? 1 : -1) * Math.PI) / 3;
      else if (c === 'A' || c === 'B') {
        p = p.add(new Vec2(Math.cos(a) * scale, Math.sin(a) * scale));
        ctx.lineTo(p.x, p.y);
      }
    }
    ctx.stroke();
  };
}
