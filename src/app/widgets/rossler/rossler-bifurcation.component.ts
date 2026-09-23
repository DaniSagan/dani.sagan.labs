import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ROSSLER_DEFAULTS,
  rosslerOrbit,
  rosslerPeaks,
} from '../../shared/math/rossler';

@Component({
  selector: 'app-rossler-bifurcation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rossler-bifurcation.component.html',
  styleUrl: './rossler-widgets.css',
})
export class RosslerBifurcationComponent implements OnDestroy {
  @Input() c = 5.7;
  @Output() cChange = new EventEmitter<number>();
  rows: { c: number; peaks: number[] }[] = [];
  dots: { x: number; y: number; c: number; z: number }[] = [];
  running = false;
  error = '';
  inspected = 5.7;
  private timer?: ReturnType<typeof setTimeout>;
  get selectedRow() {
    return this.rows.reduce<{ c: number; peaks: number[] } | undefined>(
      (best, row) =>
        !best ||
        Math.abs(row.c - this.inspected) < Math.abs(best.c - this.inspected)
          ? row
          : best,
      undefined,
    );
  }
  get peakSummary(): string {
    return (
      this.selectedRow?.peaks
        .slice(-8)
        .map((z) => z.toFixed(3))
        .join(' · ') ?? 'Columna aún no calculada'
    );
  }
  start(): void {
    if (this.running || this.rows.length >= 81) return;
    this.running = true;
    this.schedule();
  }
  private schedule(): void {
    this.timer = setTimeout(() => this.batch(), 0);
  }
  private batch(): void {
    try {
      const c = 2 + this.rows.length * 0.05;
      const peaks = rosslerPeaks(
        rosslerOrbit({ ...ROSSLER_DEFAULTS, c }, 300, 300, 0.02),
      );
      this.rows.push({ c, peaks });
      this.dots.push(
        ...peaks.map((z) => ({
          x: 60 + ((c - 2) / 4) * 550,
          y: 240 - (z / 30) * 210,
          c,
          z,
        })),
      );
      if (this.rows.length >= 81) this.pause();
      else if (this.running) this.schedule();
    } catch (error) {
      this.error = (error as Error).message;
      this.pause();
    }
  }
  pause(): void {
    clearTimeout(this.timer);
    this.running = false;
  }
  reset(): void {
    this.pause();
    this.rows = [];
    this.dots = [];
    this.error = '';
  }
  select(c: number): void {
    this.inspected = c;
    this.cChange.emit(c);
  }
  plotClick(event: MouseEvent): void {
    const svg = event.currentTarget as SVGSVGElement;
    const matrix = svg.getScreenCTM();
    if (!matrix) return;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(
      matrix.inverse(),
    );
    const c =
      Math.round(
        (2 + (Math.max(0, Math.min(550, point.x - 60)) / 550) * 4) * 20,
      ) / 20;
    this.select(c);
  }
  ngOnDestroy(): void {
    this.pause();
  }
}
