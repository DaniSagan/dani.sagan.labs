import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { DeepExplorerComponent } from '../../shared/deep-explorer.component';
@Component({
  selector: 'app-positive-series-tests-article', standalone: true,
  imports: [...LEARNING_IMPORTS, DeepExplorerComponent],
  templateUrl: './positive-series-tests-article.component.html',
  styleUrls: ['../../shared/learning-article.css']
})
export class PositiveSeriesTestsArticleComponent {
  static readonly title = "Criterios de convergencia de series positivas";
  static readonly route = "positive-series-tests";
}
