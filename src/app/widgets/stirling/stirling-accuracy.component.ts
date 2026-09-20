import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { factorialScientific, logFactorial, STIRLING_ERROR_FLOOR, stirlingLogs, stirlingRelativeErrors } from '../../shared/math/stirling';

@Component({
  selector: 'app-stirling-accuracy', standalone: true, imports: [FormsModule],
  templateUrl: './stirling-accuracy.component.html', styleUrl: './stirling-widgets.css'
})
export class StirlingAccuracyComponent {
  n = 10;
  inputN: number | null = 10;
  exponent = 1;
  method = 0;
  error = '';
  readonly methods = [
    { name: 'Stirling', formula: 'A₀ = √(2πn) (n/e)ⁿ', color: '#efcc85' },
    { name: 'Una corrección', formula: 'A₁ = A₀ exp(1/(12n))', color: '#94e4cd' },
    { name: 'Dos correcciones', formula: 'A₂ = A₀ exp(1/(12n) − 1/(360n³))', color: '#c9b6f4' },
  ];
  readonly presets = [1, 10, 100, 1000];
  readonly ticks = [{ v: 1, label: '1' }, { v: 1e-3, label: '10⁻³' }, { v: 1e-6, label: '10⁻⁶' }, { v: 1e-9, label: '10⁻⁹' }];
  readonly paths: string[];
  constructor() {
    const samples = [...new Set(Array.from({ length: 181 }, (_, i) => Math.round(10 ** (i / 60))))];
    this.paths = this.methods.map((_, m) => samples.map((n, i) => `${i ? 'L' : 'M'}${this.x(n)},${this.y(Math.abs(stirlingRelativeErrors(n)[m]))}`).join(' '));
  }
  get reference() { return factorialScientific(logFactorial(this.n)); }
  get approximation() { return factorialScientific(stirlingLogs(this.n)[this.method]); }
  get relativeError(): number { return stirlingRelativeErrors(this.n)[this.method]; }
  get ratio(): string { return Math.exp(stirlingLogs(this.n)[this.method] - logFactorial(this.n)).toFixed(10); }
  get direction(): string {
    return Math.abs(this.relativeError) < STIRLING_ERROR_FLOOR ? 'Diferencia no resuelta con esta precisión' : this.relativeError < 0 ? 'Aproximación por debajo de n!' : 'Aproximación por encima de n!';
  }
  x(n: number): number { return 66 + Math.log10(n) * 188; }
  y(error: number): number { return 35 - Math.log10(Math.max(STIRLING_ERROR_FLOOR, error)) * 21; }
  formatError(error: number): string { return Math.abs(error) < STIRLING_ERROR_FLOOR ? '< ~10⁻¹¹' : Math.abs(error).toExponential(3); }
  selectN(n: number): void {
    if (!Number.isInteger(n) || n < 1 || n > 1000) return;
    this.n = this.inputN = n; this.exponent = Math.log10(n); this.error = '';
  }
  fromSlider(value: number): void { this.selectN(Math.round(10 ** Number(value))); }
  fromInput(): void {
    if (this.inputN === null || !Number.isInteger(this.inputN) || this.inputN < 1 || this.inputN > 1000) {
      this.error = 'Introduce un entero entre 1 y 1000. Se conserva el último cálculo válido.'; return;
    }
    this.selectN(this.inputN);
  }
}
