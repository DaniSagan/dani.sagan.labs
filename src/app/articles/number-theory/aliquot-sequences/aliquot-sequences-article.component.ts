import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { AliquotExplorerComponent } from '../../../widgets/aliquot-explorer/aliquot-explorer.component';

@Component({
  selector: 'app-aliquot-sequences-article', standalone: true,
  imports: [FormulaComponent, RouterLink, AliquotExplorerComponent],
  templateUrl: './aliquot-sequences-article.component.html'
})
export class AliquotSequencesArticleComponent {
  static title = 'Sucesiones alícuotas';
  static route = 'aliquot-sequences';
}
