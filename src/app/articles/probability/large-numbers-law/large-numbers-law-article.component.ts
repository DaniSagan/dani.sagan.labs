import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { DeepExplorerComponent } from '../../shared/deep-explorer.component';
@Component({
  selector: 'app-large-numbers-law-article', standalone: true,
  imports: [...LEARNING_IMPORTS, DeepExplorerComponent],
  templateUrl: './large-numbers-law-article.component.html',
  styleUrls: ['../../shared/learning-article.css']
})
export class LargeNumbersLawArticleComponent {
  static readonly title = "Ley de los grandes números";
  static readonly route = "large-numbers-law";
}
