import { Component } from '@angular/core';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';

@Component({
  selector: 'app-linear-congruence-theorem',
  standalone: true,
  imports: [FormulaComponent],
  templateUrl: './linear-congruence-theorem.component.html',
  styleUrl: './linear-congruence-theorem.component.css'
})
export class LinearCongruenceTheoremComponent {
  static title = 'Teorema de la congruencia lineal'; static route = 'linear-congruence-theorem';
}
