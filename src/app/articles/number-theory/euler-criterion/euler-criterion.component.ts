import { Component } from '@angular/core';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';

@Component({
  selector: 'app-euler-criterion',
  standalone: true,
  imports: [FormulaComponent],
  templateUrl: './euler-criterion.component.html',
  styleUrl: './euler-criterion.component.css'
})
export class EulerCriterionComponent {
  static title = 'Criterio de Euler'; static route = 'euler-criterion';
}
