import { Component } from '@angular/core';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { LambertWExplorerComponent } from '../../../widgets/lambert-w/lambert-w-explorer.component';
import { LambertEquationComponent } from '../../../widgets/lambert-w/lambert-equation.component';

@Component({
  selector: 'app-lambert-w-article', standalone: true,
  imports: [FormulaComponent, LambertWExplorerComponent, LambertEquationComponent],
  templateUrl: './lambert-w-article.component.html',
  styles: [':host { display:block; } .table-scroll { overflow-x:auto; } th,td { padding:.6rem; border-bottom:1px solid #68687e; }']
})
export class LambertWArticleComponent {
  static title = 'Función W de Lambert';
  static route = 'lambert-w';
}
