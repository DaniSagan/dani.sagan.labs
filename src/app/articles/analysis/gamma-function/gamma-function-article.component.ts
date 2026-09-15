import { Component } from '@angular/core';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { GammaExplorerComponent } from '../../../widgets/gamma-explorer/gamma-explorer.component';

@Component({
  selector: 'app-gamma-function-article', standalone: true,
  imports: [FormulaComponent, GammaExplorerComponent],
  templateUrl: './gamma-function-article.component.html'
})
export class GammaFunctionArticleComponent {
  static title = 'Función gamma';
  static route = 'gamma-function';
}
