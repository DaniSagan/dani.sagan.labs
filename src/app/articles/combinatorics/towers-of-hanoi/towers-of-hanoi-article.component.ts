import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
@Component({selector: 'app-towers-of-hanoi-article', standalone: true, imports: [RouterLink, FormulaComponent], templateUrl: './towers-of-hanoi-article.component.html', styleUrls: ['../../shared/learning-article.css']})
export class TowersOfHanoiArticleComponent {
  static title = 'Torres de Hanoi: el poder de la recursión';
  static route = 'towers-of-hanoi';
}
