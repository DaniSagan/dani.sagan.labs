// graph-plotter.component.ts

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-graph-plotter',
  templateUrl: './graph-plotter.component.html',
  styleUrls: ['./graph-plotter.component.css']
})
export class GraphPlotterComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D;
  equations: string[] = ['x^2']; // Ecuación por defecto
  colors: string[] = ['#00FF00']; // Color inicial por defecto
  xMin: number = -10;
  xMax: number = 10;
  yMin: number = -10;
  yMax: number = 10;
  scaleFactor: number = 1; // Factor de escala para zoom
  centerX: number = 0; // Centro de la vista en X
  centerY: number = 0; // Centro de la vista en Y

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.drawGraph();
  }

  drawGraph(): void {
    const canvasWidth = this.canvas.nativeElement.width;
    const canvasHeight = this.canvas.nativeElement.height;

    // Limpiar el canvas
    this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Dibujar los ejes
    this.drawAxes();

    // Dibujar cada ecuación
    this.equations.forEach((eq, index) => {
      this.drawEquation(eq, this.colors[index] || '#FFFFFF');
    });
  }

  drawAxes(): void {
    const canvasWidth = this.canvas.nativeElement.width;
    const canvasHeight = this.canvas.nativeElement.height;

    // Estilo de los ejes
    this.ctx.strokeStyle = '#FFFFFF';
    this.ctx.lineWidth = 1;

    // Eje X
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.yToPixel(0));
    this.ctx.lineTo(canvasWidth, this.yToPixel(0));
    this.ctx.stroke();

    // Eje Y
    this.ctx.beginPath();
    this.ctx.moveTo(this.xToPixel(0), 0);
    this.ctx.lineTo(this.xToPixel(0), canvasHeight);
    this.ctx.stroke();
  }

  drawEquation(equation: string, color: string): void {
    const canvasWidth = this.canvas.nativeElement.width;
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();

    let prevX: number | null = null;
    let prevY: number | null = null;

    for (let pixelX = 0; pixelX < canvasWidth; pixelX++) {
      const x = this.pixelToX(pixelX);
      const y = this.evaluateEquation(equation, x);

      if (y !== undefined && y !== null && !isNaN(y)) {
        const pixelY = this.yToPixel(y);
        if (prevX !== null && prevY !== null) {
          this.ctx.lineTo(pixelX, pixelY);
        } else {
          this.ctx.moveTo(pixelX, pixelY);
        }
        prevX = pixelX;
        prevY = pixelY;
      }
    }

    this.ctx.stroke();
  }

  pixelToX(pixelX: number): number {
    const canvasWidth = this.canvas.nativeElement.width;
    const rangeX = this.xMax - this.xMin;
    //return (pixelX / canvasWidth) * rangeX * this.scaleFactor + this.centerX - (rangeX * this.scaleFactor) / 2;
    return this.xMin + pixelX * rangeX / canvasWidth;
  }

  pixelToY(pixelY: number): number {
    const canvasHeight = this.canvas.nativeElement.height;
    const rangeY = this.yMax - this.yMin;
    //return (pixelX / canvasWidth) * rangeX * this.scaleFactor + this.centerX - (rangeX * this.scaleFactor) / 2;
    return this.yMin + pixelY * rangeY / canvasHeight;
  }

  yToPixel(y: number): number {
    const canvasHeight = this.canvas.nativeElement.height;
    const rangeY = this.yMax - this.yMin;
    //return canvasHeight / 2 - ((y - this.centerY) / rangeY) * (canvasHeight / this.scaleFactor);
    return canvasHeight - (y - this.yMin)*(canvasHeight / rangeY);
  }

  xToPixel(x: number): number {
    const canvasWidth = this.canvas.nativeElement.width;
    const rangeX = this.xMax - this.xMin;
    //return ((x - this.centerX) / rangeX) * (canvasWidth / this.scaleFactor) + canvasWidth / 2;
    return (x - this.xMin)*(canvasWidth / rangeX);
  }

  evaluateEquation(equation: string, x: number): number | undefined {
    try {
      // Reemplaza `^` por `**` para manejar potencias en la ecuación
      const parsedEquation = equation.replace(/\^/g, '**')
                                     .replace(/sqrt/g, 'Math.sqrt')
                                     .replace(/cos/g, 'Math.cos')
                                     .replace(/sin/g, 'Math.sin')
                                     .replace(/tan/g, 'Math.tan')
                                     .replace(/x/g, `(${x})`);
      const result = Function(`"use strict"; return (${parsedEquation})`)();
      return result;
    } catch (e) {
      //console.error('Error al evaluar la ecuación:', e);
      return undefined;
    }
  }

  handleWheel(event: WheelEvent): void {
    event.preventDefault();
    const zoomFactor = 1.1;
    if (event.deltaY < 0) {
      this.scaleFactor /= zoomFactor;
    } else {
      this.scaleFactor *= zoomFactor;
    }
    this.drawGraph();
  }

  updateLimits(): void {
    this.drawGraph();
  }

  updateEquations(event: Event, index: number): void {
    const inputElement = event.target as HTMLInputElement;
    this.equations[index] = inputElement.value; // Actualiza la ecuación
    this.drawGraph(); // Redibuja la gráfica
  }

  addEquation(): void {
    this.equations.push('');
    this.colors.push('#FFFFFF');
  }

  removeEquation(index: number): void {
    this.equations.splice(index, 1);
    this.colors.splice(index, 1);
    this.drawGraph();
  }

  resetGraph(): void {
    this.xMin = -10;
    this.xMax = 10;
    this.yMin = -10;
    this.yMax = 10;
    this.scaleFactor = 1;
    this.centerX = 0;
    this.centerY = 0;
    this.equations = ['x^2'];
    this.colors = ['#00FF00'];
    this.drawGraph();
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }
}
