import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { MontyHallComponent } from '../../../widgets/monty-hall/monty-hall.component';
@Component({
  selector: 'app-monty-hall-article', standalone: true,
  imports: [FormulaComponent, RouterLink, MontyHallComponent],
  templateUrl: './monty-hall-article.component.html'
})
export class MontyHallArticleComponent {
  static title = 'Problema de Monty Hall';
  static route = 'monty-hall';
}
