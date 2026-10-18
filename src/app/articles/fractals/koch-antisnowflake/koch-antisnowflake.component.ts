import { RouterLink } from '@angular/router';
import { Component } from '@angular/core';
import {
  FractalExplorerComponent,
  FractalRenderer,
  paint,
} from '../fractal-explorer/fractal-explorer.component';
import { drawLSystem } from '../shared/l-system-renderer';

@Component({ host: { class: 'fractal-page' },
  selector: 'app-koch-antisnowflake',
  standalone: true,
  imports: [RouterLink, FractalExplorerComponent],
  templateUrl: './koch-antisnowflake.component.html',
  styleUrl: './koch-antisnowflake.component.css',
})
export class KochAntisnowflakeComponent {
  static title = 'Anticopo de Koch';
  static route = 'koch-antisnowflake';

  readonly draw: FractalRenderer = (context, iterations, canvasSize) => {
    paint(context, 182);
    drawLSystem(context, {
      // Keep the seed orientation consistent with the inward F-F++F-F motif.
      axiom: 'F--F--F',
      rules: { F: 'F-F++F-F' },
      angle: Math.PI / 3,
      iterations,
      canvasSize,
    });
  };
}
