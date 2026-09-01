import { Component } from '@angular/core';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';

@Component({
  selector: 'app-fundamental-theorem-arithmetic',
  standalone: true,
  imports: [FormulaComponent],
  templateUrl: './fundamental-theorem-arithmetic.component.html',
  styleUrl: './fundamental-theorem-arithmetic.component.css'
})
export class FundamentalTheoremArithmeticComponent {
  static title = 'Teorema fundamental de la aritmética'; static route = 'fundamental-theorem-arithmetic';
}
