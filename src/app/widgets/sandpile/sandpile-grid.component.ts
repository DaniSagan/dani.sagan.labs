import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { Sandpile } from '../../shared/math/sandpile';

export const SAND_COLORS = ['#111f2a', '#427b9e', '#82e3cc', '#f6cc80', '#ef8fa3'];
@Component({
  selector: 'app-sandpile-grid', standalone: true,
  template: `<canvas #canvas width="520" height="520" role="img" [attr.aria-label]="label" (click)="pick($event)"></canvas>`,
  styles: [`:host{display:block;width:100%;max-width:560px;margin:auto}canvas{display:block;width:100%;height:auto;aspect-ratio:1;border:1px solid #46606c;border-radius:8px;image-rendering:pixelated;cursor:crosshair;touch-action:manipulation}`]
})
export class SandpileGridComponent implements OnInit, OnChanges {
  @Input({ required: true }) pile!: Sandpile;
  @Input() revision = 0;
  @Input() view: 'height' | 'odometer' = 'height';
  @Input() selected = -1;
  @Input() label = 'Cuadrícula de pilas de arena; cada color representa una altura.';
  @Output() cellSelected = new EventEmitter<number>();
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  ngOnInit(): void { this.draw(); }
  ngOnChanges(): void { if (this.canvas) this.draw(); }
  draw(): void {
    const ctx = this.canvas.nativeElement.getContext('2d');
    if (!ctx || !this.pile) return;
    const n = this.pile.size, cell = 520 / n;
    const maximum = Math.max(1, ...this.pile.odometer);
    ctx.fillStyle = '#111f2a'; ctx.fillRect(0, 0, 520, 520);
    this.pile.heights.forEach((h, i) => {
      const x = i % n, y = Math.floor(i / n);
      const intensity = Math.log1p(this.pile.odometer[i]) / Math.log1p(maximum);
      ctx.fillStyle = this.view === 'height' ? SAND_COLORS[Math.min(4, h)] : `rgb(${Math.round(17 + 230 * intensity)},${Math.round(31 + 170 * intensity)},${Math.round(42 + 86 * intensity)})`;
      ctx.fillRect(Math.floor(x * cell), Math.floor(y * cell), Math.ceil(cell), Math.ceil(cell));
      if (n <= 11 && this.view === 'height') {
        ctx.fillStyle = h >= 2 ? '#101820' : '#e4eff5'; ctx.font = `${Math.min(20, cell * 0.38)}px system-ui`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(h), (x + 0.5) * cell, (y + 0.5) * cell);
      }
    });
    if (this.selected >= 0) {
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
      ctx.strokeRect((this.selected % n) * cell + 1, Math.floor(this.selected / n) * cell + 1, Math.max(1, cell - 2), Math.max(1, cell - 2));
    }
  }
  pick(event: MouseEvent): void {
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    const x = Math.max(0, Math.min(this.pile.size - 1, Math.floor((event.clientX - rect.left) / rect.width * this.pile.size)));
    const y = Math.max(0, Math.min(this.pile.size - 1, Math.floor((event.clientY - rect.top) / rect.height * this.pile.size)));
    this.cellSelected.emit(y * this.pile.size + x);
  }
}
