import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { DeepExplorerComponent } from '../../shared/deep-explorer.component';
@Component({
  selector: 'app-covariance-article', standalone: true,
  imports: [...LEARNING_IMPORTS, DeepExplorerComponent],
  templateUrl: './covariance-article.component.html',
  styleUrls: ['../../shared/learning-article.css']
})
export class CovarianceArticleComponent {
  static readonly title = "Covarianza, dependencia y varianza de una suma";
  static readonly route = "covariance";
}
