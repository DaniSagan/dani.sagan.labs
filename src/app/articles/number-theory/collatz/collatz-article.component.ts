import { RouterLink } from '@angular/router';
import { Component } from '@angular/core';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { CollatzExplorerComponent } from '../../../widgets/collatz-explorer/collatz-explorer.component';

@Component({
  selector: 'app-collatz-article', standalone: true, imports: [RouterLink, FormulaComponent, CollatzExplorerComponent],
  templateUrl: './collatz-article.component.html'
})
export class CollatzArticleComponent {
  static title = 'La conjetura de Collatz';
  static route = 'collatz';
}
