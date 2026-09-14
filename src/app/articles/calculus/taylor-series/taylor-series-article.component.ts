import { Component } from '@angular/core';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { TaylorExplorerComponent } from '../../../widgets/taylor-series/taylor-explorer.component';
import { TaylorConvergenceComponent } from '../../../widgets/taylor-series/taylor-convergence.component';

@Component({
  selector: 'app-taylor-series-article', standalone: true,
  imports: [FormulaComponent, TaylorExplorerComponent, TaylorConvergenceComponent],
  templateUrl: './taylor-series-article.component.html'
})
export class TaylorSeriesArticleComponent {
  static title = 'Series de Taylor';
  static route = 'taylor-series';
}
