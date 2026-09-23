import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  moments,
  normalCdf,
  observation,
  Population,
  seededRandom,
} from '../../shared/math/central-limit';

@Component({
  selector: 'app-central-limit-lab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './central-limit-lab.component.html',
  styleUrl: './central-limit-widgets.css',
})
export class CentralLimitLabComponent implements OnDestroy {
  population: Population = 'exponential';
  n = 10;
  seed = 2026;
  standardized = true;
  values: number[] = [];
  latest: number[] = [];
  bars: { x: number; y: number; height: number; label: string }[] = [];
  normalPath = '';
  empiricalPath = '';
  cdfPath = '';
  ticks: { x: number; label: string }[] = [];
  distance = 0;
  outside = 0;
  maxDensity = 1;
  mean = 0;
  sd = 0;
  running = false;
  private timer?: ReturnType<typeof setInterval>;
  private random = seededRandom(this.seed);
  readonly populations = [
    { value: 'uniform', label: 'Uniforme U(0, 1)' },
    { value: 'exponential', label: 'Exponencial (media 1)' },
    { value: 'bernoulli', label: 'Bernoulli (p = 0,05)' },
    { value: 'bimodal', label: 'Dos grupos: −2 y +2' },
  ];
  constructor() {
    this.reset();
  }
  get theory() {
    return moments(this.population);
  }
  get standardError() {
    return Math.sqrt(this.theory.variance / this.n);
  }
  get latestText() {
    return (
      this.latest
        .slice(0, 8)
        .map((x) => x.toFixed(2))
        .join(' · ') + (this.n > 8 ? ' · …' : '')
    );
  }
  reset(): void {
    this.pause();
    this.random = seededRandom(this.seed);
    this.values = [];
    this.add(1000);
  }
  newSeed(): void {
    this.seed++;
    this.reset();
  }
  add(count = 500): void {
    const amount = Math.min(count, 10000 - this.values.length);
    for (let r = 0; r < amount; r++) {
      const sample = Array.from({ length: this.n }, () =>
        observation(this.population, this.random),
      );
      this.values.push(sample.reduce((s, v) => s + v, 0) / this.n);
      this.latest = sample;
    }
    this.draw();
    if (this.values.length >= 10000) this.pause();
  }
  toggle(): void {
    if (this.running) {
      this.pause();
      return;
    }
    if (this.values.length >= 10000) return;
    this.running = true;
    this.timer = setInterval(() => this.add(250), 180);
  }
  pause(): void {
    clearInterval(this.timer);
    this.running = false;
  }
  ngOnDestroy(): void {
    this.pause();
  }
  draw(): void {
    const mu = this.theory.mean,
      se = this.standardError;
    const data = this.values
      .map((v) => (this.standardized ? (v - mu) / se : v))
      .sort((a, b) => a - b);
    const center = this.standardized ? 0 : mu,
      scale = this.standardized ? 1 : se;
    const low = center - 4 * scale,
      width = (8 * scale) / 40;
    const counts = Array(40).fill(0) as number[];
    this.outside = 0;
    data.forEach((v) => {
      const i = Math.floor((v - low) / width);
      if (i >= 0 && i < 40) counts[i]++;
      else this.outside++;
    });
    this.maxDensity =
      Math.max(0.42 / scale, ...counts.map((c) => c / data.length / width)) *
      1.1;
    this.bars = counts.map((c, i) => {
      const height = (190 * c) / data.length / width / this.maxDensity;
      return {
        x: 50 + i * 14,
        y: 220 - height,
        height,
        label: `${(low + i * width).toFixed(3)} a ${(low + (i + 1) * width).toFixed(3)}: ${c} medias (${((100 * c) / data.length).toFixed(1)} %)`,
      };
    });
    this.normalPath = '';
    this.cdfPath = '';
    for (let i = 0; i <= 160; i++) {
      const z = -4 + i / 20,
        x = 50 + i * 3.5;
      this.normalPath += `${i ? 'L' : 'M'}${x},${220 - (190 * Math.exp((-z * z) / 2)) / Math.sqrt(2 * Math.PI) / scale / this.maxDensity} `;
      this.cdfPath += `${i ? 'L' : 'M'}${x},${220 - 190 * normalCdf(z)} `;
    }
    const cdf = (v: number) => normalCdf((v - center) / scale);
    this.distance = data.reduce(
      (d, v, i) =>
        Math.max(
          d,
          Math.abs(cdf(v) - i / data.length),
          Math.abs(cdf(v) - (i + 1) / data.length),
        ),
      0,
    );
    const below = data.filter((v) => v < low).length;
    this.empiricalPath = `M50,${220 - (190 * below) / data.length}`;
    data.forEach((v, i) => {
      if (v >= low && v <= low + 8 * scale)
        this.empiricalPath += ` H${50 + ((v - low) / (8 * scale)) * 560} V${220 - (190 * (i + 1)) / data.length}`;
    });
    this.empiricalPath += ' H610';
    this.ticks = [-4, -2, 0, 2, 4].map((z) => ({
      x: 330 + z * 70,
      label: (center + z * scale).toFixed(this.standardized ? 0 : 2),
    }));
    this.mean = this.values.reduce((a, b) => a + b, 0) / this.values.length;
    this.sd = Math.sqrt(
      this.values.reduce((a, b) => a + (b - this.mean) ** 2, 0) /
        this.values.length,
    );
  }
}
