import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ComplexValue,
  formatComplex,
  riemannZeta,
} from '../../shared/math/riemann-zeta';

@Component({
  selector: 'app-zeta-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrl: '../zeta-critical-strip/zeta-widgets.css',
  template: ` <section class="widget" aria-labelledby="zeta-calculator-title">
    <h3 id="zeta-calculator-title">Calculadora de ζ(s)</h3>
    <p>Escribe s = σ + it. Puedes explorar ambos semiplanos y el eje real.</p>
    <form (ngSubmit)="calculate()" class="controls">
      <label
        >Parte real σ
        <input name="real" type="number" step="any" required [(ngModel)]="re"
      /></label>
      <label
        >Parte imaginaria t
        <input
          name="imaginary"
          type="number"
          step="any"
          required
          [(ngModel)]="im"
      /></label>
      <button type="submit">Calcular ζ(s)</button>
    </form>
    <div class="presets" aria-label="Ejemplos">
      <button type="button" (click)="example(2, 0)">ζ(2)</button>
      <button type="button" (click)="example(-1, 0)">ζ(−1)</button>
      <button type="button" (click)="example(-2, 0)">Cero trivial</button>
      <button type="button" (click)="example(0.5, 14.1347251417347)">
        Primer cero no trivial
      </button>
    </div>
    <div aria-live="polite">
      <p *ngIf="error" class="error">{{ error }}</p>
      <div *ngIf="value" class="result">
        <p>
          ζ({{ evaluatedAt }}) ≈ <strong>{{ formatted }}</strong>
        </p>
        <p>Módulo ≈ {{ modulus }} · Argumento: {{ argument }}</p>
      </div>
    </div>
    <p class="note">
      Aproximación en doble precisión mediante Euler–Maclaurin y la ecuación
      funcional. Se muestran 9 cifras significativas orientativas; cerca de los
      ceros puede quedar un residuo numérico. Los valores extremos pueden
      superar los límites de cálculo o representación del navegador.
    </p>
  </section>`,
})
export class ZetaCalculatorComponent {
  re: number | null = 2;
  im: number | null = 0;
  value: ComplexValue | null = null;
  error = '';
  evaluatedAt = '';
  formatted = '';
  modulus = '';
  argument = '';
  constructor() {
    this.calculate();
  }
  example(re: number, im: number): void {
    this.re = re;
    this.im = im;
    this.calculate();
  }
  calculate(): void {
    this.value = null;
    this.error = '';
    try {
      if (this.re === null || this.im === null)
        throw new Error('Completa las dos partes de s.');
      const z = riemannZeta(this.re, this.im);
      this.evaluatedAt = formatComplex({ re: this.re, im: this.im });
      this.formatted = formatComplex(z);
      this.modulus = Math.hypot(z.re, z.im).toPrecision(9);
      this.argument =
        z.re === 0 && z.im === 0
          ? 'no definido en un cero'
          : `${Math.atan2(z.im, z.re).toPrecision(9)} rad`;
      this.value = z;
    } catch (e) {
      this.error = (e as Error).message;
    }
  }
}
