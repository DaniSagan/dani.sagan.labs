import { Component, ElementRef, ViewChild } from '@angular/core';
import { Move2DComponent } from "../../../widgets/move2d/move2d.component";
import { ZoomComponent } from "../../../widgets/zoom/zoom.component";
import { Vec2 } from 'src/app/shared/math/vec2';
import { Complex } from 'src/app/shared/math/complex';

@Component({
  selector: 'app-newton',
  standalone: true,
  imports: [Move2DComponent, ZoomComponent],
  templateUrl: './newton.component.html',
  styleUrl: './newton.component.css'
})
export class NewtonComponent {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  static title: string = 'Fractal del conjunto de Newton';
  static route: string = 'newton-set-fractal';

  maxIterations: number = 50;

  width = 800;
  height = 600;
  zoom: number = 8;
  centerX: number = 0;
  centerY: number = 0;

  isDrawing = false;

  roots = [
    new Complex(1, 0),
    new Complex(-0.5, Math.sqrt(3) / 2),
    new Complex(-0.5, -Math.sqrt(3) / 2)
  ];

  colors: [number, number, number][] = [
    [255, 0, 0],
    [0, 255, 0],
    [0, 0, 255]
  ];

  ngAfterViewInit() {
    this.drawFractal({x: this.centerX, y: this.centerY}, 2 ** this.zoom);
  }

  async drawFractal(center: Vec2, scale: number) {
    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    const dx = 1.0 / scale;
    const dy = 1.0 / scale;
    const minX = center.x - this.width / (2 * scale);
    const minY = center.y - this.height / (2 * scale);

    this.isDrawing = true;

    for (let pixelX = 0; pixelX < width; pixelX++) {
      if (!this.isDrawing) break; // Stop drawing if a new request is initiated.
      for (let pixelY = 0; pixelY < height; pixelY++) {
        let z = new Complex(minX + pixelX * dx, minY + pixelY * dy);
        const solution: NewtonSolution = this.newtonMethod(z);
        const color = this.getColor(solution);
        const index = (pixelX + pixelY * width) * 4;
        data[index] = color[0];
        data[index + 1] = color[1];
        data[index + 2] = color[2];
        data[index + 3] = 255; // Alpha
      }

      // Dibujar cada línea y esperar al siguiente ciclo del event loop para no bloquear la interfaz.
      if (pixelX % 10 === 0) {
        await this.sleep(0); // Pausar brevemente la ejecución
        ctx.putImageData(imageData, 0, 0);
      }
    }

    ctx.putImageData(imageData, 0, 0);
    this.isDrawing = false;
  }

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
    this.zoom += 1;
    this.updateValues();
  }

  zoomOut(): void {
    this.zoom -= 1;
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

  updateValues() {
    if (!this.isDrawing) {
      this.drawFractal({x: this.centerX, y: this.centerY}, 2 ** this.zoom);
    } else {
      this.isDrawing = false; // Stop current rendering if new values are set.
      setTimeout(() => this.drawFractal({x: this.centerX, y: this.centerY}, 2 ** this.zoom), 100); // Restart after a slight delay.
    }
  }

  onCanvasMouseDown(event: MouseEvent) {
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const scale = 2 ** this.zoom;
    const dx = 1.0 / scale;
    const dy = 1.0 / scale;
    const center = {x: this.centerX, y: this.centerY};
    const minX = center.x - this.width / (2 * scale);
    const minY = center.y - this.height / (2 * scale);
    let position: Vec2 = {x: minX + x * dx, y: minY + y * dy};
    this.centerX = position.x;
    this.centerY = position.y;
    this.drawFractal({x: this.centerX, y: this.centerY}, 2 ** this.zoom);
  }

  fn(z: Complex) {
    return Complex.sum(Complex.pow(z, 3), new Complex(-1, 0));
  }

  derivative(z: Complex) {
    return Complex.multiply(Complex.pow(z, 2), new Complex(3, 0));
  }

  private newtonMethod(z: Complex): NewtonSolution {
    let iteration = 0;
    let zz = new Complex(z.real, z.imaginary);
    while (iteration < this.maxIterations) {
      const denom = z.absSquared();
      if (denom === 0) break;

      // Newton's method: z = z - f(z) / f'(z)
      zz = Complex.diff(zz, Complex.div(this.fn(zz), this.derivative(zz)));

      const tolerance = 0.000001;

      for (let i = 0; i < this.roots.length; i++)
      {
        let difference = Complex.diff(zz, this.roots[i]);

        //If the current iteration is close enough to a root, color the pixel.
        if (difference.absSquared() < tolerance) {
          return { iterations: iteration, color: this.colors[i] }; //Return the color corresponding to the root
        }
      }

      iteration++;
    }

    return {iterations: iteration, color: [0, 0, 0]};
  }

  // private findClosestRoot(x: number, y: number) {
  //   let minDist = Infinity;
  //   let index = 0;

  //   for (let i = 0; i < this.roots.length; i++) {
  //     const root = this.roots[i];
  //     const dist = Math.sqrt((x - root.real) ** 2 + (y - root.imaginary) ** 2);
  //     if (dist < minDist) {
  //       minDist = dist;
  //       index = i;
  //     }
  //   }

  //   return index;
  // }

  private getColor(solution: NewtonSolution) {
    const t = solution.iterations / this.maxIterations;
    const baseColor = solution.color;
    return [
      Math.floor(baseColor[0] * (1 - t)),
      Math.floor(baseColor[1] * (1 - t)),
      Math.floor(baseColor[2] * (1 - t)),
    ];
  }
}

interface NewtonSolution {
  iterations: number;
  color: [number, number, number]
}
