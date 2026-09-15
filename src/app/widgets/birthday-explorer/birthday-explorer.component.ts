import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { birthdayProbability, sampleBirthdays } from '../../shared/math/birthday';

@Component({
  selector: 'app-birthday-explorer', standalone: true, imports: [CommonModule, FormsModule],
  templateUrl: './birthday-explorer.component.html', styleUrl: './birthday-explorer.component.css'
})
export class BirthdayExplorerComponent implements OnDestroy {
  n = 23; birthdays: number[] = []; counts = new Map<number, number>();
  trials = 0; collisions = 0; running = false;
  private timer?: ReturnType<typeof setTimeout>;
  readonly ticks = [0, 0.25, 0.5, 0.75, 1];
  readonly xTicks = [0, 10, 23, 40, 60, 80, 100];
  readonly path = Array.from({ length: 101 }, (_, n) => `${n ? 'L' : 'M'}${this.x(n)},${this.y(birthdayProbability(n))}`).join(' ');
  constructor() { this.draw(); }
  get probability(): number { return birthdayProbability(this.n); }
  get fixedDateProbability(): number { return -Math.expm1(this.n * Math.log1p(-1 / 365)); }
  get repeatedDates(): number { return Array.from(this.counts.values()).filter(count => count > 1).length; }
  x(n: number): number { return 55 + 580 * n / 100; }
  y(p: number): number { return 280 - 240 * p; }
  percent(p: number): string { return (100 * p).toFixed(2) + ' %'; }
  date(day: number): string { return new Date(Date.UTC(2023, 0, day + 1)).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', timeZone: 'UTC' }); }
  draw(): void {
    this.birthdays = sampleBirthdays(this.n); this.counts = new Map();
    this.birthdays.forEach(day => this.counts.set(day, (this.counts.get(day) ?? 0) + 1));
  }
  reset(): void { this.stop(); this.trials = 0; this.collisions = 0; this.draw(); }
  preset(n: number): void { this.n = n; this.reset(); }
  run(): void {
    if (this.running) return;
    this.running = true;
    let remaining = 1000;
    const batch = (): void => {
      for (let i = 0; i < 25 && remaining > 0; i++, remaining--) {
        this.draw(); this.trials++; if (this.repeatedDates > 0) this.collisions++;
      }
      if (remaining > 0) this.timer = setTimeout(batch, 30); else { this.running = false; this.timer = undefined; }
    };
    this.timer = setTimeout(batch, 30);
  }
  stop(): void { if (this.timer !== undefined) clearTimeout(this.timer); this.timer = undefined; this.running = false; }
  ngOnDestroy(): void { this.stop(); }
}
