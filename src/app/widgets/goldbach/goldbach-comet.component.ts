import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { goldbachPairs, primeSieve } from '../../shared/math/goldbach';

@Component({
  selector: 'app-goldbach-comet',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './goldbach-comet.component.html',
  styleUrl: './goldbach-widgets.css',
})
export class GoldbachCometComponent {
  readonly prime = primeSieve(5000);
  readonly data = Array.from({ length: 2499 }, (_, i) => {
    const n = 4 + 2 * i;
    return { n, count: goldbachPairs(n, this.prime).length };
  });
  limit = 1000;
  residue = -1;
  selected = 100;
  showModel = true;
  maxY = 100;
  readonly colors = ['#74d6e8', '#ffcb7c', '#c5a4ff'];
  constructor() {
    this.changeLimit();
  }
  get visible() {
    return this.data.filter(
      (d) =>
        d.n <= this.limit && (this.residue < 0 || d.n % 6 === this.residue),
    );
  }
  get current() {
    return this.data[(this.selected - 4) / 2];
  }
  get witness() {
    return goldbachPairs(this.selected, this.prime)[0];
  }
  model(n: number): number {
    return n / (2 * Math.log(n) ** 2);
  }
  x(n: number): number {
    return 55 + ((n - 4) / (this.limit - 4)) * 610;
  }
  y(count: number, max: number): number {
    return 305 - (count / max) * 270;
  }
  get modelPath(): string {
    const max = this.maxY;
    return Array.from({ length: 101 }, (_, i) => {
      const n = 4 + ((this.limit - 4) * i) / 100;
      return `${i ? 'L' : 'M'} ${this.x(n)} ${this.y(this.model(n), max)}`;
    }).join(' ');
  }
  changeLimit(): void {
    this.selected = Math.min(this.selected, this.limit);
    this.maxY =
      Math.ceil(
        Math.max(
          ...this.data.filter((d) => d.n <= this.limit).map((d) => d.count),
          this.model(this.limit),
        ) / 10,
      ) * 10;
  }
  inspect(event: PointerEvent): void {
    const svg = event.currentTarget as SVGSVGElement;
    const matrix = svg.getScreenCTM();
    if (!matrix) return;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(
      matrix.inverse(),
    );
    const n = Math.max(
      4,
      Math.min(
        this.limit,
        Math.round((4 + ((point.x - 55) / 610) * (this.limit - 4)) / 2) * 2,
      ),
    );
    const available = this.visible;
    this.selected = available.reduce(
      (best, d) => (Math.abs(d.n - n) < Math.abs(best - n) ? d.n : best),
      available[0].n,
    );
  }
}
