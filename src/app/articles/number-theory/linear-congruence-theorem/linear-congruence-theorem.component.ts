import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';

@Component({
  selector: 'app-linear-congruence-theorem',
  standalone: true,
  imports: [FormulaComponent, RouterLink],
  templateUrl: './linear-congruence-theorem.component.html',
  styleUrl: './linear-congruence-theorem.component.css'
})
export class LinearCongruenceTheoremComponent {
  static title = 'Teorema de la congruencia lineal'; static route = 'linear-congruence-theorem';
}
