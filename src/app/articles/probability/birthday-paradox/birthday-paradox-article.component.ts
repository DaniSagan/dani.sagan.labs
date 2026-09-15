import { Component } from '@angular/core';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { BirthdayExplorerComponent } from '../../../widgets/birthday-explorer/birthday-explorer.component';
@Component({
  selector: 'app-birthday-paradox-article', standalone: true,
  imports: [FormulaComponent, BirthdayExplorerComponent], templateUrl: './birthday-paradox-article.component.html'
})
export class BirthdayParadoxArticleComponent {
  static title = 'Paradoja del cumpleaños';
  static route = 'birthday-paradox';
}
