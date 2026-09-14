import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { pascalRows } from './pascal.math';

@Component({
  selector: 'app-pascal-explorer', standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pascal-explorer.component.html',
  styleUrls: ['./pascal-widgets.css']
})
export class PascalExplorerComponent {
  readonly triangle = pascalRows(32);
  readonly colors = ['#242430', '#8ab4f8', '#f6c76b', '#bca4f5', '#6ed5ba'];
  lastRow = 8;
  modulus = 0;
  selectedN = 5;
  selectedK = 2;
  get maxRow() { return this.modulus === 0 ? 12 : 31; }
  get rows() { return this.triangle.slice(0, this.lastRow + 1); }
  get residues() { return Array.from({ length: this.modulus }, (_, i) => i); }
  get value() { return this.triangle[this.selectedN][this.selectedK]; }
  get rowSum() { return 2 ** this.selectedN; }
  get parents() {
    const previous = this.triangle[this.selectedN - 1];
    return previous ? `${previous[this.selectedK - 1] ?? 0} + ${previous[this.selectedK] ?? 0} = ${this.value}` : 'El 1 inicial es el punto de partida.';
  }
  update() {
    this.lastRow = Math.min(this.lastRow, this.maxRow);
    this.selectedN = Math.min(this.selectedN, this.lastRow);
    this.selectedK = Math.min(this.selectedK, this.selectedN);
  }
  select(n: number, k: number) { this.selectedN = n; this.selectedK = k; }
  isParent(n: number, k: number) {
    return n === this.selectedN - 1 && (k === this.selectedK - 1 || k === this.selectedK);
  }
}
