import { Component } from '@angular/core';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { CubicLaboratoryComponent } from '../../../widgets/cubic/cubic-laboratory.component';

@Component({
  selector: 'app-cubic-equation-article', standalone: true,
  imports: [FormulaComponent, CubicLaboratoryComponent],
  templateUrl: './cubic-equation-article.component.html'
})
export class CubicEquationArticleComponent {
  static title = 'Resolución de la ecuación cúbica';
  static route = 'cubic-equation';
}
