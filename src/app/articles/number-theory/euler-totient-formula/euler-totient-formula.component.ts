import { Component } from '@angular/core';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';

@Component({
  selector: 'app-euler-totient-formula',
  standalone: true,
  imports: [FormulaComponent],
  templateUrl: './euler-totient-formula.component.html',
  styleUrl: './euler-totient-formula.component.css'
})
export class EulerTotientFormulaComponent {
  static title = 'Fórmula del totiente de Euler'; static route = 'euler-totient-formula';
}
