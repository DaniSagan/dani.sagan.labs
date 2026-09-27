import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { EuclideanSquaresComponent } from '../../../widgets/continued-fractions/euclidean-squares.component';
import { EuclidExplorerComponent } from '../../../widgets/euclid/euclid-explorer.component';
import { GcdInvarianceComponent } from '../../../widgets/euclid/gcd-invariance.component';
import { EuclidExercisesComponent } from '../../../widgets/euclid/euclid-exercises.component';

@Component({
  selector: 'app-gcd-euclid-article', standalone: true,
  imports: [RouterLink, FormulaComponent, EuclideanSquaresComponent, EuclidExplorerComponent,
    GcdInvarianceComponent, EuclidExercisesComponent],
  templateUrl: './gcd-euclid-article.component.html',
  styleUrl: './gcd-euclid-article.component.css'
})
export class GcdEuclidArticleComponent {
  static title = 'Máximo común divisor (MCD) y algoritmo de Euclides';
  static route = 'gcd-euclid';
}
