import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ComplexValue,
  formatComplex,
  riemannZeta,
} from '../../shared/math/riemann-zeta';

@Component({
  selector: 'app-zeta-critical-strip',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './zeta-critical-strip.component.html',
  styleUrl: './zeta-widgets.css',
})
export class ZetaCriticalStripComponent implements OnDestroy {
  sigma = 0.5;
  start = 0;
  end = 40;
  t = 0;
  plottedSigma = 0.5;
  plottedStart = 0;
  plottedEnd = 40;
  realPath = '';
  imaginaryPath = '';
  modulusPath = '';
  trajectory = '';
  error = '';
  current = '';
  currentModulus = '';
  bound = 1;
  planeBound = 1;
  point: ComplexValue = { re: 0, im: 0 };
  timer?: ReturnType<typeof setInterval>;
  readonly ticks = [0, 0.25, 0.5, 0.75, 1];
  constructor() {
    this.plot();
  }
  get playing(): boolean {
    return this.timer !== undefined;
  }
  get cursorX(): number {
    return (
      55 +
      (640 * (this.t - this.plottedStart)) /
        (this.plottedEnd - this.plottedStart)
    );
  }
  planeX(x: number): number {
    return 200 + (160 * x) / this.planeBound;
  }
  planeY(y: number): number {
    return 200 - (160 * y) / this.planeBound;
  }
  plot(): void {
    this.stop();
    this.error = '';
    if (
      ![this.sigma, this.start, this.end].every(
        (v) => typeof v === 'number' && Number.isFinite(v),
      ) ||
      this.sigma <= 0 ||
      this.sigma >= 1 ||
      this.start >= this.end ||
      Math.abs(this.start) > 200 ||
      Math.abs(this.end) > 200 ||
      this.end - this.start > 100
    ) {
      this.error =
        'Usa 0 < σ < 1 y −200 ≤ t inicial < t final ≤ 200, con un intervalo de hasta 100 unidades.';
      return;
    }
    try {
      const count = 800;
      const samples = Array.from({ length: count + 1 }, (_, i) =>
        riemannZeta(
          this.sigma,
          this.start + ((this.end - this.start) * i) / count,
        ),
      );
      this.bound =
        Math.max(1, ...samples.map((z) => Math.hypot(z.re, z.im))) * 1.08;
      this.planeBound =
        Math.max(
          1,
          ...samples.map((z) => Math.max(Math.abs(z.re), Math.abs(z.im))),
        ) * 1.1;
      const path = (value: (z: ComplexValue) => number): string =>
        samples
          .map(
            (z, i) =>
              `${i ? 'L' : 'M'}${55 + (640 * i) / count},${170 - (130 * value(z)) / this.bound}`,
          )
          .join(' ');
      this.realPath = path((z) => z.re);
      this.imaginaryPath = path((z) => z.im);
      this.modulusPath = path((z) => Math.hypot(z.re, z.im));
      this.trajectory = samples
        .map(
          (z, i) => `${i ? 'L' : 'M'}${this.planeX(z.re)},${this.planeY(z.im)}`,
        )
        .join(' ');
      this.plottedSigma = this.sigma;
      this.plottedStart = this.start;
      this.plottedEnd = this.end;
      this.t = this.start;
      this.updatePoint();
    } catch (e) {
      this.error = (e as Error).message;
    }
  }
  updatePoint(): void {
    this.point = riemannZeta(this.plottedSigma, this.t);
    this.current = formatComplex(this.point);
    this.currentModulus = Math.hypot(this.point.re, this.point.im).toPrecision(
      7,
    );
  }
  firstZero(): void {
    this.sigma = 0.5;
    this.start = 12;
    this.end = 16;
    this.plot();
    this.t = 14.1347251417347;
    this.updatePoint();
  }
  toggle(): void {
    if (this.playing) {
      this.stop();
      return;
    }
    this.timer = setInterval(() => {
      this.t += (this.plottedEnd - this.plottedStart) / 600;
      if (this.t > this.plottedEnd) this.t = this.plottedStart;
      this.updatePoint();
    }, 40);
  }
  stop(): void {
    if (this.timer !== undefined) clearInterval(this.timer);
    this.timer = undefined;
  }
  ngOnDestroy(): void {
    this.stop();
  }
}
