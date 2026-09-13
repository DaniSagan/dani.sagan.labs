import { Component } from '@angular/core';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { CatalanCalculatorComponent } from '../../../widgets/catalan/catalan-calculator.component';
import { DyckExplorerComponent } from '../../../widgets/catalan/dyck-explorer.component';

@Component({
  selector: 'app-catalan-numbers-article', standalone: true,
  imports: [FormulaComponent, CatalanCalculatorComponent, DyckExplorerComponent],
  templateUrl: './catalan-numbers-article.component.html'
})
export class CatalanNumbersArticleComponent {
  static title = 'Números de Catalan';
  static route = 'catalan-numbers';
}
