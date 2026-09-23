import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  colorConflicts,
  fourColorMap,
  kempeComponent,
  solveMap,
} from '../../shared/math/four-color';
import { FourColorMapComponent } from './four-color-map.component';

@Component({
  selector: 'app-four-color-kempe',
  standalone: true,
  imports: [CommonModule, FormsModule, FourColorMapComponent],
  templateUrl: './four-color-kempe.component.html',
  styleUrl: './four-color-widgets.css',
})
export class FourColorKempeComponent {
  seed = 2026;
  map = fourColorMap('mosaic', this.seed);
  colors = solveMap(this.map, 4).colors;
  a = 0;
  b = 1;
  selected = 0;
  swaps = 0;
  get component(): number[] {
    return kempeComponent(
      this.map,
      this.colors,
      this.selected,
      Number(this.a),
      Number(this.b),
    );
  }
  get conflicts(): number {
    return colorConflicts(this.map.edges, this.colors).length;
  }
  label(i: number): string {
    return String.fromCharCode(65 + i);
  }
  swap(): void {
    const vertices = new Set(this.component);
    this.colors = this.colors.map((c, i) =>
      vertices.has(i)
        ? c === Number(this.a)
          ? Number(this.b)
          : Number(this.a)
        : c,
    );
    this.swaps++;
  }
  reset(): void {
    this.map = fourColorMap('mosaic', ++this.seed);
    this.colors = solveMap(this.map, 4).colors;
    this.selected = 0;
    this.swaps = 0;
  }
}
