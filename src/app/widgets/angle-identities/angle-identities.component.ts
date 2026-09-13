import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormulaComponent } from '../../shared/math/formula/formula.component';
import { angleValues, multipleAnglePolynomials } from '../../shared/math/angle-identities';

@Component({
  selector: 'app-angle-identities', standalone: true, imports: [CommonModule, FormsModule, FormulaComponent],
  templateUrl: './angle-identities.component.html', styleUrl: './angle-identities.component.css'
})
export class AngleIdentitiesComponent {
  degrees = 30; order = 2; mode = 'multiple';
  readonly orders = [2, 3, 4, 5, 6, 7, 8];
  get targetAngle(): number { return this.mode === 'half' ? this.degrees / 2 : this.degrees * this.order; }
  get base(): ReturnType<typeof angleValues> { return angleValues(this.degrees); }
  get target(): ReturnType<typeof angleValues> { return angleValues(this.targetAngle); }
  get sineFormula(): string { return String.raw`\sin(${this.order}\theta)=${multipleAnglePolynomials(this.order).sine}`; }
  get cosineFormula(): string { return String.raw`\cos(${this.order}\theta)=${multipleAnglePolynomials(this.order).cosine}`; }
  get tangentFormula(): string {
    const p = multipleAnglePolynomials(this.order);
    return String.raw`\tan(${this.order}\theta)=\frac{${p.sine}}{${p.cosine}}`;
  }
  format(value: number | null): string { return value === null ? 'No definida (coseno = 0)' : (Math.abs(value) < 1e-12 ? 0 : value).toFixed(6); }
  x(value: number): number { return 180 + 130 * value; }
  y(value: number): number { return 180 - 130 * value; }
}
