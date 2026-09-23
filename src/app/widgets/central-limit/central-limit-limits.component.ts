import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { seededRandom } from '../../shared/math/central-limit';

@Component({
  selector: 'app-central-limit-limits', standalone: true, imports: [CommonModule, FormsModule],
  styleUrl: './central-limit-widgets.css',
  templateUrl: './central-limit-limits.component.html'
})
export class CentralLimitLimitsComponent {
  model = 'independent';
  seed = 31415;
  rows: { n: number; lo: number; hi: number; median: number; width: number; reference: number }[] = [];
  constructor() { this.compute(); }
  x(value: number): number { return 350 + Math.max(-4, Math.min(4, value)) * 65; }
  compute(): void {
    const random = seededRandom(this.seed);
    this.rows = [1, 5, 20, 50, 200].map(n => {
      const means = Array.from({ length: 2000 }, () => {
        if (this.model === 'dependent') return 2 * random() - 1;
        let sum = 0;
        for (let i = 0; i < n; i++) sum += this.model === 'cauchy' ? Math.tan(Math.PI * (random() - 0.5)) : 2 * random() - 1;
        return sum / n;
      }).sort((a, b) => a - b);
      return { n, lo: means[200], hi: means[1800], median: means[1000], width: means[1800] - means[200],
        reference: this.model === 'independent' ? 2 * 1.2815515655 / Math.sqrt(3 * n) : this.model === 'dependent' ? 1.6 : 2 * Math.tan(0.4 * Math.PI) };
    });
  }
}
