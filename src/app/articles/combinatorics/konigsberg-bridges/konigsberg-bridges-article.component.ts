import { Component } from '@angular/core';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { KonigsbergExplorerComponent } from '../../../widgets/konigsberg/konigsberg-explorer.component';

@Component({
  selector: 'app-konigsberg-bridges-article', standalone: true,
  imports: [FormulaComponent, KonigsbergExplorerComponent],
  templateUrl: './konigsberg-bridges-article.component.html',
  styleUrl: './konigsberg-bridges-article.component.css'
})
export class KonigsbergBridgesArticleComponent {
  static title = 'Los puentes de Königsberg';
  static route = 'konigsberg-bridges';
}
