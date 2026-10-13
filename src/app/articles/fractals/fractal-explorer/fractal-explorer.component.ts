import { OnInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
export type FractalRenderer = (ctx: CanvasRenderingContext2D, iterations: number, size: number) => void;
export function paint(ctx: CanvasRenderingContext2D, hue = 185): void {
  ctx.strokeStyle = hue === 185 ? '#e8643a' : hue < 100 ? '#d4a843' : '#4a9eff';
  ctx.fillStyle = ctx.strokeStyle; ctx.lineWidth = 1.4;
}
@Component({ selector: 'app-fractal-explorer', standalone: true, imports: [CommonModule, FormsModule],
  templateUrl: './fractal-explorer.component.html', styleUrl: './fractal-explorer.component.css' })
export class FractalExplorerComponent implements OnInit, OnDestroy {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) draw!: FractalRenderer;
  @Input() formula = '';
  @Input() initialIterations = 4;
  @Input() minIterations = 0;
  @Input() maxIterations = 7;
  @Input() raster = false;
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  iterations = 4;
  readonly size = 480;
  private frame = 0;
  ngOnInit(): void { this.reset(); }
  ngOnDestroy(): void { cancelAnimationFrame(this.frame); }
  update(): void {
    const value = Number(this.iterations);
    this.iterations = Math.max(this.minIterations, Math.min(this.maxIterations,
      Number.isFinite(value) ? Math.round(value) : this.initialIterations));
    cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(() => this.render());
  }
  step(delta: number): void { this.iterations += delta; this.update(); }
  reset(): void { this.iterations = this.initialIterations; this.update(); }
  save(): void {
    const link = document.createElement('a');
    link.download = `${this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${this.iterations}.png`;
    link.href = this.canvas.nativeElement.toDataURL('image/png'); link.click();
  }
  private render(): void {
    const canvas = this.canvas.nativeElement;
    // Preserve 480-unit geometry. putImageData renderers must use native resolution.
    const ratio = this.raster ? 1 : Math.min(2, window.devicePixelRatio || 1);
    canvas.width = canvas.height = this.size * ratio;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    ctx.scale(ratio, ratio);
    ctx.fillStyle = '#0a0a0f'; ctx.fillRect(0, 0, this.size, this.size);
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.save(); this.draw(ctx, this.iterations, this.size); ctx.restore();
  }
}
