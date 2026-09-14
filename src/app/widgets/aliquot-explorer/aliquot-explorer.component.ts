import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AliquotResult } from '../../shared/math/aliquot';
import {
  aliquotDivisors,
  bigintDivisorData,
  bigintLog10,
  DivisorData,
  parseAliquotStart,
} from '../../shared/math/aliquot-bigint';

@Component({
  selector: 'app-aliquot-explorer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './aliquot-explorer.component.html',
  styleUrl: './aliquot-explorer.component.css',
})
export class AliquotExplorerComponent implements OnDestroy {
  input: string | number | null = '12';
  steps: number | null = 100;
  logarithmic = false;
  unlimited = false;
  result:
    | (Omit<AliquotResult, 'status'> & {
        status: AliquotResult['status'] | 'running' | 'stopped';
      })
    | null = null;
  error = '';
  selected = 0;
  divisors: readonly bigint[] = [];
  private calculation?: Generator<void, DivisorData>;
  private timer?: ReturnType<typeof setTimeout>;
  private seen = new Map<bigint, number>();
  private stepLimit: number | null = 100;
  get running(): boolean {
    return this.result?.status === 'running';
  }
  path = '';
  points: { x: number; y: number; value: bigint; index: number }[] = [];
  readonly ticks = [0, 0.25, 0.5, 0.75, 1];
  get maximum(): bigint {
    return this.result
      ? this.result.values.reduce(
          (max, value) => (value > max ? value : max),
          1n,
        )
      : 1n;
  }
  get period(): number {
    return this.result?.cycleStart !== null && this.result
      ? this.result.values.length - 1 - this.result.cycleStart
      : 0;
  }
  get message(): string {
    if (!this.result) return '';
    switch (this.result.status) {
      case 'running':
        return `Calculando paso a paso: ${this.result.values.length - 1} pasos completados${this.stepLimit === null ? ', sin límite de pasos' : ' de ' + this.stepLimit}.`;
      case 'stopped':
        return 'Cálculo detenido. No se ha determinado el destino de la sucesión.';
      case 'zero':
        return 'La sucesión llega a 0. Aquí termina el recorrido.';
      case 'cycle':
        return `Ciclo detectado de período ${this.period}, desde el índice ${this.result.cycleStart}.`;
      case 'steps':
        return 'Se ha alcanzado el límite de pasos. No se ha determinado el destino de la sucesión.';
    }
  }
  constructor() {
    this.calculate();
  }
  example(n: number): void {
    this.input = String(n);
    this.calculate();
  }
  calculate(): void {
    this.stop();
    this.result = null;
    this.error = '';
    this.points = [];
    this.divisors = [];
    this.path = '';
    try {
      const initial = parseAliquotStart(this.input);
      if (
        !this.unlimited &&
        (this.steps === null ||
          !Number.isSafeInteger(this.steps) ||
          this.steps < 1)
      )
        throw new Error(
          'Introduce un número entero positivo de pasos o selecciona «Sin límite».',
        );
      this.stepLimit = this.unlimited ? null : this.steps;
      this.result = { values: [initial], status: 'running', cycleStart: null };
      this.seen = new Map([[initial, 0]]);
      this.select(0);
      this.plot();
      this.schedule();
    } catch (error) {
      this.error = (error as Error).message;
    }
  }
  private schedule(): void {
    this.timer = setTimeout(() => this.advance(), 180);
  }
  private advance(): void {
    this.timer = undefined;
    const r = this.result;
    if (!r || !this.running) return;
    const follow = this.selected === r.values.length - 1;
    this.calculation ??= aliquotDivisors(r.values[r.values.length - 1]);
    let progress = this.calculation.next();
    for (let i = 0; i < 2000 && !progress.done; i++)
      progress = this.calculation.next();
    if (!progress.done) {
      this.timer = setTimeout(() => this.advance(), 0);
      return;
    }
    const next = progress.value.sum;
    this.calculation = undefined;
    r.values.push(next);
    const cycleStart = this.seen.get(next);
    if (next === 0n) r.status = 'zero';
    else if (cycleStart !== undefined) {
      r.status = 'cycle';
      r.cycleStart = cycleStart;
    } else if (this.stepLimit !== null && r.values.length - 1 >= this.stepLimit)
      r.status = 'steps';
    this.seen.set(next, r.values.length - 1);
    this.select(follow ? r.values.length - 1 : this.selected);
    this.plot();
    if (this.running) this.schedule();
  }
  stop(): void {
    this.calculation = undefined;
    if (this.timer !== undefined) clearTimeout(this.timer);
    this.timer = undefined;
    if (this.result?.status === 'running') this.result.status = 'stopped';
  }
  ngOnDestroy(): void {
    this.stop();
  }
  select(index: number): void {
    this.selected = index;
    this.divisors =
      this.result && index < this.result.values.length - 1
        ? bigintDivisorData(this.result.values[index]).divisors
        : [];
  }
  plot(): void {
    if (!this.result) return;
    const maximum = this.maximum;
    const logMaximum = bigintLog10(maximum + 1n);
    const scale = (value: bigint): number =>
      this.logarithmic
        ? bigintLog10(value + 1n) / logMaximum
        : Number((value * 1000000n) / maximum) / 1000000;
    this.points = this.result.values.map((value, index) => ({
      value,
      index,
      x: 65 + (560 * index) / Math.max(1, this.result!.values.length - 1),
      y: 250 - 210 * scale(value),
    }));
    this.path = this.points
      .map((p, i) => `${i ? 'L' : 'M'}${p.x},${p.y}`)
      .join(' ');
  }
  tickLabel(fraction: number): string {
    return this.logarithmic
      ? (fraction * bigintLog10(1n + this.maximum)).toFixed(2)
      : (
          (this.maximum * BigInt(Math.round(fraction * 1000000))) /
          1000000n
        ).toLocaleString('es-ES');
  }
}
