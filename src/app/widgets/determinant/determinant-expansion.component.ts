import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  determinant,
  Matrix,
  matrixValid,
  minor,
  permutations,
  permutationSign,
} from '../../shared/math/determinant';
import { MatrixInputComponent } from './matrix-input.component';

@Component({
  selector: 'app-determinant-expansion',
  standalone: true,
  imports: [CommonModule, FormsModule, MatrixInputComponent],
  templateUrl: './determinant-expansion.component.html',
  styleUrl: './determinant-widgets.css',
})
export class DeterminantExpansionComponent {
  matrix: Matrix = [
    [2, 1, 0],
    [1, 3, 1],
    [0, 2, 2],
  ];
  selected = 0;
  row = 0;
  column = 0;
  mode = 'permutations';
  readonly orders = permutations(3);
  get valid() {
    return matrixValid(this.matrix, 5, true);
  }
  get det() {
    return determinant(this.matrix);
  }
  get terms() {
    return this.orders.map((p) => ({
      p,
      sign: permutationSign(p),
      factors: p.map((j, i) => this.matrix[i][j]),
      value:
        permutationSign(p) * p.reduce((v, j, i) => v * this.matrix[i][j], 1),
    }));
  }
  get submatrix() {
    return minor(this.matrix, this.row, this.column);
  }
  get minorDet() {
    return determinant(this.submatrix);
  }
  get sign() {
    return (this.row + this.column) % 2 ? -1 : 1;
  }
  get cofactor() {
    return this.sign * this.minorDet;
  }
  get contributions() {
    return this.matrix[this.row].map(
      (v, j) =>
        v *
        ((this.row + j) % 2 ? -1 : 1) *
        determinant(minor(this.matrix, this.row, j)),
    );
  }
  pick(i: number, j: number) {
    this.row = i;
    this.column = j;
  }
  preset(singular: boolean) {
    this.matrix = singular
      ? [
          [1, 2, 1],
          [2, 4, 2],
          [0, 1, 1],
        ]
      : [
          [2, 1, 0],
          [1, 3, 1],
          [0, 2, 2],
        ];
  }
}
