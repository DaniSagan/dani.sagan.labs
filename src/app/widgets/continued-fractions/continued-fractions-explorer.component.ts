import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { convergents } from './continued-fractions.math';

@Component({
  selector: 'app-continued-fractions-explorer', standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './continued-fractions-explorer.component.html',
  styleUrls: ['./continued-fractions.css']
})
export class ContinuedFractionsExplorerComponent {
  readonly examples = [
    { label: 'π', value: Math.PI, coefficients: [3, 7, 15, 1, 292, 1, 1, 1] },
    { label: '√2', value: Math.SQRT2, coefficients: [1, 2, 2, 2, 2, 2, 2, 2] },
    { label: 'φ · número áureo', value: (1 + Math.sqrt(5)) / 2, coefficients: [1, 1, 1, 1, 1, 1, 1, 1] }
  ];
  exampleIndex = 0;
  count = 4;
  readonly ticks = Array.from({ length: 13 }, (_, i) => i);
  get example() { return this.examples[this.exampleIndex]; }
  get notation() {
    const a = this.example.coefficients.slice(0, this.count);
    return `[${a[0]}${a.length > 1 ? '; ' + a.slice(1).join(', ') : ''}]`;
  }
  get rows() {
    return convergents(this.example.coefficients.slice(0, this.count)).map((row, n) => {
      const error = Math.abs(row.value - this.example.value);
      return { ...row, n, error, x: 58 + n * 69, y: 30 - Math.log10(error) * 20 };
    });
  }
  get points() { return this.rows.map(row => `${row.x},${row.y}`).join(' '); }
}
