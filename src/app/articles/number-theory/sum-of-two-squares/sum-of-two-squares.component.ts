import { Component } from '@angular/core';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';

@Component({
  selector: 'app-sum-of-two-squares',
  standalone: true,
  imports: [FormulaComponent],
  templateUrl: './sum-of-two-squares.component.html',
  styleUrl: './sum-of-two-squares.component.css'
})
export class SumOfTwoSquaresComponent {
  static title = 'Teorema de Fermat sobre dos cuadrados'; static route = 'sum-of-two-squares';
}
