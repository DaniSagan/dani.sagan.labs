import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  chainPeriod,
  isIrreducible,
  MARKOV_PRESETS,
  markovHistory,
  markovRandom,
  normalizeWeights,
  sampleTransition,
  stationaryDistribution,
} from '../../shared/math/markov';

@Component({
  selector: 'app-markov-lab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './markov-lab.component.html',
  styleUrl: './markov-widgets.css',
})
export class MarkovLabComponent implements OnDestroy {
  matrix = MARKOV_PRESETS.mixing.map((row) => [...row]);
  weights: (number | null)[][] = this.matrix.map((row) =>
    row.map((v) => v * 10),
  );
  initial = 0;
  t = 0;
  seed = 2026;
  running = false;
  error = '';
  dirty = false;
  history: number[][] = [];
  empirical: number[][] = [];
  path: number[] = [];
  curves: string[] = [];
  stationary: number[] | null = null;
  irreducible = true;
  period: number | null = 1;
  readonly names = ['A', 'B', 'C'];
  readonly palette = ['#8bdcc5', '#c4b3ff', '#f5c57d'];
  readonly nodes = [
    { x: 320, y: 70 },
    { x: 125, y: 310 },
    { x: 515, y: 310 },
  ];
  edges: {
    from: number;
    to: number;
    path: string;
    x: number;
    y: number;
    probability: number;
  }[] = [];
  private timer?: ReturnType<typeof setInterval>;
  constructor() {
    this.reset();
  }
  get current() {
    return this.history[this.t];
  }
  reset(): void {
    this.pause();
    this.t = 0;
    this.stationary = stationaryDistribution(this.matrix);
    this.irreducible = isIrreducible(this.matrix);
    this.period = chainPeriod(this.matrix);
    this.history = markovHistory(
      this.names.map((_, i) => +(i === Number(this.initial))),
      this.matrix,
      60,
    );
    const random = markovRandom(this.seed),
      states = Array(2000).fill(Number(this.initial));
    this.empirical = [];
    this.path = [Number(this.initial)];
    for (let t = 0; t <= 60; t++) {
      const counts = [0, 0, 0];
      states.forEach((s) => counts[s]++);
      this.empirical.push(counts.map((v) => v / states.length));
      if (t < 60) {
        for (let i = 0; i < states.length; i++)
          states[i] = sampleTransition(this.matrix[states[i]], random);
        this.path.push(states[0]);
      }
    }
    this.curves = this.names.map((_, i) =>
      this.history
        .map(
          (row, t) =>
            `${t ? 'L' : 'M'}${50 + (t / 60) * 560},${220 - row[i] * 190}`,
        )
        .join(' '),
    );
    this.edges = [];
    this.matrix.forEach((row, i) =>
      row.forEach((probability, j) => {
        if (!probability) return;
        const a = this.nodes[i],
          b = this.nodes[j];
        if (i === j) {
          this.edges.push({
            from: i,
            to: j,
            probability,
            path: `M${a.x - 20},${a.y - 22} C${a.x - 75},${a.y - 95} ${a.x + 75},${a.y - 95} ${a.x + 20},${a.y - 22}`,
            x: a.x,
            y: a.y - 65,
          });
          return;
        }
        const dx = b.x - a.x,
          dy = b.y - a.y,
          length = Math.hypot(dx, dy),
          ux = dx / length,
          uy = dy / length;
        const mx = (a.x + b.x) / 2 - uy * 35,
          my = (a.y + b.y) / 2 + ux * 35;
        this.edges.push({
          from: i,
          to: j,
          probability,
          path: `M${a.x + ux * 32},${a.y + uy * 32} Q${mx},${my} ${b.x - ux * 38},${b.y - uy * 38}`,
          x: (a.x + b.x) / 2 - uy * 25,
          y: (a.y + b.y) / 2 + ux * 25,
        });
      }),
    );
  }
  apply(): void {
    try {
      if (this.weights.some((row) => row.some((v) => v === null)))
        throw new Error('Completa todos los pesos antes de aplicar.');
      this.matrix = normalizeWeights(this.weights as number[][]);
      this.error = '';
      this.dirty = false;
      this.reset();
    } catch (error) {
      this.error =
        (error as Error).message + ' Se conserva la matriz anterior.';
    }
  }
  preset(kind: keyof typeof MARKOV_PRESETS): void {
    this.matrix = MARKOV_PRESETS[kind].map((row) => [...row]);
    this.weights = this.matrix.map((row) => row.map((v) => v * 100));
    this.error = '';
    this.dirty = false;
    this.reset();
  }
  next(): void {
    this.t = Math.min(60, this.t + 1);
    if (this.t === 60) this.pause();
  }
  toggle(): void {
    if (this.running) {
      this.pause();
      return;
    }
    if (this.t === 60) this.t = 0;
    this.running = true;
    this.timer = setInterval(() => this.next(), 400);
  }
  pause(): void {
    clearInterval(this.timer);
    this.running = false;
  }
  ngOnDestroy(): void {
    this.pause();
  }
}
