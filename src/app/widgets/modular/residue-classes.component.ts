import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { parseInteger } from '../euclid/euclid.math';
import { modulo } from './modular.math';

@Component({
  selector: 'app-residue-classes',
  standalone: true,
  imports: [FormsModule],
  template: ` <div class="widget" aria-labelledby="residue-title">
    <span class="eyebrow">EXPLORADOR · INFINITOS NOMBRES, UNA CLASE</span>
    <h3 id="residue-title">Agrupa enteros por su resto</h3>
    <div class="controls">
      <label for="residue-n"
        >Módulo n (1–12)<input
          id="residue-n"
          type="number"
          min="1"
          max="12"
          step="1"
          [(ngModel)]="n"
          (ngModelChange)="update()"
      /></label>
      <label for="residue-a"
        >Entero a (hasta 18 cifras)<input
          id="residue-a"
          type="text"
          maxlength="20"
          [(ngModel)]="aText"
          (ngModelChange)="update()"
      /></label>
    </div>
    @if (error) {
      <p role="alert" class="error">{{ error }}</p>
    } @else {
      <p class="result" aria-live="polite">
        {{ a }} = {{ n }} × ({{ quotient }}) + {{ residue }}. Por tanto [{{
          a
        }}]{{ subscript }} = [{{ residue }}]{{ subscript }}.
      </p>
      <div
        class="table-scroll"
        tabindex="0"
        role="region"
        aria-label="Clases y algunos de sus representantes"
      >
        <table>
          <caption>
            Cada fila continúa indefinidamente en ambos sentidos. Selecciona una
            clase.
          </caption>
          <thead>
            <tr>
              <th scope="col">Clase</th>
              <th scope="col">Algunos enteros que contiene</th>
            </tr>
          </thead>
          <tbody>
            @for (row of rows; track row.residue) {
              <tr [class.selected]="row.residue === residue">
                <th scope="row">
                  <button
                    type="button"
                    [attr.aria-pressed]="row.residue === residue"
                    (click)="select(row.residue)"
                  >
                    [{{ row.residue }}]{{ subscript }}
                  </button>
                </th>
                <td>…, {{ row.examples.join(', ') }}, …</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
      <p class="note">
        El entero introducido puede quedar fuera de esta ventana; sigue
        perteneciendo a la fila resaltada. Con n = 5 y a = −2, aparecen …, −12,
        −7, −2, 3, 8, 13, … en la misma clase.
      </p>
    }
  </div>`,
  styleUrl: './modular-widgets.css',
})
export class ResidueClassesComponent {
  n = 5;
  aText = '-2';
  a = -2n;
  residue = 3;
  quotient = -1n;
  error = '';
  get subscript(): string {
    return String(this.n).replace(
      /\d/g,
      (digit) => '₀₁₂₃₄₅₆₇₈₉'[Number(digit)],
    );
  }
  get rows() {
    return Array.from({ length: this.error ? 0 : this.n }, (_, residue) => ({
      residue,
      examples: [-3, -2, -1, 0, 1, 2].map((k) => residue + k * this.n),
    }));
  }
  update(): void {
    try {
      if (!Number.isInteger(this.n) || this.n < 1 || this.n > 12) {
        throw new RangeError('Elige un módulo entero entre 1 y 12.');
      }
      this.a = parseInteger(this.aText);
      this.residue = Number(modulo(this.a, BigInt(this.n)));
      this.quotient = (this.a - BigInt(this.residue)) / BigInt(this.n);
      this.error = '';
    } catch (error) {
      this.error = (error as Error).message;
    }
  }
  select(residue: number): void {
    this.aText = String(residue);
    this.update();
  }
}
