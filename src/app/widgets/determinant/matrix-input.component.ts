import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Matrix } from '../../shared/math/determinant';

@Component({
  selector: 'app-determinant-matrix-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `<fieldset>
    <legend>{{ label }}</legend>
    <div
      class="matrix"
      [style.grid-template-columns]="
        'repeat(' + matrix.length + ', minmax(0, 1fr))'
      "
    >
      <ng-container *ngFor="let row of matrix; let i = index; trackBy: track"
        ><label *ngFor="let value of row; let j = index; trackBy: track"
          ><span>{{ i + 1 }},{{ j + 1 }}</span
          ><input
            type="number"
            [attr.aria-label]="
              label + ', fila ' + (i + 1) + ', columna ' + (j + 1)
            "
            [min]="-limit"
            [max]="limit"
            [step]="step"
            [ngModel]="value"
            (ngModelChange)="edit(i, j, $event)" /></label
      ></ng-container>
    </div>
  </fieldset>`,
  styles: [
    `
      :host {
        display: block;
        min-width: 0;
      }
      fieldset {
        min-width: 0;
        box-sizing: border-box;
        border: 1px solid #46616e;
        padding: 0.8rem;
        border-radius: 9px;
      }
      legend {
        float: none;
        width: auto;
        padding: 0 0.4rem;
        color: #bed0da;
        font-size: 0.9rem;
        margin: 0;
      }
      .matrix {
        display: grid;
        gap: 0.5rem;
      }
      label {
        min-width: 0;
      }
      label span {
        display: block;
        font-size: 0.68rem;
        color: #9fb5c2;
        margin-bottom: 0.15rem;
      }
      input {
        box-sizing: border-box;
        width: 100%;
        min-width: 0;
        min-height: 42px;
        border: 1px solid #58717c;
        border-radius: 5px;
        background: #0a141c;
        color: #edf6f8;
        padding: 0.4rem;
        font: inherit;
        text-align: center;
      }
      input:focus-visible {
        outline: 2px solid #f6cc80;
        outline-offset: 2px;
      }
    `,
  ],
})
export class MatrixInputComponent {
  @Input() matrix: Matrix = [
    [1, 0],
    [0, 1],
  ];
  @Input() label = 'Matriz A';
  @Input() step = 1;
  @Input() limit = 5;
  @Output() matrixChange = new EventEmitter<Matrix>();
  track(index: number) {
    return index;
  }
  edit(i: number, j: number, value: number) {
    const next = this.matrix.map((row) => [...row]);
    next[i][j] = value;
    this.matrixChange.emit(next);
  }
}
