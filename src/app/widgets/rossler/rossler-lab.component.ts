import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ROSSLER_DEFAULTS,
  RosslerState,
  rosslerOrbit,
  rosslerPeaks,
  rosslerSection,
} from '../../shared/math/rossler';

@Component({
  selector: 'app-rossler-lab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rossler-lab.component.html',
  styleUrl: './rossler-widgets.css',
})
export class RosslerLabComponent
  implements OnChanges, AfterViewInit, OnDestroy
{
  @Input() c = 5.7;
  @Output() cChange = new EventEmitter<number>();
  @ViewChild('canvas') canvas?: ElementRef<HTMLCanvasElement>;
  points: RosslerState[] = [];
  h = 0.02;
  projection = '3d';
  yaw = 0.55;
  pitch = 0.6;
  zoom = 1;
  cursor = 150;
  running = false;
  error = '';
  diagnostic = 'return';
  timePaths: string[] = [];
  plotPoints: { x: number; y: number; label: string }[] = [];
  xRange = '';
  yRange = '';
  peakCount = 0;
  sectionCount = 0;
  private frame = 0;
  private previousTime = 0;
  private observer?: ResizeObserver;
  private drag?: { x: number; y: number };
  get state(): RosslerState {
    return (
      this.points[
        Math.min(this.points.length - 1, Math.round(this.cursor / this.h))
      ] ?? [0, 0, 0]
    );
  }
  ngOnChanges(): void {
    this.generate();
  }
  ngAfterViewInit(): void {
    this.observer = new ResizeObserver(() => this.draw());
    this.observer.observe(this.canvas!.nativeElement);
    if (!this.points.length) this.generate();
    else this.draw();
  }
  generate(): void {
    this.pause();
    this.error = '';
    try {
      this.points = rosslerOrbit(
        { ...ROSSLER_DEFAULTS, c: this.c },
        300,
        150,
        this.h,
      );
      this.cursor = 150;
      this.timePaths = [0, 1, 2].map((axis) =>
        this.points
          .filter((_, i) => i % 10 === 0)
          .map(
            (p, i) =>
              `${i ? 'L' : 'M'}${50 + ((i * 10 * this.h) / 300) * 560},${120 - p[axis] * 3}`,
          )
          .join(' '),
      );
      this.updateDiagnostic();
      this.draw();
    } catch (error) {
      this.points = [];
      this.error = (error as Error).message;
      this.draw();
    }
  }
  changeC(value: number): void {
    this.c = Number(value);
    this.cChange.emit(this.c);
    this.generate();
  }
  updateDiagnostic(): void {
    const peaks = rosslerPeaks(this.points),
      section = rosslerSection(this.points);
    this.peakCount = peaks.length;
    this.sectionCount = section.length;
    const data =
      this.diagnostic === 'return'
        ? peaks.slice(0, -1).map((z, i) => ({ x: z, y: peaks[i + 1] }))
        : section.map((p) => ({ x: p.y, y: p.z }));
    if (!data.length) {
      this.plotPoints = [];
      return;
    }
    const xs = data.map((p) => p.x),
      ys = data.map((p) => p.y);
    const bounds = (values: number[]) => {
      const lo = Math.min(...values),
        hi = Math.max(...values),
        pad = Math.max((hi - lo) * 0.08, 0.01);
      return [lo - pad, hi + pad];
    };
    const [xmin, xmax] = bounds(xs),
      [ymin, ymax] = bounds(ys);
    this.xRange = `${xmin.toFixed(3)} … ${xmax.toFixed(3)}`;
    this.yRange = `${ymin.toFixed(3)} … ${ymax.toFixed(3)}`;
    this.plotPoints = data.map((p) => ({
      x: 60 + ((p.x - xmin) / (xmax - xmin)) * 550,
      y: 230 - ((p.y - ymin) / (ymax - ymin)) * 200,
      label: `(${p.x.toFixed(5)}, ${p.y.toFixed(5)})`,
    }));
  }
  toggle(): void {
    if (this.running) {
      this.pause();
      return;
    }
    if (!this.points.length) return;
    if (this.cursor >= 300) this.cursor = 0;
    this.running = true;
    this.previousTime = 0;
    const animate = (time: number) => {
      if (!this.running) return;
      if (this.previousTime)
        this.cursor = Math.min(
          300,
          this.cursor + Math.min(0.1, (time - this.previousTime) / 1000) * 8,
        );
      this.previousTime = time;
      this.draw();
      if (this.cursor >= 300) this.pause();
      else this.frame = requestAnimationFrame(animate);
    };
    this.frame = requestAnimationFrame(animate);
  }
  pause(): void {
    this.running = false;
    cancelAnimationFrame(this.frame);
  }
  resetView(): void {
    this.yaw = 0.55;
    this.pitch = 0.6;
    this.zoom = 1;
    this.draw();
  }
  pointerDown(event: PointerEvent): void {
    this.drag = { x: event.clientX, y: event.clientY };
    this.canvas!.nativeElement.setPointerCapture(event.pointerId);
  }
  pointerMove(event: PointerEvent): void {
    if (!this.drag || this.projection !== '3d') return;
    this.yaw += (event.clientX - this.drag.x) / 150;
    this.pitch = Math.max(
      -1.4,
      Math.min(1.4, this.pitch + (event.clientY - this.drag.y) / 150),
    );
    this.drag = { x: event.clientX, y: event.clientY };
    this.draw();
  }
  pointerUp(): void {
    this.drag = undefined;
  }
  draw(): void {
    const canvas = this.canvas?.nativeElement,
      context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    const width = canvas.clientWidth || 700,
      height = 420,
      dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    context.scale(dpr, dpr);
    context.fillStyle = '#091320';
    context.fillRect(0, 0, width, height);
    const scale = Math.min(width / 36, height / 36) * this.zoom;
    const project = ([x, y, rawZ]: RosslerState): [number, number] => {
      const z = rawZ - 7;
      if (this.projection === 'xy')
        return [width / 2 + x * scale, height / 2 - y * scale];
      if (this.projection === 'xz')
        return [width / 2 + x * scale, height / 2 - z * scale];
      if (this.projection === 'yz')
        return [width / 2 + y * scale, height / 2 - z * scale];
      const u = x * Math.cos(this.yaw) - y * Math.sin(this.yaw),
        v = x * Math.sin(this.yaw) + y * Math.cos(this.yaw);
      return [
        width / 2 + u * scale,
        height / 2 -
          (v * Math.sin(this.pitch) + z * Math.cos(this.pitch)) * scale,
      ];
    };
    const origin = project([0, 0, 0]);
    context.font = '13px system-ui';
    (
      [
        [10, 0, 0],
        [0, 10, 0],
        [0, 0, 20],
      ] as RosslerState[]
    ).forEach((axis, i) => {
      const end = project(axis);
      context.strokeStyle = '#42536b';
      context.beginPath();
      context.moveTo(...origin);
      context.lineTo(...end);
      context.stroke();
      context.fillStyle = '#c5d4e8';
      context.fillText(['x = 10', 'y = 10', 'z = 20'][i], end[0] + 4, end[1]);
    });
    const end = Math.min(
      this.points.length - 1,
      Math.round(this.cursor / this.h),
    );
    // Full orbit as context; the bright segment is the last 12 time units.
    const path = (
      start: number,
      finish: number,
      color: string,
      step: number,
    ) => {
      context.beginPath();
      context.strokeStyle = color;
      context.lineWidth = 1;
      for (let i = start; i <= finish; i += step) {
        const p = project(this.points[i]);
        if (i === start) context.moveTo(...p);
        else context.lineTo(...p);
      }
      context.stroke();
    };
    if (this.points.length) {
      path(0, this.points.length - 1, '#34566b', 3);
      path(Math.max(0, end - Math.round(12 / this.h)), end, '#8ce6cd', 1);
      const p = project(this.state);
      context.beginPath();
      context.arc(...p, 4, 0, 2 * Math.PI);
      context.fillStyle = '#f5ce88';
      context.fill();
    }
  }
  ngOnDestroy(): void {
    this.pause();
    this.observer?.disconnect();
  }
}
