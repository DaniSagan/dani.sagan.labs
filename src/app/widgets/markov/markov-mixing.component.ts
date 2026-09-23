import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { markovHistory } from '../../shared/math/markov';
@Component({
  selector: 'app-markov-mixing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './markov-mixing.component.html',
  styleUrl: './markov-widgets.css',
})
export class MarkovMixingComponent {
  alpha = 0.15;
  beta = 0.25;
  initial = 1;
  t = 15;
  history: number[][] = [];
  curve = '';
  distanceCurve = '';
  constructor() {
    this.compute();
  }
  get pi(): number | null {
    return this.alpha + this.beta ? this.beta / (this.alpha + this.beta) : null;
  }
  get eigenvalue(): number {
    return 1 - this.alpha - this.beta;
  }
  get distance(): number | null {
    return this.pi === null
      ? null
      : Math.abs(this.history[this.t][0] - this.pi);
  }
  compute(): void {
    this.history = markovHistory(
      [this.initial, 1 - this.initial],
      [
        [1 - this.alpha, this.alpha],
        [this.beta, 1 - this.beta],
      ],
      80,
    );
    this.curve = this.history
      .map((v, n) => `${n ? 'L' : 'M'}${50 + n * 7},${220 - 190 * v[0]}`)
      .join(' ');
    this.distanceCurve =
      this.pi === null
        ? ''
        : this.history
            .map(
              (v, n) =>
                `${n ? 'L' : 'M'}${50 + n * 7},${220 - 190 * Math.abs(v[0] - this.pi!)}`,
            )
            .join(' ');
  }
  preset(a: number, b: number): void {
    this.alpha = a;
    this.beta = b;
    this.compute();
  }
}
