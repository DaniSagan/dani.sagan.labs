import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { euclideanSteps } from './continued-fractions.math';

@Component({
  selector: 'app-euclidean-squares', standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './euclidean-squares.component.html',
  styleUrls: ['./continued-fractions.css']
})
export class EuclideanSquaresComponent {
  numerator = 43;
  denominator = 19;
  visibleSteps = 4;
  readonly colors = ['#8ab4f8', '#f6c76b', '#bca4f5', '#6ed5ba', '#ef9fa8', '#90c9da', '#e3b5ef', '#c9d58a', '#efbd94', '#9ab7e9'];
  get valid() { return [this.numerator, this.denominator].every(n => Number.isInteger(n) && n >= 1 && n <= 100); }
  get steps() { return this.valid ? euclideanSteps(this.numerator, this.denominator) : []; }
  get notation() {
    const a = this.steps.map(step => step.quotient);
    return `[${a[0]}${a.length > 1 ? '; ' + a.slice(1).join(', ') : ''}]`;
  }
  reset() { this.visibleSteps = this.steps.length; }
  get squares() {
    const result: { x: number; y: number; size: number; stage: number }[] = [];
    let x = 0, y = 0, width = this.numerator, height = this.denominator;
    this.steps.slice(0, this.visibleSteps).forEach((step, stage) => {
      const horizontal = width >= height;
      const size = Math.min(width, height);
      for (let i = 0; i < step.quotient; i++) {
        result.push({ x, y, size, stage });
        if (horizontal) { x += size; } else { y += size; }
      }
      if (horizontal) { width -= step.quotient * size; } else { height -= step.quotient * size; }
    });
    return result;
  }
}
