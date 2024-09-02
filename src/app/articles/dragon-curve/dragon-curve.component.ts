import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-dragon-curve',
  templateUrl: './dragon-curve.component.html',
  styleUrls: ['./dragon-curve.component.css']
})
export class DragonCurveComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  iterations: number = 10;
  isDrawing: boolean = false;

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.drawDragonCurve();
  }

  async drawDragonCurve(): Promise<void> {
    const canvasWidth = this.canvas.nativeElement.width;
    const canvasHeight = this.canvas.nativeElement.height;

    // Limpiar el canvas
    this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Configurar el estilo de neón
    this.ctx.strokeStyle = '#00FFFF'; // Color cian brillante
    this.ctx.shadowColor = '#00FFFF';
    this.ctx.shadowBlur = 1;
    this.ctx.lineWidth = 1;

    // Configurar las coordenadas iniciales
    let x = canvasWidth / 2;
    let y = canvasHeight / 2;
    let length = 5; // Longitud de cada segmento de línea
    let angle = 0;

    this.isDrawing = true;

    // Secuencia para definir el patrón de la Curva de Dragón
    const sequence = this.generateDragonSequence(this.iterations);

    this.ctx.beginPath();
    this.ctx.moveTo(x, y);

    for (let turn of sequence) {
      if (!this.isDrawing) break;

      angle += turn === 'L' ? Math.PI / 2 : -Math.PI / 2;
      x += length * Math.cos(angle);
      y += length * Math.sin(angle);

      this.ctx.lineTo(x, y);
      this.ctx.stroke();

      // Espera asincrónica para mantener la interfaz responsiva
      await this.sleep(1);
    }

    this.isDrawing = false;
  }

  generateDragonSequence(iterations: number): string[] {
    let sequence: string[] = ['L']; // Comenzar con un giro a la izquierda

    for (let i = 1; i < iterations; i++) {
      const copy = [...sequence].reverse().map(turn => (turn === 'L' ? 'R' : 'L'));
      sequence.push('L', ...copy);
    }

    return sequence;
  }

  incrementIterations(): void {
    this.iterations++;
    if (!this.isDrawing) {
      this.drawDragonCurve();
    }
  }

  decrementIterations(): void {
    if (this.iterations > 0) {
      this.iterations--;
      if (!this.isDrawing) {
        this.drawDragonCurve();
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
