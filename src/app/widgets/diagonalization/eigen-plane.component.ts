import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Matrix } from '../../shared/math/determinant';

@Component({
  selector: 'app-eigen-plane',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eigen-plane.component.html',
  styleUrls: ['./eigen-plane.component.css'],
})
export class EigenPlaneComponent {
  private static nextId = 0;
  readonly markerId = `eigen-arrow-${EigenPlaneComponent.nextId++}`;
  readonly marker = `url(#${this.markerId})`;
  @Input() matrix: Matrix = [
    [2, 1],
    [1, 2],
  ];
  @Input() vector = [1, 0];
  @Input() directions: number[][] = [];
  @Input() samples = false;
  @Input() interactive = false;
  @Input() label = 'Cuadrícula original y transformada';
  @Output() vectorChange = new EventEmitter<number[]>();
  readonly grid = [-2, -1, 0, 1, 2];
  readonly rays = Array.from({ length: 16 }, (_, i) => [
    Math.cos((i * Math.PI) / 8),
    Math.sin((i * Math.PI) / 8),
  ]);
  get extent() {
    return Math.max(
      3.5,
      ...this.matrix.map(
        (row) => 2 * (Math.abs(row[0]) + Math.abs(row[1])) + 0.5,
      ),
      ...this.vector.map(Math.abs),
      ...this.matrix.map(
        (row) =>
          Math.abs(row[0] * this.vector[0] + row[1] * this.vector[1]) + 0.5,
      ),
    );
  }
  get extentLabel() {
    return `Ventana: ±${Number(this.extent.toPrecision(4))}. Misma escala en ambos ejes.`;
  }
  sx(x: number) {
    return 260 + (x * 235) / this.extent;
  }
  sy(y: number) {
    return 260 - (y * 235) / this.extent;
  }
  px(x: number, y: number) {
    return this.sx(this.matrix[0][0] * x + this.matrix[0][1] * y);
  }
  py(x: number, y: number) {
    return this.sy(this.matrix[1][0] * x + this.matrix[1][1] * y);
  }
  select(event: PointerEvent) {
    if (!this.interactive) return;
    const rect = (event.currentTarget as SVGElement).getBoundingClientRect();
    const x =
      ((((event.clientX - rect.left) * 520) / rect.width - 260) * this.extent) /
      235;
    const y =
      ((260 - ((event.clientY - rect.top) * 520) / rect.height) * this.extent) /
      235;
    this.vectorChange.emit([
      Math.max(-3, Math.min(3, x)),
      Math.max(-3, Math.min(3, y)),
    ]);
  }
}
