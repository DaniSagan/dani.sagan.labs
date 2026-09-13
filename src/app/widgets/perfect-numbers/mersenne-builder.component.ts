import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { mersenneConstruction } from '../../shared/math/perfect-numbers';

@Component({
  selector: 'app-mersenne-builder', standalone: true, imports: [CommonModule, FormsModule],
  styleUrl: './perfect-numbers-widgets.css',
  template: `
    <section class="widget" aria-labelledby="mersenne-title">
      <h3 id="mersenne-title">Construir un perfecto par</h3>
      <label for="mersenne-p">Exponente p</label>
      <select id="mersenne-p" [(ngModel)]="p" (ngModelChange)="update()">
        <option *ngFor="let exponent of exponents" [ngValue]="exponent">{{ exponent }}</option>
      </select>
      <div class="construction" aria-live="polite">
        <p>2<sup>{{ p }}</sup> − 1 = <strong>{{ result.mersenne }}</strong></p>
        <p *ngIf="result.factor === null">Es primo: la construcción produce un número perfecto.</p>
        <p *ngIf="result.factor !== null">Es compuesto: {{ result.mersenne }} = {{ result.factor }} × {{ cofactor }}.
          El candidato no es perfecto.</p>
        <p>N = 2<sup>{{ p - 1 }}</sup> × {{ result.mersenne }} = <strong>{{ candidate }}</strong></p>
      </div>
      <h4>La construcción en binario</h4>
      <p>Multiplicar por 2<sup>{{ p - 1 }}</sup> desplaza los {{ p }} unos de 2<sup>{{ p }}</sup> − 1 y añade {{ p - 1 }} ceros.</p>
      <div class="bits" role="img" [attr.aria-label]="'Candidato en binario: ' + p + ' unos seguidos de ' + (p - 1) + ' ceros'">
        <span *ngFor="let bit of ones" class="one">1</span><span *ngFor="let bit of zeros" class="zero">0</span>
      </div>
      <p class="note">Este patrón binario solo da un número perfecto cuando 2ᵖ − 1 es primo.
        Prueba p = 11: que p sea primo no basta. Los resultados se muestran como enteros exactos.</p>
    </section>`
})
export class MersenneBuilderComponent {
  p = 5;
  readonly exponents = Array.from({ length: 30 }, (_, i) => i + 2);
  result = mersenneConstruction(this.p);
  get candidate(): string { return this.result.candidate.toString(); }
  get cofactor(): number { return this.result.factor === null ? 1 : this.result.mersenne / this.result.factor; }
  get ones(): number[] { return Array.from({ length: this.p }, (_, i) => i); }
  get zeros(): number[] { return Array.from({ length: this.p - 1 }, (_, i) => i); }
  update(): void { this.result = mersenneConstruction(this.p); }
}
