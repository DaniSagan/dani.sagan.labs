import { Component } from '@angular/core';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { PascalExplorerComponent } from '../../../widgets/pascal-triangle/pascal-explorer.component';
import { PascalProbabilityComponent } from '../../../widgets/pascal-triangle/pascal-probability.component';

@Component({
  selector: 'app-pascal-triangle-article', standalone: true,
  imports: [FormulaComponent, PascalExplorerComponent, PascalProbabilityComponent],
  templateUrl: './pascal-triangle-article.component.html'
})
export class PascalTriangleArticleComponent {
  static title = 'Triángulo de Pascal';
  static route = 'pascal-triangle';
}
