import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { DeepExplorerComponent } from '../../shared/deep-explorer.component';
@Component({
  selector: 'app-inclusion-exclusion-article', standalone: true,
  imports: [...LEARNING_IMPORTS, DeepExplorerComponent],
  templateUrl: './inclusion-exclusion-article.component.html',
  styleUrls: ['../../shared/learning-article.css']
})
export class InclusionExclusionArticleComponent {
  static readonly title = "Principio de inclusión y exclusión";
  static readonly route = "inclusion-exclusion";
}
