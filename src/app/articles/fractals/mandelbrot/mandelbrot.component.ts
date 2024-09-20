import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-mandelbrot',
  templateUrl: './mandelbrot.component.html',
  styleUrls: ['./mandelbrot.component.css'],
  standalone: true,
})
export class MandelbrotComponent implements AfterViewInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  static title: string = 'Conjunto de Mandelbrot';
  static route: string = 'mandelbrot-set';

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
    this.drawMandelbrot();
  }

  async drawMandelbrot() {
    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgData = ctx.createImageData(this.width, this.height);
    const data = imgData.data;

    //const dx = (this.maxX - this.minX) / this.width;
    //const dy = (this.maxY - this.minY) / this.height;

    const scale = 2 ** this.scale;
    const dx = 1.0 / scale;
    const dy = 1.0 / scale;
    const minX = this.centerX - this.width / (2 * scale);
    const maxX = this.centerX + this.width / (2 * scale);
    const minY = this.centerY - this.height / (2 * scale);
    const maxY = this.centerY + this.height / (2 * scale);

    this.isDrawing = true;

    for (let x = 0; x < this.width; x++) {
      if (!this.isDrawing) break; // Stop drawing if a new request is initiated.

      for (let y = 0; y < this.height; y++) {
        const real = minX + x * dx;
        const imag = minY + y * dy;

        let cReal = real;
        let cImag = imag;
        let n = 0;

        while (n < this.maxIterations) {
          const tempReal = cReal * cReal - cImag * cImag + real;
          cImag = 2 * cReal * cImag + imag;
          cReal = tempReal;

          if (cReal * cReal + cImag * cImag > 4) break;
          n++;
        }

        const color = this.getColor(n);
        const index = (x + y * this.width) * 4;
        data[index + 0] = color[0]; // Red
        data[index + 1] = color[1]; // Green
        data[index + 2] = color[2]; // Blue
        data[index + 3] = 255; // Alpha (opacity)
      }

      // Dibujar cada línea y esperar al siguiente ciclo del event loop para no bloquear la interfaz.
      if (x % 10 === 0) {
        await this.sleep(0); // Pausar brevemente la ejecución
        ctx.putImageData(imgData, 0, 0);
      }
    }

    ctx.putImageData(imgData, 0, 0);
    this.isDrawing = false;
  }

  /**
   * Genera un color en el espectro del arco iris dependiendo del número de iteraciones.
   * Devuelve negro si se alcanzan las iteraciones máximas.
   *
   * @param iteration Número de iteraciones.
   * @returns Color en formato [R, G, B].
   */
  getColor(iteration: number): [number, number, number] {
    if (iteration === this.maxIterations) {
      return [0, 0, 0]; // Negro para iteración máxima
    }

    const t = iteration / this.maxIterations;
    const hue = t * 360; // Color en el espectro del arco iris
    return this.hslToRgb(hue, 1, 0.5);
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
      this.drawMandelbrot();
    } else {
      this.isDrawing = false; // Stop current rendering if new values are set.
      setTimeout(() => this.drawMandelbrot(), 100); // Restart after a slight delay.
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
