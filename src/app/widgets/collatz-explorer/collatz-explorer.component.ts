import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CollatzRun, parseCollatzStart } from '../../shared/math/collatz';
import { bigintLog10 } from '../../shared/math/aliquot-bigint';

interface CompletedRun {
  start: bigint;
  steps: number;
  maximum: bigint;
}
@Component({
  selector: 'app-collatz-explorer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './collatz-explorer.component.html',
  styleUrl: './collatz-explorer.component.css',
})
export class CollatzExplorerComponent implements OnDestroy {
  input = '27';
  limit: number | null = 10000;
  logarithmic = true;
  unlimited = false;
  run: CollatzRun | null = null;
  error = '';
  selected = 0;
  path = '';
  recordPath = '';
  history: CompletedRun[] = [];
  heightRecord: CompletedRun | null = null;
  durationRecord: CompletedRun | null = null;
  readonly ticks = [0, 0.25, 0.5, 0.75, 1];
  private timer?: ReturnType<typeof setTimeout>;
  constructor() {
    this.calculate();
  }
  get running(): boolean {
    return this.run?.status === 'running';
  }
  get message(): string {
    switch (this.run?.status) {
      case 'running':
        return `Calculando${this.run.limit === null ? ' sin límite de pasos' : ''}… Las estadísticas son provisionales.`;
      case 'one':
        return 'Se ha alcanzado 1. Recorrido completo.';
      case 'limit':
        return 'Máximo de pasos alcanzado. No se ha determinado el destino de este inicio.';
      case 'stopped':
        return 'Cálculo detenido. El recorrido y su máximo son parciales.';
      case 'cycle':
        return 'Se ha detectado una repetición antes de llegar a 1.';
      default:
        return '';
    }
  }
  example(n: number): void {
    this.input = String(n);
    this.calculate();
  }
  calculate(): void {
    this.stop();
    this.run = null;
    this.error = '';
    this.selected = 0;
    this.path = '';
    this.recordPath = '';
    try {
      const start = parseCollatzStart(this.input);
      this.run = new CollatzRun(
        start,
        this.unlimited ? null : (this.limit ?? 0),
      );
      this.plot();
      if (this.running) this.schedule();
      else this.remember();
    } catch (error) {
      this.error = (error as Error).message;
    }
  }
  private schedule(): void {
    this.timer = setTimeout(() => this.advance(), 16);
  }
  private advance(): void {
    this.timer = undefined;
    if (!this.run || !this.running) return;
    const follow = this.selected === this.run.steps;
    const deadline = performance.now() + 8;
    for (let i = 0; i < 256 && this.running; i++) {
      this.run.advance();
      if (performance.now() >= deadline) break;
    }
    if (follow) this.selected = this.run.steps;
    this.plot();
    if (this.running) this.schedule();
    else this.remember();
  }
  stop(): void {
    if (this.timer !== undefined) clearTimeout(this.timer);
    this.timer = undefined;
    if (this.run?.status === 'running') this.run.status = 'stopped';
  }
  ngOnDestroy(): void {
    this.stop();
  }
  private remember(): void {
    const r = this.run;
    if (!r || r.status !== 'one') return;
    const entry = { start: r.start, steps: r.steps, maximum: r.maximum };
    this.history = [
      ...this.history.filter((h) => h.start !== r.start),
      entry,
    ].slice(-12);
    if (!this.heightRecord || entry.maximum > this.heightRecord.maximum)
      this.heightRecord = entry;
    if (!this.durationRecord || entry.steps > this.durationRecord.steps)
      this.durationRecord = entry;
  }
  clearHistory(): void {
    this.history = [];
    this.heightRecord = null;
    this.durationRecord = null;
  }
  x(index: number): number {
    return 75 + (550 * index) / Math.max(1, this.run?.steps ?? 0);
  }
  y(value: bigint): number {
    const maximum = this.run?.maximum ?? 1n;
    const fraction = this.logarithmic
      ? bigintLog10(value) / Math.max(1, bigintLog10(maximum))
      : Number((value * 1000000n) / maximum) / 1000000;
    return 250 - 210 * fraction;
  }
  plot(): void {
    const r = this.run;
    if (!r) return;
    // Retain the minimum and maximum of each bucket, including narrow peaks.
    const indices = new Set<number>([0, r.steps]);
    const width = Math.max(1, Math.ceil(r.values.length / 600));
    for (let first = 0; first < r.values.length; first += width) {
      let min = first,
        max = first;
      for (
        let i = first + 1;
        i < Math.min(first + width, r.values.length);
        i++
      ) {
        if (r.values[i] < r.values[min]) min = i;
        if (r.values[i] > r.values[max]) max = i;
      }
      indices.add(min);
      indices.add(max);
    }
    this.path = [...indices]
      .sort((a, b) => a - b)
      .map((i, j) => `${j ? 'L' : 'M'}${this.x(i)},${this.y(r.values[i])}`)
      .join(' ');
    this.recordPath =
      r.records
        .map(
          (record, i) =>
            `${i ? 'H' + this.x(record.step) + 'V' + this.y(record.value) : 'M' + this.x(0) + ',' + this.y(record.value)}`,
        )
        .join(' ') + ` H${this.x(r.steps)}`;
  }
  tickLabel(fraction: number): string {
    return this.logarithmic
      ? (fraction * Math.max(1, bigintLog10(this.run?.maximum ?? 1n))).toFixed(
          1,
        )
      : this.short(
          ((this.run?.maximum ?? 1n) * BigInt(Math.round(fraction * 1000))) /
            1000n,
        );
  }
  short(n: bigint): string {
    const s = n.toString();
    return s.length > 10 ? `${s[0]},${s.slice(1, 4)}e${s.length - 1}` : s;
  }
  operation(n: bigint): string {
    return n % 2n === 0n ? 'n / 2 (par)' : '3n + 1 (impar)';
  }
  historyWidth(steps: number): number {
    return (420 * steps) / Math.max(1, ...this.history.map((h) => h.steps));
  }
}
