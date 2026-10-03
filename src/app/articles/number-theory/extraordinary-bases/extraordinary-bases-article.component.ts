import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { BasesLabComponent } from '../../../widgets/extraordinary-bases/bases-lab.component';

@Component({
  selector: 'app-extraordinary-bases-article',
  standalone: true,
  imports: [RouterLink, FormulaComponent, BasesLabComponent],
  templateUrl: './extraordinary-bases-article.component.html',
  styleUrls: ['../gcd-euclid/gcd-euclid-article.component.css'],
})
export class ExtraordinaryBasesArticleComponent {
  static title = 'Más allá de la base 10: otros lenguajes para los números';
  static route = 'extraordinary-bases';
}
