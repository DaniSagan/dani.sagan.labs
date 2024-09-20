import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Vector2 } from 'src/app/shared/geometry/vector2';

@Component({
  selector: 'app-dragon-curve',
  templateUrl: './dragon-curve.component.html',
  styleUrls: ['./dragon-curve.component.css'],
  standalone: true,
})
export class DragonCurveComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  iterations: number = 10;
  isDrawing: boolean = false;
  lineLength: number = 5;

  static title: string = 'Curva del Dragón';
  static route: string = 'dragon-curve';

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.drawDragonCurve();
  }

  async drawDragonCurve(): Promise<void> {
    const canvasWidth = this.canvas.nativeElement.width;
    const canvasHeight = this.canvas.nativeElement.height;

    // Limpiar el canvas
    this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    this.ctx.rect(0, 0, canvasWidth, canvasHeight);
    this.ctx.fillStyle = '#000000';
    this.ctx.fill();

    // Configurar el estilo de neón
    this.ctx.strokeStyle = '#00FFFF'; // Color cian brillante
    this.ctx.shadowColor = '#00FFFF';
    this.ctx.shadowBlur = 1;
    this.ctx.lineWidth = 1;

    // Configurar las coordenadas iniciales
    let x = canvasWidth / 2;
    let y = canvasHeight / 2;
    let direction = new Vector2(this.lineLength, 0);

    this.isDrawing = true;

    // Secuencia para definir el patrón de la Curva de Dragón
    const sequence = this.generateDragonSequence(this.iterations);

    let n: number = 0;
    let sequenceLength = sequence.length;
    for (let turn of sequence) {
      if (!this.isDrawing) break;
      direction =
        turn === 'L' ? this.rotateLeft(direction) : this.rotateRight(direction);

      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      x += direction.x;
      y += direction.y;
      let color = this.decimalToRainbowColor(n / sequenceLength);
      this.ctx.strokeStyle = color;
      this.ctx.shadowColor = color;
      this.ctx.lineTo(x, y);
      this.ctx.stroke();

      // Espera asincrónica para mantener la interfaz responsiva
      if (n % 100 == 0) await this.sleep(1);
      n++;
    }

    this.isDrawing = false;
  }

  generateDragonSequence(iterations: number): string[] {
    let sequence: string[] = ['L']; // Comenzar con un giro a la izquierda

    for (let i = 1; i < iterations; i++) {
      const copy = [...sequence]
        .reverse()
        .map((turn) => (turn === 'L' ? 'R' : 'L'));
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

  incrementLineLength(): void {
    this.lineLength++;
    if (!this.isDrawing) {
      this.drawDragonCurve();
    }
  }

  decrementLineLength(): void {
    if (this.lineLength > 1) {
      this.lineLength--;
      if (!this.isDrawing) {
        this.drawDragonCurve();
      }
    }
  }

  stopDrawing(): void {
    this.isDrawing = false;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private rotateLeft(direction: Vector2) {
    return new Vector2(-direction.y, direction.x);
  }

  private rotateRight(direction: Vector2) {
    return new Vector2(direction.y, -direction.x);
  }

  private decimalToRainbowColor(value: number): string {
    // Limitar el valor entre 0 y 1 para asegurar que no exceda el rango
    value = Math.max(0, Math.min(1, value));

    // Convertir el valor decimal entre 0 y 1 a un valor entre 0 y 360 grados para el espectro de color HSL
    const hue = value * 360; // 0 (rojo) a 360 (rojo de nuevo pasando por violeta)

    // Definir saturación (100%) y luminosidad (50%) para colores vivos y de espectro completo
    const saturation = 100;
    const lightness = 50;

    // Convertir el color HSL a hexadecimal
    return this.hslToHex(hue, saturation, lightness);
  }

  // Función auxiliar para convertir HSL a código hexadecimal
  private hslToHex(h: number, s: number, l: number): string {
    s /= 100;
    l /= 100;

    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) =>
      Math.round(
        255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))))
      );

    return `#${f(0).toString(16).padStart(2, '0')}${f(8)
      .toString(16)
      .padStart(2, '0')}${f(4).toString(16).padStart(2, '0')}`;
  }
}
