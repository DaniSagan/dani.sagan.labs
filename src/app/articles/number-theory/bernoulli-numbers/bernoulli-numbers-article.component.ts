import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { BernoulliCalculatorComponent } from '../../../widgets/bernoulli-calculator/bernoulli-calculator.component';

@Component({
  selector: 'app-bernoulli-numbers-article', standalone: true,
  imports: [FormulaComponent, BernoulliCalculatorComponent, RouterLink],
  templateUrl: './bernoulli-numbers-article.component.html'
})
export class BernoulliNumbersArticleComponent {
  static title = 'Números de Bernoulli';
  static route = 'bernoulli-numbers';
}
