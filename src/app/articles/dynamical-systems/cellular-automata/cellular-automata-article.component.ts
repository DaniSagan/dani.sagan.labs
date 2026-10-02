import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { CellularAutomataLabComponent } from '../../../widgets/cellular-automata/cellular-automata-lab.component';

@Component({
  selector: 'app-cellular-automata-article',
  standalone: true,
  imports: [RouterLink, FormulaComponent, CellularAutomataLabComponent],
  templateUrl: './cellular-automata-article.component.html',
  styleUrl: '../../number-theory/gcd-euclid/gcd-euclid-article.component.css',
})
export class CellularAutomataArticleComponent {
  static title = 'Autómatas celulares y la Regla 30';
  static route = 'cellular-automata';
}
