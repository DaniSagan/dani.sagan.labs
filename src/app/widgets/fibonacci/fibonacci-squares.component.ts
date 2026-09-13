import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { fibonacciSquares, FibonacciSquare } from '../../shared/math/fibonacci';

@Component({
  selector: 'app-fibonacci-squares', standalone: true, imports: [CommonModule, FormsModule],
  styleUrl: './fibonacci-widgets.css',
  template: `
    <section class="widget" aria-labelledby="fibonacci-squares-title">
      <h3 id="fibonacci-squares-title">Construir con cuadrados</h3>
      <label for="fibonacci-squares-count">Número de cuadrados: {{ count }}</label>
      <input id="fibonacci-squares-count" type="range" min="2" max="10" step="1" [(ngModel)]="count" (ngModelChange)="update()">
      <p>Añade cuadrados de lados 1, 1, 2, 3, 5, … alrededor del rectángulo. Cada nuevo lado suma los dos anteriores.</p>
      <svg [attr.viewBox]="viewBox" role="img" [attr.aria-label]="'Mosaico de ' + count + ' cuadrados de Fibonacci; rectángulo de ' + width + ' por ' + height">
        <g *ngFor="let square of squares">
          <rect [attr.x]="square.x" [attr.y]="square.y" [attr.width]="square.size" [attr.height]="square.size"
            [attr.fill]="colors[(square.index - 1) % colors.length]" stroke="#0f0f18" [attr.stroke-width]="0.025">
            <title>F{{ square.index }}: lado {{ square.size }}, área {{ square.size * square.size }}</title>
          </rect>
          <text [attr.x]="square.x + square.size / 2" [attr.y]="square.y + square.size / 2"
            text-anchor="middle" dominant-baseline="central" [attr.font-size]="square.size * 0.25" class="square-label">{{ square.size }}</text>
        </g>
      </svg>
      <p aria-live="polite">Rectángulo: {{ width }} × {{ height }}. Área total de los cuadrados: {{ area }}.
        Proporción lado mayor / lado menor ≈ {{ ratio | number:'1.8-8' }}.</p>
      <p class="note">Las etiquetas indican la longitud del lado. Al añadir cuadrados, los primeros se ven más pequeños porque el dibujo ajusta su escala.</p>
    </section>`
})
export class FibonacciSquaresComponent {
  count = 6; squares: FibonacciSquare[] = []; viewBox = ''; width = 0; height = 0; area = 0; ratio = 0;
  readonly colors = ['#75cfff', '#c6a0ff', '#ffb184', '#8edbb1'];
  constructor() { this.update(); }
  update(): void {
    this.squares = fibonacciSquares(this.count);
    const left = Math.min(...this.squares.map(s => s.x)), top = Math.min(...this.squares.map(s => s.y));
    this.width = Math.max(...this.squares.map(s => s.x + s.size)) - left;
    this.height = Math.max(...this.squares.map(s => s.y + s.size)) - top;
    const padding = Math.max(this.width, this.height) * 0.04;
    this.viewBox = `${left - padding} ${top - padding} ${this.width + 2 * padding} ${this.height + 2 * padding}`;
    this.area = this.squares.reduce((sum, s) => sum + s.size ** 2, 0);
    this.ratio = Math.max(this.width, this.height) / Math.min(this.width, this.height);
  }
}
