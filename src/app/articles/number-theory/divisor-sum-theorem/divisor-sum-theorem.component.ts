import { Component } from '@angular/core';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';

@Component({
  selector: 'app-divisor-sum-theorem',
  standalone: true,
  imports: [FormulaComponent],
  templateUrl: './divisor-sum-theorem.component.html',
  styleUrl: './divisor-sum-theorem.component.css'
})
export class DivisorSumTheoremComponent {
  static title = 'Fórmulas para divisores y suma de divisores'; static route = 'divisor-sum-theorem';
}
