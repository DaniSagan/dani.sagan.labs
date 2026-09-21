import {
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CUBIC_ROOTS, cubicBasin } from '../../shared/math/newton-raphson';

@Component({
  selector: 'app-newton-basins',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './newton-basins.component.html',
  styleUrl: './newton-widgets.css',
})
export class NewtonBasinsComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  readonly roots = CUBIC_ROOTS;
  readonly colors = ['#82e3cc', '#f6cc80', '#c5a6ff'];
  readonly rgb = [
    [130, 227, 204],
    [246, 204, 128],
    [197, 166, 255],
  ];
  re = 0.5;
  im = 0.5;
  max = 40;
  centerRe = 0;
  centerIm = 0;
  span = 4;
  drawing = false;
  progress = 0;
  selected = cubicBasin(this.re, this.im, this.max, true);
  private frame = 0;
  private ready = false;
  constructor(private zone: NgZone) {}
  ngOnInit(): void {
    this.ready = true;
    this.draw();
  }
  select(): void {
    this.selected = cubicBasin(this.re, this.im, this.max, true);
  }
  update(): void {
    this.select();
    this.draw();
  }
  get status(): string {
    return this.selected.root >= 0
      ? `Raíz ${this.selected.root + 1} en ${this.selected.iterations} iteraciones`
      : this.selected.reason === 'singular'
        ? 'Iteración indefinida: singularidad o desbordamiento'
        : `Sin clasificar tras ${this.max} iteraciones`;
  }
  sx(re: number): number {
    return 300 + ((re - this.centerRe) * 600) / this.span;
  }
  sy(im: number): number {
    return 300 - ((im - this.centerIm) * 600) / this.span;
  }
  get orbitPath(): string {
    return this.selected.orbit
      .map((p, i) => `${i ? 'L' : 'M'}${this.sx(p.re)},${this.sy(p.im)}`)
      .join(' ');
  }
  get outside(): boolean {
    return this.selected.orbit.some(
      (p) =>
        Math.abs(p.re - this.centerRe) > this.span / 2 ||
        Math.abs(p.im - this.centerIm) > this.span / 2,
    );
  }
  pick(event: MouseEvent): void {
    const svg = event.currentTarget as SVGSVGElement,
      transform = svg.getScreenCTM();
    if (!transform) return;
    const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(
      transform.inverse(),
    );
    this.re = this.centerRe + (p.x / 600 - 0.5) * this.span;
    this.im = this.centerIm + (0.5 - p.y / 600) * this.span;
    this.select();
  }
  zoom(): void {
    this.centerRe = this.re;
    this.centerIm = this.im;
    this.span = Math.max(0.015625, this.span / 2);
    this.draw();
  }
  reset(): void {
    this.centerRe = 0;
    this.centerIm = 0;
    this.span = 4;
    this.re = Math.max(-2, Math.min(2, this.re));
    this.im = Math.max(-2, Math.min(2, this.im));
    this.select();
    this.draw();
  }
  draw(): void {
    if (!this.ready) return;
    cancelAnimationFrame(this.frame);
    const context = this.canvas.nativeElement.getContext('2d');
    if (!context) return;
    const size = 300,
      data = context.createImageData(size, size);
    this.drawing = true;
    this.progress = 0;
    context.fillStyle = '#0a141c';
    context.fillRect(0, 0, size, size);
    const centerRe = this.centerRe,
      centerIm = this.centerIm,
      span = this.span,
      max = this.max;
    let row = 0;
    this.zone.runOutsideAngular(() => {
      const chunk = () => {
        const end = Math.min(size, row + 12);
        for (; row < end; row++) {
          for (let col = 0; col < size; col++) {
            const r = cubicBasin(
              centerRe + ((col + 0.5) / size - 0.5) * span,
              centerIm + (0.5 - (row + 0.5) / size) * span,
              max,
            );
            const color = r.root < 0 ? [20, 28, 36] : this.rgb[r.root];
            const brightness =
              r.root < 0 ? 1 : 0.3 + 0.7 * (1 - r.iterations / max);
            const i = (row * size + col) * 4;
            for (let c = 0; c < 3; c++)
              data.data[i + c] = color[c] * brightness;
            data.data[i + 3] = 255;
          }
        }
        context.putImageData(data, 0, 0, 0, 0, size, row);
        this.zone.run(() => {
          this.progress = Math.round((100 * row) / size);
          this.drawing = row < size;
        });
        if (row < size) this.frame = requestAnimationFrame(chunk);
      };
      this.frame = requestAnimationFrame(chunk);
    });
  }
  ngOnDestroy(): void {
    cancelAnimationFrame(this.frame);
  }
}
