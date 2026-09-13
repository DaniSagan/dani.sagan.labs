import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ALIQUOT_VALUE_LIMIT, AliquotResult } from '../../shared/math/aliquot';
import { properDivisors } from '../../shared/math/perfect-numbers';

@Component({
  selector: 'app-aliquot-explorer', standalone: true, imports: [CommonModule, FormsModule],
  templateUrl: './aliquot-explorer.component.html', styleUrl: './aliquot-explorer.component.css'
})
export class AliquotExplorerComponent implements OnDestroy {
  input: number | null = 12; steps: number | null = 100; logarithmic = false;
  unlimited = false;
  result: (Omit<AliquotResult, 'status'> & { status: AliquotResult['status'] | 'running' | 'stopped' }) | null = null;
  error = ''; selected = 0; divisors: number[] = [];
  private timer?: ReturnType<typeof setTimeout>;
  private seen = new Map<number, number>();
  private stepLimit: number | null = 100;
  get running(): boolean { return this.result?.status === 'running'; }
  path = ''; points: { x: number; y: number; value: number; index: number }[] = [];
  readonly ticks = [0, 0.25, 0.5, 0.75, 1];
  get maximum(): number { return this.result ? this.result.values.reduce((max, value) => Math.max(max, value), 1) : 1; }
  get period(): number { return this.result?.cycleStart !== null && this.result ? this.result.values.length - 1 - this.result.cycleStart : 0; }
  get message(): string {
    if (!this.result) return '';
    switch (this.result.status) {
      case 'running': return `Calculando paso a paso: ${this.result.values.length - 1} pasos completados${this.stepLimit === null ? ', sin límite de pasos' : ' de ' + this.stepLimit}.`;
      case 'stopped': return 'Cálculo detenido. No se ha determinado el destino de la sucesión.';
      case 'zero': return 'La sucesión llega a 0. Aquí termina el recorrido.';
      case 'cycle': return `Ciclo detectado de período ${this.period}, desde el índice ${this.result.cycleStart}.`;
      case 'value': return 'Se ha superado el límite de valor 100000000. No se ha determinado el destino de la sucesión.';
      case 'steps': return 'Se ha alcanzado el límite de pasos. No se ha determinado el destino de la sucesión.';
    }
  }
  constructor() { this.calculate(); }
  example(n: number): void { this.input = n; this.calculate(); }
  calculate(): void {
    this.stop();
    this.result = null; this.error = ''; this.points = []; this.divisors = []; this.path = '';
    try {
      if (this.input === null || !Number.isInteger(this.input) || this.input < 1 || this.input > ALIQUOT_VALUE_LIMIT) throw new Error('Introduce un entero entre 1 y 100000000.');
      if (!this.unlimited && (this.steps === null || !Number.isSafeInteger(this.steps) || this.steps < 1)) throw new Error('Introduce un número entero positivo de pasos o selecciona «Sin límite».');
      this.stepLimit = this.unlimited ? null : this.steps;
      this.result = { values: [this.input], status: 'running', cycleStart: null };
      this.seen = new Map([[this.input, 0]]);
      this.select(0); this.plot(); this.schedule();
    } catch (error) { this.error = (error as Error).message; }
  }
  private schedule(): void { this.timer = setTimeout(() => this.advance(), 180); }
  private advance(): void {
    this.timer = undefined;
    const r = this.result;
    if (!r || !this.running) return;
    const follow = this.selected === r.values.length - 1;
    const next = properDivisors(r.values[r.values.length - 1]).reduce((a, b) => a + b, 0);
    r.values.push(next);
    const cycleStart = this.seen.get(next);
    if (next === 0) r.status = 'zero';
    else if (cycleStart !== undefined) { r.status = 'cycle'; r.cycleStart = cycleStart; }
    else if (next > ALIQUOT_VALUE_LIMIT) r.status = 'value';
    else if (this.stepLimit !== null && r.values.length - 1 >= this.stepLimit) r.status = 'steps';
    this.seen.set(next, r.values.length - 1);
    this.select(follow ? r.values.length - 1 : this.selected);
    this.plot();
    if (this.running) this.schedule();
  }
  stop(): void {
    if (this.timer !== undefined) clearTimeout(this.timer);
    this.timer = undefined;
    if (this.result?.status === 'running') this.result.status = 'stopped';
  }
  ngOnDestroy(): void { this.stop(); }
  select(index: number): void {
    this.selected = index;
    this.divisors = this.result && index < this.result.values.length - 1 ? properDivisors(this.result.values[index]) : [];
  }
  plot(): void {
    if (!this.result) return;
    const scale = (value: number): number => this.logarithmic ? Math.log10(1 + value) : value;
    const maximum = this.maximum;
    this.points = this.result.values.map((value, index) => ({ value, index,
      x: 65 + 560 * index / Math.max(1, this.result!.values.length - 1), y: 250 - 210 * scale(value) / scale(maximum) }));
    this.path = this.points.map((p, i) => `${i ? 'L' : 'M'}${p.x},${p.y}`).join(' ');
  }
  tickLabel(fraction: number): string {
    return this.logarithmic ? (fraction * Math.log10(1 + this.maximum)).toFixed(2) : Math.round(fraction * this.maximum).toLocaleString('es-ES');
  }
}
