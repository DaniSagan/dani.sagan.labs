import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type FractalRenderer = (ctx: CanvasRenderingContext2D, iterations: number, size: number) => void;

export function paint(ctx: CanvasRenderingContext2D, hue = 185): void {
  ctx.strokeStyle = `hsl(${hue}, 90%, 64%)`;
  ctx.fillStyle = ctx.strokeStyle;
  ctx.lineWidth = 1.4;
}

@Component({
  selector: 'app-fractal-explorer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fractal-explorer.component.html',
  styleUrl: './fractal-explorer.component.css'
})
export class FractalExplorerComponent implements AfterViewInit {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) draw!: FractalRenderer;
  @Input() formula = '';
  @Input() initialIterations = 4;
  @Input() minIterations = 0;
  @Input() maxIterations = 7;
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  iterations = 4;
  readonly size = 480;

  ngAfterViewInit(): void { this.iterations = this.initialIterations; this.render(); }

  update(): void { this.iterations = Math.max(0, Math.min(this.maxIterations, Number(this.iterations))); this.render(); }

  private render(): void {
    const ctx = this.canvas.nativeElement.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#070a12'; ctx.fillRect(0, 0, this.size, this.size);
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    this.draw(ctx, this.iterations, this.size);
  }
}
