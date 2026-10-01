import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { GrahamLabComponent } from '../../../widgets/graham/graham-lab.component';
import { GrahamDigitsComponent } from '../../../widgets/graham/graham-digits.component';

@Component({
  selector: 'app-graham-number-article',
  standalone: true,
  imports: [
    RouterLink,
    FormulaComponent,
    GrahamLabComponent,
    GrahamDigitsComponent,
  ],
  templateUrl: './graham-number-article.component.html',
  styleUrls: [
    '../../number-theory/gcd-euclid/gcd-euclid-article.component.css',
    './graham-number-article.component.css',
  ],
})
export class GrahamNumberArticleComponent {
  static title = 'El número de Graham: del problema a las flechas';
  static route = 'graham-number';
  allRed = false;
}
