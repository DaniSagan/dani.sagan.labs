import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { DeepExplorerComponent } from '../../shared/deep-explorer.component';
@Component({
  selector: 'app-lhopital-rule-article', standalone: true,
  imports: [...LEARNING_IMPORTS, DeepExplorerComponent],
  templateUrl: './lhopital-rule-article.component.html',
  styleUrls: ['../../shared/learning-article.css']
})
export class LhopitalRuleArticleComponent {
  static readonly title = "Regla de L’Hôpital y formas indeterminadas";
  static readonly route = "lhopital-rule";
}
