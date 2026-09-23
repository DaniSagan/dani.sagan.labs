import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  colorConflicts,
  fourColorMap,
  MAP_PALETTE,
  PlanarMap,
} from '../../shared/math/four-color';

@Component({
  selector: 'app-four-color-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './four-color-map.component.html',
  styleUrl: './four-color-map.component.css',
})
export class FourColorMapComponent {
  @Input() map: PlanarMap = fourColorMap();
  @Input() colors: number[] = [];
  @Input() selected = -1;
  @Input() dual = true;
  @Input() interactive = true;
  @Input() highlight: number[] = [];
  @Output() regionSelect = new EventEmitter<number>();
  readonly palette = MAP_PALETTE;
  label(i: number): string {
    return String.fromCharCode(65 + i);
  }
  polygon(i: number): string {
    return this.map.cells[i].map((p) => `${p.x},${p.y}`).join(' ');
  }
  fill(i: number): string {
    return this.palette[this.colors[i]] ?? '#24374b';
  }
  get conflicts(): [number, number][] {
    return colorConflicts(this.map.edges, this.colors);
  }
  conflict(a: number, b: number): boolean {
    return this.colors[a] >= 0 && this.colors[a] === this.colors[b];
  }
  select(event: Event, i: number): void {
    if (this.interactive) {
      event.preventDefault();
      this.regionSelect.emit(i);
    }
  }
}
