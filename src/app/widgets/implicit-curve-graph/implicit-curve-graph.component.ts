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

  _formula: string = 'x*x + y*y - 1'; // Fórmula inicial: círculo unitario

  _formulaFormula: Function;
  @Input()
  get formula(): Function { return this._formulaFormula; }
  set formula(fn: Function) {
    this._formulaFormula = fn;
    this.drawGraph(this._formulaFormula);
  }

  @Input() xMin: number = -10;
  @Input() xMax: number = 10;
  @Input() yMin: number = -10;
  @Input() yMax: number = 10;
  resolution: number = 0.05; // Resolución para la grilla de puntos

  context!: CanvasRenderingContext2D;

  constructor() {
    this._formulaFormula = new Function('x', 'y', 'x - y');
  }

  ngOnInit() {
    this.context = this.canvas.nativeElement.getContext('2d')!;
    if(this.validateFormula(this._formula)) {
      const replacedFormula = new Function('x', 'y', `return ${this._formula}`);
      this.drawGraph(replacedFormula);
    }
  }

  // Dibujar la gráfica implícita f(x, y) = 0
  drawGraph(fn: Function) {
    console.log('formula', this._formula);
    const canvas = this.canvas.nativeElement;
    const ctx = this.context;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const width = canvas.width;
    const height = canvas.height;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

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
    ctx.fillStyle = 'black';

    //const replacedFormula = new Function('x', 'y', `return ${this.formula}`);
    for (let xPixel = 0; xPixel < width; xPixel++) {
      for (let yPixel = 0; yPixel < height; yPixel++) {
        const xValue0 = this.xMin + ((xPixel) / xScale);
        const xValue1 = this.xMin + ((xPixel + 1) / xScale);
        const yValue0 = this.yMax - ((yPixel) / yScale); // El canvas tiene el eje Y invertido
        const yValue1 = this.yMax - ((yPixel + 1) / yScale);

        let fValue0: number;
        let fValueX1: number;
        let fValueY1: number;
        try {
          fValue0 = fn(xValue0, yValue0);
          fValueX1 = fn(xValue1, yValue0);
          fValueY1 = fn(xValue0, yValue1);
        } catch (e) {
          console.error('Error evaluando la fórmula:', e);
          throw e;
        }

        if (fValue0 * fValueX1 <= 0 || fValue0 * fValueY1 <= 0) {
          ctx.fillRect(xPixel, yPixel, 1, 1);
        }
      }
    }

    ctx.stroke();
  }

  // Método para redibujar la gráfica cuando cambien los parámetros
  onRedraw() {
    if(this.validateFormula(this._formula)) {
      const replacedFormula = new Function('x', 'y', `return ${this._formula}`);
      this.drawGraph(replacedFormula);
    }
  }

  setBounds(xMin: number, xMax: number, yMin: number, yMax: number): void {
    this.xMin = xMin;
    this.xMax = xMax;
    this.yMin = yMin;
    this.yMax = yMax;
  }

  private validateFormula(formula: string) {
    if(formula.indexOf('x') < 0) return false;
    if(formula.indexOf('y') < 0) return false;
    return true;
  }
}
