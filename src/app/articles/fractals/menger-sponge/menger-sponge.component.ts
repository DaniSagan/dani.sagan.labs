import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-menger-sponge',
  templateUrl: './menger-sponge.component.html',
  styleUrls: ['./menger-sponge.component.css']
})
export class MengerSpongeComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  iterations: number = 0;

  static title: string = 'Esponja de Menger';
  static route: string = 'menger-sponge';

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.drawMengerSponge();
  }

  drawMengerSponge(): void {
    const canvasWidth = this.canvas.nativeElement.width;
    const canvasHeight = this.canvas.nativeElement.height;

    // Limpiar el canvas
    this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Establecer estilo de neón
    this.ctx.strokeStyle = '#00FFFF'; // Color cian brillante para los bordes
    this.ctx.fillStyle = '#002222'; // Color oscuro para el relleno
    this.ctx.shadowColor = '#00FFFF';
    this.ctx.shadowBlur = 5;

    // Dibujar la Esponja de Menger
    this.drawCube(0, 0, canvasWidth, this.iterations);
  }

  drawCube(x: number, y: number, size: number, depth: number): void {
    if (depth === 0) {
      // Dibujar un cuadrado lleno con bordes de neón
      this.ctx.beginPath();
      this.ctx.rect(x, y, size, size);
      this.ctx.fill();
      this.ctx.stroke();
    } else {
      const newSize = size / 3;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (i === 1 && j === 1) {
            // No dibujar el centro (hueco de la esponja)
            continue;
          }
          this.drawCube(x + i * newSize, y + j * newSize, newSize, depth - 1);
        }
      }
    }
  }

  incrementIterations(): void {
    this.iterations++;
    this.drawMengerSponge();
  }

  decrementIterations(): void {
    if (this.iterations > 0) {
      this.iterations--;
      this.drawMengerSponge();
    }
  }
}
