import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { DeepExplorerComponent } from '../../shared/deep-explorer.component';
@Component({
  selector: 'app-causal-inference-article', standalone: true,
  imports: [...LEARNING_IMPORTS, DeepExplorerComponent],
  templateUrl: './causal-inference-article.component.html',
  styleUrls: ['../../shared/learning-article.css']
})
export class CausalInferenceArticleComponent {
  static readonly title = "Causalidad, confusión y experimentos aleatorizados";
  static readonly route = "causal-inference";
}
