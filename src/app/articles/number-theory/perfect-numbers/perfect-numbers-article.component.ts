import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { DivisorBalanceComponent } from '../../../widgets/perfect-numbers/divisor-balance.component';
import { MersenneBuilderComponent } from '../../../widgets/perfect-numbers/mersenne-builder.component';

@Component({
  selector: 'app-perfect-numbers-article', standalone: true,
  imports: [FormulaComponent, RouterLink, DivisorBalanceComponent, MersenneBuilderComponent],
  templateUrl: './perfect-numbers-article.component.html'
})
export class PerfectNumbersArticleComponent {
  static title = 'Números perfectos';
  static route = 'perfect-numbers';
}
