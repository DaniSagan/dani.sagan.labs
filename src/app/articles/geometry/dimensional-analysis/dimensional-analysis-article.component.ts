import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { DeepExplorerComponent } from '../../shared/deep-explorer.component';
@Component({
  selector: 'app-dimensional-analysis-article', standalone: true,
  imports: [...LEARNING_IMPORTS, DeepExplorerComponent],
  templateUrl: './dimensional-analysis-article.component.html',
  styleUrls: ['../../shared/learning-article.css']
})
export class DimensionalAnalysisArticleComponent {
  static readonly title = "Análisis dimensional y leyes de escala";
  static readonly route = "dimensional-analysis";
}
