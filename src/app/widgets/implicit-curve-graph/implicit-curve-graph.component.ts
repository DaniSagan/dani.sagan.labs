import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-implicit-curve-graph',
  templateUrl: './implicit-curve-graph.component.html',
  styleUrls: ['./implicit-curve-graph.component.css'],
  standalone: true,
  imports: [FormsModule]
})
export class ImplicitCurveGraphComponent {
  @ViewChild('graphCanvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  @Input() formula: string = 'x*x + y*y - 1'; // Fórmula inicial: círculo unitario
  @Input() xMin: number = -10;
  @Input() xMax: number = 10;
  @Input() yMin: number = -10;
  @Input() yMax: number = 10;
  resolution: number = 0.05; // Resolución para la grilla de puntos

  context!: CanvasRenderingContext2D;

  ngOnInit() {
    this.context = this.canvas.nativeElement.getContext('2d')!;
    if(this.validateFormula(this.formula)) {
      this.drawGraph();
    }
  }

  // Dibujar la gráfica implícita f(x, y) = 0
  drawGraph() {
    console.log('formula', this.formula);
    const canvas = this.canvas.nativeElement;
    const ctx = this.context;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const width = canvas.width;
    const height = canvas.height;

    // Escala para convertir valores matemáticos a píxeles
    const xScale = width / (this.xMax - this.xMin);
    const yScale = height / (this.yMax - this.yMin);

    // Dibuja el eje X y Y
    ctx.beginPath();
    ctx.strokeStyle = 'gray';
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();

    // Dibujar la curva implícita
    ctx.beginPath();
    ctx.strokeStyle = 'blue';

    const replacedFormula = new Function('x', 'y', `return ${this.formula}`);
    for (let xPixel = 0; xPixel < width; xPixel++) {
      for (let yPixel = 0; yPixel < height; yPixel++) {
        const xValue0 = this.xMin + (xPixel / xScale);
        const xValue1 = this.xMin + ((xPixel + 1) / xScale);
        const yValue0 = this.yMax - (yPixel / yScale); // El canvas tiene el eje Y invertido
        const yValue1 = this.yMax - ((yPixel+1) / yScale);

        let fValue0: number;
        let fValueX1: number;
        let fValueY1: number;
        try {
          fValue0 = replacedFormula(xValue0, yValue0);
          fValueX1 = replacedFormula(xValue1, yValue0);
          fValueY1 = replacedFormula(xValue0, yValue1);
        } catch (e) {
          console.error('Error evaluando la fórmula:', e);
          throw e;
        }

        if (fValue0 * fValueX1 < 0 || fValue0 * fValueY1 < 0) {
          ctx.fillRect(xPixel, yPixel, 1, 1);
        }
      }
    }

    ctx.stroke();
  }

  // Método para redibujar la gráfica cuando cambien los parámetros
  onRedraw() {
    this.drawGraph();
  }

  private validateFormula(formula: string) {
    if(formula.indexOf('x') < 0) return false;
    if(formula.indexOf('y') < 0) return false;
    return true;
  }
}
