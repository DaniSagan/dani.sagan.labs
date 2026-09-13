import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { aliquotSequence, AliquotResult } from '../../shared/math/aliquot';
import { properDivisors } from '../../shared/math/perfect-numbers';

@Component({
  selector: 'app-aliquot-explorer', standalone: true, imports: [CommonModule, FormsModule],
  templateUrl: './aliquot-explorer.component.html', styleUrl: './aliquot-explorer.component.css'
})
export class AliquotExplorerComponent {
  input: number | null = 12; steps: number | null = 100; logarithmic = false;
  result: AliquotResult | null = null; error = ''; selected = 0; divisors: number[] = [];
  path = ''; points: { x: number; y: number; value: number; index: number }[] = [];
  readonly ticks = [0, 0.25, 0.5, 0.75, 1];
  get maximum(): number { return this.result ? Math.max(...this.result.values) : 1; }
  get period(): number { return this.result?.cycleStart !== null && this.result ? this.result.values.length - 1 - this.result.cycleStart : 0; }
  get message(): string {
    if (!this.result) return '';
    switch (this.result.status) {
      case 'zero': return 'La sucesión llega a 0. Aquí termina el recorrido.';
      case 'cycle': return `Ciclo detectado de período ${this.period}, desde el índice ${this.result.cycleStart}.`;
      case 'value': return 'Se ha superado el límite de valor 100000000. No se ha determinado el destino de la sucesión.';
      case 'steps': return 'Se ha alcanzado el límite de pasos. No se ha determinado el destino de la sucesión.';
    }
  }
  constructor() { this.calculate(); }
  example(n: number): void { this.input = n; this.calculate(); }
  calculate(): void {
    this.result = null; this.error = ''; this.points = []; this.divisors = []; this.path = '';
    try {
      if (this.input === null || this.steps === null) throw new Error('Completa el número inicial y el límite de pasos.');
      this.result = aliquotSequence(this.input, this.steps); this.select(0); this.plot();
    } catch (error) { this.error = (error as Error).message; }
  }
  select(index: number): void {
    this.selected = index;
    this.divisors = this.result && index < this.result.values.length - 1 ? properDivisors(this.result.values[index]) : [];
  }
  plot(): void {
    if (!this.result) return;
    const scale = (value: number): number => this.logarithmic ? Math.log10(1 + value) : value;
    this.points = this.result.values.map((value, index) => ({ value, index,
      x: 65 + 560 * index / Math.max(1, this.result!.values.length - 1), y: 250 - 210 * scale(value) / scale(this.maximum) }));
    this.path = this.points.map((p, i) => `${i ? 'L' : 'M'}${p.x},${p.y}`).join(' ');
  }
  tickLabel(fraction: number): string {
    return this.logarithmic ? (fraction * Math.log10(1 + this.maximum)).toFixed(2) : Math.round(fraction * this.maximum).toLocaleString('es-ES');
  }
}
