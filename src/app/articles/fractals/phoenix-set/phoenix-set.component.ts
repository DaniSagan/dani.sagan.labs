import { escapeColor } from '../fractal-explorer/fractal-palette';
import { RouterLink } from '@angular/router';
import { OnDestroy, Component, ElementRef, ViewChild } from '@angular/core';
import { Complex } from 'src/app/shared/math/complex';
import { Vec2 } from 'src/app/shared/math/vec2';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import { Move2DComponent } from "../../../widgets/move2d/move2d.component";
import { ZoomComponent } from "../../../widgets/zoom/zoom.component";

@Component({ host: { class: 'fractal-page' },
  selector: 'app-phoenix-set',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatDividerModule, MatIconModule, FormsModule, MatFormFieldModule, MatInputModule, Move2DComponent, ZoomComponent],
  templateUrl: './phoenix-set.component.html',
  styleUrl: './phoenix-set.component.css'
})
export class PhoenixSetComponent implements OnDestroy {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  static title: string = 'Conjunto de Phoenix';
  static route: string = 'phoenix-set-fractal';

  maxIterations: number = 512;
  cReal: number = -0.4;
  cImag: number = 0.1;
  k: number = 0.2955;

  width = 800;
  height = 600;
  zoom: number = 8;
  centerX: number = 0;
  centerY: number = 0;

  isDrawing = true;
  private renderGeneration = 0;
  ngOnDestroy(): void { ++this.renderGeneration; this.isDrawing = false; }

  constructor() {}

  ngAfterViewInit() {
    this.drawFractal(
      new Vec2(this.centerX, this.centerY),
      2 ** this.zoom,
      new Complex(this.cReal, this.cImag),
      this.k);
  }

  async drawFractal(center: Vec2, scale: number, c: Complex, k: number) {
    const generation = ++this.renderGeneration;
    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgData = ctx.createImageData(this.width, this.height);
    const data = imgData.data;

    const dx = 1.0 / scale;
    const dy = 1.0 / scale;
    const minX = center.x - this.width / (2 * scale);
    const minY = center.y - this.height / (2 * scale);

    this.isDrawing = true;

    for (let xPixel = 0; xPixel < this.width; xPixel++) {
      if (generation !== this.renderGeneration) return; // Stop drawing if a new request is initiated.

      for (let yPixel = 0; yPixel < this.height; yPixel++) {
        let z: Complex = new Complex(minX + xPixel * dx, minY + yPixel * dy);
        let zPrev: Complex = new Complex(0, 0);
        let iteration = 0;
        while (z.absSquared() <= 4 && iteration < this.maxIterations) {
          const newZ = Complex.sum(Complex.sum(Complex.square(z), c), Complex.multiply(new Complex(k, 0), zPrev));
          zPrev = z;
          z = newZ;
          iteration++;
        }

        const color = this.getColor(iteration);
        const index = (xPixel + yPixel * this.width) * 4;
        data[index + 0] = color[0]; // Red
        data[index + 1] = color[1]; // Green
        data[index + 2] = color[2]; // Blue
        data[index + 3] = 255; // Alpha (opacity)
      }

      // Dibujar cada línea y esperar al siguiente ciclo del event loop para no bloquear la interfaz.
      if (xPixel % 10 === 0) {
        await this.sleep(0); // Pausar brevemente la ejecución
        if (generation !== this.renderGeneration) return;
        ctx.putImageData(imgData, 0, 0);
      }
    }

    if (generation !== this.renderGeneration) return;
    ctx.putImageData(imgData, 0, 0);
    this.isDrawing = false;
  }

  getColor(iteration: number): [number, number, number] { return escapeColor(iteration, this.maxIterations); }

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

  updateValues() { void this.drawFractal(new Vec2(this.centerX, this.centerY), 2 ** this.zoom, new Complex(this.cReal, this.cImag), this.k); }

  onMovement(value: Vec2) {
    if(value.x === 1) this.moveRight();
    if(value.x === -1) this.moveLeft();
    if(value.y === 1) this.moveUp();
    if(value.y === -1) this.moveDown();
  }

  onZoom(value: number) {
    if(value === 1) this.zoomIn();
    if(value === -1) this.zoomOut();
  }

  onZoomReset(): void {
    this.zoom = 8;
    this.centerX = 0;
    this.centerY = 0;
    this.updateValues();
  }

  moveLeft(): void {
    this.centerX -= 200.0 / 2 ** this.zoom;
    this.updateValues();
  }

  moveRight(): void {
    this.centerX += 200.0 / 2 ** this.zoom;
    this.updateValues();
  }

  moveUp(): void {
    this.centerY -= 200.0 / 2 ** this.zoom;
    this.updateValues();
  }

  moveDown(): void {
    this.centerY += 200.0 / 2 ** this.zoom;
    this.updateValues();
  }

  zoomIn(): void {
    this.zoom = Math.min(40, this.zoom + 1);
    this.updateValues();
  }

  zoomOut(): void {
    this.zoom = Math.max(6, this.zoom - 1);
    this.updateValues();
  }

  incrementMaxIterations(): void {
    this.maxIterations = Math.min(2048, this.maxIterations * 2);
    this.updateValues();
  }

  decrementMaxIterations(): void {
    this.maxIterations = Math.max(16, Math.floor(this.maxIterations / 2));
    this.updateValues();
  }

  sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  onCanvasMouseDown(event: MouseEvent) {
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    const x = (event.clientX - rect.left) * this.width / rect.width;
    const y = (event.clientY - rect.top) * this.height / rect.height;
    const scale = 2 ** this.zoom;
    const dx = 1.0 / scale;
    const dy = 1.0 / scale;
    const center = new Vec2(this.centerX, this.centerY);
    const minX = center.x - this.width / (2 * scale);
    const minY = center.y - this.height / (2 * scale);
    const position = new Vec2(minX + x * dx, minY + y * dy);
    this.centerX = position.x;
    this.centerY = position.y;
    this.drawFractal(new Vec2(this.centerX, this.centerY),
      2 ** this.zoom,
      new Complex(this.cReal, this.cImag),
      this.k);
  }

  update() {
    this.drawFractal(new Vec2(this.centerX, this.centerY),
      2 ** this.zoom,
      new Complex(this.cReal, this.cImag),
      this.k);
  }
}
