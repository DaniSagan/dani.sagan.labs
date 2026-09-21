import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  NEWTON_EXAMPLES,
  NEWTON_STATUS,
  newtonIterate,
} from '../../shared/math/newton-raphson';

@Component({
  selector: 'app-newton-tangent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './newton-tangent.component.html',
  styleUrl: './newton-widgets.css',
})
export class NewtonTangentComponent implements OnDestroy {
  readonly examples = NEWTON_EXAMPLES;
  choice = 0;
  seed = this.examples[0].seed;
  step = 0;
  playing = false;
  result = newtonIterate(this.example.f, this.example.df, this.seed);
  curve = '';
  private timer?: ReturnType<typeof setInterval>;
  constructor() {
    this.update();
  }
  get example() {
    return this.examples[this.choice];
  }
  get current() {
    return this.result.rows[this.step];
  }
  get next() {
    return this.result.rows[this.step + 1];
  }
  get status(): string {
    return this.next
      ? 'Un paso: curva → tangente → eje x'
      : NEWTON_STATUS[this.result.status];
  }
  get outside(): boolean {
    return (
      !!this.next &&
      (this.next.x < this.example.xmin || this.next.x > this.example.xmax)
    );
  }
  sx(x: number): number {
    return (
      55 +
      (690 * (x - this.example.xmin)) / (this.example.xmax - this.example.xmin)
    );
  }
  sy(y: number): number {
    return (
      320 -
      (285 * (y - this.example.ymin)) / (this.example.ymax - this.example.ymin)
    );
  }
  get tangent(): string {
    const e = this.example,
      c = this.current;
    return `M55,${this.sy(c.fx + c.derivative * (e.xmin - c.x))} L745,${this.sy(c.fx + c.derivative * (e.xmax - c.x))}`;
  }
  select(): void {
    this.seed = this.example.seed;
    this.update();
  }
  update(): void {
    this.pause();
    this.step = 0;
    this.result = newtonIterate(this.example.f, this.example.df, this.seed);
    this.curve = Array.from({ length: 501 }, (_, i) => {
      const x =
        this.example.xmin + ((this.example.xmax - this.example.xmin) * i) / 500;
      return `${i ? 'L' : 'M'}${this.sx(x)},${this.sy(this.example.f(x))}`;
    }).join(' ');
  }
  choosePoint(event: MouseEvent): void {
    const svg = event.currentTarget as SVGSVGElement;
    const transform = svg.getScreenCTM();
    if (!transform) return;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(
      transform.inverse(),
    );
    this.seed = Math.max(
      this.example.xmin,
      Math.min(
        this.example.xmax,
        this.example.xmin +
          ((point.x - 55) / 690) * (this.example.xmax - this.example.xmin),
      ),
    );
    this.update();
  }
  go(step: number): void {
    this.pause();
    this.step = step;
  }
  toggle(): void {
    if (this.playing) {
      this.pause();
      return;
    }
    if (!this.next) this.step = 0;
    if (!this.next) return;
    this.playing = true;
    this.timer = setInterval(() => {
      if (this.next) this.step++;
      if (!this.next) this.pause();
    }, 1000);
  }
  pause(): void {
    clearInterval(this.timer);
    this.playing = false;
  }
  format(value: number): string {
    return Number.isFinite(value)
      ? Math.abs(value) < 1e-5 && value !== 0
        ? value.toExponential(4)
        : value.toPrecision(8)
      : '—';
  }
  residual(value: number): string {
    return Math.abs(value).toExponential(3);
  }
  exportCsv(): void {
    const csv = [
      'n,x,f(x),derivative',
      ...this.result.rows.map((r, n) => `${n},${r.x},${r.fx},${r.derivative}`),
    ].join('\n');
    const url = URL.createObjectURL(
      new Blob([csv], { type: 'text/csv;charset=utf-8' }),
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = 'newton-raphson.csv';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  ngOnDestroy(): void {
    this.pause();
  }
}
