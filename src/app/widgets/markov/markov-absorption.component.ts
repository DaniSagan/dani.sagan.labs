import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  absorbingWalk,
  markovHistory,
  markovRandom,
  sampleTransition,
} from '../../shared/math/markov';
@Component({
  selector: 'app-markov-absorption',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './markov-absorption.component.html',
  styleUrl: './markov-widgets.css',
})
export class MarkovAbsorptionComponent {
  p = 0.5;
  initial = 3;
  t = 12;
  seed = 42;
  readonly states = [0, 1, 2, 3, 4, 5, 6];
  model = absorbingWalk(6, this.p);
  history: number[][] = [];
  curves: string[] = [];
  left = 0;
  right = 0;
  censored = 0;
  meanCappedTime = 0;
  constructor() {
    this.compute();
  }
  compute(): void {
    this.model = absorbingWalk(6, this.p);
    this.history = markovHistory(
      this.states.map((i) => +(i === Number(this.initial))),
      this.model.matrix,
      120,
    );
    this.curves = [0, 1, 2].map((k) =>
      this.history
        .map((row, t) => {
          const value =
            k === 0
              ? row[0]
              : k === 1
                ? row[6]
                : row.slice(1, 6).reduce((a, b) => a + b, 0);
          return `${t ? 'L' : 'M'}${50 + (t / 120) * 560},${220 - 190 * value}`;
        })
        .join(' '),
    );
    this.simulate();
  }
  simulate(): void {
    const random = markovRandom(this.seed);
    this.left = 0;
    this.right = 0;
    this.censored = 0;
    let total = 0;
    for (let run = 0; run < 2000; run++) {
      let state = Number(this.initial),
        time = 0;
      while (state > 0 && state < 6 && time < 1000) {
        state = sampleTransition(this.model.matrix[state], random);
        time++;
      }
      if (state === 0) this.left++;
      else if (state === 6) this.right++;
      else this.censored++;
      total += time;
    }
    this.meanCappedTime = total / 2000;
  }
}
