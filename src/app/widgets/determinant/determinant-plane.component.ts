import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  determinant,
  interpolateIdentity,
  Matrix,
  matrixValid,
  multiplyMatrices,
} from '../../shared/math/determinant';
import { MatrixInputComponent } from './matrix-input.component';

@Component({
  selector: 'app-determinant-plane',
  standalone: true,
  imports: [CommonModule, FormsModule, MatrixInputComponent],
  templateUrl: './determinant-plane.component.html',
  styleUrl: './determinant-widgets.css',
})
export class DeterminantPlaneComponent {
  matrix: Matrix = [
    [2, 1],
    [0, 1],
  ];
  t = 1;
  composition = 'identity';
  dragColumn = -1;
  private dragExtent = 2;
  readonly grid = [-2, -1, 0, 1, 2];
  readonly transforms: Record<string, Matrix> = {
    identity: [
      [1, 0],
      [0, 1],
    ],
    reflection: [
      [-1, 0],
      [0, 1],
    ],
    shear: [
      [1, 1],
      [0, 1],
    ],
    scale: [
      [2, 0],
      [0, 1],
    ],
  };
  get valid() {
    return matrixValid(this.matrix, 3);
  }
  get b() {
    return this.transforms[this.composition];
  }
  get target() {
    return multiplyMatrices(this.b, this.matrix);
  }
  get current() {
    return interpolateIdentity(this.target, this.t);
  }
  get det() {
    return determinant(this.current);
  }
  get area() {
    return Math.abs(this.det);
  }
  get determinantA() {
    return determinant(this.matrix);
  }
  get determinantB() {
    return determinant(this.b);
  }
  get extent() {
    return this.dragColumn >= 0
      ? this.dragExtent
      : Math.max(
          2,
          ...this.target.map(
            (row) => Math.abs(row[0]) + Math.abs(row[1]) + 0.5,
          ),
        );
  }
  get orientation() {
    return Math.abs(this.det) < 1e-12
      ? 'Área nula a la precisión mostrada'
      : this.det > 0
        ? 'Orientación conservada'
        : 'Orientación invertida';
  }
  get fill() {
    return Math.abs(this.det) < 1e-12
      ? '#f6cc8040'
      : this.det > 0
        ? '#82e3cc35'
        : '#ff9eae40';
  }
  get draggable() {
    return this.t === 1 && this.composition === 'identity';
  }
  fmt(value: number) {
    return Number(value.toPrecision(6)).toLocaleString('es-ES', {
      maximumSignificantDigits: 6,
    });
  }
  sx(x: number) {
    return 300 + (240 * x) / this.extent;
  }
  sy(y: number) {
    return 260 - (240 * y) / this.extent;
  }
  transformed(x: number, y: number) {
    const a = this.current;
    return { x: a[0][0] * x + a[0][1] * y, y: a[1][0] * x + a[1][1] * y };
  }
  point(x: number, y: number, transform = true) {
    const p = transform ? this.transformed(x, y) : { x, y };
    return `${this.sx(p.x)},${this.sy(p.y)}`;
  }
  get polygon() {
    return [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
    ]
      .map(([x, y]) => this.point(x, y))
      .join(' ');
  }
  get original() {
    return [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
    ]
      .map(([x, y]) => this.point(x, y, false))
      .join(' ');
  }
  get ellipse() {
    return Array.from(
      { length: 121 },
      (_, i) =>
        `${i ? 'L' : 'M'}${this.point(Math.cos((2 * Math.PI * i) / 120), Math.sin((2 * Math.PI * i) / 120))}`,
    ).join(' ');
  }
  get curve() {
    return Array.from(
      { length: 101 },
      (_, i) =>
        `${i ? 'L' : 'M'}${45 + (510 * i) / 100},${110 - (65 * determinant(interpolateIdentity(this.target, i / 100))) / this.detScale}`,
    ).join(' ');
  }
  get detScale() {
    return Math.max(
      1,
      ...Array.from({ length: 101 }, (_, i) =>
        Math.abs(determinant(interpolateIdentity(this.target, i / 100))),
      ),
    );
  }
  preset(kind: string) {
    const examples: Record<string, Matrix> = {
      identity: [
        [1, 0],
        [0, 1],
      ],
      shear: [
        [1, 2],
        [0, 1],
      ],
      reflection: [
        [-1, 0],
        [0, 1],
      ],
      collapse: [
        [1, 2],
        [0.5, 1],
      ],
      rotation: [
        [-1, 0],
        [0, -1],
      ],
      area: [
        [2, 1],
        [0, 1],
      ],
    };
    this.matrix = examples[kind].map((row) => [...row]);
    this.composition = 'identity';
    this.t = 1;
  }
  start(event: PointerEvent, column: number, element: Element) {
    if (!this.draggable) return;
    event.preventDefault();
    this.dragExtent = this.extent;
    this.dragColumn = column;
    element.setPointerCapture(event.pointerId);
  }
  drag(event: PointerEvent, element: Element) {
    if (this.dragColumn < 0) return;
    const matrix = (element as SVGSVGElement).getScreenCTM();
    if (!matrix) return;
    const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(
      matrix.inverse(),
    );
    const value = (x: number) =>
      Math.max(-3, Math.min(3, Math.round(x * 10) / 10));
    const next = this.matrix.map((row) => [...row]);
    next[0][this.dragColumn] = value(((p.x - 300) * this.extent) / 240);
    next[1][this.dragColumn] = value(((260 - p.y) * this.extent) / 240);
    this.matrix = next;
  }
  stop() {
    this.dragColumn = -1;
  }
}
