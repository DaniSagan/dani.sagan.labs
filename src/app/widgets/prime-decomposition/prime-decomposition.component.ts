import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FactorizationResult, parseInteger } from './factorization-engine';

@Component({
  selector: 'app-prime-decomposition',
  templateUrl: './prime-decomposition.component.html',
  styleUrls: ['./prime-decomposition.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class PrimeDecompositionComponent implements OnDestroy {
  value = '360';
  seconds: number | null = 15;
  requireProof = false;
  working = false;
  stopped = false;
  error = '';
  result: FactorizationResult | null = null;
  private worker?: Worker;
  readonly examples = [
    { label: 'Clásico · 360', value: '360' },
    { label: 'Más allá de 2⁵³', value: '9007199254740993' },
    { label: 'Semiprimo · 19 cifras', value: '1000000016000000063' },
    { label: '2¹²⁷ − 1', value: '170141183460469231731687303715884105727' },
  ];
  get probable(): boolean { return !!this.result?.factors.some(f => f.certainty === 'probable'); }
  get digits(): number { return this.result?.input.replace('-', '').length ?? 0; }
  get displayInput(): string {
    const input = this.result?.input ?? '';
    return input.length > 80 ? input.slice(0, 32) + '…' + input.slice(-24) : input;
  }
  get heading(): string {
    if (this.error) return 'Cálculo interrumpido';
    if (this.working) return 'Buscando factores';
    if (this.stopped) return 'Búsqueda detenida';
    if (this.result?.status === 'partial') return 'Factorización parcial';
    return this.probable ? 'Descomposición en primos probables' : 'Factorización completa';
  }
  example(value: string): void { this.value = value; this.calculate(); }
  calculate(): void {
    this.stop(); this.result = null; this.error = ''; this.stopped = false;
    try {
      const input = parseInteger(this.value).toString();
      if (this.seconds !== null && ![5, 15, 60, 600].includes(this.seconds)) throw new Error('Selecciona un tiempo de búsqueda válido.');
      if (typeof Worker === 'undefined') throw new Error('Este navegador no permite el cálculo en segundo plano. Usa un navegador moderno con Web Workers.');
      this.result = { input, proofRequired: this.requireProof, factors: [], pending: input === '1' || input === '-1' ? [] : [{ base: input.replace('-', ''), exponent: 1 }], status: 'running', stage: 'Preparando búsqueda', elapsedMs: 0, operations: 0, curves: 0 };
      const worker = new Worker(new URL('./factorization.worker', import.meta.url), { type: 'module' });
      this.worker = worker; this.working = true;
      worker.onmessage = ({ data }: MessageEvent<{ kind: string; result?: FactorizationResult; message?: string }>) => {
        if (this.worker !== worker) return;
        if (data.result) this.result = data.result;
        if (data.kind === 'error') {
          this.error = data.message ?? 'No se pudo completar el cálculo.';
          if (this.result) this.result = { ...this.result, status: 'partial' };
        }
        if (data.kind !== 'progress') { worker.terminate(); this.worker = undefined; this.working = false; }
      };
      worker.onerror = event => {
        if (this.worker !== worker) return;
        event.preventDefault(); this.error = 'No se pudo ejecutar el motor de cálculo. Prueba de nuevo o reduce la entrada.'; this.stop();
      };
      worker.postMessage({ input, timeMs: this.seconds === null ? null : this.seconds * 1000, requireProof: this.requireProof });
    } catch (error) { this.stop(); this.error = error instanceof Error ? error.message : String(error); }
  }
  stop(): void {
    this.worker?.terminate(); this.worker = undefined;
    if (this.working) { this.stopped = true; if (this.result) this.result = { ...this.result, status: 'partial' }; }
    this.working = false;
  }
  ngOnDestroy(): void { this.stop(); }
}
