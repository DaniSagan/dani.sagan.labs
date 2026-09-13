import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { bernoulliNumbers, formatBernoulli, MAX_BERNOULLI_INDEX } from '../../shared/math/bernoulli';

@Component({
  selector: 'app-bernoulli-calculator', standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bernoulli-calculator.component.html',
  styleUrl: './bernoulli-calculator.component.css'
})
export class BernoulliCalculatorComponent {
  index: number | null = 12;
  readonly maximum = MAX_BERNOULLI_INDEX;
  evaluatedIndex = 12;
  result = ''; error = '';
  rows: { index: number; value: string }[] = [];
  constructor() { this.calculate(); }
  example(index: number): void { this.index = index; this.calculate(); }
  calculate(): void {
    this.result = ''; this.error = ''; this.rows = [];
    try {
      if (this.index === null) throw new Error('Introduce el índice n.');
      const values = bernoulliNumbers(this.index);
      this.evaluatedIndex = this.index;
      this.result = formatBernoulli(values[this.index]);
      this.rows = values.map((value, index) => ({ index, value: formatBernoulli(value) }));
    } catch (error) { this.error = (error as Error).message; }
  }
}
