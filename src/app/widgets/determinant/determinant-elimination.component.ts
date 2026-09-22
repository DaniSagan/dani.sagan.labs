import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  eliminationSteps,
  EliminationStep,
  exactDeterminant,
  Fraction,
  Matrix,
  matrixValid,
} from '../../shared/math/determinant';
import { MatrixInputComponent } from './matrix-input.component';

@Component({
  selector: 'app-determinant-elimination',
  standalone: true,
  imports: [CommonModule, FormsModule, MatrixInputComponent],
  templateUrl: './determinant-elimination.component.html',
  styleUrl: './determinant-widgets.css',
})
export class DeterminantEliminationComponent {
  matrix: Matrix = [
    [0, 2, 1],
    [2, 1, 3],
    [1, 0, 1],
  ];
  steps: EliminationStep[] = [];
  index = 0;
  constructor() {
    this.update(this.matrix);
  }
  get valid() {
    return matrixValid(this.matrix, 5, true);
  }
  get current() {
    return this.steps[this.index];
  }
  get currentDet() {
    return exactDeterminant(this.current.matrix).toString();
  }
  get originalDet() {
    return exactDeterminant(this.steps[0].matrix).toString();
  }
  get diagonal() {
    return this.current.matrix.reduce(
      (p, r, i) => p.multiply(r[i]),
      new Fraction(1),
    );
  }
  get recovered() {
    return this.diagonal.divide(this.current.factor).toString();
  }
  update(matrix: Matrix) {
    this.matrix = matrix;
    this.index = 0;
    this.steps = this.valid ? eliminationSteps(matrix) : [];
  }
  preset(kind: string) {
    const examples: Record<string, Matrix> = {
      swap: [
        [0, 2, 1],
        [2, 1, 3],
        [1, 0, 1],
      ],
      singular: [
        [1, 2, 1],
        [2, 4, 2],
        [0, 1, 1],
      ],
      triangular: [
        [2, 1, 3],
        [0, -3, 2],
        [0, 0, 4],
      ],
    };
    this.update(examples[kind].map((r) => [...r]));
  }
}
