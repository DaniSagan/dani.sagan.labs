import { Component } from '@angular/core';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { BayesExplorerComponent } from '../../../widgets/bayes-explorer/bayes-explorer.component';

@Component({
  selector: 'app-bayes-theorem-article', standalone: true,
  imports: [FormulaComponent, BayesExplorerComponent],
  templateUrl: './bayes-theorem-article.component.html'
})
export class BayesTheoremArticleComponent {
  static title = 'Teorema de Bayes';
  static route = 'bayes-theorem';
}
