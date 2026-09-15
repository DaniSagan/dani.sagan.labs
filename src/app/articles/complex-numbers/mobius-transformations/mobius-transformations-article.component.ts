import { Component } from '@angular/core';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { MobiusExplorerComponent } from '../../../widgets/mobius-transformations/mobius-explorer.component';

@Component({
  selector: 'app-mobius-transformations-article', standalone: true,
  imports: [FormulaComponent, MobiusExplorerComponent],
  templateUrl: './mobius-transformations-article.component.html'
})
export class MobiusTransformationsArticleComponent {
  static title = 'Transformaciones de Möbius';
  static route = 'mobius-transformations';
}
