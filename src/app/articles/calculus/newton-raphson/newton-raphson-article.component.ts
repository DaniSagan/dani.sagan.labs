import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { NewtonTangentComponent } from '../../../widgets/newton-raphson/newton-tangent.component';
import { NewtonConvergenceComponent } from '../../../widgets/newton-raphson/newton-convergence.component';
import { NewtonBasinsComponent } from '../../../widgets/newton-raphson/newton-basins.component';

@Component({
  selector: 'app-newton-raphson-article', standalone: true,
  imports: [RouterLink, FormulaComponent, NewtonTangentComponent, NewtonConvergenceComponent, NewtonBasinsComponent],
  templateUrl: './newton-raphson-article.component.html'
})
export class NewtonRaphsonArticleComponent {
  static title = 'Método de Newton–Raphson';
  static route = 'newton-raphson';
}
