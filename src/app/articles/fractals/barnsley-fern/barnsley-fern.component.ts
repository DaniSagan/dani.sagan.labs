import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-barnsley-fern',
  templateUrl: './barnsley-fern.component.html',
  styleUrls: ['./barnsley-fern.component.css']
})
export class BarnsleyFernComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  iterations: number = 5000;
  isDrawing: boolean = false;

  static title: string = 'Helecho de Barnsley';
  static route: string = 'barnsley-fern';

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.drawBarnsleyFern();
  }

  async drawBarnsleyFern(): Promise<void> {
    const canvasWidth = this.canvas.nativeElement.width;
    const canvasHeight = this.canvas.nativeElement.height;

    // Limpiar el canvas
    this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Configurar el estilo de neón
    this.ctx.fillStyle = '#00FF00'; // Color verde brillante
    this.ctx.shadowColor = '#00FF00';
    this.ctx.shadowBlur = 5;

    // Coordenadas iniciales
    let x = 0;
    let y = 0;

    this.isDrawing = true;

    for (let i = 0; i < this.iterations; i++) {
      if (!this.isDrawing) {
        break; // Salir del bucle si se ha detenido el dibujo
      }

      const nextPoint = this.computeNextPoint(x, y);
      x = nextPoint[0];
      y = nextPoint[1];

      // Transformar coordenadas para el canvas
      const px = Math.round(canvasWidth / 2 + x * canvasWidth / 10);
      const py = Math.round(canvasHeight - y * canvasHeight / 12);

      // Dibujar el punto
      this.ctx.fillRect(px, py, 1, 1);

      // Hacer pausa cada 100 iteraciones para mantener la UI responsiva
      if (i % 100 === 0) {
        await this.sleep(0); // pausa corta para permitir la actualización de la UI
      }
    }

    this.isDrawing = false;
  }

  computeNextPoint(x: number, y: number): [number, number] {
    const rand = Math.random();
    let nextX, nextY;

    if (rand < 0.01) {
      nextX = 0;
      nextY = 0.16 * y;
    } else if (rand < 0.86) {
      nextX = 0.85 * x + 0.04 * y;
      nextY = -0.04 * x + 0.85 * y + 1.6;
    } else if (rand < 0.93) {
      nextX = 0.2 * x - 0.26 * y;
      nextY = 0.23 * x + 0.22 * y + 1.6;
    } else {
      nextX = -0.15 * x + 0.28 * y;
      nextY = 0.26 * x + 0.24 * y + 0.44;
    }

    return [nextX, nextY];
  }

  incrementIterations(): void {
    this.iterations += 5000;
    if (!this.isDrawing) {
      this.drawBarnsleyFern();
    }
  }

  decrementIterations(): void {
    if (this.iterations > 5000) {
      this.iterations -= 5000;
      if (!this.isDrawing) {
        this.drawBarnsleyFern();
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
