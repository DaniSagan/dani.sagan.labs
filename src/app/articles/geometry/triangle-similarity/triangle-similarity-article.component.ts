import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { DeepExplorerComponent } from '../../shared/deep-explorer.component';
@Component({
  selector: 'app-triangle-similarity-article', standalone: true,
  imports: [...LEARNING_IMPORTS, DeepExplorerComponent],
  templateUrl: './triangle-similarity-article.component.html',
  styleUrls: ['../../shared/learning-article.css']
})
export class TriangleSimilarityArticleComponent {
  static readonly title = "Semejanza de triángulos y proporcionalidad";
  static readonly route = "triangle-similarity";
}
