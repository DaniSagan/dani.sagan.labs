import { Component } from '@angular/core';
import {
  FractalExplorerComponent,
  FractalRenderer,
  paint,
} from '../fractal-explorer/fractal-explorer.component';
import { drawLSystem } from '../shared/l-system-renderer';

@Component({
  selector: 'app-koch-antisnowflake',
  standalone: true,
  imports: [FractalExplorerComponent],
  templateUrl: './koch-antisnowflake.component.html',
  styleUrl: './koch-antisnowflake.component.css',
})
export class KochAntisnowflakeComponent {
  static title = 'Anticopo de Koch';
  static route = 'koch-antisnowflake';

  readonly draw: FractalRenderer = (context, iterations, canvasSize) => {
    paint(context, 182);
    drawLSystem(context, {
      axiom: 'F++F++F',
      rules: { F: 'F-F++F-F' },
      angle: Math.PI / 3,
      iterations,
      canvasSize,
    });
  };
}
