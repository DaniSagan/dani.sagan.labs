import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
} from '@angular/core';
import { Automaton } from './cellular-automata.math';

@Component({
  selector: 'app-automaton-canvas',
  standalone: true,
  template:
    '<canvas #canvas role="img" [style.height.px]="strip ? 36 : null" [attr.aria-label]="label" (click)="pick($event)"></canvas>',
  styles: [
    ':host{display:block;min-width:0}canvas{display:block;width:100%;height:auto;image-rendering:pixelated;background:#12131c;border-radius:4px}',
  ],
})
export class AutomatonCanvasComponent implements AfterViewInit, OnChanges {
  @Input() rows: Automaton = [];
  @Input() visible = 501;
  @Input() label = 'Autómata: el tiempo avanza de arriba hacia abajo.';
  @Input() highlights: readonly { row: number; column: number }[] = [];
  @Input() difference = false;
  @Input() strip = false;
  @Output() cellPicked = new EventEmitter<{ row: number; column: number }>();
  @ViewChild('canvas') canvas?: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    this.draw();
  }
  ngOnChanges(): void {
    this.draw();
  }

  draw(): void {
    if (!this.canvas || !this.rows.length) return;
    const canvas = this.canvas.nativeElement;
    canvas.width = this.rows[0].length;
    canvas.height = this.rows.length;
    const context = canvas.getContext('2d');
    if (!context) return;
    const pixels = context.createImageData(canvas.width, canvas.height);
    this.rows.forEach((row, t) =>
      row.forEach((bit, i) => {
        const offset = 4 * (t * canvas.width + i);
        const active = t < this.visible && bit;
        pixels.data[offset] = active ? (this.difference ? 104 : 222) : 18;
        pixels.data[offset + 1] = active ? (this.difference ? 222 : 184) : 19;
        pixels.data[offset + 2] = active ? (this.difference ? 213 : 104) : 28;
        pixels.data[offset + 3] = 255;
      }),
    );
    for (const point of this.highlights) {
      if (
        point.row < this.visible &&
        point.row >= 0 &&
        point.column >= 0 &&
        point.column < canvas.width
      ) {
        pixels.data.set(
          [255, 102, 142, 255],
          4 * (point.row * canvas.width + point.column),
        );
      }
    }
    context.putImageData(pixels, 0, 0);
  }

  pick(event: MouseEvent): void {
    const bounds = this.canvas!.nativeElement.getBoundingClientRect();
    const row = Math.floor(
      ((event.clientY - bounds.top) / bounds.height) * this.rows.length,
    );
    const column = Math.floor(
      ((event.clientX - bounds.left) / bounds.width) * this.rows[0].length,
    );
    if (
      row >= 0 &&
      row < Math.min(this.visible, this.rows.length) &&
      column >= 0 &&
      column < this.rows[0].length
    ) {
      this.cellPicked.emit({ row, column });
    }
  }
}
