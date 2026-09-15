import { Component } from '@angular/core';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { BuffonExplorerComponent } from '../../../widgets/buffon-needle/buffon-explorer.component';

@Component({
  selector: 'app-buffon-needle-article', standalone: true,
  imports: [FormulaComponent, BuffonExplorerComponent],
  templateUrl: './buffon-needle-article.component.html'
})
export class BuffonNeedleArticleComponent {
  static title = 'La aguja de Buffon';
  static route = 'buffon-needle';
}
