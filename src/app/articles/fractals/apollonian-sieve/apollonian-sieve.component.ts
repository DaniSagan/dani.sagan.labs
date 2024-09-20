import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Circle } from 'src/app/shared/math/circle';
import { Vec2 } from 'src/app/shared/math/vec2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-apollonian-sieve',
  templateUrl: './apollonian-sieve.component.html',
  styleUrls: ['./apollonian-sieve.component.css'],
  standalone: true,
  imports: [FormsModule],
})
export class ApollonianSieveComponent implements AfterViewInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  static title: string = 'Tamíz de Apolonio';
  static route: string = 'apollonian-sieve';

  width = 800;
  height = 800;

  // Parámetros ajustables para la recursión y radios de los círculos originales
  maxDepth: number = 5;
  radius1: number = 200; // Radio del primer círculo
  radius2: number = 150; // Radio del segundo círculo
  radius3: number = 100; // Radio del tercer círculo

  constructor() {}

  ngAfterViewInit() {
    this.drawApollonianSieve();
  }

  // Función principal para dibujar el Tamiz de Apolonio
  drawApollonianSieve() {
    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, this.width, this.height);

    // Coordenadas de los tres círculos generadores (con radios ajustables)
    const circle1 = {
      x: this.width / 2,
      y: this.height / 2 - 150,
      r: this.radius1,
    };
    const circle2 = {
      x: this.width / 2 - 200,
      y: this.height / 2 + 100,
      r: this.radius2,
    };
    const circle3 = {
      x: this.width / 2 + 200,
      y: this.height / 2 + 100,
      r: this.radius3,
    };

    // Dibujar los círculos generadores
    this.drawCircle(ctx, circle1.x, circle1.y, circle1.r);
    this.drawCircle(ctx, circle2.x, circle2.y, circle2.r);
    this.drawCircle(ctx, circle3.x, circle3.y, circle3.r);

    // Generar el Tamiz de Apolonio recursivamente
    this.generateApollonian(ctx, circle1, circle2, circle3, this.maxDepth);
  }

  // Dibujar un círculo en el canvas
  drawCircle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.strokeStyle = 'black';
    ctx.stroke();
  }

  // Función recursiva para generar círculos internos
  generateApollonian(
    ctx: CanvasRenderingContext2D,
    c1: any,
    c2: any,
    c3: any,
    depth: number
  ) {
    if (depth <= 0) return;

    // Calcular el nuevo círculo interno
    const newCircle = this.calculateInnerCircle(c1, c2, c3);

    // Dibujar el nuevo círculo
    this.drawCircle(ctx, newCircle.x, newCircle.y, newCircle.r);

    // Recursión: aplicar la misma técnica a los círculos restantes
    this.generateApollonian(ctx, newCircle, c1, c2, depth - 1);
    this.generateApollonian(ctx, newCircle, c2, c3, depth - 1);
    this.generateApollonian(ctx, newCircle, c3, c1, depth - 1);
  }

  // Calcular el círculo interno tangente a tres círculos dados usando la fórmula de Descartes
  calculateInnerCircle(c1: any, c2: any, c3: any) {
    // Curvaturas de los círculos (k = 1 / radio)
    const k1 = 1 / c1.r;
    const k2 = 1 / c2.r;
    const k3 = 1 / c3.r;

    // Curvatura del nuevo círculo interno (fórmula de Descartes)
    const k4 = k1 + k2 + k3 + 2 * Math.sqrt(k1 * k2 + k2 * k3 + k3 * k1);
    const r4 = 1 / k4; // Radio del nuevo círculo interno

    // Calcular la posición del nuevo círculo interno
    const x = (k1 * c1.x + k2 * c2.x + k3 * c3.x) / (k1 + k2 + k3);
    const y = (k1 * c1.y + k2 * c2.y + k3 * c3.y) / (k1 + k2 + k3);

    return { x, y, r: r4 };
  }

  // Función para actualizar los parámetros y redibujar el tamiz
  update() {
    this.drawApollonianSieve();
  }
}
