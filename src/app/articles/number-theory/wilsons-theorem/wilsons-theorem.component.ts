import { Component } from '@angular/core';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';

@Component({
  selector: 'app-wilsons-theorem',
  standalone: true,
  imports: [FormulaComponent],
  templateUrl: './wilsons-theorem.component.html',
  styleUrl: './wilsons-theorem.component.css'
})
export class WilsonsTheoremComponent {
  static title = 'Teorema de Wilson'; static route = 'wilsons-theorem';
}
