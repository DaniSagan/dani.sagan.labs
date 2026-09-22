import { Component, Input, OnChanges } from '@angular/core';

export interface LaplaceSeries {
  label: string;
  color: string;
  values: number[];
}

@Component({
  selector: 'app-laplace-plot',
  standalone: true,
  templateUrl: './laplace-plot.component.html',
  styleUrls: ['./laplace-widgets.css'],
})
export class LaplacePlotComponent implements OnChanges {
  @Input() series: LaplaceSeries[] = [];
  @Input() end = 10;
  @Input() description = '';
  @Input() xLabel = 't';
  @Input() marker: number | null = null;
  min = 0;
  max = 1;
  ticks: number[] = [];
  paths: { label: string; color: string; path: string }[] = [];
  ngOnChanges(): void {
    const values = this.series.flatMap((s) => s.values).filter(Number.isFinite);
    const low = Math.min(0, ...values);
    const high = Math.max(0, ...values);
    const margin = (high - low || 1) * 0.08;
    this.min = low - margin;
    this.max = high + margin;
    this.ticks = [low, (low + high) / 2, high].filter(
      (v, i, a) => a.indexOf(v) === i,
    );
    this.paths = this.series.map((s) => ({
      label: s.label,
      color: s.color,
      path: s.values
        .map(
          (v, i) =>
            `${i ? 'L' : 'M'}${64 + (i / Math.max(1, s.values.length - 1)) * 570},${this.y(v)}`,
        )
        .join(' '),
    }));
  }
  y(v: number): number {
    return 225 - ((v - this.min) / (this.max - this.min)) * 205;
  }
  format(v: number): string {
    return Math.abs(v) >= 10000
      ? v.toExponential(1)
      : Number(v.toFixed(3)).toString();
  }
}
