import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAX_PERFECT_INPUT, properDivisors } from '../../shared/math/perfect-numbers';

@Component({
  selector: 'app-divisor-balance', standalone: true, imports: [CommonModule, FormsModule],
  templateUrl: './divisor-balance.component.html', styleUrl: './perfect-numbers-widgets.css'
})
export class DivisorBalanceComponent {
  input: number | null = 28;
  readonly maximum = MAX_PERFECT_INPUT;
  n = 28; divisors: number[] = []; selected = new Set<number>(); error = '';
  constructor() { this.calculate(); }
  get total(): number { return this.divisors.reduce((sum, d) => sum + d, 0); }
  get partial(): number { return Array.from(this.selected).reduce((sum, d) => sum + d, 0); }
  get scale(): number { return Math.max(this.n, this.total); }
  get classification(): string { return this.total === this.n ? 'perfecto' : this.total < this.n ? 'deficiente' : 'abundante'; }
  example(n: number): void { this.input = n; this.calculate(); }
  calculate(): void {
    this.error = '';
    try {
      if (this.input === null) throw new Error('Introduce un número.');
      const divisors = properDivisors(this.input);
      this.n = this.input; this.divisors = divisors; this.selectAll();
    } catch (error) { this.error = (error as Error).message; }
  }
  toggle(d: number): void { this.selected.has(d) ? this.selected.delete(d) : this.selected.add(d); }
  selectAll(): void { this.selected = new Set(this.divisors); }
  clear(): void { this.selected.clear(); }
}
