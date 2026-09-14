import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { binomialProbabilities, pascalRows } from './pascal.math';

@Component({
  selector: 'app-pascal-probability', standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pascal-probability.component.html',
  styleUrls: ['./pascal-widgets.css']
})
export class PascalProbabilityComponent {
  n = 4;
  percent = 50;
  k = 2;
  readonly ticks = [0, 25, 50, 75, 100];
  get coefficients() { return pascalRows(this.n)[this.n]; }
  get probabilities() { return binomialProbabilities(this.n, this.percent / 100); }
  get bars() {
    const width = 500 / (this.n + 1);
    return this.probabilities.map((probability, k) => ({ k, probability, x: 55 + k * width, width: width - 3, y: 225 - probability * 200, height: probability * 200 }));
  }
  update() { this.k = Math.min(this.k, this.n); }
}
