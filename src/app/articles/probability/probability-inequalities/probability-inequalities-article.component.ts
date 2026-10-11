import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { DeepExplorerComponent } from '../../shared/deep-explorer.component';
@Component({
  selector: 'app-probability-inequalities-article', standalone: true,
  imports: [...LEARNING_IMPORTS, DeepExplorerComponent],
  templateUrl: './probability-inequalities-article.component.html',
  styleUrls: ['../../shared/learning-article.css']
})
export class ProbabilityInequalitiesArticleComponent {
  static readonly title = "Desigualdades de Markov y Chebyshev";
  static readonly route = "probability-inequalities";
}
