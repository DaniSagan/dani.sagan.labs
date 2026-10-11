import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { DeepExplorerComponent } from '../../shared/deep-explorer.component';
@Component({
  selector: 'app-numerical-conditioning-article', standalone: true,
  imports: [...LEARNING_IMPORTS, DeepExplorerComponent],
  templateUrl: './numerical-conditioning-article.component.html',
  styleUrls: ['../../shared/learning-article.css']
})
export class NumericalConditioningArticleComponent {
  static readonly title = "Error numérico, cancelación y condicionamiento";
  static readonly route = "numerical-conditioning";
}
