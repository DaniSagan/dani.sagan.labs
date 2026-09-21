import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-lorenz-attractor',
  templateUrl: './lorenz-attractor.component.html',
  styleUrls: ['./lorenz-attractor.component.css'],
  standalone: true,
})
export class LorenzAttractorComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  iterations: number = 1000; // Número de puntos a dibujar
  isDrawing: boolean = false;

  static title: string = 'Atractor de Lorenz';
  static route: string = 'lorenz-attractor';

  // Parámetros del Atractor de Lorenz
  sigma: number = 10;
  rho: number = 28;
  beta: number = 8 / 3;

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.drawLorenzAttractor();
  }

  ngOnDestroy(): void {
    this.isDrawing = false;
  }

  async drawLorenzAttractor(): Promise<void> {
    const canvasWidth = this.canvas.nativeElement.width;
    const canvasHeight = this.canvas.nativeElement.height;

    this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    this.ctx.lineWidth = 0.5;

    let x = 0.01;
    let y = 0;
    let z = 0;
    const dt = 0.01;

    this.isDrawing = true;

    let prevDrawX = canvasWidth / 2;
    let prevDrawY = canvasHeight - 50;

    for (let i = 0; i < this.iterations; i++) {
      if (!this.isDrawing) break;

      const dx = this.sigma * (y - x) * dt;
      const dy = (x * (this.rho - z) - y) * dt;
      const dz = (x * y - this.beta * z) * dt;

      x += dx;
      y += dy;
      z += dz;

      const drawX = canvasWidth / 2 + x * 10;
      const drawY = canvasHeight - 50 - z * 10;

      // Hue de 0 a 360 según el progreso, dando una vuelta completa al arco iris
      const hue = (i / this.iterations) * 360;
      const color = `hsl(${hue}, 100%, 60%)`;

      this.ctx.strokeStyle = color;
      this.ctx.shadowColor = color;
      this.ctx.shadowBlur = 0.5;

      // Dibujar segmento individual con su propio color
      this.ctx.beginPath();
      this.ctx.moveTo(prevDrawX, prevDrawY);
      this.ctx.lineTo(drawX, drawY);
      this.ctx.stroke();

      prevDrawX = drawX;
      prevDrawY = drawY;

      if (i % 100 === 0) await this.sleep(1);
    }

    this.isDrawing = false;
  }

  incrementIterations(): void {
    this.iterations *= 2;
    if (!this.isDrawing) {
      this.drawLorenzAttractor();
    }
  }

  decrementIterations(): void {
    if (this.iterations > 1000) {
      this.iterations /= 2;
      if (!this.isDrawing) {
        this.drawLorenzAttractor();
      }
    }
  }

  stopDrawing(): void {
    this.isDrawing = false;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
