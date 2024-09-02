import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-sierpinski-triangle',
  templateUrl: './sierpinski-triangle.component.html',
  styleUrls: ['./sierpinski-triangle.component.css']
})
export class SierpinskiTriangleComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  iterations: number = 0;

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.drawSierpinski();
  }

  drawSierpinski(): void {
    const canvasWidth = this.canvas.nativeElement.width;
    const canvasHeight = this.canvas.nativeElement.height;

    // Limpiar el canvas
    this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Estilo de neón
    this.ctx.strokeStyle = '#00FFFF'; // Color cian brillante
    this.ctx.shadowColor = '#00FFFF';
    this.ctx.shadowBlur = 5;

    // Estilo de relleno sólido
    this.ctx.fillStyle = '#002222'; // Color oscuro para el relleno

    // Definir los puntos del triángulo principal
    const p1 = { x: canvasWidth / 2, y: 10 };
    const p2 = { x: 10, y: canvasHeight - 10 };
    const p3 = { x: canvasWidth - 10, y: canvasHeight - 10 };

    // Dibujar el triángulo de Sierpinski
    this.sierpinski(p1, p2, p3, this.iterations);
  }

  sierpinski(p1: {x: number, y: number}, p2: {x: number, y: number}, p3: {x: number, y: number}, depth: number): void {
    if (depth === 0) {
      // Dibujar el triángulo con líneas de neón
      this.ctx.beginPath();
      this.ctx.moveTo(p1.x, p1.y);
      this.ctx.lineTo(p2.x, p2.y);
      this.ctx.lineTo(p3.x, p3.y);
      this.ctx.closePath();
      this.ctx.fill(); // Relleno del triángulo
      this.ctx.stroke();
    } else {
      // Calcular los puntos medios
      const p12 = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
      const p23 = { x: (p2.x + p3.x) / 2, y: (p2.y + p3.y) / 2 };
      const p31 = { x: (p3.x + p1.x) / 2, y: (p3.y + p1.y) / 2 };

      // Dibujar recursivamente los tres triángulos
      this.sierpinski(p1, p12, p31, depth - 1);
      this.sierpinski(p12, p2, p23, depth - 1);
      this.sierpinski(p31, p23, p3, depth - 1);
    }
  }

  incrementIterations(): void {
    this.iterations++;
    this.drawSierpinski();
  }

  decrementIterations(): void {
    if (this.iterations > 0) {
      this.iterations--;
      this.drawSierpinski();
    }
  }
}
