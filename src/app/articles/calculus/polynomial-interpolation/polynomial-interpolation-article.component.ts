import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { DeepExplorerComponent } from '../../shared/deep-explorer.component';
@Component({
  selector: 'app-polynomial-interpolation-article', standalone: true,
  imports: [...LEARNING_IMPORTS, DeepExplorerComponent],
  templateUrl: './polynomial-interpolation-article.component.html',
  styleUrls: ['../../shared/learning-article.css']
})
export class PolynomialInterpolationArticleComponent {
  static readonly title = "Interpolación de Lagrange y Hermite";
  static readonly route = "polynomial-interpolation";
}
