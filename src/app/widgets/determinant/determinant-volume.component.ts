import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  determinant,
  Matrix,
  matrixValid,
} from '../../shared/math/determinant';
import { MatrixInputComponent } from './matrix-input.component';

@Component({
  selector: 'app-determinant-volume',
  standalone: true,
  imports: [CommonModule, FormsModule, MatrixInputComponent],
  templateUrl: './determinant-volume.component.html',
  styleUrl: './determinant-widgets.css',
})
export class DeterminantVolumeComponent {
  matrix: Matrix = [
    [1, 0.6, 0.3],
    [0, 1, 0.4],
    [0, 0, 1],
  ];
  yaw = 35;
  pitch = 25;
  showUnit = true;
  private dragging = false;
  private lastX = 0;
  private lastY = 0;
  readonly corners = Array.from({ length: 8 }, (_, i) => [
    i & 1,
    (i >> 1) & 1,
    (i >> 2) & 1,
  ]);
  readonly faceIndices = [
    [0, 1, 3, 2],
    [4, 5, 7, 6],
    [0, 1, 5, 4],
    [2, 3, 7, 6],
    [0, 2, 6, 4],
    [1, 3, 7, 5],
  ];
  readonly colors = ['#82e3cc', '#f6cc80', '#c5a6ff'];
  get valid() {
    return matrixValid(this.matrix, 3);
  }
  get det() {
    return determinant(this.matrix);
  }
  get volume() {
    return Math.abs(this.det);
  }
  get bounds() {
    const points = this.corners.map((p) => this.raw(this.transform(p)));
    if (this.showUnit) points.push(...this.corners.map((p) => this.raw(p)));
    const xs = points.map((p) => p.x),
      ys = points.map((p) => p.y);
    const xmin = Math.min(...xs),
      xmax = Math.max(...xs),
      ymin = Math.min(...ys),
      ymax = Math.max(...ys);
    return {
      cx: (xmin + xmax) / 2,
      cy: (ymin + ymax) / 2,
      width: Math.max(0.5, xmax - xmin),
      height: Math.max(0.5, ymax - ymin),
    };
  }
  get scale() {
    const b = this.bounds;
    return Math.min(460 / b.width, 340 / b.height);
  }
  get origin() {
    return this.project([0, 0, 0]);
  }
  transform(p: number[]) {
    return this.matrix.map((row) => row.reduce((s, v, i) => s + v * p[i], 0));
  }
  raw(p: number[]) {
    const a = (this.yaw * Math.PI) / 180,
      b = (this.pitch * Math.PI) / 180;
    const x = p[0] * Math.cos(a) - p[1] * Math.sin(a),
      y = p[0] * Math.sin(a) + p[1] * Math.cos(a);
    return {
      x,
      y: p[2] * Math.cos(b) - y * Math.sin(b),
      z: y * Math.cos(b) + p[2] * Math.sin(b),
    };
  }
  project(p: number[]) {
    const q = this.raw(p),
      b = this.bounds;
    return {
      x: 300 + this.scale * (q.x - b.cx),
      y: 250 - this.scale * (q.y - b.cy),
      z: q.z,
    };
  }
  points(indices: number[], unit = false) {
    return indices
      .map((i) => {
        const p = this.project(
          unit ? this.corners[i] : this.transform(this.corners[i]),
        );
        return `${p.x},${p.y}`;
      })
      .join(' ');
  }
  get faces() {
    return this.faceIndices
      .map((indices, i) => ({
        indices,
        color: this.colors[Math.floor(i / 2)],
        depth:
          indices.reduce(
            (s, j) => s + this.project(this.transform(this.corners[j])).z,
            0,
          ) / 4,
      }))
      .sort((a, b) => a.depth - b.depth);
  }
  axis(i: number, transformed: boolean) {
    const p = [0, 0, 0];
    p[i] = 1;
    return this.project(transformed ? this.transform(p) : p);
  }
  fmt(n: number) {
    return Number(n.toPrecision(6)).toLocaleString('es-ES', {
      maximumSignificantDigits: 6,
    });
  }
  preset(kind: string) {
    const examples: Record<string, Matrix> = {
      unit: [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ],
      shear: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 1],
      ],
      stretch: [
        [2, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ],
      reflection: [
        [-1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ],
      flat: [
        [1, 0, 1],
        [0, 1, 1],
        [0, 0, 0],
      ],
    };
    this.matrix = examples[kind].map((r) => [...r]);
  }
  start(e: PointerEvent, element: Element) {
    e.preventDefault();
    this.dragging = true;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    element.setPointerCapture(e.pointerId);
  }
  move(e: PointerEvent) {
    if (!this.dragging) return;
    this.yaw = (this.yaw + (e.clientX - this.lastX) * 0.5 + 360) % 360;
    this.pitch = Math.max(
      -80,
      Math.min(80, this.pitch + (e.clientY - this.lastY) * 0.4),
    );
    this.lastX = e.clientX;
    this.lastY = e.clientY;
  }
  stop() {
    this.dragging = false;
  }
}
