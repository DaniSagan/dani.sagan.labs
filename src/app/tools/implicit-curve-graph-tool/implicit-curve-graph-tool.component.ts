import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GraphableFunction, ImplicitCurveGraphComponent } from '../../widgets/implicit-curve-graph/implicit-curve-graph.component';

@Component({
  selector: 'app-implicit-curve-graph-tool',
  standalone: true,
  imports: [CommonModule, ImplicitCurveGraphComponent, FormsModule],
  templateUrl: './implicit-curve-graph-tool.component.html',
  styleUrl: './implicit-curve-graph-tool.component.css'
})
export class ImplicitCurveGraphToolComponent implements AfterViewInit {
  @ViewChild('curveGraph', { static: true }) curveGraph!: ImplicitCurveGraphComponent;
  formula = 'x*x + y*y - 1';
  xMin = -3; xMax = 3; yMin = -3; yMax = 3;
  error = '';

  ngAfterViewInit(): void { this.onRedraw(); }
  onRedraw(): void {
    this.error = '';
    try {
      if (!this.formula.trim()) throw new Error('Introduce una expresión.');
      const fn = new Function('x', 'y', `"use strict"; return (${this.formula});`);
      if (typeof fn(0.123, 0.456) !== 'number') throw new Error('La expresión debe devolver un número.');
      this.curveGraph.setBounds(this.xMin, this.xMax, this.yMin, this.yMax);
      this.curveGraph.functions = [new GraphableFunction(fn, '#ff785e')];
      this.curveGraph.drawGraph();
    } catch (error) {
      this.error = error instanceof SyntaxError ? 'La expresión no es válida. Usa sintaxis JavaScript, por ejemplo x*x + y*y - 1.'
        : error instanceof Error ? error.message : 'No se pudo dibujar la expresión.';
    }
  }
  example(formula: string): void { this.formula = formula; this.onRedraw(); }
}
