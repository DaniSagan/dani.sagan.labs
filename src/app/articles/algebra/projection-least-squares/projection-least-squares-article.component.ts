import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { DeepExplorerComponent } from '../../shared/deep-explorer.component';
@Component({
  selector: 'app-projection-least-squares-article', standalone: true,
  imports: [...LEARNING_IMPORTS, DeepExplorerComponent],
  templateUrl: './projection-least-squares-article.component.html',
  styleUrls: ['../../shared/learning-article.css']
})
export class ProjectionLeastSquaresArticleComponent {
  static readonly title = "Proyecciones ortogonales y mínimos cuadrados";
  static readonly route = "projection-least-squares";
}
