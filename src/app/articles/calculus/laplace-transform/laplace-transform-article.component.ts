import { Component } from '@angular/core';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { LaplaceConvergenceComponent } from '../../../widgets/laplace/laplace-convergence.component';
import { LaplacePolesComponent } from '../../../widgets/laplace/laplace-poles.component';
import { LaplaceConvolutionComponent } from '../../../widgets/laplace/laplace-convolution.component';

@Component({
  selector: 'app-laplace-transform-article',
  standalone: true,
  imports: [
    FormulaComponent,
    LaplaceConvergenceComponent,
    LaplacePolesComponent,
    LaplaceConvolutionComponent,
  ],
  templateUrl: './laplace-transform-article.component.html',
  styleUrls: ['./laplace-transform-article.component.scss'],
})
export class LaplaceTransformArticleComponent {
  static title = 'La transformada de Laplace';
  static route = 'laplace-transform';
}
