import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { DeepExplorerComponent } from '../../shared/deep-explorer.component';
@Component({
  selector: 'app-linear-approximation-article', standalone: true,
  imports: [...LEARNING_IMPORTS, DeepExplorerComponent],
  templateUrl: './linear-approximation-article.component.html',
  styleUrls: ['../../shared/learning-article.css']
})
export class LinearApproximationArticleComponent {
  static readonly title = "Diferenciales y aproximación lineal";
  static readonly route = "linear-approximation";
}
