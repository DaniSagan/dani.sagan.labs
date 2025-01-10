import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-burning-ship',
  standalone: true,
  imports: [],
  templateUrl: './burning-ship.component.html',
  styleUrl: './burning-ship.component.css'
})
export class BurningShipComponent implements AfterViewInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  static title: string = 'Fractal del barco en llamas';
  static route: string = 'burning-ship-fractal';

  minX: number = -2.5;
  maxX: number = 1.5;
  minY: number = -2;
  maxY: number = 2;
  maxIterations: number = 128;

  width = 800;
  height = 600;

  scale: number = 8;
  centerX: number = -0.5;
  centerY: number = 0;

  isDrawing = false;

  constructor() {}

  ngAfterViewInit() {
    this.drawFractal();
  }

  async drawFractal() {
    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgData = ctx.createImageData(this.width, this.height);
    const data = imgData.data;

    const scale = 2 ** this.scale;
    const dx = 1.0 / scale;
    const dy = 1.0 / scale;
    const minX = this.centerX - this.width / (2 * scale);
    const maxX = this.centerX + this.width / (2 * scale);
    const minY = this.centerY - this.height / (2 * scale);
    const maxY = this.centerY + this.height / (2 * scale);

    this.isDrawing = true;

    for (let xPixel = 0; xPixel < this.width; xPixel++) {
      if (!this.isDrawing) break; // Stop drawing if a new request is initiated.

      for (let yPixel = 0; yPixel < this.height; yPixel++) {
        const real = minX + xPixel * dx;
        const imag = minY + yPixel * dy;

        let zReal = real;
        let zImag = imag;
        let iteration = 0;

        while (zReal * zReal + zImag * zImag <= 4 && iteration < this.maxIterations) {
          const xTemp = zReal * zReal - zImag * zImag + real;
          zImag = Math.abs(2 * zReal * zImag) + imag;
          zReal = Math.abs(xTemp);
          iteration++;
        }

        const color = this.getColor(iteration, this.maxIterations);
        const index = (xPixel + yPixel * this.width) * 4;
        data[index + 0] = color[0]; // Red
        data[index + 1] = color[1]; // Green
        data[index + 2] = color[2]; // Blue
        data[index + 3] = 255; // Alpha (opacity)
      }

      // Dibujar cada línea y esperar al siguiente ciclo del event loop para no bloquear la interfaz.
      if (xPixel % 10 === 0) {
        await this.sleep(0); // Pausar brevemente la ejecución
        ctx.putImageData(imgData, 0, 0);
      }
    }

    ctx.putImageData(imgData, 0, 0);
    this.isDrawing = false;
  }

  getColor(iteration: number, maxIterations: number): [number, number, number] {
    if (iteration === maxIterations) {
      return [0, 0, 0]; // Black for points in the fractal
    }
    const t = iteration / maxIterations;
    const r = Math.floor(9 * (1 - t) * t * t * t * 255);
    const g = Math.floor(15 * (1 - t) * (1 - t) * t * t * 255);
    const b = Math.floor(8.5 * (1 - t) * (1 - t) * (1 - t) * t * 255);
    return [r, g, b];
  }

  /**
   * Convierte un valor HSL a RGB.
   *
   * @param h Hue (0 a 360).
   * @param s Saturación (0 a 1).
   * @param l Luminosidad (0 a 1).
   * @returns Color en formato [R, G, B].
   */
  hslToRgb(h: number, s: number, l: number): [number, number, number] {
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0,
      g = 0,
      b = 0;

    if (h < 60) {
      r = c;
      g = x;
    } else if (h < 120) {
      r = x;
      g = c;
    } else if (h < 180) {
      g = c;
      b = x;
    } else if (h < 240) {
      g = x;
      b = c;
    } else if (h < 300) {
      r = x;
      b = c;
    } else {
      r = c;
      b = x;
    }

    return [
      Math.round((r + m) * 255),
      Math.round((g + m) * 255),
      Math.round((b + m) * 255),
    ];
  }

  updateValues() {
    if (!this.isDrawing) {
      this.drawFractal();
    } else {
      this.isDrawing = false; // Stop current rendering if new values are set.
      setTimeout(() => this.drawFractal(), 100); // Restart after a slight delay.
    }
  }

  moveLeft(): void {
    this.centerX -= 200.0 / 2 ** this.scale;
    this.updateValues();
  }

  moveRight(): void {
    this.centerX += 200.0 / 2 ** this.scale;
    this.updateValues();
  }

  moveUp(): void {
    this.centerY -= 200.0 / 2 ** this.scale;
    this.updateValues();
  }

  moveDown(): void {
    this.centerY += 200.0 / 2 ** this.scale;
    this.updateValues();
  }

  zoomIn(): void {
    this.scale += 1;
    this.updateValues();
  }

  zoomOut(): void {
    this.scale -= 1;
    this.updateValues();
  }

  incrementMaxIterations(): void {
    this.maxIterations *= 2;
    this.updateValues();
  }

  decrementMaxIterations(): void {
    this.maxIterations /= 2;
    this.updateValues();
  }

  sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
