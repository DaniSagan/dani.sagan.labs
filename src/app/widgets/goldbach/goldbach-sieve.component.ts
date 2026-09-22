import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { excludedBy, primeSieve } from '../../shared/math/goldbach';

@Component({
  selector: 'app-goldbach-sieve',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './goldbach-sieve.component.html',
  styleUrl: './goldbach-widgets.css',
})
export class GoldbachSieveComponent {
  n = 100;
  readonly divisors = [2, 3, 5, 7, 11, 13];
  active = [2];
  reveal = false;
  readonly prime = primeSieve(200);
  toggle(d: number): void {
    this.active = this.active.includes(d)
      ? this.active.filter((x) => x !== d)
      : [...this.active, d].sort((a, b) => a - b);
  }
  get candidates() {
    return Array.from({ length: this.n / 2 - 1 }, (_, i) => {
      const p = i + 2;
      return {
        p,
        q: this.n - p,
        divisor: excludedBy(p, this.n, this.active),
        valid: !!(this.prime[p] && this.prime[this.n - p]),
      };
    });
  }
  get survivors() {
    return this.candidates.filter((c) => !c.divisor).length;
  }
}
