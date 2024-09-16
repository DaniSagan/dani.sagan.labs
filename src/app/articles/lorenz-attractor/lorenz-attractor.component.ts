import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-lorenz-attractor',
  templateUrl: './lorenz-attractor.component.html',
  styleUrls: ['./lorenz-attractor.component.css']
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

    // Limpiar el canvas
    this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Configurar el estilo de neón
    this.ctx.strokeStyle = '#00FFFF'; // Color cian brillante
    this.ctx.shadowColor = '#00FFFF';
    this.ctx.shadowBlur = 0.5;
    this.ctx.lineWidth = 0.5;

    let x = 0.01;
    let y = 0;
    let z = 0;
    let dt = 0.01; // Paso de tiempo

    this.isDrawing = true;

    this.ctx.beginPath();
    this.ctx.moveTo(canvasWidth / 2, canvasHeight - 50);

    for (let i = 0; i < this.iterations; i++) {
      if (!this.isDrawing) break;

      const dx = this.sigma * (y - x) * dt;
      const dy = (x * (this.rho - z) - y) * dt;
      const dz = (x * y - this.beta * z) * dt;

      x += dx;
      y += dy;
      z += dz;

      // Escalar y desplazar para ajustarse al canvas
      const drawX = canvasWidth / 2 + x * 10;
      const drawY = (canvasHeight - 50) - z * 10;

      this.ctx.lineTo(drawX, drawY);
      this.ctx.stroke();

      // Espera asincrónica para mantener la interfaz responsiva
      if (i % 100 === 0) await this.sleep(1);
    }

    this.isDrawing = false;
  }

  incrementIterations(): void {
    this.iterations += 1000;
    if (!this.isDrawing) {
      this.drawLorenzAttractor();
    }
  }

  decrementIterations(): void {
    if (this.iterations > 1000) {
      this.iterations -= 1000;
      if (!this.isDrawing) {
        this.drawLorenzAttractor();
      }
    }
  }

  stopDrawing(): void {
    this.isDrawing = false;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
