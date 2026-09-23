import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { binomialMasses, normalCdf } from '../../shared/math/central-limit';

@Component({
  selector: 'app-central-limit-binomial',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrl: './central-limit-widgets.css',
  templateUrl: './central-limit-binomial.component.html',
})
export class CentralLimitBinomialComponent {
  n = 40;
  p = 0.3;
  k = 12;
  corrected = true;
  exact = 0;
  approximation = 0;
  error = 0;
  exactPath = '';
  normalPath = '';
  constructor() {
    this.update();
  }
  get sigma(): number {
    return Math.sqrt(this.n * this.p * (1 - this.p));
  }
  update(): void {
    this.k = Math.min(this.k, this.n);
    const masses = binomialMasses(this.n, this.p);
    let cumulative = 0;
    this.exactPath = '';
    this.normalPath = '';
    masses.forEach((mass, i) => {
      cumulative += mass;
      const x = 50 + (560 * i) / this.n;
      this.exactPath += i
        ? ` H${x} V${220 - 190 * cumulative}`
        : `M${x},${220 - 190 * cumulative}`;
      const probability = normalCdf(
        (i + (this.corrected ? 0.5 : 0) - this.n * this.p) / this.sigma,
      );
      this.normalPath += `${i ? 'L' : 'M'}${x},${220 - 190 * probability} `;
      if (i === this.k) {
        this.exact = Math.min(1, cumulative);
        this.approximation = probability;
      }
    });
    this.error = Math.abs(this.exact - this.approximation);
  }
}
