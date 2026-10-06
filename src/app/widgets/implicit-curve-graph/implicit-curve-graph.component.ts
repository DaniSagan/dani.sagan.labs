import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Vec2 } from 'src/app/shared/math/vec2';
import {
  axisTicks,
  ContourSegment,
  niceStep,
  traceContours,
} from './implicit-contours';

@Component({
  selector: 'app-implicit-curve-graph',
  templateUrl: './implicit-curve-graph.component.html',
  styleUrls: ['./implicit-curve-graph.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ImplicitCurveGraphComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy
{
  @ViewChild('graphCanvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;
  @Input() backgroundColor = '#10131d';
  @Input() axesColor = '#b8c4d9';
  @Input() gridColor = '#343d50';
  @Input() subdivisionColor = '#202838';
  @Input() labelColor = '#d8e2f2';
  @Input() showAxes = true;
  @Input() showLabels = true;
  @Input() showGrid = true;
  @Input() showSubdivisions = true;
  @Input() showSettings = true;
  @Input() xDivision = 0;
  @Input() yDivision = 0;
  @Input() subdivisions = 5;
  @Input() lineWidth = 2;
  @Input() sampleSize = 2;
  @Input() curveColor: string | null = null;
  @Output() readonly boundsChange = new EventEmitter<[number, number, number, number]>();
  xMin = -10;
  xMax = 10;
  yMin = -10;
  yMax = 10;
  /** Kept for source compatibility; root refinement replaces this scale-dependent threshold. */
  gradientThreshold = 1e6;
  functions: GraphableFunction[] = [];
  context!: CanvasRenderingContext2D;
  message = '';
  coordinates = '';
  dragEnabled = false;
  wheelZoomEnabled = false;
  private initialBounds: [number, number, number, number] = [-10, 10, -10, 10];
  private sceneFunctions: GraphableFunction[] = [];
  private overlays: ((ctx: CanvasRenderingContext2D) => void)[] = [];
  private cache = new Map<
    GraphableFunction,
    { key: string; segments: ContourSegment[] }
  >();
  private resize?: ResizeObserver;
  private frame = 0;
  private touches = new Map<number, { x: number; y: number }>();
  private pinch?: {
    distance: number;
    x: number;
    y: number;
    bounds: [number, number, number, number];
  };
  private drag?: {
    id: number;
    x: number;
    y: number;
    bounds: [number, number, number, number];
  };
  private get bounds(): [number, number, number, number] {
    return [this.xMin, this.xMax, this.yMin, this.yMax];
  }
  private get scale(): number {
    return (
      this.canvas.nativeElement.width /
      (this.canvas.nativeElement.getBoundingClientRect().width || 600)
    );
  }

  ngOnInit(): void {
    this.context = this.canvas.nativeElement.getContext('2d')!;
  }
  ngAfterViewInit(): void {
    this.resize = new ResizeObserver(() => {
      const width = this.canvas.nativeElement.getBoundingClientRect().width;
      if (!width) return;
      const size = Math.max(
        200,
        Math.round(width * Math.min(window.devicePixelRatio || 1, 2)),
      );
      if (this.canvas.nativeElement.width !== size) {
        this.canvas.nativeElement.width = size;
        this.canvas.nativeElement.height = size;
        this.scheduleRedraw();
      }
    });
    this.resize.observe(this.canvas.nativeElement);
    this.scheduleRedraw();
  }
  ngOnChanges(): void {
    if (this.context) this.scheduleRedraw();
  }
  ngOnDestroy(): void {
    this.resize?.disconnect();
    cancelAnimationFrame(this.frame);
  }

  private validBounds(bounds = this.bounds): boolean {
    return (
      bounds.every(Number.isFinite) &&
      bounds[0] < bounds[1] &&
      bounds[2] < bounds[3] &&
      Number.isFinite(bounds[1] - bounds[0]) &&
      Number.isFinite(bounds[3] - bounds[2])
    );
  }
  setBounds(xMin: number, xMax: number, yMin: number, yMax: number): void {
    const bounds: [number, number, number, number] = [xMin, xMax, yMin, yMax];
    if (!this.validBounds(bounds))
      throw new Error(
        'Los límites deben ser finitos y el mínimo debe ser menor que el máximo.',
      );
    [this.xMin, this.xMax, this.yMin, this.yMax] = bounds;
    this.initialBounds = [...bounds];
  }
  drawGraph(): void {
    this.overlays = [];
    this.sceneFunctions = [...this.functions];
    this.cache.clear();
    this.redraw();
  }
  redraw(): void {
    if (!this.context) return;
    if (!this.validBounds()) {
      this.message = 'Revisa los límites de los ejes.';
      return;
    }
    this.message = '';
    this.paintBackground();
    this.drawAxes();
    for (const fn of this.sceneFunctions) {
      try {
        this.drawFunction(fn);
      } catch {
        this.message =
          'No se pudo evaluar una función. Revisa su fórmula y su dominio.';
      }
    }
    for (const overlay of this.overlays) this.runOverlay(overlay);
    if (this.showLabels) this.drawLabels();
  }
  private scheduleRedraw(): void {
    cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(() => this.redraw());
  }
  clear(): void {
    this.overlays = [];
    this.sceneFunctions = [];
    this.cache.clear();
    this.paintBackground();
  }
  private paintBackground(): void {
    this.context.clearRect(
      0,
      0,
      this.canvas.nativeElement.width,
      this.canvas.nativeElement.height,
    );
    this.context.fillStyle = this.backgroundColor;
    this.context.fillRect(
      0,
      0,
      this.canvas.nativeElement.width,
      this.canvas.nativeElement.height,
    );
  }
  get xStep(): number {
    return this.xDivision > 0 && Number.isFinite(this.xDivision)
      ? this.xDivision
      : niceStep(
          this.xMax - this.xMin,
          Math.max(
            2,
            (this.canvas.nativeElement.getBoundingClientRect().width || 600) /
              85,
          ),
        );
  }
  get yStep(): number {
    return this.yDivision > 0 && Number.isFinite(this.yDivision)
      ? this.yDivision
      : niceStep(
          this.yMax - this.yMin,
          Math.max(
            2,
            (this.canvas.nativeElement.getBoundingClientRect().width || 600) /
              70,
          ),
        );
  }
  private gridLines(
    stepX: number,
    stepY: number,
    color: string,
    width: number,
  ): void {
    const ctx = this.context,
      canvas = this.canvas.nativeElement;
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = width * this.scale;
    for (const value of axisTicks(this.xMin, this.xMax, stepX)) {
      const x = this.xToPixel(value);
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
    }
    for (const value of axisTicks(this.yMin, this.yMax, stepY)) {
      const y = this.yToPixel(value);
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
    }
    ctx.stroke();
  }
  drawAxes(): void {
    const ctx = this.context,
      canvas = this.canvas.nativeElement;
    ctx.save();
    if (this.showGrid) {
      if (this.showSubdivisions) {
        const count = Math.max(
          2,
          Math.min(10, Math.round(this.subdivisions) || 5),
        );
        this.gridLines(
          this.xStep / count,
          this.yStep / count,
          this.subdivisionColor,
          0.5,
        );
      }
      this.gridLines(this.xStep, this.yStep, this.gridColor, 0.8);
    }
    if (this.showAxes) {
      ctx.beginPath();
      ctx.strokeStyle = this.axesColor;
      ctx.lineWidth = 1.3 * this.scale;
      if (this.yMin <= 0 && this.yMax >= 0) {
        const y = this.yToPixel(0);
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }
      if (this.xMin <= 0 && this.xMax >= 0) {
        const x = this.xToPixel(0);
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }
      ctx.stroke();
    }
    ctx.restore();
    if (this.showLabels) this.drawLabels();
  }
  formatValue(value: number, step = 1): string {
    if (Math.abs(value) < Math.abs(step) * 1e-9) return '0';
    if (Math.abs(value) >= 1e5 || Math.abs(value) < 1e-3)
      return value.toExponential(1);
    return Number(value.toPrecision(8)).toLocaleString('es-ES', {
      maximumFractionDigits: 8,
      useGrouping: false,
    });
  }
  private drawLabels(): void {
    const ctx = this.context,
      canvas = this.canvas.nativeElement,
      scale = this.scale;
    const axisX = Math.max(
      12 * scale,
      Math.min(canvas.width - 12 * scale, this.xToPixel(0)),
    );
    const axisY = Math.max(
      14 * scale,
      Math.min(canvas.height - 28 * scale, this.yToPixel(0)),
    );
    ctx.save();
    ctx.font = `${11 * scale}px monospace`;
    ctx.fillStyle = this.labelColor;
    ctx.strokeStyle = this.axesColor;
    ctx.lineWidth = scale;
    ctx.textBaseline = 'middle';
    const text = (
      label: string,
      x: number,
      y: number,
      align: CanvasTextAlign,
    ) => {
      ctx.textAlign = align;
      const width = ctx.measureText(label).width;
      const left =
        align === 'center' ? x - width / 2 : align === 'right' ? x - width : x;
      ctx.fillStyle = this.backgroundColor;
      ctx.fillRect(
        left - 2 * scale,
        y - 7 * scale,
        width + 4 * scale,
        14 * scale,
      );
      ctx.fillStyle = this.labelColor;
      ctx.fillText(label, x, y);
    };
    for (const value of axisTicks(this.xMin, this.xMax, this.xStep)) {
      const x = this.xToPixel(value);
      if (x < 25 * scale || x > canvas.width - 25 * scale) continue;
      if (this.showAxes) {
        ctx.beginPath();
        ctx.moveTo(x, axisY - 3 * scale);
        ctx.lineTo(x, axisY + 3 * scale);
        ctx.stroke();
      }
      text(
        this.formatValue(value, this.xStep),
        x,
        axisY + 16 * scale,
        'center',
      );
    }
    for (const value of axisTicks(this.yMin, this.yMax, this.yStep)) {
      const y = this.yToPixel(value);
      if (y < 16 * scale || y > canvas.height - 16 * scale || value === 0)
        continue;
      if (this.showAxes) {
        ctx.beginPath();
        ctx.moveTo(axisX - 3 * scale, y);
        ctx.lineTo(axisX + 3 * scale, y);
        ctx.stroke();
      }
      const leftSide = axisX >= 65 * scale;
      text(
        this.formatValue(value, this.yStep),
        axisX + (leftSide ? -9 : 9) * scale,
        y,
        leftSide ? 'right' : 'left',
      );
    }
    text('x', canvas.width - 12 * scale, axisY + 15 * scale, 'center');
    text('y', axisX + 12 * scale, 12 * scale, 'center');
    ctx.restore();
  }
  drawFunction(fn: GraphableFunction): void {
    const canvas = this.canvas.nativeElement;
    const size =
      Math.max(1, Math.min(8, Number(this.sampleSize) || 2)) * this.scale;
    const columns = Math.ceil(canvas.width / size),
      rows = Math.ceil(canvas.height / size);
    const key = [...this.bounds, columns, rows].join(',');
    let cached = this.cache.get(fn);
    if (!cached || cached.key !== key) {
      cached = {
        key,
        segments: traceContours(
          (x, y) => fn.fn(x, y),
          this.bounds,
          columns,
          rows,
        ),
      };
      this.cache.set(fn, cached);
    }
    const ctx = this.context;
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = this.curveColor ?? fn.color;
    ctx.lineWidth =
      Math.max(0.5, Math.min(8, Number(this.lineWidth) || 2)) * this.scale;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (const [a, b] of cached.segments) {
      ctx.moveTo(this.xToPixel(a.x), this.yToPixel(a.y));
      ctx.lineTo(this.xToPixel(b.x), this.yToPixel(b.y));
    }
    ctx.stroke();
    ctx.restore();
  }
  draw(drawFn: (ctx: CanvasRenderingContext2D) => void): void {
    this.overlays.push(drawFn);
    this.runOverlay(drawFn);
    if (this.showLabels) this.drawLabels();
  }
  private runOverlay(drawFn: (ctx: CanvasRenderingContext2D) => void): void {
    this.context.save();
    try {
      drawFn(this.context);
    } catch {
      this.message = 'No se pudo dibujar un elemento de la gráfica.';
    } finally {
      this.context.restore();
    }
  }
  zoom(factor: number): void {
    const cx = this.xMin + (this.xMax - this.xMin) / 2,
      cy = this.yMin + (this.yMax - this.yMin) / 2;
    const dx = ((this.xMax - this.xMin) * factor) / 2,
      dy = ((this.yMax - this.yMin) * factor) / 2;
    const bounds: [number, number, number, number] = [
      cx - dx,
      cx + dx,
      cy - dy,
      cy + dy,
    ];
    if (!this.validBounds(bounds)) return;
    [this.xMin, this.xMax, this.yMin, this.yMax] = bounds;
    this.boundsChange.emit(this.bounds);
    this.redraw();
  }
  resetView(): void {
    [this.xMin, this.xMax, this.yMin, this.yMax] = this.initialBounds;
    this.boundsChange.emit(this.bounds);
    this.redraw();
  }
  wheelZoom(event: WheelEvent): void {
    if (!this.wheelZoomEnabled || !Number.isFinite(event.deltaY) || event.deltaY === 0) return;
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    event.preventDefault();
    if (this.drag) return;
    const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? rect.height : 1);
    const factor = Math.exp(Math.max(-100, Math.min(100, delta)) * 0.002);
    const x = this.xMin + ((event.clientX - rect.left) / rect.width) * (this.xMax - this.xMin);
    const y = this.yMax - ((event.clientY - rect.top) / rect.height) * (this.yMax - this.yMin);
    const bounds: [number, number, number, number] = [
      x + (this.xMin - x) * factor,
      x + (this.xMax - x) * factor,
      y + (this.yMin - y) * factor,
      y + (this.yMax - y) * factor,
    ];
    if (!this.validBounds(bounds)) return;
    [this.xMin, this.xMax, this.yMin, this.yMax] = bounds;
    this.coordinates = '';
    this.boundsChange.emit(this.bounds);
    this.scheduleRedraw();
  }
  pointerDown(event: PointerEvent): void {
    if (event.pointerType === 'touch' && this.wheelZoomEnabled) {
      this.touches.set(event.pointerId, { x: event.clientX, y: event.clientY });
      this.canvas.nativeElement.setPointerCapture(event.pointerId);
      if (this.touches.size >= 2) {
        this.drag = undefined;
        this.startPinch();
        return;
      }
    }
    if (!this.dragEnabled || event.button !== 0) return;
    this.drag = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      bounds: this.bounds,
    };
    this.canvas.nativeElement.setPointerCapture(event.pointerId);
  }
  pointerMove(event: PointerEvent): void {
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    if (this.touches.has(event.pointerId)) {
      this.touches.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (this.wheelZoomEnabled && this.pinch && this.touches.size === 2) {
        const [a, b] = [...this.touches.values()];
        const distance = Math.hypot(b.x - a.x, b.y - a.y);
        if (!distance || !rect.width || !rect.height) return;
        const factor = this.pinch.distance / distance;
        const [xMin, xMax, yMin, yMax] = this.pinch.bounds;
        const width = (xMax - xMin) * factor;
        const height = (yMax - yMin) * factor;
        const left = this.pinch.x - (((a.x + b.x) / 2 - rect.left) / rect.width) * width;
        const top = this.pinch.y + (((a.y + b.y) / 2 - rect.top) / rect.height) * height;
        const bounds: [number, number, number, number] = [left, left + width, top - height, top];
        if (this.validBounds(bounds)) {
          [this.xMin, this.xMax, this.yMin, this.yMax] = bounds;
          this.coordinates = '';
          this.boundsChange.emit(this.bounds);
          this.scheduleRedraw();
        }
        return;
      }
    }
    this.coordinates = `x: ${this.formatValue(this.pixelToX((event.clientX - rect.left) * this.scale))} · y: ${this.formatValue(this.pixelToY((event.clientY - rect.top) * this.scale))}`;
    if (!this.drag || event.pointerId !== this.drag.id) return;
    const [a, b, c, d] = this.drag.bounds;
    const dx = ((event.clientX - this.drag.x) / rect.width) * (b - a),
      dy = ((event.clientY - this.drag.y) / rect.height) * (d - c);
    const bounds: [number, number, number, number] = [
      a - dx,
      b - dx,
      c + dy,
      d + dy,
    ];
    if (this.validBounds(bounds)) {
      [this.xMin, this.xMax, this.yMin, this.yMax] = bounds;
      this.boundsChange.emit(this.bounds);
      this.scheduleRedraw();
    }
  }
  private startPinch(): void {
    this.pinch = undefined;
    if (this.touches.size !== 2) return;
    const [a, b] = [...this.touches.values()];
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    const distance = Math.hypot(b.x - a.x, b.y - a.y);
    if (!distance || !rect.width || !rect.height) return;
    this.pinch = {
      distance,
      x: this.xMin + (((a.x + b.x) / 2 - rect.left) / rect.width) * (this.xMax - this.xMin),
      y: this.yMax - (((a.y + b.y) / 2 - rect.top) / rect.height) * (this.yMax - this.yMin),
      bounds: this.bounds,
    };
  }
  pointerUp(event?: PointerEvent): void {
    if (!event) {
      this.touches.clear();
      this.drag = undefined;
    } else {
      this.touches.delete(event.pointerId);
      if (this.drag?.id === event.pointerId) this.drag = undefined;
    }
    this.startPinch();
  }
  exportPng(): void {
    const link = document.createElement('a');
    link.download = 'curva-implicita.png';
    link.href = this.canvas.nativeElement.toDataURL('image/png');
    link.click();
  }
  pixelToX(x: number): number {
    return (
      this.xMin +
      (x * (this.xMax - this.xMin)) / this.canvas.nativeElement.width
    );
  }
  pixelToY(y: number): number {
    return (
      this.yMax -
      (y * (this.yMax - this.yMin)) / this.canvas.nativeElement.height
    );
  }
  xToPixel(x: number): number {
    return (
      ((x - this.xMin) * this.canvas.nativeElement.width) /
      (this.xMax - this.xMin)
    );
  }
  yToPixel(y: number): number {
    return (
      ((this.yMax - y) * this.canvas.nativeElement.height) /
      (this.yMax - this.yMin)
    );
  }
  pixelToXY(point: Vec2): Vec2 {
    return new Vec2(this.pixelToX(point.x), this.pixelToY(point.y));
  }
  xyToPixel(point: Vec2): Vec2 {
    return new Vec2(this.xToPixel(point.x), this.yToPixel(point.y));
  }
}

export class GraphableFunction {
  constructor(
    public fn: Function,
    public color: string | CanvasGradient | CanvasPattern,
  ) {}
}
