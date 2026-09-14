import { Component } from '@angular/core';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { ComplexExponentialComponent } from '../../../widgets/imaginary-power/complex-exponential.component';
import { ImaginaryPowerBranchesComponent } from '../../../widgets/imaginary-power/imaginary-power-branches.component';

@Component({
  selector: 'app-imaginary-power-article', standalone: true,
  imports: [FormulaComponent, ComplexExponentialComponent, ImaginaryPowerBranchesComponent],
  templateUrl: './imaginary-power-article.component.html'
})
export class ImaginaryPowerArticleComponent {
  static title = '¿Por qué iⁱ es real?';
  static route = 'imaginary-power';
}
