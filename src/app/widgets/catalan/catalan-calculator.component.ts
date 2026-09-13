import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { catalanSequence } from '../../shared/math/catalan';

@Component({
  selector: 'app-catalan-calculator', standalone: true, imports: [CommonModule, FormsModule],
  styleUrl: './catalan-widgets.css',
  template: `
    <section class="widget" aria-labelledby="catalan-calculator-title">
      <h3 id="catalan-calculator-title">Calculadora de números de Catalan</h3>
      <form (ngSubmit)="calculate()"><label for="catalan-index">Índice n (0–1000)</label>
        <div class="controls"><input id="catalan-index" name="n" type="number" min="0" max="1000" step="1" required [(ngModel)]="input">
          <button type="submit">Calcular Cₙ</button></div></form>
      <div class="controls"><button type="button" *ngFor="let value of [0, 3, 10, 100, 1000]" (click)="example(value)">n = {{ value }}</button></div>
      <div aria-live="polite"><p class="error" *ngIf="error">{{ error }}</p>
        <p class="result" *ngIf="result">C<sub>{{ n }}</sub> = <strong>{{ result }}</strong></p></div>
      <p class="note">Enteros exactos, sin redondeo. Se admite hasta C₁₀₀₀; el índice cuenta pares de paréntesis, no caracteres.</p>
      <details *ngIf="rows.length"><summary>Ver la sucesión calculada</summary>
        <div class="table-scroll" tabindex="0" role="region" aria-label="Tabla de números de Catalan"><table>
          <caption>De C₀ a C{{ n }}</caption><thead><tr><th scope="col">n</th><th scope="col">Cₙ</th></tr></thead>
          <tbody><tr *ngFor="let row of rows"><th scope="row">{{ row.index }}</th><td>{{ row.value }}</td></tr></tbody>
        </table></div></details>
    </section>`
})
export class CatalanCalculatorComponent {
  input: number | null = 10; n = 10; result = ''; error = '';
  rows: { index: number; value: string }[] = [];
  constructor() { this.calculate(); }
  example(n: number): void { this.input = n; this.calculate(); }
  calculate(): void {
    this.error = ''; this.result = ''; this.rows = [];
    try {
      if (this.input === null) throw new Error('Introduce el índice n.');
      const values = catalanSequence(this.input);
      this.n = this.input; this.result = values[this.n].toString();
      this.rows = values.map((value, index) => ({ index, value: value.toString() }));
    } catch (error) { this.error = (error as Error).message; }
  }
}
