import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { euclid } from '../euclid/euclid.math';
import { isPrime } from './modular.math';

@Component({
  selector: 'app-modular-table',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './modular-table.component.html',
  styleUrl: './modular-widgets.css',
})
export class ModularTableComponent {
  n = 6;
  operation: 'add' | 'multiply' = 'multiply';
  a = 2;
  b = 3;
  get valid(): boolean {
    return Number.isInteger(this.n) && this.n >= 2 && this.n <= 12;
  }
  get residues(): number[] {
    return Array.from({ length: this.valid ? this.n : 0 }, (_, i) => i);
  }
  get prime(): boolean {
    return isPrime(this.n);
  }
  get units(): number[] {
    return this.residues.filter(
      (a) => euclid(BigInt(a), BigInt(this.n)).gcd === 1n,
    );
  }
  value(a: number, b: number): number {
    return (this.operation === 'add' ? a + b : a * b) % this.n;
  }
  zeroDivisor(a: number, b: number): boolean {
    return (
      this.operation === 'multiply' &&
      a !== 0 &&
      b !== 0 &&
      this.value(a, b) === 0
    );
  }
  update(): void {
    this.a = 0;
    this.b = 0;
  }
  select(a: number, b: number): void {
    this.a = a;
    this.b = b;
  }
}
