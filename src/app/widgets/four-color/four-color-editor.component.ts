import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  colorConflicts,
  fourColorMap,
  MAP_PALETTE,
  solveMap,
} from '../../shared/math/four-color';
import { FourColorMapComponent } from './four-color-map.component';

@Component({
  selector: 'app-four-color-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, FourColorMapComponent],
  templateUrl: './four-color-editor.component.html',
  styleUrl: './four-color-widgets.css',
})
export class FourColorEditorComponent {
  kind = 'four';
  seed = 2026;
  map = fourColorMap(this.kind);
  colors = this.map.sites.map(() => -1);
  selected = 0;
  dual = true;
  palette = MAP_PALETTE;
  history: number[][] = [];
  message = '';
  get conflicts() {
    return colorConflicts(this.map.edges, this.colors);
  }
  get remaining(): number {
    return this.colors.filter((c) => c < 0).length;
  }
  get used(): number {
    return new Set(this.colors.filter((c) => c >= 0)).size;
  }
  get neighbors(): number[] {
    return this.map.edges
      .filter((e) => e.includes(this.selected))
      .map((e) => (e[0] === this.selected ? e[1] : e[0]));
  }
  label(i: number): string {
    return String.fromCharCode(65 + i);
  }
  load(): void {
    this.map = fourColorMap(this.kind, this.seed);
    this.colors = this.map.sites.map(() => -1);
    this.selected = 0;
    this.history = [];
    this.message = '';
  }
  paint(color: number): void {
    this.history.push([...this.colors]);
    this.colors = this.colors.map((c, i) => (i === this.selected ? color : c));
    this.message = '';
  }
  undo(): void {
    const previous = this.history.pop();
    if (previous) this.colors = previous;
    this.message = '';
  }
  clear(): void {
    this.history.push([...this.colors]);
    this.colors = this.colors.map(() => -1);
    this.message = '';
  }
  solve(): void {
    const solution = solveMap(this.map, 4);
    if (solution.status === 'solved') {
      this.history.push([...this.colors]);
      this.colors = solution.colors;
      this.message =
        'Solución encontrada desde cero; se han podido cambiar tus asignaciones anteriores.';
    } else this.message = 'No se completó la búsqueda dentro del límite.';
  }
}
