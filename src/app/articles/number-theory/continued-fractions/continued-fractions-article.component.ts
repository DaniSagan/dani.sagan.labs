import { Component } from '@angular/core';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { ContinuedFractionsExplorerComponent } from '../../../widgets/continued-fractions/continued-fractions-explorer.component';
import { EuclideanSquaresComponent } from '../../../widgets/continued-fractions/euclidean-squares.component';

@Component({
  selector: 'app-continued-fractions-article',
  standalone: true,
  imports: [FormulaComponent, ContinuedFractionsExplorerComponent, EuclideanSquaresComponent],
  templateUrl: './continued-fractions-article.component.html'
})
export class ContinuedFractionsArticleComponent {
  static title = 'Fracciones continuas';
  static route = 'continued-fractions';
}
