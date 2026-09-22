import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { goldbachPairs, primeSieve } from '../../shared/math/goldbach';

@Component({
  selector: 'app-goldbach-pairs',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './goldbach-pairs.component.html',
  styleUrl: './goldbach-widgets.css',
})
export class GoldbachPairsComponent {
  readonly prime = primeSieve(100000);
  n = 100;
  draft: number | null = 100;
  error = '';
  pairs = goldbachPairs(this.n, this.prime);
  selected = 0;
  page = 0;
  get visiblePairs() {
    return this.pairs.slice(this.page * 40, (this.page + 1) * 40);
  }
  get selectedPair() {
    return this.pairs[this.selected];
  }
  setNumber(value: number | null): void {
    if (
      value === null ||
      !Number.isInteger(value) ||
      value < 4 ||
      value > 100000 ||
      value % 2
    ) {
      this.error = 'Introduce un número par entre 4 y 100 000.';
      return;
    }
    this.n = value;
    this.draft = value;
    this.error = '';
    this.pairs = goldbachPairs(value, this.prime);
    this.selected = 0;
    this.page = 0;
  }
  arc(pair: [number, number]): string {
    const left = 35 + (630 * pair[0]) / this.n;
    const right = 35 + (630 * pair[1]) / this.n;
    return `M ${left} 230 Q 350 ${230 - (right - left) * 0.6} ${right} 230`;
  }
}
