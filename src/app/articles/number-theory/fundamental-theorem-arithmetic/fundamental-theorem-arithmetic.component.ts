import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';

@Component({
  selector: 'app-fundamental-theorem-arithmetic',
  standalone: true,
  imports: [FormulaComponent, RouterLink],
  templateUrl: './fundamental-theorem-arithmetic.component.html',
  styleUrl: './fundamental-theorem-arithmetic.component.css'
})
export class FundamentalTheoremArithmeticComponent {
  static title = 'Teorema fundamental de la aritmética'; static route = 'fundamental-theorem-arithmetic';
}
