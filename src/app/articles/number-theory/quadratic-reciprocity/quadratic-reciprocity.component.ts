import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';

@Component({
  selector: 'app-quadratic-reciprocity',
  standalone: true,
  imports: [FormulaComponent, RouterLink],
  templateUrl: './quadratic-reciprocity.component.html',
  styleUrl: './quadratic-reciprocity.component.css'
})
export class QuadraticReciprocityComponent {
  static title = 'Ley de reciprocidad cuadrática'; static route = 'quadratic-reciprocity';
}
