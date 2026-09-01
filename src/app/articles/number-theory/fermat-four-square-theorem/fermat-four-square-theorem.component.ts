import { Component } from '@angular/core';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';

@Component({
  selector: 'app-fermat-four-square-theorem',
  standalone: true,
  imports: [FormulaComponent],
  templateUrl: './fermat-four-square-theorem.component.html',
  styleUrl: './fermat-four-square-theorem.component.css'
})
export class FermatFourSquareTheoremComponent {
  static title = 'Teorema de los cuatro cuadrados de Lagrange'; static route = 'fermat-four-square-theorem';
}
