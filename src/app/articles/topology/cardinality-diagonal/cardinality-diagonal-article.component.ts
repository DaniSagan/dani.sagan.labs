import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { DeepExplorerComponent } from '../../shared/deep-explorer.component';
@Component({
  selector: 'app-cardinality-diagonal-article', standalone: true,
  imports: [...LEARNING_IMPORTS, DeepExplorerComponent],
  templateUrl: './cardinality-diagonal-article.component.html',
  styleUrls: ['../../shared/learning-article.css']
})
export class CardinalityDiagonalArticleComponent {
  static readonly title = "Cardinalidad y argumento diagonal";
  static readonly route = "cardinality-diagonal";
}
