import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { AmicableExplorerComponent } from '../../../widgets/amicable-numbers/amicable-explorer.component';
import { AmicableSearchComponent } from '../../../widgets/amicable-numbers/amicable-search.component';

@Component({
  selector: 'app-amicable-numbers-article', standalone: true,
  imports: [FormulaComponent, RouterLink, AmicableExplorerComponent, AmicableSearchComponent],
  templateUrl: './amicable-numbers-article.component.html'
})
export class AmicableNumbersArticleComponent {
  static title = 'Números amigos';
  static route = 'amicable-numbers';
}
