import { Component } from '@angular/core';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';

@Component({
  selector: 'app-chinese-remainder-theorem',
  standalone: true,
  imports: [FormulaComponent],
  templateUrl: './chinese-remainder-theorem.component.html',
  styleUrl: './chinese-remainder-theorem.component.css'
})
export class ChineseRemainderTheoremComponent {
  static title = 'Teorema chino del resto'; static route = 'chinese-remainder-theorem';
}
