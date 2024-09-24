import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-implicit-curve-graph',
  templateUrl: './implicit-curve-graph.component.html',
  styleUrls: ['./implicit-curve-graph.component.css'],
  standalone: true,
  imports: [FormsModule]
})
export class ImplicitCurveGraphComponent {
  @ViewChild('graphCanvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  xMin: number = -10;
  xMax: number = 10;
  yMin: number = -10;
  yMax: number = 10;
  gradientThreshold = 1e6;
  functions: GraphableFunction[];

  context!: CanvasRenderingContext2D;

  constructor() {
    this.functions = [];
  }

  ngOnInit() {
    this.context = this.canvas.nativeElement.getContext('2d')!;
  }

  // Dibujar la gráfica implícita f(x, y) = 0
  drawGraph() {
    this.clear();
    this.drawAxes();
    this.functions.forEach((fn) => this.drawFunction(fn));
  }

  clear(): void {
    this.context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.context.fillStyle = 'white';
    this.context.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }

  drawAxes(): void {
    let x0 = this.xToPixel(0);
    let y0 = this.yToPixel(0);
    this.context.beginPath();
    this.context.strokeStyle = 'gray';

    this.context.moveTo(0, y0);
    this.context.lineTo(this.canvas.nativeElement.width, y0);

    this.context.moveTo(x0, 0);
    this.context.lineTo(x0, this.canvas.nativeElement.height);

    this.context.stroke();
  }

  drawFunction(fn: GraphableFunction): void {
    const width = this.canvas.nativeElement.width;
    const height = this.canvas.nativeElement.height;

    // Dibujar la curva implícita
    this.context.beginPath();
    this.context.strokeStyle = 'blue';
    this.context.fillStyle = fn.color;

    for (let xPixel = 0; xPixel < width; xPixel++) {
      for (let yPixel = 0; yPixel < height; yPixel++) {

        const xValue0 = this.pixelToX(xPixel);
        const xValue1 = this.pixelToX(xPixel + 1);
        const yValue0 = this.pixelToY(yPixel);
        const yValue1 = this.pixelToY(yPixel + 1);

        let fValue0: number;
        let fValueX1: number;
        let fValueY1: number;
        try {
          fValue0 = fn.fn(xValue0, yValue0);
          fValueX1 = fn.fn(xValue1, yValue0);
          fValueY1 = fn.fn(xValue0, yValue1);
        } catch (e) {
          console.error('Error evaluando la fórmula:', e);
          throw e;
        }

        if (fValue0 * fValueX1 <= 0 || fValue0 * fValueY1 <= 0) {
          if(fValue0 * fValueX1 > -this.gradientThreshold && fValue0 * fValueY1 >= -this.gradientThreshold) {
            this.context.fillRect(xPixel, yPixel, 1, 1);
          }
        }
      }
    }

    this.context.stroke();
  }

  setBounds(xMin: number, xMax: number, yMin: number, yMax: number): void {
    this.xMin = xMin;
    this.xMax = xMax;
    this.yMin = yMin;
    this.yMax = yMax;
  }

  pixelToX(pixelX: number): number {
    const canvasWidth = this.canvas.nativeElement.width;
    const rangeX = this.xMax - this.xMin;
    return this.xMin + (pixelX * rangeX) / canvasWidth;
  }

  pixelToY(pixelY: number): number {
    const canvasHeight = this.canvas.nativeElement.height;
    const rangeY = this.yMax - this.yMin;
    return this.yMin + ((canvasHeight - pixelY) * rangeY) / canvasHeight;
  }

  yToPixel(y: number): number {
    const canvasHeight = this.canvas.nativeElement.height;
    const rangeY = this.yMax - this.yMin;
    return canvasHeight - (y - this.yMin) * (canvasHeight / rangeY);
  }

  xToPixel(x: number): number {
    const canvasWidth = this.canvas.nativeElement.width;
    const rangeX = this.xMax - this.xMin;
    return (x - this.xMin) * (canvasWidth / rangeX);
  }
}

export class GraphableFunction {
  fn: Function;
  color: string | CanvasGradient | CanvasPattern;

  constructor(fn: Function, color: string | CanvasGradient | CanvasPattern) {
    this.fn = fn;
    this.color = color;
  }
}
