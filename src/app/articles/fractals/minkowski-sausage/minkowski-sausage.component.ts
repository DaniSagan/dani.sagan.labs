import { Component } from '@angular/core';
import {
  FractalExplorerComponent,
  FractalRenderer,
  paint,
} from '../fractal-explorer/fractal-explorer.component';
import { Vec2 } from 'src/app/shared/math/vec2';
@Component({
  selector: 'app-minkowski-sausage',
  standalone: true,
  imports: [FractalExplorerComponent],
  templateUrl: './minkowski-sausage.component.html',
  styleUrl: './minkowski-sausage.component.css',
})
export class MinkowskiSausageComponent {
  static title = 'Salchicha de Minkowski';
  static route = 'minkowski-sausage';
  readonly draw: FractalRenderer = (ctx, iterations) => {
    let s = 'F';
    for (let i = 0; i < iterations; i++)
      s = [...s].map((x) => (x === 'F' ? 'F+F-F-FF+F+F-F' : x)).join('');
    const scale = 440 / (4 ** iterations);
    let a = 0,
      p = new Vec2(20, 240);
    paint(ctx, 260);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    for (const c of s) {
      if (c === '+' || c === '-') a += ((c === '+' ? 1 : -1) * Math.PI) / 2;
      else if (c === 'F') {
        p = p.add(new Vec2(Math.cos(a) * scale, Math.sin(a) * scale));
        ctx.lineTo(p.x, p.y);
      }
    }
    ctx.stroke();
  };
}
