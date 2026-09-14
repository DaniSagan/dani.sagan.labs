import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { BinomialExplorerComponent } from '../../../widgets/binomial-theorem/binomial-explorer.component';
import { BinomialChoicesComponent } from '../../../widgets/binomial-theorem/binomial-choices.component';

@Component({
  selector: 'app-binomial-theorem-article', standalone: true,
  imports: [RouterModule, FormulaComponent, BinomialExplorerComponent, BinomialChoicesComponent],
  templateUrl: './binomial-theorem-article.component.html'
})
export class BinomialTheoremArticleComponent {
  static title = 'Teorema binomial';
  static route = 'binomial-theorem';
}
