import { Component } from '@angular/core';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';

@Component({
  selector: 'app-euclid-euler-perfect-numbers',
  standalone: true,
  imports: [FormulaComponent],
  templateUrl: './euclid-euler-perfect-numbers.component.html',
  styleUrl: './euclid-euler-perfect-numbers.component.css'
})
export class EuclidEulerPerfectNumbersComponent {
  static title = 'Teorema de Euclides–Euler'; static route = 'euclid-euler-perfect-numbers';
}
