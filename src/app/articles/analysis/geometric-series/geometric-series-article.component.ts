import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { DeepExplorerComponent } from '../../shared/deep-explorer.component';
@Component({
  selector: 'app-geometric-series-article', standalone: true,
  imports: [...LEARNING_IMPORTS, DeepExplorerComponent],
  templateUrl: './geometric-series-article.component.html',
  styleUrls: ['../../shared/learning-article.css']
})
export class GeometricSeriesArticleComponent {
  static readonly title = "Progresiones y series geométricas";
  static readonly route = "geometric-series";
}
