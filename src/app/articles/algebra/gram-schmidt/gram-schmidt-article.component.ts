import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { DeepExplorerComponent } from '../../shared/deep-explorer.component';
@Component({
  selector: 'app-gram-schmidt-article', standalone: true,
  imports: [...LEARNING_IMPORTS, DeepExplorerComponent],
  templateUrl: './gram-schmidt-article.component.html',
  styleUrls: ['../../shared/learning-article.css']
})
export class GramSchmidtArticleComponent {
  static readonly title = "Productos internos y ortonormalización de Gram–Schmidt";
  static readonly route = "gram-schmidt";
}
